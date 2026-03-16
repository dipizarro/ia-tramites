Prueba 1: "hola vendo comida por instagram"

bash
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{"sessionId": "test-sprint2-comida", "message": "hola vendo comida por instagram"}'

Respuesta esperada: Debería setear activity_type=food y sales_channel=instagram. Retornará un warning de permisos sanitarios, checkeará "Definir emisión de documentos" y preguntará "¿En qué comuna operarás principalmente?".
-----------------------------------------------------------------------------------------------------------
-----------------------------------------------------------------------------------------------------------
Prueba 2: "empecé hace 3 meses"

bash
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{"sessionId": "test-sprint2-plazo", "message": "empecé hace 3 meses"}'
Respuesta esperada: Configurará start_date en base a hoy menos 90 días. Se gatillará el warning de plazo excedido y si no tiene activiy preguntará por él.
-----------------------------------------------------------------------------------------------------------
-----------------------------------------------------------------------------------------------------------
Prueba 3: "no tengo clave sii"

bash
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{"sessionId": "test-sprint2-clavesii", "message": "no tengo clave sii"}'
Respuesta esperada: Establecerá has_sii_password=false e incluirá en el checklist la tarea de Obtener/activar Clave Tributaria. Responderá con la pregunta base si no se ha detectado el tipo de actividad.