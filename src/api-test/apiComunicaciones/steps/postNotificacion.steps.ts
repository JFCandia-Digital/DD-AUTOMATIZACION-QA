import { When, Then } from '@cucumber/cucumber';
import FormData from 'form-data';
import fs from 'fs';
import { sendPostMultipartRequest } from '../../../common/support/apiClient';
import { apiContext } from '../../../common/support/apiContext';

When('envío comunicación tipo notificación válida', async function () {

  const formData = new FormData();

  formData.append(
    'comunicacionRequest',
    JSON.stringify({
      materia: `QA Notificacion ${Date.now()}`,
      folio: `QA-${Date.now()}`,
      isReservado: false,
      incorporaAnexos: true,

      configuracionDestinatarios: {
        destinatarios: [
          {
            entidadDestinatariaCodificadorId: 66 // ✅ usar misma entidad del token
          }
        ]
      },

      entidadDespachadoraCodificadorId: 66,

      usuarioSolicitante: {
        run: 11111111,
        dv: "1"
      },

      tipoProcedimientoAdministrativo: {
        id: 999,
        codigo: "PROC0999_OTROS",
        descripcion: "Otro procedimiento administrativo"
      }

    }),
    { contentType: 'application/json' }
  );

  formData.append(
    'documentoPrincipal',
    fs.createReadStream('C:/temp/Prueba.pdf') // ✅ PDF sin firma (para test 400)
  );

  await sendPostMultipartRequest(
    '/comunicaciones/despachar-tipo-notificacion',
    'válido',
    formData
  );

  this.response = apiContext.response;
});


Then('la respuesta debe ser {int}', function (status: number) {
  const response = this.response || apiContext.response;

  if (!response) {
    throw new Error('Response no definida');
  }

  if (response.status !== status) {
    throw new Error(
      `Esperado: ${status}, obtenido: ${response.status}\n${JSON.stringify(response.data, null, 2)}`
    );
  }
});


Then('el código de error debe ser {int}', function (expectedErrorCode: number) {

  const response = this.response || apiContext.response;

  if (!response) {
    throw new Error('Response no definida');
  }

  if (response.data?.errorCode !== expectedErrorCode) {
    throw new Error(
      `Esperado errorCode: ${expectedErrorCode}, obtenido: ${response.data?.errorCode}\n${JSON.stringify(response.data, null, 2)}`
    );
  }

});


Then('la respuesta debe contener un id', function () {
  const response = this.response || apiContext.response;

  if (!response) {
    throw new Error('Response no definida');
  }

  if (!response.data?.result?.id) {
    throw new Error(
      `No se encontró id en la respuesta:\n${JSON.stringify(response.data, null, 2)}`
    );
  }
});
