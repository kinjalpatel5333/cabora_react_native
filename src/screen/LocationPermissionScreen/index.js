import { PASSENGER_LOCATION_BENEFITS, PASSENGER_LOCATION_SAVED_PLACES } from '../../config/staticData';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Animated, Image, Text, TouchableOpacity, View} from 'react-native';
import {Feather} from '@react-native-vector-icons/feather/static';
import {Lucide} from '@react-native-vector-icons/lucide/static';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Geolocation from '@react-native-community/geolocation';
import {images} from '../../assets';
import {Button, SearchField} from '../../components';
import useThemedStyles from '../../components/useThemedStyles';
import {useApp} from '../../context/AppContext';
import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import {completeLocationPrompt} from '../../redux/slices/appSlice';
import {loginWithPhone} from '../../redux/slices/authSlice';
import {getMeApi} from '../../services/authApi';
import {updatePassengerCurrentLocationApi} from '../../services/userApi';
import {extractUserProfile} from '../../utils/user';
import {useAuth} from '../../hooks/useAuth';
import {
  openLocationSettings,
  requestLocationPermission,
} from '../../utils/locationPermission';
import createStyles from './style';

const BENEFITS = PASSENGER_LOCATION_BENEFITS;

const SAVED_PLACES = PASSENGER_LOCATION_SAVED_PLACES;



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
  const {colors, isDark} = useApp();
  const styles = useThemedStyles(createStyles);
  const dispatch = useAppDispatch();
  const {user: authUser} = useAuth();
  const sessionRole = useAppSelector(state => state.auth.user?.role);
  const phone = route?.params?.mobile || authUser?.phone || authUser?.mobile || '';
  const role = route?.params?.role || sessionRole || authUser?.role || 'passenger';
  const userId = route?.params?.userId || authUser?.id || '';
  const fromSetup = Boolean(route?.params?.mobile || route?.params?.userId);
  const [mode, setMode] = useState('prompt');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const slideAnim = useRef(new Animated.Value(500)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: 0,
      tension: 65,
      friction: 11,
      useNativeDriver: true,
    }).start();
  }, [slideAnim]);

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

      let userRaw = route?.params?.user || authUser || {};
      const userPhone = phone || userRaw?.mobile || userRaw?.phone || '';
      const token = route?.params?.token || authUser?.token;

      if (!userRaw || !userRaw.name) {
        try {
          const meRes = await getMeApi();
          if (meRes) {
            userRaw = meRes;
          }
        } catch (e) {
          console.warn('Failed to fetch me in LocationPermission:', e);
        }
      }

      const profile = extractUserProfile(userRaw, userPhone);

      const isNewUser =
        route?.params?.isNewUser ??
        userRaw?.isNewUser ??
        userRaw?.passenger?.isNewUser ??
        userRaw?.data?.isNewUser ??
        profile.isNewUser;

      // Profile is complete if: not new user, or profile completed flag is true, or has full name + dob
      const isProfileDone = Boolean(
        isNewUser === false ||
        userRaw?.profileCompleted === true ||
        userRaw?.isProfileComplete === true ||
        profile.isProfileComplete === true ||
        (profile.name && profile.name.trim().length > 0 && profile.dob && profile.dob.trim().length > 0)
      );

      if (role === 'driver') {
        const isDriverDone = Boolean(
          userRaw?.isComplete === true ||
          userRaw?.driver?.isComplete === true ||
          userRaw?.isCompleted === true ||
          userRaw?.driver?.isCompleted === true ||
          userRaw?.driver?.onboardingCompleted === true ||
          userRaw?.kycComplete === true
        );
        if (isDriverDone) {
          if (navigation?.replace) {
            navigation.replace('DriverTabs');
          } else {
            navigation.navigate('DriverTabs');
          }
        } else {
          if (navigation?.replace) {
            navigation.replace('DriverRegistration', { mobile: userPhone, userId, user: profile, token });
          } else {
            navigation.navigate('DriverRegistration', { mobile: userPhone, userId, user: profile, token });
          }
        }
        return;
      }

      if (fromSetup) {
        if (isProfileDone) {
          // Returning user who has completed profile -> Log in and land on Home
          await dispatch(
            loginWithPhone({
              phone: profile.mobile || userPhone,
              role,
              name: profile.name,
              email: profile.email || `${userPhone}@cabora.local`,
              dob: profile.dob,
              photo: profile.photo,
              gender: profile.gender,
              token,
              user: userRaw,
              isOnBoarding: false,
            }),
          ).unwrap();
        } else {
          // 1st-time user with incomplete profile -> proceed to CompleteProfile screen
          navigation.navigate('CompleteProfile', {
            mobile: userPhone,
            role,
            userId,
            user: profile,
            token,
          });
        }
      } else {
        // Already within PassengerStack
        if (isProfileDone) {
          // Profile complete -> Navigate to Home (MainTabs)
          if (navigation?.replace) {
            navigation.replace('MainTabs');
          } else {
            navigation.navigate('MainTabs');
          }
        } else {
          // Profile incomplete -> Navigate to CompleteProfile
          if (navigation?.replace) {
            navigation.replace('CompleteProfile', {
              mobile: userPhone,
              role,
              userId,
              user: profile,
              token,
            });
          } else {
            navigation.navigate('CompleteProfile', {
              mobile: userPhone,
              role,
              userId,
              user: profile,
              token,
            });
          }
        }
      }
    } catch (err) {
      console.warn('Location finish failed', err);
    } finally {
      setLoading(false);
    }
  };

  const closeAndFinish = resolution => {
    Animated.timing(slideAnim, {
      toValue: 500,
      duration: 250,
      useNativeDriver: true,
    }).start(async () => {
      await finish(resolution);
    });
  };

  const onAllow = async () => {
    setLoading(true);
    try {
      const result = await requestLocationPermission();
      if (result === 'granted') {
        let lat = 21.1702;
        let long = 72.8311;
        let address = 'Varachha, Surat, Gujarat';

        try {
          const pos = await new Promise((resolve, reject) => {
            Geolocation.getCurrentPosition(
              p => resolve(p),
              err => reject(err),
              {enableHighAccuracy: true, timeout: 8000, maximumAge: 10000},
            );
          });
          if (pos?.coords?.latitude && pos?.coords?.longitude) {
            lat = Number(pos.coords.latitude.toFixed(6));
            long = Number(pos.coords.longitude.toFixed(6));
          }
        } catch (geoErr) {
          console.warn('Geolocation getCurrentPosition fallback:', geoErr);
        }

        try {
          if (role !== 'driver') {
            await updatePassengerCurrentLocationApi({
              lat,
              long,
              address,
            });
          }
        } catch (e) {
          console.warn('Failed to update passenger location on permission allow:', e);
        }

        closeAndFinish('granted');
        return;
      }
    } catch (err) {
      console.warn('onAllow error:', err);
    } finally {
      setLoading(false);
    }
    setMode('manual');
  };

  const onManualEntry = () => setMode('manual');

  const onSetPickupManually = async () => {
    try {
      if (role !== 'driver') {
        const selected = places.find(p => p.id === selectedPlace);
        await updatePassengerCurrentLocationApi({
          lat: 21.1702,
          long: 72.8311,
          address: selected?.subtitle || selected?.title || 'Varachha, Surat, Gujarat',
        });
      }
    } catch (e) {
      console.warn('Failed to update passenger location on manual select:', e);
    }
    closeAndFinish(selectedPlace ? `manual:${selectedPlace}` : 'manual');
  };

  return (
    <View style={styles.root}>
      <Image
        source={isDark ? images.homeMapDark : images.homeMap}
        style={styles.mapImage}
        resizeMode="cover"
        accessibilityIgnoresInvertColors
      />

      {mode === 'manual' ? (
        <View style={[styles.banner, {top: insets.top + 10}]}>
          <Lucide name="triangle-alert" size={18} color={colors.orange[600]} />
          <Text style={styles.bannerText}>
            Location is off — set your pickup manually
          </Text>
        </View>
      ) : null}

      <Animated.View
        style={[
          styles.sheet,
          {
            transform: [{translateY: slideAnim}],
            paddingBottom: Math.max(insets.bottom, 16) + 8,
          },
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
      </Animated.View>
    </View>
  );
}
