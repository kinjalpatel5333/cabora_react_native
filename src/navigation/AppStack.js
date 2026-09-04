import React from 'react';
import {View} from 'react-native';
import {SidebarProvider} from '../context/SidebarContext';
import Sidebar from './Sidebar';
import TabNavigator from './TabNavigator';

export default function AppStack() {
  return (
    <SidebarProvider>
      <View style={{flex: 1}}>
        <TabNavigator />
        <Sidebar />
      </View>
    </SidebarProvider>
  );
}
