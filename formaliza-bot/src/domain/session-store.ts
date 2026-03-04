export interface SessionState {
    slots: Record<string, any>;
    updatedAt: string;
}

export interface ISessionStore {
    get(sessionId: string): Promise<SessionState | null>;
    save(sessionId: string, state: SessionState): Promise<void>;
}

export class InMemorySessionStore implements ISessionStore {
    private store = new Map<string, SessionState>();

    async get(sessionId: string): Promise<SessionState | null> {
        return this.store.get(sessionId) || null;
    }

    async save(sessionId: string, state: SessionState): Promise<void> {
        this.store.set(sessionId, state);
    }
}
