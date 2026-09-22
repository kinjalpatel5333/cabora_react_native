import React, {useMemo, useState} from 'react';
import {
  Dimensions,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Feather} from '@react-native-vector-icons/feather/static';
import {Lucide} from '@react-native-vector-icons/lucide/static';
import {MaterialDesignIcons} from '@react-native-vector-icons/material-design-icons/static';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useToast} from '../../components/Toast';
import useThemedStyles from '../../components/useThemedStyles';
import {useApp} from '../../context/AppContext';
import {getHomeTabBarInset} from '../../navigation/homeTabBarMetrics';
import ScheduleRideModal from '../ChooseRideScreen/ScheduleRideModal';
import PaymentOffersModal from '../ChooseRideScreen/PaymentOffersModal';
import createStyles from './style';

const SCREEN_W = Dimensions.get('window').width;
const H_PAD = 20;
const PLAN_GAP = 12;
const PLAN_CARD_W = (SCREEN_W - H_PAD * 2 - PLAN_GAP) / 2;

const RIDE_NOW = [
  {
    id: 'cab',
    label: 'Cab',
    meta: '4 seats · from ₹68',
    icon: 'car-side',
    badge: 'Most booked',
  },
  {
    id: 'auto',
    label: 'Auto',
    meta: '3 seats · from ₹48',
    icon: 'rickshaw',
  },
  {
    id: 'bike',
    label: 'Bike',
    meta: '1 seat · from ₹29',
    icon: 'motorbike',
  },
];

const PLAN_AHEAD = [
  {
    id: 'schedule',
    kicker: 'Book up to',
    title: 'Schedule a ride',
    icon: 'calendar',
  },
  {
    id: 'airport',
    kicker: 'Flight tracking and',
    title: 'Airport',
    icon: 'send',
  },
  {
    id: 'rentals',
    kicker: 'Keep the car',
    title: 'Rentals',
    icon: 'refresh-cw',
  },
  {
    id: 'outstation',
    kicker: 'One way or',
    title: 'Outstation',
    icon: 'route',
  },
];

function RideIcon({name, color}) {
  if (name === 'rickshaw' || name === 'motorbike' || name === 'car-side') {
    return <MaterialDesignIcons name={name} size={22} color={color} />;
  }
  return <Feather name="navigation" size={20} color={color} />;
}

function PlanIcon({name, color}) {
  if (name === 'calendar') {
    return <Lucide name="calendar-clock" size={18} color={color} />;
  }
  if (name === 'send') {
    return <Feather name="send" size={16} color={color} />;
  }
  if (name === 'refresh-cw') {
    return <Feather name="refresh-cw" size={16} color={color} />;
  }
  return <Lucide name="route" size={18} color={color} />;
}

export default function ServicesScreen() {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);
  const {colors} = useApp();
  const navigation = useNavigation();
  const {showToast} = useToast();
  const [query, setQuery] = useState('');
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState({
    id: 'hdfc',
    label: 'HDFC ....4821',
  });
  const tabInset = getHomeTabBarInset(insets);

  const rideItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return RIDE_NOW;
    }
    return RIDE_NOW.filter(
      item =>
        item.label.toLowerCase().includes(q) ||
        item.meta.toLowerCase().includes(q),
    );
  }, [query]);

  const planItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return PLAN_AHEAD;
    }
    return PLAN_AHEAD.filter(
      item =>
        item.title.toLowerCase().includes(q) ||
        item.kicker.toLowerCase().includes(q),
    );
  }, [query]);

  const showPortal = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return true;
    }
    return (
      q.includes('portal') ||
      q.includes('package') ||
      q.includes('send') ||
      'portal'.includes(q)
    );
  }, [query]);

  const onSelectService = (label, id) => {
    if (id === 'schedule') {
      setScheduleOpen(true);
      return;
    }
    if (id === 'airport') {
      navigation.navigate('AirportRide');
      return;
    }
    if (id === 'rentals') {
      navigation.navigate('Rentals');
      return;
    }
    if (id === 'outstation') {
      navigation.navigate('Outstation');
      return;
    }
    if (id === 'portal' || label === 'Portal') {
      navigation.navigate('Portal');
      return;
    }
    showToast({type: 'info', message: `${label} — opening booking`});
    navigation.navigate('Home');
  };

  return (
    <View style={styles.root}>
      <StatusBar
        barStyle={colors.barStyle}
        backgroundColor={colors.background}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.scroll,
          {
            paddingTop: insets.top + 8,
            paddingBottom: tabInset + 20,
          },
        ]}>
        <View style={styles.headerRow}>
          <View style={styles.headerCopy}>
            <Text style={styles.title}>All services</Text>
            <Text style={styles.subtitle}>
              Everything Cabora can do in your city
            </Text>
          </View>
          <View>
            <Pressable
              style={styles.bellBtn}
              accessibilityRole="button"
              accessibilityLabel="Notifications"
              onPress={() => navigation.navigate('Notifications')}>
              <Feather name="bell" size={20} color={colors.white} />
            </Pressable>
            <View style={styles.badge} pointerEvents="none">
              <Text style={styles.badgeText}>3</Text>
            </View>
          </View>
        </View>

        <View style={styles.searchBox}>
          <Feather name="search" size={18} color={colors.textMuted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search a service"
            placeholderTextColor={colors.textMuted}
            style={styles.searchInput}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
        </View>

        {rideItems.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>RIDE NOW</Text>
            <View style={styles.rideList}>
              {rideItems.map(item => (
                <Pressable
                  key={item.id}
                  style={styles.rideCard}
                  onPress={() => onSelectService(item.label, item.id)}
                  accessibilityRole="button"
                  accessibilityLabel={item.label}>
                  <View style={styles.rideIcon}>
                    <RideIcon name={item.icon} color={colors.orange[500]} />
                  </View>
                  <View style={styles.rideCopy}>
                    <Text style={styles.rideTitle}>{item.label}</Text>
                    <Text style={styles.rideMeta}>{item.meta}</Text>
                  </View>
                  {item.badge ? (
                    <View style={styles.rideBadge}>
                      <View style={styles.rideBadgeDot} />
                      <Text style={styles.rideBadgeText}>{item.badge}</Text>
                    </View>
                  ) : null}
                  <Feather
                    name="chevron-right"
                    size={18}
                    color={colors.textMuted}
                  />
                </Pressable>
              ))}
            </View>
          </View>
        ) : null}

        {planItems.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>PLAN AHEAD</Text>
            <View style={styles.planGrid}>
              {planItems.map(item => (
                <Pressable
                  key={item.id}
                  style={[styles.planCard, {width: PLAN_CARD_W}]}
                  onPress={() => onSelectService(item.title, item.id)}
                  accessibilityRole="button"
                  accessibilityLabel={item.title}>
                  <View style={styles.planTopRow}>
                    <View style={styles.planIcon}>
                      <PlanIcon name={item.icon} color={colors.isDark ? colors.white : colors.navy[800]} />
                    </View>
                    <Text style={styles.planKicker} numberOfLines={2}>
                      {item.kicker}
                    </Text>
                  </View>
                  <Text style={styles.planTitle} numberOfLines={2}>
                    {item.title}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        ) : null}

        {showPortal ? (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>SEND SOMETHING</Text>
            <Pressable
              style={styles.portalCard}
              onPress={() => onSelectService('Portal', 'portal')}
              accessibilityRole="button"
              accessibilityLabel="Portal">
              <View style={styles.portalIcon}>
                <Lucide name="briefcase" size={22} color={colors.isDark ? colors.orange[450] : colors.blue[600]} />
              </View>
              <View style={styles.portalCopy}>
                <View style={styles.portalTitleRow}>
                  <Text style={styles.portalTitle}>Portal</Text>
                  <View style={styles.newBadge}>
                    <View style={styles.newBadgeDot} />
                    <Text style={styles.newBadgeText}>New</Text>
                  </View>
                </View>
                <Text style={styles.portalBody} numberOfLines={2}>
                  Send a package across the city on a bike — picked up and
                  dropped for you.
                </Text>
              </View>
              <Feather
                name="chevron-right"
                size={18}
                color={colors.textMuted}
              />
            </Pressable>
          </View>
        ) : null}

        {!rideItems.length && !planItems.length && !showPortal ? (
          <Text style={styles.empty}>No services match “{query}”</Text>
        ) : null}
      </ScrollView>

      <ScheduleRideModal
        visible={scheduleOpen}
        onClose={() => setScheduleOpen(false)}
        paymentLabel={
          paymentMethod.id === 'card'
            ? 'HDFC ....4821'
            : paymentMethod.label.replace('•', '·')
        }
        onChangePayment={() => setPaymentOpen(true)}
        onConfirm={({time, vehicle}) => {
          setScheduleOpen(false);
          showToast({
            type: 'success',
            message: `${vehicle?.name || 'Ride'} scheduled for ${time}!`,
          });
        }}
      />

      <PaymentOffersModal
        visible={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        selectedId={paymentMethod.id}
        onSave={method => {
          setPaymentMethod({id: method.id, label: method.label});
        }}
      />
    </View>
  );
}
