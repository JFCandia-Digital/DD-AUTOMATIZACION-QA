# Pruebas integración Nodo PISEE ↔ DocDigital API v3.5

Guía operativa para ejecutar pruebas manuales vía **Nodo PISEE v2** (consumidor `DocDigitalv3`) y registro de evidencias.

**Proyecto:** DD-AUTOMATIZACION-QA  
**Ejecutor:** Juan Francisco Candia (JFC)  
**Manual nodo:** `Manual de configuración Nodo v2 - PISEE 2 [público] (1) (2).pdf`

---

## Configuración del nodo (referencia)

| Parámetro | Valor |
|-----------|-------|
| Carpeta nodo | `C:\Users\Juan Candia\Documents\3 - Api_NodoConsTEST_DocDigital_dev\NodoConsTEST` |
| Ejecutable | `NodoV2.exe` |
| Organismo | `PE-TEST-00001` |
| Puerto interno | `8085` |
| Ruta local | `/ddv3/*` |
| Servicio catálogo | `DocDigitalv3` |
| Puerto externo | `8490` |

Sección relevante en `config.json`:

```json
"consumidor": [
  {
    "nombre": "DocDigitalv3",
    "rutaLocal": "/ddv3/*",
    "timeout": 10,
    "cabecerasFijas": [{
      "cabecera": "Accept-Encoding",
      "valor": "identity"
    }]
  }
]
```

**Verificar ambiente antes de probar:**

```cmd
NodoV2.exe servicios DocDigitalv3
```

Revisar la línea `Endpoint:` — debe coincidir con el ambiente acordado (TEST o DEMO).

---

## Prerrequisitos

- Credenciales OAuth (`client_id` / `client_secret`) del ambiente a probar (TEST o DEMO).
- Dos ventanas **CMD** abiertas.
- Nodo con certificados PKI en carpeta (`key.pem`, `cert.pem`).

---

## Procedimiento de prueba (desde cero)

Usar **2 ventanas CMD**.

### CMD 1 — Levantar el nodo (no cerrar)

```cmd
cd "C:\Users\Juan Candia\Documents\3 - Api_NodoConsTEST_DocDigital_dev\NodoConsTEST"
```

Opcional, si ya estaba corriendo:

```cmd
NodoV2.exe stop
```

Iniciar:

```cmd
NodoV2.exe start
```

Esperar en pantalla:

- PISEE Central OK
- Catálogo OK
- Servidor interno `localhost:8085`

---

### CMD 2 — Ejecutar pruebas

```cmd
cd "C:\Users\Juan Candia\Documents\3 - Api_NodoConsTEST_DocDigital_dev\NodoConsTEST"
```

#### 1. Verificar servicio y endpoint

```cmd
NodoV2.exe servicios DocDigitalv3
```

Opcional:

```cmd
NodoV2.exe estado
```

#### 2. Obtener token OAuth

Reemplazar `TU_CLIENT_ID` y `TU_CLIENT_SECRET`:

```cmd
curl -i -X POST "http://localhost:8085/ddv3/oauth/token" -u "TU_CLIENT_ID:TU_CLIENT_SECRET"
```

**Esperado:** `HTTP/1.1 200 OK` y `access_token` en el JSON.

Copiar el token (no compartir en chat/tickets).

#### 3. test-recepcion

Cambiar `TU_TOKEN` y usar **folio/materia únicos** en cada ejecución:

```cmd
curl -i -X POST "http://localhost:8085/ddv3/pruebas-integracion/comunicaciones/test-recepcion" -H "Authorization: Bearer TU_TOKEN" -H "Content-Type: application/json" -d "{\"materia\":\"QA Test Recepcion JFC nodo\",\"folio\":\"QA-REC-JFC-NODO-001\",\"isReservado\":false,\"incorporaAnexos\":false,\"asociarProcedimientoAdministrativo\":false}"
```

**Esperado:** `HTTP/1.1 200 OK` y `result.id` (comunicacionId).

#### 4. pendientes-recepcion

```cmd
curl -i -X GET "http://localhost:8085/ddv3/comunicaciones/pendientes-recepcion" -H "Authorization: Bearer TU_TOKEN"
```

**Esperado:** `200 OK` y la comunicación creada en el listado. Anotar `tareaId`.

#### 5. acuse-recibo (opcional — E2E completo)

Reemplazar `TAREA_ID`:

**Acuse:**

```cmd
curl -i -X PUT "http://localhost:8085/ddv3/comunicaciones/acuse-recibo" -H "Authorization: Bearer TU_TOKEN" -H "Content-Type: application/json" -d "{\"tareaId\":TAREA_ID,\"acuseRecibo\":true,\"motivoRechazo\":null}"
```

**Rechazo:**

```cmd
curl -i -X PUT "http://localhost:8085/ddv3/comunicaciones/acuse-recibo" -H "Authorization: Bearer TU_TOKEN" -H "Content-Type: application/json" -d "{\"tareaId\":TAREA_ID,\"acuseRecibo\":false,\"motivoRechazo\":\"Prueba rechazo nodo\"}"
```

#### 6. entidades/token (opcional)

```cmd
curl -i -X GET "http://localhost:8085/ddv3/entidades/token" -H "Authorization: Bearer TU_TOKEN"
```

> En pruebas TEST este endpoint respondió 500 vía nodo; no bloquea si test-recepcion y pendientes responden 200.

#### 7. Evidencias y cierre

- Revisar correo automático DocDigital.
- Guardar: endpoint del catálogo, HTTP status, `Id_traza`, `comunicacionId`, `tareaId`, folio, captura de correo.

#### 8. Detener nodo

```cmd
NodoV2.exe stop
```

---

## Repetir en DEMO (si lo solicitan)

1. Confirmar con `NodoV2 servicios DocDigitalv3` que el endpoint sea:
   `https://middleware.docv3.demo.digital.gob.cl/api/v3`
2. Usar credenciales OAuth **DEMO** (o las indicadas por el equipo).
3. Repetir pasos 2–7 con folio distinto, por ejemplo: `QA-REC-JFC-NODO-DEMO-001`.
4. Si el catálogo sigue apuntando a TEST, solicitar actualización a Interoperabilidad/PISEE antes de probar.

**Prueba directa DEMO (sin nodo) — aislar problemas:**

```cmd
curl -i -X POST "https://middleware.docv3.demo.digital.gob.cl/api/v3/oauth/token" -u "TU_CLIENT_ID:TU_CLIENT_SECRET"
```

---

## Errores frecuentes

| Problema | Causa probable | Acción |
|----------|----------------|--------|
| `curl` sin respuesta | Nodo no está corriendo | `NodoV2.exe start` en CMD 1 |
| Error al pegar comando | Se copió la ruta del prompt junto al comando | Copiar solo la línea `curl ...` |
| Token `401` | Credenciales incorrectas para el ambiente | Verificar TEST vs DEMO |
| test-recepcion `401` | Config servidor (`ENTIDAD_TEST`) | Coordinar con equipo DocDigital |
| Catálogo en TEST, tarjeta pide DEMO | Desalineación de ambientes | Confirmar con Manfredo si TEST alcanza o actualizar catálogo |

---

## Lo ya probado (evidencias — 30-06-2026)

Ambiente efectivo del catálogo: **TEST** (`https://middleware.docv3.test.digital.gob.cl/api/v3`)

| Paso | Endpoint vía nodo | Resultado |
|------|-------------------|-----------|
| Servicio catálogo | `NodoV2 servicios DocDigitalv3` | OK — DNS, TLS, HTTP GET/POST 200 |
| OAuth | `POST /ddv3/oauth/token` | **200 OK** — token PDI (entidad 66) |
| Entidades | `GET /ddv3/entidades/token` | **500** — body vacío (observación) |
| test-recepcion | `POST /ddv3/pruebas-integracion/comunicaciones/test-recepcion` | **200 OK** |
| pendientes | `GET /ddv3/comunicaciones/pendientes-recepcion` | **200 OK** |

### Datos de la comunicación creada vía nodo

| Campo | Valor |
|-------|-------|
| comunicacionId | **89753** |
| tareaId | **618966** |
| materia | QA Test Recepcion JFC nodo |
| folio | QA-REC-JFC-NODO-001 |
| fechaDespacho | 30-06-2026 14:39:00 |
| entidad token | PDI (id 66) |
| despachadora | Entidad TEST Agosto KE |

### Payload usado (test-recepcion)

```json
{
  "materia": "QA Test Recepcion JFC nodo",
  "folio": "QA-REC-JFC-NODO-001",
  "isReservado": false,
  "incorporaAnexos": false,
  "asociarProcedimientoAdministrativo": false
}
```

### Trazabilidad PISEE

Todas las llamadas retornaron cabecera `Id_traza`, por ejemplo:

- `PE-TEST-00001.01KWCX7JTTD3DY2NAGDJJ7M80H` (test-recepcion)
- `PE-TEST-00001.01KWCXEHQG0ZKVWYKMJW8T7C1V` (pendientes)

### Correo DocDigital

Recibido correo automático confirmando comunicación **89753**, folio **QA-REC-JFC-NODO-001**, remitente **Entidad TEST Agosto KE**, fecha **30-06-2026 14:39**, enlace portal `docv3.test.digital.gob.cl`.

### Pendiente / observaciones

- Tarjeta Asana indica ambiente **DEMO**; catálogo y pruebas exitosas fueron en **TEST** — confirmar con Manfredo si alcanza para cierre o repetir en DEMO.
- `GET /entidades/token` → 500 vía nodo (no bloqueante; test-recepcion OK con mismo token).
- acuse-recibo vía nodo: **no ejecutado** en esta sesión (opcional para E2E completo).

---

## Checklist rápido

```
[ ] NodoV2.exe start
[ ] NodoV2 servicios DocDigitalv3 (verificar Endpoint)
[ ] POST /ddv3/oauth/token → 200
[ ] POST /ddv3/.../test-recepcion → 200 + comunicacionId
[ ] GET /ddv3/comunicaciones/pendientes-recepcion → 200 + tareaId
[ ] (Opcional) PUT /ddv3/comunicaciones/acuse-recibo
[ ] Correo DocDigital recibido
[ ] Evidencias guardadas (status, ids, Id_traza, capturas)
[ ] NodoV2.exe stop
```
