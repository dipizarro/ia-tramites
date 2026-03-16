Objetivo

Subir el bot de “demo” a asistente útil agregando:

Slots nuevos:

commune

has_rut (sí/no)

has_sii_password (sí/no)

start_date (fecha, o “hace X días/meses”)

Reglas reales (las más importantes del MVP):

Si no tiene RUT → checklist y/o pregunta

Si no tiene clave SII → checklist y/o pregunta

Si hay start_date y pasaron > ~62 días → warning “plazo 2 meses”

Si vende comida → warning permisos sanitarios

Si falta comuna y activity sugiere patente → preguntar comuna

Mejorar payload:

checklist como objetos (no strings)

warnings como objetos (no strings)

links (aunque sea vacío)

Entregables

Actualizar chat.schema.ts para soportar respuesta rica

slot-extractor.ts mejorado:

detecta comuna si el usuario escribe “San Bernardo”, “Puente Alto”, etc. (heurística simple: “en X”)

detecta sí/no para rut/clave:

“tengo rut”, “sí tengo rut” → has_rut=true

“no tengo rut” → has_rut=false

fecha:

“hace 3 meses” → start_date = today - 90d

“hace 10 días” → today - 10d

“2026-02-01” → parse ISO

Motor de reglas:

soporta date_diff_days (solo lo que necesitamos)

Ruleset JSON: reemplazar el ruleset simple por el set MVP (puede ser una versión reducida del que te pasé antes)

Criterios de validación (Sprint 2)

Prueba 1:

“hola vendo comida por instagram”
Debe:

activity_type=food

warning permisos sanitarios

checklist “emisión documentos”

pregunta por comuna (porque patente/permisos)

Prueba 2:

“empecé hace 3 meses”
Debe:

setear start_date

warning plazo 2 meses (si corresponde)

Prueba 3:

“no tengo clave sii”
Debe:

has_sii_password=false

checklist “obtener clave SII”