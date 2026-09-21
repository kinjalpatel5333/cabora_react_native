import React from 'react';
import {
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@react-native-vector-icons/ant-design/static';
import { Feather } from '@react-native-vector-icons/feather/static';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../components/Toast';
import useThemedStyles from '../../components/useThemedStyles';
import createStyles from './style';

const PRO_BENEFITS = [
  'Unlimited rides every week',
  '12% commission after 40 rides',
  'Priority ride matching',
  'Daily payouts before 6 pm',
  'Priority support within 4 hours',
];

export default function DriverSubscriptionScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { colors } = useApp();
  const styles = useThemedStyles(createStyles);
  const { showToast } = useToast();

  const completedRides = 34;
  const targetRides = 40;
  const progressPercent = Math.min(
    100,
    Math.round((completedRides / targetRides) * 100),
  );

  const handleChangePlan = () => {
    showToast({
      title: 'Subscription Plans',
      message: 'Explore our Daily, Weekly, and Annual Pro plans.',
      type: 'info',
    });
  };

  const handleCancelSubscription = () => {
    showToast({
      title: 'Cancel Subscription',
      message: 'Your Pro plan will remain active until 14 Sep 2026.',
      type: 'warning',
    });
  };

  const handleChangeBank = () => {
    showToast({
      title: 'Payment Method',
      message: 'Manage auto-debit bank accounts and cards.',
      type: 'info',
    });
  };

  const handleHelp = () => {
    showToast({
      title: 'Subscription FAQs',
      message: 'Learn more about threshold bonuses and commission rates.',
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

        <Text style={styles.headerTitle}>My subscription</Text>

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
        {/* Navy Pro Plan Card */}
        <View style={styles.navyCard}>
          <View style={styles.navyDeco} />
          <View style={styles.proBadge}>
            <View style={styles.proDot} />
            <Text style={styles.proBadgeText}>Pro plan</Text>
          </View>

          <Text style={styles.priceText}>₹499</Text>
          <Text style={styles.subText}>per month · auto-renews</Text>

          <View style={styles.divider} />

          <View style={styles.metaRow}>
            <View style={styles.metaCol}>
              <Text style={styles.metaLabel}>RENEWS ON</Text>
              <Text style={styles.metaValue}>14 Sep 2026</Text>
            </View>

            <View style={styles.metaCol}>
              <Text style={styles.metaLabel}>IN</Text>
              <Text style={styles.metaValue}>3 days</Text>
            </View>
          </View>
        </View>

        {/* Commission-Free Threshold Card */}
        <View style={styles.thresholdCard}>
          <View style={styles.thresholdHead}>
            <View>
              <Text style={styles.thresholdTitle}>
                Commission-free threshold
              </Text>
              <Text style={styles.thresholdSub}>Rides completed this week</Text>
            </View>
            <Text style={styles.thresholdCount}>
              {completedRides} / {targetRides}
            </Text>
          </View>

          <View style={styles.progressTrack}>
            <View
              style={[styles.progressFill, { width: `${progressPercent}%` }]}
            />
          </View>

          <View style={styles.hintRow}>
            <Feather
              name="info"
              size={14}
              color={colors.slate[500]}
              style={styles.hintIcon}
            />
            <Text style={styles.hintText}>
              6 more rides this week and your commission drops from 20% to 12%.
            </Text>
          </View>
        </View>

        {/* What Pro Gives You Card */}
        <View style={styles.benefitsCard}>
          <Text style={styles.benefitsTitle}>What Pro gives you</Text>

          <View style={styles.benefitList}>
            {PRO_BENEFITS.map((benefit, idx) => (
              <View key={idx} style={styles.benefitItem}>
                <AntDesign name="check-circle" size={16} color={colors.green[600]} />
                <Text style={styles.benefitText}>{benefit}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Bank Account Auto-Debit Card */}
        <View style={styles.bankCard}>
          <View style={styles.bankLeft}>
            <Feather name="credit-card" size={20} color={colors.slate[900]} />
            <View style={styles.bankInfo}>
              <Text style={styles.bankName}>HDFC ••••4821</Text>
              <Text style={styles.bankSub}>Auto-debit on the 14th</Text>
            </View>
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={handleChangeBank}>
            <Text style={styles.changeText}>Change</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Bottom Sticky Action Bar */}
      <View
        style={[
          styles.bottomBar,
          { paddingBottom: Math.max(insets.bottom, 12) },
        ]}>
        <Pressable
          accessibilityRole="button"
          onPress={handleChangePlan}
          style={styles.changePlanBtn}>
          <Text style={styles.changePlanText}>Change plan</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          onPress={handleCancelSubscription}
          style={styles.cancelBtn}>
          <Text style={styles.cancelText}>Cancel subscription</Text>
        </Pressable>
      </View>
    </View>
  );
}
