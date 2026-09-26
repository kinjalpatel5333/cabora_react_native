import { apiGet, apiPost, apiPut } from '../config/apicall';
import { apiPostFormData, apiPutFormData } from '../config/apicallFormData';
import { DRIVER_ENDPOINTS, DRIVER_ONBOARDING_ENDPOINTS } from '../config/endpoints';

export function registerDriverApi(formData) {
  return apiPostFormData(DRIVER_ENDPOINTS.REGISTRATION, formData);
}

// Onboarding Step APIs matching exact Postman schema
export function saveOnboardingPersonalApi(formData) {
  return apiPutFormData(DRIVER_ONBOARDING_ENDPOINTS.PERSONAL, formData);
}

export function saveOnboardingLicenseApi(formData) {
  return apiPutFormData(DRIVER_ONBOARDING_ENDPOINTS.LICENSE, formData);
}

export function saveOnboardingVehicleApi(formData) {
  return apiPutFormData(DRIVER_ONBOARDING_ENDPOINTS.VEHICLE, formData);
}

export function saveOnboardingInsuranceApi(formData) {
  return apiPutFormData(DRIVER_ONBOARDING_ENDPOINTS.INSURANCE, formData);
}

export function saveOnboardingBankApi(payload) {
  return apiPut(DRIVER_ONBOARDING_ENDPOINTS.BANK, payload);
}

export function submitOnboardingApi() {
  return apiPost(DRIVER_ONBOARDING_ENDPOINTS.SUBMIT);
}

export function getOnboardingStatusApi() {
  return apiGet(DRIVER_ONBOARDING_ENDPOINTS.STATUS);
}

export function getDriverProfileApi() {
  return apiGet(DRIVER_ENDPOINTS.PROFILE);
}

export function updateDriverProfileApi(formData) {
  return apiPutFormData(DRIVER_ONBOARDING_ENDPOINTS.PERSONAL, formData);
}

export function updateDriverStatusApi(payload) {
  return apiPut(DRIVER_ENDPOINTS.STATUS, payload);
}

export function uploadDriverDocumentsApi(payload) {
  return apiPost(DRIVER_ENDPOINTS.DOCUMENTS, payload);
}

export function getDriverEarningsApi(params) {
  return apiGet(DRIVER_ENDPOINTS.EARNINGS, params);
}

export function getDriverIncentivesApi(params) {
  return apiGet(DRIVER_ENDPOINTS.INCENTIVES, params);
}

export function getDriverKycStatusApi() {
  return apiGet(DRIVER_ENDPOINTS.KYC_STATUS);
}

export function setDriverAvailabilityApi(payload) {
  return apiPut(DRIVER_ENDPOINTS.AVAILABILITY, payload);
}

export function getIncomingRequestsApi() {
  return apiGet(DRIVER_ENDPOINTS.INCOMING_REQUESTS);
}

export function acceptRideRequestApi(requestId) {
  const url = typeof DRIVER_ENDPOINTS.ACCEPT_REQUEST === 'function'
    ? DRIVER_ENDPOINTS.ACCEPT_REQUEST(requestId)
    : DRIVER_ENDPOINTS.ACCEPT_REQUEST;
  return apiPost(url, { requestId });
}

export function rejectRideRequestApi(requestId) {
  const url = typeof DRIVER_ENDPOINTS.REJECT_REQUEST === 'function'
    ? DRIVER_ENDPOINTS.REJECT_REQUEST(requestId)
    : DRIVER_ENDPOINTS.REJECT_REQUEST;
  return apiPost(url, { requestId });
}

