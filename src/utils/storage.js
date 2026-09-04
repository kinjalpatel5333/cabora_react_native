import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Universal safe AsyncStorage helper compatible with AsyncStorage v1, v2, and v3.
 */

export async function storageGetItem(key) {
  try {
    if (AsyncStorage && typeof AsyncStorage.getItem === 'function') {
      return await AsyncStorage.getItem(key);
    }
  } catch (err) {
    console.warn(`[storage] getItem failed for key: ${key}`, err);
  }
  return null;
}

export async function storageSetItem(key, value) {
  try {
    if (AsyncStorage && typeof AsyncStorage.setItem === 'function') {
      await AsyncStorage.setItem(key, String(value));
      return true;
    }
  } catch (err) {
    console.warn(`[storage] setItem failed for key: ${key}`, err);
  }
  return false;
}

export async function storageRemoveItem(key) {
  try {
    if (AsyncStorage && typeof AsyncStorage.removeItem === 'function') {
      await AsyncStorage.removeItem(key);
      return true;
    }
  } catch (err) {
    console.warn(`[storage] removeItem failed for key: ${key}`, err);
  }
  return false;
}

export async function storageGetMultiple(keys) {
  try {
    const results = await Promise.all(
      keys.map(async key => {
        const val = await storageGetItem(key);
        return [key, val];
      }),
    );
    return results;
  } catch (err) {
    console.warn('[storage] storageGetMultiple failed', err);
    return keys.map(k => [k, null]);
  }
}

export async function storageSetMultiple(keyValuePairs) {
  try {
    await Promise.all(
      keyValuePairs.map(([key, value]) => storageSetItem(key, value)),
    );
    return true;
  } catch (err) {
    console.warn('[storage] storageSetMultiple failed', err);
    return false;
  }
}

export async function storageRemoveMultiple(keys) {
  try {
    await Promise.all(keys.map(key => storageRemoveItem(key)));
    return true;
  } catch (err) {
    console.warn('[storage] storageRemoveMultiple failed', err);
    return false;
  }
}
