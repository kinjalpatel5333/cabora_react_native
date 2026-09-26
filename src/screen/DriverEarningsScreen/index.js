import React, { useCallback, useState, useEffect } from 'react';
import {Platform, ScrollView, StatusBar, Text, View, TouchableOpacity} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Feather } from '@react-native-vector-icons/feather/static';
import { Lucide } from '@react-native-vector-icons/lucide/static';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDriverEarnings } from '../../redux/slices/driverSlice';
import { useToast } from '../../components/Toast';
import useThemedStyles from '../../components/useThemedStyles';
import { useApp } from '../../context/AppContext';
import { useSidebar } from '../../context/SidebarContext';
import createStyles from './style';
import colors from '../../config/color';

import { DRIVER_EARNINGS_PERIOD_TABS as PERIOD_TABS, DRIVER_EARNINGS_CHART_DATA as CHART_DATA, DRIVER_EARNINGS_RIDE_HISTORY as RIDE_HISTORY } from '../../config/staticData';

export default function DriverEarningsScreen() {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);
  const { colors } = useApp();
  const { openDrawer } = useSidebar();
  const { showToast } = useToast();
  const { earningsData, earningsLoading } = useSelector(state => state.driver);

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle?.(colors.isDark ? 'light-content' : 'dark-content');
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor?.('transparent');
        StatusBar.setTranslucent?.(true);
      }
    }, [colors.isDark])
  );

  const [activeTab, setActiveTab] = useState('Week');
  const [selectedBarIdx, setSelectedBarIdx] = useState(4); // Default Fri

  useEffect(() => {
    dispatch(fetchDriverEarnings({ period: activeTab.toLowerCase() }));
  }, [dispatch, activeTab]);

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
        barStyle={colors.isDark ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />

      {/* Top Header */}
      <View
        style={[
          styles.header,
          { paddingTop: insets.top > 0 ? insets.top : 8 },
        ]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Open menu"
            onPress={openDrawer}
            style={styles.menuBtn}>
            <Feather name="menu" size={20} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Earnings</Text>
        </View>

        <TouchableOpacity activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Download Statement"
          onPress={handleDownloadStatement}
          style={styles.statementBtn}>
          <Lucide name="file-text" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Period Selector Tabs */}
        <View style={styles.periodTabsContainer}>
          {PERIOD_TABS.map(tab => {
            const isActive = tab === activeTab;
            return (
              <TouchableOpacity activeOpacity={0.7}
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
              </TouchableOpacity>
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
              {CHART_DATA.map((item, idx) => {
                const isSelected = idx === selectedBarIdx;
                return (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    key={idx}
                    style={styles.barCol}
                    onPress={() => setSelectedBarIdx(idx)}
                    accessibilityRole="button"
                    accessibilityLabel={`${item.day} earnings ${item.amount}`}>
                    {isSelected && (
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
                        isSelected && styles.barActive,
                      ]}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.dayLabelsRow}>
              {CHART_DATA.map((item, idx) => {
                const isSelected = idx === selectedBarIdx;
                return (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => setSelectedBarIdx(idx)}
                    activeOpacity={0.7}>
                    <Text
                      style={[
                        styles.dayLabel,
                        isSelected && styles.dayLabelActive,
                      ]}>
                      {item.day}
                    </Text>
                  </TouchableOpacity>
                );
              })}
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
