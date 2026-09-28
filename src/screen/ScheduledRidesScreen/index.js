import React, {useState} from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Feather} from '@react-native-vector-icons/feather/static';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useToast} from '../../components/Toast';
import useThemedStyles from '../../components/useThemedStyles';
import {useApp} from '../../context/AppContext';
import ScheduleRideModal from '../ChooseRideScreen/ScheduleRideModal';
import createStyles from './style';

export const SCHEDULED_RIDES_DATA = [
  {
    id: 'sched-1',
    day: 'TUE',
    dayFull: 'Tuesday',
    date: '22',
    month: 'Sep',
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
    status: 'confirmed',
    statusLabel: 'Confirmed',
    type: 'upcoming',
  },
  {
    id: 'sched-2',
    day: 'THU',
    dayFull: 'Thursday',
    date: '24',
    month: 'Sep',
    time: '9:15 am',
    timeRemaining: 'In 5 days',
    purpose: 'office',
    vehicle: 'Auto · UPI',
    pickup: 'Home · Satellite, Ahmedabad',
    pickupSub: 'Pickup 9:15 am',
    drop: 'Prahladnagar Corporate Rd',
    dropSub: 'Arrive by 9:40 am · 6.2 km',
    fare: '₹110',
    fareDetails: '₹110 · locked till 9:15 am',
    paymentMethod: 'UPI · Google Pay',
    paymentId: 'upi',
    reminder: 'Push 30 min before',
    notice: 'A driver is assigned 20 minutes before pickup',
    status: 'confirmed',
    statusLabel: 'Confirmed',
    type: 'upcoming',
  },
  {
    id: 'sched-3',
    day: 'SAT',
    dayFull: 'Saturday',
    date: '26',
    month: 'Sep',
    time: '7:00 am',
    timeRemaining: 'In 7 days',
    purpose: 'intercity',
    vehicle: 'Cab Sedan · Card',
    pickup: 'Home · Satellite, Ahmedabad',
    pickupSub: 'Pickup 7:00 am',
    drop: 'Baroda · Alkapuri',
    dropSub: 'Arrive by 9:15 am · 112 km',
    fare: '₹2,450',
    fareDetails: '₹2,450 · locked till 7:00 am',
    paymentMethod: 'HDFC Card •••• 4821',
    paymentId: 'card',
    reminder: 'Push 1 hour before',
    notice: 'A driver is assigned 45 minutes before pickup',
    status: 'pending',
    statusLabel: 'Driver pending',
    type: 'upcoming',
  },
];

export default function ScheduledRidesScreen({onGoBack}) {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);
  const {colors} = useApp();
  const navigation = useNavigation();
  const {showToast} = useToast();

  const [activeSegment, setActiveSegment] = useState('upcoming');
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);

  const handleBack = () => {
    if (onGoBack) {
      onGoBack();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const handleManage = ride => {
    navigation.navigate('ScheduledRideDetails', {ride});
  };

  const rides =
    activeSegment === 'upcoming'
      ? SCHEDULED_RIDES_DATA
      : [];

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={[styles.header, {paddingTop: insets.top + 6}]}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.headerBtn}
          onPress={handleBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={8}>
          <Feather name="arrow-left" size={22} color={colors.text} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Scheduled rides</Text>

        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.headerBtn}
          onPress={() => navigation.navigate('SelectDates')}
          accessibilityRole="button"
          accessibilityLabel="Calendar"
          hitSlop={8}>
          <Feather name="calendar" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scroll,
          {paddingBottom: Math.max(insets.bottom, 16) + 30},
        ]}>
        {/* Upcoming vs Past Segment Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setActiveSegment('upcoming')}
            style={[
              styles.tabBtn,
              activeSegment === 'upcoming' && styles.tabBtnActive,
            ]}>
            <Text
              style={[
                styles.tabText,
                activeSegment === 'upcoming' && styles.tabTextActive,
              ]}>
              Upcoming · {SCHEDULED_RIDES_DATA.length}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setActiveSegment('past')}
            style={[
              styles.tabBtn,
              activeSegment === 'past' && styles.tabBtnActive,
            ]}>
            <Text
              style={[
                styles.tabText,
                activeSegment === 'past' && styles.tabTextActive,
              ]}>
              Past
            </Text>
          </TouchableOpacity>
        </View>

        {/* Scheduled Ride Cards List */}
        {rides.length > 0 ? (
          <View style={styles.list}>
            {rides.map(ride => {
              const isConfirmed = ride.status === 'confirmed';
              return (
                <TouchableOpacity
                  key={ride.id}
                  activeOpacity={0.88}
                  style={styles.rideCard}
                  onPress={() => handleManage(ride)}
                  accessibilityRole="button"
                  accessibilityLabel={`Ride details on ${ride.day} ${ride.date}`}>
                  {/* Card Header */}
                  <View style={styles.cardHeader}>
                    {/* Date badge */}
                    <View style={styles.dateBox}>
                      <Text style={styles.dateDay}>{ride.day}</Text>
                      <Text style={styles.dateNum}>{ride.date}</Text>
                    </View>

                    {/* Middle Info */}
                    <View style={styles.cardHeaderCopy}>
                      <Text style={styles.cardTitle} numberOfLines={1}>
                        {ride.time} · {ride.purpose}
                      </Text>
                      <Text style={styles.cardSubtitle} numberOfLines={1}>
                        {ride.vehicle}
                      </Text>
                    </View>

                    {/* Status badge */}
                    <View
                      style={[
                        styles.statusBadge,
                        isConfirmed
                          ? styles.statusBadgeConfirmed
                          : styles.statusBadgePending,
                      ]}>
                      <Text
                        style={[
                          styles.statusText,
                          isConfirmed
                            ? styles.statusTextConfirmed
                            : styles.statusTextPending,
                        ]}>
                        {ride.statusLabel}
                      </Text>
                    </View>
                  </View>

                  {/* Card Body: Route & Fare */}
                  <View style={styles.cardBody}>
                    <View style={styles.routeCol}>
                      {/* Pickup */}
                      <View style={styles.routeStopRow}>
                        <View style={styles.stopDotPickup} />
                        <Text style={styles.stopAddress} numberOfLines={1}>
                          {ride.pickup}
                        </Text>
                      </View>

                      {/* Connecting Line */}
                      <View style={styles.stopLine} />

                      {/* Drop */}
                      <View style={styles.routeStopRow}>
                        <View style={styles.stopDotDrop} />
                        <Text style={styles.stopAddress} numberOfLines={1}>
                          {ride.drop}
                        </Text>
                      </View>
                    </View>

                    {/* Fare & Manage */}
                    <View style={styles.fareCol}>
                      <Text style={styles.farePrice}>{ride.fare}</Text>
                      <Text style={styles.fareEstimate}>estimate</Text>
                      <TouchableOpacity
                        activeOpacity={0.7}
                        style={styles.manageBtn}
                        onPress={() => handleManage(ride)}
                        accessibilityRole="button"
                        accessibilityLabel={`Manage ride on ${ride.day} ${ride.date}`}>
                        <Text style={styles.manageBtnText}>Manage</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <View style={styles.emptyWrap}>
            <Feather name="calendar" size={40} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>No past scheduled rides</Text>
            <Text style={styles.emptySub}>
              Completed and past scheduled rides will show up here.
            </Text>
          </View>
        )}

        {/* Schedule another ride dashed card */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.scheduleAnotherCard}
          onPress={() => setScheduleModalOpen(true)}
          accessibilityRole="button"
          accessibilityLabel="Schedule another ride">
          <View style={styles.scheduleAnotherLeft}>
            <Feather name="plus" size={18} color="#FF7A00" />
            <Text style={styles.scheduleAnotherText}>
              Schedule another ride
            </Text>
          </View>
          <Feather name="chevron-right" size={18} color="#FF7A00" />
        </TouchableOpacity>
      </ScrollView>

      <ScheduleRideModal
        visible={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        onConfirm={data => {
          setScheduleModalOpen(false);
          showToast({
            type: 'success',
            message: `Ride scheduled for ${data?.selectedTime || 'selected time'}`,
          });
        }}
      />
    </View>
  );
}
