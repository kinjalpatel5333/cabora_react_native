import React, {useState} from 'react';
import {
  Image,
  Modal,
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
import {images} from '../../assets';
import {useToast} from '../../components/Toast';
import useThemedStyles from '../../components/useThemedStyles';
import {useSidebar} from '../../context/SidebarContext';
import createStyles from './style';

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

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);
  const navigation = useNavigation();
  const {openDrawer} = useSidebar();
  const {showToast} = useToast();

  const [activeRole, setActiveRole] = useState('passenger');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [preferences, setPreferences] = useState({
    notifications: true,
    offers: false,
    darkMode: true,
  });

  const togglePref = key => {
    setPreferences(prev => ({...prev, [key]: !prev[key]}));
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#071C31" />
      <View style={[styles.hero, {paddingTop: Math.max(insets.top, 24) + 16}]}>
        {/* Real Ambient Corner Orange Glow Image */}
        <Image
          source={images.loginGlow}
          style={styles.glow}
          resizeMode="cover"
        />

        <View style={styles.menuBtn}>
          <Feather name="menu" size={22} color="#FFFFFF" />
        </View>

        <View style={styles.userRow}>
          <View style={styles.avatarRing}>
            <View style={styles.avatarInner}>
              <Text style={styles.avatarInitials}>AM</Text>
            </View>
          </View>
          <View style={styles.userInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.userName}>Aarav Mehta</Text>
              <MaterialDesignIcons
                name="shield-check"
                size={18}
                color="#22C55E"
              />
            </View>
            <Text style={styles.userSub}>+91 98765 43210</Text>
            <Text style={styles.userEmail}>aarav.mehta@gmail.com</Text>
          </View>
          <Pressable
            style={styles.editBtn}
            onPress={() => showToast({type: 'info', message: 'Edit profile'})}
            accessibilityRole="button"
            accessibilityLabel="Edit profile"
            hitSlop={8}>
            <Feather name="edit-2" size={16} color="#FFFFFF" />
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
              color={activeRole === 'passenger' ? '#081E32' : '#8295A8'}
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
              color={activeRole === 'driver' ? '#081E32' : '#8295A8'}
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
              <Feather name="user" size={18} color="#0F2840" />
            </View>
            <View style={styles.rowBody}>
              <Text style={styles.rowTitle}>Personal details</Text>
              <Text style={styles.rowSub}>Name, gender, date of birth</Text>
            </View>
            <Feather name="chevron-right" size={18} color="#8A96A6" />
          </Pressable>

          <Pressable
            style={[styles.rowItem, styles.rowBorder]}
            onPress={() => showToast({type: 'info', message: 'Language'})}
            accessibilityRole="button"
            accessibilityLabel="Language">
            <View style={styles.rowIconBox}>
              <Feather name="globe" size={18} color="#0F2840" />
            </View>
            <View style={styles.rowBody}>
              <Text style={styles.rowTitle}>Language</Text>
              <Text style={styles.rowSub}>English (India)</Text>
            </View>
          </Pressable>

          <Pressable
            style={styles.rowItem}
            onPress={() =>
              showToast({type: 'info', message: 'Payment methods'})
            }
            accessibilityRole="button"
            accessibilityLabel="Payment methods">
            <View style={styles.rowIconBox}>
              <Feather name="credit-card" size={18} color="#0F2840" />
            </View>
            <View style={styles.rowBody}>
              <Text style={styles.rowTitle}>Payment methods</Text>
              <Text style={styles.rowSub}>UPI, 1 card, wallet</Text>
            </View>
            <Feather name="chevron-right" size={18} color="#8A96A6" />
          </Pressable>
        </View>

        <Text style={styles.sectionLabel}>PREFERENCES & PRIVACY</Text>
        <View style={styles.card}>
          <View style={[styles.rowItem, styles.rowBorder]}>
            <View style={styles.rowIconBox}>
              <Feather name="bell" size={18} color="#0F2840" />
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
              <Feather name="percent" size={18} color="#0F2840" />
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
              <Feather name="moon" size={18} color="#0F2840" />
            </View>
            <View style={styles.rowBody}>
              <Text style={styles.rowTitle}>Dark mode</Text>
              <Text style={styles.rowSub}>Follow system</Text>
            </View>
            <CustomToggle
              value={preferences.darkMode}
              onToggle={() => togglePref('darkMode')}
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
              <Feather name="trash-2" size={18} color="#EF4444" />
            </View>
            <View style={styles.rowBody}>
              <Text style={[styles.rowTitle, {color: '#EF4444'}]}>
                Delete your account
              </Text>
              <Text style={styles.rowSub}>Permanent removal of data</Text>
            </View>
            <Feather name="chevron-right" size={18} color="#8A96A6" />
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
              <Feather name="trash-2" size={26} color="#DC2626" />
            </View>

            <Text style={styles.modalTitle}>Delete your Cabora account?</Text>
            <Text style={styles.modalSub}>
              {"This can't be undone. Here's exactly what happens:"}
            </Text>

            <View style={styles.modalInfoBox}>
              <View style={styles.modalInfoRow}>
                <Feather name="credit-card" size={17} color="#64748B" />
                <Text style={styles.modalInfoText}>
                  Your ₹1,240.00 wallet balance is forfeited
                </Text>
              </View>
              <View style={styles.modalInfoRow}>
                <Feather name="clock" size={17} color="#64748B" />
                <Text style={styles.modalInfoText}>
                  Ride history and receipts are erased
                </Text>
              </View>
              <View style={styles.modalInfoRow}>
                <Feather name="lock" size={17} color="#64748B" />
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
