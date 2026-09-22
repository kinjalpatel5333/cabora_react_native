import React, { useState } from 'react';
import {ScrollView, Text, TextInput, View, TouchableOpacity} from 'react-native';
import { Feather } from '@react-native-vector-icons/feather/static';
import { Lucide } from '@react-native-vector-icons/lucide/static';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons/static';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../../context/AppContext';
import useThemedStyles from '../../components/useThemedStyles';
import { useSidebar } from '../../context/SidebarContext';
import createStyles from './style';
import colors from '../../config/color';

import { DRIVER_TRIP_PERIODS as PERIODS, DRIVER_TRIP_STATUS_FILTERS as STATUS_FILTERS, DRIVER_TRIPS_DATA as TRIPS_DATA } from '../../config/staticData';

export default function DriverTripHistoryScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useApp();
  const styles = useThemedStyles(createStyles);
  const { openDrawer, setActiveTab } = useSidebar();

  React.useEffect(() => {
    setActiveTab('DriverTripHistory');
  }, [setActiveTab]);

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

      {/* Header */}
      <View
        style={[
          styles.header,
          { paddingTop: insets.top > 0 ? insets.top : 8 },
        ]}>
        <TouchableOpacity activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Open menu"
          onPress={openDrawer}
          style={styles.menuBtn}>
          <Feather name="menu" size={20} color={colors.text} />
        </TouchableOpacity>
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
            <TouchableOpacity activeOpacity={0.7} onPress={() => setSearchQuery('')}>
              <Feather name="x" size={16} color={colors.slate[400]} />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Time Period Selector (Today, Week, Month, Custom) */}
        <View style={styles.periodRow}>
          {PERIODS.map(period => {
            const active = period === selectedPeriod;
            return (
              <TouchableOpacity activeOpacity={0.7}
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
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Status Filter (Completed, Cancelled, All) */}
        <View style={styles.statusFilterRow}>
          {STATUS_FILTERS.map(status => {
            const active = status === selectedStatus;
            return (
              <TouchableOpacity activeOpacity={0.7}
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
              </TouchableOpacity>
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
