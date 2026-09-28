import React, {useState} from 'react';
import {ScrollView, Text, View, TouchableOpacity} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Lucide} from '@react-native-vector-icons/lucide/static';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import useThemedStyles from '../../components/useThemedStyles';
import {useApp} from '../../context/AppContext';
import {Button} from '../../components';
import {cancelRideApi} from '../../services/rideApi';
import createStyles from './style';
import colors from '../../config/color';

import { DRIVER_CANCEL_REASONS as CANCEL_REASONS } from '../../config/staticData';

export default function CancelRideReasonScreen() {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);
  const {colors} = useApp();
  const navigation = useNavigation();
  const route = useRoute();
  const rideId = route?.params?.rideId || '6aa28cc7e02cb357dd298432';
  const [selected, setSelected] = useState(CANCEL_REASONS[0]);

  const onKeepRide = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('DriverTabs');
    }
  };

  const onCancelRide = async () => {
    try {
      await cancelRideApi(rideId, { reason: selected });
    } catch (err) {
      console.warn('cancelRideApi error:', err);
    }
    navigation.navigate('DriverTabs');
  };

  return (
    <View style={styles.root}>
      <TouchableOpacity activeOpacity={0.7} style={styles.backdrop} onPress={onKeepRide} />

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
                <TouchableOpacity activeOpacity={0.7}
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
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        <View style={styles.actions}>
          <Button
            title="Keep ride"
            variant="outline"
            onPress={onKeepRide}
            style={styles.keepBtn}
            textStyle={styles.keepText}
            fullWidth={false}
          />
          <Button
            title="Cancel ride"
            variant="danger"
            onPress={onCancelRide}
            style={styles.cancelBtn}
            textStyle={styles.cancelText}
            fullWidth={false}
          />
        </View>
      </View>
    </View>
  );
}
