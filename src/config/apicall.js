import axios from 'axios';
import {BASE_URL, API_TIMEOUT, STORAGE_KEYS} from './setting';
import {storageGetItem, storageSetItem, storageRemoveItem} from '../utils/storage';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    Pragma: 'no-cache',
    Expires: '0',
  },
});

let authToken = null;

export function setAuthToken(token) {
  authToken = token || null;
  if (token && !String(token).startsWith('local-token-')) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
    storageSetItem(STORAGE_KEYS.token, token).catch(() => {});
  } else if (!token) {
    delete apiClient.defaults.headers.common.Authorization;
    storageRemoveItem(STORAGE_KEYS.token).catch(() => {});
  }
}

export function getAuthToken() {
  return authToken;
}

apiClient.interceptors.request.use(async config => {
  let token = authToken;
  if (!token || String(token).startsWith('local-token-')) {
    try {
      const stored = await storageGetItem(STORAGE_KEYS.token);
      if (stored && !String(stored).startsWith('local-token-')) {
        token = stored;
        authToken = stored;
      }
    } catch (_) {}
  }
  if (token && !String(token).startsWith('local-token-') && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Ensure no cached 304 response is returned
  config.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
  config.headers.Pragma = 'no-cache';
  config.headers.Expires = '0';

  console.log(`\n==========================================`);
  console.log(`🚀 [API REQUEST] ${config.method?.toUpperCase()} ${config.baseURL || ''}${config.url}`);
  if (config.params) console.log(`📋 Params:`, config.params);
  if (config.data) console.log(`📦 Body:`, config.data);
  console.log(`==========================================\n`);

  return config;
});

apiClient.interceptors.response.use(
  response => {
    console.log(`\n==========================================`);
    console.log(`📥 [API RESPONSE] ${response.config?.method?.toUpperCase()} ${response.config?.baseURL || ''}${response.config?.url}`);
    console.log(`Status: ${response.status}`);
    console.log(`Response Data:`, response.data);
    console.log(`==========================================\n`);
    return response;
  },
  error => {
    const errorData = error?.response?.data;
    let message = 'Something went wrong';

    if (typeof errorData?.error === 'string') {
      message = errorData.error;
    } else if (typeof errorData?.error?.message === 'string') {
      message = errorData.error.message;
    } else if (typeof errorData?.message === 'string') {
      message = errorData.message;
    } else if (typeof errorData?.message?.message === 'string') {
      message = errorData.message.message;
    } else if (typeof error?.message === 'string') {
      message = error.message;
    } else if (errorData) {
      try {
        message = JSON.stringify(errorData);
      } catch (_) {
        message = 'Something went wrong';
      }
    }

    console.log(`\n==========================================`);
    console.error(`❌ [API ERROR] ${error?.config?.method?.toUpperCase()} ${error?.config?.baseURL || ''}${error?.config?.url}`);
    console.error(`Status: ${error?.response?.status}`);
    console.error(`Error Data:`, errorData || error?.message);
    console.log(`==========================================\n`);

    return Promise.reject({
      status: error?.response?.status,
      message: String(message),
      data: errorData,
    });
  },
);

export async function apiGet(url, params, config) {
  const res = await apiClient.get(url, {
    ...config,
    params: {
      _t: Date.now(),
      ...params,
    },
  });
  return res.data;
}

export async function apiPost(url, body, config) {
  const res = await apiClient.post(url, body, config);
  return res.data;
}

export async function apiPut(url, body, config) {
  const res = await apiClient.put(url, body, config);
  return res.data;
}

export async function apiPatch(url, body, config) {
  const res = await apiClient.patch(url, body, config);
  return res.data;
}

export async function apiDelete(url, config) {
  const res = await apiClient.delete(url, config);
  return res.data;
}

export default apiClient;
