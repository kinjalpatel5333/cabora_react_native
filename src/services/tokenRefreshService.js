import { getAuthToken, getRefreshToken, setAuthToken, setRefreshToken } from '../config/apicall';
import { refreshTokenApi } from './authApi';
import { updateToken } from '../redux/slices/authSlice';

const REFRESH_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes

let refreshTimer = null;

/**
 * Perform a single refresh token operation and sync tokens with Redux & AsyncStorage
 * @param {Function} [dispatch] - Redux dispatch function
 * @returns {Promise<any>}
 */
export async function performTokenRefresh(dispatch) {
  try {
    const rToken = await getRefreshToken();
    const aToken = getAuthToken();

    // If no token exists, do nothing
    if (!rToken && !aToken) {
      return null;
    }

    console.log('\n⏰ [TOKEN REFRESH] Executing 10-minute token refresh...');
    const response = await refreshTokenApi(rToken || aToken);

    const newAccessToken =
      response?.data?.accessToken ||
      response?.data?.token ||
      response?.accessToken ||
      response?.token;

    const newRefreshToken =
      response?.data?.refreshToken ||
      response?.refreshToken;

    if (newAccessToken) {
      setAuthToken(newAccessToken);
    }
    if (newRefreshToken) {
      setRefreshToken(newRefreshToken);
    }

    if (dispatch && (newAccessToken || newRefreshToken)) {
      dispatch(
        updateToken({
          token: newAccessToken,
          refreshToken: newRefreshToken,
        }),
      );
    }

    console.log('✅ [TOKEN REFRESH] 10-minute token refresh completed successfully.\n');
    return response;
  } catch (err) {
    console.warn('⚠️ [TOKEN REFRESH] Failed to refresh token:', err?.message || err);
    return null;
  }
}

/**
 * Start the 10-minute recurring background timer for token refresh
 * @param {Function} dispatch - Redux dispatch function
 */
export function startTokenRefreshTimer(dispatch) {
  stopTokenRefreshTimer();

  console.log('🔄 [TOKEN REFRESH] Starting 10-minute refresh timer...');

  refreshTimer = setInterval(() => {
    performTokenRefresh(dispatch);
  }, REFRESH_INTERVAL_MS);
}

/**
 * Stop the token refresh timer
 */
export function stopTokenRefreshTimer() {
  if (refreshTimer) {
    clearInterval(refreshTimer);
    refreshTimer = null;
    console.log('🛑 [TOKEN REFRESH] Stopped 10-minute refresh timer.');
  }
}
