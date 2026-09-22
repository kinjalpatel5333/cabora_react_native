import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  Pressable,
  StatusBar,
  Text,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Feather} from '@react-native-vector-icons/feather/static';
import {MaterialDesignIcons} from '@react-native-vector-icons/material-design-icons/static';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {images} from '../../assets';
import useThemedStyles from '../../components/useThemedStyles';
import {useApp} from '../../context/AppContext';
import createStyles from './style';
import colors from '../../config/color';

const COUNTDOWN_SECONDS = 12;
const SCREEN_W = Dimensions.get('window').width;
const SCREEN_H = Dimensions.get('window').height;

const ROUTE_W = SCREEN_W * 0.92;
const ROUTE_H = Math.min(SCREEN_H * 0.38, 320);

/** Street-like waypoints (normalized) — pickup → car → drop
 *  Kept high enough that the orange pickup pin stays above the sheet. */
import { DRIVER_ROUTE_WAYPOINTS as ROUTE_WAYPOINTS } from '../../config/staticData';

const PICKUP_POINT = ROUTE_WAYPOINTS[0];
const CAR_POINT = ROUTE_WAYPOINTS[5];
const DROP_POINT = ROUTE_WAYPOINTS[ROUTE_WAYPOINTS.length - 1];

function formatInr(value) {
  return `₹${Number(value).toLocaleString('en-IN')}`;
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

export default function NewRideRequestScreen() {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);
  const {colors} = useApp();
  const navigation = useNavigation();
  const [seconds, setSeconds] = useState(COUNTDOWN_SECONDS);
  const [missedAt, setMissedAt] = useState('');
  const progressAnim = useRef(new Animated.Value(0)).current;
  const expired = seconds <= 0;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: COUNTDOWN_SECONDS * 1000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();

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
    if (expired) {
      setMissedAt(formatMissedTime(new Date()));
    }
  }, [expired]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, SCREEN_W],
  });

  const sheetBottom = Math.max(insets.bottom, 12) + 8;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

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

      {/* Figma # Scrim — sits above map + route */}
      <View style={styles.scrim} pointerEvents="none" />

      {!expired ? (
        <View style={styles.topProgressTrack}>
          <Animated.View
            style={[styles.topProgressFill, {width: progressWidth}]}
          />
        </View>
      ) : null}

      <View style={[styles.topBanner, {top: insets.top + 12}]}>
        {expired ? (
          <View style={styles.missedChip}>
            <Feather name="clock" size={15} color={colors.white} />
            <Text style={styles.missedChipText}>
              Missed at {missedAt} · you stayed online
            </Text>
          </View>
        ) : (
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
                <Text style={styles.requestTitle}>Cab Sedan · Cash</Text>
              </>
            )}
          </View>
          <View style={styles.earnWrap}>
            <Text style={styles.earnLabel}>YOU EARN</Text>
            <Text 
             style={[
              styles.earnValue,
              expired && styles.earnValueExpired,
            ]}>{formatInr(184)}</Text>
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
                <Text style={styles.tripLabel}>PICKUP · 2.1 KM AWAY</Text>
                <Text
                  style={[
                    styles.tripTitle,
                    expired && styles.tripTitleExpired,
                  ]}>
                  Prestige Tech Park, Gate 3
                </Text>
                <Text style={styles.tripMeta}>about 5 min from you</Text>
              </View>
              <View style={[styles.tripCopy, styles.tripCopyDrop]}>
                <Text style={styles.tripLabel}>DROP · 11.4 KM TRIP</Text>
                <Text
                  style={[
                    styles.tripTitle,
                    expired && styles.tripTitleExpired,
                  ]}>
                  Kempegowda Intl. Airport, T2
                </Text>
                <Text style={styles.tripMeta}>about 29 min drive</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.riderRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>AS</Text>
          </View>
          <Text
            style={[styles.riderText, expired && styles.riderTextExpired]}
            numberOfLines={1}>
            Ananya S. · 4.8 ★ · 128 trips
          </Text>
          <View style={styles.payWrap}>
            <MaterialDesignIcons
              name="currency-inr"
              size={14}
              color={colors.isDark ? colors.navy[300] : (expired ? colors.navy[600] : colors.navy[700])}
            />
            <Text style={styles.payText}>Cash</Text>
          </View>
        </View>

        {expired ? (
          <>
            <Pressable
              accessibilityRole="button"
              onPress={() => navigation.goBack()}
              style={styles.backBtn}>
              <Text style={styles.backBtnText}>Back to dashboard</Text>
            </Pressable>
            <Text style={styles.footerHint}>
              Your acceptance rate is unchanged — timeouts aren't counted
              against you.
            </Text>
          </>
        ) : (
          <>
            <View style={styles.actions}>
              <Pressable
                accessibilityRole="button"
                onPress={() => navigation.navigate('CancelRideReason')}
                style={styles.rejectBtn}>
                <Text style={styles.rejectText}>REJECT</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={() => navigation.replace('DriverEnRoutePickup')}
                style={styles.acceptBtn}>
                <Text style={styles.acceptTitle}>ACCEPT</Text>
                <Text style={styles.acceptSub}>
                  {formatInr(184)} · 13.5 km
                </Text>
              </Pressable>
            </View>
            <Text style={styles.footerHint}>
              Accepting locks this ride to you. Rejecting won't affect your
              acceptance rate.
            </Text>
          </>
        )}
      </View>
    </View>
  );
}
