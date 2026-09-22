import { PASSENGER_ACTIVITY_TABS, PASSENGER_ACTIVITY_RIDES } from '../../config/staticData';
import React, {useMemo, useState} from 'react';
import {ScrollView, Text, TextInput, View, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Feather} from '@react-native-vector-icons/feather/static';
import {Lucide} from '@react-native-vector-icons/lucide/static';
import {MaterialDesignIcons} from '@react-native-vector-icons/material-design-icons/static';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useToast} from '../../components/Toast';
import useThemedStyles from '../../components/useThemedStyles';
import {useApp} from '../../context/AppContext';
import {useSidebar} from '../../context/SidebarContext';
import {getHomeTabBarInset} from '../../navigation/homeTabBarMetrics';
import SortFilterModal from './SortFilterModal';
import createStyles from './style';
import colors from '../../config/color';

const TABS = PASSENGER_ACTIVITY_TABS;

const RIDES = PASSENGER_ACTIVITY_RIDES;

const EMPTY_COPY = {
  completed: {
    title: 'No completed rides yet',
    body: 'Once you finish a ride it lands here with the route, fare and receipt.',
  },
  cancelled: {
    title: 'No cancelled rides',
    body: 'Cancelled trips will show up here with the reason and fare details.',
  },
  scheduled: {
    title: 'No scheduled rides',
    body: 'Upcoming scheduled rides will appear here so you can manage them.',
  },
};

function RideVehicleIcon({name, color}) {
  return <MaterialDesignIcons name={name} size={18} color={color} />;
}

export default function ActivityScreen() {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);
  const {colors} = useApp();
  const navigation = useNavigation();
  const {openDrawer} = useSidebar();
  const {showToast} = useToast();
  const tabInset = getHomeTabBarInset(insets);
  const [tab, setTab] = useState('completed');
  const [query, setQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);

  const rides = useMemo(() => {
    const q = query.trim().toLowerCase();
    return RIDES.filter(ride => {
      if (ride.status !== tab) {
        return false;
      }
      if (!q) {
        return true;
      }
      return (
        ride.pickup.toLowerCase().includes(q) ||
        ride.drop.toLowerCase().includes(q) ||
        ride.vehicle.toLowerCase().includes(q) ||
        ride.fare.toLowerCase().includes(q) ||
        ride.when.toLowerCase().includes(q)
      );
    });
  }, [query, tab]);

  const monthLabel = rides[0]?.month || 'SEPTEMBER 2026';
  const emptyCopy = EMPTY_COPY[tab] || EMPTY_COPY.completed;

  return (
    <View style={styles.root}>
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
          <TouchableOpacity activeOpacity={0.7}
            style={styles.iconBtn}
            onPress={openDrawer}
            accessibilityRole="button"
            accessibilityLabel="Open menu"
            hitSlop={8}>
            <Feather
              name="menu"
              size={20}
              color={colors.isDark ? colors.white : colors.navy[900]}
            />
          </TouchableOpacity>
          <Text style={styles.title}>Your rides</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity activeOpacity={0.7}
              style={[styles.iconBtn, styles.iconBtnOutline]}
              onPress={() => navigation.navigate('SelectDates')}
              accessibilityRole="button"
              accessibilityLabel="Calendar"
              hitSlop={8}>
              <Feather
                name="calendar"
                size={20}
                color={colors.isDark ? colors.white : colors.navy[900]}
              />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.7}
              style={[styles.iconBtn, styles.iconBtnOutline]}
              onPress={() => setFilterOpen(true)}
              accessibilityRole="button"
              accessibilityLabel="Filter"
              hitSlop={8}>
              <MaterialDesignIcons
                name="filter-variant"
                size={22}
                color={colors.isDark ? colors.white : colors.navy[900]}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.searchBox}>
          <Feather
            name="search"
            size={18}
            color={colors.isDark ? colors.white : colors.gray[400]}
          />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search by place, date or fare"
            placeholderTextColor={
              colors.isDark ? colors.alpha.white75 : colors.gray[400]
            }
            style={styles.searchInput}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
        </View>

        <View style={styles.tabs}>
          {TABS.map(item => {
            const active = item.id === tab;
            return (
              <TouchableOpacity activeOpacity={0.7}
                key={item.id}
                style={[styles.tab, active && styles.tabActive]}
                onPress={() => setTab(item.id)}>
                <Text
                  style={[styles.tabText, active && styles.tabTextActive]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {rides.length > 0 ? (
          <>
            <Text style={styles.monthLabel}>{monthLabel}</Text>
            <View style={styles.rideList}>
              {rides.map(ride => {
                const isCompleted = ride.status === 'completed';
                const isCancelled = ride.status === 'cancelled';
                const pillBg = isCompleted
                  ? colors.isDark ? colors.alpha.green20 : colors.green[100]
                  : isCancelled
                    ? colors.isDark ? colors.alpha.red20 : colors.red[100]
                    : colors.isDark ? colors.alpha.orange20 : colors.orange[100];
                const pillColor = isCompleted
                  ? colors.green[500]
                  : isCancelled
                    ? colors.red[500]
                    : colors.primary;
                const statusLabel = isCompleted
                  ? 'Completed'
                  : isCancelled
                    ? 'Cancelled'
                    : 'Scheduled';

                return (
                  <TouchableOpacity activeOpacity={0.7}
                    key={ride.id}
                    style={styles.rideCard}
                    onPress={() =>
                      showToast({
                        type: 'info',
                        message: `${ride.vehicle} ride details`,
                      })
                    }
                    accessibilityRole="button">
                    <View style={styles.rideTop}>
                      <Text style={styles.rideWhen}>{ride.when}</Text>
                      <View
                        style={[styles.statusPill, {backgroundColor: pillBg}]}>
                        <View
                          style={[
                            styles.statusDot,
                            {backgroundColor: pillColor},
                          ]}
                        />
                        <Text style={[styles.statusText, {color: pillColor}]}>
                          {statusLabel}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.routeBlock}>
                      <View style={styles.routeTimeline}>
                        <View style={styles.pickupDot} />
                        <View style={styles.routeLine} />
                        <View style={styles.dropDot} />
                      </View>
                      <View style={styles.routeCopy}>
                        <View>
                          <Text style={styles.stopLabel}>PICKUP</Text>
                          <Text style={styles.stopAddress}>{ride.pickup}</Text>
                        </View>
                        <View>
                          <Text style={styles.stopLabel}>DROP</Text>
                          <Text style={styles.stopAddress}>{ride.drop}</Text>
                        </View>
                      </View>
                    </View>

                    <View style={styles.rideFooter}>
                      <RideVehicleIcon
                        name={ride.icon}
                        color={colors.muted}
                      />
                      <Text style={styles.rideMeta} numberOfLines={1}>
                        {ride.vehicle} · {ride.meta}
                      </Text>
                      <Text style={styles.rideFare}>{ride.fare}</Text>
                      <Feather
                        name="chevron-right"
                        size={18}
                        color={colors.muted}
                      />
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        ) : (
          <View style={styles.emptyWrap}>
            <View style={styles.emptyIcon}>
              <Lucide name="car" size={40} color={colors.text} />
            </View>
            <Text style={styles.emptyTitle}>
              {query.trim()
                ? `No rides match “${query}”`
                : emptyCopy.title}
            </Text>
            <Text style={styles.emptyBody}>
              {query.trim()
                ? 'Try another place, date or fare.'
                : emptyCopy.body}
            </Text>
            {!query.trim() ? (
              <TouchableOpacity activeOpacity={0.7}
                style={styles.bookBtn}
                onPress={() => navigation.navigate('Home')}
                accessibilityRole="button"
                accessibilityLabel="Book a ride">
                <Text style={styles.bookText}>Book a ride</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        )}
      </ScrollView>

      <SortFilterModal
        visible={filterOpen}
        onClose={() => setFilterOpen(false)}
        tripCount={18}
        onApply={() =>
          showToast({type: 'success', message: 'Filters applied'})
        }
      />
    </View>
  );
}
