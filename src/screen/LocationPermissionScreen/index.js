import { PASSENGER_LOCATION_BENEFITS, PASSENGER_LOCATION_SAVED_PLACES } from '../../config/staticData';
import React, {useMemo, useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {Feather} from '@react-native-vector-icons/feather/static';
import {Lucide} from '@react-native-vector-icons/lucide/static';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Button, SearchField} from '../../components';
import useThemedStyles from '../../components/useThemedStyles';
import {useApp} from '../../context/AppContext';
import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import {completeLocationPrompt} from '../../redux/slices/appSlice';
import {loginWithPhone} from '../../redux/slices/authSlice';
import {getMeApi} from '../../services/authApi';
import {updatePassengerCurrentLocationApi} from '../../services/userApi';
import {extractUserProfile} from '../../utils/user';
import {
  openLocationSettings,
  requestLocationPermission,
} from '../../utils/locationPermission';
import createStyles from './style';

const BENEFITS = PASSENGER_LOCATION_BENEFITS;

const SAVED_PLACES = PASSENGER_LOCATION_SAVED_PLACES;

function MapBackdrop({styles}) {
  return (
    <View style={styles.map} pointerEvents="none">
      <View style={[styles.park, {top: 70, left: 24, width: 110, height: 70}]} />
      <View style={[styles.park, {top: 210, right: 30, width: 90, height: 60}]} />
      <View style={[styles.water, {top: 120, right: -20, width: 140, height: 100}]} />
      <View style={[styles.building, {top: 90, left: 150, width: 48, height: 36}]} />
      <View style={[styles.building, {top: 160, left: 48, width: 56, height: 42}]} />
      <View style={[styles.building, {top: 250, left: 180, width: 64, height: 40}]} />
      <View style={[styles.mapRoadH, {top: 140}]} />
      <View style={[styles.mapRoadH, styles.mapRoadAlt, {top: 230, height: 7}]} />
      <View style={[styles.mapRoadV, {left: 90}]} />
      <View style={[styles.mapRoadV, styles.mapRoadAlt, {left: 220, width: 7}]} />
      <Text style={[styles.mapLabel, {top: 118, left: 108}]}>MG ROAD</Text>
      <Text style={[styles.mapLabel, {top: 248, left: 40}]}>BRIGADE</Text>
    </View>
  );
}

function BenefitIcon({name, color}) {
  if (name === 'map-pin') {
    return <Lucide name="map-pin" size={15} color={color} />;
  }
  if (name === 'shield-check') {
    return <Lucide name="shield-check" size={15} color={color} />;
  }
  return <Lucide name="clock" size={15} color={color} />;
}

function PlaceIcon({name, color}) {
  if (name === 'home') {
    return <Feather name="home" size={18} color={color} />;
  }
  if (name === 'briefcase') {
    return <Feather name="briefcase" size={18} color={color} />;
  }
  return <Feather name="clock" size={18} color={color} />;
}

export default function LocationPermissionScreen({navigation, route}) {
  const insets = useSafeAreaInsets();
  const {colors} = useApp();
  const styles = useThemedStyles(createStyles);
  const dispatch = useAppDispatch();
  const sessionRole = useAppSelector(state => state.auth.user?.role);
  const phone = route?.params?.mobile || '';
  const role = route?.params?.role || sessionRole || 'passenger';
  const userId = route?.params?.userId || '';
  const fromSetup = Boolean(phone);
  const [mode, setMode] = useState('prompt');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);

  const places = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) {
      return SAVED_PLACES;
    }
    return SAVED_PLACES.filter(
      place =>
        place.title.toLowerCase().includes(q) ||
        place.subtitle.toLowerCase().includes(q),
    );
  }, [search]);

  const finish = async resolution => {
    setLoading(true);
    try {
      // Mark location done before login so RootNavigator does not flash this screen again.
      await dispatch(completeLocationPrompt(resolution)).unwrap();
      if (fromSetup) {
        let userRaw = route?.params?.user;
        if (!userRaw || !userRaw.name) {
          try {
            const meRes = await getMeApi();
            userRaw = meRes;
          } catch (e) {
            console.warn('Failed to fetch me in LocationPermission:', e);
          }
        }

        const profile = extractUserProfile(userRaw, phone);

        const token = route?.params?.token;
        if (profile.isProfileComplete) {
          // Returning user who already has profile data filled / verified
          await dispatch(
            loginWithPhone({
              phone: profile.mobile || phone,
              role,
              name: profile.name,
              email: profile.email || `${phone}@cabora.local`,
              dob: profile.dob,
              photo: profile.photo,
              gender: profile.gender,
              token,
            }),
          ).unwrap();
        } else {
          // 1st-time user with no profile data - proceed to CompleteProfile screen
          navigation.navigate('CompleteProfile', {
            mobile: phone,
            role,
            userId,
            user: profile,
            token,
          });
        }
      } else if (role === 'driver' && navigation?.replace) {
        navigation.replace('DriverTabs');
      }
    } catch (err) {
      console.warn('Location finish failed', err);
    } finally {
      setLoading(false);
    }
  };

  const onAllow = async () => {
    setLoading(true);
    const result = await requestLocationPermission();
    if (result === 'granted') {
      try {
        await updatePassengerCurrentLocationApi({
          lat: 21.1702,
          long: 72.8311,
          address: 'Varachha, Surat, Gujarat',
        });
      } catch (e) {
        console.warn('Failed to update passenger location on permission allow:', e);
      }
      await finish('granted');
      return;
    }
    setLoading(false);
    setMode('manual');
  };

  const onManualEntry = () => setMode('manual');

  const onSetPickupManually = async () => {
    try {
      const selected = places.find(p => p.id === selectedPlace);
      await updatePassengerCurrentLocationApi({
        lat: 21.1702,
        long: 72.8311,
        address: selected?.subtitle || selected?.title || 'Varachha, Surat, Gujarat',
      });
    } catch (e) {
      console.warn('Failed to update passenger location on manual select:', e);
    }
    await finish(selectedPlace ? `manual:${selectedPlace}` : 'manual');
  };

  return (
    <View style={styles.root}>
      <MapBackdrop styles={styles} />

      {mode === 'manual' ? (
        <View style={[styles.banner, {top: insets.top + 10}]}>
          <Lucide name="triangle-alert" size={18} color={colors.orange[600]} />
          <Text style={styles.bannerText}>
            Location is off — set your pickup manually
          </Text>
        </View>
      ) : null}

      <View
        style={[
          styles.sheet,
          {paddingBottom: Math.max(insets.bottom, 16) + 8},
        ]}>
        {mode === 'prompt' ? (
          <>
            <View style={styles.iconBadge}>
              <Lucide name="crosshair" size={22} color={colors.orange[600]} />
            </View>
            <Text style={styles.title}>Turn on location</Text>
            <Text style={styles.body}>
              So we can drop your pin on the right side of the road and show
              drivers who are actually close.
            </Text>
            {BENEFITS.map(item => (
              <View key={item.id} style={styles.benefitRow}>
                <View style={styles.benefitIcon}>
                  <BenefitIcon name={item.icon} color={colors.gray[600]} />
                </View>
                <Text style={styles.benefitText}>{item.text}</Text>
              </View>
            ))}
            <View style={styles.actions}>
              <Button
                title="Allow while using the app"
                onPress={onAllow}
                loading={loading}
              />
              <TouchableOpacity
                activeOpacity={0.7}
                accessibilityRole="button"
                onPress={onManualEntry}
                style={styles.linkBtn}>
                <Text style={styles.linkText}>Enter my pickup manually</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.title}>Where should we pick you up?</Text>
            <Text style={styles.body}>
              Location access is off, so search for your pickup point or choose
              a saved place.
            </Text>
            <View style={styles.searchWrap}>
              <SearchField
                value={search}
                onChangeText={setSearch}
                placeholder="Search a street, area or landmark"
              />
            </View>
            {places.map(place => {
              const selected = selectedPlace === place.id;
              return (
                <TouchableOpacity
                  key={place.id}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  onPress={() => setSelectedPlace(place.id)}
                  style={styles.placeRow}>
                  <View
                    style={[
                      styles.placeIcon,
                      selected && {backgroundColor: colors.orange[100]},
                    ]}>
                    <PlaceIcon
                      name={place.icon}
                      color={selected ? colors.orange[600] : colors.navy[800]}
                    />
                  </View>
                  <View style={styles.placeCopy}>
                    <Text style={styles.placeTitle}>{place.title}</Text>
                    <Text style={styles.placeSub}>{place.subtitle}</Text>
                  </View>
                  <Text style={styles.chevron}>›</Text>
                </TouchableOpacity>
              );
            })}
            <View style={styles.actions}>
              <Button
                title="Set pickup manually"
                onPress={onSetPickupManually}
                loading={loading}
              />
              <Button
                title="Open location settings"
                variant="outline"
                onPress={openLocationSettings}
                disabled={loading}
              />
            </View>
          </>
        )}
      </View>
    </View>
  );
}
