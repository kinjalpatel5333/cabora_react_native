import React from 'react';
import {useAuth} from '../hooks/useAuth';
import PassengerStack from './PassengerStack';
import DriverStack from './DriverStack';

export default function AppStack() {
  const {user} = useAuth();
  if (user?.role === 'driver') {
    return <DriverStack />;
  }
  return <PassengerStack />;
}
