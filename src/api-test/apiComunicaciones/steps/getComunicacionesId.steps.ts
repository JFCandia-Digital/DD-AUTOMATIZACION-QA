import { Given, Then, When } from "@cucumber/cucumber";
import { attachReport } from "../../../common/utils/utils";
import { sendGetRequest } from "../../../common/support/apiClient";


Given('que realizo una petición {string} a {string} con token {string}', async function (this: any, method: string, endpoint: string, authType: string) {
  if (method.toUpperCase() !== 'GET') {
    throw new Error(`Este step solo soporta el método GET. Se recibió: ${method}`);
  }
  await sendGetRequest(endpoint, authType);
  attachReport(this, 'request');
  attachReport(this, 'token');
});
