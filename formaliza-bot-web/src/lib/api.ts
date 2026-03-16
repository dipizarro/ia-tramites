import { ChatResponse, SummaryResponse } from "@/types/api"

const API = process.env.NEXT_PUBLIC_API_BASE_URL

export async function sendMessage(
    sessionId: string,
    message: string
): Promise<ChatResponse> {

    const res = await fetch(`${API}/chat`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            sessionId,
            message
        })
    })

    if (!res.ok) {
        throw new Error("Error llamando API")
    }

    return res.json()
}

export async function getSummary(
    sessionId: string
): Promise<SummaryResponse> {

    const res = await fetch(`${API}/summary/${sessionId}`)

    if (!res.ok) {
        throw new Error("Error obteniendo resumen")
    }

    return res.json()
}