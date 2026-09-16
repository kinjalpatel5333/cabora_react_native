import React from 'react';
import {View} from 'react-native';
import {useAuth} from '../hooks/useAuth';
import {SidebarProvider} from '../context/SidebarContext';
import Sidebar from './Sidebar';
import TabNavigator from './TabNavigator';
import DriverHomeScreen from '../screen/DriverHomeScreen';

export default function AppStack() {
  const {user} = useAuth();
  const role = user?.role || 'passenger';

  // Passenger booking flow (Home → Set route → Choose ride → Finding…)
  if (role === 'passenger' || role === 'rider' || role === 'both') {
    return (
      <SidebarProvider>
        <View style={{flex: 1}}>
          <TabNavigator />
          <Sidebar />
        </View>
      </SidebarProvider>
    );
  }

  // Driver side — separate entry (not passenger booking screens)
  return <DriverHomeScreen />;
}
