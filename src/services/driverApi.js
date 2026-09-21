import {apiGet, apiPost, apiPut} from '../config/apicall';
import {DRIVER_ENDPOINTS} from '../config/endpoints';

export function getDriverProfileApi() {
  return apiGet(DRIVER_ENDPOINTS.PROFILE);
}

export function updateDriverStatusApi(payload) {
  return apiPut(DRIVER_ENDPOINTS.STATUS, payload);
}

export function uploadDriverDocumentsApi(payload) {
  return apiPost(DRIVER_ENDPOINTS.DOCUMENTS, payload);
}

export function getDriverEarningsApi() {
  return apiGet(DRIVER_ENDPOINTS.EARNINGS);
}
