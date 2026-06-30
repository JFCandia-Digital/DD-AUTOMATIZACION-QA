# Manual API Middleware DocDigital v3.5

## Documentación relacionada

- [Pruebas Nodo PISEE ↔ DocDigital v3.5](README-Pruebas-Nodo-PISEE.md) — guía paso a paso CMD + evidencias integración nodo
- `Manual de configuración Nodo v2 - PISEE 2 [público] (1) (2).pdf`

Colocar aquí el documento de integración:

`DocDigital V3_ MANUAL DE INTEGRACIÓN API MW V 3.5.docx`

Este manual es la referencia para automatizar el endpoint:

- `POST /comunicaciones/despachar-tipo-notificacion`

## Variables de entorno útiles (`.env.api`)

```env
# PDF sin firma (escenarios negativos)
NOTIFICACION_DOC_SIN_FIRMA=Prueba.pdf
NOTIFICACION_DOC_SIN_FIRMA_PATH=C:/temp/Prueba.pdf

# PDF con FEA para token PDI (66): usar PDF genéricos del framework
# NO usar Mineduc.pdf con token PDI (documento ligado a entidad MINEDUC / 106)
# NOTIFICACION_DOC_CON_FIRMA=Firmado_por_ecert.pdf

# Entidad despachadora QA PDI (misma que postDespachar)
NOTIFICACION_ENTIDAD_DESPACHADORA_CODIFICADOR_ID=598
NOTIFICACION_DESTINATARIO_PRINCIPAL_ID=156
# Obtener con: GET /entidades/dependientes/66
NOTIFICACION_DEPENDIENTE_CODIFICADOR_ID=<id_dependiente>
NOTIFICACION_DESTINATARIO_PRINCIPAL_ID=66
NOTIFICACION_DESTINATARIO_NO_DEPENDIENTE_ID=598

# Iniciales en materia/folio de notificación (default: JFC)
# NOTIFICACION_QA_INICIALES=JFC

# Test recepción integración (QA-5687) — opcional, default JFC
# TEST_RECEPCION_QA_INICIALES=JFC
```

## Scripts test-recepcion (QA-5687)

```bash
npm run test_recepcion              # suite @TestRecepcion
npm run test_recepcion_happy_path   # solo happy path
npm run test_recepcion_report       # suite + reporte HTML
npm run probe:test-recepcion        # prueba rápida POST (sin Cucumber)
```
