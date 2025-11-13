@API @Entidades @GetEntidadesToken
Feature: Pruebas realizadas a la API "GET" - "/entidades/token"
# =================================================================================
# == Pruebas para método GET /entidades/token
# =================================================================================
  Scenario: Enviar petición "GET" - "/entidades/token" con datos válidos
    Given que realizo una petición "GET" a "/entidades/token" con token "válido"
    Then el estado de la respuesta debe ser 200
    And el cuerpo de la respuesta debe tener la estructura de éxito "JSON_RESPONSE_ENTIDAD_TOKEN"
    And la propiedad "timestamp" del cuerpo de la respuesta debe ser una fecha y hora actual


  Scenario Outline: Validar "GET" - "/entidades/token" con distintos token
    Given que realizo una petición "GET" a "/entidades/token" con token "<tipo_auth>"
    Then el estado de la respuesta debe ser <status>
    And el cuerpo de la respuesta debe tener la estructura de error "<estructura>"
    And el cuerpo de la respuesta debe tener la propiedad "error" con el valor <mensaje_error>

    Examples:
      | tipo_auth | status | estructura             | mensaje_error      |
      | inválido  |    401 | ERROR_401_Unauthorized | "No autorizado."   |
      | nulo      |    401 | ERROR_401_Unauthorized | "No autorizado."   |
      | expirado  |    401 | ERROR_401_Unauthorized | "Sesión expirada." |

