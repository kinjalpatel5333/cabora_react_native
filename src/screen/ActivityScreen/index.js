import React from 'react';
import {Text} from 'react-native';
import {Screen} from '../../components';
import styles from './style';

export default function ActivityScreen() {
  return (
    <Screen>
      <Text style={styles.kicker}>ACTIVITY</Text>
      <Text style={styles.title}>Your trips</Text>
      <Text style={styles.body}>
        Past and upcoming rides will show up here.
      </Text>
    </Screen>
  );
}
