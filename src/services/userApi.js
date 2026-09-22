import {apiGet, apiPut} from '../config/apicall';
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

  const response = await apiPut(PASSENGER_ENDPOINTS.PROFILE, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  console.log('\n==========================================');
  console.log('📥 [API RESPONSE] Update Passenger Profile:');
  console.log(JSON.stringify(response, null, 2));
  console.log('==========================================\n');

  return response;
}

export function updateUserProfileApi(payload) {
  return updatePassengerProfileApi(payload);
}

