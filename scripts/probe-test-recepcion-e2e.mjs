/**
 * E2E QA-5687: POST test-recepcion → GET pendientes-recepcion → PUT acuse-recibo
 * Uso: npm run probe:test-recepcion-e2e
 * Requiere: VPN + .env.api en la raíz del proyecto
 */
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config({ path: '.env.api' });

const baseUrl = process.env.API_BASEURL;
const clientId = process.env.CLIENT_ID_PDI;
const clientSecret = process.env.CLIENT_SECRET_PDI;

if (!baseUrl || !clientId || !clientSecret) {
  console.error('❌ Falta API_BASEURL, CLIENT_ID_PDI o CLIENT_SECRET_PDI en .env.api');
  process.exit(1);
}

const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const iniciales = process.env.TEST_RECEPCION_QA_INICIALES || 'JFC';
const materia = `QA Test Recepcion E2E ${iniciales} ${timestamp}`;
const folio = `QA-REC-E2E-${iniciales}-${timestamp}`;

const body = {
  materia,
  folio,
  isReservado: false,
  incorporaAnexos: false,
  asociarProcedimientoAdministrativo: false,
};

async function getToken() {
  const tokenRes = await axios.post(`${baseUrl}/oauth/token`, null, {
    auth: { username: clientId, password: clientSecret },
  });
  return tokenRes.data.access_token;
}

async function postTestRecepcion(token) {
  const endpoint = '/pruebas-integracion/comunicaciones/test-recepcion';
  const res = await axios.post(`${baseUrl}${endpoint}`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res.data?.result?.id;
}

async function getPendientes(token, materiaFiltro) {
  const endpoint = `/comunicaciones/pendientes-recepcion?materia=${encodeURIComponent(materiaFiltro)}`;
  const res = await axios.get(`${baseUrl}${endpoint}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data?.result ?? [];
}

async function putAcuseRecibo(token, comunicacionId, tareaId, isRechazada, comentario) {
  const endpoint = `/comunicaciones/${comunicacionId}/recepcion/${tareaId}/acuse-recibo`;
  const res = await axios.put(
    `${baseUrl}${endpoint}`,
    { isRechazada, comentarios: comentario },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return res.status;
}

async function runFlujo(label, isRechazada, materiaFiltro) {
  console.log(`\n========== ${label} ==========`);
  console.log('📦 Materia:', materiaFiltro);
  const token = await getToken();
  console.log('✅ Token PDI obtenido');

  const comunicacionId = await postTestRecepcion(token);
  console.log('✅ POST test-recepcion → id:', comunicacionId);

  const pendientes = await getPendientes(token, materiaFiltro);
  const tarea = pendientes.find((p) => Number(p.comunicacionId) === Number(comunicacionId));

  if (!tarea?.tareaId) {
    throw new Error(
      `Comunicación ${comunicacionId} no aparece en pendientes-recepcion (materia: ${materia})`
    );
  }

  console.log('✅ GET pendientes-recepcion → tareaId:', tarea.tareaId);

  const status = await putAcuseRecibo(
    token,
    comunicacionId,
    tarea.tareaId,
    isRechazada,
    `Probe E2E ${label} — ${materiaFiltro}`
  );
  console.log(`✅ PUT acuse-recibo (${isRechazada ? 'RECHAZO' : 'ACUSE'}) → HTTP`, status);
}

async function main() {
  console.log('🔗 API:', baseUrl);
  console.log('📦 Folio:', folio);

  await runFlujo('TC-INT-017 ACUSE', false, materia);

  const timestamp2 = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const materiaRechazo = `QA Test Recepcion E2E Rechazo ${iniciales} ${timestamp2}`;
  body.materia = materiaRechazo;
  body.folio = `QA-REC-E2E-REJ-${iniciales}-${timestamp2}`;

  await runFlujo('TC-INT-018 RECHAZO', true, materiaRechazo);

  console.log('\n🎉 E2E test-recepcion completado (acuse + rechazo)');
}

main().catch((err) => {
  const status = err.response?.status;
  const data = err.response?.data;
  console.error('❌ Error:', status ?? err.message);
  if (data) console.error(JSON.stringify(data, null, 2));
  process.exit(1);
});
