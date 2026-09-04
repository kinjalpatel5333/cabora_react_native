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
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      'Something went wrong';
    return Promise.reject({
      status: error?.response?.status,
      message,
      data: error?.response?.data,
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
