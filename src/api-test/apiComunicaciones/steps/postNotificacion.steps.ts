import { Before, Then, When } from '@cucumber/cucumber';
import fs from 'fs';
import path from 'path';
import { apiContext } from '../../../common/support/apiContext';
import { PATHS } from '../../../common/support/constants';

function resolveDocumentoSinFirma(): { filePath: string; fileName: string } {
  const fileName = process.env.NOTIFICACION_DOC_SIN_FIRMA || 'Prueba.pdf';
  const candidates = [
    process.env.NOTIFICACION_DOC_SIN_FIRMA_PATH,
    path.join(PATHS.FILES_DIRECTORY, fileName),
    path.join('C:', 'temp', fileName),
  ].filter(Boolean) as string[];

  for (const filePath of candidates) {
    if (fs.existsSync(filePath)) {
      return { filePath, fileName: path.basename(filePath) };
    }
  }

  throw new Error(
    `No se encontró documento sin firma para notificación. Rutas probadas: ${candidates.join(', ')}`
  );
}

function resolveDocumentoConFirma(): { filePath: string; fileName: string } {
  const configuredName = process.env.NOTIFICACION_DOC_CON_FIRMA;
  const defaultCandidates = configuredName
    ? [configuredName]
    : ['Firmado_por_ecert.pdf', '2_FIRMANTES_EN_DOC_DIGITAL.pdf', 'Mineduc.pdf'];

  const candidates = [
    process.env.NOTIFICACION_DOC_CON_FIRMA_PATH,
    ...defaultCandidates.map((fileName) => path.join(PATHS.FILES_DIRECTORY, fileName)),
  ].filter(Boolean) as string[];

  for (const filePath of candidates) {
    if (fs.existsSync(filePath)) {
      return { filePath, fileName: path.basename(filePath) };
    }
  }

  throw new Error(
    `No se encontró documento firmado para notificación. Rutas probadas: ${candidates.join(', ')}`
  );
}

Before({ tags: '@requires-dependiente-id' }, function () {
  if (!process.env.NOTIFICACION_DEPENDIENTE_CODIFICADOR_ID) {
    return 'skipped';
  }

  const dependienteId = Number(process.env.NOTIFICACION_DEPENDIENTE_CODIFICADOR_ID);
  if (!dependienteId) {
    return 'skipped';
  }
});

When('adjunto el documento principal sin firma para notificación', function (this: any) {
  const { filePath, fileName } = resolveDocumentoSinFirma();

  this.filesToAttach.push({
    formKey: 'documentoPrincipal',
    fileName,
    filePath,
  });

  apiContext.attachData.requestBody['documentoPrincipal'] = `(Archivo: ${fileName})`;
});

When('adjunto el documento principal firmado para notificación', function (this: any) {
  const { filePath, fileName } = resolveDocumentoConFirma();

  this.filesToAttach.push({
    formKey: 'documentoPrincipal',
    fileName,
    filePath,
  });

  apiContext.attachData.requestBody['documentoPrincipal'] = `(Archivo: ${fileName})`;
});

Then('la respuesta debe contener un id', function () {
  const response = apiContext.response;

  if (!response) {
    throw new Error('Response no definida');
  }

  if (!response.data?.result?.id) {
    throw new Error(
      `No se encontró id en la respuesta:\n${JSON.stringify(response.data, null, 2)}`
    );
  }
});
