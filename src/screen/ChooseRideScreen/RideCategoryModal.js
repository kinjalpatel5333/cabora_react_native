import React, {useEffect, useMemo, useState} from 'react';
import {
  Animated,
  Dimensions,
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
import useDraggableSheet from '../../hooks/useDraggableSheet';
import createStyles from './rideCategoryStyle';

const PROMO_OFF = 50;

export const CATEGORY_LISTS = {
  cab: {
    id: 'cab',
    title: 'Choose a ride',
    distanceKm: '39.7 km',
    durationMins: '52 mins',
    rides: [
      {
        id: 'cab-mini',
        name: 'Cab Mini',
        seats: 4,
        blurb: 'Budget friendly',
        price: 736,
        icon: 'car-hatchback',
      },
      {
        id: 'cab-priority',
        name: 'Cab Priority',
        seats: 4,
        blurb: 'Fast pickup',
        price: 815,
        icon: 'car-side',
      },
      {
        id: 'cab-sedan',
        name: 'Cab Sedan',
        seats: 4,
        blurb: 'Extra comfort',
        price: 920,
        icon: 'car-side',
      },
      {
        id: 'cab-xl',
        name: 'Cab XL',
        seats: 6,
        blurb: 'More space',
        price: 1133,
        icon: 'van-passenger',
      },
    ],
    bookAny: {
      id: 'book-any',
      name: 'Book Any',
      seats: '4-6',
      blurb: 'Fastest match',
      priceMin: 736,
      priceMax: 1133,
      icon: 'car-estate',
      defaultChips: ['cab-mini', 'cab-priority', 'cab-sedan'],
    },
  },
  auto: {
    id: 'auto',
    title: 'Choose a ride',
    distanceKm: '14.2 km',
    durationMins: '38 mins',
    rides: [
      {
        id: 'auto-shared',
        name: 'Auto Share',
        seats: 2,
        blurb: 'Lowest fare',
        price: 72,
        icon: 'rickshaw',
      },
      {
        id: 'auto-regular',
        name: 'Auto',
        seats: 3,
        blurb: 'Nearby · 2 min',
        price: 96,
        icon: 'rickshaw',
      },
      {
        id: 'auto-priority',
        name: 'Auto Priority',
        seats: 3,
        blurb: 'Faster pickup',
        price: 118,
        icon: 'rickshaw',
      },
    ],
    bookAny: {
      id: 'book-any',
      name: 'Book Any',
      seats: '2-3',
      blurb: 'Fastest match',
      priceMin: 72,
      priceMax: 118,
      icon: 'rickshaw',
      defaultChips: ['auto-shared', 'auto-regular'],
    },
  },
  bike: {
    id: 'bike',
    title: 'Choose a ride',
    distanceKm: '8.4 km',
    durationMins: '22 mins',
    rides: [
      {
        id: 'bike-eco',
        name: 'Bike Eco',
        seats: 1,
        blurb: 'Best value',
        price: 42,
        icon: 'motorbike',
      },
      {
        id: 'bike-fast',
        name: 'Bike',
        seats: 1,
        blurb: 'Fastest · 1 min',
        price: 58,
        icon: 'motorbike',
      },
      {
        id: 'bike-plus',
        name: 'Bike Plus',
        seats: 1,
        blurb: 'Helmet included',
        price: 74,
        icon: 'motorbike',
      },
    ],
    bookAny: {
      id: 'book-any',
      name: 'Book Any',
      seats: '1',
      blurb: 'Fastest match',
      priceMin: 42,
      priceMax: 74,
      icon: 'motorbike',
      defaultChips: ['bike-eco', 'bike-fast'],
    },
  },
};

function RideGlyph({icon, color, size = 24}) {
  return <MaterialDesignIcons name={icon} size={size} color={color} />;
}

export default function RideCategoryModal({
  visible,
  onClose,
  categoryId = 'cab',
  promoCode = 'CABORA50',
  paymentLabel = 'UPI · you@okaxis',
  onChangePayment,
  onBook,
}) {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);
  const {colors} = useApp();
  const category = CATEGORY_LISTS[categoryId] || CATEGORY_LISTS.cab;

  const [selectedId, setSelectedId] = useState(category.bookAny.id);
  const [chips, setChips] = useState(category.bookAny.defaultChips);

  useEffect(() => {
    if (!visible) {
      return;
    }
    const cat = CATEGORY_LISTS[categoryId] || CATEGORY_LISTS.cab;
    setSelectedId(cat.bookAny.id);
    setChips(cat.bookAny.defaultChips);
  }, [visible, categoryId]);

  const selectedRide = useMemo(() => {
    if (selectedId === category.bookAny.id) {
      return category.bookAny;
    }
    return (
      category.rides.find(item => item.id === selectedId) || category.rides[0]
    );
  }, [selectedId, category]);

  const isBookAny = selectedId === category.bookAny.id;

  const totalLabel = isBookAny
    ? `₹${category.bookAny.priceMin - PROMO_OFF} – ₹${
        category.bookAny.priceMax - PROMO_OFF
      }`
    : `₹${Math.max(0, (selectedRide.price || 0) - PROMO_OFF)}`;

  const bookLabel = isBookAny
    ? `Book ${
        category.rides.find(r => r.id === chips[chips.length - 1])?.name ||
        category.rides[0].name
      }`
    : `Book ${selectedRide.name}`;

  const toggleChip = id => {
    setSelectedId(category.bookAny.id);
    setChips(prev => {
      if (prev.includes(id)) {
        if (prev.length === 1) {
          return prev;
        }
        return prev.filter(item => item !== id);
      }
      return [...prev, id];
    });
  };

  const sheetMaxH = Dimensions.get('window').height * 0.78;
  const {sheetTY, panHandlers, toggle, expanded, onSheetLayout} =
    useDraggableSheet({
      peekHeight: 220,
      visible,
    });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent>
      <View style={styles.root} pointerEvents="box-none">
        <Pressable style={styles.backdrop} onPress={onClose} />

        <Animated.View
          onLayout={onSheetLayout}
          style={[
            styles.sheet,
            {
              maxHeight: sheetMaxH,
              paddingBottom: Math.max(insets.bottom, 10) + 8,
              transform: [{translateY: sheetTY}],
            },
          ]}>
          <View {...panHandlers}>
            <Pressable
              onPress={toggle}
              accessibilityRole="button"
              accessibilityLabel={expanded ? 'Collapse sheet' : 'Expand sheet'}
              style={styles.grabberHit}>
              <View style={styles.grabber} />
            </Pressable>
          </View>

          <View style={styles.headerRow}>
            <Text style={styles.title}>{category.title}</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <MaterialDesignIcons
                  name="map-marker-path"
                  size={15}
                  color={colors.muted}
                />
                <Text style={styles.statText}>{category.distanceKm}</Text>
              </View>
              <View style={styles.statItem}>
                <Feather name="clock" size={14} color={colors.muted} />
                <Text style={styles.statText}>{category.durationMins}</Text>
              </View>
            </View>
          </View>

          <Text style={styles.sectionLabel}>RIDES FOR YOU</Text>

          <ScrollView
            showsVerticalScrollIndicator={false}
            bounces={false}
            style={styles.list}
            contentContainerStyle={styles.listContent}>
            {category.rides.map(ride => {
              const active = selectedId === ride.id;
              const tint = active ? colors.orange[500] : colors.text;
              return (
                <Pressable
                  key={ride.id}
                  onPress={() => setSelectedId(ride.id)}
                  style={[styles.rideRow, active && styles.rideRowActive]}>
                  <View
                    style={[styles.rideIcon, active && styles.rideIconActive]}>
                    <RideGlyph icon={ride.icon} color={tint} />
                  </View>
                  <View style={styles.rideCopy}>
                    <Text style={styles.rideName}>{ride.name}</Text>
                    <View style={styles.rideMetaRow}>
                      <Feather name="user" size={12} color={colors.muted} />
                      <Text style={styles.rideMeta}>
                        {ride.seats} · {ride.blurb}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.ridePrice}>₹{ride.price}</Text>
                </Pressable>
              );
            })}

            <Pressable
              onPress={() => setSelectedId(category.bookAny.id)}
              style={[
                styles.bookAnyCard,
                isBookAny && styles.bookAnyCardActive,
              ]}>
              <View style={styles.bookAnyTop}>
                <View
                  style={[
                    styles.rideIcon,
                    isBookAny && styles.rideIconActive,
                  ]}>
                  <RideGlyph
                    icon={category.bookAny.icon}
                    color={
                      isBookAny ? colors.orange[500] : colors.text
                    }
                  />
                </View>
                <View style={styles.rideCopy}>
                  <Text style={styles.rideName}>{category.bookAny.name}</Text>
                  <View style={styles.rideMetaRow}>
                    <Feather name="user" size={12} color={colors.muted} />
                    <Text style={styles.rideMeta}>
                      {category.bookAny.seats}
                    </Text>
                    <View style={styles.bookAnyBadge}>
                      <Text style={styles.bookAnyBadgeText}>
                        {category.bookAny.blurb}
                      </Text>
                    </View>
                  </View>
                </View>
                <Text style={styles.ridePrice}>
                  ₹{category.bookAny.priceMin} – ₹{category.bookAny.priceMax}
                </Text>
              </View>

              <View style={styles.chipRow}>
                {category.rides.map(ride => {
                  const on = chips.includes(ride.id);
                  return (
                    <Pressable
                      key={ride.id}
                      onPress={() => toggleChip(ride.id)}
                      style={[styles.chip, on && styles.chipOn]}>
                      <Feather
                        name={on ? 'check' : 'plus'}
                        size={12}
                        color={on ? colors.orange[500] : colors.muted}
                      />
                      <Text
                        style={[styles.chipText, on && styles.chipTextOn]}>
                        {on ? ride.name : `+ ${ride.name}`}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </Pressable>
          </ScrollView>

          <View style={styles.metaRow}>
            <View style={styles.metaIcon}>
              <MaterialDesignIcons
                name="currency-inr"
                size={18}
                color={colors.text}
              />
            </View>
            <Text style={[styles.metaText, styles.metaCopy]} numberOfLines={1}>
              {paymentLabel}
            </Text>
            <Pressable hitSlop={8} onPress={onChangePayment}>
              <Text style={styles.changeText}>Change</Text>
            </Pressable>
          </View>

          <View style={[styles.metaRow, {borderTopWidth: 0, paddingTop: 0}]}>
            <View style={[styles.metaIcon, styles.metaIconPromo]}>
              <Feather name="percent" size={16} color={colors.green[600]} />
            </View>
            <Text
              style={[styles.metaText, styles.metaTextPromo, styles.metaCopy]}
              numberOfLines={1}>
              {promoCode} applied
            </Text>
            <Text style={styles.promoAmount}>- ₹{PROMO_OFF}</Text>
          </View>

          <View style={styles.footer}>
            <View style={styles.totalCol}>
              <Text style={styles.totalLabel}>TOTAL</Text>
              <Text style={styles.totalValue}>{totalLabel}</Text>
            </View>
            <Pressable
              style={styles.bookBtn}
              onPress={() => {
                const name = isBookAny
                  ? category.rides.find(r => chips.includes(r.id))?.name ||
                    selectedRide.name
                  : selectedRide.name;
                const price = isBookAny
                  ? category.bookAny.priceMin
                  : selectedRide.price;
                onBook?.({
                  rideName: name,
                  rideId: selectedId,
                  categoryId,
                  total: Math.max(0, price - PROMO_OFF),
                  chips: isBookAny ? chips : undefined,
                });
              }}>
              <Text style={styles.bookText}>{bookLabel}</Text>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

/** Maps first-screen ride card → category list id */
export function categoryFromRideId(rideId) {
  if (rideId === 'bike') {
    return 'bike';
  }
  if (rideId === 'auto') {
    return 'auto';
  }
  return 'cab';
}
