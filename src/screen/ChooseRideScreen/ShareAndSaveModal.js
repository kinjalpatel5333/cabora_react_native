import React, {useEffect, useState} from 'react';
import {Animated, Dimensions, Modal, ScrollView, Text, View, TouchableOpacity} from 'react-native';
import {Feather} from '@react-native-vector-icons/feather/static';
import {MaterialDesignIcons} from '@react-native-vector-icons/material-design-icons/static';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import useThemedStyles from '../../components/useThemedStyles';
import {useApp} from '../../context/AppContext';
import useDraggableSheet from '../../hooks/useDraggableSheet';
import createStyles from './shareAndSaveStyle';

export const CATEGORY_DATA = {
  cab: {
    pool: {
      id: 'pool',
      name: 'Wagvaa Pool',
      subtitle: 'Up to 2 co-riders · door to door',
      price1Seat: 412,
      price2Seats: 515,
      savePercent: 'save 44%',
      detourNote: 'Up to 8 minutes of detour to pick up others',
      timeNote: 'Pool is only on this route between 07:00 and 22:00.',
    },
    soloRides: [
      {
        id: 'cab-mini',
        name: 'Cab Mini',
        seats: 4,
        price: 736,
        icon: 'car-hatchback',
      },
      {
        id: 'cab-sedan',
        name: 'Cab Sedan',
        seats: 4,
        price: 895,
        icon: 'car-side',
      },
    ],
  },
  auto: {
    pool: {
      id: 'pool',
      name: 'Auto Share',
      subtitle: 'Up to 2 co-riders · door to door',
      price1Seat: 52,
      price2Seats: 72,
      savePercent: 'save 35%',
      detourNote: 'Up to 5 minutes of detour to pick up others',
      timeNote: 'Share is only on this route between 07:00 and 22:00.',
    },
    soloRides: [
      {
        id: 'auto-regular',
        name: 'Auto',
        seats: 3,
        price: 96,
        icon: 'rickshaw',
      },
      {
        id: 'auto-priority',
        name: 'Auto Priority',
        seats: 3,
        price: 118,
        icon: 'rickshaw',
      },
    ],
  },
  bike: {
    pool: {
      id: 'pool',
      name: 'Bike Eco',
      subtitle: 'Single rider · eco-friendly',
      price1Seat: 42,
      price2Seats: 42,
      savePercent: 'save 20%',
      detourNote: 'Direct express route',
      timeNote: 'Available 24/7 on this route.',
    },
    soloRides: [
      {
        id: 'bike-fast',
        name: 'Bike',
        seats: 1,
        price: 58,
        icon: 'motorbike',
      },
      {
        id: 'bike-plus',
        name: 'Bike Plus',
        seats: 1,
        price: 74,
        icon: 'motorbike',
      },
    ],
  },
};

export default function ShareAndSaveModal({
  visible,
  onClose,
  categoryId = 'cab',
  initialSelectedId = 'pool',
  routeSummary = '14.2 km · 38 min · via Airport Rd',
  promoCode = 'WAGVAA50',
  promoDiscount = 50,
  paymentLabel = 'UPI · you@okaxis',
  onChangePayment,
  onRemovePromo,
  onOpenOffers,
  onBook,
}) {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);
  const {colors: themeColors} = useApp();

  const data = CATEGORY_DATA[categoryId] || CATEGORY_DATA.cab;
  const [selectedRideId, setSelectedRideId] = useState('pool');
  const [seatsCount, setSeatsCount] = useState(1);

  useEffect(() => {
    if (visible) {
      setSelectedRideId(initialSelectedId || 'pool');
      setSeatsCount(1);
    }
  }, [visible, initialSelectedId, categoryId]);

  const isPool = selectedRideId === 'pool';
  const selectedSolo = data.soloRides.find(r => r.id === selectedRideId);

  // Price calculation
  let currentPrice = data.pool.price1Seat;
  let bookButtonTitle = `Book ${data.pool.name}`;

  if (isPool) {
    currentPrice = seatsCount === 2 ? data.pool.price2Seats : data.pool.price1Seat;
    bookButtonTitle = `Book ${data.pool.name}`;
  } else if (selectedSolo) {
    currentPrice = selectedSolo.price;
    bookButtonTitle = `Book ${selectedSolo.name}`;
  }

  const sheetMaxH = Dimensions.get('window').height * 0.78;
  const {sheetTY, panHandlers, toggle, expanded, snapTo, onSheetLayout} =
    useDraggableSheet({
      peekHeight: 240,
      visible,
    });

  const handleBackdropPress = () => {
    snapTo(!expanded);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent>
      <View style={styles.root} pointerEvents="box-none">
        <TouchableOpacity
          activeOpacity={1}
          style={styles.backdrop}
          onPress={handleBackdropPress}
        />

        {/* Top bar with back button & route pill over map */}
        <View style={[styles.topBar, {top: insets.top + 10}]}>
          <TouchableOpacity
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={onClose}
            hitSlop={10}
            style={styles.backBtn}>
            <Feather name="arrow-left" size={22} color={themeColors.text} />
          </TouchableOpacity>

          <View style={styles.routePill}>
            <MaterialDesignIcons
              name="directions-fork"
              size={18}
              color={themeColors.orange[500]}
            />
            <Text style={styles.routePillText} numberOfLines={1}>
              {routeSummary}
            </Text>
          </View>
        </View>

        {/* Bottom Sheet */}
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
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={toggle}
              accessibilityRole="button"
              accessibilityLabel={expanded ? 'Collapse sheet' : 'Expand sheet'}
              style={styles.grabberHit}>
              <View style={styles.grabber} />
            </TouchableOpacity>
          </View>

          {/* Header */}
          <View style={styles.headerRow}>
            <Text style={styles.title}>Share and save</Text>
            <Text style={styles.subtitle}>
              We match you with riders going the same way
            </Text>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            bounces={false}
            style={styles.list}
            contentContainerStyle={styles.listContent}>
            {/* Featured Wagvaa Pool Card */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setSelectedRideId('pool')}
              style={[
                styles.poolCard,
                isPool && styles.poolCardActive,
              ]}>
              <View style={styles.poolTopRow}>
                <View style={styles.poolIconBox}>
                  <MaterialDesignIcons
                    name="account-group"
                    size={26}
                    color={themeColors.orange[500]}
                  />
                </View>
                <View style={styles.poolCopy}>
                  <Text style={styles.poolTitle}>{data.pool.name}</Text>
                  <Text style={styles.poolSub}>{data.pool.subtitle}</Text>
                </View>
                <View style={styles.poolPriceCol}>
                  <Text style={styles.poolPrice}>
                    ₹{seatsCount === 2 ? data.pool.price2Seats : data.pool.price1Seat}
                  </Text>
                  <Text style={styles.poolSaveText}>{data.pool.savePercent}</Text>
                </View>
              </View>

              <View style={styles.poolDivider} />

              <Text style={styles.seatsLabel}>SEATS YOU NEED</Text>
              <View style={styles.seatsRow}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    setSelectedRideId('pool');
                    setSeatsCount(1);
                  }}
                  style={[
                    styles.seatChip,
                    isPool && seatsCount === 1 && styles.seatChipActive,
                  ]}>
                  <Text
                    style={[
                      styles.seatChipText,
                      isPool && seatsCount === 1 && styles.seatChipTextActive,
                    ]}>
                    1 seat
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    setSelectedRideId('pool');
                    setSeatsCount(2);
                  }}
                  style={[
                    styles.seatChip,
                    isPool && seatsCount === 2 && styles.seatChipActive,
                  ]}>
                  <Text
                    style={[
                      styles.seatChipText,
                      isPool && seatsCount === 2 && styles.seatChipTextActive,
                    ]}>
                    2 seats
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.detourNoteRow}>
                <MaterialDesignIcons
                  name="information"
                  size={15}
                  color={themeColors.isDark ? themeColors.orange[400] : themeColors.orange[800]}
                />
                <Text style={styles.detourNoteText}>
                  {data.pool.detourNote}
                </Text>
              </View>
            </TouchableOpacity>

            {/* OR RIDE ALONE section */}
            <Text style={styles.sectionLabel}>OR RIDE ALONE</Text>

            {data.soloRides.map(ride => {
              const active = selectedRideId === ride.id;
              return (
                <TouchableOpacity
                  activeOpacity={0.85}
                  key={ride.id}
                  onPress={() => setSelectedRideId(ride.id)}
                  style={[
                    styles.soloCard,
                    active && styles.soloCardActive,
                  ]}>
                  <View
                    style={[
                      styles.soloIconBox,
                      active && styles.soloIconBoxActive,
                    ]}>
                    <MaterialDesignIcons
                      name={ride.icon}
                      size={24}
                      color={active ? themeColors.orange[500] : themeColors.text}
                    />
                  </View>
                  <View style={styles.soloCopy}>
                    <Text style={styles.soloTitle}>{ride.name}</Text>
                    <View style={styles.soloMetaRow}>
                      <MaterialDesignIcons
                        name="account-multiple"
                        size={14}
                        color={themeColors.textMuted}
                      />
                      <Text style={styles.soloMeta}>{ride.seats}</Text>
                    </View>
                  </View>
                  <Text style={styles.soloPrice}>₹{ride.price}</Text>
                </TouchableOpacity>
              );
            })}

            {/* Info Banner */}
            <View style={styles.infoBanner}>
              <MaterialDesignIcons
                name="information"
                size={16}
                color={themeColors.isDark ? themeColors.blue[400] : themeColors.blue[600]}
              />
              <Text style={styles.infoBannerText}>
                {data.pool.timeNote}
              </Text>
            </View>
          </ScrollView>

          {/* Payment Method */}
          <View style={styles.metaRow}>
            <View style={styles.metaIcon}>
              <MaterialDesignIcons
                name="currency-inr"
                size={18}
                color={themeColors.text}
              />
            </View>
            <Text style={[styles.metaText, styles.metaCopy]} numberOfLines={1}>
              {paymentLabel}
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              hitSlop={8}
              onPress={onChangePayment}>
              <Text style={styles.changeText}>Change</Text>
            </TouchableOpacity>
          </View>

          {/* Promo Code Section */}
          <View style={[styles.metaRow, styles.metaRowPromo]}>
            <View style={[styles.metaIcon, promoCode && styles.metaIconPromo]}>
              <Feather
                name="percent"
                size={15}
                color={promoCode ? themeColors.green[600] : themeColors.text}
              />
            </View>
            <Text
              style={[
                styles.metaText,
                promoCode && styles.metaTextPromo,
                styles.metaCopy,
              ]}
              numberOfLines={1}>
              {promoCode ? `${promoCode} applied` : 'Apply promo code'}
            </Text>
            {promoCode ? (
              <>
                <Text style={styles.promoAmount}>- ₹{promoDiscount}</Text>
                {onRemovePromo ? (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    hitSlop={8}
                    onPress={onRemovePromo}
                    accessibilityRole="button"
                    accessibilityLabel="Remove coupon">
                    <Text style={styles.removeText}>Remove</Text>
                  </TouchableOpacity>
                ) : null}
              </>
            ) : (
              <TouchableOpacity
                activeOpacity={0.7}
                hitSlop={8}
                onPress={onOpenOffers}
                accessibilityRole="button"
                accessibilityLabel="Apply coupon">
                <Text style={styles.applyText}>Apply</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Footer with Total and CTA */}
          <View style={styles.footer}>
            <View style={styles.totalCol}>
              <Text style={styles.totalLabel}>TOTAL</Text>
              <Text style={styles.totalValue}>₹{currentPrice}</Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.bookBtn}
              onPress={() => {
                onBook?.({
                  rideName: isPool ? data.pool.name : selectedSolo?.name,
                  rideId: selectedRideId,
                  seats: isPool ? seatsCount : selectedSolo?.seats,
                  categoryId,
                  total: currentPrice,
                });
              }}>
              <Text style={styles.bookText}>{bookButtonTitle}</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}
