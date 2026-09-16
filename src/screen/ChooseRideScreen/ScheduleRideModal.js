import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import {Feather} from '@react-native-vector-icons/feather/static';
import {MaterialDesignIcons} from '@react-native-vector-icons/material-design-icons/static';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import useThemedStyles from '../../components/useThemedStyles';
import {useApp} from '../../context/AppContext';
import createStyles from './scheduleRideStyle';

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const TIMES = [
  '05:30 am',
  '06:00 am',
  '06:30 am',
  '07:00 am',
  '07:30 am',
  '08:00 am',
  '08:30 am',
  '09:00 am',
];

const VEHICLES = [
  {
    id: 'comfort',
    name: 'Comfort',
    price: 1180,
    meta: 'Sedan · 4',
    icon: 'car-side',
  },
  {
    id: 'economy',
    name: 'Economy',
    price: 940,
    meta: 'Hatch · 4',
    icon: 'car-hatchback',
  },
  {
    id: 'xl',
    name: 'XL',
    price: 1640,
    meta: 'SUV · 6',
    icon: 'van-passenger',
  },
];

const DAY_CARD_W = 58;
const DAY_GAP = 10;
const SCREEN_W = Dimensions.get('window').width;
const TIME_GAP = 10;
const TIME_CHIP_W = (SCREEN_W - 40 - TIME_GAP * 3) / 4;

function daysInMonth(year, monthIndex) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

function buildDays(year, monthIndex) {
  const count = daysInMonth(year, monthIndex);
  const days = [];
  for (let d = 1; d <= count; d += 1) {
    const date = new Date(year, monthIndex, d);
    days.push({
      key: `${year}-${monthIndex}-${d}`,
      day: d,
      weekday: DAY_NAMES[date.getDay()],
    });
  }
  return days;
}

function formatPrice(n) {
  return `₹${Number(n).toLocaleString('en-IN')}`;
}

export default function ScheduleRideModal({
  visible,
  onClose,
  onConfirm,
  onChangePayment,
  pickupTitle = 'Indiranagar 100ft Road',
  pickupSub = 'Home · gate 2',
  dropTitle = 'Kempegowda Airport · T2',
  dropSub = '38.4 km · about 52 min',
  paymentLabel = 'HDFC ....4821',
}) {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);
  const {colors} = useApp();

  const [monthCursor, setMonthCursor] = useState(() => new Date(2026, 8, 1));
  const [selectedDay, setSelectedDay] = useState(12);
  const [selectedTime, setSelectedTime] = useState('06:30 am');
  const [vehicleId, setVehicleId] = useState('comfort');

  const daysScrollRef = useRef(null);

  useEffect(() => {
    if (visible) {
      setMonthCursor(new Date(2026, 8, 1));
      setSelectedDay(12);
      setSelectedTime('06:30 am');
      setVehicleId('comfort');
      requestAnimationFrame(() => {
        const offset = Math.max(0, (12 - 3) * (DAY_CARD_W + DAY_GAP));
        daysScrollRef.current?.scrollTo({x: offset, animated: false});
      });
    }
  }, [visible]);

  const year = monthCursor.getFullYear();
  const monthIndex = monthCursor.getMonth();
  const days = useMemo(() => buildDays(year, monthIndex), [year, monthIndex]);

  const selectedVehicle =
    VEHICLES.find(v => v.id === vehicleId) || VEHICLES[0];

  const shiftMonth = delta => {
    setMonthCursor(prev => {
      const next = new Date(prev.getFullYear(), prev.getMonth() + delta, 1);
      const maxDay = daysInMonth(next.getFullYear(), next.getMonth());
      setSelectedDay(d => Math.min(d, maxDay));
      return next;
    });
  };

  const handleConfirm = () => {
    onConfirm?.({
      date: new Date(year, monthIndex, selectedDay),
      time: selectedTime,
      vehicle: selectedVehicle,
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}>
      <View style={styles.root}>
        <View style={[styles.header, {paddingTop: insets.top + 4}]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            style={styles.headerBtn}
            onPress={onClose}
            hitSlop={8}>
            <Feather name="arrow-left" size={22} color={colors.navy[900]} />
          </Pressable>
          <Text style={styles.headerTitle}>Schedule a ride</Text>
          <Pressable style={styles.headerBtn} hitSlop={8}>
            <Feather name="help-circle" size={22} color={colors.navy[800]} />
          </Pressable>
        </View>

        <ScrollView
          style={styles.scroll}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          <View style={styles.routeCard}>
            <View style={styles.timeline}>
              <View style={styles.pickupDot} />
              <View style={styles.timelineLine} />
              <View style={styles.dropDot} />
            </View>
            <View style={styles.routeCopy}>
              <View>
                <Text style={styles.routeTitle} numberOfLines={1}>
                  {pickupTitle}
                </Text>
                <Text style={styles.routeSub} numberOfLines={1}>
                  {pickupSub}
                </Text>
              </View>
              <View>
                <Text style={styles.routeTitle} numberOfLines={1}>
                  {dropTitle}
                </Text>
                <Text style={styles.routeSub} numberOfLines={1}>
                  {dropSub}
                </Text>
              </View>
            </View>
            <Pressable style={styles.editBtn} onPress={onClose} hitSlop={8}>
              <Feather name="edit-2" size={18} color={colors.navy[700]} />
            </Pressable>
          </View>

          <Text style={styles.sectionLabel}>WHEN</Text>
          <View style={styles.monthRow}>
            <Text style={styles.monthText}>
              {MONTH_NAMES[monthIndex]} {year}
            </Text>
            <View style={styles.monthNav}>
              <Pressable
                style={styles.monthNavBtn}
                onPress={() => shiftMonth(-1)}
                hitSlop={6}>
                <Feather name="chevron-left" size={18} color={colors.navy[800]} />
              </Pressable>
              <Pressable
                style={styles.monthNavBtn}
                onPress={() => shiftMonth(1)}
                hitSlop={6}>
                <Feather
                  name="chevron-right"
                  size={18}
                  color={colors.navy[800]}
                />
              </Pressable>
            </View>
          </View>

          <ScrollView
            ref={daysScrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.daysRow}>
            {days.map(item => {
              const active = item.day === selectedDay;
              return (
                <Pressable
                  key={item.key}
                  onPress={() => setSelectedDay(item.day)}
                  style={[styles.dayCard, active && styles.dayCardActive]}>
                  <Text
                    style={[styles.dayName, active && styles.dayNameActive]}>
                    {item.weekday}
                  </Text>
                  <Text style={[styles.dayNum, active && styles.dayNumActive]}>
                    {item.day}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <Text style={styles.sectionLabel}>PICK-UP TIME</Text>
          <Text style={styles.timeHint}>
            Fares can change if demand shifts before your ride.
          </Text>
          <View style={styles.timeGrid}>
            {TIMES.map(time => {
              const active = time === selectedTime;
              return (
                <Pressable
                  key={time}
                  onPress={() => setSelectedTime(time)}
                  style={[
                    styles.timeChip,
                    {width: TIME_CHIP_W},
                    active && styles.timeChipActive,
                  ]}>
                  <Text
                    style={[styles.timeText, active && styles.timeTextActive]}>
                    {time}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.sectionLabel}>VEHICLE</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.vehicleScroll}
            contentContainerStyle={styles.vehicleRow}>
            {VEHICLES.map(vehicle => {
              const active = vehicle.id === vehicleId;
              const iconColor = active
                ? colors.orange[500]
                : colors.navy[800];
              return (
                <Pressable
                  key={vehicle.id}
                  onPress={() => setVehicleId(vehicle.id)}
                  style={[
                    styles.vehicleCard,
                    active && styles.vehicleCardActive,
                  ]}>
                  <View style={styles.vehicleIcon}>
                    <MaterialDesignIcons
                      name={vehicle.icon}
                      size={28}
                      color={iconColor}
                    />
                  </View>
                  <Text style={styles.vehicleName}>{vehicle.name}</Text>
                  <Text style={styles.vehiclePrice}>
                    {formatPrice(vehicle.price)}
                  </Text>
                  <Text style={styles.vehicleMeta}>{vehicle.meta}</Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={styles.paymentCard}>
            <View style={styles.paymentIcon}>
              <Feather name="credit-card" size={18} color={colors.navy[800]} />
            </View>
            <View style={styles.paymentCopy}>
              <Text style={styles.paymentTitle}>{paymentLabel}</Text>
              <Text style={styles.paymentSub}>
                Charged when the ride completes
              </Text>
            </View>
            <Pressable hitSlop={8} onPress={onChangePayment}>
              <Text style={styles.changeText}>Change</Text>
            </Pressable>
          </View>
        </ScrollView>

        <View
          style={[styles.footer, {paddingBottom: Math.max(insets.bottom, 14)}]}>
          <View style={styles.fareCol}>
            <Text style={styles.fareLabel}>Estimated fare</Text>
            <Text style={styles.fareValue}>
              {formatPrice(selectedVehicle.price)}
            </Text>
            <Text style={styles.fareNote}>
              Free cancellation until 30 min before
            </Text>
          </View>
          <Pressable style={styles.confirmBtn} onPress={handleConfirm}>
            <Text style={styles.confirmText}>Confirm</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
