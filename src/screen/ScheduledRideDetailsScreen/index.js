import { useState } from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Feather } from '@react-native-vector-icons/feather/static';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useToast } from '../../components/Toast';
import useThemedStyles from '../../components/useThemedStyles';
import { useApp } from '../../context/AppContext';
import ConfirmDialog from '../../components/ConfirmDialog';
import PaymentOffersModal from '../ChooseRideScreen/PaymentOffersModal';
import ScheduleRideModal from '../ChooseRideScreen/ScheduleRideModal';
import createStyles from './style';

const DEFAULT_RIDE = {
  id: 'sched-1',
  day: 'Tuesday',
  dateFormatted: 'Tuesday 22 Sep, 6:30 am',
  time: '6:30 am',
  timeRemaining: 'In 3 days',
  purpose: 'airport drop',
  vehicle: 'Cab Sedan · AC',
  pickup: 'Home · Satellite, Ahmedabad',
  pickupSub: 'Pickup 6:30 am',
  drop: 'SVPI Airport · Terminal 2',
  dropSub: 'Arrive by 7:14 am · 18.4 km',
  fare: '₹520',
  fareDetails: '₹520 · locked till 6:30 am',
  paymentMethod: 'Cash on arrival',
  paymentId: 'cash',
  reminder: 'Push 45 min before',
  notice: 'A driver is assigned 30 minutes before pickup',
};

export default function ScheduledRideDetailsScreen() {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);
  const { colors } = useApp();
  const navigation = useNavigation();
  const route = useRoute();
  const { showToast } = useToast();

  const initialRide = route.params?.ride || DEFAULT_RIDE;

  const [rideData, setRideData] = useState({
    ...DEFAULT_RIDE,
    ...initialRide,
    dateFormatted:
      initialRide.dateFormatted ||
      `${initialRide.dayFull || initialRide.day || 'Tuesday'} ${initialRide.date || '22'
      } ${initialRide.month || 'Sep'}, ${initialRide.time || '6:30 am'}`,
    pickupSub: initialRide.pickupSub || `Pickup ${initialRide.time || '6:30 am'}`,
    dropSub: initialRide.dropSub || 'Arrive by 7:14 am · 18.4 km',
    fareDetails:
      initialRide.fareDetails ||
      `${initialRide.fare || '₹520'} · locked till ${initialRide.time || '6:30 am'
      }`,
    paymentMethod: initialRide.paymentMethod || 'Cash on arrival',
  });

  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const handleOptions = () => {
    showToast({
      type: 'info',
      message: 'Ride details copied to clipboard',
    });
  };

  const handleConfirmNewSchedule = data => {
    setScheduleModalOpen(false);
    const updatedTime = data?.selectedTime || rideData.time;
    const updatedDay = data?.selectedDay?.weekday || 'Tue';
    const updatedDate = data?.selectedDay?.day || '22';

    setRideData(prev => ({
      ...prev,
      time: updatedTime,
      dateFormatted: `${updatedDay} ${updatedDate} Sep, ${updatedTime}`,
      pickupSub: `Pickup ${updatedTime}`,
      fareDetails: `${prev.fare} · locked till ${updatedTime}`,
    }));

    showToast({
      type: 'success',
      message: `Schedule updated to ${updatedTime}`,
    });
  };

  const handleSavePayment = method => {
    setRideData(prev => ({
      ...prev,
      paymentMethod: method?.label || 'Cash on arrival',
      paymentId: method?.id || 'cash',
    }));
    showToast({
      type: 'success',
      message: `Payment method changed to ${method?.label || 'Cash'}`,
    });
  };

  const handleCancelRide = () => {
    setCancelModalOpen(true);
  };

  const handleConfirmCancellation = reason => {
    setCancelModalOpen(false);
    showToast({
      type: 'info',
      message: 'Scheduled ride cancelled successfully',
    });
    navigation.goBack();
  };

  const handleSaveChanges = () => {
    showToast({
      type: 'success',
      message: 'Scheduled ride changes saved successfully',
    });
    navigation.goBack();
  };

  return (
    <View style={styles.root}>
      {/* Top Header */}
      <View style={[styles.header, { paddingTop: insets.top + 6 }]}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.headerBtn}
          onPress={handleBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={8}>
          <Feather name="arrow-left" size={22} color={colors.text} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Scheduled ride</Text>

        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.headerBtn}
          onPress={handleOptions}
          accessibilityRole="button"
          accessibilityLabel="Ride options"
          hitSlop={8}>
          <Feather name="more-vertical" size={22} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}>
        {/* Top Info Banner Card */}
        <View style={styles.topBannerCard}>
          <View style={styles.topBannerRow}>
            <View style={styles.topBannerIconBox}>
              <Feather name="calendar" size={22} color="#FF7A00" />
            </View>

            <View style={styles.topBannerContent}>
              <Text style={styles.topBannerTitle} numberOfLines={1}>
                {rideData.dateFormatted}
              </Text>
              <Text style={styles.topBannerSub} numberOfLines={1}>
                {rideData.timeRemaining} · {rideData.purpose}
              </Text>
            </View>
          </View>

          <View style={styles.topBannerDivider} />

          <Text style={styles.topBannerFooterText}>{rideData.notice}</Text>
        </View>

        {/* Route Card */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>ROUTE</Text>

          {/* Pickup Stop */}
          <View style={styles.routeStopRow}>
            <View style={styles.stopDotWrap}>
              <View style={styles.stopDotPickup} />
            </View>
            <View style={styles.stopInfo}>
              <Text style={styles.stopTitle} numberOfLines={1}>
                {rideData.pickup}
              </Text>
              <Text style={styles.stopSub} numberOfLines={1}>
                {rideData.pickupSub}
              </Text>
            </View>
          </View>

          {/* Connector Line */}
          <View style={styles.stopLine} />

          {/* Drop Stop */}
          <View style={styles.routeStopRow}>
            <View style={styles.stopDotWrap}>
              <View style={styles.stopDotDrop} />
            </View>
            <View style={styles.stopInfo}>
              <Text style={styles.stopTitle} numberOfLines={1}>
                {rideData.drop}
              </Text>
              <Text style={styles.stopSub} numberOfLines={1}>
                {rideData.dropSub}
              </Text>
            </View>
          </View>
        </View>

        {/* Details Card */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>DETAILS</Text>

          <View style={styles.detailsRow}>
            <Text style={styles.detailsLabel}>Vehicle</Text>
            <Text style={styles.detailsValue} numberOfLines={1}>
              {rideData.vehicle}
            </Text>
          </View>

          <View style={styles.cardDivider} />

          <View style={styles.detailsRow}>
            <Text style={styles.detailsLabel}>Payment</Text>
            <Text style={styles.detailsValue} numberOfLines={1}>
              {rideData.paymentMethod}
            </Text>
          </View>

          <View style={styles.cardDivider} />

          <View style={styles.detailsRow}>
            <Text style={styles.detailsLabel}>Fare estimate</Text>
            <Text style={styles.detailsValue} numberOfLines={1}>
              {rideData.fareDetails}
            </Text>
          </View>

          <View style={styles.cardDivider} />

          <View style={styles.detailsRow}>
            <Text style={styles.detailsLabel}>Reminder</Text>
            <Text style={styles.detailsValue} numberOfLines={1}>
              {rideData.reminder}
            </Text>
          </View>
        </View>

        {/* Change Date/Time & Payment Actions Card */}
        <View style={styles.card}>
          {/* Change date & time */}
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.actionItem}
            onPress={() => setScheduleModalOpen(true)}
            accessibilityRole="button"
            accessibilityLabel="Change date & time">
            <View style={styles.actionIconBox}>
              <Feather name="calendar" size={18} color={colors.textMuted} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Change date & time</Text>
              <Text style={styles.actionSub}>
                Free until 1 hour before pickup
              </Text>
            </View>
            <Feather name="chevron-right" size={18} color={colors.textMuted} />
          </TouchableOpacity>

          <View style={styles.cardDivider} />

          {/* Change payment method */}
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.actionItem}
            onPress={() => setPaymentModalOpen(true)}
            accessibilityRole="button"
            accessibilityLabel="Change payment method">
            <View style={styles.actionIconBox}>
              <Feather name="credit-card" size={18} color={colors.textMuted} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Change payment method</Text>
              <Text style={styles.actionSub}>
                Cash · switch to UPI, card or wallet
              </Text>
            </View>
            <Feather name="chevron-right" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Cancellation policy note */}
        <View style={styles.policyCard}>
          <Feather name="info" size={18} color={colors.textMuted} />
          <Text style={styles.policyText}>
            Free cancellation until 1 hour before. After that a ₹50 fee applies.
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Floating Bar */}
      <View
        style={[
          styles.bottomBar,
          { paddingBottom: Math.max(insets.bottom, 12) + 6 },
        ]}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.cancelBtn}
          onPress={handleCancelRide}
          accessibilityRole="button"
          accessibilityLabel="Cancel ride">
          <Text style={styles.cancelBtnText}>Cancel ride</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.saveBtn}
          onPress={handleSaveChanges}
          accessibilityRole="button"
          accessibilityLabel="Save changes">
          <Text style={styles.saveBtnText}>Save changes</Text>
        </TouchableOpacity>
      </View>

      {/* Modals for Date/Time and Payment */}
      <ScheduleRideModal
        visible={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        onConfirm={handleConfirmNewSchedule}
        pickupTitle={rideData.pickup}
        dropTitle={rideData.drop}
      />

      <PaymentOffersModal
        visible={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        selectedId={rideData.paymentId}
        onSave={handleSavePayment}
      />

      <ConfirmDialog
        visible={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        variant="danger"
        title="Cancel scheduled ride?"
        message="Your scheduled ride will be cancelled. Free cancellation is active and no fee will be charged."
        confirmLabel="Yes, cancel ride"
        cancelLabel="Keep my ride"
        onConfirm={handleConfirmCancellation}
      />
    </View>
  );
}
