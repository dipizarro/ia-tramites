import { Slots } from '../slot-extractor';
import { ChecklistItem, WarningItem } from '../chat.schema';

export interface Condition {
    slot?: string;
    op: '==' | '!=' | 'in' | 'exists' | '>' | '<' | '>=' | '<=';
    value?: any;
    fn?: 'date_diff_days';
    args?: string[];
}

export interface RuleCondition {
    all?: Condition[];
    any?: Condition[];
}

export interface RuleAction {
    type: 'ask' | 'add_checklist_item' | 'add_warning';
    message?: string;
    title?: string;
    detail?: string;
    links?: string[];
}

export interface Rule {
    id: string;
    priority: number;
    when: RuleCondition;
    then: RuleAction[];
}

export interface RuleSet {
    ruleset_id: string;
    version: string;
    updated_at: string;
    rules: Rule[];
}

export interface EvaluatedResult {
    next_questions: string[];
    checklist: ChecklistItem[];
    warnings: WarningItem[];
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
                    if (action.type === 'ask' && action.message) {
                        result.next_questions.push(action.message);
                    } else if (action.type === 'add_checklist_item' && action.title && action.detail) {
                        result.checklist.push({
                            title: action.title,
                            detail: action.detail,
                            links: action.links || []
                        });
                    } else if (action.type === 'add_warning' && action.title && action.detail) {
                        result.warnings.push({
                            title: action.title,
                            detail: action.detail,
                            links: action.links || []
                        });
                    }
                }
            }
        }

        return result;
    }

    private evaluateCondition(slots: Slots, cond: Condition): boolean {
        if (cond.fn === 'date_diff_days' && cond.args && cond.args.length === 2) {
            const arg1 = cond.args[0] === 'today' ? new Date().toISOString().split('T')[0] : slots[cond.args[0]];
            const arg2 = cond.args[1] === 'today' ? new Date().toISOString().split('T')[0] : slots[cond.args[1]];

            if (!arg1 || !arg2) return false;

            const d1 = new Date(arg1);
            const d2 = new Date(arg2);

            // date_diff_days(start_date, today) => today - start_date
            const diffTime = d2.getTime() - d1.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            return this.compare(diffDays, cond.op, cond.value);
        }

        if (cond.slot) {
            const slotValue = slots[cond.slot];
            return this.compare(slotValue, cond.op, cond.value);
        }

        return false;
    }

    private compare(left: any, op: string, right: any): boolean {
        switch (op) {
            case '==': return left === right;
            case '!=': return left !== right;
            case 'in': return Array.isArray(right) && right.includes(left);
            case '>': return left > right;
            case '<': return left < right;
            case '>=': return left >= right;
            case '<=': return left <= right;
            case 'exists':
                const exists = left !== undefined && left !== null && left !== '';
                return right === true ? exists : !exists;
            default: return false;
        }
    }
}
