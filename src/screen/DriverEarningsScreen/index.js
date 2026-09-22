import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { Feather } from '@react-native-vector-icons/feather/static';
import { Lucide } from '@react-native-vector-icons/lucide/static';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useToast } from '../../components/Toast';
import useThemedStyles from '../../components/useThemedStyles';
import { useApp } from '../../context/AppContext';
import { useSidebar } from '../../context/SidebarContext';
import createStyles from './style';
import colors from '../../config/color';

const PERIOD_TABS = ['Today', 'Week', 'Month', 'Custom'];

const CHART_DATA = [
  { day: 'Mon', height: 38, active: false },
  { day: 'Tue', height: 30, active: false },
  { day: 'Wed', height: 48, active: false },
  { day: 'Thu', height: 60, active: false },
  { day: 'Fri', height: 92, active: true, amount: '₹2,410' },
  { day: 'Sat', height: 66, active: false },
  { day: 'Sun', height: 26, active: false },
];

const RIDE_HISTORY = [
  {
    id: '1',
    time: '12:24 pm',
    route: 'Brigade Rd → Airport T2 · 14.2 km',
    earning: '₹198.03',
    fare: 'fare ₹241.50',
  },
  {
    id: '2',
    time: '10:58 am',
    route: 'Indiranagar → Whitefield · 16.8 km',
    earning: '₹219.76',
    fare: 'fare ₹268.00',
  },
  {
    id: '3',
    time: '08:15 am',
    route: 'Koramangala → Cubbon Park · 4.1 km',
    earning: '₹78.72',
    fare: 'fare ₹96.00',
  },
];

export default function DriverEarningsScreen() {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);
  const { colors } = useApp();
  const { openDrawer } = useSidebar();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('Week');

  const handleDownloadStatement = () => {
    showToast({
      title: 'Tax & Payout Statement',
      message: 'Downloading weekly payout summary PDF...',
      type: 'info',
    });
  };

  return (
    <View style={styles.root}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.slate[50]}
        translucent={false}
      />

      {/* Top Header */}
      <View
        style={[
          styles.header,
          { paddingTop: insets.top > 0 ? insets.top : 8 },
        ]}>
        <View style={styles.headerLeft}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open menu"
            onPress={openDrawer}
            style={styles.menuBtn}>
            <Feather name="menu" size={20} color={colors.slate[900]} />
          </Pressable>
          <Text style={styles.headerTitle}>Earnings</Text>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Download Statement"
          onPress={handleDownloadStatement}
          style={styles.statementBtn}>
          <Lucide name="file-text" size={20} color={colors.slate[900]} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Period Selector Tabs */}
        <View style={styles.periodTabsContainer}>
          {PERIOD_TABS.map(tab => {
            const isActive = tab === activeTab;
            return (
              <Pressable
                key={tab}
                accessibilityRole="button"
                onPress={() => setActiveTab(tab)}
                style={[
                  styles.periodTab,
                  isActive && styles.periodTabActive,
                ]}>
                {tab === 'Custom' && (
                  <Lucide
                    name="calendar"
                    size={13}
                    color={isActive ? colors.slate[900] : colors.slate[500]}
                  />
                )}
                <Text
                  style={[
                    styles.periodTabText,
                    isActive && styles.periodTabTextActive,
                  ]}>
                  {tab}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Net Earnings Navy Card with Bar Chart */}
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartLabel}>NET EARNINGS · 8–14 SEP</Text>
            <Text style={styles.chartTrend}>▲ 9% vs last week</Text>
          </View>

          <Text style={styles.netAmount}>₹11,842.60</Text>

          {/* Bar Chart Visualization with background guide lines */}
          <View style={styles.chartContainer}>
            <View style={styles.chartGridLineTop} />
            <View style={styles.chartGridLineMid} />
            <View style={styles.chartBaseLine} />

            <View style={styles.barsRow}>
              {CHART_DATA.map((item, idx) => (
                <View key={idx} style={styles.barCol}>
                  {item.active && (
                    <View style={styles.tooltipBadge}>
                      <Text style={styles.tooltipText} numberOfLines={1}>
                        {item.amount}
                      </Text>
                    </View>
                  )}
                  <View
                    style={[
                      styles.bar,
                      { height: item.height },
                      item.active && styles.barActive,
                    ]}
                  />
                </View>
              ))}
            </View>

            <View style={styles.dayLabelsRow}>
              {CHART_DATA.map((item, idx) => (
                <Text
                  key={idx}
                  style={[
                    styles.dayLabel,
                    item.active && styles.dayLabelActive,
                  ]}>
                  {item.day}
                </Text>
              ))}
            </View>
          </View>
        </View>

        {/* 2x2 Metric Cards Grid */}
        <View style={styles.metricGrid}>
          {/* Gross Earnings */}
          <View style={styles.metricCard}>
            <View style={styles.metricTitleRow}>
              <Text style={{ fontSize: 13, fontWeight: '800', color: colors.slate[500] }}>₹</Text>
              <Text style={styles.metricTitle}>GROSS EARNINGS</Text>
            </View>
            <Text style={styles.metricValue}>₹14,441.80</Text>
            <Text style={styles.metricSub}>74 trips billed</Text>
          </View>

          {/* Commission */}
          <View style={styles.metricCard}>
            <View style={styles.metricTitleRow}>
              <Text style={{ fontSize: 13, fontWeight: '800', color: colors.slate[500] }}>%</Text>
              <Text style={styles.metricTitle}>COMMISSION</Text>
            </View>
            <Text style={styles.metricValueRed}>− ₹2,599.20</Text>
            <Text style={styles.metricSub}>18% of gross</Text>
          </View>

          {/* Incentives */}
          <View style={styles.metricCard}>
            <View style={styles.metricTitleRow}>
              <Lucide name="gift" size={14} color={colors.slate[500]} />
              <Text style={styles.metricTitle}>INCENTIVES</Text>
            </View>
            <Text style={styles.metricValueGreen}>+ ₹1,200.00</Text>
            <Text style={styles.metricSub}>3 streak bonuses</Text>
          </View>

          {/* Online Hours */}
          <View style={styles.metricCard}>
            <View style={styles.metricTitleRow}>
              <Lucide name="clock" size={14} color={colors.slate[500]} />
              <Text style={styles.metricTitle}>ONLINE HOURS</Text>
            </View>
            <Text style={styles.metricValue}>38h 20m</Text>
            <Text style={styles.metricSub}>₹309 per hour</Text>
          </View>
        </View>

        {/* Ride-Level Earnings Section */}
        <Text style={styles.sectionTitle}>RIDE-LEVEL EARNINGS</Text>

        <View style={styles.ridesCard}>
          {RIDE_HISTORY.map((ride, idx) => {
            const isLast = idx === RIDE_HISTORY.length - 1;
            return (
              <View
                key={ride.id}
                style={[styles.rideItem, !isLast && styles.rideItemBorder]}>
                <View style={styles.rideTopRow}>
                  <View style={styles.rideLeft}>
                    <Text style={styles.rideTime}>{ride.time}</Text>
                    <Text style={styles.rideRoute}>{ride.route}</Text>
                  </View>
                  <View style={styles.rideRight}>
                    <Text style={styles.rideEarning}>{ride.earning}</Text>
                    <Text style={styles.rideFare}>{ride.fare}</Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
