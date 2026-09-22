import React from 'react';
import {
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@react-native-vector-icons/feather/static';
import { Lucide } from '@react-native-vector-icons/lucide/static';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../components/Toast';
import useThemedStyles from '../../components/useThemedStyles';
import createStyles from './style';
import colors from '../../config/color';

const COMPLETED_INCENTIVES = [
  {
    id: '1',
    title: 'Daily 8-ride target',
    date: 'Yesterday',
    amount: '₹200',
    status: 'paid',
    statusLabel: 'Paid',
  },
  {
    id: '2',
    title: 'Airport queue bonus',
    date: '09 Sep',
    amount: '₹150',
    status: 'paid',
    statusLabel: 'Paid',
  },
  {
    id: '3',
    title: 'Rainy hour bonus',
    date: '07 Sep',
    amount: '₹250',
    status: 'processing',
    statusLabel: 'Processing',
  },
];

export default function DriverIncentiveTrackerScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { colors } = useApp();
  const styles = useThemedStyles(createStyles);
  const { showToast } = useToast();

  const handleHelp = () => {
    showToast({
      title: 'Incentive Guidelines',
      message: 'Bonuses are credited directly to your Cabora Wallet daily.',
      type: 'info',
    });
  };

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('MainTabs');
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.white}
        translucent={false}
      />

      {/* Header Bar */}
      <View
        style={[
          styles.header,
          { paddingTop: insets.top > 0 ? insets.top : 8 },
        ]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={handleBack}
          style={styles.headerIconBtn}>
          <Feather name="arrow-left" size={22} color={colors.slate[900]} />
        </Pressable>

        <Text style={styles.headerTitle}>Incentives</Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Help"
          onPress={handleHelp}
          style={styles.headerIconBtn}>
          <Feather name="help-circle" size={22} color={colors.slate[900]} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Top Navy Earned Card */}
        <View style={styles.navyCard}>
          <View style={styles.navyDeco} />
          <Text style={styles.navyKicker}>
            EARNED FROM INCENTIVES THIS WEEK
          </Text>
          <Text style={styles.navyAmount}>₹1,850</Text>
          <Text style={styles.navySub}>
            ₹1,200 more available before Sunday
          </Text>
        </View>

        {/* ACTIVE NOW Section */}
        <Text style={styles.sectionTitle}>ACTIVE NOW</Text>

        {/* Card 1: Weekend Surge Streak */}
        <View style={styles.activeCard}>
          <View style={styles.activeHead}>
            <View style={styles.activeLeft}>
              <View style={styles.iconBox}>
                <Lucide name="gift" size={20} color={colors.primary} />
              </View>
              <View style={styles.activeInfo}>
                <Text style={styles.activeTitle}>Weekend surge streak</Text>
                <Text style={styles.activeSub}>18 rides by Sun 23:59</Text>
              </View>
            </View>
            <View style={styles.amberPill}>
              <View style={styles.amberDot} />
              <Text style={styles.amberText}>2 days left</Text>
            </View>
          </View>

          <View style={styles.progressMetaRow}>
            <Text style={styles.progressCount}>12 / 18</Text>
            <Text style={styles.rewardText}>reward ₹600</Text>
          </View>

          <View style={styles.track}>
            <View
              style={[
                styles.fill,
                { width: `${Math.round((12 / 18) * 100)}%` },
              ]}
            />
          </View>

          <Text style={styles.cardBottomHint}>
            6 more rides unlocks ₹600
          </Text>
        </View>

        {/* Card 2: Morning Peak Bonus */}
        <View style={styles.activeCard}>
          <View style={styles.activeHead}>
            <View style={styles.activeLeft}>
              <View style={styles.iconBox}>
                <Feather name="sun" size={20} color={colors.primary} />
              </View>
              <View style={styles.activeInfo}>
                <Text style={styles.activeTitle}>Morning peak bonus</Text>
                <Text style={styles.activeSub}>₹30 extra per ride, 7–10 am</Text>
              </View>
            </View>
            <View style={styles.amberPill}>
              <View style={styles.amberDot} />
              <Text style={styles.amberText}>ends today</Text>
            </View>
          </View>

          <View style={styles.progressMetaRow}>
            <Text style={styles.progressCount}>6 / 10</Text>
            <Text style={styles.rewardText}>reward ₹300</Text>
          </View>

          <View style={styles.track}>
            <View
              style={[
                styles.fill,
                { width: `${Math.round((6 / 10) * 100)}%` },
              ]}
            />
          </View>

          <Text style={styles.cardBottomHint}>
            4 more peak rides unlocks ₹300
          </Text>
        </View>

        {/* COMPLETED Section */}
        <Text style={styles.sectionTitle}>COMPLETED</Text>

        <View style={styles.completedCard}>
          {COMPLETED_INCENTIVES.map((item, idx) => {
            const isLast = idx === COMPLETED_INCENTIVES.length - 1;
            const isPaid = item.status === 'paid';

            return (
              <View
                key={item.id}
                style={[
                  styles.completedItem,
                  !isLast && styles.itemBorder,
                ]}>
                <View style={styles.itemLeft}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.itemDate}>{item.date}</Text>
                </View>

                <View style={styles.itemRight}>
                  <Text
                    style={[
                      styles.itemAmount,
                      !isPaid && styles.itemAmountPending,
                    ]}>
                    {item.amount}
                  </Text>
                  <View
                    style={[
                      styles.statusBadge,
                      isPaid ? styles.badgePaid : styles.badgeProcessing,
                    ]}>
                    <View
                      style={
                        isPaid
                          ? styles.statusDotPaid
                          : styles.statusDotProcessing
                      }
                    />
                    <Text
                      style={
                        isPaid
                          ? styles.statusTextPaid
                          : styles.statusTextProcessing
                      }>
                      {item.statusLabel}
                    </Text>
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
