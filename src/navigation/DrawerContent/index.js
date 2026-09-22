import React from 'react';
import {Image, Pressable, ScrollView, Switch, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Feather} from '@react-native-vector-icons/feather/static';
import {Lucide} from '@react-native-vector-icons/lucide/static';
import {MaterialDesignIcons} from '@react-native-vector-icons/material-design-icons/static';
import {images} from '../../assets';
import {Button} from '../../components';
import {useSidebar} from '../../context/SidebarContext';
import {useAuth} from '../../hooks/useAuth';
import {useAppDispatch} from '../../redux/hooks';
import {logoutUser} from '../../redux/slices/authSlice';
import {bottomSafePad} from '../../utils/safeArea';
import {useApp} from '../../context/AppContext';
import useThemedStyles from '../../components/useThemedStyles';
import createStyles from './style';

const PASSENGER_LINKS = [
  {label: 'Home', screen: 'Home', iconKind: 'home'},
  {label: 'Services', screen: 'Services', iconKind: 'grid'},
  {label: 'Activity', screen: 'Activity', iconKind: 'clock'},
  {label: 'Wallet', screen: 'Wallet', iconKind: 'wallet'},
  {label: 'Profile', screen: 'Profile', iconKind: 'user'},
];

const DRIVER_LINKS = [
  {label: 'Dashboard', screen: 'Dashboard', iconKind: 'home'},
  {label: 'Trip History', screen: 'DriverTripHistory', iconKind: 'history'},
  {label: 'My Subscription', screen: 'DriverSubscription', iconKind: 'crown'},
  {label: 'Daily Safety Check', screen: 'DriverDailySafetyCheck', iconKind: 'shield'},
  {label: 'Incentive Tracker', screen: 'DriverIncentiveTracker', iconKind: 'target'},
  {label: 'Earnings', screen: 'Earnings', iconKind: 'rupee'},
  {label: 'Wallet', screen: 'Wallet', iconKind: 'wallet'},
  {label: 'Incentives', screen: 'Incentives', iconKind: 'gift'},
  {label: 'Profile', screen: 'Profile', iconKind: 'user'},
];

function DrawerGlyph({kind, active}) {
  const {colors} = useApp();
  const color = active ? colors.primary : colors.textMuted;
  const size = 20;

  if (kind === 'home') {
    return (
      <MaterialDesignIcons
        name={active ? 'home' : 'home-outline'}
        size={size}
        color={color}
      />
    );
  }
  if (kind === 'history') {
    return <Lucide name="history" size={size} color={color} />;
  }
  if (kind === 'crown') {
    return <MaterialDesignIcons name="crown" size={size} color={color} />;
  }
  if (kind === 'shield') {
    return <Lucide name="shield-check" size={size} color={color} />;
  }
  if (kind === 'target') {
    return <Lucide name="target" size={size} color={color} />;
  }
  if (kind === 'rupee') {
    return (
      <MaterialDesignIcons name="currency-inr" size={size} color={color} />
    );
  }
  if (kind === 'wallet') {
    return (
      <MaterialDesignIcons
        name={active ? 'wallet' : 'wallet-outline'}
        size={size}
        color={color}
      />
    );
  }
  if (kind === 'gift') {
    return <Lucide name="gift" size={size} color={color} />;
  }
  if (kind === 'grid') {
    return <Feather name="grid" size={size} color={color} />;
  }
  if (kind === 'clock') {
    return <Feather name="clock" size={size} color={color} />;
  }
  return <Feather name="user" size={size} color={color} />;
}

export default function DrawerContent() {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const {user} = useAuth();
  const {colors, isDark, toggleTheme} = useApp();
  const styles = useThemedStyles(createStyles);
  const {activeTab, goTo, closeDrawer} = useSidebar();
  const links = user?.role === 'driver' ? DRIVER_LINKS : PASSENGER_LINKS;

  const handleLogout = () => {
    closeDrawer();
    dispatch(logoutUser());
  };

  return (
    <View
      style={[
        styles.root,
        {paddingTop: insets.top + 16},
      ]}>
      <View style={styles.profile}>
        <Image
          source={user?.photo ? {uri: user.photo} : images.avatar}
          style={styles.avatar}
        />
        <Text style={styles.name}>{user?.name || (user?.role === 'driver' ? 'Driver' : 'Passenger')}</Text>
        <Text style={styles.email}>{user?.email || (user?.role === 'driver' ? 'driver@cabora.app' : 'user@cabora.app')}</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollItems}>
        {links.map(link => {
          const active = activeTab === link.screen;
          return (
            <Pressable
              key={link.screen}
              accessibilityRole="button"
              accessibilityLabel={link.label}
              onPress={() => goTo(link.screen)}
              style={[styles.item, active && styles.itemActive]}>
              <View
                style={[
                  styles.iconBox,
                  active && styles.iconBoxActive,
                ]}>
                <DrawerGlyph kind={link.iconKind} active={active} />
              </View>
              <Text style={[styles.itemLabel, active && styles.itemLabelActive]}>
                {link.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={[styles.footer, {paddingBottom: bottomSafePad(insets, 16)}]}>
        {/* Theme Toggle Row */}
        <View style={styles.themeRow}>
          <View style={styles.themeLeft}>
            <View style={styles.themeIconBox}>
              <Feather
                name={isDark ? 'moon' : 'sun'}
                size={18}
                color={isDark ? colors.primary : colors.text}
              />
            </View>
            <View style={styles.themeTextWrap}>
              <Text style={styles.themeLabel}>Dark mode</Text>
              <Text style={styles.themeSub}>
                {isDark ? 'On' : 'Off'}
              </Text>
            </View>
          </View>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{
              false: colors.isDark ? colors.navy[700] : colors.gray[300],
              true: colors.primary,
            }}
            thumbColor={colors.white}
          />
        </View>

        {/* Log Out Button */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Log out"
          onPress={handleLogout}
          style={styles.logoutBtn}>
          <View style={styles.logoutIconBox}>
            <Feather name="log-out" size={18} color={colors.isDark ? colors.red[400] : colors.red[600]} />
          </View>
          <Text style={styles.logoutText}>Log out</Text>
        </Pressable>
      </View>
    </View>
  );
}
