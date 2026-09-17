import React from 'react';
import {Text} from 'react-native';
import {Screen} from '../../components';
import styles from '../WalletScreen/style';

export default function DriverIncentivesScreen() {
  return (
    <Screen>
      <Text style={styles.kicker}>INCENTIVES</Text>
      <Text style={styles.title}>Bonuses and streaks</Text>
      <Text style={styles.body}>
        Peak-hour bonuses and ride streaks will show up here.
      </Text>
    </Screen>
  );
}
