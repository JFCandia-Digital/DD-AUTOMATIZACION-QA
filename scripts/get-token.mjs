/**
 * Obtiene y muestra el access_token para Swagger / pruebas manuales.
 * Uso: npm run get-token
 */
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config({ path: '.env.api' });

const baseUrl = process.env.API_BASEURL;
const clientId = process.env.CLIENT_ID_PDI;
const clientSecret = process.env.CLIENT_SECRET_PDI;

if (!baseUrl || !clientId || !clientSecret) {
  console.error('❌ Revisa .env.api: API_BASEURL, CLIENT_ID_PDI, CLIENT_SECRET_PDI');
  process.exit(1);
}

const res = await axios.post(`${baseUrl}/oauth/token`, null, {
  auth: { username: clientId, password: clientSecret },
});

const token = res.data.access_token;

console.log('\n✅ Token obtenido (copia todo lo de abajo para Swagger):\n');
console.log(token);
console.log('\n📋 En Swagger → Authorize → Bearer <pega el token>\n');
