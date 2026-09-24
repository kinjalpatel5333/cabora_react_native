import { apiGet, apiPost } from '../config/apicall';
import { AUTH_ENDPOINTS } from '../config/endpoints';

/**
 * Request an OTP for a mobile number
 * @param {Object} params
 * @param {string} params.mobile - Mobile number
 * @param {string} [params.countryCode='+91'] - Country dial code with leading +
 * @returns {Promise<any>}
 */
export async function sendOtpApi({ mobile, countryCode = '+91' }) {
  const formattedMobile = String(mobile).trim();
  const formattedCountryCode = String(countryCode).trim();

  console.log('\n==========================================');
  console.log(`📤 [API REQUEST] POST ${AUTH_ENDPOINTS.SEND_OTP}`);
  console.log(`📱 Mobile: ${formattedCountryCode} ${formattedMobile}`);
  console.log('==========================================');

  const response = await apiPost(AUTH_ENDPOINTS.SEND_OTP, {
    mobile: formattedMobile,
    countryCode: formattedCountryCode,
  });

  const otp =
    response?.data?.otp ||
    response?.otp ||
    response?.data?.data?.otp ||
    response?.code ||
    response?.data?.code;

  console.log('\n==========================================');
  console.log('📥 [API RESPONSE] Send OTP Success:');
  console.log(JSON.stringify(response, null, 2));
  if (otp) {
    console.log(`🔑 >>> YOUR OTP IS: [ ${otp} ] <<<`);
  }
  console.log('==========================================\n');

  return response;
}

/**
 * Verify submitted OTP
 * @param {Object} params
 * @param {string} params.mobile - 10-digit Mobile number
 * @param {string} [params.countryCode='+91'] - Country dial code with leading +
 * @param {string} params.otp - 6-digit OTP string
 * @returns {Promise<any>}
 */
export async function verifyOtpApi({ mobile, countryCode = '+91', otp }) {
  const formattedMobile = String(mobile || '').trim();
  const formattedCountryCode = String(countryCode || '+91').trim();
  const formattedOtp = String(otp || '').trim();

  const payload = {
    mobile: formattedMobile,
    countryCode: formattedCountryCode,
    otp: formattedOtp,
  };

  console.log('\n==========================================');
  console.log(`📤 [API REQUEST] POST ${AUTH_ENDPOINTS.VERIFY_OTP}`);
  console.log('📍 Payload:', payload);
  console.log('==========================================');

  const response = await apiPost(AUTH_ENDPOINTS.VERIFY_OTP, payload);

  console.log('\n==========================================');
  console.log('📥 [API RESPONSE] Verify OTP Success:');
  console.log(JSON.stringify(response, null, 2));
  console.log('==========================================\n');

  return response;
}

/**
 * Select user role (PASSENGER / DRIVER)
 * @param {Object} params
 * @param {string} params.userId
 * @param {'PASSENGER'|'DRIVER'} params.role
 * @returns {Promise<any>}
 */
export async function selectRoleApi({ userId, role }) {
  const formattedRole = String(role || '').toUpperCase().trim();
  const formattedUserId = String(userId || '').trim();

  console.log('\n==========================================');
  console.log(`📤 [API REQUEST] POST ${AUTH_ENDPOINTS.SELECT_ROLE}`);
  console.log(`👤 userId: ${formattedUserId}`);
  console.log(`🏷️  role: ${formattedRole}`);
  console.log('==========================================');

  const response = await apiPost(AUTH_ENDPOINTS.SELECT_ROLE, {
    userId: formattedUserId,
    role: formattedRole,
  });

  console.log('\n==========================================');
  console.log('📥 [API RESPONSE] Select Role Success:');
  console.log(JSON.stringify(response, null, 2));
  console.log('==========================================\n');

  return response;
}

/**
 * Fetch authenticated user details and profile
 * @returns {Promise<any>}
 */
export async function getMeApi() {
  console.log('\n==========================================');
  console.log(`📤 [API REQUEST] GET ${AUTH_ENDPOINTS.ME}`);
  console.log('==========================================');

  const response = await apiGet(AUTH_ENDPOINTS.ME);

  console.log('\n==========================================');
  console.log('📥 [API RESPONSE] Get Me Success:');
  console.log(JSON.stringify(response, null, 2));
  console.log('==========================================\n');

  return response;
}

/**
 * User login
 * @param {Object} payload
 * @returns {Promise<any>}
 */
export function loginApi(payload) {
  return apiPost(AUTH_ENDPOINTS.LOGIN, payload);
}

/**
 * User registration
 * @param {Object} payload
 * @returns {Promise<any>}
 */
export function signupApi(payload) {
  return apiPost(AUTH_ENDPOINTS.REGISTER, payload);
}

/**
 * User logout
 * @param {Object} [payload]
 * @param {string} [payload.deviceId='device_123']
 * @returns {Promise<any>}
 */
export async function logoutApi(payload = { deviceId: 'device_123' }) {
  const body = payload || { deviceId: 'device_123' };

  console.log('\n==========================================');
  console.log(`📤 [API REQUEST] POST ${AUTH_ENDPOINTS.LOGOUT}`);
  console.log(`📍 Payload:`, body);
  console.log('==========================================');

  const response = await apiPost(AUTH_ENDPOINTS.LOGOUT, body);

  console.log('\n==========================================');
  console.log('📥 [API RESPONSE] Logout Success:');
  console.log(JSON.stringify(response, null, 2));
  console.log('==========================================\n');

  return response;
}
