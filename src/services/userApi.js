import {apiDelete, apiGet, apiPost} from '../config/apicall';
import {apiPutFormData} from '../config/apicallFormData';
import {PASSENGER_ENDPOINTS, USER_ENDPOINTS} from '../config/endpoints';

export async function getUserProfileApi() {
  return apiGet(USER_ENDPOINTS.PROFILE);
}

export async function getPassengerProfileApi() {
  console.log('\n==========================================');
  console.log(`📤 [API REQUEST] GET ${PASSENGER_ENDPOINTS.PROFILE}`);
  console.log('==========================================');

  const response = await apiGet(PASSENGER_ENDPOINTS.PROFILE);

  console.log('\n==========================================');
  console.log('📥 [API RESPONSE] Get Passenger Profile:');
  console.log(JSON.stringify(response, null, 2));
  console.log('==========================================\n');

  return response;
}

export async function updatePassengerProfileApi(formData) {
  console.log('\n==========================================');
  console.log(`📤 [API REQUEST] PUT ${PASSENGER_ENDPOINTS.PROFILE}`);
  console.log('==========================================');

  const response = await apiPutFormData(PASSENGER_ENDPOINTS.PROFILE, formData);

  console.log('\n==========================================');
  console.log('📥 [API RESPONSE] Update Passenger Profile:');
  console.log(JSON.stringify(response, null, 2));
  console.log('==========================================\n');

  return response;
}

export async function getSavedAddressesApi() {
  console.log('\n==========================================');
  console.log(`📤 [API REQUEST] GET ${PASSENGER_ENDPOINTS.ADDRESSES}`);
  console.log('==========================================');

  const response = await apiGet(PASSENGER_ENDPOINTS.ADDRESSES);

  console.log('\n==========================================');
  console.log('📥 [API RESPONSE] Get Saved Addresses:');
  console.log(JSON.stringify(response, null, 2));
  console.log('==========================================\n');

  return response;
}

export async function addSavedAddressApi({label, address, lat, lng}) {
  console.log('\n==========================================');
  console.log(`📤 [API REQUEST] POST ${PASSENGER_ENDPOINTS.ADDRESSES}`);
  console.log(`📍 Payload:`, {label, address, lat, lng});
  console.log('==========================================');

  const response = await apiPost(PASSENGER_ENDPOINTS.ADDRESSES, {
    label,
    address,
    lat: Number(lat) || 12.9716,
    lng: Number(lng) || 77.5946,
  });

  console.log('\n==========================================');
  console.log('📥 [API RESPONSE] Add Saved Address:');
  console.log(JSON.stringify(response, null, 2));
  console.log('==========================================\n');

  return response;
}

export async function deleteSavedAddressApi(id) {
  const url = `${PASSENGER_ENDPOINTS.ADDRESSES}/${id}`;
  console.log('\n==========================================');
  console.log(`📤 [API REQUEST] DELETE ${url}`);
  console.log('==========================================');

  const response = await apiDelete(url);

  console.log('\n==========================================');
  console.log('📥 [API RESPONSE] Delete Saved Address:');
  console.log(JSON.stringify(response, null, 2));
  console.log('==========================================\n');

  return response;
}

export async function getEmergencyContactsApi() {
  console.log('\n==========================================');
  console.log(`📤 [API REQUEST] GET ${PASSENGER_ENDPOINTS.EMERGENCY_CONTACTS}`);
  console.log('==========================================');

  const response = await apiGet(PASSENGER_ENDPOINTS.EMERGENCY_CONTACTS);

  console.log('\n==========================================');
  console.log('📥 [API RESPONSE] Get Emergency Contacts:');
  console.log(JSON.stringify(response, null, 2));
  console.log('==========================================\n');

  return response;
}

export async function addEmergencyContactApi(payload) {
  console.log('\n==========================================');
  console.log(`📤 [API REQUEST] POST ${PASSENGER_ENDPOINTS.EMERGENCY_CONTACTS}`);
  console.log(`📍 Payload:`, payload);
  console.log('==========================================');

  const response = await apiPost(PASSENGER_ENDPOINTS.EMERGENCY_CONTACTS, payload);

  console.log('\n==========================================');
  console.log('📥 [API RESPONSE] Add Emergency Contact:');
  console.log(JSON.stringify(response, null, 2));
  console.log('==========================================\n');

  return response;
}

export async function deleteEmergencyContactApi(id) {
  const url = `${PASSENGER_ENDPOINTS.EMERGENCY_CONTACTS}/${id}`;
  console.log('\n==========================================');
  console.log(`📤 [API REQUEST] DELETE ${url}`);
  console.log('==========================================');

  const response = await apiDelete(url);

  console.log('\n==========================================');
  console.log('📥 [API RESPONSE] Delete Emergency Contact:');
  console.log(JSON.stringify(response, null, 2));
  console.log('==========================================\n');

  return response;
}

export async function getNearbyDriversApi(params = {}) {
  const lat = params?.latitude ?? 21.1702;
  const lng = params?.longitude ?? 72.8311;
  const url = `${PASSENGER_ENDPOINTS.NEARBY_DRIVERS}?latitude=${lat}&longitude=${lng}`;

  console.log('\n==========================================');
  console.log(`📤 [API REQUEST] GET ${url}`);
  console.log('📍 Location:', {latitude: lat, longitude: lng});
  console.log('==========================================');

  const response = await apiGet(url);

  console.log('\n==========================================');
  console.log('📥 [API RESPONSE] Get Nearby Drivers:');
  console.log(JSON.stringify(response, null, 2));
  console.log('==========================================\n');

  return response;
}


