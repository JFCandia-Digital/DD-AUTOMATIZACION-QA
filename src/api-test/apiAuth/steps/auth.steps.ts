import { Given, When } from "@cucumber/cucumber";
import { sendAuthRequest } from "../../../common/support/apiClient";
import { attachReport, getCredential } from "../../../common/utils/utils";
import { apiContext } from "../../../common/support/apiContext";

/**
 * Un único step para manejar todos los escenarios de autenticación.
 * Acepta los "nombres" de las credenciales desde el feature.
 */
Given('que solicito un token de acceso con el usuario {string} y el password {string}', async function (this: any, usernameKey: string, passwordKey: string) {

  const username = getCredential(usernameKey);
  const password = getCredential(passwordKey);

  await sendAuthRequest(username, password);

  if (apiContext.response.status === 200) {
    apiContext.token = apiContext.response.data.access_token;
  } else {
    apiContext.token = null;
    console.warn(`No se pudo obtener el token para ${usernameKey}. Status: ${apiContext.response.status}`);
  }
  
  attachReport(this, 'request');
});

/**
 * Este 'When' nos permite cambiar de usuario EN MEDIO de un escenario.
 * Reutiliza la lógica de 'getCredential' y 'sendAuthRequest'.
 */
When('que obtengo un nuevo token de acceso con el usuario {string} y el password {string}', async function (this: any, usernameKey: string, passwordKey: string) {

  console.log(`Re-obteniendo token para usuario ${usernameKey}`);
  console.log(`Re-obteniendo token para password ${passwordKey}`);
  const username = getCredential(usernameKey);
  const password = getCredential(passwordKey);
  await sendAuthRequest(username, password);

  if (apiContext.response.status === 200) {
    apiContext.token = apiContext.response.data.access_token;
    console.log(`Token de ${usernameKey} obtenido y sobrescrito exitosamente.`);
  } else {
    throw new Error(`Falló la re-autenticación para ${usernameKey}. Status: ${apiContext.response.status}`);
  }
  
  attachReport(this, 'request');
});