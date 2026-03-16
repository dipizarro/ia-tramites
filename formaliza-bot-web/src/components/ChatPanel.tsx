"use client"

import { useState, useEffect } from "react"
import { sendMessage } from "@/lib/api"
import { getSessionId } from "@/lib/session"
import { ChatResponse } from "@/types/api"

interface Props {
    onUpdate: (data: ChatResponse) => void
}

export default function ChatPanel({ onUpdate }: Props) {

    const [message, setMessage] = useState("")
    const [history, setHistory] = useState<string[]>([])
    const [sessionId, setSessionId] = useState("")

    useEffect(() => {
        setSessionId(getSessionId())
    }, [])

    async function handleSend() {

        if (!message) return

        const userMsg = `👤 ${message}`

        setHistory(prev => [...prev, userMsg])

        const res = await sendMessage(sessionId, message)

        const botMsg = `🤖 ${res.reply}`

        setHistory(prev => [...prev, botMsg])

        onUpdate(res)

        setMessage("")
    }

    return (
        <div>

            <h2>Chat </h2>

            < div style={{ height: "300px", overflowY: "auto", border: "1px solid #ccc", padding: "10px" }
            }>

                {
                    history.map((msg, i) => (

                        <div key={i} > {msg} </div>

                    ))
                }

            </div>

            < input
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Escribe un mensaje"
            />

            <button onClick={handleSend}>
                Enviar
            </button>

        </div>
    )
}