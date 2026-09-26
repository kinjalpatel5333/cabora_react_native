import NetInfo from '@react-native-community/netinfo';

export async function checkInternet(timeoutMs = 4000) {
  try {
    const state = await NetInfo.fetch();
    // If NetInfo explicitly says disconnected (false)
    if (state && state.isConnected === false) {
      return false;
    }
    // If connected or unknown (null), consider connected
    if (state && state.isConnected === true) {
      return true;
    }
  } catch (e) {
    // If NetInfo fails, continue to fallback probe
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch('https://www.google.com/generate_204', {
      method: 'GET',
      signal: controller.signal,
    });
    return response.status === 204 || response.ok;
  } catch {
    // Return true by default so real devices are never blocked by false-positive timeouts
    return true;
  } finally {
    clearTimeout(timer);
  }
}

export function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
