@API @Comunicaciones @Notificacion @Notificacion_OK
Feature: Pruebas realizadas a la API "POST" - "/comunicaciones/despachar-tipo-notificacion"

# =================================================================================
# == Pruebas para método POST /comunicaciones/despachar-tipo-notificacion
# =================================================================================

  Background:
    Given que solicito un token de acceso con el usuario "CLIENT_ID_PDI" y el password "CLIENT_SECRET_PDI"

  @Notificacion_HappyPath
  Scenario: Despachar notificación con documento firmado y datos PA válidos
    Given que preparo una petición "POST" a "/comunicaciones/despachar-tipo-notificacion" con token "válido"
    And uso el cuerpo de petición llamado "JSON_NOTIFICACION_HAPPY_PATH" como campo "comunicacionRequest"
    And adjunto un archivo valido "2_FIRMANTES_EN_DOC_DIGITAL.pdf" como "documentoPrincipal"
    When envío la petición multipart
    Then el estado de la respuesta debe ser 200
    And el cuerpo de la respuesta debe tener la estructura de éxito "COMUNICACION_DESPACHAR_EXITOSA"
    And la propiedad "result.fechaDespacho" del cuerpo de la respuesta debe ser una fecha y hora actual
    And guardo el valor de la propiedad "result.id" como "comunicacionNotificacionId" en el contexto
    And la respuesta debe contener un id

  @Notificacion_SinFirma
  Scenario: Validar rechazo de notificación con documento principal sin firma digital
    Given que preparo una petición "POST" a "/comunicaciones/despachar-tipo-notificacion" con token "válido"
    And uso el cuerpo de petición llamado "JSON_NOTIFICACION_VALIDO" como campo "comunicacionRequest"
    And adjunto el documento principal sin firma para notificación
    When envío la petición multipart
    Then el estado de la respuesta debe ser 400
    And el cuerpo de la respuesta debe tener la estructura de error "ERROR_400_Bad_Request"
    And el cuerpo de la respuesta debe tener la propiedad "errorCode" con el valor 4001
    And el cuerpo de la respuesta debe tener la propiedad "error" con el valor "Error en archivo principal sin firmas externas. El archivo principal debe tener firmas externas para ser marcado como resuelto o firmado."

  @Notificacion_CamposPA
  Scenario Outline: Validar campos obligatorios PA en notificación
    Given que preparo una petición "POST" a "/comunicaciones/despachar-tipo-notificacion" con token "válido"
    And uso el cuerpo de petición llamado "<body_name>" como campo "comunicacionRequest"
    And adjunto el documento principal sin firma para notificación
    When envío la petición multipart
    Then el estado de la respuesta debe ser 400
    And el cuerpo de la respuesta debe tener la estructura de error "ERROR_400_Bad_Request"
    And el cuerpo de la respuesta debe tener la propiedad "errorCode" con el valor 40000
    And el cuerpo de la respuesta debe tener la propiedad "error" con el valor <mensaje_error_esperado>

    Examples: Campos obligatorios PA (400 - Validation failure)
      | body_name                                         | mensaje_error_esperado                              |
      | JSON_NOTIFICACION_SIN_DESTINATARIOS                 | "Se requiere al menos una entidad destinataria"     |
      | JSON_NOTIFICACION_SIN_CONFIGURACION_DESTINATARIOS   | "configuracionDestinatarios es obligatorio"       |
      | JSON_NOTIFICACION_SIN_USUARIO_SOLICITANTE           | "Usuario solicitante es obligatorio"              |
      | JSON_NOTIFICACION_SIN_RUN_USUARIO_SOLICITANTE       | "RUN del usuario es obligatorio"                    |
      | JSON_NOTIFICACION_SIN_DV_USUARIO_SOLICITANTE        | "Digito verificador del RUN es obligatorio"         |
      | JSON_NOTIFICACION_SIN_TIPO_PROCEDIMIENTO            | "tipoProcedimientoAdministrativo es obligatorio"    |

  @Notificacion_Dependientes @requires-dependiente-id
  Scenario: Despachar notificación con entidad dependiente como destinatario en copia
    Given que preparo una petición "POST" a "/comunicaciones/despachar-tipo-notificacion" con token "válido"
    And uso el cuerpo de petición llamado "JSON_NOTIFICACION_DEPENDIENTE_EN_COPIA" como campo "comunicacionRequest"
    And adjunto un archivo valido "2_FIRMANTES_EN_DOC_DIGITAL.pdf" como "documentoPrincipal"
    When envío la petición multipart
    Then el estado de la respuesta debe ser 200
    And el cuerpo de la respuesta debe tener la estructura de éxito "COMUNICACION_DESPACHAR_EXITOSA"
    And la respuesta debe contener un id

  @Notificacion_Dependientes @requires-dependiente-id
  Scenario: Despachar notificación con entidad dependiente de la despachadora como destinatario principal
    Given que preparo una petición "POST" a "/comunicaciones/despachar-tipo-notificacion" con token "válido"
    And uso el cuerpo de petición llamado "JSON_NOTIFICACION_DEPENDIENTE_COMO_PRINCIPAL" como campo "comunicacionRequest"
    And adjunto un archivo valido "2_FIRMANTES_EN_DOC_DIGITAL.pdf" como "documentoPrincipal"
    When envío la petición multipart
    Then el estado de la respuesta debe ser 200
    And el cuerpo de la respuesta debe tener la estructura de éxito "COMUNICACION_DESPACHAR_EXITOSA"
    And la respuesta debe contener un id

  @Notificacion_Dependientes
  Scenario: Validar rechazo de notificación con destinatario no dependiente de la entidad despachadora
    Given que preparo una petición "POST" a "/comunicaciones/despachar-tipo-notificacion" con token "válido"
    And uso el cuerpo de petición llamado "JSON_NOTIFICACION_DESTINATARIO_NO_DEPENDIENTE" como campo "comunicacionRequest"
    And adjunto el documento principal sin firma para notificación
    When envío la petición multipart
    Then el estado de la respuesta debe ser 400
    And el cuerpo de la respuesta debe tener la estructura de error "ERROR_400_Bad_Request"
    And el cuerpo de la respuesta debe tener la propiedad "errorCode" con el valor 4001
