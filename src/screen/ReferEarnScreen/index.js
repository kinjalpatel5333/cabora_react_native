import React from 'react';
import {
  ScrollView,
  Share,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@react-native-vector-icons/feather/static';
import { Lucide } from '@react-native-vector-icons/lucide/static';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons/static';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useToast } from '../../components/Toast';
import useThemedStyles from '../../components/useThemedStyles';
import { useApp } from '../../context/AppContext';
import createStyles from './style';

const REFERRAL_CODE = 'ANANYA240';

export default function ReferEarnScreen() {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);
  const { colors, isDark } = useApp();
  const navigation = useNavigation();
  const { showToast } = useToast();

  const handleCopyCode = () => {
    showToast({
      type: 'success',
      message: `Referral code ${REFERRAL_CODE} copied to clipboard!`,
    });
  };

  const handleShareInvite = async () => {
    try {
      await Share.share({
        message: `Use my referral code ${REFERRAL_CODE} to get ₹100 off your first ride on Cabora! Download now: https://cabora.app`,
      });
    } catch {
      showToast({
        type: 'info',
        message: 'Share invite opened',
      });
    }
  };

  const handleReadTerms = () => {
    showToast({
      type: 'info',
      message: 'Referral bonus is credited on friend’s completed ride.',
    });
  };

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 6 }]}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.headerBtn}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={8}>
          <Feather
            name="arrow-left"
            size={22}
            color={isDark ? colors.white : '#111827'}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Refer & earn</Text>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.headerBtn}
          onPress={handleShareInvite}
          accessibilityRole="button"
          accessibilityLabel="Share"
          hitSlop={8}>
          <Feather
            name="share"
            size={20}
            color={isDark ? colors.white : '#111827'}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: Math.max(insets.bottom, 20) + 90 },
        ]}>
        {/* Banner / Hero Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroAccentCircle} />
          <View style={styles.heroAccentCircle2} />

          <View style={styles.heroContent}>
            <Text style={styles.heroHeading}>Give ₹100, get ₹100</Text>
            <Text style={styles.heroSub}>
              Your friend gets ₹100 off their first ride. You get ₹100 in your
              wallet once they finish it.
            </Text>
          </View>

          <View style={styles.earnedBadge}>
            <Lucide name="wallet" size={16} color="#FF7A00" />
            <Text style={styles.earnedBadgeText}>₹300 earned</Text>
          </View>
        </View>

        {/* Card 1: YOUR CODE */}
        <View style={styles.card}>
          <Text style={styles.codeCardLabel}>YOUR CODE</Text>
          <View style={styles.codeRow}>
            <Text style={styles.codeValueText}>{REFERRAL_CODE}</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.copyBtn}
              onPress={handleCopyCode}
              accessibilityRole="button"
              accessibilityLabel="Copy code">
              <Text style={styles.copyBtnText}>Copy</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.codeCardSub}>
            Share on WhatsApp, SMS or anywhere else
          </Text>
        </View>

        {/* Card 2: Stats Grid */}
        <View style={styles.card}>
          <View style={styles.statsRow}>
            <View style={styles.statCol}>
              <Text style={styles.statValue}>3</Text>
              <Text style={styles.statLabel}>Friends joined</Text>
            </View>
            <View style={styles.statCol}>
              <Text style={styles.statValue}>1</Text>
              <Text style={styles.statLabel}>Ride pending</Text>
            </View>
            <View style={styles.statCol}>
              <Text style={styles.statValue}>₹300</Text>
              <Text style={styles.statLabel}>Earned</Text>
            </View>
          </View>
          <View style={styles.statDivider} />
          <Text style={styles.statUnlockText}>
            ₹100 unlocks when your pending friend completes a ride
          </Text>
        </View>

        {/* Card 3: HOW IT WORKS */}
        <View style={styles.card}>
          <Text style={styles.stepsHeader}>HOW IT WORKS</Text>

          {/* Step 1 */}
          <View style={styles.stepItem}>
            <View style={styles.stepIconBox}>
              <Feather name="upload" size={18} color="#FF7A00" />
            </View>
            <View style={styles.stepTextWrap}>
              <Text style={styles.stepTitle}>Share your code</Text>
              <Text style={styles.stepSub}>
                Send it to anyone who has not used Cabora
              </Text>
            </View>
          </View>

          {/* Step 2 */}
          <View style={styles.stepItem}>
            <View style={styles.stepIconBox}>
              <Lucide name="car" size={18} color="#FF7A00" />
            </View>
            <View style={styles.stepTextWrap}>
              <Text style={styles.stepTitle}>They ride</Text>
              <Text style={styles.stepSub}>
                ₹100 comes off their first fare automatically
              </Text>
            </View>
          </View>

          {/* Step 3 */}
          <View style={[styles.stepItem, styles.stepItemLast]}>
            <View style={styles.stepIconBox}>
              <Lucide name="wallet" size={18} color="#FF7A00" />
            </View>
            <View style={styles.stepTextWrap}>
              <Text style={styles.stepTitle}>You get paid</Text>
              <Text style={styles.stepSub}>
                ₹100 lands in your wallet the same day
              </Text>
            </View>
          </View>
        </View>

        {/* Footer / Terms */}
        <View style={styles.termsWrap}>
          <Text style={styles.termsText}>
            Referral terms apply · max ₹2,000 per year
          </Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleReadTerms}
            accessibilityRole="button">
            <Text style={styles.termsLink}>Read terms</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Floating Bottom Action */}
      <View
        style={[
          styles.footer,
          { paddingBottom: Math.max(insets.bottom, 14) },
        ]}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.shareBtn}
          onPress={handleShareInvite}
          accessibilityRole="button"
          accessibilityLabel="Share invite">
          <Text style={styles.shareBtnText}>Share invite</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
