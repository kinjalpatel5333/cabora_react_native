import {apiGet} from './apicall';
import {
  endpoints,
  ENDPOINTS,
  AUTH_ENDPOINTS,
  USER_ENDPOINTS,
  DRIVER_ENDPOINTS,
  RIDE_ENDPOINTS,
} from './endpoints';

export {
  endpoints,
  ENDPOINTS,
  AUTH_ENDPOINTS,
  USER_ENDPOINTS,
  DRIVER_ENDPOINTS,
  RIDE_ENDPOINTS,
};
export * from '../services/authApi';
export * from '../services/userApi';
export * from '../services/driverApi';
export * from '../services/rideApi';

export function profileApi() {
  return apiGet(USER_ENDPOINTS.PROFILE);
}

export function keywordSearchApi(payload) {
  return apiGet(endpoints.keywordSearch, payload);
}
