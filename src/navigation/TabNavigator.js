import React from 'react';
import {Image} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {images} from '../assets';
import {Header} from '../components';
import colors from '../config/color';
import {useSidebar} from '../context/SidebarContext';
import HomeScreen from '../screen/HomeScreen';
import KeywordSearchScreen from '../screen/KeywordSearchScreen';
import ProfileScreen from '../screen/ProfileScreen';
import SettingScreen from '../screen/SettingScreen';

const Tab = createBottomTabNavigator();

const ICONS = {
  Home: images.iconHome,
  Search: images.iconHome,
  Profile: images.iconProfile,
  Settings: images.iconSettings,
};

export default function TabNavigator() {
  const {setNavigator, setActiveTab} = useSidebar();

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: route.name !== 'Search',
        header: () => <Header title={route.name} />,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
        },
        tabBarIcon: ({focused}) => (
          <Image
            source={ICONS[route.name]}
            style={{width: 24, height: 24, opacity: focused ? 1 : 0.4}}
          />
        ),
      })}
      screenListeners={({navigation, route}) => ({
        focus: () => {
          setNavigator(navigation);
          setActiveTab(route.name);
        },
      })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen
        name="Search"
        component={KeywordSearchScreen}
        options={{tabBarLabel: 'Search'}}
      />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Settings" component={SettingScreen} />
    </Tab.Navigator>
  );
}
