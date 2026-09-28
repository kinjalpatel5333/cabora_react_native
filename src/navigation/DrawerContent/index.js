import React from 'react';
import { Image, ScrollView, Text, View, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@react-native-vector-icons/feather/static';
import { Lucide } from '@react-native-vector-icons/lucide/static';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons/static';
import { images } from '../../assets';
import { Toggle } from '../../components';
import { useSidebar } from '../../context/SidebarContext';
import { useAuth } from '../../hooks/useAuth';
import { useAppDispatch } from '../../redux/hooks';
import { logoutUser } from '../../redux/slices/authSlice';
import { bottomSafePad } from '../../utils/safeArea';
import { useApp } from '../../context/AppContext';
import useThemedStyles from '../../components/useThemedStyles';
import createStyles from './style';
import { formatImageUrl } from '../../utils/user';

import {
  PASSENGER_SIDEBAR_LINKS as PASSENGER_LINKS,
  DRIVER_SIDEBAR_LINKS as DRIVER_LINKS,
} from '../../config/staticData';
import { APP_VERSION } from '../../config/setting';

function DrawerGlyph({ kind, active }) {
  const { colors } = useApp();
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
  if (kind === 'crown' || kind === 'award') {
    return <MaterialDesignIcons name="crown" size={size} color={color} />;
  }
  if (kind === 'shield') {
    return <Lucide name="shield-check" size={size} color={color} />;
  }
  if (kind === 'fileText') {
    return <Feather name="file-text" size={size} color={color} />;
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
  if (kind === 'creditCard') {
    return <Feather name="credit-card" size={size} color={color} />;
  }
  if (kind === 'mapPin') {
    return <Feather name="map-pin" size={size} color={color} />;
  }
  if (kind === 'tag') {
    return <Feather name="tag" size={size} color={color} />;
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
  if (kind === 'bell') {
    return <Feather name="bell" size={size} color={color} />;
  }
  if (kind === 'settings') {
    return <Feather name="settings" size={size} color={color} />;
  }
  if (kind === 'help') {
    return <Feather name="help-circle" size={size} color={color} />;
  }
  if (kind === 'plane') {
    return <Feather name="send" size={size} color={color} />;
  }
  return <Feather name="user" size={size} color={color} />;
}

export default function DrawerContent() {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { colors, isDark, toggleTheme } = useApp();
  const styles = useThemedStyles(createStyles);
  const { activeTab, goTo, closeDrawer } = useSidebar();

  const role = (user?.currentRole || user?.role || '').toLowerCase();
  const isDriver = role === 'driver';
  const links = isDriver ? DRIVER_LINKS : PASSENGER_LINKS;

  const handleLogout = () => {
    closeDrawer();
    dispatch(logoutUser());
  };

  const photoPath = user?.photo || user?.profilePhoto;
  const avatarUri = formatImageUrl(photoPath);
  const displayName = user?.name || user?.fullName || (isDriver ? 'Driver' : 'Passenger');
  const displayEmail = user?.email || user?.phone || (isDriver ? 'driver@cabora.app' : 'user@cabora.app');

  const initials = displayName
    .trim()
    .split(/\s+/)
    .map(p => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'U';

  return (
    <View style={[styles.root, { paddingTop: Math.max(insets.top, 16) + 10 }]}>
      {/* Profile Header (Clickable -> goes to Profile) */}
      <TouchableOpacity
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="View Profile"
        onPress={() => goTo('Profile')}
        style={styles.profile}>
        <View style={styles.profileRow}>
          <View style={styles.avatarContainer}>
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarFallback}>
                <Text style={styles.avatarInitial}>{initials}</Text>
              </View>
            )}
            <View style={[styles.roleBadgeDot, isDriver ? styles.roleBadgeDotDriver : styles.roleBadgeDotPassenger]} />
          </View>

          <View style={styles.profileInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.name} numberOfLines={1}>
                {displayName}
              </Text>
            </View>

            <View style={styles.roleTag}>
              <Text style={styles.roleTagText}>
                {isDriver ? 'DRIVER PARTNER' : 'PASSENGER'}
              </Text>
            </View>

            <Text style={styles.email} numberOfLines={1}>
              {displayEmail}
            </Text>
          </View>

          <Feather
            name="chevron-right"
            size={18}
            color={colors.textMuted}
            style={styles.profileChevron}
          />
        </View>
      </TouchableOpacity>

      {/* Navigation List */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollItems}>
        {links.map(link => {
          const active = activeTab === link.screen;
          return (
            <TouchableOpacity
              activeOpacity={0.7}
              key={link.screen}
              accessibilityRole="button"
              accessibilityLabel={link.label}
              onPress={() => goTo(link.screen)}
              style={[styles.item, active && styles.itemActive]}>
              <View style={[styles.iconBox, active && styles.iconBoxActive]}>
                <DrawerGlyph kind={link.iconKind} active={active} />
              </View>
              <Text style={[styles.itemLabel, active && styles.itemLabelActive]}>
                {link.label}
              </Text>
              {active && <View style={styles.activePillIndicator} />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { paddingBottom: bottomSafePad(insets, 16) }]}>
        {/* Dark Mode Toggle */}
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
              <Text style={styles.themeSub}>{isDark ? 'Enabled' : 'Disabled'}</Text>
            </View>
          </View>
          <Toggle value={isDark} onValueChange={toggleTheme} />
        </View>

        {/* Log Out */}
        <TouchableOpacity
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Log out"
          onPress={handleLogout}
          style={styles.logoutBtn}>
          <View style={styles.logoutIconBox}>
            <Feather
              name="log-out"
              size={18}
              color={colors.isDark ? colors.red[400] : colors.red[600]}
            />
          </View>
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>

        {/* App Version */}
        <Text style={styles.versionText}>v {APP_VERSION}</Text>
      </View>
    </View>
  );
}
