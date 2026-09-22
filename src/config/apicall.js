import axios from 'axios';
import {BASE_URL, API_TIMEOUT} from './setting';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

let authToken = null;

export function setAuthToken(token) {
  authToken = token || null;
  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common.Authorization;
  }
}

export function getAuthToken() {
  return authToken;
}

apiClient.interceptors.request.use(config => {
  if (authToken && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  response => response,
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

    return Promise.reject({
      status: error?.response?.status,
      message: String(message),
      data: errorData,
    });
  },
);

export async function apiGet(url, params, config) {
  const res = await apiClient.get(url, {...config, params});
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
