import React, {useMemo, useState} from 'react';
import {
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Feather} from '@react-native-vector-icons/feather/static';
import {MaterialDesignIcons} from '@react-native-vector-icons/material-design-icons/static';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useToast} from '../../components/Toast';
import useThemedStyles from '../../components/useThemedStyles';
import {useApp} from '../../context/AppContext';
import createStyles from './style';
import colors from '../../config/color';

const VEHICLES = [
  {
    id: 'comfort',
    name: 'Comfort',
    model: 'Dzire',
    seats: '4 seats',
    icon: 'car-side',
    price: 4860,
  },
  {
    id: 'xl',
    name: 'XL',
    model: 'Ertiga',
    seats: '6',
    icon: 'car-estate',
    price: 6420,
  },
  {
    id: 'premium',
    name: 'Premium',
    model: 'Civic',
    seats: '4',
    icon: 'car-side',
    price: 8940,
  },
];

const FARE_ROWS = [
  {id: 'km', label: '288 km at ₹13/km', amount: 3744},
  {id: 'allowance', label: 'Driver allowance (2 days)', amount: 600},
  {id: 'permit', label: 'State permit & toll', amount: 396},
  {id: 'gst', label: 'GST (5%)', amount: 120},
];

function formatPrice(n) {
  return `₹${n.toLocaleString('en-IN')}`;
}

export default function OutstationScreen() {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);
  const {colors} = useApp();
  const navigation = useNavigation();
  const {showToast} = useToast();
  const [tripType, setTripType] = useState('round');
  const [vehicleId, setVehicleId] = useState('comfort');
  const [fromCity, setFromCity] = useState({
    city: 'Bengaluru',
    detail: 'Indiranagar 100ft Road',
  });
  const [toCity, setToCity] = useState({
    city: 'Mysuru',
    detail: '144 km · about 3 h 10 min each way',
  });

  const selectedVehicle = useMemo(
    () => VEHICLES.find(v => v.id === vehicleId) || VEHICLES[0],
    [vehicleId],
  );

  const swapCities = () => {
    setFromCity(toCity);
    setToCity(fromCity);
  };

  const onBook = () => {
    showToast({type: 'success', message: 'Outstation trip booked'});
    navigation.goBack();
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle={colors.barStyle} backgroundColor={colors.card} />
      <View style={[styles.header, {paddingTop: insets.top + 4}]}>
        <Pressable
          style={styles.headerBtn}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={8}>
          <Feather name="arrow-left" size={22} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Outstation trip</Text>
        <Pressable
          style={styles.headerBtn}
          onPress={() => navigation.navigate('Help')}
          accessibilityRole="button"
          accessibilityLabel="Help"
          hitSlop={8}>
          <Feather name="help-circle" size={22} color={colors.text} />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, {paddingBottom: 24}]}>
        <View style={styles.tripToggle}>
          <Pressable
            style={[
              styles.tripTab,
              tripType === 'oneway' && styles.tripTabActive,
            ]}
            onPress={() => setTripType('oneway')}>
            <Text
              style={[
                styles.tripTabText,
                tripType === 'oneway' && styles.tripTabTextActive,
              ]}>
              One way
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.tripTab,
              tripType === 'round' && styles.tripTabActive,
            ]}
            onPress={() => setTripType('round')}>
            <Text
              style={[
                styles.tripTabText,
                tripType === 'round' && styles.tripTabTextActive,
              ]}>
              Round trip
            </Text>
          </Pressable>
        </View>

        <View style={styles.routeCard}>
          <View style={styles.routeTimeline}>
            <View style={styles.routeDotStart} />
            <View style={styles.routeLine} />
            <View style={styles.routeDotEnd} />
          </View>
          <View style={styles.routeCopy}>
            <View>
              <Text style={styles.routeCity}>{fromCity.city}</Text>
              <Text style={styles.routeMeta}>{fromCity.detail}</Text>
            </View>
            <View>
              <Text style={styles.routeCity}>{toCity.city}</Text>
              <Text style={styles.routeMeta}>{toCity.detail}</Text>
            </View>
          </View>
          <Pressable
            style={styles.swapBtn}
            onPress={swapCities}
            accessibilityRole="button"
            accessibilityLabel="Swap locations"
            hitSlop={8}>
            <Feather name="refresh-cw" size={18} color={colors.textMuted} />
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>DATES</Text>
          <View style={styles.datesCard}>
            <View style={styles.dateCol}>
              <Text style={styles.dateLabel}>DEPART</Text>
              <Text style={styles.dateValue}>Sat 13 Sep · 07:00 am</Text>
              <Pressable
                onPress={() =>
                  showToast({type: 'info', message: 'Edit depart time'})
                }
                hitSlop={8}>
                <Text style={styles.editText}>Edit</Text>
              </Pressable>
            </View>
            {tripType === 'round' ? (
              <>
                <View style={styles.dateDivider} />
                <View style={styles.dateCol}>
                  <Text style={styles.dateLabel}>RETURN</Text>
                  <Text style={styles.dateValue}>Sun 14 Sep · 06:00 pm</Text>
                  <Pressable
                    onPress={() =>
                      showToast({type: 'info', message: 'Edit return time'})
                    }
                    hitSlop={8}>
                    <Text style={styles.editText}>Edit</Text>
                  </Pressable>
                </View>
              </>
            ) : null}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>VEHICLE</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.vehicleScroll}>
            {VEHICLES.map(vehicle => {
              const active = vehicle.id === vehicleId;
              const iconColor = active
                ? colors.primary
                : colors.isDark
                ? colors.white
                : colors.navy[800];
              return (
                <Pressable
                  key={vehicle.id}
                  style={[
                    styles.vehicleCard,
                    active && styles.vehicleCardActive,
                  ]}
                  onPress={() => setVehicleId(vehicle.id)}
                  accessibilityRole="button"
                  accessibilityState={{selected: active}}>
                  <MaterialDesignIcons
                    name={vehicle.icon}
                    size={22}
                    color={iconColor}
                  />
                  <Text style={styles.vehicleName}>{vehicle.name}</Text>
                  <Text style={styles.vehiclePrice}>
                    {formatPrice(vehicle.price)}
                  </Text>
                  <Text style={styles.vehicleMeta}>
                    {vehicle.model} · {vehicle.seats}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>FARE BREAKDOWN</Text>
          <View style={styles.fareCard}>
            {FARE_ROWS.map((row, index) => (
              <View
                key={row.id}
                style={[
                  styles.fareRow,
                  index === FARE_ROWS.length - 1 && styles.fareRowLast,
                ]}>
                <Text style={styles.fareLabel}>{row.label}</Text>
                <Text style={styles.fareAmount}>{formatPrice(row.amount)}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          {paddingBottom: Math.max(insets.bottom, 12)},
        ]}>
        <View style={styles.footerCopy}>
          <Text style={styles.footerTrip} numberOfLines={1}>
            {tripType === 'round' ? 'Round trip' : 'One way'} · {fromCity.city}{' '}
            ⇄ {toCity.city}
          </Text>
          <Text style={styles.footerPrice}>
            {formatPrice(selectedVehicle.price)}
          </Text>
          <Text style={styles.footerNote}>
            25% now, the rest after the trip
          </Text>
        </View>
        <Pressable
          style={styles.bookBtn}
          onPress={onBook}
          accessibilityRole="button"
          accessibilityLabel="Book outstation trip">
          <Text style={styles.bookText}>Book</Text>
        </Pressable>
      </View>
    </View>
  );
}
