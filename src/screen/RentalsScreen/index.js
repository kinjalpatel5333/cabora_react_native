import { PASSENGER_RENTALS_PACKAGES, PASSENGER_RENTALS_VEHICLES } from '../../config/staticData';
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

const PACKAGES = PASSENGER_RENTALS_PACKAGES;

const VEHICLES = PASSENGER_RENTALS_VEHICLES;

function formatPrice(n) {
  return `₹${n.toLocaleString('en-IN')}`;
}

export default function RentalsScreen() {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);
  const {colors} = useApp();
  const navigation = useNavigation();
  const {showToast} = useToast();
  const [packageId, setPackageId] = useState('8h');
  const [vehicleId, setVehicleId] = useState('comfort');

  const selectedPkg = useMemo(
    () => PACKAGES.find(p => p.id === packageId) || PACKAGES[2],
    [packageId],
  );
  const selectedVehicle = useMemo(
    () => VEHICLES.find(v => v.id === vehicleId) || VEHICLES[0],
    [vehicleId],
  );
  const totalPrice = selectedPkg.price + selectedVehicle.priceAdd;

  const onBook = () => {
    showToast({type: 'success', message: 'Rental booked'});
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
        <Text style={styles.headerTitle} numberOfLines={1}>
          Rent a car with driver
        </Text>
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
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>CHOOSE A PACKAGE</Text>
          <View style={styles.packageGrid}>
            {PACKAGES.map(pkg => {
              const active = pkg.id === packageId;
              return (
                <Pressable
                  key={pkg.id}
                  style={[
                    styles.packageCard,
                    active && styles.packageCardActive,
                  ]}
                  onPress={() => setPackageId(pkg.id)}
                  accessibilityRole="button"
                  accessibilityState={{selected: active}}>
                  {active ? (
                    <View style={styles.packageCheck}>
                      <Feather name="check" size={12} color={colors.white} />
                    </View>
                  ) : null}
                  <Text style={styles.packageHours}>{pkg.label}</Text>
                  <Text style={styles.packageKm}>{pkg.km} km included</Text>
                  <Text
                    style={[
                      styles.packagePrice,
                      active && styles.packagePriceActive,
                    ]}>
                    {formatPrice(pkg.price)}
                  </Text>
                  <Text style={styles.packageAfter}>
                    ₹{pkg.afterKm}/km after
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>WHEN & WHERE</Text>
          <View style={styles.card}>
            <View style={styles.whereRow}>
              <View style={styles.pinIcon}>
                <Feather name="map-pin" size={18} color={colors.primary} />
              </View>
              <View style={styles.whereCopy}>
                <Text style={styles.whereTitle}>Indiranagar 100ft Road</Text>
                <Text style={styles.whereMeta}>
                  Driver reaches 10 minutes early
                </Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.scheduleRow}>
              <Feather name="calendar" size={20} color={colors.isDark ? colors.white : colors.navy[800]} />
              <View style={styles.whereCopy}>
                <Text style={styles.whereTitle}>Sat 13 Sep · 09:00 am</Text>
                <Text style={styles.whereMeta}>Ends around 05:00 pm</Text>
              </View>
              <Pressable
                style={styles.editBtn}
                onPress={() =>
                  showToast({type: 'info', message: 'Edit schedule'})
                }
                hitSlop={8}>
                <Text style={styles.editText}>Edit</Text>
              </Pressable>
            </View>
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
              const price = selectedPkg.price + vehicle.priceAdd;
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
                  <Text
                    style={[
                      styles.vehiclePrice,
                      active && styles.vehiclePriceActive,
                    ]}>
                    {formatPrice(price)}
                  </Text>
                  <Text style={styles.vehicleMeta}>
                    {vehicle.model} · {vehicle.seats} seats
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.infoBanner}>
          <Feather name="info" size={16} color={colors.textMuted} />
          <Text style={styles.infoText}>
            Fuel, driver allowance and {selectedPkg.km} km are included. Tolls
            and parking are extra.
          </Text>
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          {paddingBottom: Math.max(insets.bottom, 12)},
        ]}>
        <View style={styles.fareCopy}>
          <Text style={styles.fareLabel}>
            {selectedPkg.hours} hours · {selectedPkg.km} km ·{' '}
            {selectedVehicle.name}
          </Text>
          <Text style={styles.fareValue}>{formatPrice(totalPrice)}</Text>
          <Text style={styles.fareNote}>
            ₹{selectedPkg.afterKm}/km and ₹{selectedPkg.beyondHr}/hr beyond the
            package
          </Text>
        </View>
        <Pressable
          style={styles.bookBtn}
          onPress={onBook}
          accessibilityRole="button"
          accessibilityLabel="Book rental">
          <Text style={styles.bookText}>Book</Text>
        </Pressable>
      </View>
    </View>
  );
}
