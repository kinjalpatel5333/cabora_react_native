import React, {useEffect, useMemo, useState} from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import {Feather} from '@react-native-vector-icons/feather/static';
import {MaterialDesignIcons} from '@react-native-vector-icons/material-design-icons/static';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import useThemedStyles from '../../components/useThemedStyles';
import {useApp} from '../../context/AppContext';
import createStyles from './ridesForYouStyle';
import colors from '../../config/color';

const PROMO_OFF = 50;

export const CATEGORY_RIDES = {
  cab: [
    {
      id: 'mini',
      name: 'Cab Mini',
      seats: 4,
      desc: 'Budget friendly',
      price: 736,
      icon: 'car-hatchback',
    },
    {
      id: 'priority',
      name: 'Cab Priority',
      seats: 4,
      desc: 'Fast pickup',
      price: 815,
      icon: 'car-side',
    },
    {
      id: 'sedan',
      name: 'Cab Sedan',
      seats: 4,
      desc: 'Plush rides',
      price: 895,
      icon: 'car-side',
    },
    {
      id: 'xl',
      name: 'Cab XL',
      seats: 6,
      desc: 'Spacious rides',
      price: 1133,
      icon: 'car-estate',
    },
  ],
  auto: [
    {
      id: 'auto',
      name: 'Auto',
      seats: 3,
      desc: 'Everyday rides',
      price: 96,
      icon: 'rickshaw',
    },
    {
      id: 'auto-xl',
      name: 'Auto XL',
      seats: 4,
      desc: 'Extra space',
      price: 128,
      icon: 'rickshaw',
    },
    {
      id: 'auto-ac',
      name: 'Auto AC',
      seats: 3,
      desc: 'Cooler trips',
      price: 145,
      icon: 'rickshaw',
    },
    {
      id: 'auto-priority',
      name: 'Auto Priority',
      seats: 3,
      desc: 'Fastest match',
      price: 168,
      icon: 'rickshaw',
    },
  ],
  bike: [
    {
      id: 'bike',
      name: 'Bike',
      seats: 1,
      desc: 'Fastest',
      price: 58,
      icon: 'motorbike',
    },
    {
      id: 'bike-xl',
      name: 'Bike XL',
      seats: 1,
      desc: 'Parcel friendly',
      price: 72,
      icon: 'motorbike',
    },
    {
      id: 'bike-priority',
      name: 'Bike Priority',
      seats: 1,
      desc: 'Quick match',
      price: 85,
      icon: 'motorbike',
    },
    {
      id: 'bike-plus',
      name: 'Bike Plus',
      seats: 1,
      desc: 'Helmet included',
      price: 99,
      icon: 'motorbike',
    },
  ],
};

const CATEGORY_META = {
  cab: {label: 'Cab', distance: '39.7 km', duration: '52 mins'},
  auto: {label: 'Auto', distance: '8.4 km', duration: '24 mins'},
  bike: {label: 'Bike', distance: '6.2 km', duration: '18 mins'},
};

function formatRange(min, max) {
  if (min === max) {
    return `₹${min}`;
  }
  return `₹${min} – ₹${max}`;
}

export default function RidesForYouModal({
  visible,
  onClose,
  category = 'cab',
  paymentLabel = 'UPI · you@okaxis',
  promoCode = 'CABORA50',
  onChangePayment,
  onConfirm,
}) {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);
  const {colors} = useApp();

  const rides = CATEGORY_RIDES[category] || CATEGORY_RIDES.cab;
  const meta = CATEGORY_META[category] || CATEGORY_META.cab;

  const [selectedId, setSelectedId] = useState(rides[0]?.id);
  const [bookAny, setBookAny] = useState(true);
  const [anyIds, setAnyIds] = useState(() =>
    rides.slice(0, Math.max(rides.length - 1, 1)).map(r => r.id),
  );

  useEffect(() => {
    if (!visible) {
      return;
    }
    const next = CATEGORY_RIDES[category] || CATEGORY_RIDES.cab;
    setSelectedId(next[0]?.id);
    setBookAny(true);
    setAnyIds(next.slice(0, Math.max(next.length - 1, 1)).map(r => r.id));
  }, [visible, category]);

  const selectedRide = useMemo(
    () => rides.find(r => r.id === selectedId) || rides[0],
    [rides, selectedId],
  );

  const anyRides = useMemo(
    () => rides.filter(r => anyIds.includes(r.id)),
    [rides, anyIds],
  );

  const priceMin = bookAny
    ? Math.min(...(anyRides.length ? anyRides : rides).map(r => r.price))
    : selectedRide?.price || 0;
  const priceMax = bookAny
    ? Math.max(...(anyRides.length ? anyRides : rides).map(r => r.price))
    : selectedRide?.price || 0;

  const totalMin = Math.max(0, priceMin - PROMO_OFF);
  const totalMax = Math.max(0, priceMax - PROMO_OFF);
  const totalLabel = formatRange(totalMin, totalMax);

  const bookLabel = bookAny
    ? `Book Any ${meta.label}`
    : `Book ${selectedRide?.name || meta.label}`;

  const toggleAnyId = id => {
    setAnyIds(prev => {
      if (prev.includes(id)) {
        if (prev.length === 1) {
          return prev;
        }
        return prev.filter(x => x !== id);
      }
      return [...prev, id];
    });
    setBookAny(true);
  };

  const onBook = () => {
    const chosen = bookAny
      ? anyRides[0] || selectedRide
      : selectedRide;
    onConfirm?.({
      rideId: bookAny ? `any-${category}` : chosen.id,
      rideName: bookAny ? `Any ${meta.label}` : chosen.name,
      category,
      price: chosen.price,
      total: Math.max(0, chosen.price - PROMO_OFF),
      priceMin: totalMin,
      priceMax: totalMax,
      bookAny,
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      presentationStyle="overFullScreen"
      onRequestClose={onClose}
      statusBarTranslucent>
      <View style={[styles.root, {paddingBottom: Math.max(insets.bottom, 12)}]}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.card}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Choose a ride</Text>
              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <Feather name="navigation" size={13} color={colors.muted} />
                  <Text style={styles.metaText}>{meta.distance}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Feather name="clock" size={13} color={colors.muted} />
                  <Text style={styles.metaText}>{meta.duration}</Text>
                </View>
              </View>
            </View>
            <Pressable style={styles.closeBtn} onPress={onClose} hitSlop={8}>
              <Feather name="x" size={18} color={colors.text} />
            </Pressable>
          </View>

          <Text style={styles.sectionLabel}>RIDES FOR YOU</Text>

          <ScrollView
            style={styles.list}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            bounces={false}>
            {rides.map(ride => {
              const active = !bookAny && selectedId === ride.id;
              const tint = active ? colors.orange[500] : colors.text;
              return (
                <Pressable
                  key={ride.id}
                  onPress={() => {
                    setBookAny(false);
                    setSelectedId(ride.id);
                  }}
                  style={[styles.rideRow, active && styles.rideRowActive]}>
                  <View
                    style={[
                      styles.rideIcon,
                      active && styles.rideIconActive,
                    ]}>
                    <MaterialDesignIcons
                      name={ride.icon}
                      size={24}
                      color={tint}
                    />
                  </View>
                  <View style={styles.rideCopy}>
                    <Text style={styles.rideName}>{ride.name}</Text>
                    <View style={styles.rideMeta}>
                      <Feather
                        name="user"
                        size={12}
                        color={colors.muted}
                      />
                      <Text style={styles.rideMetaText}>
                        {ride.seats} · {ride.desc}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.ridePrice}>₹{ride.price}</Text>
                </Pressable>
              );
            })}

            <Pressable
              onPress={() => setBookAny(true)}
              style={[styles.bookAnyCard, !bookAny && {opacity: 0.92}]}>
              <View style={styles.bookAnyTop}>
                <View
                  style={[
                    styles.rideIcon,
                    styles.rideIconActive,
                    {marginRight: 12},
                  ]}>
                  <MaterialDesignIcons
                    name="lightning-bolt"
                    size={22}
                    color={colors.orange[500]}
                  />
                </View>
                <View style={styles.bookAnyCopy}>
                  <Text style={styles.bookAnyName}>Book Any</Text>
                  <View style={styles.rideMeta}>
                    <Feather name="user" size={12} color={colors.muted} />
                    <Text style={styles.rideMetaText}>
                      {category === 'bike' ? '1' : category === 'auto' ? '3-4' : '4-6'}{' '}
                      · Fastest match
                    </Text>
                  </View>
                </View>
                <Text style={styles.bookAnyRange}>
                  {formatRange(priceMin, priceMax)}
                </Text>
              </View>

              <View style={styles.pills}>
                {rides.map(ride => {
                  const on = anyIds.includes(ride.id);
                  return (
                    <Pressable
                      key={`pill-${ride.id}`}
                      onPress={() => toggleAnyId(ride.id)}
                      style={[styles.pill, on && styles.pillOn]}>
                      <MaterialDesignIcons
                        name={on ? 'check' : 'plus'}
                        size={14}
                        color={on ? colors.orange[500] : colors.text}
                      />
                      <Text
                        style={[styles.pillText, on && styles.pillTextOn]}>
                        {ride.name}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </Pressable>
          </ScrollView>

          <View style={styles.footer}>
            <View style={styles.payRow}>
              <View style={styles.payIcon}>
                <MaterialDesignIcons
                  name="currency-inr"
                  size={16}
                  color={colors.text}
                />
              </View>
              <Text style={styles.payText} numberOfLines={1}>
                {paymentLabel}
              </Text>
              <Pressable hitSlop={8} onPress={onChangePayment}>
                <Text style={styles.changeText}>Change</Text>
              </Pressable>
            </View>

            <View style={styles.promoRow}>
              <View style={styles.promoIcon}>
                <Feather name="percent" size={14} color={colors.green[600]} />
              </View>
              <Text style={styles.promoText}>{promoCode} applied</Text>
              <Text style={styles.promoAmount}>- ₹{PROMO_OFF}</Text>
            </View>

            <View style={styles.bookRow}>
              <View style={styles.totalCol}>
                <Text style={styles.totalLabel}>TOTAL</Text>
                <Text style={styles.totalValue}>{totalLabel}</Text>
              </View>
              <Pressable style={styles.bookBtn} onPress={onBook}>
                <Text style={styles.bookText}>{bookLabel}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
