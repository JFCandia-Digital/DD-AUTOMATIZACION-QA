📄 Framework de Automatización API – DocDigital (Guía de Uso y Análisis QA)

🧭 1. Descripción General
Este proyecto corresponde a un framework de automatización de pruebas de API, diseñado para validar el sistema DocDigital mediante pruebas:

✅ Funcionales
✅ De integración
✅ End-to-End (E2E)

El objetivo principal es permitir la validación automatizada del envío, recepción y consulta de documentos electrónicos entre instituciones.

🧠 2. ¿Qué es este proyecto?
Este repositorio NO es la API, sino que es:
👉 Un sistema que prueba la API automáticamente

🔥 Qué hace
El framework ejecuta pruebas como:

Obtener token de autenticación
Enviar documentos (POST)
Consultar datos (GET)
Procesar recepciones (PUT)

👉 Todo esto de forma automática

⚙️ 3. Tecnologías utilizadas


Tecnología                                                  Uso

TypeScript                                          Lenguaje base
Cucumber                                            Definición de escenarios (BDD)
Axios                                               Ejecución de llamadas HTTP a la API
Playwright (expect)                                 Validación de respuestas (asserts)
DotEnv                                              Manejo de variables de entorno
multiple-cucumber-html-reporter                     Reportes

🌐 4. Relación con Swagger y API
El framework está directamente conectado con la API documentada en Swagger.
Ejemplo:

        Swagger                    Framework

GET /pendientes-recepcion       getPendientesRecepcion.feature
POST /despachar                 flujo E2E
PUT /acuse-recibo               procesamiento de tareas

👉 El framework automatiza los endpoints definidos en Swagger.


🏗️ 5. Arquitectura del proyecto
🔹 Componentes principales

📌 apiClient.ts
Contiene la lógica de llamadas HTTP hacia la API.
👉 Es el único archivo que usa Axios
👉 Centraliza requests (GET, POST, PUT)

📌 apiContext.ts
Objeto global que guarda:

token actual ✅
última respuesta ✅
datos entre pasos ✅

👉 Permite conectar los escenarios

📌 utils.ts
Funciones auxiliares:

lectura de variables .env
generación de reportes


📌 schemas/
Define los esquemas esperados de respuesta.
👉 Se utiliza para validar estructura de JSON

📌 request/
Contiene los payloads para requests POST.

🔐 6. Configuración de entorno (CRÍTICO)
El proyecto depende de un archivo:

.env.api


✅ Qué es
Archivo de configuración que contiene:

URL de la API
credenciales
configuración del entorno


🧠 Por qué es necesario
👉 Sin este archivo:

❌ no hay autenticación
❌ no se puede conectar a la API
❌ los tests fallan


📄 Ejemplo

API_BASEURL=https://middleware.docv3.test.digital.gob.cl/api/v3
CLIENT_ID_PDI=XXXX
CLIENT_SECRET_PDI=XXXX

⚠️ 7. Qué me falta para ejecutar
Actualmente el proyecto está:

✅ Clonado
✅ Instalado (npm install)
✅ Código listo

🔴 Falta:

Credenciales de TEST
Archivo .env.api configurado


✅ Acción requerida
Solicitar al equipo:

“Credenciales de test (CLIENT_ID y CLIENT_SECRET) para configurar el archivo .env.api.”


🚀 8. Ejecución de pruebas

✅ Prueba segura (recomendada)

npm run authMostrar más líneas
Valida:

generación de token
autenticación

👉 No modifica datos

⚠️ Pruebas con impacto
- npm run comunicaciones
- npm run revision
- npm run apiTest

👉 Estas pruebas:

- envían documentos
- cambian estado
- interactúan con el sistema real


🧪 9. Tipos de pruebas implementadas

✅ Autenticación
Valida:

- token válido
- credenciales inválidas
- errores 401


✅ Consulta (GET)
Ejemplo:

- pendientes de recepción
- datos de comunicación


✅ Envío (POST)
Envía documentos mediante:

- multipart/form-data


✅ Flujo E2E
Simula proceso completo:

- Enviar → Consultar → Recibir → Confirmar


🔥 10. Flujo más importante
El flujo principal es:

getAcuseRecibo.feature

🧠 Qué hace

- PDI envía documento
- ARMADA recibe
- procesa tareas
- repite para otras entidades


👉 Esto representa el negocio real del sistema

⚠️ 11. Riesgos importantes

- Dependencia de PDFs firmados
- Integración con múltiples sistemas
- Modificación de datos reales
- Uso de credenciales reales


🧠 12. Enfoque QA correcto

❌ No hacer

- ejecutar E2E sin validar entorno
- automatizar sin credenciales
- probar sin entender flujo


✅ Hacer

- validar autenticación primero
- usar Swagger para probar endpoints
- ejecutar pruebas progresivamente
- trabajar con datos de TEST


📊 13. Uso de Swagger
Swagger permite:

- ver endpoints
- probar manualmente
- validar respuestas rápidas
- entender la AP

“Swagger se utiliza para explorar y validar endpoints de forma manual, mientras que la ejecución principal de pruebas automatizadas se realiza desde el framework en Visual Studio Code.”


🔐 Requiere:

- Bearer Token


👉 Se obtiene desde:

- npm run auth

👉 Hace:

- obtiene token
- valida respuesta
- ejecuta assertions
- usa Cucumber


🎯 14. Estado actual
Actualmente:
✔ entorno preparado
✔ framework entendido
✔ Swagger analizado
✔ pruebas manuales realizadas

🔴 Pendiente

credenciales
ejecutar pruebas automáticas


✅ 15. Conclusión

El framework es una solución completa para automatización de pruebas API, alineada con los flujos del sistema DocDigital, permitiendo validación de autenticación, consultas y procesos end-to-end.
Para su ejecución es necesario configurar variables de entorno con credenciales válidas y realizar una ejecución controlada iniciando por pruebas seguras.

🚀 16. Plan de acción (paso a paso)

✅ Paso 1
Solicitar credenciales de test

✅ Paso 2
Crear 
.env.api

✅ Paso 3
Ejecutar autenticación:
npm run auth

✅ Paso 4
Validar token en Swagger

✅ Paso 5
Ejecutar pruebas GET

✅ Paso 6
Avanzar a pruebas E2E (con control)

💬 FRASE FINAL (para presentación)

“El framework permite validar de forma automatizada los flujos críticos de la API DocDigital, asegurando autenticación, integridad de datos y correcta ejecución de procesos end-to-end, manteniendo un enfoque controlado basado en ambientes de pruebas y gestión segura de credenciales.”


💥 BONUS (importante para ti)
👉 Con esto ya puedes:
✅ explicar el proyecto
✅ entender cómo funciona
✅ justificar decisiones
✅ preparar automatización


*****************************************************************


✅ ✅ 7. Qué puedes decir en reunión (esto te posiciona fuerte)

"El framework está organizado por módulos funcionales de la API, separando autenticación, comunicaciones, usuarios y entidades. Esto permite ejecutar pruebas de forma controlada, comenzando por autenticación y endpoints de consulta antes de avanzar a flujos completos que implican modificación de datos."


🎯 ✅ CONCLUSIÓN
👉 Lo que tienes:
✔ framework completo
✔ pruebas listas
✔ flujo definido
✔ integración con Swagger

👉 Lo que te falta:
🔑 credenciales
📄 .env.api

👉 Lo que debes hacer:

pedir credenciales ✅
ejecutar npm run auth ✅
validar token ✅
avanzar por módulos ✅