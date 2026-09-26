import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Dimensions, ScrollView, Text, View, TouchableOpacity, Image, StatusBar, Platform } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { AntDesign } from '@react-native-vector-icons/ant-design/static';
import { Feather } from '@react-native-vector-icons/feather/static';
import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6/static';
import { Lucide } from '@react-native-vector-icons/lucide/static';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons/static';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Toggle } from '../../components';
import useThemedStyles from '../../components/useThemedStyles';
import { useApp } from '../../context/AppContext';
import { useSidebar } from '../../context/SidebarContext';
import { useAuth } from '../../hooks/useAuth';
import { getHomeTabBarInset } from '../../navigation/homeTabBarMetrics';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { setDriverOnline, setDriverRestricted, fetchDriverKycStatus, updateDriverAvailability } from '../../redux/slices/driverSlice';
import { fetchDriverProfile } from '../../redux/slices/authSlice';
import { formatImageUrl } from '../../utils/user';
import createStyles from './style';
import DriverMapBackdrop from '../../components/DriverMapBackdrop';

function greetingForHour(hour) {
  if (hour < 12) {
    return 'GOOD MORNING';
  }
  if (hour < 17) {
    return 'GOOD AFTERNOON';
  }
  return 'GOOD EVENING';
}

function initials(name) {
  const parts = (name || 'Guest').trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return `${parts[0][0] || ''}${parts[1][0] || ''}`.toUpperCase();
}

function formatInr(value) {
  return `₹${Number(value).toLocaleString('en-IN')}`;
}

function driverDisplayName(user) {
  const name = (
    user?.name ||
    user?.fullName ||
    user?.personal?.fullName ||
    user?.personal?.name ||
    (user?.firstName ? `${user.firstName} ${user.lastName || ''}` : '') ||
    user?.driver?.name ||
    user?.driver?.fullName ||
    user?.driver?.personal?.fullName ||
    user?.driver?.personalDetails?.fullName ||
    user?.user?.name ||
    user?.user?.fullName ||
    ''
  ).trim();
  if (!name) {
    return 'Driver';
  }
  return name;
}

function StatGlyph({ name, color }) {
  if (name === 'rupee') {
    return <MaterialDesignIcons name="currency-inr" size={18} color={color} />;
  }
  if (name === 'car') {
    return <MaterialDesignIcons name="car-hatchback" size={18} color={color} />;
  }
  if (name === 'clock') {
    return <Feather name="clock" size={16} color={color} />;
  }
  return <Lucide name="wallet" size={16} color={color} />;
}

export default function DriverHomeScreen() {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);
  const { colors } = useApp();
  const navigation = useNavigation();
  const { openDrawer } = useSidebar();
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const driver = useAppSelector(state => state.driver);

  const [kycReason, setKycReason] = useState('Insurance expired — re-upload to unblock');
  const [kycFailState, setKycFailState] = useState(false);

  const loadDriverData = useCallback(async () => {
    try {
      dispatch(fetchDriverProfile());
      const actionRes = await dispatch(fetchDriverKycStatus()).unwrap();
      const data = actionRes?.data || actionRes;
      const statusStr = String(data?.status || data?.platform?.kycStatus || '').toUpperCase();
      const isApproved =
        data?.platform?.eligibleForRides ??
        (statusStr === 'APPROVED' || statusStr === 'VERIFIED');

      const isFailed =
        isApproved === false ||
        statusStr === 'FAILED' ||
        statusStr === 'REJECTED' ||
        statusStr === 'EXPIRED';

      if (isFailed) {
        setKycFailState(true);
        dispatch(setDriverRestricted(true));
        const rawReason =
          data?.platform?.rejectionReason ||
          data?.reason ||
          data?.message;
        const reasonMsg =
          typeof rawReason === 'string'
            ? rawReason
            : typeof rawReason?.message === 'string'
              ? rawReason.message
              : typeof rawReason?.reason === 'string'
                ? rawReason.reason
                : 'Insurance expired — re-upload to unblock';
        setKycReason(reasonMsg);
      } else {
        setKycFailState(false);
        dispatch(setDriverRestricted(false));
      }
    } catch (err) {
      console.warn('loadDriverData error:', err);
    }
  }, [dispatch]);

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle(colors.isDark ? 'light-content' : 'dark-content');
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor?.('transparent');
        StatusBar.setTranslucent?.(true);
      }
      loadDriverData();
    }, [colors.isDark, loadDriverData]),
  );

  const restricted = Boolean(driver.restricted) || kycFailState;
  const online = Boolean(driver.online) && !restricted;
  const displayName = driverDisplayName(user);
  const userPhoto = formatImageUrl(
    user?.photo ||
    user?.profilePhoto ||
    user?.avatar ||
    user?.personal?.profilePhoto ||
    user?.personal?.photo ||
    user?.driver?.profilePhoto ||
    user?.driver?.photo ||
    user?.driver?.personal?.profilePhoto ||
    user?.driver?.personalDetails?.profilePhoto
  );
  const greeting = useMemo(
    () => greetingForHour(new Date().getHours()),
    [],
  );
  const tabBarInset = getHomeTabBarInset(insets);
  const viewportH = Dimensions.get('window').height;
  const sheetMaxH = Math.min(viewportH * 0.52, 420);
  const [sheetHeight, setSheetHeight] = useState(0);
  const fabBottom = tabBarInset + (sheetHeight || Math.min(sheetMaxH, 280)) + 12;
  const headerTop = insets.top + 8;

  const todayEarnings = online ? driver.today.earnings : 0;
  const todayRides = online ? driver.today.rides : 0;
  const onlineLabel = online ? driver.today.onlineLabel : '0h 00m';
  const streakSegments = 3;
  const streakFilled = Math.min(
    streakSegments,
    Math.round((driver.streak.current / driver.streak.target) * streakSegments),
  );

  const openDocuments = () => {
    const parent = navigation.getParent();
    if (parent) {
      parent.navigate('UploadDocuments');
      return;
    }
    navigation.navigate('UploadDocuments');
  };

  const stats = [
    {
      id: 'today',
      icon: 'rupee',
      value: formatInr(todayEarnings),
      label: 'TODAY',
    },
    {
      id: 'rides',
      icon: 'car',
      value: String(todayRides),
      label: 'RIDES',
    },
    {
      id: 'online',
      icon: 'clock',
      value: onlineLabel,
      label: 'ONLINE',
    },
    {
      id: 'wallet',
      icon: 'wallet',
      value: formatInr(driver.wallet),
      label: 'WALLET',
    },
  ];

  return (
    <View style={styles.root}>
      <StatusBar
        barStyle={colors.isDark ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      <DriverMapBackdrop showUserDot={false} showDemand={online} />

      <View pointerEvents="none" style={styles.mapMarkers}>
        <View style={styles.locationMarker}>
          <View style={styles.locationHalo} />
          <View style={styles.locationCore} />
        </View>
      </View>

      <View style={[styles.header, { top: headerTop }]}>
        <TouchableOpacity activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Open menu"
          onPress={openDrawer}
          style={styles.menuBtn}>
          <Feather name="menu" size={22} color={colors.isDark ? colors.white : colors.navy[800]} />
        </TouchableOpacity>

        <View style={styles.greetingPill}>
          <Text style={styles.greetingKicker}>{greeting}</Text>
          <Text style={styles.greetingName} numberOfLines={1}>
            {displayName} · {driver.rating.toFixed(2)} ★
          </Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity activeOpacity={0.7}
            style={styles.avatar}
            onPress={() => navigation.navigate('Profile')}
            accessibilityRole="button">
            {Boolean(userPhoto) ? (
              <Image source={{ uri: userPhoto }} style={{ width: 44, height: 44, borderRadius: 22 }} />
            ) : (
              <Text style={styles.avatarText}>{initials(displayName)}</Text>
            )}
          </TouchableOpacity>
          <View style={styles.bellWrap}>
            <TouchableOpacity activeOpacity={0.7}
              style={styles.iconCircle}
              accessibilityRole="button"
              accessibilityLabel="Notifications">
              <Feather name="bell" size={18} color={colors.white} />
            </TouchableOpacity>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          </View>
        </View>
      </View>

      <TouchableOpacity activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Toggle online and restricted offline preview"
        onPress={() => {
          const nextRestricted = !restricted;
          dispatch(setDriverRestricted(nextRestricted));
          if (!nextRestricted) {
            dispatch(setDriverOnline(true));
          }
        }}
        style={[
          styles.statusChip,
          restricted ? styles.statusChipWarn : styles.statusChipDark,
          { top: headerTop + 56 },
        ]}>
        <View
          style={[
            styles.statusDot,
            {
              backgroundColor: restricted
                ? colors.amber[500]
                : online
                  ? colors.green[500]
                  : colors.gray[400],
            },
          ]}
        />
        <Text
          style={[
            styles.statusChipText,
            restricted && styles.statusChipTextWarn,
          ]}
          numberOfLines={1}>
          {restricted
            ? `${driver.gpsLabel} · account restricted`
            : online
              ? `${driver.gpsLabel} · online ${driver.today.onlineLabel} · synced`
              : `${driver.gpsLabel} · offline · synced`}
        </Text>
      </TouchableOpacity>

      {online ? (
        <TouchableOpacity activeOpacity={0.7}
          style={[styles.demandChip, { top: headerTop + 104 }]}
          accessibilityRole="button">
          <Lucide name="navigation" size={14} color={colors.white} />
          <Text style={styles.demandText}>
            High demand {driver.demand.km} km away · Navigate
          </Text>
        </TouchableOpacity>
      ) : null}

      <TouchableOpacity
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Search ride request"
        onPress={() => {
          const parent = navigation.getParent();
          if (parent) {
            parent.navigate('NewRideRequest');
            return;
          }
          navigation.navigate('NewRideRequest');
        }}
        style={[styles.locateFab, { bottom: fabBottom + 56 }]}>
        <Feather
          name="search"
          size={20}
          color={colors.isDark ? colors.white : colors.navy[800]}
        />
      </TouchableOpacity>

      <TouchableOpacity activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Preferred destination"
        onPress={() => {
          const parent = navigation.getParent();
          if (parent) {
            parent.navigate('PreferredDestination');
            return;
          }
          navigation.navigate('PreferredDestination');
        }}
        style={[styles.locateFab, { bottom: fabBottom }]}>
        <FontAwesome6
          name="location-crosshairs"
          iconStyle="solid"
          size={22}
          color={colors.isDark ? colors.white : colors.navy[800]}
        />
      </TouchableOpacity>

      <View
        style={[
          styles.sheetWrap,
          { bottom: tabBarInset, maxHeight: sheetMaxH },
        ]}
        onLayout={event => {
          const nextH = Math.round(event.nativeEvent.layout.height);
          if (nextH > 0 && nextH !== sheetHeight) {
            setSheetHeight(nextH);
          }
        }}>
        <View style={styles.sheet}>
          <View style={styles.grabber} />
          <ScrollView
            nestedScrollEnabled
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.sheetScroll}
            bounces={true}>
            {restricted ? (
              <View style={styles.restrictedCard}>
                <View style={styles.restrictedIcon}>
                  <Feather name="lock" size={20} color={colors.isDark ? colors.red[400] : '#DC2626'} />
                </View>
                <View style={styles.statusCopy}>
                  <Text style={styles.restrictedTitle}>You can't go online</Text>
                  <Text style={styles.restrictedSub}>
                    {typeof kycReason === 'string'
                      ? kycReason
                      : typeof kycReason?.message === 'string'
                        ? kycReason.message
                        : typeof kycReason?.reason === 'string'
                          ? kycReason.reason
                          : 'Insurance expired — re-upload to unblock'}
                  </Text>
                </View>
                <Toggle value={false} locked size="lg" />
              </View>
            ) : online ? (
              <View style={styles.onlineCard}>
                <View style={styles.onlineIcon}>
                  <AntDesign
                    name="check-circle"
                    size={22}
                    color={colors.white}
                  />
                </View>
                <View style={styles.statusCopy}>
                  <Text style={styles.onlineTitle}>You're online</Text>
                  <Text style={styles.onlineSub}>
                    Accepting requests · {driver.zones}
                  </Text>
                </View>
                <Toggle
                  value={true}
                  tone="success"
                  size="lg"
                  onValueChange={next => {
                    dispatch(setDriverOnline(false));
                    dispatch(updateDriverAvailability({ online: false, latitude: 2.68962, longitude: 72.86399 }));
                  }}
                />
              </View>
            ) : (
              <View style={styles.offlineCard}>
                <View style={styles.offlineIcon}>
                  <Feather name="moon" size={20} color={colors.isDark ? colors.white : '#64748B'} />
                </View>
                <View style={styles.statusCopy}>
                  <Text style={styles.offlineTitle}>You're offline</Text>
                  <Text style={styles.offlineSub}>
                    Go online to start receiving ride requests
                  </Text>
                </View>
                <Toggle
                  value={false}
                  tone="success"
                  size="lg"
                  onValueChange={next => {
                    dispatch(setDriverOnline(true));
                    dispatch(updateDriverAvailability({ online: true, latitude: 2.68962, longitude: 72.86399 }));
                  }}
                />
              </View>
            )}

            <View style={styles.statsRow}>
              {stats.map(stat => {
                const muted = !online && stat.id !== 'wallet';
                const iconColor = muted ? colors.textMuted : (colors.isDark ? colors.orange[400] : colors.navy[600]);
                return (
                  <View key={stat.id} style={styles.stat}>
                    <StatGlyph name={stat.icon} color={iconColor} />
                    <Text
                      style={[
                        styles.statValue,
                        muted && styles.statValueMuted,
                      ]}>
                      {stat.value}
                    </Text>
                    <Text style={styles.statLabel}>{stat.label}</Text>
                  </View>
                );
              })}
            </View>

            {restricted ? (
              <View style={styles.requireCard}>
                <View style={styles.requireHead}>
                  <Lucide name="lock" size={16} color={colors.red[600]} />
                  <Text style={styles.requireTitle}>
                    2 requirements before you can go online
                  </Text>
                </View>
                {driver.requirements.map(item => {
                  const review = item.kind === 'review';
                  return (
                    <View key={item.id} style={styles.requireRow}>
                      <View
                        style={[
                          styles.requireDot,
                          review && styles.requireDotReview,
                        ]}
                      />
                      <Text style={styles.requireText}>{item.title}</Text>
                      {item.kind === 'link' ? (
                        <TouchableOpacity activeOpacity={0.7} onPress={openDocuments}>
                          <Text style={styles.requireLink}>{item.action}</Text>
                        </TouchableOpacity>
                      ) : (
                        <Text
                          style={[
                            styles.requireMuted,
                            review && styles.requireReview,
                          ]}>
                          {item.action}
                        </Text>
                      )}
                    </View>
                  );
                })}
                <Button
                  title="Fix my documents"
                  variant="danger"
                  onPress={openDocuments}
                  style={styles.fixBtn}
                />
              </View>
            ) : (
              <View style={styles.streakCard}>
                <View style={styles.streakTop}>
                  <Lucide name="gift" size={18} color={colors.orange[600]} />
                  <Text style={styles.streakTitle}>Evening streak bonus</Text>
                  <View style={styles.progressPill}>
                    <View style={styles.progressDot} />
                    <Text style={styles.progressPillText}>In progress</Text>
                  </View>
                </View>
                <View style={styles.streakMeta}>
                  <Text style={styles.streakCount}>
                    {driver.streak.current} of {driver.streak.target} rides
                  </Text>
                  <Text style={styles.streakReward}>
                    {formatInr(driver.streak.reward)}
                  </Text>
                </View>
                <View style={styles.segmentTrack}>
                  {Array.from({ length: streakSegments }).map((_, index) => {
                    const filled = index < streakFilled;
                    const isFirst = index === 0;
                    const isLast = index === streakSegments - 1;
                    return (
                      <View
                        key={index}
                        style={[
                          styles.segment,
                          filled ? styles.segmentOn : styles.segmentOff,
                          isFirst && styles.segmentStart,
                          isLast && styles.segmentEnd,
                        ]}
                      />
                    );
                  })}
                </View>
                <Text style={styles.streakHint}>{driver.streak.hint}</Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </View>
  );
}
