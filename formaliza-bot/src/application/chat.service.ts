import { ChatRequest, ChatResponse } from '../domain/chat.schema';
import { ISessionStore } from '../domain/session-store';
import { SqlServerSessionStore } from '../infrastructure/sqlserver-session-store';
import { SlotExtractor } from '../domain/slot-extractor';
import { RuleEngine, RuleSet } from '../domain/rules/engine';
import { RuleSetLoader } from '../infrastructure/ruleset-loader';
import { config } from '../infrastructure/config';

export class ChatService {
    private sessionStore: ISessionStore;
    private slotExtractor: SlotExtractor;
    private ruleEngine: RuleEngine;
    private ruleset: RuleSet;

    constructor() {
        this.sessionStore = new SqlServerSessionStore(config.sqlConnectionString);
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
            const listText = evalResult.checklist.slice(0, 5).map(i => `- ${i.title}: ${i.detail}`).join('\n');
            reply = "Listo, te dejo los próximos pasos:\n\n" + listText;
        }

        session.slots = newSlots;
        session.updatedAt = new Date().toISOString();
        await this.sessionStore.save(req.sessionId, session);

        return {
            reply,
            slots: newSlots,
            ruleset: {
                id: this.ruleset.ruleset_id,
                version: this.ruleset.version,
                updated_at: this.ruleset.updated_at
            },
            next_questions: evalResult.next_questions,
            checklist: evalResult.checklist,
            warnings: evalResult.warnings
        };
    }

    public async getSession(sessionId: string) {
        return await this.sessionStore.get(sessionId);
    }

    public async buildSummaryForSession(session: any) {
        // Evaluate existing slots to rebuild the exact context and evidences
        const evalResult = this.ruleEngine.evaluateRules(session.slots || {}, this.ruleset);
        
        // Use Summary Builder to build the required API payload
        const { SummaryBuilder } = require('./summary-builder');
        return SummaryBuilder.buildSummary(session, evalResult);
    }
}
