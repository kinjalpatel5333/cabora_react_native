import { PASSENGER_HOME_EXPLORE } from '../../config/staticData';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Animated, Dimensions, Image, PanResponder, ScrollView, Text, View, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Feather} from '@react-native-vector-icons/feather/static';
import {Lucide} from '@react-native-vector-icons/lucide/static';
import {MaterialDesignIcons} from '@react-native-vector-icons/material-design-icons/static';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import MapBackdrop from '../../components/MapBackdrop';
import ConfirmDialog from '../../components/ConfirmDialog';
import {useToast} from '../../components/Toast';
import useThemedStyles from '../../components/useThemedStyles';
import {useApp} from '../../context/AppContext';
import {useSidebar} from '../../context/SidebarContext';
import {useAuth} from '../../hooks/useAuth';
import {useIsOnline} from '../../hooks/useIsOnline';
import {getHomeTabBarInset} from '../../navigation/homeTabBarMetrics';
import ChooseRideModal from '../ChooseRideScreen';
import FindingRideModal from '../FindingRideScreen';
import SetRouteModal from '../SetRouteScreen';
import {
  getNearbyDriversApi,
  getPassengerCurrentLocationApi,
  updatePassengerCurrentLocationApi,
} from '../../services/userApi';
import { bookRideApi, cancelRideApi } from '../../services/rideApi';
import { formatImageUrl } from '../../utils/user';
import createStyles from './style';
import colors from '../../config/color';

const EXPLORE = PASSENGER_HOME_EXPLORE;

const SHEET_COLLAPSED = 292;

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

function ExploreIcon({icon, more, colors}) {
  const tint = more
    ? colors.orange[500]
    : colors.isDark
    ? colors.white
    : colors.navy[800];
  if (icon === 'rickshaw') {
    return <MaterialDesignIcons name="rickshaw" size={28} color={tint} />;
  }
  if (icon === 'motorbike') {
    return <MaterialDesignIcons name="motorbike" size={28} color={tint} />;
  }
  if (icon === 'briefcase') {
    return <Lucide name="briefcase" size={24} color={tint} />;
  }
  return <Feather name="grid" size={24} color={tint} />;
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);
  const {colors} = useApp();
  const navigation = useNavigation();
  const {openDrawer} = useSidebar();
  const {user} = useAuth();
  const online = useIsOnline();
  const {showToast} = useToast();
  const [routeOpen, setRouteOpen] = useState(false);
  const [chooseRideOpen, setChooseRideOpen] = useState(false);
  const [findingOpen, setFindingOpen] = useState(false);
  const [findingTrip, setFindingTrip] = useState(null);
  const [pickupConfirmTrip, setPickupConfirmTrip] = useState(null);
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);
  const [sheetExpanded, setSheetExpanded] = useState(true);

  const rawName = user?.name?.trim();
  const displayName = rawName || 'Rider';
  const avatarUri = formatImageUrl(user?.photo || user?.profilePhoto || user?.avatar);
  const greeting = useMemo(
    () => greetingForHour(new Date().getHours()),
    [],
  );
  const tabBarInset = getHomeTabBarInset(insets);
  const viewportH = Dimensions.get('window').height;
  // Same open size as before — content height, capped like the old sheet.
  const sheetMaxH = Math.min(viewportH * 0.68, viewportH - insets.top - 110);
  const sheetMinH = Math.min(SHEET_COLLAPSED, sheetMaxH);
  const [sheetOpenH, setSheetOpenH] = useState(sheetMaxH);
  const sheetH = useRef(new Animated.Value(sheetMaxH)).current;
  const dragStart = useRef(sheetMaxH);
  const didInitHeight = useRef(false);
  const boundsRef = useRef({min: sheetMinH, max: sheetOpenH});
  boundsRef.current = {min: sheetMinH, max: sheetOpenH};

  const onSheetContentLayout = event => {
    const contentH = event.nativeEvent.layout.height;
    // grabber hit area (~28) + content + sheet padding
    const nextOpen = Math.min(Math.ceil(contentH + 36), sheetMaxH);
    if (nextOpen > 0 && Math.abs(nextOpen - sheetOpenH) > 2) {
      setSheetOpenH(nextOpen);
      if (!didInitHeight.current) {
        didInitHeight.current = true;
        sheetH.setValue(nextOpen);
        dragStart.current = nextOpen;
        setSheetExpanded(true);
      } else if (sheetExpanded) {
        sheetH.setValue(nextOpen);
      }
    }
  };

  const snapSheet = target => {
    const {min, max} = boundsRef.current;
    const clamped = Math.min(max, Math.max(min, target));
    const nextExpanded = clamped >= max - 8;
    setSheetExpanded(nextExpanded);
    Animated.spring(sheetH, {
      toValue: clamped,
      useNativeDriver: false,
      tension: 68,
      friction: 12,
    }).start();
  };

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 4,
        onPanResponderGrant: () => {
          sheetH.stopAnimation(value => {
            dragStart.current = value;
          });
        },
        onPanResponderMove: (_, g) => {
          const {min, max} = boundsRef.current;
          const next = Math.min(
            max,
            Math.max(min, dragStart.current - g.dy),
          );
          sheetH.setValue(next);
        },
        onPanResponderRelease: (_, g) => {
          const {min, max} = boundsRef.current;
          sheetH.stopAnimation(value => {
            const mid = (min + max) / 2;
            if (g.vy < -0.55) {
              snapSheet(max);
              return;
            }
            if (g.vy > 0.55) {
              snapSheet(min);
              return;
            }
            snapSheet(value > mid ? max : min);
          });
        },
      }),
    // sheetH is a stable Animated.Value ref; snap uses boundsRef.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sheetH],
  );

  const fabBottom = tabBarInset + (sheetExpanded ? sheetOpenH : sheetMinH) + 8;
  const headerTop = insets.top + 8;
  const overlayOpen = routeOpen || chooseRideOpen || findingOpen;

  React.useEffect(() => {
    navigation.setOptions({
      tabBarStyle: overlayOpen
        ? {display: 'none', height: 0, position: 'absolute'}
        : {
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: undefined,
            backgroundColor: 'transparent',
            borderTopWidth: 0,
            elevation: 0,
            shadowOpacity: 0,
          },
    });
    return () => {
      navigation.setOptions({
        tabBarStyle: {
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: undefined,
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
      });
    };
  }, [navigation, overlayOpen]);

  const [selectedRoute, setSelectedRoute] = useState(null);

  const openRoute = () => setRouteOpen(true);

  const openChooseRide = routeData => {
    if (routeData) {
      setSelectedRoute(routeData);
    }
    setRouteOpen(false);
    setTimeout(() => setChooseRideOpen(true), 280);
  };

  /** One step back: Choose ride → Set route (not Home). */
  const backFromChooseRide = () => {
    setChooseRideOpen(false);
    setPickupConfirmTrip(null);
    setTimeout(() => setRouteOpen(true), 280);
  };

  const requestPickupConfirm = trip => {
    setPickupConfirmTrip(trip);
  };

  const openFindingRide = async trip => {
    setPickupConfirmTrip(null);
    setFindingTrip(trip);
    setChooseRideOpen(false);
    setRouteOpen(false);
    setTimeout(() => setFindingOpen(true), 280);

    try {
      const res = await bookRideApi({
        pickup: {
          lat: 21.1702,
          lng: 72.8311,
          address: trip?.pickup || selectedRoute?.pickup || 'Surat Railway Station',
        },
        destination: {
          lat: 21.19,
          lng: 72.845,
          address: trip?.drop || selectedRoute?.drop || 'Varachha Main Road',
        },
        vehicleTypeId: trip?.rideId || trip?.vehicleTypeId || 'SEDAN',
        paymentMethod: trip?.payment?.id || trip?.paymentMethod || 'CASH',
      });
      const responseData = res?.data || res;
      if (responseData) {
        setFindingTrip(prev => ({
          ...prev,
          rideId: responseData?.rideId || responseData?._id || prev?.rideId || '6ab7a123116d933739e5bf6e',
          status: responseData?.status || 'SEARCHING_DRIVER',
          rideOtp: responseData?.rideOtp || responseData?.tripOtp || '1053',
          tripOtp: responseData?.tripOtp || responseData?.rideOtp || '1053',
          fare: responseData?.fare?.estimatedTotal ?? responseData?.fare ?? prev?.total ?? 95,
          currency: responseData?.fare?.currency || 'INR',
        }));
      }
    } catch (err) {
      console.warn('bookRideApi error:', err);
    }
  };

  /** One step back: Finding ride → Choose ride (not Home). */
  const backFromFindingRide = () => {
    setCancelConfirmOpen(false);
    setFindingOpen(false);
    setFindingTrip(null);
    setTimeout(() => setChooseRideOpen(true), 280);
  };

  const closeFindingRide = async (reason = 'Changed plans') => {
    const activeRideId = findingTrip?.rideId || '6aa28cc7e02cb357dd298432';
    setCancelConfirmOpen(false);
    setFindingOpen(false);
    setFindingTrip(null);

    try {
      await cancelRideApi(activeRideId, {
        reason: typeof reason === 'string' ? reason : 'Changed plans',
      });
      showToast({ type: 'info', message: 'Ride has been cancelled' });
    } catch (err) {
      console.warn('cancelRideApi error:', err);
    }
  };

  const [currentLocation, setCurrentLocation] = useState({
    lat: 21.1702,
    long: 72.8311,
    address: 'Varachha, Surat, Gujarat',
  });
  const [nearbyDrivers, setNearbyDrivers] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const syncLocationAndDrivers = async () => {
      let activeCoords = {
        lat: 21.1702,
        long: 72.8311,
        address: 'Varachha, Surat, Gujarat',
      };

      // 1. Fetch saved passenger current location from backend
      try {
        const locRes = await getPassengerCurrentLocationApi();
        const serverLoc = locRes?.data || locRes?.location || locRes;
        if (serverLoc?.lat && (serverLoc?.long || serverLoc?.lng)) {
          activeCoords = {
            lat: Number(serverLoc.lat) || 21.1702,
            long: Number(serverLoc.long || serverLoc.lng) || 72.8311,
            address: serverLoc.address || 'Varachha, Surat, Gujarat',
          };
          if (isMounted) {
            setCurrentLocation(activeCoords);
          }
        }
      } catch (err) {
        console.warn('Failed to get saved current location:', err);
      }

      // 2. Sync / update backend with latest current location
      try {
        await updatePassengerCurrentLocationApi({
          lat: activeCoords.lat,
          long: activeCoords.long,
          address: activeCoords.address,
        });
      } catch (err) {
        console.warn('Failed to update passenger current location:', err);
      }

      // 3. Fetch nearby drivers for this location
      try {
        const res = await getNearbyDriversApi({
          latitude: activeCoords.lat,
          longitude: activeCoords.long,
        });
        const driversList =
          res?.data?.drivers ||
          res?.data?.nearbyDrivers ||
          res?.data ||
          res?.drivers ||
          (Array.isArray(res) ? res : []);
        if (isMounted) {
          setNearbyDrivers(Array.isArray(driversList) ? driversList : []);
        }
      } catch (err) {
        console.warn('Failed to fetch nearby drivers:', err);
      }
    };

    syncLocationAndDrivers();
    return () => {
      isMounted = false;
    };
  }, []);

  const onExplorePress = item => {
    if (item.more) {
      navigation.navigate('Services');
      return;
    }
    openRoute();
    showToast({type: 'info', message: `${item.label} selected — set your drop`});
  };

  return (
    <View style={styles.root}>
      <MapBackdrop drivers={nearbyDrivers} />

      {!overlayOpen ? (
        <View style={[styles.header, {top: headerTop}]}>
          <TouchableOpacity
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Open menu"
            onPress={openDrawer}
            style={styles.menuBtn}>
            <Feather name="menu" size={22} color={colors.text} />
          </TouchableOpacity>


          <TouchableOpacity activeOpacity={0.7}
            style={styles.greetingPill}
            onPress={openRoute}
            accessibilityRole="button"
            accessibilityLabel="Plan a ride">
            <Text style={styles.greetingKicker}>{greeting}</Text>
            <Text style={styles.greetingName} numberOfLines={1}>
              {displayName}
            </Text>
          </TouchableOpacity>

          <View style={styles.headerActions}>
            <View>
              <TouchableOpacity activeOpacity={0.7}
                style={styles.iconCircle}
                accessibilityRole="button"
                accessibilityLabel="Notifications"
                onPress={() => {
                  navigation.navigate('Notifications');
                }}>
                <Feather name="bell" size={20} color={colors.white} />
              </TouchableOpacity>
              <View style={styles.badge} pointerEvents="none">
                <Text style={styles.badgeText}>3</Text>
              </View>
            </View>
            <TouchableOpacity activeOpacity={0.7}
              style={styles.avatar}
              onPress={() => navigation.navigate('Profile')}
              accessibilityRole="button"
              accessibilityLabel="Open profile">
              {Boolean(avatarUri) ? (
                <Image source={{uri: avatarUri}} style={styles.avatarImage} />
              ) : (
                <Text style={styles.avatarText}>{initials(displayName)}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      ) : null}

      {!overlayOpen && !online ? (
        <View
          style={[styles.offlineBanner, {top: headerTop + 56}]}
          accessibilityRole="text"
          accessibilityLabel="You're offline — showing your last known area">
          <MaterialDesignIcons
            name="wifi-off"
            size={18}
            color={colors.amber[750]}
            style={styles.offlineIcon}
          />
          <Text style={styles.offlineText}>
            You're offline — showing your last known area
          </Text>
        </View>
      ) : null}

      {!overlayOpen ? (
        <TouchableOpacity activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Recenter map"
          onPress={() =>
            showToast({
              type: 'success',
              message: 'Centered on your location',
            })
          }
          style={[styles.locateFab, {bottom: fabBottom}]}>
          <MaterialDesignIcons
            name="crosshairs-gps"
            size={22}
            color={colors.text}
          />
        </TouchableOpacity>
      ) : null}

      {!overlayOpen ? (
        <Animated.View
          style={[
            styles.sheetWrap,
            {bottom: tabBarInset, height: sheetH},
          ]}>
          <View style={styles.sheet}>
            <View style={styles.grabberHit} {...panResponder.panHandlers}>
              <TouchableOpacity activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={
                  sheetExpanded ? 'Collapse sheet' : 'Expand sheet'
                }
                onPress={() =>
                  snapSheet(sheetExpanded ? sheetMinH : sheetOpenH)
                }
                hitSlop={8}
                style={styles.grabberPress}>
                <View style={styles.grabber} />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.sheetScroll}
              bounces={sheetExpanded}
              scrollEnabled={sheetExpanded}
              nestedScrollEnabled>
              <View onLayout={onSheetContentLayout}>
              <TouchableOpacity activeOpacity={0.7}
                style={styles.searchCard}
                onPress={openRoute}
                accessibilityRole="button"
                accessibilityLabel="Where to?">
                <View style={styles.searchIconBox}>
                  <Feather name="search" size={20} color={colors.white} />
                </View>
                <View style={styles.searchCopy}>
                  <Text style={styles.searchTitle}>Where to?</Text>
                  <Text style={styles.searchSub}>Pickup: 12, Brigade Road</Text>
                </View>
                <TouchableOpacity activeOpacity={0.7}
                  style={styles.nowBtn}
                  onPress={e => {
                    e?.stopPropagation?.();
                    openRoute();
                    showToast({
                      type: 'info',
                      message: 'Leave now — set your destination',
                    });
                  }}
                  accessibilityRole="button"
                  accessibilityLabel="Leave now">
                  <Feather name="clock" size={15} color={colors.orange[500]} />
                  <Text style={styles.nowText}>Now</Text>
                </TouchableOpacity>
              </TouchableOpacity>

              <View style={styles.shortcuts}>
                <TouchableOpacity activeOpacity={0.7}
                  style={styles.shortcut}
                  onPress={() => {
                    openRoute();
                    showToast({type: 'info', message: 'Going home'});
                  }}
                  accessibilityRole="button"
                  accessibilityLabel="Go home">
                  <Feather name="home" size={16} color={colors.isDark ? colors.orange[500] : colors.navy[800]} />
                  <Text style={styles.shortcutText}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.7}
                  style={styles.shortcut}
                  onPress={() => {
                    openRoute();
                    showToast({type: 'info', message: 'Going to work'});
                  }}
                  accessibilityRole="button"
                  accessibilityLabel="Go to work">
                  <Feather
                    name="briefcase"
                    size={16}
                    color={colors.isDark ? colors.orange[500] : colors.navy[800]}
                  />
                  <Text style={styles.shortcutText}>Work</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.7}
                  style={styles.shortcut}
                  onPress={() => navigation.navigate('SavedPlaces')}
                  accessibilityRole="button"
                  accessibilityLabel="Add saved place">
                  <Feather name="plus" size={16} color={colors.isDark ? colors.orange[500] : colors.navy[800]} />
                  <Text style={styles.shortcutText}>Add</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.sectionHead}>
                <Text style={styles.sectionTitle}>EXPLORE</Text>
                <TouchableOpacity activeOpacity={0.7}
                  onPress={() => navigation.navigate('Services')}
                  accessibilityRole="button"
                  hitSlop={8}>
                  <Text style={styles.sectionLink}>More</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.exploreRow}>
                {EXPLORE.map(item => (
                  <TouchableOpacity activeOpacity={0.7}
                    key={item.id}
                    style={[
                      styles.exploreCard,
                      item.more && styles.exploreCardMore,
                    ]}
                    onPress={() => onExplorePress(item)}
                    accessibilityRole="button"
                    accessibilityLabel={item.label}>
                    <ExploreIcon
                      icon={item.icon}
                      more={item.more}
                      colors={colors}
                    />
                    <Text
                      style={[
                        styles.exploreLabel,
                        item.more && styles.exploreLabelMore,
                      ]}>
                      {item.label}
                    </Text>
                    <Text
                      style={[
                        styles.explorePrice,
                        item.more && styles.explorePriceMore,
                      ]}>
                      {item.price}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.sectionHead}>
                <Text style={styles.sectionTitle}>RECENT DESTINATIONS</Text>
                <TouchableOpacity activeOpacity={0.7}
                  onPress={() => navigation.navigate('Activity')}
                  accessibilityRole="button"
                  hitSlop={8}>
                  <Text style={styles.sectionLink}>See all</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity activeOpacity={0.7}
                style={styles.recentRow}
                onPress={() => {
                  openRoute();
                  showToast({
                    type: 'info',
                    message: 'Airport T2 selected',
                  });
                }}
                accessibilityRole="button"
                accessibilityLabel="Kempegowda International Airport T2">
                <View style={styles.recentIcon}>
                  <Lucide
                    name="navigation"
                    size={18}
                    color={colors.isDark ? colors.white : colors.navy[800]}
                  />
                </View>
                <View style={styles.recentCopy}>
                  <Text style={styles.recentTitle}>
                    Kempegowda Intl. Airport, T2
                  </Text>
                  <Text style={styles.recentSub}>38 km · about 55 min</Text>
                </View>
                <Feather
                  name="chevron-right"
                  size={20}
                  color={colors.textMuted}
                />
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={0.7}
                style={styles.promo}
                onPress={() =>
                  showToast({
                    type: 'success',
                    message: 'Code CABORA50 copied — 50% off next 3 rides',
                  })
                }
                accessibilityRole="button"
                accessibilityLabel="Promo offer CABORA50">
                <View style={styles.promoIcon}>
                  <Lucide name="gift" size={22} color={colors.white} />
                </View>
                <View style={styles.promoCopy}>
                  <Text style={styles.promoTitle}>
                    50% off your next 3 rides
                  </Text>
                  <Text style={styles.promoSub}>
                    Use code CABORA50 · Ends Sunday
                  </Text>
                </View>
                <Feather
                  name="chevron-right"
                  size={20}
                  color={colors.orange[500]}
                />
              </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </Animated.View>
      ) : null}

      <SetRouteModal
        visible={routeOpen}
        onClose={() => setRouteOpen(false)}
        onConfirmLocations={openChooseRide}
      />
      <ChooseRideModal
        visible={chooseRideOpen}
        onClose={backFromChooseRide}
        onBook={requestPickupConfirm}
        pickup={selectedRoute?.pickup || 'Satellite, Ahmedabad'}
        drop={selectedRoute?.drop || 'Mumbai, Maharashtra, India'}
      />
      <FindingRideModal
        visible={findingOpen}
        onClose={closeFindingRide}
        onBack={backFromFindingRide}
        onRequestCancel={() => setCancelConfirmOpen(true)}
        rideName={findingTrip?.rideName || 'Cab Sedan'}
        pickup={findingTrip?.pickup || selectedRoute?.pickup || 'Surat Railway Station'}
        drop={findingTrip?.drop || selectedRoute?.drop || 'Varachha Main Road'}
        areaHint="Surat"
        fare={findingTrip?.fare || findingTrip?.total || 95}
        currency={findingTrip?.currency || 'INR'}
        rideId={findingTrip?.rideId || '6ab7a123116d933739e5bf6e'}
        rideOtp={findingTrip?.rideOtp || findingTrip?.tripOtp || '1053'}
        tripOtp={findingTrip?.tripOtp || findingTrip?.rideOtp || '1053'}
        status={findingTrip?.status || 'SEARCHING_DRIVER'}
      />

      <ConfirmDialog
        visible={Boolean(pickupConfirmTrip)}
        onClose={() => setPickupConfirmTrip(null)}
        title="Confirm pickup point?"
        message={`We'll send your driver to ${
          pickupConfirmTrip?.pickup || '12, Brigade Road'
        }. You can move the pin before confirming.`}
        confirmLabel="Confirm pickup"
        cancelLabel="Move the pin"
        onConfirm={() => {
          if (pickupConfirmTrip) {
            openFindingRide(pickupConfirmTrip);
          }
        }}
      />

      <ConfirmDialog
        visible={cancelConfirmOpen}
        onClose={() => setCancelConfirmOpen(false)}
        variant="danger"
        title="Cancel ride?"
        message="Your driver search will stop. You won't be charged if you cancel now."
        confirmLabel="Yes, cancel ride"
        cancelLabel="Keep my ride"
        onConfirm={closeFindingRide}
      />
    </View>
  );
}
