import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import {Feather} from '@react-native-vector-icons/feather/static';
import {Lucide} from '@react-native-vector-icons/lucide/static';
import {MaterialDesignIcons} from '@react-native-vector-icons/material-design-icons/static';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useToast} from '../../components/Toast';
import ConfirmDialog from '../../components/ConfirmDialog';
import useThemedStyles from '../../components/useThemedStyles';
import {useApp} from '../../context/AppContext';
import createStyles from './style';

const CONTACTS = [
  {
    id: 'c1',
    initials: 'PM',
    name: 'Priya Menon',
    meta: 'Sister · +91 98200 11223',
  },
  {
    id: 'c2',
    initials: 'VM',
    name: 'Vikram Mehta',
    meta: 'Father · +91 99450 88112',
  },
];

const QUICK = [
  {id: 'police', label: 'Police', sub: '100', icon: 'siren', dial: '100'},
  {
    id: 'ambulance',
    label: 'Ambulance',
    sub: '108',
    icon: 'phone',
    dial: '108',
  },
  {
    id: 'safety',
    label: 'Cabora',
    sub: 'Safety',
    icon: 'headset',
    dial: null,
  },
];

const HOLD_MS = 3000;

function formatElapsed(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return `${m}:${s}`;
}

function formatClock(date) {
  let h = date.getHours();
  const m = String(date.getMinutes()).padStart(2, '0');
  const sec = String(date.getSeconds()).padStart(2, '0');
  const ampm = h >= 12 ? 'pm' : 'am';
  h = h % 12 || 12;
  return `${h}:${m}:${sec} ${ampm}`;
}

export default function EmergencyScreen({
  visible,
  onClose,
  locationLine = 'Hosur Road, near Silk Board flyover',
  locationMeta = 'Accurate to 8 m · KA 05 MJ 4821 · Rajesh Kumar',
}) {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);
  const {colors} = useApp();
  const {showToast} = useToast();
  const [phase, setPhase] = useState('idle'); // idle | alerted
  const [holding, setHolding] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [cancelAlertOpen, setCancelAlertOpen] = useState(false);
  const [alertTimes, setAlertTimes] = useState({
    location: '',
    contact: '',
  });
  const holdTimer = useRef(null);
  const holdStart = useRef(0);
  const tickRef = useRef(null);

  useEffect(() => {
    if (!visible) {
      clearHold();
      if (tickRef.current) {
        clearInterval(tickRef.current);
        tickRef.current = null;
      }
      setPhase('idle');
      setElapsed(0);
      setCancelAlertOpen(false);
      setAlertTimes({location: '', contact: ''});
    }
  }, [visible]);

  useEffect(() => {
    if (phase !== 'alerted') {
      return undefined;
    }
    setElapsed(0);
    tickRef.current = setInterval(() => {
      setElapsed(v => v + 1);
    }, 1000);
    return () => {
      if (tickRef.current) {
        clearInterval(tickRef.current);
        tickRef.current = null;
      }
    };
  }, [phase]);

  const clearHold = () => {
    if (holdTimer.current) {
      clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
    setHolding(false);
  };

  const triggerAlert = () => {
    const now = new Date();
    const t1 = formatClock(now);
    const t2 = formatClock(new Date(now.getTime() + 2000));
    setAlertTimes({location: t1, contact: t2});
    setPhase('alerted');
    clearHold();
  };

  const startHold = () => {
    setHolding(true);
    holdStart.current = Date.now();
    holdTimer.current = setTimeout(() => {
      holdTimer.current = null;
      triggerAlert();
    }, HOLD_MS);
  };

  const endHold = () => {
    if (!holdTimer.current) {
      return;
    }
    const elapsedHold = Date.now() - holdStart.current;
    clearHold();
    if (elapsedHold < HOLD_MS) {
      showToast({
        type: 'info',
        message: 'Hold for 3 seconds to alert safety',
      });
    }
  };

  const dial = number => {
    if (!number) {
      showToast({type: 'info', message: 'Connecting to Cabora Safety…'});
      return;
    }
    Linking.openURL(`tel:${number}`).catch(() => {
      showToast({type: 'error', message: `Could not dial ${number}`});
    });
  };

  const openCancelAlertModal = () => {
    setCancelAlertOpen(true);
  };

  const confirmCancelAlert = () => {
    setCancelAlertOpen(false);
    setPhase('idle');
    setElapsed(0);
    showToast({type: 'success', message: "Alert cancelled — glad you're safe"});
    onClose?.();
  };

  const isAlerted = phase === 'alerted';
  const rootBg = isAlerted ? colors.red.darkBg : colors.navy[950];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
      statusBarTranslucent>
      <View style={[styles.root, {backgroundColor: rootBg}]}>
        <StatusBar barStyle="light-content" backgroundColor={rootBg} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          bounces={false}
          contentContainerStyle={[
            styles.scroll,
            {
              paddingTop: insets.top + 8,
              paddingBottom: Math.max(insets.bottom, 16) + 8,
            },
          ]}>
          <View style={styles.headerRow}>
            <Pressable
              style={styles.closeBtn}
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Close emergency"
              hitSlop={8}>
              <Feather name="x" size={20} color={colors.white} />
            </Pressable>
            <Text style={styles.headerTitle}>Emergency</Text>
          </View>

          {!isAlerted ? (
            <>
              <View style={styles.sosBlock}>
                <Pressable
                  style={[styles.sosCircle, holding && styles.sosCircleHolding]}
                  onPressIn={startHold}
                  onPressOut={endHold}
                  accessibilityRole="button"
                  accessibilityLabel="Hold to alert SOS">
                  <MaterialDesignIcons
                    name="alarm-light-outline"
                    size={36}
                    color={colors.red[500]}
                  />
                  <Text style={styles.sosTitle}>SOS</Text>
                  <Text style={styles.sosHoldHint}>Hold to alert</Text>
                </Pressable>
                <Text style={styles.sosHeadline}>
                  Hold to alert Cabora safety
                </Text>
                <Text style={styles.sosBody}>
                  Press and hold for 3 seconds. We’ll share your live location,
                  driver and trip with our safety team.
                </Text>
              </View>

              <View style={styles.contactsCard}>
                <View style={styles.contactsHead}>
                  <Text style={styles.contactsLabel}>EMERGENCY CONTACTS</Text>
                  <Pressable
                    onPress={() =>
                      showToast({type: 'info', message: 'Manage contacts'})
                    }
                    hitSlop={8}>
                    <Text style={styles.manageText}>Manage</Text>
                  </Pressable>
                </View>
                {CONTACTS.map((contact, index) => (
                  <View
                    key={contact.id}
                    style={[
                      styles.contactRow,
                      index < CONTACTS.length - 1 && styles.contactRowBorder,
                    ]}>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>{contact.initials}</Text>
                    </View>
                    <View style={styles.contactCopy}>
                      <Text style={styles.contactName}>{contact.name}</Text>
                      <Text style={styles.contactMeta}>{contact.meta}</Text>
                    </View>
                    <View style={styles.checkWrap}>
                      <Feather name="check" size={12} color={colors.white} />
                    </View>
                  </View>
                ))}
              </View>
            </>
          ) : (
            <>
              <View style={styles.sosBlock}>
                <View style={styles.sosCircleAlerted}>
                  <MaterialDesignIcons
                    name="alarm-light-outline"
                    size={36}
                    color={colors.white}
                  />
                  <Text style={styles.sosTitleAlerted}>SOS</Text>
                  <Text style={styles.sosHoldHintAlerted}>
                    Alert sent · {formatElapsed(elapsed)}
                  </Text>
                </View>
                <Text style={styles.sosHeadline}>Help is on the way</Text>
                <Text style={styles.sosBodyAlerted}>
                  Our safety team is reviewing your trip live. Stay on this
                  screen if you can.
                </Text>
              </View>

              <View style={styles.statusCard}>
                <View style={styles.statusRow}>
                  <View style={styles.statusCheck}>
                    <Feather name="check" size={12} color={colors.white} />
                  </View>
                  <View style={styles.statusCopy}>
                    <Text style={styles.statusTitle}>
                      Live location shared with Cabora safety
                    </Text>
                    <Text style={styles.statusMeta}>
                      {alertTimes.location || '—'}
                    </Text>
                  </View>
                </View>
                <View style={styles.statusRow}>
                  <View style={styles.statusCheck}>
                    <Feather name="check" size={12} color={colors.white} />
                  </View>
                  <View style={styles.statusCopy}>
                    <Text style={styles.statusTitle}>
                      Priya Menon notified by SMS and call
                    </Text>
                    <Text style={styles.statusMeta}>
                      {alertTimes.contact || '—'}
                    </Text>
                  </View>
                </View>
                <View style={[styles.statusRow, styles.statusRowLast]}>
                  <View style={styles.statusSpinner}>
                    <ActivityIndicator size="small" color=colors.orange.gold />
                  </View>
                  <View style={styles.statusCopy}>
                    <Text style={styles.statusTitle}>
                      Connecting you to a safety agent
                    </Text>
                    <Text style={styles.statusMeta}>In progress</Text>
                  </View>
                </View>
              </View>
            </>
          )}

          <View style={styles.quickRow}>
            {QUICK.map(item => (
              <Pressable
                key={item.id}
                style={[styles.quickBtn, isAlerted && styles.quickBtnAlerted]}
                onPress={() => dial(item.dial)}
                accessibilityRole="button"
                accessibilityLabel={item.label}>
                {item.icon === 'siren' ? (
                  <MaterialDesignIcons
                    name="alarm-light-outline"
                    size={22}
                    color={colors.white}
                  />
                ) : item.icon === 'headset' ? (
                  <Lucide name="headphones" size={20} color={colors.white} />
                ) : (
                  <Feather name="phone" size={20} color={colors.white} />
                )}
                <Text style={styles.quickLabel}>{item.label}</Text>
                <Text style={styles.quickSub}>{item.sub}</Text>
              </Pressable>
            ))}
          </View>

          <View
            style={[
              styles.locationCard,
              isAlerted && styles.locationCardAlerted,
            ]}>
            <MaterialDesignIcons
              name="crosshairs-gps"
              size={20}
              color={colors.orange[500]}
            />
            <View style={styles.locationCopy}>
              <Text style={styles.locationTitle} numberOfLines={1}>
                {locationLine}
              </Text>
              <Text style={styles.locationMeta} numberOfLines={1}>
                {locationMeta}
              </Text>
            </View>
          </View>

          {!isAlerted ? (
            <Pressable
              style={styles.shareBtn}
              onPress={() =>
                showToast({
                  type: 'success',
                  message: 'Live location link ready to share',
                })
              }
              accessibilityRole="button"
              accessibilityLabel="Share live location instead">
              <Text style={styles.shareText}>Share live location instead</Text>
            </Pressable>
          ) : (
            <Pressable
              style={styles.shareBtn}
              onPress={openCancelAlertModal}
              accessibilityRole="button"
              accessibilityLabel="Cancel alert — I'm safe">
              <Text style={styles.shareText}>Cancel alert — I'm safe</Text>
            </Pressable>
          )}
        </ScrollView>
      </View>

      <ConfirmDialog
        visible={cancelAlertOpen}
        onClose={() => setCancelAlertOpen(false)}
        variant="danger"
        title="Cancel alert — I'm safe?"
        message="We'll stop the SOS alert and notify the safety team that you're okay."
        confirmLabel="Yes, I'm safe"
        cancelLabel="Keep alert on"
        onConfirm={confirmCancelAlert}
      />
    </Modal>
  );
}
