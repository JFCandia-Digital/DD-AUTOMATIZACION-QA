// En src/api-test/support/apiClient.ts
import axios, { AxiosRequestConfig, Method } from 'axios';
import { apiContext } from './apiContext';
import { logApiResponse } from './logger';
import FormData from 'form-data';


export function buildAuthConfig(authType: string): AxiosRequestConfig['headers'] {
    const headers: AxiosRequestConfig['headers'] = {};
    switch (authType.toLowerCase()) {
        case 'válido':
            headers['Authorization'] = `Bearer ${apiContext.token}`;
            break;
        case 'inválido':
            headers['Authorization'] = 'Bearer token-invalido-123';
            break;
        case 'expirado':
            headers['Authorization'] = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhY3IiOnsiaWQiOjg4Mywibm9tYnJlcyI6IkFQSSBQb2xpY8OtYSBkZSBJbnZlc3RpZ2FjaW9uZXMgZGUgQ2hpbGUiLCJhcGVsbGlkb3MiOiJQREkiLCJlbnRpZGFkSWQiOjY2LCJlbnRpZGFkTm9tYnJlIjoiUG9saWPDrWEgZGUgSW52ZXN0aWdhY2lvbmVzIGRlIENoaWxlIiwiZW50aWRhZFNpZ2xhIjoiUERJIiwiY29udGV4dFR5cGUiOiJDVFhfQVBJIn0sInJvbGVzIjpbIlJPTEVfQVBJIl0sImp0aSI6IjAyYmU1ODY5LTNjMzQtNGIwMC04OTU2LTQ2ZDczZDg5NzE5NSIsImlzcyI6ImRvY3YzLnRlc3QuZGlnaXRhbC5nb2IuY2wiLCJpYXQiOjE3NTkzMzQ5MjUsImV4cCI6MTc1OTMzODUyNX0.GUzbf5kDi9JyxfSQy1J8559GJiPaw8wXxNuREgysUR4';
            break;
        case 'nulo':
            break;
        default:
            throw new Error(`Tipo de autenticación no reconocido: ${authType}`);
    }
    return headers;
}

// Función genérica para enviar peticiones
async function sendRequest(config: AxiosRequestConfig, requestBody: any = null) {

    apiContext.attachData = {
        method: config.method?.toUpperCase(),
        url: config.url,
        requestBody: requestBody,
        statusCode: undefined,
        responseBody: undefined,
        authorizationHeader: config.headers?.Authorization as string || 'N/A (Omitido)'
    };
    apiContext.requestTimestamp = new Date();

    try {
        const response = await axios(config);
        apiContext.response = response;
        // Guarda respuesta en caso de éxito
        apiContext.attachData.statusCode = response.status;
        apiContext.attachData.responseBody = response.data;
        logApiResponse(apiContext.response);
    } catch (error: any) {
        // Manejo de errores consistente
        if (error.response) {
            apiContext.response = error.response;
            apiContext.attachData.statusCode = error.response.status;
            apiContext.attachData.responseBody = error.response.data;
            logApiResponse(apiContext.response, true);
        } else {
            console.error("Error de Red:", error.message);
            apiContext.response = { status: 503, data: { error: "Network Error", message: error.message } };
            apiContext.attachData.statusCode = 503;
            apiContext.attachData.responseBody = apiContext.response.data;
            logApiResponse(apiContext.response, true);
        }
    }
}

/**
 * Realiza una petición de autenticación (OAuth) y guarda el resultado.
 * No guarda el token en el contexto automáticamente, permitiendo probar fallos.
 */
export async function sendAuthRequest(username: string, password: string) {
    const config: AxiosRequestConfig = {
        method: 'POST',
        url: `${process.env.API_BASEURL}/oauth/token`,
        auth: {
            username: username,
            password: password
        },
        data: null
    };

    const reportableBody = { auth: `Basic ${username}` };
    await sendRequest(config, reportableBody);
}

export async function sendGetRequest(endpoint: string, authType: string) {
    const config: AxiosRequestConfig = {
        method: 'GET',
        url: `${process.env.API_BASEURL}${endpoint}`,
        headers: buildAuthConfig(authType)
    };
    await sendRequest(config, null);
}

export async function sendPostRequestWithJson(endpoint: string, authType: string, jsonData: any) {
    const config: AxiosRequestConfig = {
        method: 'POST',
        url: `${process.env.API_BASEURL}${endpoint}`,
        headers: { ...buildAuthConfig(authType), 'Content-Type': 'application/json' },
        data: jsonData
    };
    await sendRequest(config, jsonData);
}

export async function sendPostMultipartRequest(endpoint: string, authType: string, formData: FormData) {
    const headers = { ...buildAuthConfig(authType), ...formData.getHeaders() };
    const config: AxiosRequestConfig = {
        method: 'POST',
        url: `${process.env.API_BASEURL}${endpoint}`,
        headers: headers,
        data: formData
    };
    const reportableBody = apiContext.attachData.requestBody;
    await sendRequest(config, reportableBody);
}

export async function sendPutRequest(endpoint: string, authType: string, jsonData: any = null) {
    const config: AxiosRequestConfig = {
        method: 'PUT',
        url: `${process.env.API_BASEURL}${endpoint}`,
        headers: { ...buildAuthConfig(authType), 'Content-Type': 'application/json' },
        data: jsonData
    };
    await sendRequest(config, jsonData);
}