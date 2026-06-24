/**
 * Prueba rápida POST /pruebas-integracion/comunicaciones/test-recepcion (QA-5687)
 * Uso: npm run probe:test-recepcion
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
const body = {
  materia: `QA Test Recepcion JFC ${timestamp}`,
  folio: `QA-REC-JFC-${timestamp}`,
  isReservado: false,
  incorporaAnexos: false,
  asociarProcedimientoAdministrativo: false,
};

async function main() {
  console.log('🔗 API:', baseUrl);
  console.log('🔑 Token: CLIENT_ID_PDI\n');

  const tokenRes = await axios.post(`${baseUrl}/oauth/token`, null, {
    auth: { username: clientId, password: clientSecret },
  });
  const token = tokenRes.data.access_token;
  console.log('✅ Token obtenido\n');

  const endpoint = '/pruebas-integracion/comunicaciones/test-recepcion';
  console.log('📤 POST', endpoint);
  console.log('📦 Body:', JSON.stringify(body, null, 2), '\n');

  try {
    const res = await axios.post(`${baseUrl}${endpoint}`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    console.log('✅ STATUS:', res.status);
    console.log('📥 RESPONSE:', JSON.stringify(res.data, null, 2));
    if (res.data?.result?.id) {
      console.log('\n🎉 Pablo configuró QA — comunicación id:', res.data.result.id);
    }
  } catch (err) {
    const status = err.response?.status;
    const data = err.response?.data;
    console.log('❌ STATUS:', status ?? 'sin respuesta');
    console.log('📥 RESPONSE:', JSON.stringify(data ?? err.message, null, 2));

    if (status === 401 && String(data?.error ?? '').includes('ENTIDAD_TEST')) {
      console.log('\n⏳ Sigue bloqueado: variables servidor API_CLIENT_ENTIDAD_TEST no configuradas (Pablo).');
    }
  }
}

main().catch((e) => {
  console.error('Error de red:', e.message);
  process.exit(1);
});
