import {apiGet, apiPost} from '../config/apicall';
import {RIDE_ENDPOINTS} from '../config/endpoints';

export async function rateRideApi(rideId, {rating, comment}) {
  const id = rideId || '6aa28cc7e02cb357dd298432';
  const url = RIDE_ENDPOINTS.RATE(id);

  console.log('\n==========================================');
  console.log(`📤 [API REQUEST] POST ${url}`);
  console.log('📍 Payload:', {rating: Number(rating) || 5, comment: comment || 'Great ride'});
  console.log('==========================================');

  const response = await apiPost(url, {
    rating: Number(rating) || 5,
    comment: comment || 'Great ride',
  });

  console.log('\n==========================================');
  console.log('📥 [API RESPONSE] Rate Ride:');
  console.log(JSON.stringify(response, null, 2));
  console.log('==========================================\n');

  return response;
}

export async function triggerRideSosApi(rideId, payload) {
  const id = rideId || '6aa15a09aa3588cc94a5c3c4';
  const url = RIDE_ENDPOINTS.SOS(id);

  const requestBody = {
    latitude: Number(payload?.latitude) || 23.03,
    longitude: Number(payload?.longitude) || 72.52,
    message: payload?.message || 'Need assistance',
  };

  console.log('\n==========================================');
  console.log(`📤 [API REQUEST] POST ${url}`);
  console.log('📍 Payload:', requestBody);
  console.log('==========================================');

  const response = await apiPost(url, requestBody);

  console.log('\n==========================================');
  console.log('📥 [API RESPONSE] Ride SOS Trigger:');
  console.log(JSON.stringify(response, null, 2));
  console.log('==========================================\n');

  return response;
}

export function estimateRideApi(payload) {
  return apiPost(RIDE_ENDPOINTS.ESTIMATE, payload);
}

export function bookRideApi(payload) {
  return apiPost(RIDE_ENDPOINTS.BOOK, payload);
}

export function cancelRideApi(payload) {
  return apiPost(RIDE_ENDPOINTS.CANCEL, payload);
}

export function trackRideApi(rideId) {
  return apiGet(`${RIDE_ENDPOINTS.TRACK}/${rideId}`);
}
