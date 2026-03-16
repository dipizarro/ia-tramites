Sprint 3 — SQL Server Session Store + Debug + Ruleset Version
Objetivo

Reemplazar InMemorySessionStore por SqlServerSessionStore usando el driver mssql, con:

Tabla sessions

CRUD mínimo: get(sessionId), save(sessionId, slots)

Endpoint GET /debug/session/:id

Incluir ruleset_version en cada respuesta /chat

1) Script SQL (DEV y PROD)

Ejecuta esto en tu SQL Server (DB formaliza_bot por ejemplo):

CREATE TABLE dbo.sessions (
  session_id   NVARCHAR(100) NOT NULL PRIMARY KEY,
  slots_json   NVARCHAR(MAX) NOT NULL,
  updated_at   DATETIME2(0) NOT NULL
);

CREATE INDEX IX_sessions_updated_at ON dbo.sessions(updated_at);

slots_json lo guardamos como texto JSON por simplicidad y compatibilidad (Azure SQL también lo soporta perfecto).

2) Variables de entorno

Crea un .env (o config.ts) con 2 strings:

Opción A: Connection string única

SQLSERVER_CONNECTION_STRING=...

Ejemplo local típico:

SQLSERVER_CONNECTION_STRING=Server=localhost;Database=formaliza_bot;Trusted_Connection=True;TrustServerCertificate=True;

Si usas instancia con nombre:
Server=localhost\SQLEXPRESS;...

Azure SQL (cuando llegue el momento)
SQLSERVER_CONNECTION_STRING=Server=tcp:<tu-server>.database.windows.net,1433;Database=<tu-db>;User