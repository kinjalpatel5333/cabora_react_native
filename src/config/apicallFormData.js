import {BASE_URL} from './setting';
import {getAuthToken} from './apicall';
import {storageGetItem} from '../utils/storage';
import {STORAGE_KEYS} from './setting';

async function getValidToken() {
  let token = getAuthToken();
  if (!token || String(token).startsWith('local-token-')) {
    try {
      const stored = await storageGetItem(STORAGE_KEYS.token);
      if (stored && !String(stored).startsWith('local-token-')) {
        token = stored;
      }
    } catch (_) {}
  }
  return token && !String(token).startsWith('local-token-') ? token : null;
}

export async function apiPostFormData(path, formData) {
  const headers = {
    Accept: 'application/json',
  };
  const token = await getValidToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const cleanBase = (BASE_URL || '').endsWith('/')
    ? BASE_URL.slice(0, -1)
    : BASE_URL;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const fullUrl = `${cleanBase}${cleanPath}`;

  console.log(`🚀 [API POST FormData] URL: ${fullUrl}`);

  const res = await fetch(fullUrl, {
    method: 'POST',
    headers,
    body: formData,
  });

  const data = await res.json().catch(() => ({}));
  console.log(`📥 [API POST FormData] Status: ${res.status}`, data);

  if (!res.ok) {
    console.error(`❌ [API POST FormData] Error ${res.status}:`, data);
    throw {
      status: res.status,
      message: data.message || data.error || 'Upload failed',
      data,
    };
  }
  return data;
}

export async function apiPutFormData(path, formData) {
  const headers = {
    Accept: 'application/json',
  };
  const token = await getValidToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const cleanBase = (BASE_URL || '').endsWith('/')
    ? BASE_URL.slice(0, -1)
    : BASE_URL;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const fullUrl = `${cleanBase}${cleanPath}`;

  console.log(`🚀 [API PUT FormData] URL: ${fullUrl}`);

  const res = await fetch(fullUrl, {
    method: 'PUT',
    headers,
    body: formData,
  });

  const data = await res.json().catch(() => ({}));
  console.log(`📥 [API PUT FormData] Status: ${res.status}`, data);

  if (!res.ok) {
    console.error(`❌ [API PUT FormData] Error ${res.status}:`, data);
    throw {
      status: res.status,
      message: data.message || data.error || 'Upload failed',
      data,
    };
  }
  return data;
}
