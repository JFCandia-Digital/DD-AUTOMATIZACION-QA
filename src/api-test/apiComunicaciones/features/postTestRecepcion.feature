@API @Comunicaciones @TestRecepcion @TestRecepcion_OK
Feature: Pruebas realizadas a la API "POST" - "/pruebas-integracion/comunicaciones/test-recepcion"

# =================================================================================
# == Pruebas para método POST /pruebas-integracion/comunicaciones/test-recepcion
# == Tarjeta QA-5687 — Envío comunicación prueba para integración
# =================================================================================

  Background:
    Given que solicito un token de acceso con el usuario "CLIENT_ID_PDI" y el password "CLIENT_SECRET_PDI"

  @TestRecepcion_HappyPath
  Scenario: Enviar comunicación de prueba con materia y folio (caso mínimo)
    Given que preparo una petición JSON "POST" a "/pruebas-integracion/comunicaciones/test-recepcion" con token "válido"
    And uso el cuerpo de petición JSON llamado "JSON_TEST_RECEPCION_VALIDO"
    When envío la petición JSON
    Then el estado de la respuesta debe ser 200
    And el cuerpo de la respuesta debe tener la estructura de éxito "COMUNICACION_DESPACHAR_EXITOSA"
    And la propiedad "result.fechaDespacho" del cuerpo de la respuesta debe ser una fecha y hora actual
    And guardo el valor de la propiedad "result.id" como "comunicacionTestRecepcionId" en el contexto
    And la respuesta debe contener un id de comunicación

  @TestRecepcion_Anexos
  Scenario: Enviar comunicación de prueba con incorporaAnexos true
    Given que preparo una petición JSON "POST" a "/pruebas-integracion/comunicaciones/test-recepcion" con token "válido"
    And uso el cuerpo de petición JSON llamado "JSON_TEST_RECEPCION_CON_ANEXOS"
    When envío la petición JSON
    Then el estado de la respuesta debe ser 200
    And el cuerpo de la respuesta debe tener la estructura de éxito "COMUNICACION_DESPACHAR_EXITOSA"
    And la respuesta debe contener un id de comunicación

  @TestRecepcion_Reservado
  Scenario: Enviar comunicación de prueba con isReservado true
    Given que preparo una petición JSON "POST" a "/pruebas-integracion/comunicaciones/test-recepcion" con token "válido"
    And uso el cuerpo de petición JSON llamado "JSON_TEST_RECEPCION_RESERVADO"
    When envío la petición JSON
    Then el estado de la respuesta debe ser 200
    And el cuerpo de la respuesta debe tener la estructura de éxito "COMUNICACION_DESPACHAR_EXITOSA"
    And la respuesta debe contener un id de comunicación

  @TestRecepcion_PA
  Scenario: Enviar comunicación de prueba con asociarProcedimientoAdministrativo true
    Given que preparo una petición JSON "POST" a "/pruebas-integracion/comunicaciones/test-recepcion" con token "válido"
    And uso el cuerpo de petición JSON llamado "JSON_TEST_RECEPCION_CON_PA"
    When envío la petición JSON
    Then el estado de la respuesta debe ser 200
    And el cuerpo de la respuesta debe tener la estructura de éxito "COMUNICACION_DESPACHAR_EXITOSA"
    And la respuesta debe contener un id de comunicación

  @TestRecepcion_FlagsCombinados
  Scenario: Enviar comunicación de prueba con todos los flags opcionales en true
    Given que preparo una petición JSON "POST" a "/pruebas-integracion/comunicaciones/test-recepcion" con token "válido"
    And uso el cuerpo de petición JSON llamado "JSON_TEST_RECEPCION_FLAGS_COMBINADOS"
    When envío la petición JSON
    Then el estado de la respuesta debe ser 200
    And el cuerpo de la respuesta debe tener la estructura de éxito "COMUNICACION_DESPACHAR_EXITOSA"
    And la respuesta debe contener un id de comunicación

  @TestRecepcion_Validacion
  Scenario Outline: Validar campos obligatorios materia y folio
    Given que preparo una petición JSON "POST" a "/pruebas-integracion/comunicaciones/test-recepcion" con token "válido"
    And uso el cuerpo de petición JSON llamado "<body_name>"
    When envío la petición JSON
    Then el estado de la respuesta debe ser 400
    And el cuerpo de la respuesta debe tener la estructura de error "ERROR_400_Bad_Request"

    Examples: Campos obligatorios
      | body_name                      |
      | JSON_TEST_RECEPCION_SIN_MATERIA |
      | JSON_TEST_RECEPCION_SIN_FOLIO   |

  @TestRecepcion_Seguridad
  Scenario Outline: Validar seguridad con distintos tipos de token
    Given que preparo una petición JSON "POST" a "/pruebas-integracion/comunicaciones/test-recepcion" con token "<tipo_auth>"
    And uso el cuerpo de petición JSON llamado "JSON_TEST_RECEPCION_VALIDO"
    When envío la petición JSON
    Then el estado de la respuesta debe ser <status>
    And el cuerpo de la respuesta debe tener la estructura de error "<estructura>"
    And el cuerpo de la respuesta debe tener la propiedad "error" con el valor <mensaje_error>

    Examples:
      | tipo_auth | status | estructura             | mensaje_error      |
      | inválido  |    401 | ERROR_401_Unauthorized | "No autorizado."   |
      | nulo      |    401 | ERROR_401_Unauthorized | "No autorizado."   |
      | expirado  |    401 | ERROR_401_Unauthorized | "Sesión expirada." |
