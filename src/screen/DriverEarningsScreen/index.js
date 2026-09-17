import React from 'react';
import {Text} from 'react-native';
import {Screen} from '../../components';
import styles from '../WalletScreen/style';

export default function DriverEarningsScreen() {
  return (
    <Screen>
      <Text style={styles.kicker}>EARNINGS</Text>
      <Text style={styles.title}>Today and this week</Text>
      <Text style={styles.body}>
        Trip fares, bonuses and payouts will show up here.
      </Text>
    </Screen>
  );
}
