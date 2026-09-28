import {Linking, PermissionsAndroid, Platform} from 'react-native';
import Geolocation from '@react-native-community/geolocation';

Geolocation.setRNConfiguration({
  skipPermissionRequests: false,
  authorizationLevel: 'whenInUse',
  enableBackgroundLocationUpdates: false,
  locationProvider: 'auto',
});

function requestIosAuthorization() {
  return new Promise(resolve => {
    Geolocation.requestAuthorization(
      () => resolve('granted'),
      () => resolve('denied'),
    );
  });
}

export async function checkLocationPermission() {
  if (Platform.OS === 'android') {
    const fine = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    const coarse = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    );
    return fine || coarse ? 'granted' : 'denied';
  }

  // iOS has no sync check without probing; treat as unknown/denied until requested.
  return 'denied';
}

export async function requestLocationPermission() {
  try {
    if (Platform.OS === 'android') {
      const permissions = [
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      ];

      const granted = await PermissionsAndroid.requestMultiple(permissions);

      const fineGranted =
        granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] ===
        PermissionsAndroid.RESULTS.GRANTED;
      const coarseGranted =
        granted[PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION] ===
        PermissionsAndroid.RESULTS.GRANTED;

      if (fineGranted || coarseGranted) {
        return 'granted';
      }

      const fineNeverAsk =
        granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] ===
        PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN;
      const coarseNeverAsk =
        granted[PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION] ===
        PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN;

      if (fineNeverAsk || coarseNeverAsk) {
        return 'blocked';
      }
      return 'denied';
    }

    return await requestIosAuthorization();
  } catch (err) {
    console.warn('requestLocationPermission failed', err);
    return 'denied';
  }
}

export function openLocationSettings() {
  return Linking.openSettings();
}
