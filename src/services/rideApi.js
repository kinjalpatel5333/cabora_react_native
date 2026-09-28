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

export async function estimateRideApi(payload) {
  const url = RIDE_ENDPOINTS.ESTIMATE;

  const requestBody = {
    pickup: {
      lat: Number(payload?.pickup?.lat) || 23.03,
      lng: Number(payload?.pickup?.lng ?? payload?.pickup?.long) || 72.52,
      address: payload?.pickup?.address || 'Satellite, Ahmedabad',
    },
    destination: {
      lat: Number(payload?.destination?.lat) || 19.076,
      lng: Number(payload?.destination?.lng ?? payload?.destination?.long) || 72.8777,
      address: payload?.destination?.address || 'Mumbai, Maharashtra, India',
    },
    vehicleTypeId: payload?.vehicleTypeId || 'vt_1',
    promoCode: payload?.promoCode || 'WELCOME10',
  };

  console.log('\n==========================================');
  console.log(`📤 [API REQUEST] POST ${url}`);
  console.log('📍 Payload:', JSON.stringify(requestBody, null, 2));
  console.log('==========================================');

  try {
    const response = await apiPost(url, requestBody);

    console.log('\n==========================================');
    console.log('📥 [API RESPONSE] Ride Estimate:');
    console.log(JSON.stringify(response, null, 2));
    console.log('==========================================\n');

    return response;
  } catch (error) {
    console.warn('⚠️ [API ERROR] Ride Estimate Failed:', error);
    throw error;
  }
}

export async function bookRideApi(payload) {
  const url = RIDE_ENDPOINTS.BOOK;

  const requestBody = {
    pickup: {
      lat: Number(payload?.pickup?.lat) || 21.1702,
      lng: Number(payload?.pickup?.lng ?? payload?.pickup?.long) || 72.8311,
      address: payload?.pickup?.address || 'Surat Railway Station',
    },
    destination: {
      lat: Number(payload?.destination?.lat) || 21.19,
      lng: Number(payload?.destination?.lng ?? payload?.destination?.long) || 72.845,
      address: payload?.destination?.address || 'Varachha Main Road',
    },
    vehicleTypeId: payload?.vehicleTypeId || payload?.vehicleType || 'SEDAN',
    paymentMethod: (payload?.paymentMethod || 'CASH').toUpperCase(),
  };

  console.log('\n==========================================');
  console.log(`📤 [API REQUEST] POST ${url}`);
  console.log('📍 Payload:', JSON.stringify(requestBody, null, 2));
  console.log('==========================================');

  try {
    const response = await apiPost(url, requestBody);

    console.log('\n==========================================');
    console.log('📥 [API RESPONSE] Book Ride:');
    console.log(JSON.stringify(response, null, 2));
    console.log('==========================================\n');

    return response;
  } catch (error) {
    console.warn('⚠️ [API ERROR] Book Ride Failed:', error);
    throw error;
  }
}

export async function cancelRideApi(rideId, payload) {
  const id = (typeof rideId === 'string' ? rideId : rideId?.rideId) || '6aa28cc7e02cb357dd298432';
  const reason = (typeof rideId === 'object' ? rideId?.reason : payload?.reason) || 'Changed plans';
  const url = typeof RIDE_ENDPOINTS.CANCEL === 'function' ? RIDE_ENDPOINTS.CANCEL(id) : `/api/v1/rides/${id}/cancel`;

  const requestBody = {
    reason,
  };

  console.log('\n==========================================');
  console.log(`📤 [API REQUEST] POST ${url}`);
  console.log('📍 Payload:', JSON.stringify(requestBody, null, 2));
  console.log('==========================================');

  try {
    const response = await apiPost(url, requestBody);

    console.log('\n==========================================');
    console.log('📥 [API RESPONSE] Cancel Ride:');
    console.log(JSON.stringify(response, null, 2));
    console.log('==========================================\n');

    return response;
  } catch (error) {
    console.warn('⚠️ [API ERROR] Cancel Ride Failed:', error);
    throw error;
  }
}

export function trackRideApi(rideId) {
  return apiGet(`${RIDE_ENDPOINTS.TRACK}/${rideId}`);
}
