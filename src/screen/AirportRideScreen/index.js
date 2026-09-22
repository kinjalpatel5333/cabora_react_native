import { PASSENGER_AIRPORT_SURCHARGES } from '../../config/staticData';
import React, {useState} from 'react';
import {ScrollView, Text, View, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Feather} from '@react-native-vector-icons/feather/static';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useToast} from '../../components/Toast';
import {Button} from '../../components';
import useThemedStyles from '../../components/useThemedStyles';
import {useApp} from '../../context/AppContext';
import createStyles from './style';
import colors from '../../config/color';

const SURCHARGES = PASSENGER_AIRPORT_SURCHARGES;

const SURCHARGE_TOTAL = SURCHARGES.reduce((sum, row) => sum + row.amount, 0);

export default function AirportRideScreen() {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);
  const {colors} = useApp();
  const navigation = useNavigation();
  const {showToast} = useToast();
  const [tripType, setTripType] = useState('drop');
  const [terminal, setTerminal] = useState('t2');

  const onBook = () => {
    showToast({type: 'success', message: 'Airport ride booked'});
    navigation.goBack();
  };

  return (
    <View style={styles.root}>
      <View style={[styles.header, {paddingTop: insets.top + 4}]}>
        <TouchableOpacity activeOpacity={0.7}
          style={styles.headerBtn}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={8}>
          <Feather name="arrow-left" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Airport ride</Text>
        <TouchableOpacity activeOpacity={0.7}
          style={styles.headerBtn}
          onPress={() => navigation.navigate('Safety')}
          accessibilityRole="button"
          accessibilityLabel="Safety"
          hitSlop={8}>
          <Feather name="help-circle" size={22} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scroll,
          {paddingBottom: 24},
        ]}>
        <View style={styles.tripToggle}>
          <TouchableOpacity activeOpacity={0.7}
            style={[
              styles.tripTab,
              tripType === 'drop' && styles.tripTabActive,
            ]}
            onPress={() => setTripType('drop')}>
            <Text
              style={[
                styles.tripTabText,
                tripType === 'drop' && styles.tripTabTextActive,
              ]}>
              Drop to airport
            </Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.7}
            style={[
              styles.tripTab,
              tripType === 'pickup' && styles.tripTabActive,
            ]}
            onPress={() => setTripType('pickup')}>
            <Text
              style={[
                styles.tripTabText,
                tripType === 'pickup' && styles.tripTabTextActive,
              ]}>
              Pickup from airport
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>AIRPORT & TERMINAL</Text>
          <View style={styles.card}>
            <View style={styles.airportRow}>
              <View style={styles.pinIcon}>
                <Feather name="map-pin" size={18} color={colors.primary} />
              </View>
              <View style={styles.airportCopy}>
                <Text style={styles.airportName}>Kempegowda International</Text>
                <Text style={styles.airportMeta}>
                  BLR · 38.4 km from your pickup
                </Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.terminalRow}>
              <TouchableOpacity activeOpacity={0.7}
                style={[
                  styles.terminalChip,
                  terminal === 't1' && styles.terminalChipActive,
                ]}
                onPress={() => setTerminal('t1')}>
                <Text
                  style={[
                    styles.terminalText,
                    terminal === 't1' && styles.terminalTextActive,
                  ]}>
                  T1 · Domestic
                </Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.7}
                style={[
                  styles.terminalChip,
                  terminal === 't2' && styles.terminalChipActive,
                ]}
                onPress={() => setTerminal('t2')}>
                <Text
                  style={[
                    styles.terminalText,
                    terminal === 't2' && styles.terminalTextActive,
                  ]}>
                  T2 · International
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>FLIGHT DETAILS</Text>
          <View style={styles.card}>
            <View style={styles.detailRow}>
              <Feather
                name="send"
                size={18}
                color={colors.textMuted}
                style={styles.detailIcon}
              />
              <View style={styles.detailCopy}>
                <Text style={styles.detailTitle}>6E 2184 · departs 09:15</Text>
                <Text style={styles.detailMeta}>
                  We track the flight and adjust pickup if it is delayed
                </Text>
              </View>
            </View>
            <Text style={styles.detailNote}>
              Optional — helps us hold the driver if your flight moves.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>PICK-UP TIME</Text>
          <View style={styles.pickupCard}>
            <Feather name="calendar" size={20} color={colors.isDark ? colors.white : colors.navy[800]} />
            <View style={styles.pickupCopy}>
              <Text style={styles.detailTitle}>Today, 06:30 am</Text>
              <Text style={styles.detailMeta}>
                Arrive 3 h before an international departure
              </Text>
            </View>
            <TouchableOpacity activeOpacity={0.7}
              style={styles.editBtn}
              onPress={() =>
                showToast({type: 'info', message: 'Edit pick-up time'})
              }
              hitSlop={8}>
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>AIRPORT SURCHARGE</Text>
          <View style={styles.surchargeCard}>
            <View style={styles.surchargeHeader}>
              <Feather
                name="info"
                size={16}
                color={colors.primary}
              />
              <Text style={styles.surchargeTitle}>What the airport adds</Text>
            </View>
            {SURCHARGES.map(row => (
              <View key={row.id} style={styles.surchargeRow}>
                <Text style={styles.surchargeLabel}>{row.label}</Text>
                <Text style={styles.surchargeValue}>₹{row.amount}</Text>
              </View>
            ))}
            <Text style={styles.surchargeFooter}>
              Included in the estimate below.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, {paddingBottom: Math.max(insets.bottom - 16, 4)}]}>
        <View style={styles.fareCopy}>
          <Text style={styles.fareLabel}>Estimated fare · Comfort</Text>
          <Text style={styles.fareValue}>₹1,520</Text>
          <Text style={styles.fareNote}>
            Includes ₹{SURCHARGE_TOTAL} of airport charges
          </Text>
        </View>
        <Button
          title="Book"
          onPress={onBook}
          style={styles.bookBtn}
          textStyle={styles.bookText}
          fullWidth={false}
          accessibilityLabel="Book airport ride"
        />
      </View>
    </View>
  );
}
