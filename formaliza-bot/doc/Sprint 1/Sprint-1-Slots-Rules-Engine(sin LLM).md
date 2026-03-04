Objetivo
Que /chat ya no responda fijo, sino que:
guarde estado por sessionId (en memoria por ahora),
extraiga slots básicos desde el texto (heurísticas simples),
evalúe reglas desde ruleset.json,

devuelva:
reply
next_questions[]
checklist[]
warnings[]
slots (estado actual)

Entregables
1) Session Store (in-memory)
   ISessionStore + InMemorySessionStore
   Guarda por sessionId: { slots, history?, updatedAt }

2) Slot Extractor v0 (heurístico)
   Función tipo:
extractSlots(message, currentSlots) -> updatedSlots
Reglas simples:
Si contiene “instagram” → sales_channel=instagram
Si contiene “producto”, “ropa”, “vendo cosas” → activity_type=physical_goods
Si contiene “servicio”, “freelance”, “programación”, “diseño” → activity_type=digital_services
Si contiene “comida”, “pasteles”, “empanadas” → activity_type=food
Si message es “1/2/3/4” para tu pregunta → setea activity_type

3) Ruleset JSON + loader
src/domain/rules/ruleset.cl.formaliza.mvp.json
loadRuleset() desde filesystem (una vez al boot)

4) Motor de reglas mínimo
evaluateRules(slots, ruleset) -> { checklist, warnings, next_questions }
Soporta al menos:
when.all / when.any
slot op == / != / in / exists
tipos then: ask, add_checklist_item, add_warning, add_fact (facts opcional)

5) ChatService actualizado
Flujo:
session = store.get(sessionId) || create
slots = extractSlots(message, session.slots)
result = evaluateRules(slots, ruleset)
Construye reply:
Si hay next_questions[0] → reply = esa pregunta
Si no hay preguntas → reply = resumen corto + próximos pasos
store.save(sessionId, slots, …)
Devuelve payload completo
Contrato de respuesta (nuevo)

POST /chat →

{
  "reply": "…",
  "slots": { "activity_type": "physical_goods", "sales_channel": "instagram" },
  "next_questions": ["¿En qué comuna operarás principalmente?"],
  "checklist": [{ "title": "Hacer Inicio de Actividades", "detail": "...", "links": [] }],
  "warnings": [{ "title": "Ojo: plazo 2 meses", "detail": "...", "links": [] }]
}

Criterios de validación (Sprint 1)

Primer mensaje:

input: “hola, vendo ropa por instagram”

output:

slots.activity_type = physical_goods

slots.sales_channel = instagram

reply debe preguntar algo relevante (ej: comuna o rut/clave o el menú si falta actividad)

Conversación con estado:

Msg1: “hola”

Msg2: “1”

Msg3: “vendo por instagram”
Debe mantener slots acumulados.

Si faltan slots, aparecen next_questions[].

Si se cumplen condiciones, aparecen checklist[] y/o warnings[].