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

  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers,
    body: formData,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw {
      status: res.status,
      message: data.message || data.error || 'Upload failed',
      data,
    };
  }
  return data;
}
