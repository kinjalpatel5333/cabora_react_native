import React from 'react';
import {View} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useAppSelector} from '../redux/hooks';
import {SidebarProvider} from '../context/SidebarContext';
import Sidebar from './Sidebar';
import TabNavigator from './TabNavigator';
import LocationPermissionScreen from '../screen/LocationPermissionScreen';
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

const Stack = createNativeStackNavigator();

export default function PassengerStack() {
  const locationResolved = useAppSelector(state => state.app.locationResolved);

  if (!locationResolved) {
    return <LocationPermissionScreen />;
  }

  return (
    <SidebarProvider>
      <View style={{flex: 1}}>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="MainTabs" component={TabNavigator} />
          <Stack.Screen
            name="AirportRide"
            component={AirportRideScreen}
            options={{animation: 'slide_from_right'}}
          />
          <Stack.Screen
            name="Rentals"
            component={RentalsScreen}
            options={{animation: 'slide_from_right'}}
          />
          <Stack.Screen
            name="Outstation"
            component={OutstationScreen}
            options={{animation: 'slide_from_right'}}
          />
          <Stack.Screen
            name="Portal"
            component={PortalScreen}
            options={{animation: 'slide_from_right'}}
          />
          <Stack.Screen
            name="PortalStep2"
            component={PortalStep2Screen}
            options={{animation: 'slide_from_right'}}
          />
          <Stack.Screen
            name="PortalStep3"
            component={PortalStep3Screen}
            options={{animation: 'slide_from_right'}}
          />
          <Stack.Screen
            name="PortalTracking"
            component={PortalTrackingScreen}
            options={{
              presentation: 'transparentModal',
              animation: 'slide_from_bottom',
              contentStyle: {backgroundColor: 'transparent'},
            }}
          />
          <Stack.Screen
            name="PortalDelivered"
            component={PortalDeliveredScreen}
            options={{animation: 'slide_from_right'}}
          />
          <Stack.Screen
            name="SelectDates"
            component={SelectDatesScreen}
            options={{animation: 'slide_from_right'}}
          />
          <Stack.Screen
            name="AddMoney"
            component={AddMoneyScreen}
            options={{animation: 'slide_from_right'}}
          />
          <Stack.Screen
            name="SavedPlaces"
            component={SavedPlacesScreen}
            options={{animation: 'slide_from_right'}}
          />
          <Stack.Screen
            name="SaveThisPlace"
            component={SaveThisPlaceScreen}
            options={{animation: 'slide_from_right'}}
          />
          <Stack.Screen
            name="Safety"
            component={SafetyScreen}
            options={{animation: 'slide_from_right'}}
          />
          <Stack.Screen
            name="TrustedContacts"
            component={TrustedContactsScreen}
            options={{animation: 'slide_from_right'}}
          />
          <Stack.Screen
            name="ReportIncident"
            component={ReportIncidentScreen}
            options={{animation: 'slide_from_right'}}
          />
          <Stack.Screen
            name="SafetyComplaint"
            component={SafetyComplaintScreen}
            options={{animation: 'slide_from_right'}}
          />
          <Stack.Screen
            name="SafetyNumber"
            component={SafetyNumberScreen}
            options={{animation: 'slide_from_right'}}
          />
          <Stack.Screen
            name="Help"
            component={HelpScreen}
            options={{animation: 'slide_from_right'}}
          />
          <Stack.Screen
            name="ReportIssue"
            component={ReportIssueScreen}
            options={{animation: 'slide_from_right'}}
          />
          <Stack.Screen
            name="Notifications"
            component={NotificationsScreen}
            options={{animation: 'slide_from_right'}}
          />
        </Stack.Navigator>
        <Sidebar />
      </View>
    </SidebarProvider>
  );
}
