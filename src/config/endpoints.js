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
  EMERGENCY_CONTACTS: '/api/v1/passenger/emergency-contacts',
  NEARBY_DRIVERS: '/api/v1/passenger/nearby-drivers',
  CURRENT_LOCATION: '/api/v1/passenger/current-location',
};

export const WALLET_ENDPOINTS = {
  BALANCE: '/api/v1/wallet/balance',
  ADD_MONEY: '/api/v1/wallet/add-money',
};

export const PAYMENT_ENDPOINTS = {
  CHARGE: '/api/v1/payments/charge',
};

export const RIDE_ENDPOINTS = {
  RATE: rideId => `/api/v1/rides/${rideId}/rate`,
  SOS: rideId => `/api/v1/rides/${rideId}/sos`,
  ESTIMATE: '/api/v1/rides/estimate',
  BOOK: '/api/v1/rides/book',
  CANCEL: rideId => (rideId ? `/api/v1/rides/${rideId}/cancel` : '/api/v1/rides/cancel'),
  TRACK: '/api/v1/rides/track',
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
  AVAILABILITY: '/api/v1/driver/availability',
  KYC_STATUS: '/api/v1/driver/kyc/status',
  DOCUMENTS: '/api/v1/driver/documents',
  EARNINGS: '/api/v1/driver/earnings',
  INCENTIVES: '/api/v1/driver/incentives',
  INCOMING_REQUESTS: '/api/v1/driver/requests/incoming',
  ACCEPT_REQUEST: id => (id ? `/api/v1/driver/requests/${id}/accept` : '/api/v1/driver/requests/accept'),
  REJECT_REQUEST: id => (id ? `/api/v1/driver/requests/${id}/reject` : '/api/v1/driver/requests/reject'),
  ONBOARDING: DRIVER_ONBOARDING_ENDPOINTS,
};

export const ENDPOINTS = {
  AUTH: AUTH_ENDPOINTS,
  PASSENGER: PASSENGER_ENDPOINTS,
  USER: USER_ENDPOINTS,
  DRIVER: DRIVER_ENDPOINTS,
  PAYMENT: PAYMENT_ENDPOINTS,
  WALLET: WALLET_ENDPOINTS,
  RIDE: RIDE_ENDPOINTS,
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
