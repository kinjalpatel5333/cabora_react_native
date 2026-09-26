import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Easing,
  Image,
  Platform,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {Feather} from '@react-native-vector-icons/feather/static';
import {MaterialDesignIcons} from '@react-native-vector-icons/material-design-icons/static';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {images} from '../../assets';
import {Button} from '../../components';
import useThemedStyles from '../../components/useThemedStyles';
import {useApp} from '../../context/AppContext';
import {
  getIncomingRequestsApi,
  acceptRideRequestApi,
  rejectRideRequestApi,
} from '../../services/driverApi';
import createStyles from './style';

const COUNTDOWN_SECONDS = 12;
const SCREEN_W = Dimensions.get('window').width;
const SCREEN_H = Dimensions.get('window').height;

const ROUTE_W = SCREEN_W * 0.92;
const ROUTE_H = Math.min(SCREEN_H * 0.38, 320);

import { DRIVER_ROUTE_WAYPOINTS as ROUTE_WAYPOINTS } from '../../config/staticData';

const PICKUP_POINT = ROUTE_WAYPOINTS[0];
const CAR_POINT = ROUTE_WAYPOINTS[5];
const DROP_POINT = ROUTE_WAYPOINTS[ROUTE_WAYPOINTS.length - 1];

function formatInr(value) {
  return `₹${Number(value || 0).toLocaleString('en-IN')}`;
}

function formatMissedTime(date) {
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const suffix = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${suffix}`;
}

function sampleRoute(width, height, stepsPerSeg = 8) {
  const pts = [];
  for (let i = 0; i < ROUTE_WAYPOINTS.length - 1; i += 1) {
    const a = ROUTE_WAYPOINTS[i];
    const b = ROUTE_WAYPOINTS[i + 1];
    const prev = ROUTE_WAYPOINTS[Math.max(0, i - 1)];
    const next = ROUTE_WAYPOINTS[Math.min(ROUTE_WAYPOINTS.length - 1, i + 2)];
    const c1 = {
      x: a.x + (b.x - prev.x) / 6,
      y: a.y + (b.y - prev.y) / 6,
    };
    const c2 = {
      x: b.x - (next.x - a.x) / 6,
      y: b.y - (next.y - a.y) / 6,
    };
    for (let s = 0; s < stepsPerSeg; s += 1) {
      const t = s / stepsPerSeg;
      const u = 1 - t;
      const x =
        u * u * u * a.x +
        3 * u * u * t * c1.x +
        3 * u * t * t * c2.x +
        t * t * t * b.x;
      const y =
        u * u * u * a.y +
        3 * u * u * t * c1.y +
        3 * u * t * t * c2.y +
        t * t * t * b.y;
      pts.push({x: x * width, y: y * height});
    }
  }
  const last = ROUTE_WAYPOINTS[ROUTE_WAYPOINTS.length - 1];
  pts.push({x: last.x * width, y: last.y * height});
  return pts;
}

function RouteLine({width, height, color, outlineColor}) {
  const points = useMemo(() => sampleRoute(width, height), [width, height]);

  const segments = useMemo(() => {
    const list = [];
    for (let i = 0; i < points.length - 1; i += 1) {
      const a = points[i];
      const b = points[i + 1];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const len = Math.sqrt(dx * dx + dy * dy);
      if (len < 0.5) {
        continue;
      }
      list.push({
        key: i,
        left: (a.x + b.x) / 2,
        top: (a.y + b.y) / 2,
        length: len + 3,
        angle: (Math.atan2(dy, dx) * 180) / Math.PI,
      });
    }
    return list;
  }, [points]);

  return (
    <View style={{width, height}} pointerEvents="none">
      {segments.map(seg => (
        <View
          key={`o-${seg.key}`}
          style={{
            position: 'absolute',
            left: seg.left - seg.length / 2,
            top: seg.top - 5.5,
            width: seg.length,
            height: 11,
            borderRadius: 6,
            backgroundColor: outlineColor,
            transform: [{rotate: `${seg.angle}deg`}],
          }}
        />
      ))}
      {segments.map(seg => (
        <View
          key={`r-${seg.key}`}
          style={{
            position: 'absolute',
            left: seg.left - seg.length / 2,
            top: seg.top - 4,
            width: seg.length,
            height: 8,
            borderRadius: 4,
            backgroundColor: color,
            transform: [{rotate: `${seg.angle}deg`}],
          }}
        />
      ))}
    </View>
  );
}

const DEMO_REQUEST = {
  id: 'req_demo_001',
  rideType: 'Cab Sedan',
  paymentMode: 'Cash',
  fare: 184,
  distance: '13.5 km',
  pickupAddress: 'Prestige Tech Park, Gate 3',
  pickupDistance: '2.1 KM AWAY',
  pickupEta: 'about 5 min from you',
  dropAddress: 'Kempegowda Intl. Airport, T2',
  dropDistance: '11.4 KM TRIP',
  dropEta: 'about 29 min drive',
  passengerName: 'Ananya S.',
  passengerRating: '4.8 ★',
  passengerTrips: '128 trips',
  passengerInitials: 'AS',
};

export default function NewRideRequestScreen() {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);
  const {colors} = useApp();
  const navigation = useNavigation();

  // State management for API & finding section
  const [loading, setLoading] = useState(true);
  const [finding, setFinding] = useState(true);
  const [requestData, setRequestData] = useState(null);
  const [accepting, setAccepting] = useState(false);
  const [rejecting, setRejecting] = useState(false);

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle?.('light-content');
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor?.('transparent');
        StatusBar.setTranslucent?.(true);
      }
    }, []),
  );

  // Timer state
  const [seconds, setSeconds] = useState(COUNTDOWN_SECONDS);
  const [missedAt, setMissedAt] = useState('');
  const progressAnim = useRef(new Animated.Value(0)).current;
  const spinAnim = useRef(new Animated.Value(0)).current;
  const expired = seconds <= 0;

  // Spin animation for loader
  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [spinAnim]);

  const spinDeg = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Fetch incoming request from API
  const fetchIncomingRequest = useCallback(async () => {
    setLoading(true);
    setFinding(true);
    setRequestData(null);
    try {
      const res = await getIncomingRequestsApi();
      const payload = res?.data ?? res;
      let activeReq = null;

      if (Array.isArray(payload) && payload.length > 0) {
        activeReq = payload[0];
      } else if (payload && typeof payload === 'object' && !Array.isArray(payload) && (payload.id || payload._id)) {
        activeReq = payload;
      }

      if (activeReq) {
        const pName = activeReq.passenger?.name || activeReq.passengerName || activeReq.user?.name || 'Ananya S.';
        const pInitials = pName
          .trim()
          .split(/\s+/)
          .map(n => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2) || 'AS';

        setRequestData({
          id: activeReq._id || activeReq.id || 'req_live',
          rideType: activeReq.vehicleType || activeReq.rideType || activeReq.category || 'Cab Sedan',
          paymentMode: activeReq.paymentMethod || activeReq.paymentMode || 'Cash',
          fare: activeReq.fare || activeReq.driverEarnings || activeReq.estimatedFare || 184,
          distance: activeReq.distance || activeReq.tripDistance || '13.5 km',
          pickupAddress: activeReq.pickupLocation?.address || activeReq.pickup?.address || activeReq.pickupAddress || 'Prestige Tech Park, Gate 3',
          pickupDistance: activeReq.pickupDistance || '2.1 KM AWAY',
          pickupEta: activeReq.pickupEta || 'about 5 min from you',
          dropAddress: activeReq.dropLocation?.address || activeReq.drop?.address || activeReq.dropAddress || 'Kempegowda Intl. Airport, T2',
          dropDistance: activeReq.dropDistance || '11.4 KM TRIP',
          dropEta: activeReq.dropEta || 'about 29 min drive',
          passengerName: pName,
          passengerRating: `${activeReq.passenger?.rating || activeReq.passengerRating || '4.8'} ★`,
          passengerTrips: `${activeReq.passenger?.totalTrips || activeReq.passengerTrips || '128'} trips`,
          passengerInitials: pInitials,
        });
        setSeconds(COUNTDOWN_SECONDS);
        startTimer();
      } else {
        // No request returned by API
        setRequestData(null);
      }
    } catch (err) {
      console.warn('Error fetching incoming ride request:', err);
      setRequestData(null);
    } finally {
      setLoading(false);
      setFinding(false);
    }
  }, []);

  useEffect(() => {
    fetchIncomingRequest();
  }, [fetchIncomingRequest]);

  const startTimer = useCallback(() => {
    progressAnim.setValue(0);
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: COUNTDOWN_SECONDS * 1000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();

    setSeconds(COUNTDOWN_SECONDS);
    const tick = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          clearInterval(tick);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(tick);
  }, [progressAnim]);

  useEffect(() => {
    if (expired && requestData) {
      setMissedAt(formatMissedTime(new Date()));
    }
  }, [expired, requestData]);

  const handleAccept = async () => {
    if (accepting) return;
    setAccepting(true);
    try {
      if (requestData?.id) {
        await acceptRideRequestApi(requestData.id);
      }
    } catch (err) {
      console.warn('acceptRideRequestApi error:', err);
    } finally {
      setAccepting(false);
      navigation.replace('DriverEnRoutePickup');
    }
  };

  const handleReject = async () => {
    if (rejecting) return;
    setRejecting(true);
    try {
      if (requestData?.id) {
        await rejectRideRequestApi(requestData.id);
      }
    } catch (err) {
      console.warn('rejectRideRequestApi error:', err);
    } finally {
      setRejecting(false);
      navigation.navigate('CancelRideReason');
    }
  };

  const loadDemoRequest = () => {
    setRequestData(DEMO_REQUEST);
    setFinding(false);
    startTimer();
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, SCREEN_W],
  });

  const sheetBottom = Math.max(insets.bottom, 12) + 8;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <Image
        source={images.mapBackdrop}
        style={styles.mapImage}
        resizeMode="cover"
      />

      <View
        style={[
          styles.mapRoute,
          {
            top: insets.top + 56,
            height: ROUTE_H,
          },
        ]}
        pointerEvents="none">
        <View style={[styles.routeStage, {width: ROUTE_W, height: ROUTE_H}]}>
          <RouteLine
            width={ROUTE_W}
            height={ROUTE_H}
            color={colors.orange[600]}
            outlineColor={colors.alpha.white85}
          />
          <Image
            source={images.mapMarkerDrop}
            style={[
              styles.routePin,
              {
                left: DROP_POINT.x * ROUTE_W - 22,
                top: DROP_POINT.y * ROUTE_H - 52,
              },
            ]}
            resizeMode="contain"
          />
          <Image
            source={images.mapMarker}
            style={[
              styles.carMarker,
              {
                left: CAR_POINT.x * ROUTE_W - 27,
                top: CAR_POINT.y * ROUTE_H - 48,
              },
            ]}
            resizeMode="contain"
          />
          <Image
            source={images.mapMarkerPickup}
            style={[
              styles.routePin,
              styles.pickupPin,
              {
                left: PICKUP_POINT.x * ROUTE_W - 24,
                top: PICKUP_POINT.y * ROUTE_H - 56,
              },
            ]}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* Scrim — sits above map + route */}
      <View style={styles.scrim} pointerEvents="none" />

      {requestData && !expired ? (
        <View style={styles.topProgressTrack}>
          <Animated.View
            style={[styles.topProgressFill, {width: progressWidth}]}
          />
        </View>
      ) : null}

      <View style={[styles.topBanner, {top: insets.top + 12}]}>
        {finding || loading ? (
          <View style={styles.autoRejectChip}>
            <ActivityIndicator size="small" color={colors.white} />
            <Text style={styles.autoRejectText}>
              Finding incoming requests...
            </Text>
          </View>
        ) : expired ? (
          <View style={styles.missedChip}>
            <Feather name="clock" size={15} color={colors.white} />
            <Text style={styles.missedChipText}>
              Missed at {missedAt} · you stayed online
            </Text>
          </View>
        ) : requestData ? (
          <View style={styles.autoRejectChip}>
            <MaterialDesignIcons
              name="alarm-light"
              size={16}
              color={colors.white}
            />
            <Text style={styles.autoRejectText}>
              Auto-rejects in {seconds}s · keep both hands free
            </Text>
          </View>
        ) : (
          <View style={styles.missedChip}>
            <Feather name="search" size={15} color={colors.white} />
            <Text style={styles.missedChipText}>
              Searching for ride requests
            </Text>
          </View>
        )}
      </View>

      <View
        style={[
          styles.sheet,
          {
            bottom: sheetBottom,
            paddingBottom: 16,
          },
        ]}>
        {finding || loading ? (
          /* Finding Loader Section */
          <View style={styles.findingBox}>
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
                  Finding incoming ride requests...
                </Text>
                <Text style={styles.findingSub}>
                  Connecting to server and checking active requests
                </Text>
              </View>
            </View>
          </View>
        ) : !requestData ? (
          /* No Request Found State */
          <View style={styles.findingBox}>
            <View style={styles.findingRow}>
              <View style={styles.spinnerWrap}>
                <Feather name="info" size={24} color={colors.orange[600]} />
              </View>
              <View style={styles.findingCopy}>
                <Text style={styles.findingTitle}>No Incoming Requests</Text>
                <Text style={styles.findingSub}>
                  There are no active ride requests in your area right now.
                </Text>
              </View>
            </View>
            <Button
              title="Search Again"
              onPress={fetchIncomingRequest}
              style={styles.searchAgainBtn}
              textStyle={styles.searchAgainBtnText}
            />
            <Button
              title="Preview Demo Request"
              variant="outline"
              onPress={loadDemoRequest}
              style={styles.demoBtn}
              textStyle={styles.demoBtnText}
            />
          </View>
        ) : (
          /* Request Details Card */
          <>
            <View style={styles.sheetHead}>
              <View
                style={[styles.timerCircle, expired && styles.timerCircleExpired]}>
                <Text
                  style={[styles.timerText, expired && styles.timerTextExpired]}>
                  {seconds}
                </Text>
              </View>
              <View style={styles.headCopy}>
                {expired ? (
                  <>
                    <Text style={styles.expiredKicker}>REQUEST EXPIRED</Text>
                    <Text style={styles.expiredTitle}>Passed to another driver</Text>
                  </>
                ) : (
                  <>
                    <Text style={styles.requestKicker}>NEW RIDE REQUEST</Text>
                    <Text style={styles.requestTitle}>
                      {requestData.rideType} · {requestData.paymentMode}
                    </Text>
                  </>
                )}
              </View>
              <View style={styles.earnWrap}>
                <Text style={styles.earnLabel}>YOU EARN</Text>
                <Text
                  style={[
                    styles.earnValue,
                    expired && styles.earnValueExpired,
                  ]}>
                  {formatInr(requestData.fare)}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.tripBlock}>
              <View style={styles.tripRow}>
                <View style={styles.tripIconCol}>
                  <View
                    style={[styles.pickupDot, expired && styles.pickupDotExpired]}
                  />
                  <View style={styles.tripRail} />
                  <View
                    style={[styles.dropSquare, expired && styles.dropSquareExpired]}
                  />
                </View>
                <View style={styles.tripCopyCol}>
                  <View style={styles.tripCopy}>
                    <Text style={styles.tripLabel}>
                      PICKUP · {requestData.pickupDistance}
                    </Text>
                    <Text
                      style={[
                        styles.tripTitle,
                        expired && styles.tripTitleExpired,
                      ]}>
                      {requestData.pickupAddress}
                    </Text>
                    <Text style={styles.tripMeta}>{requestData.pickupEta}</Text>
                  </View>
                  <View style={[styles.tripCopy, styles.tripCopyDrop]}>
                    <Text style={styles.tripLabel}>
                      DROP · {requestData.dropDistance}
                    </Text>
                    <Text
                      style={[
                        styles.tripTitle,
                        expired && styles.tripTitleExpired,
                      ]}>
                      {requestData.dropAddress}
                    </Text>
                    <Text style={styles.tripMeta}>{requestData.dropEta}</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.riderRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{requestData.passengerInitials}</Text>
              </View>
              <Text
                style={[styles.riderText, expired && styles.riderTextExpired]}
                numberOfLines={1}>
                {requestData.passengerName} · {requestData.passengerRating} · {requestData.passengerTrips}
              </Text>
              <View style={styles.payWrap}>
                <MaterialDesignIcons
                  name="currency-inr"
                  size={14}
                  color={
                    colors.isDark
                      ? colors.navy[300]
                      : expired
                      ? colors.navy[600]
                      : colors.navy[700]
                  }
                />
                <Text style={styles.payText}>{requestData.paymentMode}</Text>
              </View>
            </View>

            {expired ? (
              <>
                <Button
                  title="Back to dashboard"
                  variant="outline"
                  onPress={() => navigation.goBack()}
                  style={styles.backBtn}
                  textStyle={styles.backBtnText}
                />
                <Text style={styles.footerHint}>
                  Your acceptance rate is unchanged — timeouts aren't counted
                  against you.
                </Text>
              </>
            ) : (
              <>
                <View style={styles.actions}>
                  <Button
                    title="REJECT"
                    variant="outline"
                    loading={rejecting}
                    onPress={handleReject}
                    disabled={rejecting || accepting}
                    style={styles.rejectBtn}
                    textStyle={styles.rejectText}
                    fullWidth={false}
                  />
                  <Button
                    loading={accepting}
                    onPress={handleAccept}
                    disabled={accepting || rejecting}
                    style={styles.acceptBtn}
                    fullWidth={false}>
                    <Text style={styles.acceptTitle}>ACCEPT</Text>
                    <Text style={styles.acceptSub}>
                      {formatInr(requestData.fare)} · {requestData.distance}
                    </Text>
                  </Button>
                </View>
                <Text style={styles.footerHint}>
                  Accepting locks this ride to you. Rejecting won't affect your
                  acceptance rate.
                </Text>
              </>
            )}
          </>
        )}
      </View>
    </View>
  );
}
