Objetivo

Crear un frontend funcional que permita:

conversar con el bot

mostrar checklist y warnings

pedir el resumen del trámite

mantener sesión del usuario

Todo consumiendo tu API existente.

Arquitectura final de este sprint
ia-tramites
│
├─ formaliza-bot-api
│
└─ formaliza-bot-web
    │
    ├─ app
    │   ├─ layout.tsx
    │   └─ page.tsx
    │
    ├─ components
    │   ├─ ChatPanel.tsx
    │   ├─ ChecklistPanel.tsx
    │   ├─ WarningsPanel.tsx
    │   └─ SummaryPanel.tsx
    │
    ├─ lib
    │   ├─ api.ts
    │   └─ session.ts
    │
    ├─ types
    │   └─ api.ts
    │
    └─ styles