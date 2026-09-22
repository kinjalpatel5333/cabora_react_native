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
import { useToast } from '../../components/Toast';
import useThemedStyles from '../../components/useThemedStyles';
import { useApp } from '../../context/AppContext';
import createStyles from './style';
import colors from '../../config/color';

export default function DriverAirportTripSummaryScreen() {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);
  const { colors } = useApp();
  const navigation = useNavigation();
  const { showToast } = useToast();

  const handleDone = () => {
    showToast({
      title: 'Trip Finalized',
      message: 'Trip summary saved to your driver history.',
      type: 'success',
    });
    navigation.navigate('DriverTabs');
  };

  const handleHelp = () => {
    showToast({
      title: 'Airport Charges Help',
      message: 'Airport fees and waiting reimbursements guide.',
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

      {/* Top Header */}
      <View style={[styles.header, { paddingTop: insets.top > 0 ? insets.top : 8 }]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={handleBack}
          style={styles.headerBtn}>
          <Feather name="arrow-left" size={22} color={colors.slate[900]} />
        </Pressable>

        <Text style={styles.headerTitle}>Trip summary</Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Help"
          onPress={handleHelp}
          style={styles.headerBtn}>
          <Lucide name="circle-help" size={22} color={colors.slate[900]} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Top Earning Navy Card */}
        <View style={styles.earningCard}>
          <View style={styles.earningCircleBg} />
          <Text style={styles.earningLabel}>YOU EARNED FROM THIS TRIP</Text>
          <Text style={styles.earningAmount}>₹1,284</Text>
          <Text style={styles.earningSub}>
            ₹340 of it is airport charges passed to you
          </Text>
        </View>

        {/* Route Card */}
        <View style={styles.routeCard}>
          <View style={styles.routeTopRow}>
            <View style={styles.routeIconWrap}>
              <Lucide name="navigation" size={20} color={colors.slate[900]} />
            </View>
            <View style={styles.routeTextWrap}>
              <Text style={styles.routeTitle}>CBR-88214 · airport drop</Text>
              <Text style={styles.routeSub} numberOfLines={1}>
                Indiranagar → BLR Terminal 2 · 38.4 km · 52 min
              </Text>
            </View>
          </View>

          <View style={styles.cardDivider} />

          <View style={styles.routeBottomRow}>
            <Text style={styles.completedText}>Completed today, 07:22</Text>
            <View style={styles.paidOnlineBadge}>
              <View style={styles.paidDot} />
              <Text style={styles.paidText}>Paid online</Text>
            </View>
          </View>
        </View>

        {/* Section Title */}
        <Text style={styles.sectionHeader}>AIRPORT CHARGES</Text>

        {/* Airport Charges Breakdown Card */}
        <View style={styles.chargesCard}>
          {/* Item 1 */}
          <View style={styles.chargeItem}>
            <View style={styles.chargeRow}>
              <Text style={styles.chargeName}>Queue waiting (38 min)</Text>
              <Text style={styles.chargeValue}>₹114</Text>
            </View>
            <Text style={styles.chargeSub}>₹3 per minute after 10 free</Text>
          </View>

          {/* Item 2 */}
          <View style={[styles.chargeItem, styles.chargeItemSpaced]}>
            <View style={styles.chargeRow}>
              <Text style={styles.chargeName}>Airport entry fee</Text>
              <Text style={styles.chargeValue}>₹150</Text>
            </View>
            <Text style={styles.chargeSub}>charged by the airport operator</Text>
          </View>

          {/* Item 3 */}
          <View style={[styles.chargeItem, styles.chargeItemSpaced]}>
            <View style={styles.chargeRow}>
              <Text style={styles.chargeName}>Parking reimbursement</Text>
              <Text style={styles.chargeValue}>₹110</Text>
            </View>
            <Text style={styles.chargeSub}>receipt uploaded and approved</Text>
          </View>

          {/* Item 4 */}
          <View style={[styles.chargeItem, styles.chargeItemSpaced]}>
            <View style={styles.chargeRow}>
              <Text style={styles.chargeName}>Terminal pickup surcharge</Text>
              <Text style={styles.chargeValue}>₹80</Text>
            </View>
            <Text style={styles.chargeSub}>paid fully to you</Text>
          </View>
        </View>

        {/* Added to Your Trip Earnings Banner */}
        <View style={styles.addedBanner}>
          <View style={styles.addedLeft}>
            <Text style={styles.addedTitle}>Added to your trip earnings</Text>
            <Text style={styles.addedSub}>Settled with your next payout</Text>
          </View>
          <Text style={styles.addedAmount}>₹454</Text>
        </View>

        {/* Info Tip Box */}
        <View style={styles.tipBox}>
          <Feather name="info" size={17} color={colors.slate[500]} />
          <Text style={styles.tipText}>
            Waiting time is counted from when you enter the holding area.
          </Text>
        </View>
      </ScrollView>

      {/* Fixed Footer */}
      <View
        style={[
          styles.footer,
          { paddingBottom: Math.max(insets.bottom, 12) + 4 },
        ]}>
          <Pressable
            accessibilityRole="button"
            onPress={handleDone}
            style={styles.doneBtn}>
            <Text style={styles.doneBtnText}>Done</Text>
          </Pressable>
      </View>
    </View>
  );
}
