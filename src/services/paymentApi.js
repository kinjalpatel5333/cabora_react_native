import {apiPost} from '../config/apicall';
import {PAYMENT_ENDPOINTS} from '../config/endpoints';

/**
 * Charge trip payment
 * @param {Object} payload
 * @param {string} payload.tripId - Ride/Trip ID (e.g. 'ride_123')
 * @param {number} payload.amount - Payment amount (e.g. 132)
 * @param {string} [payload.currency='INR'] - Currency code
 * @param {string} [payload.paymentMethod='UPI'] - Payment method (UPI, CASH, CARD, WALLET)
 * @param {string} [payload.idempotencyKey] - Unique key to prevent double charge
 * @returns {Promise<any>}
 */
export async function chargeTripPaymentApi(payload) {
  const url = PAYMENT_ENDPOINTS?.CHARGE || '/api/v1/payments/charge';

  const tripId = payload?.tripId || payload?.rideId || 'ride_123';
  const amount = Number(payload?.amount) || 132;
  const currency = payload?.currency || 'INR';
  const paymentMethod = String(payload?.paymentMethod || 'UPI').toUpperCase();
  const idempotencyKey =
    payload?.idempotencyKey ||
    `pay_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  const requestBody = {
    tripId,
    amount,
    currency,
    paymentMethod,
    idempotencyKey,
  };

  console.log('\n==========================================');
  console.log(`📤 [API REQUEST] POST ${url}`);
  console.log('📍 Payload:', JSON.stringify(requestBody, null, 2));
  console.log('==========================================');

  try {
    const response = await apiPost(url, requestBody);

    console.log('\n==========================================');
    console.log('📥 [API RESPONSE] Charge Payment:');
    console.log(JSON.stringify(response, null, 2));
    console.log('==========================================\n');

    return response;
  } catch (error) {
    console.warn('⚠️ [API ERROR] Charge Payment Failed:', error);
    throw error;
  }
}

// Alias for convenience
export const chargePaymentApi = chargeTripPaymentApi;
