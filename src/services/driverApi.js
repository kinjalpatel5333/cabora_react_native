import {apiGet, apiPost, apiPut} from '../config/apicall';
import {apiPostFormData, apiPutFormData} from '../config/apicallFormData';
import {DRIVER_ENDPOINTS, DRIVER_ONBOARDING_ENDPOINTS} from '../config/endpoints';

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

export function updateDriverStatusApi(payload) {
  return apiPut(DRIVER_ENDPOINTS.STATUS, payload);
}

export function uploadDriverDocumentsApi(payload) {
  return apiPost(DRIVER_ENDPOINTS.DOCUMENTS, payload);
}

export function getDriverEarningsApi() {
  return apiGet(DRIVER_ENDPOINTS.EARNINGS);
}

export function getDriverKycStatusApi() {
  return apiGet(DRIVER_ENDPOINTS.KYC_STATUS);
}
