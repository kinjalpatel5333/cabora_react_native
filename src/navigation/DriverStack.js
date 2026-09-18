import React from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useAuth} from '../hooks/useAuth';
import {useAppSelector} from '../redux/hooks';
import {SidebarProvider} from '../context/SidebarContext';
import Sidebar from './Sidebar';
import DriverTabNavigator from './DriverTabNavigator';
import UploadDocumentsScreen from '../screen/UploadDocumentsScreen';
import DocumentCaptureScreen from '../screen/DocumentCaptureScreen';
import LocationPermissionScreen from '../screen/LocationPermissionScreen';
import PreferredDestinationScreen from '../screen/PreferredDestinationScreen';
import NewRideRequestScreen from '../screen/NewRideRequestScreen';
import CancelRideReasonScreen from '../screen/CancelRideReasonScreen';
import DriverEnRoutePickupScreen from '../screen/DriverEnRoutePickupScreen';
import DriverStartTripScreen from '../screen/DriverStartTripScreen';

const Stack = createNativeStackNavigator();

function DriverMain() {
  const insets = useSafeAreaInsets();
  const iosBottom = Platform.OS === 'ios' ? insets.bottom : 0;

  return (
    <SidebarProvider>
      <View style={[styles.main, iosBottom ? {marginBottom: -iosBottom} : null]}>
        <DriverTabNavigator />
        <Sidebar />
      </View>
    </SidebarProvider>
  );
}

export default function DriverStack() {
  const {user} = useAuth();
  const locationResolved = useAppSelector(state => state.app.locationResolved);
  const kycComplete = Boolean(user?.kycComplete);

  let initialRouteName = 'UploadDocuments';
  if (kycComplete && locationResolved) {
    initialRouteName = 'DriverTabs';
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
        name="DocumentCapture"
        component={DocumentCaptureScreen}
      />
      <Stack.Screen
        name="LocationPermission"
        component={LocationPermissionScreen}
        options={{gestureEnabled: false}}
      />
      <Stack.Screen
        name="DriverTabs"
        component={DriverMain}
        options={{
          headerShown: false,
          unstable_headerInsets: {bottom: false},
          contentStyle: styles.main,
        }}
      />
      <Stack.Screen
        name="PreferredDestination"
        component={PreferredDestinationScreen}
      />
      <Stack.Screen
        name="NewRideRequest"
        component={NewRideRequestScreen}
        options={{
          gestureEnabled: false,
          contentStyle: {backgroundColor: '#E1E5F0'},
          animation: 'slide_from_bottom',
        }}
      />
      <Stack.Screen
        name="CancelRideReason"
        component={CancelRideReasonScreen}
        options={{
          presentation: 'transparentModal',
          animation: 'slide_from_bottom',
          contentStyle: {backgroundColor: 'transparent'},
        }}
      />
      <Stack.Screen
        name="DriverEnRoutePickup"
        component={DriverEnRoutePickupScreen}
        options={{
          gestureEnabled: false,
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="DriverStartTrip"
        component={DriverStartTripScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
});
