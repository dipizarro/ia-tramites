import { z } from 'zod';

export const chatRequestSchema = z.object({
    sessionId: z.string().min(1, "sessionId is required"),
    message: z.string().optional().default(""),
});

export type ChatRequest = z.infer<typeof chatRequestSchema>;

const checklistItemSchema = z.object({
    title: z.string(),
    detail: z.string(),
    links: z.array(z.string()).default([])
});

const warningItemSchema = z.object({
    title: z.string(),
    detail: z.string(),
    links: z.array(z.string()).default([])
});

export type ChecklistItem = z.infer<typeof checklistItemSchema>;
export type WarningItem = z.infer<typeof warningItemSchema>;

export const chatResponseSchema = z.object({
    reply: z.string(),
    slots: z.record(z.any()).optional(),
    ruleset: z.object({
        id: z.string(),
        version: z.string(),
        updated_at: z.string()
    }).optional(),
    next_questions: z.array(z.string()).optional(),
    checklist: z.array(checklistItemSchema).optional(),
    warnings: z.array(warningItemSchema).optional()
});

export type ChatResponse = z.infer<typeof chatResponseSchema>;
