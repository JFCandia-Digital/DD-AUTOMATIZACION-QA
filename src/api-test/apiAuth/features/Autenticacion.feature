@API @Auth
Feature: Pruebas realizadas a la APi Autenticación

  Scenario: Obtener un token de acceso con credenciales válidas
    Given que solicito un token de acceso con el usuario "CLIENT_ID_PDI" y el password "CLIENT_SECRET_PDI"
    Then el estado de la respuesta debe ser 200
    And el cuerpo de la respuesta debe tener la estructura de éxito "AUTH_TOKEN_EXITOSO"
    And el cuerpo de la respuesta debe tener la propiedad "token_type" con el valor "Bearer"
    And el cuerpo de la respuesta debe tener la propiedad "scope" con el valor "read write trust"

  Scenario: Intentar obtener un token con Username erróneo y Password correcto
    Given que solicito un token de acceso con el usuario "usuario_erroneo" y el password "CLIENT_SECRET"
    Then el estado de la respuesta debe ser 401
    And el cuerpo de la respuesta debe tener la estructura de error "ERROR_401_Unauthorized"
    And el cuerpo de la respuesta debe tener la propiedad "error" con el valor "ClientId no registrado."

  Scenario: Intentar obtener un token con Username correcto y Password erróneo
    Given que solicito un token de acceso con el usuario "CLIENT_ID" y el password "password_erroneo"
    Then el estado de la respuesta debe ser 401
    And el cuerpo de la respuesta debe tener la estructura de error "ERROR_401_Unauthorized"
    And el cuerpo de la respuesta debe tener la propiedad "error" con el valor "ClientId no registrado."