import React, {useMemo, useState} from 'react';
import {
  Dimensions,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Feather} from '@react-native-vector-icons/feather/static';
import {Lucide} from '@react-native-vector-icons/lucide/static';
import {MaterialDesignIcons} from '@react-native-vector-icons/material-design-icons/static';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import MapBackdrop from '../../components/MapBackdrop';
import ConfirmDialog from '../../components/ConfirmDialog';
import useThemedStyles from '../../components/useThemedStyles';
import {useApp} from '../../context/AppContext';
import {useSidebar} from '../../context/SidebarContext';
import {useAuth} from '../../hooks/useAuth';
import {useIsOnline} from '../../hooks/useIsOnline';
import {getHomeTabBarInset} from '../../navigation/homeTabBarMetrics';
import ChooseRideModal from '../ChooseRideScreen';
import FindingRideModal from '../FindingRideScreen';
import SetRouteModal from '../SetRouteScreen';
import createStyles from './style';

const EXPLORE = [
  {id: 'auto', label: 'Auto', price: 'from ₹48', icon: 'rickshaw'},
  {id: 'bike', label: 'Bike', price: 'from ₹29', icon: 'motorbike'},
  {id: 'portal', label: 'Portal', price: 'from ₹39', icon: 'briefcase'},
  {id: 'more', label: 'More', price: '9 services', more: true, icon: 'grid'},
];

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
  const tint = more ? colors.orange[600] : colors.navy[800];
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
  const [routeOpen, setRouteOpen] = useState(false);
  const [chooseRideOpen, setChooseRideOpen] = useState(false);
  const [findingOpen, setFindingOpen] = useState(false);
  const [findingTrip, setFindingTrip] = useState(null);
  const [pickupConfirmTrip, setPickupConfirmTrip] = useState(null);
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);

  const displayName = user?.name || 'Aarav Mehta';
  const greeting = useMemo(
    () => greetingForHour(new Date().getHours()),
    [],
  );
  const tabBarInset = getHomeTabBarInset(insets);
  const viewportH = Dimensions.get('window').height;
  // Sheet sits above the floating pill — height follows content (no empty white gap).
  const sheetMaxH = Math.min(viewportH * 0.68, viewportH - insets.top - 110);
  const fabBottom = tabBarInset + Math.min(sheetMaxH, 320) + 8;
  const headerTop = insets.top + 8;
  const overlayOpen = routeOpen || chooseRideOpen || findingOpen;

  const openChooseRide = () => {
    setRouteOpen(false);
    // Let Set Route / Your Route modals dismiss before opening Choose ride.
    setTimeout(() => setChooseRideOpen(true), 280);
  };

  const requestPickupConfirm = trip => {
    setPickupConfirmTrip(trip);
  };

  const openFindingRide = trip => {
    setPickupConfirmTrip(null);
    setFindingTrip(trip);
    setChooseRideOpen(false);
    setRouteOpen(false);
    setTimeout(() => setFindingOpen(true), 280);
  };

  const closeFindingRide = () => {
    setCancelConfirmOpen(false);
    setFindingOpen(false);
    setFindingTrip(null);
  };

  return (
    <View style={styles.root}>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />
      <MapBackdrop showUserDot={!findingOpen} />

      {!overlayOpen ? (
        <View style={[styles.header, {top: headerTop}]}>
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
              {displayName}
            </Text>
          </View>

          <View style={styles.headerActions}>
            <View>
              <Pressable style={styles.iconCircle} accessibilityRole="button">
                <Feather name="bell" size={20} color={colors.white} />
              </Pressable>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>3</Text>
              </View>
            </View>
            <Pressable
              style={styles.avatar}
              onPress={() => navigation.navigate('Profile')}
              accessibilityRole="button">
              <Text style={styles.avatarText}>{initials(displayName)}</Text>
            </Pressable>
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
            color="#9A6B12"
            style={styles.offlineIcon}
          />
          <Text style={styles.offlineText}>
            You're offline — showing your last known area
          </Text>
        </View>
      ) : null}

      {!overlayOpen ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Recenter map"
          style={[styles.locateFab, {bottom: fabBottom}]}>
          <MaterialDesignIcons
            name="crosshairs-gps"
            size={22}
            color={colors.navy[800]}
          />
        </Pressable>
      ) : null}

      {!overlayOpen ? (
      <View
        style={[
          styles.sheetWrap,
          {bottom: tabBarInset, maxHeight: sheetMaxH},
        ]}>
        <View style={styles.sheet}>
          <View style={styles.grabber} />
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.sheetScroll}
            bounces={false}>
            <Pressable
              style={styles.searchCard}
              onPress={() => setRouteOpen(true)}
              accessibilityRole="button">
              <View style={styles.searchIconBox}>
                <Feather name="search" size={20} color={colors.white} />
              </View>
              <View style={styles.searchCopy}>
                <Text style={styles.searchTitle}>Where to?</Text>
                <Text style={styles.searchSub}>Pickup: 12, Brigade Road</Text>
              </View>
              <View style={styles.nowBtn}>
                <Feather name="clock" size={15} color={colors.orange[600]} />
                <Text style={styles.nowText}>Now</Text>
              </View>
            </Pressable>

            <View style={styles.shortcuts}>
              <Pressable style={styles.shortcut}>
                <Feather name="home" size={16} color={colors.navy[800]} />
                <Text style={styles.shortcutText}>Home</Text>
              </Pressable>
              <Pressable style={styles.shortcut}>
                <Feather name="briefcase" size={16} color={colors.navy[800]} />
                <Text style={styles.shortcutText}>Work</Text>
              </Pressable>
              <Pressable style={styles.shortcut}>
                <Feather name="plus" size={16} color={colors.navy[800]} />
                <Text style={styles.shortcutText}>Add</Text>
              </Pressable>
            </View>

            <View style={styles.sectionHead}>
              <Text style={styles.sectionTitle}>EXPLORE</Text>
              <Pressable onPress={() => navigation.navigate('Services')}>
                <Text style={styles.sectionLink}>More</Text>
              </Pressable>
            </View>
            <View style={styles.exploreRow}>
              {EXPLORE.map(item => (
                <Pressable
                  key={item.id}
                  style={[
                    styles.exploreCard,
                    item.more && styles.exploreCardMore,
                  ]}
                  onPress={() => navigation.navigate('Services')}>
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
                </Pressable>
              ))}
            </View>

            <View style={styles.sectionHead}>
              <Text style={styles.sectionTitle}>RECENT DESTINATIONS</Text>
              <Text style={styles.sectionLink}>See all</Text>
            </View>
            <Pressable style={styles.recentRow}>
              <View style={styles.recentIcon}>
                <Lucide name="navigation" size={18} color={colors.navy[800]} />
              </View>
              <View style={styles.recentCopy}>
                <Text style={styles.recentTitle}>
                  Kempegowda Intl. Airport, T2
                </Text>
                <Text style={styles.recentSub}>38 km · about 55 min</Text>
              </View>
              <Feather name="chevron-right" size={20} color={colors.gray[400]} />
            </Pressable>

            <Pressable style={styles.promo}>
              <View style={styles.promoIcon}>
                <Lucide name="gift" size={22} color={colors.white} />
              </View>
              <View style={styles.promoCopy}>
                <Text style={styles.promoTitle}>50% off your next 3 rides</Text>
                <Text style={styles.promoSub}>
                  Use code CABORA50 · Ends Sunday
                </Text>
              </View>
              <Feather name="chevron-right" size={20} color={colors.orange[600]} />
            </Pressable>
          </ScrollView>
        </View>
      </View>
      ) : null}

      <SetRouteModal
        visible={routeOpen}
        onClose={() => setRouteOpen(false)}
        onConfirmLocations={openChooseRide}
      />
      <ChooseRideModal
        visible={chooseRideOpen}
        onClose={() => setChooseRideOpen(false)}
        onBook={requestPickupConfirm}
      />
      <FindingRideModal
        visible={findingOpen}
        onClose={closeFindingRide}
        onRequestCancel={() => setCancelConfirmOpen(true)}
        rideName={findingTrip?.rideName || 'Cab Sedan'}
        pickup={findingTrip?.pickup || '12, Brigade Road, Ashok Nagar'}
        drop={findingTrip?.drop || 'Kempegowda Intl. Airport, T2'}
        areaHint="Brigade Road"
        fare={findingTrip?.total || 198}
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
