import * as mssql from 'mssql';
import { ISessionStore, SessionState } from '../domain/session-store';
import { logger } from './logger';

export class SqlServerSessionStore implements ISessionStore {
    private poolPromise: Promise<mssql.ConnectionPool>;

    constructor(connectionString: string) {
        // Fallback to pure connection string with default tedious driver.
        // Requires TCP/IP enabled on SQL configuration manager, and SQL Authentication (user/password/sa) instead of Windows Auth.
        this.poolPromise = new mssql.ConnectionPool(connectionString)
            .connect()
            .then(pool => {
                logger.info('Connected to SQL Server');
                return pool;
            })
            .catch(err => {
                logger.error({
                    err,
                    message: "Database connection failed. Please ensure: 1) TCP/IP is ENABLED in SQL Server Config Manager. 2) You are using Standard SQL Authentication (e.g. User Id=sa;Password=...) in the .env string rather than Windows Authentication, which requires native drivers."
                }, 'Database connection failed');
                throw err;
            });
    }

    async get(sessionId: string): Promise<SessionState | null> {
        try {
            const pool = await this.poolPromise;
            const result = await pool.request()
                .input('sessionId', mssql.NVarChar(100), sessionId)
                .query(`
                    SELECT session_id, slots_json, updated_at
                    FROM dbo.sessions
                    WHERE session_id = @sessionId
                `);

            if (result.recordset.length === 0) {
                return null;
            }

            const record = result.recordset[0];
            return {
                slots: JSON.parse(record.slots_json),
                updatedAt: new Date(record.updated_at).toISOString()
            };
        } catch (err) {
            logger.error({ err, sessionId }, 'Error getting session from SQL Server');
            return null; // Resolve to null or throw, depending on fault tolerance design
        }
    }

    async save(sessionId: string, state: SessionState): Promise<void> {
        try {
            const pool = await this.poolPromise;
            const slotsJson = JSON.stringify(state.slots);

            await pool.request()
                .input('sessionId', mssql.NVarChar(100), sessionId)
                .input('slotsJson', mssql.NVarChar(mssql.MAX), slotsJson)
                // Use the provided updateAt or let the DB handle with GETDATE()
                .query(`
                    MERGE dbo.sessions AS Target
                    USING (VALUES (@sessionId, @slotsJson, GETDATE())) AS Source (session_id, slots_json, updated_at)
                    ON Target.session_id = Source.session_id
                    WHEN MATCHED THEN
                        UPDATE SET 
                            slots_json = Source.slots_json,
                            updated_at = Source.updated_at
                    WHEN NOT MATCHED THEN
                        INSERT (session_id, slots_json, updated_at)
                        VALUES (Source.session_id, Source.slots_json, Source.updated_at);
                `);
        } catch (err) {
            logger.error({ err, sessionId }, 'Error saving session to SQL Server');
            throw err;
        }
    }
}
