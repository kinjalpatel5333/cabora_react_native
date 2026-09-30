import { Linking, PermissionsAndroid, Platform } from 'react-native';

export async function requestCameraPermission() {
  if (Platform.OS === 'android') {
    try {
      const hasPermission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );
      if (hasPermission) {
        return true;
      }

      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "Allow 'Wagvaa' to access your camera?",
          message:
            'Camera access is required to photograph your documents for verification.',
          buttonPositive: 'Allow',
          buttonNegative: "Don't allow",
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      }

      return false;
    } catch (err) {
      console.warn('requestCameraPermission error:', err);
      return false;
    }
  }

  // On iOS, launchCamera triggers permission prompt or returns errorCode if denied
  return true;
}

export async function requestGalleryPermission() {
  if (Platform.OS === 'android') {
    // Android 13+ (API 33+) uses the system PhotoPicker which doesn't require runtime storage permission
    if (Platform.Version >= 33) {
      return true;
    }
    try {
      const permission = PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
      const hasPermission = await PermissionsAndroid.check(permission);
      if (hasPermission) {
        return true;
      }

      const granted = await PermissionsAndroid.request(permission, {
        title: "Allow 'Wagvaa' to access your photos?",
        message: 'Photo access is required to select photos.',
        buttonPositive: 'Allow',
        buttonNegative: "Don't allow",
      });

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      }

      return false;
    } catch (err) {
      console.warn('requestGalleryPermission error:', err);
      return false;
    }
  }

  // On iOS, launchImageLibrary triggers permission prompt or returns errorCode if denied
  return true;
}

export function showPermissionSettingsAlert(
  title = 'Permission Required',
  message = 'Please grant access in Settings to use this feature.',
) {
  Linking.openSettings().catch(() => {});
}
