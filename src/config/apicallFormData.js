import apiClient, {getAuthToken} from './apicall';
import {BASE_URL, STORAGE_KEYS} from './setting';
import {storageGetItem} from '../utils/storage';

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
  const token = await getValidToken();
  const headers = {
    'Content-Type': 'multipart/form-data',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  console.log(`🚀 [API POST FormData] URL: ${BASE_URL}${cleanPath}`);
  console.log(`🔑 [API POST FormData] Token: ${token ? `${token.substring(0, 20)}...` : 'NONE'}`);

  try {
    const res = await apiClient.post(cleanPath, formData, {
      headers,
      transformRequest: (data, headers) => {
        // Retain FormData object as-is for React Native XMLHttpRequest
        return data;
      },
    });
    console.log(`📥 [API POST FormData] Status: ${res.status}`, res.data);
    return res.data;
  } catch (error) {
    const errorData = error?.data || error?.response?.data || {};
    const status = error?.status || error?.response?.status || 500;
    console.error(`❌ [API POST FormData] Error ${status}:`, errorData);
    throw {
      status,
      message: errorData.message || errorData.error || error?.message || 'Upload failed',
      data: errorData,
    };
  }
}

export async function apiPutFormData(path, formData) {
  const token = await getValidToken();
  const headers = {
    'Content-Type': 'multipart/form-data',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  console.log(`🚀 [API PUT FormData] URL: ${BASE_URL}${cleanPath}`);
  console.log(`🔑 [API PUT FormData] Token: ${token ? `${token.substring(0, 20)}...` : 'NONE'}`);

  try {
    const res = await apiClient.put(cleanPath, formData, {
      headers,
      transformRequest: (data, headers) => {
        // Retain FormData object as-is for React Native XMLHttpRequest
        return data;
      },
    });
    console.log(`📥 [API PUT FormData] Status: ${res.status}`, res.data);
    return res.data;
  } catch (error) {
    const errorData = error?.data || error?.response?.data || {};
    const status = error?.status || error?.response?.status || 500;
    console.error(`❌ [API PUT FormData] Error ${status}:`, errorData);
    throw {
      status,
      message: errorData.message || errorData.error || error?.message || 'Upload failed',
      data: errorData,
    };
  }
}
