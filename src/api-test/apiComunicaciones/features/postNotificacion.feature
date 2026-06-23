@Notificacion_OK
Feature: API Notificación

Scenario: Validar rechazo de notificación sin firma

  Given que solicito un token de acceso con el usuario "CLIENT_ID_PDI" y el password "CLIENT_SECRET_PDI"

  When envío comunicación tipo notificación válida

  Then la respuesta debe ser 400
  And el código de error debe ser 4001