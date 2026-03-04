import { ChatRequest, ChatResponse } from '../domain/chat.schema';
import { ISessionStore, InMemorySessionStore, SessionState } from '../domain/session-store';
import { SlotExtractor } from '../domain/slot-extractor';
import { RuleEngine } from '../domain/rules/engine';
import { RuleSetLoader } from '../infrastructure/ruleset-loader';

export class ChatService {
    private sessionStore: ISessionStore;
    private slotExtractor: SlotExtractor;
    private ruleEngine: RuleEngine;
    private ruleset: any;

    constructor() {
        this.sessionStore = new InMemorySessionStore();
        this.slotExtractor = new SlotExtractor();
        this.ruleEngine = new RuleEngine();
        this.ruleset = RuleSetLoader.load('ruleset.cl.formaliza.mvp.json');
    }

    public async handleChat(req: ChatRequest): Promise<ChatResponse> {
        let session = await this.sessionStore.get(req.sessionId);
        if (!session) {
            session = { slots: {}, updatedAt: new Date().toISOString() };
        }

        const newSlots = this.slotExtractor.extractSlots(req.message || '', session.slots);
        const evalResult = this.ruleEngine.evaluateRules(newSlots, this.ruleset);

        let reply = '';
        if (evalResult.next_questions.length > 0) {
            reply = evalResult.next_questions[0];
        } else {
            reply = "Listo, te dejo los próximos pasos.\n\n" + evalResult.checklist.slice(0, 3).map(i => `- ${i}`).join('\n');
        }

        session.slots = newSlots;
        session.updatedAt = new Date().toISOString();
        await this.sessionStore.save(req.sessionId, session);

        return {
            reply,
            slots: newSlots,
            next_questions: evalResult.next_questions,
            checklist: evalResult.checklist,
            warnings: evalResult.warnings
        };
    }
}
