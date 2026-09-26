import { PASSENGER_FINDING_NEARBY, PASSENGER_FINDING_ALT_RIDES } from '../../config/staticData';
import React, {useEffect, useRef, useState} from 'react';
import {Animated, Dimensions, Easing, Modal, Text, View, TouchableOpacity} from 'react-native';
import {Feather} from '@react-native-vector-icons/feather/static';
import {Lucide} from '@react-native-vector-icons/lucide/static';
import {MaterialDesignIcons} from '@react-native-vector-icons/material-design-icons/static';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import useThemedStyles from '../../components/useThemedStyles';
import {useApp} from '../../context/AppContext';
import useDraggableSheet from '../../hooks/useDraggableSheet';
import EmergencyScreen from '../EmergencyScreen';
import ShareLiveTripScreen from '../ShareLiveTripScreen';
import {CoRiderMatchedSheet, DriverOnWaySheet, OnTripSheet} from './MatchedSheets';
import RateTipScreen from './RateTipScreen';
import RatedPaidScreen from './RatedPaidScreen';
import TripCompletedScreen from './TripCompletedScreen';
import createStyles from './style';
import colors from '../../config/color';
import {ToastHost} from '../../components';

const NEARBY = PASSENGER_FINDING_NEARBY;

const ALT_RIDES = PASSENGER_FINDING_ALT_RIDES;

const PULSE_COUNT = 3;
const MATCH_MS = 5000;
const ON_TRIP_MS = 5000;
const COMPLETED_MS = 5000;
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
  onBack,
  onRequestCancel,
  rideName = 'Cab Sedan',
  pickup = 'Surat Railway Station',
  drop = 'Varachha Main Road',
  areaHint = 'Surat',
  fare = 95,
  currency = 'INR',
  rideId = '6ab7a123116d933739e5bf6e',
  rideOtp = '1053',
  tripOtp = '1053',
  status = 'SEARCHING_DRIVER',
}) {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);
  const {colors} = useApp();
  const [phase, setPhase] = useState('searching'); // searching | pool | driver | onTrip | completed | rateTip | ratedPaid | unavailable
  const [searchKey, setSearchKey] = useState(0);
  const [ratingResult, setRatingResult] = useState({rating: 5, tip: 20});
  const [emergencyOpen, setEmergencyOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const flowPaused = emergencyOpen || shareOpen;
  const matchCoRiderRef = useRef(true);

  const spin = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(0.12)).current;
  const tripProgress = useRef(new Animated.Value(0.38)).current;

  useEffect(() => {
    if (!visible) {
      setPhase('searching');
      setSearchKey(0);
      setRatingResult({rating: 5, tip: 20});
      setEmergencyOpen(false);
      setShareOpen(false);
      spin.setValue(0);
      progress.setValue(0.12);
      tripProgress.setValue(0.38);
      return undefined;
    }

    if (status === 'SEARCHING_DRIVER' || !status) {
      setPhase('searching');
    } else if (status === 'DRIVER_ASSIGNED' || status === 'ON_THE_WAY') {
      setPhase('driver');
    } else if (status === 'IN_PROGRESS' || status === 'ON_TRIP') {
      setPhase('onTrip');
    } else if (status === 'COMPLETED') {
      setPhase('completed');
    } else {
      setPhase('searching');
    }
    matchCoRiderRef.current = searchKey % 2 === 1;
    return undefined;
  }, [visible, searchKey, status, spin, progress, tripProgress]);

  // 1. 5 seconds searching -> Driver is on the way / OTP modal
  useEffect(() => {
    if (!visible || flowPaused || phase !== 'searching') {
      return undefined;
    }

    const matchTimer = setTimeout(() => {
      setPhase('driver');
    }, 5000);

    return () => {
      clearTimeout(matchTimer);
    };
  }, [visible, flowPaused, phase, searchKey]);

  // 2. 7 seconds on OTP / Driver is on the way -> Live Trip screen
  useEffect(() => {
    if (!visible || flowPaused || phase !== 'driver') {
      return undefined;
    }

    const onTripTimer = setTimeout(() => {
      setPhase('onTrip');
    }, 7000);

    return () => {
      clearTimeout(onTripTimer);
    };
  }, [visible, flowPaused, phase]);

  // 3. 5 seconds on Live Trip -> Payment / Trip Completed screen
  useEffect(() => {
    if (!visible || flowPaused || phase !== 'onTrip') {
      return undefined;
    }

    const completedTimer = setTimeout(() => {
      setPhase('completed');
    }, 5000);

    return () => {
      clearTimeout(completedTimer);
    };
  }, [visible, flowPaused, phase]);

  useEffect(() => {
    if (!visible || flowPaused || phase !== 'onTrip') {
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
  }, [visible, flowPaused, phase, tripProgress]);

  useEffect(() => {
    if (!visible || flowPaused || phase !== 'searching') {
      if (phase !== 'searching') {
        spin.setValue(0);
        progress.setValue(0.12);
      }
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
  }, [visible, flowPaused, phase, spin, progress]);

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
    onBack?.() ?? onClose?.();
  };

  /** Hardware / UI back: one phase or one flow step — never dump to Home. */
  const stepBack = () => {
    if (phase === 'rateTip' || phase === 'ratedPaid') {
      onClose?.();
      return;
    }
    if (phase === 'completed') {
      setPhase('onTrip');
      return;
    }
    if (onBack) {
      onBack();
      return;
    }
    onClose?.();
  };

  const unavailable = phase === 'unavailable';
  const matched = phase === 'pool' || phase === 'driver' || phase === 'onTrip';
  const sheetMaxH =
    Dimensions.get('window').height *
    (phase === 'onTrip' ? 0.48 : unavailable || matched ? 0.7 : 0.52);
  const {sheetTY, panHandlers, toggle, expanded, onSheetLayout} =
    useDraggableSheet({
      peekHeight: phase === 'onTrip' ? 160 : 200,
      visible,
    });

  const tripFillWidth = tripProgress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      presentationStyle="overFullScreen"
      onRequestClose={stepBack}
      statusBarTranslucent>
      {phase === 'ratedPaid' ? (
        <RatedPaidScreen
          driverName="Rajesh"
          rating={ratingResult.rating}
          tip={ratingResult.tip ?? 0}
          tripFare={fare || 132}
          onBackHome={onClose}
          onBookAgain={onClose}
        />
      ) : phase === 'rateTip' ? (
        <RateTipScreen
          rideId={rideId}
          onClose={onClose}
          onSkip={onClose}
          onSubmit={result => {
            setRatingResult({
              rating: result?.rating ?? 5,
              tip: result?.tip ?? 0,
            });
            setPhase('ratedPaid');
          }}
        />
      ) : phase === 'completed' ? (
        <TripCompletedScreen
          tripId={rideId}
          rideId={rideId}
          pickup={pickup}
          drop={drop}
          fare={fare}
          currency={currency}
          rideName={rideName}
          totalPaid={`₹${fare || 132}`}
          onRate={() => setPhase('rateTip')}
        />
      ) : (
      <View style={styles.root} pointerEvents="box-none">
        <TouchableOpacity activeOpacity={0.7} style={styles.backdrop} onPress={stepBack} />

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
        ) : null}

        {phase === 'onTrip' ? (
          <TouchableOpacity activeOpacity={0.7}
            style={[styles.sosPill, {top: insets.top + 10}]}
            onPress={() => setEmergencyOpen(true)}
            accessibilityRole="button"
            accessibilityLabel="SOS">
            <MaterialDesignIcons
              name="alarm-light"
              size={16}
              color={colors.red[500]}
            />
            <Text style={styles.sosPillText}>SOS</Text>
          </TouchableOpacity>
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
          <TouchableOpacity activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Recenter map"
            style={[styles.locateFab, {bottom: sheetMaxH + 14}]}>
            <MaterialDesignIcons
              name="crosshairs-gps"
              size={22}
              color={colors.text}
            />
          </TouchableOpacity>
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
                    color={colors.text}
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
                    color={colors.text}
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

        <Animated.View
          onLayout={onSheetLayout}
          style={[
            styles.sheet,
            {
              maxHeight: sheetMaxH,
              paddingBottom: Math.max(insets.bottom, 10) + 10,
              transform: [{translateY: sheetTY}],
            },
          ]}>
          <View {...panHandlers}>
            <TouchableOpacity activeOpacity={0.7}
              onPress={toggle}
              accessibilityRole="button"
              accessibilityLabel={expanded ? 'Collapse sheet' : 'Expand sheet'}
              style={styles.grabberHit}>
              <View style={styles.grabber} />
            </TouchableOpacity>
          </View>

          <View>
          {phase === 'pool' ? (
            <CoRiderMatchedSheet fare={fare} otp={rideOtp || tripOtp || '1053'} onCancel={onCancelPress} />
          ) : null}

          {phase === 'driver' ? (
            <DriverOnWaySheet
              otp={rideOtp || tripOtp || '1053'}
              onCancel={onCancelPress}
              onSos={() => setEmergencyOpen(true)}
              onShare={() => setShareOpen(true)}
            />
          ) : null}

          {phase === 'onTrip' ? (
            <OnTripSheet
              drop={drop}
              progressWidth={tripFillWidth}
              onShare={() => setShareOpen(true)}
            />
          ) : null}

          {unavailable ? (
            <View style={styles.unavailableScroll}>
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
                  <TouchableOpacity activeOpacity={0.7} key={ride.id} style={styles.altCard}>
                    <MaterialDesignIcons
                      name={ride.icon}
                      size={22}
                      color={colors.text}
                    />
                    <Text style={styles.altName}>{ride.name}</Text>
                    <Text style={styles.altPrice}>₹{ride.price}</Text>
                  </TouchableOpacity>
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
                <Feather name="info" size={16} color={colors.muted} />
                <Text style={styles.infoText}>
                  Nothing has been charged. Your fare of ₹{fare} is still locked
                  for 5 minutes.
                </Text>
              </View>

              <TouchableOpacity activeOpacity={0.7} style={styles.searchAgainBtn} onPress={onSearchAgain}>
                <Text style={styles.searchAgainText}>Search again</Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.7} style={styles.cancelLink} onPress={onCancelPress}>
                <Text style={styles.cancelLinkText}>Cancel ride</Text>
              </TouchableOpacity>
            </View>
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
                <Feather name="clock" size={16} color={colors.muted} />
                <Text style={styles.infoText}>
                  Most rides are matched in under 60 seconds. Nothing is charged
                  until a driver accepts.
                </Text>
              </View>

              <TouchableOpacity activeOpacity={0.7} style={styles.cancelBtn} onPress={onCancelPress}>
                <Text style={styles.cancelText}>Cancel ride</Text>
              </TouchableOpacity>
            </>
          ) : null}
          </View>
        </Animated.View>

        {phase !== 'onTrip' ? (
          <TouchableOpacity activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={stepBack}
            hitSlop={12}
            style={[styles.backBtn, {top: insets.top + 8}]}>
            <Feather
              name={matched ? 'chevron-down' : 'arrow-left'}
              size={22}
              color={colors.text}
            />
          </TouchableOpacity>
        ) : null}
      </View>
      )}

      <EmergencyScreen
        visible={emergencyOpen}
        onClose={() => setEmergencyOpen(false)}
        rideId={rideId || '6aa15a09aa3588cc94a5c3c4'}
      />
      <ShareLiveTripScreen
        visible={shareOpen}
        onClose={() => setShareOpen(false)}
      />

      <ToastHost />
    </Modal>
  );
}
