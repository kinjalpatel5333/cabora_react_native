import { PASSENGER_CHOOSE_RIDES } from '../../config/staticData';
import React, {useEffect, useMemo, useState} from 'react';
import {Animated, Dimensions, Modal, ScrollView, Text, View, TouchableOpacity} from 'react-native';
import {Feather} from '@react-native-vector-icons/feather/static';
import {MaterialDesignIcons} from '@react-native-vector-icons/material-design-icons/static';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import useThemedStyles from '../../components/useThemedStyles';
import {useApp} from '../../context/AppContext';
import useDraggableSheet from '../../hooks/useDraggableSheet';
import BookForSomeoneElseModal from './BookForSomeoneElseModal';
import PaymentOffersModal from './PaymentOffersModal';
import RideCategoryModal, {categoryFromRideId} from './RideCategoryModal';
import ScheduleRideModal from './ScheduleRideModal';
import createStyles from './style';
import colors from '../../config/color';

const PROMO_OFF = 50;

const RIDES = PASSENGER_CHOOSE_RIDES;

function RideIcon({icon, color, size = 28}) {
  return <MaterialDesignIcons name={icon} size={size} color={color} />;
}

export default function ChooseRideModal({
  visible,
  onClose,
  onBook,
  routeSummary = '14.2 km • 38 min • via Airport Rd',
  promoCode = 'CABORA50',
  pickup = '12, Brigade Road, Ashok Nagar',
  drop = 'Kempegowda Intl. Airport, T2',
}) {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);
  const {colors} = useApp();
  const [selectedId, setSelectedId] = useState('sedan');
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [bookForSomeoneOpen, setBookForSomeoneOpen] = useState(false);
  const [scheduledVehicle, setScheduledVehicle] = useState({
    name: 'Comfort',
    price: 1640,
  });
  const [categoryId, setCategoryId] = useState('cab');
  const [paymentMethod, setPaymentMethod] = useState({
    id: 'upi',
    label: 'UPI • you@okaxis',
  });

  useEffect(() => {
    if (visible) {
      setSelectedId('sedan');
      setPaymentOpen(false);
      setCategoryOpen(false);
      setScheduleOpen(false);
      setBookForSomeoneOpen(false);
      setScheduledVehicle({name: 'Comfort', price: 1640});
      setCategoryId('cab');
      setPaymentMethod({id: 'upi', label: 'UPI • you@okaxis'});
    }
  }, [visible]);

  const openCategory = rideId => {
    setSelectedId(rideId);
    setCategoryId(categoryFromRideId(rideId));
    setCategoryOpen(true);
  };

  const selected = useMemo(
    () => RIDES.find(item => item.id === selectedId) || RIDES[3],
    [selectedId],
  );

  const total = Math.max(0, selected.price - PROMO_OFF);
  const sheetMaxH = Dimensions.get('window').height * 0.72;
  const {sheetTY, panHandlers, toggle, expanded, onSheetLayout} =
    useDraggableSheet({
      peekHeight: 200,
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
        <TouchableOpacity activeOpacity={0.7} style={styles.backdrop} onPress={onClose} />

        <View style={[styles.routeSummary, {top: insets.top + 10}]}>
          <MaterialDesignIcons
            name="map-marker-path"
            size={18}
            color={colors.orange[500]}
          />
          <Text style={styles.routeSummaryText} numberOfLines={1}>
            {routeSummary}
          </Text>
        </View>

        <View style={styles.routePreview} pointerEvents="none">
          <View style={styles.routeLine} />
          <View style={styles.routeDotStart} />
          <View style={styles.routePinEnd}>
            <MaterialDesignIcons
              name="map-marker"
              size={36}
              color={colors.text}
            />
          </View>
        </View>

        <TouchableOpacity activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Recenter map"
          style={[styles.locateFab, {bottom: sheetMaxH + 12}]}>
          <MaterialDesignIcons
            name="crosshairs-gps"
            size={22}
            color={colors.text}
          />
        </TouchableOpacity>

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
            <TouchableOpacity activeOpacity={0.7}
              onPress={toggle}
              accessibilityRole="button"
              accessibilityLabel={expanded ? 'Collapse sheet' : 'Expand sheet'}
              style={styles.grabberHit}>
              <View style={styles.grabber} />
            </TouchableOpacity>
          </View>

          <View style={styles.headerRow}>
            <Text style={styles.title}>Choose a ride</Text>
            <TouchableOpacity activeOpacity={0.7}
              style={styles.scheduleBtn}
              onPress={() => setScheduleOpen(true)}>
              <Feather name="calendar" size={15} color={colors.text} />
              <Text style={styles.scheduleText}>Schedule</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            bounces={false}
            style={styles.list}
            contentContainerStyle={styles.listContent}>
            {RIDES.map(ride => {
              const active = ride.id === selectedId;
              const iconColor = active
                ? colors.orange[500]
                : colors.text;
              return (
                <TouchableOpacity activeOpacity={0.7}
                  key={ride.id}
                  onPress={() => openCategory(ride.id)}
                  style={[styles.rideCard, active && styles.rideCardActive]}>
                  <View
                    style={[
                      styles.rideIconWrap,
                      active && styles.rideIconActive,
                    ]}>
                    <RideIcon icon={ride.icon} color={iconColor} />
                  </View>
                  <View style={styles.rideCopy}>
                    <View style={styles.rideTitleRow}>
                      <Text style={styles.rideTitle}>{ride.name}</Text>
                      {ride.badge ? (
                        <View style={styles.badge}>
                          <Text style={styles.badgeText}>{ride.badge}</Text>
                        </View>
                      ) : null}
                    </View>
                    <Text style={styles.rideMeta}>
                      {ride.seats} seat{ride.seats > 1 ? 's' : ''} •{' '}
                      {ride.awayMin} min away
                    </Text>
                  </View>
                  <View style={styles.ridePriceCol}>
                    <Text style={styles.ridePrice}>₹{ride.price}</Text>
                    <Text style={styles.rideEta}>{ride.eta}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
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
              {paymentMethod.label}
            </Text>
            <TouchableOpacity activeOpacity={0.7} hitSlop={8} onPress={() => setPaymentOpen(true)}>
              <Text style={styles.changeText}>Change</Text>
            </TouchableOpacity>
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
              <Text style={styles.totalValue}>₹{total}</Text>
            </View>
            <TouchableOpacity activeOpacity={0.7}
              style={styles.bookBtn}
              onPress={() => openCategory(selectedId)}>
              <Text style={styles.bookText}>Book {selected.name}</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Above sheet so taps always register */}
        <TouchableOpacity activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={onClose}
          hitSlop={12}
          style={[styles.backBtn, {top: insets.top + 8}]}>
          <Feather name="arrow-left" size={22} color={colors.text} />
        </TouchableOpacity>

        <PaymentOffersModal
          visible={paymentOpen}
          onClose={() => setPaymentOpen(false)}
          selectedId={paymentMethod.id}
          promoCode={promoCode}
          onSave={method => {
            setPaymentMethod({id: method.id, label: method.label});
          }}
        />

        <RideCategoryModal
          visible={categoryOpen}
          onClose={() => setCategoryOpen(false)}
          categoryId={categoryId}
          promoCode={promoCode}
          paymentLabel={paymentMethod.label.replace('•', '·')}
          onChangePayment={() => setPaymentOpen(true)}
          onBook={payload => {
            setCategoryOpen(false);
            onBook?.({
              ...payload,
              pickup,
              drop,
              payment: paymentMethod,
            });
          }}
        />

        <ScheduleRideModal
          visible={scheduleOpen}
          onClose={() => setScheduleOpen(false)}
          paymentLabel={
            paymentMethod.id === 'card'
              ? 'HDFC ....4821'
              : paymentMethod.label.replace('•', '·')
          }
          onChangePayment={() => setPaymentOpen(true)}
          onConfirm={() => {
            // Temporary: open Book for someone else after Confirm
            setScheduledVehicle({name: 'Comfort', price: 1640});
            setBookForSomeoneOpen(true);
          }}
        />

        <BookForSomeoneElseModal
          visible={bookForSomeoneOpen}
          onClose={() => setBookForSomeoneOpen(false)}
          paymentLabel="HDFC ....4821"
          vehicleName={scheduledVehicle.name}
          fare={scheduledVehicle.price}
          onChangePayment={() => setPaymentOpen(true)}
          onBook={() => {
            setBookForSomeoneOpen(false);
            setScheduleOpen(false);
          }}
        />
      </View>
    </Modal>
  );
}
