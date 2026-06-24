import { Given, Then, When } from '@cucumber/cucumber';
import _ from 'lodash';
import { apiContext } from '../../../common/support/apiContext';
import { sendPostRequestWithJson } from '../../../common/support/apiClient';
import { attachJsonToReport, attachReport, obtenerFechaActualFormateada } from '../../../common/utils/utils';
import { testRecepcionRequest } from '../../request/requestBodies';

Given(
  'que preparo una petición JSON {string} a {string} con token {string}',
  function (this: any, method: string, endpoint: string, authType: string) {
    if (method.toUpperCase() !== 'POST') {
      throw new Error(`Este step solo soporta POST JSON. Se recibió: ${method}`);
    }
    this.endpoint = endpoint;
    this.authType = authType;
    this.requestBody = {};
    apiContext.attachData.requestBody = {};
    attachReport(this, 'token', authType);
  }
);

Then('uso el cuerpo de petición JSON llamado {string}', function (this: any, bodyName: string) {
  const requestBodyOriginal = (testRecepcionRequest as Record<string, any>)[bodyName];
  if (!requestBodyOriginal) {
    throw new Error(`El cuerpo '${bodyName}' no se encuentra en requestBodies.ts (testRecepcionRequest)`);
  }

  const requestBody = _.cloneDeep(requestBodyOriginal);
  const dynamicTimestamp = obtenerFechaActualFormateada().replace(/[:.]/g, '-');
  const iniciales =
    process.env.TEST_RECEPCION_QA_INICIALES ||
    process.env.NOTIFICACION_QA_INICIALES ||
    'JFC';

  if (requestBody.materia === 'AUT-materia-TEST-RECEPCION') {
    requestBody.materia = `QA Test Recepcion ${iniciales} ${dynamicTimestamp}`;
  }

  if (requestBody.folio === 'FOLIO-TEST-RECEPCION-BASE') {
    requestBody.folio = `QA-REC-${iniciales}-${dynamicTimestamp}`;
  }

  apiContext.worldData.set('materiaActual', requestBody.materia);

  attachJsonToReport(this, requestBody, `RequestBody_${bodyName}_FinalEnviado.json`);
  this.requestBody = requestBody;
  apiContext.attachData.requestBody = requestBody;
});

When('envío la petición JSON', { timeout: 60 * 1000 }, async function (this: any) {
  await sendPostRequestWithJson(this.endpoint, this.authType, this.requestBody);
  attachReport(this, 'request');
  attachReport(this, 'token');
});

Then('la respuesta debe contener un id de comunicación', function () {
  const response = apiContext.response;

  if (!response?.data?.result?.id) {
    throw new Error(
      `No se encontró result.id en la respuesta:\n${JSON.stringify(response?.data, null, 2)}`
    );
  }
});
