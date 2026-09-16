import React from 'react';
import {Text} from 'react-native';
import {Screen} from '../../components';
import styles from './style';

export default function WalletScreen() {
  return (
    <Screen>
      <Text style={styles.kicker}>WALLET</Text>
      <Text style={styles.title}>Payments</Text>
      <Text style={styles.body}>
        Saved cards and Cabora Cash will show up here.
      </Text>
    </Screen>
  );
}
