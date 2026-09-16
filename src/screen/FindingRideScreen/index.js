import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import {Feather} from '@react-native-vector-icons/feather/static';
import {Lucide} from '@react-native-vector-icons/lucide/static';
import {MaterialDesignIcons} from '@react-native-vector-icons/material-design-icons/static';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import useThemedStyles from '../../components/useThemedStyles';
import {useApp} from '../../context/AppContext';
import {CoRiderMatchedSheet, DriverOnWaySheet, OnTripSheet} from './MatchedSheets';
import createStyles from './style';

const NEARBY = [
  {id: 'v1', icon: 'car-side', top: '18%', left: '18%'},
  {id: 'v2', icon: 'rickshaw', top: '28%', right: '16%'},
  {id: 'v3', icon: 'motorbike', bottom: '22%', left: '28%'},
];

const ALT_RIDES = [
  {id: 'auto', name: 'Auto', price: 96, icon: 'rickshaw'},
  {id: 'bike', name: 'Bike', price: 58, icon: 'motorbike'},
];

const PULSE_COUNT = 3;
const MATCH_MS = 5000;
const ON_TRIP_MS = 5000;
const NO_DRIVER_MS = 12000;

function RadarPulse({delay, styles}) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(progress, {
          toValue: 1,
          duration: 2400,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(progress, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [delay, progress]);

  const scale = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.35, 2.6],
  });
  const opacity = progress.interpolate({
    inputRange: [0, 0.15, 1],
    outputRange: [0.55, 0.35, 0],
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.radarPulse, {opacity, transform: [{scale}]}]}
    />
  );
}

export default function FindingRideModal({
  visible,
  onClose,
  onRequestCancel,
  rideName = 'Cab Sedan',
  pickup = '12, Brigade Road, Ashok Nagar',
  drop = 'Kempegowda Intl. Airport, T2',
  areaHint = 'Brigade Road',
  fare = 198,
}) {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);
  const {colors} = useApp();
  const [phase, setPhase] = useState('searching'); // searching | pool | driver | onTrip | unavailable
  const [searchKey, setSearchKey] = useState(0);
  const matchCoRiderRef = useRef(true);

  const spin = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(0.12)).current;
  const tripProgress = useRef(new Animated.Value(0.38)).current;

  useEffect(() => {
    if (!visible) {
      setPhase('searching');
      setSearchKey(0);
      spin.setValue(0);
      progress.setValue(0.12);
      tripProgress.setValue(0.38);
      return undefined;
    }

    setPhase('searching');
    // First search → solo driver modal; Search again → co-rider pool.
    matchCoRiderRef.current = searchKey % 2 === 1;

    const matchTimer = setTimeout(() => {
      setPhase(matchCoRiderRef.current ? 'pool' : 'driver');
    }, MATCH_MS);

    // Safety net if match somehow never fires.
    const failTimer = setTimeout(() => {
      setPhase(prev => (prev === 'searching' ? 'unavailable' : prev));
    }, NO_DRIVER_MS);

    return () => {
      clearTimeout(matchTimer);
      clearTimeout(failTimer);
    };
  }, [visible, searchKey, spin, progress, tripProgress]);

  // OTP / driver-on-way → On Trip after 5s
  useEffect(() => {
    if (!visible || phase !== 'driver') {
      return undefined;
    }
    const t = setTimeout(() => setPhase('onTrip'), ON_TRIP_MS);
    return () => clearTimeout(t);
  }, [visible, phase]);

  useEffect(() => {
    if (!visible || phase !== 'onTrip') {
      return undefined;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(tripProgress, {
          toValue: 0.72,
          duration: 4200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: false,
        }),
        Animated.timing(tripProgress, {
          toValue: 0.38,
          duration: 2200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: false,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [visible, phase, tripProgress]);

  useEffect(() => {
    if (!visible || phase !== 'searching') {
      spin.setValue(0);
      progress.setValue(0.12);
      return undefined;
    }

    const spinLoop = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 900,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    const progressLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(progress, {
          toValue: 0.82,
          duration: 3200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: false,
        }),
        Animated.timing(progress, {
          toValue: 0.22,
          duration: 1600,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: false,
        }),
      ]),
    );

    spinLoop.start();
    progressLoop.start();

    return () => {
      spinLoop.stop();
      progressLoop.stop();
    };
  }, [visible, phase, spin, progress]);

  const spinDeg = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const fillWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const onSearchAgain = () => {
    setPhase('searching');
    setSearchKey(key => key + 1);
  };

  const onCancelPress = () => {
    if (onRequestCancel) {
      onRequestCancel();
      return;
    }
    onClose?.();
  };

  const unavailable = phase === 'unavailable';
  const matched = phase === 'pool' || phase === 'driver' || phase === 'onTrip';
  const sheetMaxH =
    Dimensions.get('window').height *
    (phase === 'onTrip' ? 0.48 : unavailable || matched ? 0.7 : 0.52);

  const tripFillWidth = tripProgress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent>
      <View style={styles.root} pointerEvents="box-none">
        <Pressable style={styles.backdrop} onPress={onClose} />

        {phase === 'onTrip' ? (
          <View style={[styles.navBanner, {top: insets.top + 8}]}>
            <MaterialDesignIcons
              name="navigation"
              size={18}
              color={colors.orange[500]}
            />
            <View style={styles.navCopy}>
              <Text style={styles.navTitle} numberOfLines={1}>
                In 600 m, take the flyover
              </Text>
              <Text style={styles.navSub} numberOfLines={1}>
                towards Hosur Road · NH 44
              </Text>
            </View>
          </View>
        ) : (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={onClose}
            style={[styles.backBtn, {top: insets.top + 8}]}>
            <Feather
              name={matched ? 'chevron-down' : 'arrow-left'}
              size={22}
              color={colors.navy[900]}
            />
          </Pressable>
        )}

        {phase === 'onTrip' ? (
          <Pressable
            style={[styles.sosPill, {top: insets.top + 10}]}
            accessibilityRole="button"
            accessibilityLabel="SOS">
            <MaterialDesignIcons
              name="alarm-light"
              size={16}
              color={colors.red[500]}
            />
            <Text style={styles.sosPillText}>SOS</Text>
          </Pressable>
        ) : null}

        {phase === 'driver' ? (
          <View style={[styles.arrivalPill, {top: insets.top + 10}]}>
            <MaterialDesignIcons
              name="car-side"
              size={16}
              color={colors.orange[500]}
            />
            <Text style={styles.arrivalPillText} numberOfLines={1}>
              Arriving in 4 min · 1.2 km away
            </Text>
          </View>
        ) : null}

        {phase === 'driver' || phase === 'onTrip' ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Recenter map"
            style={[styles.locateFab, {bottom: sheetMaxH + 14}]}>
            <MaterialDesignIcons
              name="crosshairs-gps"
              size={22}
              color={colors.navy[800]}
            />
          </Pressable>
        ) : null}

        <View style={styles.radarArea} pointerEvents="none">
          {phase === 'driver' || phase === 'onTrip' ? (
            <>
              <View
                style={[
                  styles.driverRouteLine,
                  phase === 'onTrip' && styles.tripRouteGhost,
                ]}
              />
              {phase === 'onTrip' ? (
                <View style={styles.tripRouteActive} />
              ) : null}
              <View style={styles.driverRouteDot} />
              {phase === 'onTrip' ? (
                <View style={styles.tripCarPin}>
                  <MaterialDesignIcons
                    name="car-side"
                    size={16}
                    color={colors.white}
                  />
                </View>
              ) : null}
              {phase === 'onTrip' ? (
                <View style={styles.tripDropPin}>
                  <MaterialDesignIcons
                    name="map-marker"
                    size={28}
                    color={colors.navy[800]}
                  />
                </View>
              ) : null}
            </>
          ) : null}

          {phase === 'searching' || phase === 'pool'
            ? Array.from({length: PULSE_COUNT}).map((_, index) => (
                <RadarPulse
                  key={`pulse-${index}-${searchKey}`}
                  delay={index * 700}
                  styles={styles}
                />
              ))
            : null}

          {phase === 'searching' || phase === 'pool'
            ? NEARBY.map(vehicle => (
                <View
                  key={vehicle.id}
                  style={[
                    styles.vehiclePin,
                    vehicle.top != null && {top: vehicle.top},
                    vehicle.bottom != null && {bottom: vehicle.bottom},
                    vehicle.left != null && {left: vehicle.left},
                    vehicle.right != null && {right: vehicle.right},
                  ]}>
                  <MaterialDesignIcons
                    name={vehicle.icon}
                    size={18}
                    color={colors.navy[800]}
                  />
                </View>
              ))
            : null}

          {phase !== 'onTrip' ? (
            <View style={styles.radarCore}>
              <MaterialDesignIcons
                name="map-marker"
                size={52}
                color={colors.orange[500]}
                style={styles.radarPin}
              />
            </View>
          ) : null}
        </View>

        <View
          style={[
            styles.sheet,
            {
              maxHeight: sheetMaxH,
              paddingBottom: Math.max(insets.bottom, 10) + 10,
            },
          ]}>
          <View style={styles.grabber} />

          {phase === 'pool' ? (
            <CoRiderMatchedSheet fare={Math.max(fare, 412)} onCancel={onCancelPress} />
          ) : null}

          {phase === 'driver' ? (
            <DriverOnWaySheet onCancel={onCancelPress} />
          ) : null}

          {phase === 'onTrip' ? (
            <OnTripSheet
              drop={drop}
              progressWidth={tripFillWidth}
              onShare={() => {}}
            />
          ) : null}

          {unavailable ? (
            <ScrollView
              showsVerticalScrollIndicator={false}
              bounces={false}
              contentContainerStyle={styles.unavailableScroll}>
              <View style={styles.findingRow}>
                <View style={styles.warnIconWrap}>
                  <Lucide
                    name="triangle-alert"
                    size={22}
                    color={colors.amber[600]}
                  />
                </View>
                <View style={styles.findingCopy}>
                  <Text style={styles.findingTitle}>
                    No drivers available right now
                  </Text>
                  <Text style={styles.findingSub}>
                    Every nearby driver is on a trip. This usually clears within
                    a few minutes.
                  </Text>
                </View>
              </View>

              <Text style={styles.altLabel}>AVAILABLE NEARBY INSTEAD</Text>
              <View style={styles.altRow}>
                {ALT_RIDES.map(ride => (
                  <Pressable key={ride.id} style={styles.altCard}>
                    <MaterialDesignIcons
                      name={ride.icon}
                      size={22}
                      color={colors.navy[900]}
                    />
                    <Text style={styles.altName}>{ride.name}</Text>
                    <Text style={styles.altPrice}>₹{ride.price}</Text>
                  </Pressable>
                ))}
              </View>

              <View style={styles.tripCard}>
                <View style={styles.timeline}>
                  <View style={styles.pickupDot} />
                  <View style={styles.timelineLine} />
                  <View style={styles.dropSquare} />
                </View>
                <View style={styles.tripCopy}>
                  <View style={styles.tripBlock}>
                    <Text style={styles.tripLabel}>PICKUP</Text>
                    <Text style={styles.tripAddress} numberOfLines={2}>
                      {pickup}
                    </Text>
                  </View>
                  <View style={styles.tripBlock}>
                    <Text style={styles.tripLabel}>DROP</Text>
                    <Text style={styles.tripAddress} numberOfLines={2}>
                      {drop}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.infoBox}>
                <Feather name="info" size={16} color={colors.gray[500]} />
                <Text style={styles.infoText}>
                  Nothing has been charged. Your fare of ₹{fare} is still locked
                  for 5 minutes.
                </Text>
              </View>

              <Pressable style={styles.searchAgainBtn} onPress={onSearchAgain}>
                <Text style={styles.searchAgainText}>Search again</Text>
              </Pressable>
              <Pressable style={styles.cancelLink} onPress={onCancelPress}>
                <Text style={styles.cancelLinkText}>Cancel ride</Text>
              </Pressable>
            </ScrollView>
          ) : null}

          {phase === 'searching' ? (
            <>
              <View style={styles.findingRow}>
                <View style={styles.spinnerWrap}>
                  <Animated.View
                    style={[
                      styles.spinnerRing,
                      {transform: [{rotate: spinDeg}]},
                    ]}
                  />
                </View>
                <View style={styles.findingCopy}>
                  <Text style={styles.findingTitle}>
                    Finding your {rideName}...
                  </Text>
                  <Text style={styles.findingSub}>
                    Matching you with drivers near {areaHint}.
                  </Text>
                </View>
              </View>

              <View style={styles.progressTrack}>
                <Animated.View
                  style={[styles.progressFill, {width: fillWidth}]}
                />
              </View>

              <View style={styles.tripCard}>
                <View style={styles.timeline}>
                  <View style={styles.pickupDot} />
                  <View style={styles.timelineLine} />
                  <View style={styles.dropSquare} />
                </View>
                <View style={styles.tripCopy}>
                  <View style={styles.tripBlock}>
                    <Text style={styles.tripLabel}>PICKUP</Text>
                    <Text style={styles.tripAddress} numberOfLines={2}>
                      {pickup}
                    </Text>
                  </View>
                  <View style={styles.tripBlock}>
                    <Text style={styles.tripLabel}>DROP</Text>
                    <Text style={styles.tripAddress} numberOfLines={2}>
                      {drop}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.infoBox}>
                <Feather name="clock" size={16} color={colors.gray[500]} />
                <Text style={styles.infoText}>
                  Most rides are matched in under 60 seconds. Nothing is charged
                  until a driver accepts.
                </Text>
              </View>

              <Pressable style={styles.cancelBtn} onPress={onCancelPress}>
                <Text style={styles.cancelText}>Cancel ride</Text>
              </Pressable>
            </>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}
