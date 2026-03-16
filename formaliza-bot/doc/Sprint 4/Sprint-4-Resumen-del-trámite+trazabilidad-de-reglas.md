Objetivo

Cuando el usuario tenga suficiente información, el sistema debe poder generar:

Un resumen estructurado del trámite.

Ejemplo de salida:

{
  "summary": {
    "activity": "Venta de productos físicos",
    "channel": "Instagram",
    "commune": "San Bernardo",
    "start_date": "2025-12-04"
  },
  "next_steps": [
    "Realizar inicio de actividades en el SII",
    "Revisar patente municipal en San Bernardo",
    "Definir emisión de boletas electrónicas"
  ],
  "warnings": [
    "El plazo de aviso de inicio de actividades es de 2 meses."
  ],
  "sources": [
    "https://www.sii.cl/...",
    "https://www.chileatiende.gob.cl/..."
  ]
}

Esto transforma tu bot en:

Asistente que entrega un plan claro de acción

y eso sí tiene valor real.

Qué agregaremos técnicamente
1️⃣ Endpoint nuevo
GET /summary/:sessionId

Devuelve:

slots actuales

checklist consolidado

warnings

sources (evidence de reglas)

ruleset version

2️⃣ Agregar “sources” a las reglas

Cada regla debe tener:

"evidence": [
 "https://www.sii.cl/...",
 "https://www.chileatiende.gob.cl/..."
]

El motor debe acumular esas fuentes.

3️⃣ Summary Builder

Archivo nuevo:

src/application/summary-builder.ts

Función:

buildSummary(session, rulesResult)

Devuelve:

summary

next_steps

warnings

sources

4️⃣ Guardar warnings y checklist en sesión (opcional)

Ahora mismo se recalculan.

Por ahora está bien recalcular, pero el builder puede usarlos directamente.