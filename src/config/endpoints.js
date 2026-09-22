/**
 * API Endpoints Configuration
 * Categorized by domain/feature with full endpoint paths.
 */

export const AUTH_ENDPOINTS = {
  SEND_OTP: '/api/v1/auth/otp/send',
  VERIFY_OTP: '/api/v1/auth/otp/verify',
  SELECT_ROLE: '/api/v1/auth/select-role',
  ME: '/api/v1/auth/me',
  LOGIN: '/api/v1/auth/login',
  REGISTER: '/api/v1/auth/register',
  REFRESH_TOKEN: '/api/v1/auth/refresh-token',
  LOGOUT: '/api/v1/auth/logout',
};

export const PASSENGER_ENDPOINTS = {
  PROFILE: '/api/v1/passenger/profile',
};

export const USER_ENDPOINTS = {
  PROFILE: '/api/v1/passenger/profile',
  UPDATE_PROFILE: '/api/v1/passenger/profile',
};

export const ENDPOINTS = {
  AUTH: AUTH_ENDPOINTS,
  PASSENGER: PASSENGER_ENDPOINTS,
  USER: USER_ENDPOINTS,
};

// Flattened endpoints map for backwards compatibility
export const endpoints = {
  sendOtp: AUTH_ENDPOINTS.SEND_OTP,
  verifyOtp: AUTH_ENDPOINTS.VERIFY_OTP,
  login: AUTH_ENDPOINTS.LOGIN,
  signup: AUTH_ENDPOINTS.REGISTER,
  passengerProfile: PASSENGER_ENDPOINTS.PROFILE,
  ...AUTH_ENDPOINTS,
};

export default ENDPOINTS;
