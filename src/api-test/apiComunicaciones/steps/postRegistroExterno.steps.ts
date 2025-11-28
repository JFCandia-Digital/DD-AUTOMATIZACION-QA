import { Given, Then, When } from "@cucumber/cucumber";
import { apiContext } from "../../../common/support/apiContext";
// Importamos SOLO lo que necesitamos para este endpoint
import { registroExternoRequest } from '../../request/requestBodies';
import FormData from "form-data";
import fs from "fs";
import _ from "lodash";
import { attachJsonToReport, attachReport } from "../../../common/utils/utils";
import { sendPostMultipartRequest } from "../../../common/support/apiClient";

Then('uso el cuerpo de registro externo llamado {string}', function (this: any, bodyName: string) {
  if (bodyName.toLowerCase() === '(null)') {
    return;
  }

  const requestBodyOriginal = registroExternoRequest[bodyName];

  if (!requestBodyOriginal) {
    throw new Error(`El cuerpo '${bodyName}' no se encuentra en la sección 'registroExternoRequest' de requestBodies.ts`);
  }

  const requestBody = _.cloneDeep(requestBodyOriginal);
  const now = new Date();

  // --- LÓGICA DE FECHA DINÁMICA (FORMATO: dd-MM-yyyy HH:mm:ss) ---
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  const fechaFormateada = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;

  if (requestBody.fechaHoraDespachoExterno === null) {
    requestBody.fechaHoraDespachoExterno = fechaFormateada;
    console.log(`[DEBUG] Fecha externa generada: ${requestBody.fechaHoraDespachoExterno}`);
  }
  // ---------------------------------------------------------------

  const dynamicTimestamp = now.toISOString().replace(/[:.]/g, '-');

  // Lógica específica para materia
  if (requestBody.materia && requestBody.materia.startsWith("AUT-materia-TEST")) {
    requestBody.materia = `${requestBody.materia}-${dynamicTimestamp}`;
  }

  attachJsonToReport(this, requestBody, `RequestBody_RegistroExterno_${bodyName}.json`);
  
  this.requestBody = requestBody;
  apiContext.attachData.requestBody['registroComunicacionRequest'] = requestBody;
});

// 2. Step específico para enviar Registro Externo (Multipart)
When('envío la petición multipart de registro externo', { timeout: 60 * 1000 }, async function (this: any) {
  const formData = new FormData();

  // A. Adjuntar Archivos (Reutilizamos la lista filesToAttach llenada por el step genérico 'adjunto un archivo valido...')
  // Si necesitas lógica específica para registro externo (ej. validar anexos), hazla aquí.
  
  if (this.filesToAttach && this.filesToAttach.length > 0) {
      // Lógica para actualizar info de anexos si es necesario, similar a despachar
      let shouldModifyAnexosInfo = 
          this.requestBody 
       && 'archivosAnexosInfo' in this.requestBody 
       && Array.isArray(this.requestBody.archivosAnexosInfo)
       && this.requestBody.archivosAnexosInfo.length > 0
       && this.filesToAttach.some(file => file.formKey === 'archivosAnexos');
     
     if (shouldModifyAnexosInfo) {
       this.requestBody.archivosAnexosInfo = [];
     }
   
     for (const file of this.filesToAttach) {
       if (file.formKey === 'archivosAnexos' && shouldModifyAnexosInfo) {
         this.requestBody.archivosAnexosInfo.push({
           "fileName": file.fileName,
           "isReservado": false
         });
       }
       formData.append(file.formKey, fs.createReadStream(file.filePath));
     }
  }
  
  // B. Adjuntar el JSON con el nombre EXACTO que pide este endpoint
  const bodyAsString = JSON.stringify(this.requestBody);
  
  // AQUÍ ESTÁ LA CLAVE: Hardcodeamos el nombre correcto del campo
  formData.append('registroComunicacionRequest', bodyAsString, { contentType: 'application/json' });
  
  // Actualizamos el reporte
  apiContext.attachData.requestBody['registroComunicacionRequest'] = this.requestBody;

  await sendPostMultipartRequest(this.endpoint, this.authType, formData);

  attachReport(this, 'request');
  attachReport(this, 'token');
});