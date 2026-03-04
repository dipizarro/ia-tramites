import { ChatRequest, ChatResponse } from '../domain/chat.schema';

export class ChatService {
    public async handleChat(req: ChatRequest): Promise<ChatResponse> {
        const msg = (req.message || '').trim().toLowerCase();

        if (msg.includes('hola') || msg === '') {
            return {
                reply: "Hola, soy FormalizaBot. ¿Qué vendes principalmente? (1) productos físicos (2) servicios digitales (3) comida (4) mixto"
            };
        }

        return {
            reply: "Entendido. En el siguiente sprint extraeremos intent y datos."
        };
    }
}
