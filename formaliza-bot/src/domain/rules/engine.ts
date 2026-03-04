import { Slots } from '../slot-extractor';

export interface Condition {
    slot: string;
    op: '==' | '!=' | 'in' | 'exists';
    value?: any;
}

export interface RuleCondition {
    all?: Condition[];
    any?: Condition[];
}

export interface RuleAction {
    type: 'ask' | 'add_checklist_item' | 'add_warning';
    message: string;
}

export interface Rule {
    id: string;
    priority: number;
    when: RuleCondition;
    then: RuleAction[];
}

export interface RuleSet {
    rules: Rule[];
}

export interface EvaluatedResult {
    next_questions: string[];
    checklist: string[];
    warnings: string[];
}

export class RuleEngine {
    evaluateRules(slots: Slots, ruleset: RuleSet): EvaluatedResult {
        const result: EvaluatedResult = {
            next_questions: [],
            checklist: [],
            warnings: [],
        };

        const sortedRules = [...ruleset.rules].sort((a, b) => b.priority - a.priority);

        for (const rule of sortedRules) {
            let matches = false;

            if (rule.when.all) {
                matches = rule.when.all.every(cond => this.evaluateCondition(slots, cond));
            } else if (rule.when.any) {
                matches = rule.when.any.some(cond => this.evaluateCondition(slots, cond));
            } else {
                matches = true;
            }

            if (matches) {
                for (const action of rule.then) {
                    if (action.type === 'ask') {
                        result.next_questions.push(action.message);
                    } else if (action.type === 'add_checklist_item') {
                        result.checklist.push(action.message);
                    } else if (action.type === 'add_warning') {
                        result.warnings.push(action.message);
                    }
                }
            }
        }

        return result;
    }

    private evaluateCondition(slots: Slots, cond: Condition): boolean {
        const slotValue = slots[cond.slot];

        switch (cond.op) {
            case 'exists':
                const exists = slotValue !== undefined && slotValue !== null && slotValue !== '';
                return cond.value === true ? exists : !exists;
            case '==':
                return slotValue === cond.value;
            case '!=':
                return slotValue !== cond.value;
            case 'in':
                return Array.isArray(cond.value) && cond.value.includes(slotValue);
            default:
                return false;
        }
    }
}
