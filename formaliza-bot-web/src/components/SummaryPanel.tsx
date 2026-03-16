"use client"

import { useState } from "react"
import { getSummary } from "@/lib/api"
import { getSessionId } from "@/lib/session"

export default function SummaryPanel() {

    const [summary, setSummary] = useState<any>(null)

    async function loadSummary() {

        const sessionId = getSessionId()

        const data = await getSummary(sessionId)

        setSummary(data)
    }

    return (

        <div>

            <button onClick={loadSummary}>
                Ver resumen
            </button>

            {summary && (

                <pre>

                    {JSON.stringify(summary, null, 2)}

                </pre>

            )}

        </div>

    )
}