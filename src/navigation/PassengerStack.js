import React from 'react';
import { StyleSheet, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../hooks/useAuth';
import { useAppSelector } from '../redux/hooks';
import { SidebarProvider } from '../context/SidebarContext';
import Sidebar from './Sidebar';
import TabNavigator from './TabNavigator';
import LocationPermissionScreen from '../screen/LocationPermissionScreen';
import CompleteProfileScreen from '../screen/CompleteProfileScreen';
import AirportRideScreen from '../screen/AirportRideScreen';
import RentalsScreen from '../screen/RentalsScreen';
import OutstationScreen from '../screen/OutstationScreen';
import PortalScreen from '../screen/PortalScreen';
import PortalStep2Screen from '../screen/PortalStep2Screen';
import PortalStep3Screen from '../screen/PortalStep3Screen';
import PortalTrackingScreen from '../screen/PortalTrackingScreen';
import PortalDeliveredScreen from '../screen/PortalDeliveredScreen';
import SelectDatesScreen from '../screen/SelectDatesScreen';
import AddMoneyScreen from '../screen/AddMoneyScreen';
import SavedPlacesScreen from '../screen/SavedPlacesScreen';
import SaveThisPlaceScreen from '../screen/SaveThisPlaceScreen';
import SafetyScreen from '../screen/SafetyScreen';
import TrustedContactsScreen from '../screen/TrustedContactsScreen';
import ReportIncidentScreen from '../screen/ReportIncidentScreen';
import SafetyComplaintScreen from '../screen/SafetyComplaintScreen';
import SafetyNumberScreen from '../screen/SafetyNumberScreen';
import HelpScreen from '../screen/HelpScreen';
import ReportIssueScreen from '../screen/ReportIssueScreen';
import NotificationsScreen from '../screen/NotificationsScreen';
import PersonalDetailsScreen from '../screen/PersonalDetailsScreen';
import PaymentMethodsScreen from '../screen/PaymentMethodsScreen';
import AddCardScreen from '../screen/AddCardScreen';
import OffersCouponsScreen from '../screen/OffersCouponsScreen';
import ReferEarnScreen from '../screen/ReferEarnScreen';
import SettingScreen from '../screen/SettingScreen';
import ScheduledRidesScreen from '../screen/ScheduledRidesScreen';
import ScheduledRideDetailsScreen from '../screen/ScheduledRideDetailsScreen';

const Stack = createNativeStackNavigator();

export default function PassengerStack() {
  const { user } = useAuth();
  const locationResolved = useAppSelector(state => state.app.locationResolved);

  const isPassengerProfileComplete = Boolean(
    user?.isNewUser === false ||
    user?.isProfileComplete === true ||
    user?.profileCompleted === true ||
    (user?.isOnBoarding === false && user?.name && user?.name.trim().length > 0)
  );

  let initialRouteName = 'MainTabs';
  if (!locationResolved) {
    initialRouteName = 'LocationPermission';
  } else if (user?.isNewUser !== false && !isPassengerProfileComplete) {
    initialRouteName = 'CompleteProfile';
  }

  return (
    <SidebarProvider>
      <View style={styles.root}>
        <Stack.Navigator
          initialRouteName={initialRouteName}
          screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name="LocationPermission"
            component={LocationPermissionScreen}
            options={{ gestureEnabled: false }}
          />
          <Stack.Screen
            name="CompleteProfile"
            component={CompleteProfileScreen}
            options={{ gestureEnabled: false }}
          />
          <Stack.Screen name="MainTabs" component={TabNavigator} />
          <Stack.Screen
            name="AirportRide"
            component={AirportRideScreen}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="Rentals"
            component={RentalsScreen}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="Outstation"
            component={OutstationScreen}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="Portal"
            component={PortalScreen}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="PortalStep2"
            component={PortalStep2Screen}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="PortalStep3"
            component={PortalStep3Screen}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="PortalTracking"
            component={PortalTrackingScreen}
            options={{
              presentation: 'transparentModal',
              animation: 'slide_from_bottom',
              contentStyle: { backgroundColor: 'transparent' },
            }}
          />
          <Stack.Screen
            name="PortalDelivered"
            component={PortalDeliveredScreen}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="SelectDates"
            component={SelectDatesScreen}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="AddMoney"
            component={AddMoneyScreen}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="SavedPlaces"
            component={SavedPlacesScreen}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="SaveThisPlace"
            component={SaveThisPlaceScreen}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="Safety"
            component={SafetyScreen}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="TrustedContacts"
            component={TrustedContactsScreen}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="ReportIncident"
            component={ReportIncidentScreen}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="SafetyComplaint"
            component={SafetyComplaintScreen}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="SafetyNumber"
            component={SafetyNumberScreen}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="Help"
            component={HelpScreen}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="ReportIssue"
            component={ReportIssueScreen}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="Notifications"
            component={NotificationsScreen}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="PersonalDetails"
            component={PersonalDetailsScreen}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="PaymentMethods"
            component={PaymentMethodsScreen}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="AddCard"
            component={AddCardScreen}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="OffersCoupons"
            component={OffersCouponsScreen}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="ReferEarn"
            component={ReferEarnScreen}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="Setting"
            component={SettingScreen}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="ScheduledRides"
            component={ScheduledRidesScreen}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="ScheduledRideDetails"
            component={ScheduledRideDetailsScreen}
            options={{ animation: 'slide_from_right' }}
          />
        </Stack.Navigator>

        <Sidebar />
      </View>
    </SidebarProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
