import { z } from 'zod';

export const chatRequestSchema = z.object({
    sessionId: z.string().min(1, "sessionId is required"),
    message: z.string().optional().default(""),
});

export type ChatRequest = z.infer<typeof chatRequestSchema>;

export const chatResponseSchema = z.object({
    reply: z.string(),
});

export type ChatResponse = z.infer<typeof chatResponseSchema>;
