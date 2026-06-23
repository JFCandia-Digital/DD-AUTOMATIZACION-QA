🔵 Framework de Automatización API – DocDigital
🔷 Guía de Uso, Arquitectura y Cobertura QA

🔷 1. Descripción General
Este proyecto corresponde a un framework de automatización de pruebas de API, diseñado para validar el sistema DocDigital mediante pruebas funcionales, de integración y end-to-end (E2E).
Su objetivo principal es garantizar que los flujos de comunicación electrónica entre instituciones funcionen correctamente de manera automatizada.

🔷 2. ¿Qué es este proyecto?
Este repositorio no es la API.
Es un framework que prueba la API automáticamente.
Permite ejecutar pruebas como obtener token, enviar documentos, consultar datos y procesar tareas sin intervención manual.

🔷 3. Tecnologías utilizadas
TypeScript → lenguaje base del proyecto.
Cucumber → definición de escenarios bajo enfoque BDD.
Axios → ejecución de llamadas HTTP a la API.
Playwright (expect) → validación de respuestas.
DotEnv → manejo de variables de entorno.
multiple-cucumber-html-reporter → reportes HTML.

🔷 4. Relación con Swagger
El framework está alineado directamente con los endpoints definidos en Swagger.
Swagger se utiliza para pruebas manuales y exploración, mientras que el framework automatiza dichos endpoints.
Esto permite validar APIs primero manualmente y luego automatizarlas.

🔷 5. Arquitectura del proyecto
apiClient.ts centraliza todas las llamadas HTTP usando Axios.
apiContext.ts almacena el token, la última respuesta y datos compartidos entre pasos.
utils.ts proporciona funciones auxiliares y lectura de variables de entorno.
schemas define la estructura esperada de las respuestas JSON.
request contiene payloads reutilizables para requests POST.

🔷 6. Configuración de entorno
El proyecto depende de un archivo llamado .env.api.
Este archivo contiene la URL base, credenciales y configuración del entorno.
Ejemplo:
API_BASEURL=https://middleware.docv3.test.digital.gob.cl/api/v3
CLIENT_ID_PDI=XXXX
CLIENT_SECRET_PDI=XXXX
Sin este archivo no es posible autenticarse ni ejecutar pruebas.

🔷 7. Ejecución de pruebas
Para validar autenticación:
npm run auth
Para ejecutar pruebas del endpoint de notificación:
npm run notificacion
Existen pruebas que modifican datos del sistema como comunicaciones, revisión y apiTest.

🔷 8. Tipos de pruebas implementadas
Pruebas de autenticación validan generación de token y errores.
Pruebas GET permiten consultar datos del sistema.
Pruebas POST envían documentos mediante multipart/form-data.
Pruebas E2E simulan flujos completos del sistema.

🔷 9. Endpoint nuevo: Notificación (API v3.5)
Se implementa el endpoint:
POST /comunicaciones/despachar-tipo-notificacion
Este endpoint recibe un request multipart con datos y un documento PDF.
El sistema valida la firma electrónica del documento y aplica reglas de negocio.

🔷 10. Escenarios implementados
Se implementó el escenario de rechazo sin firma.
El sistema responde con status 400 y errorCode 4001 cuando el documento no contiene firma electrónica válida.
Este comportamiento fue validado automáticamente con el framework.

🔷 11. Escenario pendiente
El escenario exitoso depende de un PDF firmado electrónicamente con FEA válida.
Sin este documento el sistema siempre retorna error 4001.
El escenario positivo debe validar status 200 y creación de la comunicación con ID.

🔷 12. Cobertura QA esperada
Casos obligatorios:
Documento con firma válida devuelve 200.
Documento sin firma devuelve 400 con error 4001.
Casos de validación:
Sin destinatario devuelve 400.
Sin usuario solicitante devuelve 400.
Sin procedimiento administrativo devuelve 400.
Casos de negocio:
Destinatario dependiente como principal es rechazado.
Destinatario dependiente en copia es permitido.

🔷 13. Riesgos importantes
Dependencia de documentos firmados.
Validaciones criptográficas del sistema.
Uso de datos reales de integración.
Dependencia de múltiples sistemas.

🔷 14. Enfoque QA aplicado
Se valida el comportamiento real mediante respuestas de la API.
Los errores se interpretan como reglas de negocio y no como fallas técnicas.
Se prioriza la validación de integración completa.

🔷 15. Reportes
Los reportes se generan automáticamente en:
reports/cucumber-api/api-report.html
Incluyen escenarios, steps, request y response.

🔷 16. Estado actual
Autenticación funcional.
Framework funcionando correctamente.
Validación negativa del endpoint de notificación implementada.
Reportes generados correctamente.
Pendiente:
Obtener PDF firmado FEA.
Implementar escenario exitoso.
Completar cobertura QA.

🔷 17. Plan de acción
Solicitar documento firmado válido.
Ejecutar escenario positivo (200).
Agregar escenarios negativos adicionales.
Completar cobertura QA del endpoint.

🔷 18. Conclusión
El framework permite validar la API DocDigital de forma automatizada, cubriendo autenticación, integración y reglas de negocio.
El endpoint de notificación fue validado correctamente en su comportamiento de rechazo, quedando pendiente la validación del flujo exitoso condicionado a la disponibilidad de un documento firmado.

🔷 Frase final
El framework permite validar de forma automatizada los flujos críticos de la API DocDigital, asegurando autenticación, integridad de datos y correcta ejecución de procesos end-to-end, considerando tanto escenarios exitosos como validaciones de negocio.