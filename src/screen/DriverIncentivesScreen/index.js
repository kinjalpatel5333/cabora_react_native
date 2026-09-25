import React, { useEffect, useCallback } from 'react';
import { ScrollView, Text, View, TouchableOpacity, Image, StatusBar, Platform } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Feather } from '@react-native-vector-icons/feather/static';
import { Lucide } from '@react-native-vector-icons/lucide/static';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDriverIncentives } from '../../redux/slices/driverSlice';
import { images } from '../../assets';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../components/Toast';
import useThemedStyles from '../../components/useThemedStyles';
import { useSidebar } from '../../context/SidebarContext';
import createStyles from './style';
import colors from '../../config/color';

import { DRIVER_REFERRALS as REFERRALS } from '../../config/staticData';

export default function DriverIncentivesScreen() {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const { colors } = useApp();
  const styles = useThemedStyles(createStyles);
  const { openDrawer } = useSidebar();
  const { showToast } = useToast();
  const { incentivesData, incentivesLoading } = useSelector(state => state.driver);

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle('light-content');
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor('transparent');
        StatusBar.setTranslucent(true);
      }
    }, []),
  );

  useEffect(() => {
    dispatch(fetchDriverIncentives());
  }, [dispatch]);

  const referralCode = 'CAB-RK4821';
  const totalSegments = 5;
  const filledSegments = 3;

  const handleCopyCode = () => {
    showToast({
      title: 'Referral Code Copied',
      message: `${referralCode} copied to clipboard!`,
      type: 'success',
    });
  };

  const handleShareCode = () => {
    showToast({
      title: 'Share Referral Code',
      message: `Sharing code ${referralCode} with other drivers...`,
      type: 'info',
    });
  };

  const getAvatarColors = colorKey => {
    if (colorKey === 'blue') {
      return { bg: colors.blue[50], color: colors.blue[550] };
    }
    if (colorKey === 'purple') {
      return { bg: colors.purple[100], color: colors.purple[600] };
    }
    return { bg: colors.orange[175], color: colors.primary };
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ScrollView
        stickyHeaderIndices={[0]}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 140 },
        ]}
        showsVerticalScrollIndicator={false}>
        {/* Navy Hero Header */}
        <View
          style={[
            styles.navyHero,
            { paddingTop: insets.top > 0 ? insets.top : 12 },
          ]}>
          <Image
            source={images.loginGlow}
            style={styles.glow}
            resizeMode="cover"
            pointerEvents="none"
          />

          <TouchableOpacity activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Open menu"
            onPress={openDrawer}
            style={styles.menuBtn}>
            <Feather name="menu" size={20} color={colors.white} />
          </TouchableOpacity>

          <View style={styles.giftBadge}>
            <Lucide name="gift" size={24} color={colors.white} />
          </View>

          <Text style={styles.heroTitle}>Refer a driver,{'\n'}earn ₹1,000</Text>
          <Text style={styles.heroSub}>
            They get ₹500 after 10 trips. You get ₹1,000 once they finish 25.
          </Text>
        </View>

        {/* Dashed Code Card */}
        <View style={styles.codeCard}>
          <View style={styles.codeLeft}>
            <Text style={styles.codeLabel}>YOUR CODE</Text>
            <Text style={styles.codeValue}>{referralCode}</Text>
          </View>
          <TouchableOpacity activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Copy code"
            onPress={handleCopyCode}
            style={styles.copyBtn}>
            <Lucide name="copy" size={15} color={colors.primary} />
            <Text style={styles.copyText}>Copy</Text>
          </TouchableOpacity>
        </View>

        {/* Referral Milestone Card */}
        <View style={styles.milestoneCard}>
          <View style={styles.milestoneHead}>
            <View style={styles.milestoneTitleRow}>
              <Lucide name="gift" size={16} color={colors.primary} />
              <Text style={styles.milestoneTitle}>Referral milestone</Text>
            </View>
            <View style={styles.inProgressBadge}>
              <View style={styles.inProgressDot} />
              <Text style={styles.inProgressText}>In progress</Text>
            </View>
          </View>

          <View style={styles.milestoneStats}>
            <Text style={styles.milestoneDrivers}>3 of 5 drivers</Text>
            <Text style={styles.milestoneReward}>₹5,000</Text>
          </View>

          <View style={styles.trackRow}>
            {Array.from({ length: totalSegments }).map((_, idx) => (
              <View
                key={idx}
                style={[
                  styles.segment,
                  idx < filledSegments && styles.segmentFilled,
                ]}
              />
            ))}
          </View>

          <Text style={styles.milestoneSub}>
            2 more approved drivers unlocks the ₹5,000 milestone
          </Text>
        </View>

        {/* Your Referrals Section */}
        <Text style={styles.sectionTitle}>YOUR REFERRALS</Text>

        <View style={styles.referralsCard}>
          {REFERRALS.map((ref, idx) => {
            const isLast = idx === REFERRALS.length - 1;
            const isPaid = ref.status === 'paid';
            const avatarColor = getAvatarColors(ref.colorKey);

            return (
              <View
                key={ref.id}
                style={[styles.referralItem, !isLast && styles.referralBorder]}>
                <View style={styles.referralLeft}>
                  <View
                    style={[
                      styles.avatarCircle,
                      { backgroundColor: avatarColor.bg },
                    ]}>
                    <Text style={[styles.avatarText, { color: avatarColor.color }]}>
                      {ref.initials}
                    </Text>
                  </View>
                  <View style={styles.referralInfo}>
                    <Text style={styles.referralName}>{ref.name}</Text>
                    <Text style={styles.referralSub}>{ref.sub}</Text>
                  </View>
                </View>

                <View style={styles.referralRight}>
                  <Text style={styles.referralAmount}>{ref.amount}</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      isPaid
                        ? styles.statusBadgePaid
                        : styles.statusBadgeProgress,
                    ]}>
                    <View
                      style={
                        isPaid
                          ? styles.statusDotPaid
                          : styles.statusDotProgress
                      }
                    />
                    <Text
                      style={
                        isPaid
                          ? styles.statusTextPaid
                          : styles.statusTextProgress
                      }>
                      {ref.statusLabel}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Share My Code Floating Button */}
      <View
        style={[
          styles.shareBtnWrap,
          { paddingBottom: Math.max(insets.bottom, 10) + 74 },
        ]}>
        <TouchableOpacity activeOpacity={0.7}
          accessibilityRole="button"
          onPress={handleShareCode}
          style={styles.shareBtn}>
          <Text style={styles.shareBtnText}>Share my code</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
