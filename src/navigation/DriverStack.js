import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useAuth} from '../hooks/useAuth';
import {useAppSelector} from '../redux/hooks';
import UploadDocumentsScreen from '../screen/UploadDocumentsScreen';
import LocationPermissionScreen from '../screen/LocationPermissionScreen';
import DriverHomeScreen from '../screen/DriverHomeScreen';

const Stack = createNativeStackNavigator();

export default function DriverStack() {
  const {user} = useAuth();
  const locationResolved = useAppSelector(state => state.app.locationResolved);
  const kycComplete = Boolean(user?.kycComplete);

  let initialRouteName = 'UploadDocuments';
  if (kycComplete && locationResolved) {
    initialRouteName = 'DriverHome';
  } else if (kycComplete) {
    initialRouteName = 'LocationPermission';
  }

  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{headerShown: false}}>
      <Stack.Screen
        name="UploadDocuments"
        component={UploadDocumentsScreen}
      />
      <Stack.Screen
        name="LocationPermission"
        component={LocationPermissionScreen}
        options={{gestureEnabled: false}}
      />
      <Stack.Screen name="DriverHome" component={DriverHomeScreen} />
    </Stack.Navigator>
  );
}
