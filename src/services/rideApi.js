import {apiGet, apiPost} from '../config/apicall';
import {RIDE_ENDPOINTS} from '../config/endpoints';

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
