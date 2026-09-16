import React from 'react';
import {View} from 'react-native';
import {useAppSelector} from '../redux/hooks';
import {SidebarProvider} from '../context/SidebarContext';
import Sidebar from './Sidebar';
import TabNavigator from './TabNavigator';
import LocationPermissionScreen from '../screen/LocationPermissionScreen';

export default function PassengerStack() {
  const locationResolved = useAppSelector(state => state.app.locationResolved);

  if (!locationResolved) {
    return <LocationPermissionScreen />;
  }

  return (
    <SidebarProvider>
      <View style={{flex: 1}}>
        <TabNavigator />
        <Sidebar />
      </View>
    </SidebarProvider>
  );
}
