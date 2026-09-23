import { NativeModules } from 'react-native';

let NetInfo = null;
if (NativeModules.RNCNetInfo) {
  try {
    NetInfo = require('@react-native-community/netinfo').default;
  } catch {
    NetInfo = null;
  }
}

export async function checkInternet(timeoutMs = 3000) {
  if (NetInfo) {
    try {
      const state = await NetInfo.fetch();
      if (state.isConnected !== null && state.isConnected !== undefined) {
        return state.isConnected;
      }
    } catch {
      // fallback if NetInfo fails
    }
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch('https://clients3.google.com/generate_204', {
      method: 'GET',
      signal: controller.signal,
    });
    return response.status === 204 || response.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

export function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
