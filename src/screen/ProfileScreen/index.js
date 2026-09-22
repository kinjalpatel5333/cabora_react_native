import React, {useCallback, useState} from 'react';
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import {Feather} from '@react-native-vector-icons/feather/static';
import {MaterialDesignIcons} from '@react-native-vector-icons/material-design-icons/static';
import {useFocusEffect} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {images} from '../../assets';
import {useToast} from '../../components/Toast';
import useThemedStyles from '../../components/useThemedStyles';
import {useApp} from '../../context/AppContext';
import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import {fetchUserProfile} from '../../redux/slices/authSlice';
import createStyles from './style';
import colors from '../../config/color';

function CustomToggle({value, onToggle, label, styles}) {
  return (
    <Pressable
      onPress={() => onToggle(!value)}
      accessibilityRole="switch"
      accessibilityState={{checked: value}}
      accessibilityLabel={label}
      style={[
        styles.toggleTrack,
        value ? styles.toggleTrackActive : styles.toggleTrackInactive,
      ]}>
      <View
        style={[
          styles.toggleThumb,
          value ? styles.toggleThumbActive : styles.toggleThumbInactive,
        ]}
      />
    </Pressable>
  );
}

export default function ProfileScreen({navigation}) {
  const insets = useSafeAreaInsets();
  const {isDark, toggleTheme, colors} = useApp();
  const styles = useThemedStyles(createStyles);
  const {showToast} = useToast();
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.auth.user);

  const [activeRole, setActiveRole] = useState(user?.role || 'passenger');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [preferences, setPreferences] = useState({
    notifications: true,
    offers: false,
  });

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchUserProfile());
    }, [dispatch]),
  );

  const togglePref = key => {
    setPreferences(prev => ({...prev, [key]: !prev[key]}));
  };

  const displayName = user?.name || user?.fullName || 'User';
  const displayPhone = user?.phone || user?.mobile
    ? (String(user.phone || user.mobile).startsWith('+')
        ? String(user.phone || user.mobile)
        : `+91 ${String(user.phone || user.mobile)}`)
    : '+91 98765 43210';
  const displayEmail = user?.email || 'user@example.com';
  const displayPhoto = user?.photo || user?.profilePhoto || user?.avatar;

  const initials = displayName
    .trim()
    .split(/\s+/)
    .map(part => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'U';

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={colors.navy[950]} />
      <View style={[styles.hero, {paddingTop: Math.max(insets.top, 24) + 16}]}>
        {/* Real Ambient Corner Orange Glow Image */}
        <Image
          source={images.loginGlow}
          style={styles.glow}
          resizeMode="cover"
        />

        <View style={styles.menuBtn}>
          <Feather name="menu" size={22} color={colors.white} />
        </View>

        <View style={styles.userRow}>
          <View style={styles.avatarRing}>
            <View style={styles.avatarInner}>
              {displayPhoto ? (
                <Image source={{uri: displayPhoto}} style={styles.avatarPhoto} />
              ) : (
                <Text style={styles.avatarInitials}>{initials}</Text>
              )}
            </View>
          </View>
          <View style={styles.userInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.userName}>{displayName}</Text>
              <MaterialDesignIcons
                name="shield-check"
                size={18}
                color={colors.success}
              />
            </View>
            <Text style={styles.userSub}>{displayPhone}</Text>
            <Text style={styles.userEmail}>{displayEmail}</Text>
          </View>
          <Pressable
            style={styles.editBtn}
            onPress={() => showToast({type: 'info', message: 'Edit profile'})}
            accessibilityRole="button"
            accessibilityLabel="Edit profile"
            hitSlop={8}>
            <Feather name="edit-2" size={16} color={colors.white} />
          </Pressable>
        </View>

        <View style={styles.roleBar}>
          <Pressable
            style={[
              styles.roleTab,
              activeRole === 'passenger' && styles.roleTabActive,
            ]}
            onPress={() => setActiveRole('passenger')}
            accessibilityRole="button"
            accessibilityLabel="Passenger mode">
            <Feather
              name="user"
              size={18}
              color={activeRole === 'passenger' ? colors.navy.darkBg3 : colors.blue.gray}
            />
            <Text
              style={[
                styles.roleText,
                activeRole === 'passenger' && styles.roleTextActive,
              ]}>
              Passenger
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.roleTab,
              activeRole === 'driver' && styles.roleTabActive,
            ]}
            onPress={() => {
              setActiveRole('driver');
              showToast({type: 'info', message: 'Switching to Driver mode'});
            }}
            accessibilityRole="button"
            accessibilityLabel="Driver mode">
            <MaterialDesignIcons
              name="car-side"
              size={20}
              color={activeRole === 'driver' ? colors.navy.darkBg3 : colors.blue.gray}
            />
            <Text
              style={[
                styles.roleText,
                activeRole === 'driver' && styles.roleTextActive,
              ]}>
              Driver
            </Text>
            <View style={styles.approvedBadge}>
              <Text style={styles.approvedText}>APPROVED</Text>
            </View>
          </Pressable>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scroll,
          {paddingBottom: Math.max(insets.bottom, 16) + 90},
        ]}>
        <Text style={styles.sectionLabel}>ACCOUNT</Text>
        <View style={styles.card}>
          <Pressable
            style={[styles.rowItem, styles.rowBorder]}
            onPress={() =>
              showToast({type: 'info', message: 'Personal details'})
            }
            accessibilityRole="button"
            accessibilityLabel="Personal details">
            <View style={styles.rowIconBox}>
              <Feather name="user" size={18} color={colors.isDark ? colors.white : colors.navy.textDark} />
            </View>
            <View style={styles.rowBody}>
              <Text style={styles.rowTitle}>Personal details</Text>
              <Text style={styles.rowSub}>Name, gender, date of birth</Text>
            </View>
            <Feather name="chevron-right" size={18} color={colors.textMuted} />
          </Pressable>

          <Pressable
            style={[styles.rowItem, styles.rowBorder]}
            onPress={() => showToast({type: 'info', message: 'Language'})}
            accessibilityRole="button"
            accessibilityLabel="Language">
            <View style={styles.rowIconBox}>
              <Feather name="globe" size={18} color={colors.isDark ? colors.white : colors.navy.textDark} />
            </View>
            <View style={styles.rowBody}>
              <Text style={styles.rowTitle}>Language</Text>
              <Text style={styles.rowSub}>English (India)</Text>
            </View>
            <Feather name="chevron-right" size={18} color={colors.textMuted} />
          </Pressable>

          <Pressable
            style={styles.rowItem}
            onPress={() =>
              showToast({type: 'info', message: 'Payment methods'})
            }
            accessibilityRole="button"
            accessibilityLabel="Payment methods">
            <View style={styles.rowIconBox}>
              <Feather name="credit-card" size={18} color={colors.isDark ? colors.white : colors.navy.textDark} />
            </View>
            <View style={styles.rowBody}>
              <Text style={styles.rowTitle}>Payment methods</Text>
              <Text style={styles.rowSub}>UPI, 1 card, wallet</Text>
            </View>
            <Feather name="chevron-right" size={18} color={colors.textMuted} />
          </Pressable>
        </View>

        <Text style={styles.sectionLabel}>PREFERENCES & PRIVACY</Text>
        <View style={styles.card}>
          <View style={[styles.rowItem, styles.rowBorder]}>
            <View style={styles.rowIconBox}>
              <Feather name="bell" size={18} color={colors.isDark ? colors.white : colors.navy.textDark} />
            </View>
            <View style={styles.rowBody}>
              <Text style={styles.rowTitle}>Ride notifications</Text>
              <Text style={styles.rowSub}>Push, SMS and WhatsApp</Text>
            </View>
            <CustomToggle
              value={preferences.notifications}
              onToggle={() => togglePref('notifications')}
              label="Ride notifications"
              styles={styles}
            />
          </View>

          <View style={[styles.rowItem, styles.rowBorder]}>
            <View style={styles.rowIconBox}>
              <Feather name="percent" size={18} color={colors.primary} />
            </View>
            <View style={styles.rowBody}>
              <Text style={styles.rowTitle}>Offers & promotions</Text>
              <Text style={styles.rowSub}>
                Occasional deals and referral nudges
              </Text>
            </View>
            <CustomToggle
              value={preferences.offers}
              onToggle={() => togglePref('offers')}
              label="Offers & promotions"
              styles={styles}
            />
          </View>

          <View style={[styles.rowItem, styles.rowBorder]}>
            <View style={styles.rowIconBox}>
              <Feather name="moon" size={18} color={colors.isDark ? colors.primary : colors.navy.textDark} />
            </View>
            <View style={styles.rowBody}>
              <Text style={styles.rowTitle}>Dark mode</Text>
              <Text style={styles.rowSub}>Follow system</Text>
            </View>
            <CustomToggle
              value={isDark}
              onToggle={toggleTheme}
              label="Dark mode"
              styles={styles}
            />
          </View>

          <Pressable
            style={styles.rowItem}
            onPress={() => setShowDeleteModal(true)}
            accessibilityRole="button"
            accessibilityLabel="Delete your account">
            <View style={[styles.rowIconBox, styles.deleteIconBox]}>
              <Feather name="trash-2" size={18} color={colors.danger} />
            </View>
            <View style={styles.rowBody}>
              <Text style={[styles.rowTitle, {color: colors.danger}]}>
                Delete your account
              </Text>
              <Text style={styles.rowSub}>Permanent removal of data</Text>
            </View>
            <Feather name="chevron-right" size={18} color={colors.textMuted} />
          </Pressable>
        </View>
      </ScrollView>

      {/* Delete Account Confirmation Modal */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}>
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowDeleteModal(false)}>
          <Pressable style={styles.modalCard} onPress={e => e.stopPropagation()}>
            <View style={styles.modalIconRing}>
              <Feather name="trash-2" size={26} color={colors.red[600]} />
            </View>

            <Text style={styles.modalTitle}>Delete your Cabora account?</Text>
            <Text style={styles.modalSub}>
              {"This can't be undone. Here's exactly what happens:"}
            </Text>

            <View style={styles.modalInfoBox}>
              <View style={styles.modalInfoRow}>
                <Feather name="credit-card" size={17} color={colors.textMuted} />
                <Text style={styles.modalInfoText}>
                  Your ₹1,240.00 wallet balance is forfeited
                </Text>
              </View>
              <View style={styles.modalInfoRow}>
                <Feather name="clock" size={17} color={colors.textMuted} />
                <Text style={styles.modalInfoText}>
                  Ride history and receipts are erased
                </Text>
              </View>
              <View style={styles.modalInfoRow}>
                <Feather name="lock" size={17} color={colors.textMuted} />
                <Text style={styles.modalInfoText}>
                  The same number can re-register after 30 days
                </Text>
              </View>
            </View>

            <Pressable
              style={styles.modalDeleteBtn}
              onPress={() => {
                setShowDeleteModal(false);
                showToast({
                  type: 'error',
                  message: 'Account deletion initiated',
                });
              }}
              accessibilityRole="button"
              accessibilityLabel="Delete my account">
              <Text style={styles.modalDeleteBtnText}>Delete my account</Text>
            </Pressable>

            <Pressable
              style={styles.modalKeepBtn}
              onPress={() => setShowDeleteModal(false)}
              accessibilityRole="button"
              accessibilityLabel="Keep my account">
              <Text style={styles.modalKeepBtnText}>Keep my account</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
