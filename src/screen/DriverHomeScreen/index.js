import React, { useMemo, useState } from 'react';
import {
  Dimensions,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@react-native-vector-icons/ant-design/static';
import { Feather } from '@react-native-vector-icons/feather/static';
import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6/static';
import { Lucide } from '@react-native-vector-icons/lucide/static';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons/static';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, MapBackdrop, Toggle } from '../../components';
import useThemedStyles from '../../components/useThemedStyles';
import { useApp } from '../../context/AppContext';
import { useSidebar } from '../../context/SidebarContext';
import { useAuth } from '../../hooks/useAuth';
import { getHomeTabBarInset } from '../../navigation/homeTabBarMetrics';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { setDriverOnline, setDriverRestricted } from '../../redux/slices/driverSlice';
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
  const name = (user?.name || '').trim();
  if (!name || name === 'Driver') {
    return 'Rajesh Kumar';
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

  const restricted = Boolean(driver.restricted);
  const online = Boolean(driver.online) && !restricted;
  const displayName = driverDisplayName(user);
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
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />
      <DriverMapBackdrop showUserDot={false} showDemand={online} />

      <View pointerEvents="none" style={styles.mapMarkers}>
        <View style={styles.locationMarker}>
          <View style={styles.locationHalo} />
          <View style={styles.locationCore} />
        </View>
      </View>

      <View style={[styles.header, { top: headerTop }]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open menu"
          onPress={openDrawer}
          style={styles.menuBtn}>
          <Feather name="menu" size={22} color={colors.navy[800]} />
        </Pressable>

        <View style={styles.greetingPill}>
          <Text style={styles.greetingKicker}>{greeting}</Text>
          <Text style={styles.greetingName} numberOfLines={1}>
            {displayName} · {driver.rating.toFixed(2)} ★
          </Text>
        </View>

        <View style={styles.headerActions}>
          <Pressable
            style={styles.avatar}
            onPress={() => navigation.navigate('Profile')}
            accessibilityRole="button">
            <Text style={styles.avatarText}>{initials(displayName)}</Text>
          </Pressable>
          <View style={styles.bellWrap}>
            <Pressable
              style={styles.iconCircle}
              accessibilityRole="button"
              accessibilityLabel="Notifications">
              <Feather name="bell" size={18} color={colors.white} />
            </Pressable>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          </View>
        </View>
      </View>

      <Pressable
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
      </Pressable>

      {online ? (
        <Pressable
          style={[styles.demandChip, { top: headerTop + 104 }]}
          accessibilityRole="button">
          <Lucide name="navigation" size={14} color={colors.white} />
          <Text style={styles.demandText}>
            High demand {driver.demand.km} km away · Navigate
          </Text>
        </Pressable>
      ) : null}

      <Pressable
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
          color={colors.navy[800]}
        />
      </Pressable>

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
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.sheetScroll}
            bounces={false}>
            {restricted ? (
              <View style={styles.offlineCard}>
                <View style={styles.statusIconWarn}>
                  <Lucide name="lock" size={18} color={colors.red[600]} />
                </View>
                <View style={styles.statusCopy}>
                  <Text style={styles.offlineTitle}>You can't go online</Text>
                  <Text style={styles.offlineSub}>
                    Insurance expired — re-upload to unblock
                  </Text>
                </View>
                <Toggle value={false} locked size="lg" />
              </View>
            ) : (
              <View style={[styles.onlineCard, !online && styles.awayCard]}>
                <View
                  style={[styles.statusIcon, !online && styles.statusIconAway]}>
                  {online ? (
                    <AntDesign
                      name="check-circle"
                      size={22}
                      color={colors.white}
                    />
                  ) : (
                    <Feather name="pause" size={18} color={colors.navy[600]} />
                  )}
                </View>
                <View style={styles.statusCopy}>
                  <Text
                    style={[
                      styles.onlineTitle,
                      !online && styles.awayTitle,
                    ]}>
                    {online ? "You're online" : "You're offline"}
                  </Text>
                  <Text
                    style={[styles.onlineSub, !online && styles.awaySub]}>
                    {online
                      ? `Accepting requests · ${driver.zones}`
                      : `Go online to accept requests · ${driver.zones}`}
                  </Text>
                </View>
                <Toggle
                  value={online}
                  tone="success"
                  size="lg"
                  onValueChange={next => {
                    if (next) {
                      dispatch(setDriverOnline(true));
                      return;
                    }
                    dispatch(setDriverRestricted(true));
                  }}
                />
              </View>
            )}

            <View style={styles.statsRow}>
              {stats.map(stat => {
                const muted = !online && stat.id !== 'wallet';
                const iconColor = muted ? colors.gray[400] : colors.navy[400];
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
                        <Pressable onPress={openDocuments}>
                          <Text style={styles.requireLink}>{item.action}</Text>
                        </Pressable>
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
