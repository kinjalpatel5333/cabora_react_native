import React from 'react';
import {
  Dimensions,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import {Feather} from '@react-native-vector-icons/feather/static';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import useThemedStyles from '../../components/useThemedStyles';
import {useApp} from '../../context/AppContext';
import createStyles from './tripCompletedStyle';

const FARE_ROWS = [
  {id: 'base', label: 'Base fare', value: '₹60.00'},
  {id: 'distance', label: 'Distance · 14.2 km', value: '₹156.20'},
  {id: 'time', label: 'Time · 38 min', value: '₹41.80'},
  {id: 'surge', label: 'Peak-hour surge 1.2x', value: '₹19.60'},
  {id: 'tax', label: 'Taxes & fees (GST 5%)', value: '₹13.90'},
  {
    id: 'promo',
    label: 'Promo CABORA50',
    value: '- ₹50.00',
    promo: true,
  },
];

const {width: SCREEN_W, height: SCREEN_H} = Dimensions.get('window');
const CIRCLE = SCREEN_W * 1.35;

export default function TripCompletedScreen({
  pickup = '12, Brigade Road, Ashok Nagar',
  drop = 'Kempegowda Intl. Airport, T2',
  rideName = 'Cab Sedan',
  totalPaid = '₹241.50',
  paymentLabel = 'UPI · you@okaxis · Txn CBR8241905',
  onRate,
}) {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);
  const {colors} = useApp();
  const bottomPad = Math.max(insets.bottom, 16) + 12;
  const heroHeight = insets.top + 210;

  return (
    <View style={[styles.root, {height: SCREEN_H, width: SCREEN_W}]}>
      <StatusBar
        animated
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />

      {/* Full mint wash under status bar — only behind hero */}
      <View style={[styles.mintWash, {height: heroHeight}]} />
      {/* Soft larger circle behind check (same as mock) */}
      <View
        pointerEvents="none"
        style={[
          styles.softCircle,
          {
            width: CIRCLE,
            height: CIRCLE,
            borderRadius: CIRCLE / 2,
            top: insets.top + 20 - CIRCLE * 0.42,
            left: (SCREEN_W - CIRCLE) / 2,
          },
        ]}
      />

      <ScrollView
        style={styles.scrollFlex}
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={styles.scrollContent}>
        <View style={[styles.heroContent, {paddingTop: insets.top + 44}]}>
          <View style={styles.checkBadge}>
            <Feather name="check" size={24} color={colors.green[800]} />
          </View>
          <Text style={styles.title}>Trip completed</Text>
          <Text style={styles.meta}>
            14.2 km · 38 min · {rideName} · Today 12:24 pm
          </Text>
        </View>

        <View style={styles.body}>
          <View style={styles.tripCard}>
            <View style={styles.timeline}>
              <View style={styles.pickupDot} />
              <View style={styles.timelineLine} />
              <View style={styles.dropSquare} />
            </View>
            <View style={styles.tripCopy}>
              <View style={styles.tripBlock}>
                <Text style={styles.tripLabel}>PICKUP</Text>
                <Text style={styles.tripAddress}>{pickup}</Text>
              </View>
              <View style={styles.tripBlock}>
                <Text style={styles.tripLabel}>DROP</Text>
                <Text style={styles.tripAddress}>{drop}</Text>
              </View>
            </View>
          </View>

          <View style={styles.fareCard}>
            <Text style={styles.fareTitle}>FARE BREAKDOWN</Text>
            {FARE_ROWS.map(row => (
              <View key={row.id} style={styles.fareRow}>
                <Text
                  style={[
                    styles.fareLabel,
                    row.promo && styles.fareLabelPromo,
                  ]}>
                  {row.label}
                </Text>
                <Text
                  style={[
                    styles.fareValue,
                    row.promo && styles.fareValuePromo,
                  ]}>
                  {row.value}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.paidBox}>
            <Feather name="check-circle" size={20} color={colors.green[600]} />
            <View style={styles.paidCopy}>
              <Text style={styles.paidTitle}>Paid in full</Text>
              <Text style={styles.paidSub}>{paymentLabel}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, {paddingBottom: bottomPad}]}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total paid</Text>
          <Text style={styles.totalValue}>{totalPaid}</Text>
        </View>
        <Pressable style={styles.rateBtn} onPress={onRate}>
          <Text style={styles.rateText}>Rate your ride</Text>
        </Pressable>
      </View>
    </View>
  );
}
