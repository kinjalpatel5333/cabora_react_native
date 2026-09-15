import React from 'react';
import {Alert, Text, View} from 'react-native';
import {Button, Screen, Toggle} from '../../components';
import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import {setNotificationsEnabled} from '../../redux/slices/appSlice';
import {logoutUser} from '../../redux/slices/authSlice';
import styles from './style';

function Row({label, hint, last, children}) {
  return (
    <View style={[styles.row, last && styles.rowLast]}>
      <View style={styles.rowText}>
        <Text style={styles.label}>{label}</Text>
        {hint ? <Text style={styles.hint}>{hint}</Text> : null}
      </View>
      {children}
    </View>
  );
}

export default function SettingScreen() {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(state => state.app.notifications);

  const onLogout = () => {
    Alert.alert('Log out', 'End this demo session?', [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Log out', style: 'destructive', onPress: () => dispatch(logoutUser())},
    ]);
  };

  return (
    <Screen>
      <Text style={styles.kicker}>SETTINGS</Text>
      <Text style={styles.title}>Preferences</Text>

      <View style={styles.card}>
        <Row label="Notifications" hint="Demo toggle, stored on device">
          <Toggle
            value={notifications}
            onValueChange={value => dispatch(setNotificationsEnabled(value))}
          />
        </Row>
        <Row
          label="Session"
          hint="Local only — API helpers are unused for now"
          last
        />
      </View>

      <Button title="Log out" variant="outline" onPress={onLogout} />
    </Screen>
  );
}
