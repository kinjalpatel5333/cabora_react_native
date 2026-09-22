import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from '../screen/LoginScreen';
import OtpScreen from '../screen/OtpScreen';
import SetupAccountScreen from '../screen/SetupAccountScreen';
import LocationPermissionScreen from '../screen/LocationPermissionScreen';
import CompleteProfileScreen from '../screen/CompleteProfileScreen';
import SignupScreen from '../screen/SignupScreen';
import colors from '../config/color';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: {backgroundColor: colors.background},
        headerTintColor: colors.text,
        contentStyle: {backgroundColor: colors.background},
      }}>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Otp"
        component={OtpScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SetupAccount"
        component={SetupAccountScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="LocationPermission"
        component={LocationPermissionScreen}
        options={{headerShown: false, gestureEnabled: false}}
      />
      <Stack.Screen
        name="CompleteProfile"
        component={CompleteProfileScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Signup"
        component={SignupScreen}
        options={{title: 'Sign up'}}
      />
    </Stack.Navigator>
  );
}
