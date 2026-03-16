"use client"

import { useState } from "react"
import ChatPanel from "@/components/ChatPanel"
import ChecklistPanel from "@/components/ChecklistPanel"
import WarningsPanel from "@/components/WarningsPanel"
import SummaryPanel from "@/components/SummaryPanel"
import { ChatResponse } from "@/types/api"

export default function Page() {

  const [data, setData] = useState<ChatResponse | null>(null)

  return (

    <main style={{ display: "flex", gap: "40px" }}>

      <div style={{ width: "50%" }}>

        <ChatPanel onUpdate={setData} />

      </div>

      <div style={{ width: "50%" }}>

        {data && (

          <>
            <ChecklistPanel items={data.checklist} />
            <WarningsPanel items={data.warnings} />
          </>

        )}

        <SummaryPanel />

      </div>

    </main>

  )
}