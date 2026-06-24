import { Then } from '@cucumber/cucumber';
import _ from 'lodash';
import { apiContext } from '../../../common/support/apiContext';
import { attachJsonToReport } from '../../../common/utils/utils';

Then(
  'la lista de pendientes {string} debe contener la comunicación {string}',
  function (this: any, listaKey: string, comunicacionKey: string) {
    const tareas = apiContext.worldData.get(listaKey);
    const comunicacionId = apiContext.worldData.get(comunicacionKey);

    if (!Array.isArray(tareas)) {
      throw new Error(`No se encontró un array en el contexto con la clave: ${listaKey}`);
    }

    if (comunicacionId === undefined || comunicacionId === null) {
      throw new Error(`No se encontró comunicacionId en el contexto con la clave: ${comunicacionKey}`);
    }

    const encontrada = tareas.some(
      (tarea) => Number(_.get(tarea, 'comunicacionId')) === Number(comunicacionId)
    );

    if (!encontrada) {
      attachJsonToReport(this, tareas, `Pendientes_${listaKey}_sin_match.json`);
      throw new Error(
        `La comunicación ${comunicacionId} no aparece en pendientes-recepcion. ` +
          `Tareas encontradas: ${tareas.length}`
      );
    }

    const tarea = tareas.find(
      (item) => Number(_.get(item, 'comunicacionId')) === Number(comunicacionId)
    );

    attachJsonToReport(this, tarea, `TareaPendiente_${comunicacionId}.json`);
    console.log(
      `Comunicación ${comunicacionId} encontrada en pendientes (tareaId: ${_.get(tarea, 'tareaId')})`
    );
  }
);
