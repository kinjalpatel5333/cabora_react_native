import React, {useState} from 'react';
import {
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Feather} from '@react-native-vector-icons/feather/static';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useToast} from '../../components/Toast';
import useThemedStyles from '../../components/useThemedStyles';
import {useApp} from '../../context/AppContext';
import createStyles from './style';

const SURCHARGES = [
  {id: 'entry', label: 'Airport entry fee', amount: 150},
  {id: 'parking', label: 'Parking (reimbursed on receipt)', amount: 110},
  {id: 'terminal', label: 'Terminal pickup surcharge', amount: 80},
];

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
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      <View style={[styles.header, {paddingTop: insets.top + 4}]}>
        <Pressable
          style={styles.headerBtn}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={8}>
          <Feather name="arrow-left" size={22} color={colors.navy[900]} />
        </Pressable>
        <Text style={styles.headerTitle}>Airport ride</Text>
        <Pressable
          style={styles.headerBtn}
          onPress={() =>
            showToast({type: 'info', message: 'Airport ride help'})
          }
          accessibilityRole="button"
          accessibilityLabel="Help"
          hitSlop={8}>
          <Feather name="help-circle" size={22} color={colors.navy[900]} />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scroll,
          {paddingBottom: 24},
        ]}>
        <View style={styles.tripToggle}>
          <Pressable
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
          </Pressable>
          <Pressable
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
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>AIRPORT & TERMINAL</Text>
          <View style={styles.card}>
            <View style={styles.airportRow}>
              <View style={styles.pinIcon}>
                <Feather name="map-pin" size={18} color={colors.orange[600]} />
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
              <Pressable
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
              </Pressable>
              <Pressable
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
              </Pressable>
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
                color={colors.gray[400]}
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
            <Feather name="calendar" size={20} color={colors.navy[800]} />
            <View style={styles.pickupCopy}>
              <Text style={styles.detailTitle}>Today, 06:30 am</Text>
              <Text style={styles.detailMeta}>
                Arrive 3 h before an international departure
              </Text>
            </View>
            <Pressable
              style={styles.editBtn}
              onPress={() =>
                showToast({type: 'info', message: 'Edit pick-up time'})
              }
              hitSlop={8}>
              <Text style={styles.editText}>Edit</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>AIRPORT SURCHARGE</Text>
          <View style={styles.surchargeCard}>
            <View style={styles.surchargeHeader}>
              <Feather
                name="info"
                size={16}
                color={colors.orange[600]}
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
        <Pressable
          style={styles.bookBtn}
          onPress={onBook}
          accessibilityRole="button"
          accessibilityLabel="Book airport ride">
          <Text style={styles.bookText}>Book</Text>
        </Pressable>
      </View>
    </View>
  );
}
