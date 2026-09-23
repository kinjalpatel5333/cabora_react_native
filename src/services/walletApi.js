import {apiGet, apiPost} from '../config/apicall';
import {WALLET_ENDPOINTS} from '../config/endpoints';

/**
 * Fetch wallet balance and details
 * @returns {Promise<any>}
 */
export async function getWalletBalanceApi() {
  console.log('\n==========================================');
  console.log(`📤 [API REQUEST] GET ${WALLET_ENDPOINTS.BALANCE}`);
  console.log('==========================================');

  const response = await apiGet(WALLET_ENDPOINTS.BALANCE);

  console.log('\n==========================================');
  console.log('📥 [API RESPONSE] Wallet Balance:');
  console.log(JSON.stringify(response, null, 2));
  console.log('==========================================\n');

  return response;
}

/**
 * Add money to wallet
 * @param {Object} params
 * @param {number} params.amount
 * @param {string} [params.paymentMethod='CASH']
 * @param {string} [params.idempotencyKey]
 * @returns {Promise<any>}
 */
export async function addMoneyToWalletApi({amount, paymentMethod = 'CASH', idempotencyKey}) {
  const finalKey =
    idempotencyKey ||
    `idem_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  const payload = {
    amount: Number(amount),
    paymentMethod: String(paymentMethod || 'CASH').toUpperCase(),
    idempotencyKey: finalKey,
  };

  console.log('\n==========================================');
  console.log(`📤 [API REQUEST] POST ${WALLET_ENDPOINTS.ADD_MONEY}`);
  console.log(`📍 Payload:`, payload);
  console.log('==========================================');

  const response = await apiPost(WALLET_ENDPOINTS.ADD_MONEY, payload);

  console.log('\n==========================================');
  console.log('📥 [API RESPONSE] Add Money:');
  console.log(JSON.stringify(response, null, 2));
  console.log('==========================================\n');

  return response;
}

