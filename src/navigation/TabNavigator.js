import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Header} from '../components';
import colors, {palette} from '../config/color';
import {useSidebar} from '../context/SidebarContext';
import HomeScreen from '../screen/HomeScreen';
import ServicesScreen from '../screen/ServicesScreen';
import ActivityScreen from '../screen/ActivityScreen/index';
import WalletScreen from '../screen/WalletScreen/index';
import ProfileScreen from '../screen/ProfileScreen';
import HomeTabBar from './HomeTabBar';

const Tab = createBottomTabNavigator();

const floatingTabBarStyle = {
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
  height: undefined,
  backgroundColor: 'transparent',
  borderTopWidth: 0,
  elevation: 0,
  shadowOpacity: 0,
};

export default function TabNavigator() {
  const {setNavigator, setActiveTab} = useSidebar();

  return (
    <Tab.Navigator
      tabBar={props => <HomeTabBar {...props} />}
      sceneContainerStyle={{backgroundColor: palette.map.land}}
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: floatingTabBarStyle,
      }}
      screenListeners={({navigation, route}) => ({
        focus: () => {
          setNavigator(navigation);
          setActiveTab(route.name);
        },
      })}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{headerShown: false, tabBarLabel: 'Home'}}
      />
      <Tab.Screen
        name="Services"
        component={ServicesScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Services',
          title: 'Services',
        }}
      />
      <Tab.Screen
        name="Activity"
        component={ActivityScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Activity',
          title: 'Activity',
        }}
      />
      <Tab.Screen
        name="Wallet"
        component={WalletScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Wallet',
          title: 'Wallet',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Profile',
          title: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
}
