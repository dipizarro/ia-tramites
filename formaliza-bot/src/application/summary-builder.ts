import { SessionState } from '../domain/session-store';
import { EvaluatedResult } from '../domain/rules/engine';

export interface SummaryPayload {
    summary: {
        activity?: string;
        channel?: string;
        commune?: string;
        start_date?: string;
    },
    next_steps: string[];
    warnings: Array<{
        title: string;
        detail: string;
        links: string[];
    }>;
    sources: string[];
}

export class SummaryBuilder {
    static buildSummary(session: SessionState, rulesResult: EvaluatedResult): SummaryPayload {
        return {
            summary: {
                activity: session.slots.activity_type,
                channel: session.slots.sales_channel,
                commune: session.slots.commune,
                start_date: session.slots.start_date
            },
            next_steps: rulesResult.checklist.map(item => item.title),
            warnings: rulesResult.warnings,
            sources: rulesResult.sources
        };
    }
}
