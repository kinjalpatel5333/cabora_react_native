import React, {useState} from 'react';
import {Pressable, ScrollView, StatusBar, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Lucide} from '@react-native-vector-icons/lucide/static';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import useThemedStyles from '../../components/useThemedStyles';
import {useApp} from '../../context/AppContext';
import createStyles from './style';

const CANCEL_REASONS = [
  'Passenger is not at the pickup point',
  'Passenger asked me to cancel',
  'Pickup is too far or unreachable',
  'Vehicle problem or breakdown',
  'Wrong drop location or route',
];

export default function CancelRideReasonScreen() {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);
  const {colors} = useApp();
  const navigation = useNavigation();
  const [selected, setSelected] = useState(CANCEL_REASONS[0]);

  const onKeepRide = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('DriverTabs');
    }
  };

  const onCancelRide = () => {
    navigation.navigate('DriverTabs');
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <Pressable style={styles.backdrop} onPress={onKeepRide} />

      <View
        style={[
          styles.sheet,
          {paddingBottom: Math.max(insets.bottom, 12) + 8},
        ]}>
        <View style={styles.handle} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          bounces={false}
          contentContainerStyle={styles.sheetContent}>
          <Text style={styles.title}>Why are you cancelling?</Text>
          <Text style={styles.subtitle}>
            Pick the closest reason. It goes to the passenger and to the ops
            team.
          </Text>

          <View style={styles.penaltyBox}>
            <Lucide
              name="triangle-alert"
              size={22}
              color={colors.red[700]}
              style={styles.penaltyIcon}
            />
            <View style={styles.penaltyCopy}>
              <Text style={styles.penaltyTitle}>
                This cancel carries a ₹25 penalty
              </Text>
              <Text style={styles.penaltyMeta}>
                You accepted 3 minutes ago. Two more this week and ride flow is
                throttled.
              </Text>
            </View>
          </View>

          <Text style={styles.reasonLabel}>REASON</Text>

          <View style={styles.reasonList}>
            {CANCEL_REASONS.map(reason => {
              const active = selected === reason;
              return (
                <Pressable
                  key={reason}
                  accessibilityRole="radio"
                  accessibilityState={{selected: active}}
                  onPress={() => setSelected(reason)}
                  style={[styles.reasonRow, active && styles.reasonRowActive]}>
                  <View
                    style={[styles.radio, active && styles.radioSelected]}>
                    {active ? <View style={styles.radioDot} /> : null}
                  </View>
                  <Text
                    style={[
                      styles.reasonText,
                      active && styles.reasonTextActive,
                    ]}>
                    {reason}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>

        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            onPress={onKeepRide}
            style={styles.keepBtn}>
            <Text style={styles.keepText}>Keep ride</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={onCancelRide}
            style={styles.cancelBtn}>
            <Text style={styles.cancelText}>Cancel ride</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
