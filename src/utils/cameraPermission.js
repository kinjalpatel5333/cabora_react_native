import { Alert, Linking, PermissionsAndroid, Platform } from 'react-native';

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
          title: "Allow 'Cabora' to access your camera?",
          message:
            'Camera access is required to photograph your documents for verification.',
          buttonPositive: 'Allow',
          buttonNegative: "Don't allow",
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      }

      showPermissionSettingsAlert(
        'Camera Permission Required',
        'Camera access is turned off. Please allow camera access in Settings to photograph documents.',
      );
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
    try {
      let permission = PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
      if (Platform.Version >= 33) {
        permission = PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES;
      }

      const hasPermission = await PermissionsAndroid.check(permission);
      if (hasPermission) {
        return true;
      }

      const granted = await PermissionsAndroid.request(permission, {
        title: "Allow 'Cabora' to access your photos?",
        message: 'Photo access is required to upload document photos.',
        buttonPositive: 'Allow',
        buttonNegative: "Don't allow",
      });

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      }

      showPermissionSettingsAlert(
        'Photo Access Required',
        'Photo access is turned off. Please allow photo access in Settings to select documents.',
      );
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
  Alert.alert(
    title,
    message,
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Open Settings',
        onPress: () => Linking.openSettings().catch(() => {}),
      },
    ],
    { cancelable: true },
  );
}
