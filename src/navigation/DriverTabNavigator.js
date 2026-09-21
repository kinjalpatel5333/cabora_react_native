import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Header} from '../components';
import colors, {palette} from '../config/color';
import {useSidebar} from '../context/SidebarContext';
import DriverHomeScreen from '../screen/DriverHomeScreen';
import DriverEarningsScreen from '../screen/DriverEarningsScreen';
import DriverWalletScreen from '../screen/DriverWalletScreen';
import DriverIncentivesScreen from '../screen/DriverIncentivesScreen';
import DriverProfileScreen from '../screen/DriverProfileScreen';
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

export default function DriverTabNavigator() {
  const {setNavigator, setActiveTab} = useSidebar();

  return (
    <Tab.Navigator
      tabBar={props => <HomeTabBar {...props} />}
      sceneContainerStyle={{backgroundColor: palette.map.land}}
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: floatingTabBarStyle,
        safeAreaInsets: {top: 0, bottom: 0, left: 0, right: 0},
      }}
      screenListeners={({navigation, route}) => ({
        focus: () => {
          setNavigator(navigation);
          setActiveTab(route.name);
        },
      })}>
      <Tab.Screen
        name="Dashboard"
        component={DriverHomeScreen}
        options={{headerShown: false, tabBarLabel: 'Dashboard'}}
      />
      <Tab.Screen
        name="Earnings"
        component={DriverEarningsScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Earnings',
          title: 'Earnings',
        }}
      />
      <Tab.Screen
        name="Wallet"
        component={DriverWalletScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Wallet',
          title: 'Wallet',
        }}
      />
      <Tab.Screen
        name="Incentives"
        component={DriverIncentivesScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Incentives',
          title: 'Incentives',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={DriverProfileScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Profile',
          title: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
}
