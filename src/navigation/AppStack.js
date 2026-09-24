import React, {useEffect} from 'react';
import {useAuth, useAppDispatch} from '../hooks/useAuth';
import {fetchUserProfile} from '../redux/slices/authSlice';
import PassengerStack from './PassengerStack';
import DriverStack from './DriverStack';

export default function AppStack() {
  const dispatch = useAppDispatch();
  const {user} = useAuth();

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  const role = (user?.currentRole || user?.role || '').toLowerCase();
  if (role === 'driver') {
    return <DriverStack />;
  }
  return <PassengerStack />;
}

