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
  ADDRESSES: '/api/v1/passenger/addresses',
};

export const WALLET_ENDPOINTS = {
  BALANCE: '/api/v1/wallet/balance',
  ADD_MONEY: '/api/v1/wallet/add-money',
};

export const USER_ENDPOINTS = {
  PROFILE: '/api/v1/passenger/profile',
  UPDATE_PROFILE: '/api/v1/passenger/profile',
};

export const DRIVER_ONBOARDING_ENDPOINTS = {
  PERSONAL: '/api/v1/driver/onboarding/personal',
  LICENSE: '/api/v1/driver/onboarding/license',
  VEHICLE: '/api/v1/driver/onboarding/vehicle',
  INSURANCE: '/api/v1/driver/onboarding/insurance',
  BANK: '/api/v1/driver/onboarding/bank',
  STATUS: '/api/v1/driver/onboarding/status',
  SUBMIT: '/api/v1/driver/onboarding/submit',
};

export const DRIVER_ENDPOINTS = {
  REGISTRATION: '/api/v1/driver/registration',
  PROFILE: '/api/v1/driver/profile',
  STATUS: '/api/v1/driver/status',
  KYC_STATUS: '/api/v1/driver/kyc/status',
  DOCUMENTS: '/api/v1/driver/documents',
  EARNINGS: '/api/v1/driver/earnings',
  ONBOARDING: DRIVER_ONBOARDING_ENDPOINTS,
};

export const ENDPOINTS = {
  AUTH: AUTH_ENDPOINTS,
  PASSENGER: PASSENGER_ENDPOINTS,
  USER: USER_ENDPOINTS,
  DRIVER: DRIVER_ENDPOINTS,
};

// Flattened endpoints map for backwards compatibility
export const endpoints = {
  sendOtp: AUTH_ENDPOINTS.SEND_OTP,
  verifyOtp: AUTH_ENDPOINTS.VERIFY_OTP,
  login: AUTH_ENDPOINTS.LOGIN,
  signup: AUTH_ENDPOINTS.REGISTER,
  passengerProfile: PASSENGER_ENDPOINTS.PROFILE,
  driverRegistration: DRIVER_ENDPOINTS.REGISTRATION,
  ...AUTH_ENDPOINTS,
};

export default ENDPOINTS;
