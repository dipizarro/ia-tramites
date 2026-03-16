import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { ChatService } from '../application/chat.service';
import { chatRequestSchema } from '../domain/chat.schema';
import { SummaryBuilder } from '../application/summary-builder';

export async function setupRoutes(fastify: FastifyInstance) {
    const chatService = new ChatService();

    fastify.get('/health', async (request: FastifyRequest, reply: FastifyReply) => {
        return { status: 'ok' };
    });

    fastify.get('/debug/session/:sessionId', async (request: FastifyRequest<{ Params: { sessionId: string } }>, reply: FastifyReply) => {
        try {
            const { sessionId } = request.params;
            const session = await chatService.getSession(sessionId);

            if (!session) {
                return reply.status(404).send({ error: 'Session not found' });
            }

            return reply.send(session);
        } catch (error) {
            request.log.error(error, 'Error fetching session');
            return reply.status(500).send({ error: 'Internal Server Error' });
        }
    });

    fastify.get('/summary/:sessionId', async (request: FastifyRequest<{ Params: { sessionId: string } }>, reply: FastifyReply) => {
        try {
            const { sessionId } = request.params;
            const session = await chatService.getSession(sessionId);

            if (!session) {
                return reply.status(404).send({ error: 'Session not found' });
            }

            // Reprocesar las reglas estaticamente usando el motor que tiene chatService mediante helper si fuese un caso de uso.
            // Aqui podemos inyectar un metodo buildSummary en chat service o recrearlo:
            const summary = await chatService.buildSummaryForSession(session);

            return reply.send(summary);
        } catch (error) {
            request.log.error(error, 'Error building summary');
            return reply.status(500).send({ error: 'Internal Server Error' });
        }
    });

    fastify.post('/chat', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const parsedBody = chatRequestSchema.safeParse(request.body);

            if (!parsedBody.success) {
                request.log.warn({ errors: parsedBody.error.errors }, 'Invalid chat request');
                return reply.status(400).send({ error: 'Bad Request', details: parsedBody.error.errors });
            }

            const response = await chatService.handleChat(parsedBody.data);
            return reply.send(response);
        } catch (error) {
            request.log.error(error, 'Error processing chat request');
            return reply.status(500).send({ error: 'Internal Server Error' });
        }
    });
}
