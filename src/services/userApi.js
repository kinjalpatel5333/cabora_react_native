import { apiDelete, apiGet, apiPost, apiPut } from '../config/apicall';
import { apiPutFormData } from '../config/apicallFormData';
import { PASSENGER_ENDPOINTS, USER_ENDPOINTS } from '../config/endpoints';
import store from '../redux/store';

function isDriverSession() {
  try {
    const user = store.getState()?.auth?.user;
    const role = (user?.currentRole || user?.role || '').toLowerCase();
    return role === 'driver' || user?.isDriver === true;
  } catch (e) {
    return false;
  }
}

export async function getUserProfileApi() {
  return apiGet(USER_ENDPOINTS.PROFILE);
}

export async function getPassengerProfileApi() {
  if (isDriverSession()) {
    console.log('⚠️ [API SKIPPED] getPassengerProfileApi skipped for driver user');
    return { success: false, isDriver: true };
  }

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
  if (isDriverSession()) {
    console.log('⚠️ [API SKIPPED] updatePassengerProfileApi skipped for driver user');
    return { success: false, isDriver: true };
  }

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
  if (isDriverSession()) {
    console.log('⚠️ [API SKIPPED] getSavedAddressesApi skipped for driver user');
    return { success: false, isDriver: true, data: [] };
  }

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

export async function addSavedAddressApi({ label, address, lat, lng }) {
  if (isDriverSession()) {
    console.log('⚠️ [API SKIPPED] addSavedAddressApi skipped for driver user');
    return { success: false, isDriver: true };
  }

  console.log('\n==========================================');
  console.log(`📤 [API REQUEST] POST ${PASSENGER_ENDPOINTS.ADDRESSES}`);
  console.log(`📍 Payload:`, { label, address, lat, lng });
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
  if (isDriverSession()) {
    console.log('⚠️ [API SKIPPED] deleteSavedAddressApi skipped for driver user');
    return { success: false, isDriver: true };
  }

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
  if (isDriverSession()) {
    console.log('⚠️ [API SKIPPED] getEmergencyContactsApi skipped for driver user');
    return { success: false, isDriver: true, data: [] };
  }

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
  if (isDriverSession()) {
    console.log('⚠️ [API SKIPPED] addEmergencyContactApi skipped for driver user');
    return { success: false, isDriver: true };
  }

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
  if (isDriverSession()) {
    console.log('⚠️ [API SKIPPED] deleteEmergencyContactApi skipped for driver user');
    return { success: false, isDriver: true };
  }

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
  if (isDriverSession()) {
    console.log('⚠️ [API SKIPPED] getNearbyDriversApi skipped for driver user');
    return { success: false, isDriver: true, drivers: [] };
  }

  const lat = params?.latitude ?? 21.1702;
  const lng = params?.longitude ?? 72.8311;
  const url = `${PASSENGER_ENDPOINTS.NEARBY_DRIVERS}?latitude=${lat}&longitude=${lng}`;

  console.log('\n==========================================');
  console.log(`📤 [API REQUEST] GET ${url}`);
  console.log('📍 Location:', { latitude: lat, longitude: lng });
  console.log('==========================================');

  const response = await apiGet(url);

  console.log('\n==========================================');
  console.log('📥 [API RESPONSE] Get Nearby Drivers:');
  console.log(JSON.stringify(response, null, 2));
  console.log('==========================================\n');

  return response;
}

export async function getPassengerCurrentLocationApi() {
  if (isDriverSession()) {
    console.log('⚠️ [API SKIPPED] getPassengerCurrentLocationApi (/api/v1/passenger/current-location) skipped for driver user');
    return { success: false, isDriver: true };
  }

  console.log('\n==========================================');
  console.log(`📤 [API REQUEST] GET ${PASSENGER_ENDPOINTS.CURRENT_LOCATION}`);
  console.log('==========================================');

  const response = await apiGet(PASSENGER_ENDPOINTS.CURRENT_LOCATION);

  console.log('\n==========================================');
  console.log('📥 [API RESPONSE] Get Current Location:');
  console.log(JSON.stringify(response, null, 2));
  console.log('==========================================\n');

  return response;
}

export async function updatePassengerCurrentLocationApi({ lat, long, address }) {
  if (isDriverSession()) {
    console.log('⚠️ [API SKIPPED] updatePassengerCurrentLocationApi (/api/v1/passenger/current-location) skipped for driver user');
    return { success: false, isDriver: true };
  }

  const payload = {
    lat: Number(lat) || 21.1702,
    long: Number(long) || 72.8311,
    address: address || 'Varachha, Surat, Gujarat',
  };

  console.log('\n==========================================');
  console.log(`📤 [API REQUEST] PUT ${PASSENGER_ENDPOINTS.CURRENT_LOCATION}`);
  console.log('📍 Payload:', payload);
  console.log('==========================================');

  const response = await apiPut(PASSENGER_ENDPOINTS.CURRENT_LOCATION, payload);

  console.log('\n==========================================');
  console.log('📥 [API RESPONSE] Update Current Location:');
  console.log(JSON.stringify(response, null, 2));
  console.log('==========================================\n');

  return response;
}


