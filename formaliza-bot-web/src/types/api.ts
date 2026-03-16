export interface ChecklistItem {
    title: string
    detail: string
    links: string[]
}

export interface WarningItem {
    title: string
    detail: string
    links: string[]
}

export interface ChatResponse {
    reply: string
    slots: Record<string, any>
    next_questions: string[]
    checklist: ChecklistItem[]
    warnings: WarningItem[]
}

export interface SummaryResponse {
    summary: Record<string, any>
    next_steps: string[]
    warnings: string[]
    sources: string[]
}