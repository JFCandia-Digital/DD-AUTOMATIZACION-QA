import { Then, When } from "@cucumber/cucumber";
import { apiContext } from "../../../common/support/apiContext";
import { registroExternoRequest } from '../../request/requestBodies';
import FormData from "form-data";
import fs from "fs";
import _ from "lodash";
import { attachJsonToReport, attachReport, obtenerFechaActualFormateada, obtenerFechaConOffset } from "../../../common/utils/utils";
import { sendPostMultipartRequest } from "../../../common/support/apiClient";

Then('uso el cuerpo de registro externo llamado {string} como campo {string}', function (this: any, bodyName: string, campoName: string) {
  if (bodyName.toLowerCase() === '(null)') {
    return;
  }

  const requestBodyOriginal = registroExternoRequest[bodyName];

  if (!requestBodyOriginal) {
    throw new Error(`El cuerpo '${bodyName}' no se encuentra en la sección 'registroExternoRequest' de requestBodies.ts`);
  }

  const requestBody = _.cloneDeep(requestBodyOriginal);

  // Manejo dinámico de fechaHoraDespachoExterno mediante mapa de offsets
  const offsetMap: Record<string, number> = { "OFFSET_1_DIA": 1, "OFFSET_2_DIAS": 2, "OFFSET_MAS_1_DIA": -1, "OFFSET_MAS_2_DIAS": -2 };
  const fechaValue = requestBody.fechaHoraDespachoExterno;
  const offsetDias = offsetMap[fechaValue] ?? null;

  const fechaParaTimestamp = offsetDias !== null
    ? obtenerFechaConOffset(offsetDias)
    : obtenerFechaActualFormateada();

  const requiereReemplazo = fechaValue === null || offsetDias !== null;

  if (requiereReemplazo) {
    requestBody.fechaHoraDespachoExterno = fechaParaTimestamp;
    console.log(`[DEBUG] Fecha externa generada (offset: ${offsetDias ?? 0} días): ${requestBody.fechaHoraDespachoExterno}`);
  }

  const dynamicTimestamp = fechaParaTimestamp.replace(/[:.]/g, '-');
  const prefijosMateria = ["AUT-materia-TEST-REGISTRO-EXTERNO", "AUT-materia-TEST-REGISTRO-POR-INCIDENCIA"];
  const materiaEsDinamica = typeof requestBody.materia === 'string'
    && prefijosMateria.some(prefijo => requestBody.materia.startsWith(prefijo));

  if (materiaEsDinamica) {
    requestBody.materia = `${requestBody.materia}-${dynamicTimestamp}`;
  }

  attachJsonToReport(this, requestBody, `RequestBody_RegistroExterno_${bodyName}.json`);

  this.requestBody = requestBody;
  this.campoName = campoName;
  apiContext.attachData.requestBody[campoName] = requestBody;
});


When('envío la petición multipart de registro externo', { timeout: 60 * 1000 }, async function (this: any) {
  const formData = new FormData();
  
  if (this.filesToAttach && this.filesToAttach.length > 0) {
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
  
  const bodyAsString = JSON.stringify(this.requestBody);
  
  formData.append(this.campoName, bodyAsString, { contentType: 'application/json' });

  apiContext.attachData.requestBody[this.campoName] = this.requestBody;

  await sendPostMultipartRequest(this.endpoint, this.authType, formData);

  attachReport(this, 'request');
  attachReport(this, 'token');
});