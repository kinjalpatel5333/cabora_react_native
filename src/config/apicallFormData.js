import {BASE_URL, API_TIMEOUT} from './setting';
import {getAuthToken} from './apicall';

export async function apiPostFormData(path, formData) {
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'multipart/form-data',
  };
  const token = getAuthToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  console.log(`🚀 [API POST FormData] URL: ${BASE_URL}${path}`);

  const res = await fetch(`${BASE_URL}${path}`, {
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
    'Content-Type': 'multipart/form-data',
  };
  const token = getAuthToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  console.log(`🚀 [API PUT FormData] URL: ${BASE_URL}${path}`);

  const res = await fetch(`${BASE_URL}${path}`, {
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
