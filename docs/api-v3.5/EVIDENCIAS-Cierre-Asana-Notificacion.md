# Evidencias QA — Cierre tarjeta Asana  
## Endpoint `POST /comunicaciones/despachar-tipo-notificacion` (API MW v3.5)

**Proyecto:** DD-AUTOMATIZACION-QA  
**Repositorio:** JFCandia-Digital/DD-AUTOATIZACION-QA  
**Ambiente:** QA — `https://middleware.docv3.test.digital.gob.cl/api/v3`  
**Token:** PDI (`CLIENT_ID_PDI` / `CLIENT_SECRET_PDI`)  
**Ejecutor:** Juan Francisco Candia (JFC) — QA Automatizador  
**Fecha evidencia final:** 23-06-2026 ~13:54  
**Ejecución suite completa:** `npm run notificacion_report` — **11 scenarios (11 passed)** | reporte `reports/index.html`  
**Naming QA:** materia `QA Notificacion JFC …` | folio `QA-NOTI-JFC-…`

---

## 1. Objetivo de la tarjeta (Asana)

Automatizar y validar el endpoint de notificación según Manual de Integración API MW v3.5, cubriendo:

- Flujo exitoso con documento firmado (FEA)
- Rechazo por documento sin firma
- Validaciones de campos obligatorios (Procedimiento Administrativo / PA)
- Reglas de negocio con entidades dependientes

---

## 2. Configuración utilizada (`.env.api`)

| Variable | Valor QA | Uso |
|----------|----------|-----|
| `API_BASEURL` | `https://middleware.docv3.test.digital.gob.cl/api/v3` | Base API |
| `CLIENT_ID_PDI` / `CLIENT_SECRET_PDI` | *(credenciales QA)* | Autenticación OAuth |
| `NOTIFICACION_ENTIDAD_DESPACHADORA_CODIFICADOR_ID` | `598` | Entidad despachadora (alineada a `postDespachar`) |
| `NOTIFICACION_DESTINATARIO_PRINCIPAL_ID` | `156` | Destinatario principal válido en QA |
| `NOTIFICACION_DEPENDIENTE_CODIFICADOR_ID` | `4758` | PI Inspectoría General (dependiente de 598 vía `GET /entidades/dependientes/598`) |
| `NOTIFICACION_DESTINATARIO_NO_DEPENDIENTE_ID` | `598` | Destinatario ajeno a la relación despachadora/dependiente |

**PDFs utilizados:**

| Archivo | Escenarios |
|---------|------------|
| `2_FIRMANTES_EN_DOC_DIGITAL.pdf` | Happy path, dependientes (con firma) |
| `Prueba.pdf` (o `NOTIFICACION_DOC_SIN_FIRMA`) | Negativos sin firma / campos PA |

> **Nota:** Con token PDI (entidad token 66) no usar `Mineduc.pdf` como documento principal; el PDF está ligado a entidad MINEDUC (106) y provoca error 4001.

---

## 3. Cuadro de evidencias — Matriz requisito Asana vs automatización

| # | Requisito Asana / Manual v3.5 | Escenario Cucumber | Tag | Archivo feature | Resultado | Evidencia |
|---|------------------------------|-------------------|-----|-----------------|-----------|-----------|
| 1 | Despacho exitoso con firma válida → 200 + `result.id` | Despachar notificación con documento firmado y datos PA válidos | `@Notificacion_HappyPath` | `postNotificacion.feature` | **PASS** | id **89703** (23-06-2026 13:54:08) — correo DocDigital |
| 2 | Documento sin firma → 400, `errorCode` 4001 | Validar rechazo de notificación con documento principal sin firma digital | `@Notificacion_SinFirma` | `postNotificacion.feature` | **PASS** | Mensaje firma externa obligatoria |
| 3 | Sin destinatarios → 400, `errorCode` 40000 | Validar campos obligatorios PA (sin destinatarios) | `@Notificacion_CamposPA` | `postNotificacion.feature` | **PASS** | `"Se requiere al menos una entidad destinataria"` |
| 4 | Sin `configuracionDestinatarios` → 40000 | Validar campos obligatorios PA (sin configuración) | `@Notificacion_CamposPA` | `postNotificacion.feature` | **PASS** | `"configuracionDestinatarios es obligatorio"` |
| 5 | Sin `usuarioSolicitante` → 40000 | Validar campos obligatorios PA (sin usuario) | `@Notificacion_CamposPA` | `postNotificacion.feature` | **PASS** | `"Usuario solicitante es obligatorio"` |
| 6 | Sin RUN → 40000 | Validar campos obligatorios PA (sin RUN) | `@Notificacion_CamposPA` | `postNotificacion.feature` | **PASS** | `"RUN del usuario es obligatorio"` |
| 7 | Sin DV → 40000 | Validar campos obligatorios PA (sin DV) | `@Notificacion_CamposPA` | `postNotificacion.feature` | **PASS** | `"Digito verificador del RUN es obligatorio"` |
| 8 | Sin `tipoProcedimientoAdministrativo` → 40000 | Validar campos obligatorios PA (sin tipo PA) | `@Notificacion_CamposPA` | `postNotificacion.feature` | **PASS** | `"tipoProcedimientoAdministrativo es obligatorio"` |
| 9 | Dependiente en copia permitido → 200 | Despachar notificación con entidad dependiente como destinatario en copia | `@Notificacion_Dependientes` | `postNotificacion.feature` | **PASS** | 200 — id en reporte 13:54; correo **89705** |
| 10 | Dependiente como principal (regla negocio) | Despachar notificación con entidad dependiente de la despachadora como destinatario principal | `@Notificacion_Dependientes` | `postNotificacion.feature` | **PASS** | 200 — API QA **acepta** (hallazgo H-01) |
| 11 | Destinatario no válido / no dependiente | Validar rechazo con destinatario no dependiente de la entidad despachadora | `@Notificacion_Dependientes` | `postNotificacion.feature` | **PASS** | 400 / `errorCode` **4001** (hallazgo H-02) |

**Total escenarios `@Notificacion`:** 11  
**Estado suite final (23-06-2026 13:54:23):** `11 scenarios (11 passed)` — reporte `reports/index.html`  
**Correos DocDigital recibidos:** **89703**, **89705** (materia `QA Notificacion JFC`, folio `QA-NOTI-JFC-…`)

---

## 4. Comandos de ejecución

### Suite completa notificación (recomendado para cierre)

```bash
npm run notificacion
npm run api-report
```

### Suites por grupo (evidencia parcial)

```bash
npm run notificacion_happy_path
npm run notificacion_sin_firma
npx cucumber-js --profile api --tags @Notificacion_CamposPA
npm run notificacion_dependientes
```

### Resultado esperado suite completa

```
11 scenarios (11 passed)
```

---

## 5. Paquete de adjuntos para Asana (checklist)

| # | Archivo / captura | Dónde obtenerlo | ¿Listo? |
|---|-------------------|-----------------|---------|
| 1 | **Matriz Excel** | `docs/api-v3.5/matriz_api_notificacion_DocDigital.xlsx` | ✅ en repo |
| 2 | **Documento Word evidencias** | `docs/api-v3.5/Documento_Evidencias_Pruebas_Notificacion.docx` | ✅ en repo |
| 3 | **Reporte Cucumber PDF** | Abrir `reports/index.html` → Ctrl+P → Guardar como PDF | ⬜ tú |
| 4 | **Captura reporte 11/11** | Screenshot dashboard oscuro (11 passed) | ✅ si ya la tienes |
| 5 | **Captura terminal** | `11 scenarios (11 passed)` al correr `npm run notificacion_report` | ⬜ opcional |
| 6 | **Correo id 89703** | Gmail — `QA Notificacion JFC 23-06-2026 13-54-08` | ✅ |
| 7 | **Correo id 89705** | Gmail — `QA Notificacion JFC 23-06-2026 13-54-17` | ✅ |
| 8 | **Este resumen** | `docs/api-v3.5/EVIDENCIAS-Cierre-Asana-Notificacion.md` | ✅ |

### Exportar reporte a PDF

1. Ejecutar (si quieres reporte fresco): `npm run notificacion_report`
2. Abrir `reports/index.html` en Chrome
3. **Ctrl+P** → Destino: **Guardar como PDF** → Orientación horizontal → Guardar

---

## 6. Reportes HTML (rutas)

Tras `npm run notificacion` y `npm run api-report`:

| Reporte | Ruta |
|---------|------|
| Cucumber HTML | `reports/cucumber-api/api-report.html` |
| Multiple Cucumber HTML | `reports/index.html` |
| JSON (CI / trazabilidad) | `reports/cucumber-api/cucumber-report.json` |

Adjuntar a la tarjeta Asana:
1. Captura de pantalla del resumen terminal (`11 passed`)
2. `reports/index.html` o `api-report.html` (exportar PDF desde navegador si el equipo lo pide)

---

## 6. Artefactos de código entregados

| Artefacto | Ruta |
|-----------|------|
| Feature BDD | `src/api-test/apiComunicaciones/features/postNotificacion.feature` |
| Steps notificación | `src/api-test/apiComunicaciones/steps/postNotificacion.steps.ts` |
| Payloads JSON | `src/api-test/request/requestBodies.ts` (`JSON_NOTIFICACION_*`) |
| Scripts npm | `package.json` → `notificacion`, `notificacion_*` |
| Manual referencia | `docs/api-v3.5/DocDigital V3_ MANUAL DE INTEGRACIÓN API MW V 3.5.docx` |

---

## 7. Hallazgos QA (para registro en Asana)

| ID | Hallazgo | Severidad | Acción |
|----|----------|-----------|--------|
| H-01 | Manual/README indicaba rechazo de dependiente como principal; en QA despachadora **598** + dependiente **4758** como principal retorna **200** | Media | Documentado en automatización; confirmar con negocio/backend si es comportamiento esperado o gap |
| H-02 | Escenario "destinatario no dependiente" valida `errorCode` **4001** (firma), no mensaje específico de dependiente | Baja | Cobertura parcial; regla de dependiente no alcanzable con PDF sin firma en este flujo |

---

## 8. Texto sugerido — Comentario de cierre en Asana

```
✅ CIERRE QA — POST /comunicaciones/despachar-tipo-notificacion (API MW v3.5)

Ejecutor: Juan Francisco Candia (JFC)
Fecha: 23-06-2026

Ejecución: npm run notificacion_report
Resultado: 11 scenarios (11 passed) | reporte reports/index.html (13:54:23)

Cobertura automatizada:
• Happy path 200 + result.id → comunicación 89703
• Rechazo sin firma → 400 / errorCode 4001
• 6 validaciones campos PA obligatorios → 400 / errorCode 40000
• Dependiente en copia (4758) → 200
• Dependiente como principal (4758) → 200 (hallazgo H-01)
• Destinatario no dependiente → 400 / errorCode 4001 (hallazgo H-02)

Evidencia E2E correo DocDigital:
• 89703 — QA Notificacion JFC — folio QA-NOTI-JFC-23-06-2026 13-54-08
• 89705 — QA Notificacion JFC — folio QA-NOTI-JFC-23-06-2026 13-54-17

Adjuntos: matriz Excel, documento Word, reporte PDF, capturas correo.
Código: rama main — DD-AUTOMATIZACION-QA

Ambiente: middleware QA v3 | Token PDI | Despachadora 598 | Dependiente 4758
```

---

## 9. Checklist cierre QA Automatizador

- [x] Código integrado en repositorio DD-AUTOMATIZACION-QA (rama `main`)
- [x] `npm run notificacion_report` → 11/11 passed (23-06-2026 13:54)
- [x] Reporte HTML generado (`reports/index.html`)
- [x] Correos DocDigital 89703 y 89705 (JFC)
- [ ] Adjuntar matriz Excel + Word + PDF reporte en Asana
- [ ] Pegar comentario de cierre (sección 8)
- [ ] Registrar hallazgos H-01 y H-02 si el equipo lo pide
- [ ] Mover tarjeta Asana a **Done** / estado acordado
