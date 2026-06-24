@API @Comunicaciones @TestRecepcion @TestRecepcion_E2E
Feature: E2E test-recepcion — pendientes-recepcion, acuse y rechazo (QA-5687)

# =================================================================================
# == TC-INT-017 / TC-INT-018 — Flujo integrador completo en OP receptora
# == POST test-recepcion → GET pendientes-recepcion → PUT acuse-recibo
# =================================================================================

  @TestRecepcion_E2E_Acuse @TC_INT_017
  Scenario: TC-INT-017 Envío prueba, pendientes en OP y acuse de recibo
    Given que solicito un token de acceso con el usuario "CLIENT_ID_PDI" y el password "CLIENT_SECRET_PDI"
    And que preparo una petición JSON "POST" a "/pruebas-integracion/comunicaciones/test-recepcion" con token "válido"
    And uso el cuerpo de petición JSON llamado "JSON_TEST_RECEPCION_VALIDO"
    When envío la petición JSON
    Then el estado de la respuesta debe ser 200
    And el cuerpo de la respuesta debe tener la estructura de éxito "COMUNICACION_DESPACHAR_EXITOSA"
    And guardo el valor de la propiedad "result.id" como "comunicacionTestRecepcionId" en el contexto
    And que preparo una petición "GET" a "/comunicaciones/pendientes-recepcion" con token "válido"
    When ejecuto la petición GET
    Then el estado de la respuesta debe ser 200
    And guardo el valor de la propiedad "result" como "listaPendientesAcuse" en el contexto
    And la lista de pendientes "listaPendientesAcuse" debe contener la comunicación "comunicacionTestRecepcionId"
    When que "acepto" las tareas guardadas en "listaPendientesAcuse" con el comentario "QA Test Recepcion E2E acuse TC-INT-017"
    Then el estado de la respuesta debe ser 200

  @TestRecepcion_E2E_Rechazo @TC_INT_018
  Scenario: TC-INT-018 Envío prueba, pendientes en OP y rechazo
    Given que solicito un token de acceso con el usuario "CLIENT_ID_PDI" y el password "CLIENT_SECRET_PDI"
    And que preparo una petición JSON "POST" a "/pruebas-integracion/comunicaciones/test-recepcion" con token "válido"
    And uso el cuerpo de petición JSON llamado "JSON_TEST_RECEPCION_VALIDO"
    When envío la petición JSON
    Then el estado de la respuesta debe ser 200
    And el cuerpo de la respuesta debe tener la estructura de éxito "COMUNICACION_DESPACHAR_EXITOSA"
    And guardo el valor de la propiedad "result.id" como "comunicacionTestRecepcionId" en el contexto
    And que preparo una petición "GET" a "/comunicaciones/pendientes-recepcion" con token "válido"
    When ejecuto la petición GET
    Then el estado de la respuesta debe ser 200
    And guardo el valor de la propiedad "result" como "listaPendientesRechazo" en el contexto
    And la lista de pendientes "listaPendientesRechazo" debe contener la comunicación "comunicacionTestRecepcionId"
    When que "rechazo" las tareas guardadas en "listaPendientesRechazo" con el comentario "QA Test Recepcion E2E rechazo TC-INT-018"
    Then el estado de la respuesta debe ser 200
