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
    return fine ? 'granted' : 'denied';
  }

  // iOS has no sync check without probing; treat as unknown/denied until requested.
  return 'denied';
}

export async function requestLocationPermission() {
  try {
    if (Platform.OS === 'android') {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Allow 'Cabora' to use your location?",
          message:
            'Your location is used to set your pickup point and show nearby drivers.',
          buttonPositive: 'Allow while using the app',
          buttonNegative: "Don't allow",
        },
      );

      if (result === PermissionsAndroid.RESULTS.GRANTED) {
        return 'granted';
      }
      if (result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
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
