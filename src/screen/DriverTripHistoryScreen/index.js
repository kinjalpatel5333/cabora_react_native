import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Feather } from '@react-native-vector-icons/feather/static';
import { Lucide } from '@react-native-vector-icons/lucide/static';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons/static';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../../context/AppContext';
import useThemedStyles from '../../components/useThemedStyles';
import { useSidebar } from '../../context/SidebarContext';
import createStyles from './style';

const PERIODS = ['Today', 'Week', 'Month', 'Custom'];
const STATUS_FILTERS = ['Completed', 'Cancelled', 'All'];

const TRIPS_DATA = [
  {
    id: '1',
    time: 'Today · 12:24 pm',
    status: 'completed',
    statusLabel: 'Completed',
    pickup: 'Prestige Tech Park, Gate 3',
    drop: 'Kempegowda Intl. Airport, T2',
    rideType: 'Cab Sedan',
    distance: '14.2 km',
    duration: '38 min',
    fare: '₹198.03',
  },
  {
    id: '2',
    time: 'Today · 10:58 am',
    status: 'completed',
    statusLabel: 'Completed',
    pickup: 'Indiranagar 100 Feet Road',
    drop: 'Whitefield, ITPL Main Rd',
    rideType: 'Cab Sedan',
    distance: '16.8 km',
    duration: '42 min',
    fare: '₹219.76',
  },
  {
    id: '3',
    time: 'Yesterday · 6:15 pm',
    status: 'cancelled',
    statusLabel: 'Cancelled',
    pickup: 'Koramangala 5th Block',
    drop: 'MG Road Metro Station',
    rideType: 'Cab Sedan',
    distance: '5.4 km',
    duration: '14 min',
    fare: '₹50.00',
  },
  {
    id: '4',
    time: 'Yesterday · 08:30 am',
    status: 'completed',
    statusLabel: 'Completed',
    pickup: 'HSR Layout Sector 2',
    drop: 'Electronic City Phase 1',
    rideType: 'Cab Sedan',
    distance: '12.1 km',
    duration: '26 min',
    fare: '₹165.20',
  },
];

export default function DriverTripHistoryScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useApp();
  const styles = useThemedStyles(createStyles);
  const { openDrawer } = useSidebar();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('Week');
  const [selectedStatus, setSelectedStatus] = useState('Completed');

  const filteredTrips = TRIPS_DATA.filter(trip => {
    // Status filter
    if (selectedStatus === 'Completed' && trip.status !== 'completed') {
      return false;
    }
    if (selectedStatus === 'Cancelled' && trip.status !== 'cancelled') {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchPickup = trip.pickup.toLowerCase().includes(q);
      const matchDrop = trip.drop.toLowerCase().includes(q);
      const matchTime = trip.time.toLowerCase().includes(q);
      const matchFare = trip.fare.toLowerCase().includes(q);
      return matchPickup || matchDrop || matchTime || matchFare;
    }

    return true;
  });

  return (
    <View style={styles.root}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.slate[50]}
        translucent={false}
      />

      {/* Header */}
      <View
        style={[
          styles.header,
          { paddingTop: insets.top > 0 ? insets.top : 8 },
        ]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open menu"
          onPress={openDrawer}
          style={styles.menuBtn}>
          <Feather name="menu" size={20} color={colors.slate[900]} />
        </Pressable>
        <Text style={styles.headerTitle}>Trip history</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchBox}>
          <Feather name="search" size={18} color={colors.slate[400]} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search by date, place or trip ID"
            placeholderTextColor={colors.slate[400]}
            style={styles.searchInput}
          />
          {searchQuery ? (
            <Pressable onPress={() => setSearchQuery('')}>
              <Feather name="x" size={16} color={colors.slate[400]} />
            </Pressable>
          ) : null}
        </View>

        {/* Time Period Selector (Today, Week, Month, Custom) */}
        <View style={styles.periodRow}>
          {PERIODS.map(period => {
            const active = period === selectedPeriod;
            return (
              <Pressable
                key={period}
                accessibilityRole="button"
                onPress={() => setSelectedPeriod(period)}
                style={[styles.periodTab, active && styles.periodTabActive]}>
                {period === 'Custom' && (
                  <Lucide
                    name="calendar"
                    size={13}
                    color={active ? colors.slate[900] : colors.slate[500]}
                  />
                )}
                <Text
                  style={[
                    styles.periodTabText,
                    active && styles.periodTabTextActive,
                  ]}>
                  {period}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Status Filter (Completed, Cancelled, All) */}
        <View style={styles.statusFilterRow}>
          {STATUS_FILTERS.map(status => {
            const active = status === selectedStatus;
            return (
              <Pressable
                key={status}
                accessibilityRole="button"
                onPress={() => setSelectedStatus(status)}
                style={[
                  styles.statusFilterTab,
                  active && styles.statusFilterTabActive,
                ]}>
                <Text
                  style={[
                    styles.statusFilterTabText,
                    active && styles.statusFilterTabTextActive,
                  ]}>
                  {status}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Navy Stats Summary Card */}
        <View style={styles.navySummary}>
          <View style={styles.statCol}>
            <Text style={styles.statLabel}>TRIPS</Text>
            <Text style={styles.statValue}>74</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCol}>
            <Text style={styles.statLabel}>CANCELLED</Text>
            <Text style={styles.statValue}>3</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCol}>
            <Text style={styles.statLabel}>YOU EARNED</Text>
            <Text style={styles.statValueGreen}>₹11,842</Text>
          </View>
        </View>

        {/* Trip Cards List */}
        {filteredTrips.map(trip => {
          const isCompleted = trip.status === 'completed';

          return (
            <View key={trip.id} style={styles.tripCard}>
              {/* Trip Header */}
              <View style={styles.tripHead}>
                <Text style={styles.tripTime}>{trip.time}</Text>
                <View
                  style={[
                    styles.statusPill,
                    isCompleted
                      ? styles.statusPillCompleted
                      : styles.statusPillCancelled,
                  ]}>
                  <View
                    style={[
                      styles.statusDot,
                      isCompleted
                        ? styles.statusDotCompleted
                        : styles.statusDotCancelled,
                    ]}
                  />
                  <Text
                    style={[
                      isCompleted
                        ? styles.statusTextCompleted
                        : styles.statusTextCancelled,
                    ]}>
                    {trip.statusLabel}
                  </Text>
                </View>
              </View>

              {/* Route Display */}
              <View style={styles.routeRow}>
                <View style={styles.routePins}>
                  <View style={styles.dotOrange} />
                  <View style={styles.routeLine} />
                  <View style={styles.squareNavy} />
                </View>

                <View style={styles.routeAddresses}>
                  <View style={styles.addressBlock}>
                    <Text style={styles.addressKicker}>PICKUP</Text>
                    <Text style={styles.addressTitle} numberOfLines={1}>
                      {trip.pickup}
                    </Text>
                  </View>

                  <View style={styles.addressBlock}>
                    <Text style={styles.addressKicker}>DROP</Text>
                    <Text style={styles.addressTitle} numberOfLines={1}>
                      {trip.drop}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Footer */}
              <View style={styles.cardFooter}>
                <View style={styles.footerLeft}>
                  <MaterialDesignIcons
                    name="car-hatchback"
                    size={16}
                    color={colors.slate[500]}
                  />
                  <Text style={styles.footerMeta}>
                    {trip.rideType} · {trip.distance} · {trip.duration}
                  </Text>
                </View>
                <View style={styles.footerRight}>
                  <Text style={styles.footerFare}>{trip.fare}</Text>
                  <Feather name="chevron-right" size={16} color={colors.slate[400]} />
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
