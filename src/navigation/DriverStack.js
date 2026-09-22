import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../hooks/useAuth';
import { useAppSelector } from '../redux/hooks';
import { useApp } from '../context/AppContext';
import { SidebarProvider } from '../context/SidebarContext';
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
import DriverTripInProgressScreen from '../screen/DriverTripInProgressScreen';
import DriverTripSummaryScreen from '../screen/DriverTripSummaryScreen';
import DriverCollectCashScreen from '../screen/DriverCollectCashScreen';
import DriverAirportQueueScreen from '../screen/DriverAirportQueueScreen';
import DriverAirportTripSummaryScreen from '../screen/DriverAirportTripSummaryScreen';
import DriverTripHistoryScreen from '../screen/DriverTripHistoryScreen';
import DriverSubscriptionScreen from '../screen/DriverSubscriptionScreen';
import DriverDailySafetyCheckScreen from '../screen/DriverDailySafetyCheckScreen';
import DriverIncentiveTrackerScreen from '../screen/DriverIncentiveTrackerScreen';
import DriverRegistrationScreen from '../screen/DriverRegistrationScreen';
import DriverVerificationStatusScreen from '../screen/DriverVerificationStatusScreen';


const Stack = createNativeStackNavigator();

function DriverMain() {
  const insets = useSafeAreaInsets();
  const iosBottom = Platform.OS === 'ios' ? insets.bottom : 0;

  return (
    <View style={[styles.main, iosBottom ? { marginBottom: -iosBottom } : null]}>
      <DriverTabNavigator />
    </View>
  );
}

export default function DriverStack() {
  const { user } = useAuth();
  const { colors } = useApp();
  const locationResolved = useAppSelector(state => state.app.locationResolved);
  const kycComplete = Boolean(user?.kycComplete);

  let initialRouteName = 'DriverRegistration';
  if (kycComplete && locationResolved) {
    initialRouteName = 'DriverTabs';
  } else if (kycComplete) {
    initialRouteName = 'LocationPermission';
  }

  return (
    <SidebarProvider>
      <View style={styles.main}>
        <Stack.Navigator
          initialRouteName={initialRouteName}
          screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name="DriverRegistration"
            component={DriverRegistrationScreen}
          />
          <Stack.Screen
            name="DriverVerificationStatus"
            component={DriverVerificationStatusScreen}
          />
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
            options={{ gestureEnabled: false }}
          />
          <Stack.Screen
            name="DriverTabs"
            component={DriverMain}
            options={{
              headerShown: false,
              unstable_headerInsets: { bottom: false },
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
              contentStyle: { backgroundColor: colors.map.land },
              animation: 'slide_from_bottom',
            }}
          />
          <Stack.Screen
            name="CancelRideReason"
            component={CancelRideReasonScreen}
            options={{
              presentation: 'transparentModal',
              animation: 'slide_from_bottom',
              contentStyle: { backgroundColor: colors.transparent },
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
          <Stack.Screen
            name="DriverTripInProgress"
            component={DriverTripInProgressScreen}
            options={{
              gestureEnabled: false,
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen
            name="DriverTripSummary"
            component={DriverTripSummaryScreen}
            options={{
              gestureEnabled: false,
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen
            name="DriverCollectCash"
            component={DriverCollectCashScreen}
            options={{
              gestureEnabled: false,
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen
            name="DriverAirportQueue"
            component={DriverAirportQueueScreen}
            options={{
              gestureEnabled: false,
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen
            name="DriverAirportTripSummary"
            component={DriverAirportTripSummaryScreen}
            options={{
              gestureEnabled: false,
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen
            name="DriverTripHistory"
            component={DriverTripHistoryScreen}
            options={{
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen
            name="DriverSubscription"
            component={DriverSubscriptionScreen}
            options={{
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen
            name="DriverDailySafetyCheck"
            component={DriverDailySafetyCheckScreen}
            options={{
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen
            name="DriverIncentiveTracker"
            component={DriverIncentiveTrackerScreen}
            options={{
              animation: 'slide_from_right',
            }}
          />
        </Stack.Navigator>
        <Sidebar />
      </View>
    </SidebarProvider>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
});
