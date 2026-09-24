import React from 'react';
import {useAuth} from '../hooks/useAuth';
import PassengerStack from './PassengerStack';
import DriverStack from './DriverStack';

export default function AppStack() {
  const {user} = useAuth();
  const role = (user?.currentRole || user?.role || '').toLowerCase();
  if (role === 'driver') {
    return <DriverStack />;
  }
  return <PassengerStack />;
}
