import { PASSENGER_OUTSTATION_VEHICLES, PASSENGER_OUTSTATION_FARE_ROWS } from '../../config/staticData';
import React, {useMemo, useState} from 'react';
import {ScrollView, Text, View, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Feather} from '@react-native-vector-icons/feather/static';
import {MaterialDesignIcons} from '@react-native-vector-icons/material-design-icons/static';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useToast} from '../../components/Toast';
import {Button} from '../../components';
import useThemedStyles from '../../components/useThemedStyles';
import {useApp} from '../../context/AppContext';
import createStyles from './style';
import colors from '../../config/color';

const VEHICLES = PASSENGER_OUTSTATION_VEHICLES;

const FARE_ROWS = PASSENGER_OUTSTATION_FARE_ROWS;

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
      <View style={[styles.header, {paddingTop: insets.top + 4}]}>
        <TouchableOpacity activeOpacity={0.7}
          style={styles.headerBtn}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={8}>
          <Feather name="arrow-left" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Outstation trip</Text>
        <TouchableOpacity activeOpacity={0.7}
          style={styles.headerBtn}
          onPress={() => navigation.navigate('Help')}
          accessibilityRole="button"
          accessibilityLabel="Help"
          hitSlop={8}>
          <Feather name="help-circle" size={22} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, {paddingBottom: 24}]}>
        <View style={styles.tripToggle}>
          <TouchableOpacity activeOpacity={0.7}
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
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.7}
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
          </TouchableOpacity>
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
          <TouchableOpacity activeOpacity={0.7}
            style={styles.swapBtn}
            onPress={swapCities}
            accessibilityRole="button"
            accessibilityLabel="Swap locations"
            hitSlop={8}>
            <Feather name="refresh-cw" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>DATES</Text>
          <View style={styles.datesCard}>
            <View style={styles.dateCol}>
              <Text style={styles.dateLabel}>DEPART</Text>
              <Text style={styles.dateValue}>Sat 13 Sep · 07:00 am</Text>
              <TouchableOpacity activeOpacity={0.7}
                onPress={() =>
                  showToast({type: 'info', message: 'Edit depart time'})
                }
                hitSlop={8}>
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>
            </View>
            {tripType === 'round' ? (
              <>
                <View style={styles.dateDivider} />
                <View style={styles.dateCol}>
                  <Text style={styles.dateLabel}>RETURN</Text>
                  <Text style={styles.dateValue}>Sun 14 Sep · 06:00 pm</Text>
                  <TouchableOpacity activeOpacity={0.7}
                    onPress={() =>
                      showToast({type: 'info', message: 'Edit return time'})
                    }
                    hitSlop={8}>
                    <Text style={styles.editText}>Edit</Text>
                  </TouchableOpacity>
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
                <TouchableOpacity activeOpacity={0.7}
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
                </TouchableOpacity>
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
        <Button
          title="Book"
          onPress={onBook}
          style={styles.bookBtn}
          textStyle={styles.bookText}
          fullWidth={false}
          accessibilityLabel="Book outstation trip"
        />
      </View>
    </View>
  );
}
