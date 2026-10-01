import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { AntDesign } from '@react-native-vector-icons/ant-design/static';
import { Feather } from '@react-native-vector-icons/feather/static';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../components/Toast';
import useThemedStyles from '../../components/useThemedStyles';
import createStyles from './style';
import {
  DRIVER_VERIFICATION_TIMELINE as TIMELINE,
  DRIVER_VERIFICATION_CHECKING as CHECKING_ITEMS,
  DRIVER_REJECTION_ITEMS as REJECTION_ITEMS,
} from '../../config/staticData';
import { Button, Header } from '../../components';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchDriverKycStatus } from '../../redux/slices/driverSlice';

const SUPPORT_URL = 'mailto:support@wagvaa.app';

export default function DriverVerificationStatusScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const { colors } = useApp();
  const styles = useThemedStyles(createStyles);
  const { showToast } = useToast();
  const dispatch = useAppDispatch();

  const driverKycData = useAppSelector(state => state?.driver?.kycData);
  const authUser = useAppSelector(state => state?.auth?.user);
  const kycData = driverKycData || authUser?.driver || authUser;

  // Mode: 'in_progress' | 'rejected'
  const [statusMode, setStatusMode] = useState(route?.params?.mode || 'in_progress');

  const FIFTEEN_MINUTES_SEC = 15 * 60; // 15 minutes = 900 seconds
  const [redirectSeconds, setRedirectSeconds] = useState(FIFTEEN_MINUTES_SEC);

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchDriverKycStatus()).catch(() => { });
    }, [dispatch]),
  );

  // Platform & KYC Status parsing
  const platform = kycData?.platform || {};
  const rawKycStatus = String(
    platform.kycStatus || platform.onboardingStatus || kycData?.status || '',
  ).toUpperCase();

  const isApproved = rawKycStatus === 'APPROVED' || rawKycStatus === 'VERIFIED';
  const isRejected = rawKycStatus === 'REJECTED' || rawKycStatus === 'FAILED';

  useEffect(() => {
    if (isApproved) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'DriverTabs' }],
      });
    } else if (isRejected) {
      setStatusMode('rejected');
    } else {
      setStatusMode('in_progress');
    }
  }, [isApproved, isRejected, navigation]);

  // Dynamic Timeline Items based on KYC Data
  const timelineItems = useMemo(() => {
    const completedCount = kycData?.completedStepsCount || 0;
    const isSubmitted = completedCount > 0;

    return [
      {
        id: '1',
        title: 'Application submitted',
        time: isSubmitted ? 'Submitted' : 'Pending',
        status: isSubmitted ? 'done' : 'active',
      },
      {
        id: '2',
        title: 'Document authenticity',
        time: isApproved ? 'Verified' : 'In review',
        status: isApproved ? 'done' : 'active',
      },
      {
        id: '3',
        title: 'Vehicle and RC match',
        time: isApproved ? 'Verified' : completedCount >= 3 ? 'In review' : 'Queued',
        status: isApproved ? 'done' : completedCount >= 3 ? 'active' : 'pending',
      },
      {
        id: '4',
        title: 'Final approval',
        time: isApproved ? 'Approved' : 'Queued',
        status: isApproved ? 'done' : 'pending',
      },
    ];
  }, [kycData, isApproved]);

  // Dynamic Checking Items based on KYC Data
  const checkingList = useMemo(() => {
    const personalDone = Boolean(kycData?.personal?.isCompleted);
    const dlDone = Boolean(kycData?.drivingLicence?.isCompleted);
    const vehicleDone = Boolean(kycData?.vehicle?.isCompleted);
    const insuranceDone = Boolean(kycData?.insurance?.isCompleted);
    const payoutDone = Boolean(kycData?.payout?.isCompleted);

    return [
      {
        id: 'personal',
        title: 'Personal details',
        status: personalDone ? 'verified' : 'checking',
        pill: personalDone ? 'Verified' : 'Pending',
      },
      {
        id: 'dl',
        title: 'Driving licence',
        status: dlDone ? 'verified' : 'checking',
        pill: dlDone ? 'Verified' : 'Pending',
      },
      {
        id: 'vehicle',
        title: 'Vehicle & RC details',
        status: vehicleDone ? 'verified' : 'checking',
        pill: vehicleDone ? 'Verified' : 'Pending',
      },
      {
        id: 'insurance',
        title: 'Insurance policy',
        status: insuranceDone ? 'verified' : 'checking',
        pill: insuranceDone ? 'Verified' : 'Pending',
      },
      {
        id: 'payout',
        title: 'Bank & payout details',
        status: payoutDone ? 'checking' : 'pending',
        pill: 'Pending',
      },
    ];
  }, [kycData]);

  // Rejection Items parsing if any documents are rejected
  const rejectionList = useMemo(() => {
    const docs = Array.isArray(kycData?.documents) ? kycData.documents : [];
    const rejectedDocs = docs.filter(
      d => d?.status?.toUpperCase() === 'REJECTED' || d?.status?.toUpperCase() === 'FAILED',
    );

    if (rejectedDocs.length > 0) {
      return rejectedDocs.map(d => ({
        id: d.documentType,
        title: String(d.documentType).replace('_', ' '),
        reason: platform.rejectionReason || 'Document unreadable or invalid.',
        btnLabel: 'Re-upload',
      }));
    }

    return REJECTION_ITEMS;
  }, [kycData, platform]);

  // 15-Minute Countdown Timer to auto-redirect to Driver Home (DriverTabs)
  useEffect(() => {
    if (statusMode !== 'in_progress') {
      return undefined;
    }

    const timer = setInterval(() => {
      setRedirectSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          navigation.reset({
            index: 0,
            routes: [{ name: 'DriverTabs' }],
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [statusMode, navigation]);

  const formatCountdown = seconds => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  };

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('DriverTabs');
    }
  };

  const handleContactSupport = () => {
    Linking.openURL(SUPPORT_URL).catch(() => {
      showToast({
        type: 'info',
        title: 'Support Email',
        message: 'Reach out to support@wagvaa.app for verification help.',
      });
    });
  };

  const handleFixItem = () => {
    navigation.navigate('UploadDocuments');
  };

  const renderInProgress = () => (
    <View>
      {/* Top Status Banner */}
      <View style={styles.statusCardInProgress}>
        <View style={styles.statusTopRow}>
          <View style={styles.statusIconWrapProgress}>
            <Feather name="sun" size={22} color="#D97706" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.statusTitleProgress}>Verification in progress</Text>
            <Text style={styles.statusSubtextProgress}>
              Submitted & awaiting verification
            </Text>
          </View>
        </View>

        <View style={styles.statusDividerProgress} />

        <View style={styles.pillsRow}>
          <View style={styles.pillCol}>
            <Text style={styles.pillLabel}>KYC status</Text>
            <View style={styles.pillValueReview}>
              <Text style={styles.pillValueReviewText}>
                {platform?.kycStatus || kycData?.status || 'Under review'}
              </Text>
            </View>
          </View>
          <View style={styles.pillCol}>
            <Text style={styles.pillLabel}>Account status</Text>
            <View style={styles.pillValueGray}>
              <Text style={styles.pillValueGrayText}>
                {platform?.accountStatus === 'ACTIVE' ? 'Active' : 'Pending activation'}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* 15-Minute Auto-Redirect Banner */}
      <View style={{
        backgroundColor: colors.isDark ? colors.alpha.orange18 : '#FFF7ED',
        borderColor: colors.orange[400],
        borderWidth: 1,
        borderRadius: 16,
        padding: 14,
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
          <Feather name="clock" size={20} color={colors.orange[500]} />
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: colors.fonts.sora.bold, fontSize: 13, color: colors.text }}>
              Auto-redirect in {formatCountdown(redirectSeconds)}
            </Text>
            <Text style={{ fontFamily: colors.fonts.sora.regular, fontSize: 12, color: colors.muted }}>
              Directing to Driver Home screen
            </Text>
          </View>
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.reset({ index: 0, routes: [{ name: 'DriverTabs' }] })}
          style={{
            backgroundColor: colors.orange[500],
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 12,
          }}>
          <Text style={{ fontFamily: colors.fonts.sora.bold, fontSize: 12, color: '#FFFFFF' }}>
            Skip Now →
          </Text>
        </TouchableOpacity>
      </View>

      {/* Verification Timeline */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionHeader}>VERIFICATION TIMELINE</Text>
        <View style={styles.timelineContainer}>
          {timelineItems.map((item, idx) => {
            const isDone = item.status === 'done';
            const isActive = item.status === 'active';
            const isLast = idx === timelineItems.length - 1;

            return (
              <View key={item.id} style={styles.timelineRow}>
                <View style={styles.timelineIndicatorWrap}>
                  {!isLast && (
                    <View
                      style={[
                        styles.timelineLine,
                        isDone && styles.timelineLineDone,
                      ]}
                    />
                  )}
                  {isDone ? (
                    <View style={styles.timelineDotDone} />
                  ) : isActive ? (
                    <View style={styles.timelineDotActive}>
                      <View style={styles.timelineDotActiveInner} />
                    </View>
                  ) : (
                    <View style={styles.timelineDotPending} />
                  )}
                </View>

                <View style={styles.timelineCopy}>
                  <Text
                    style={[
                      styles.timelineTitle,
                      !isDone && !isActive && styles.timelineTitlePending,
                    ]}>
                    {item.title}
                  </Text>
                  <Text
                    style={
                      isActive
                        ? styles.timelineTimeActive
                        : isDone
                          ? styles.timelineTime
                          : styles.timelineTimePending
                    }>
                    {item.time}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>

      {/* What We Are Checking */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionHeader}>WHAT WE ARE CHECKING</Text>
        {checkingList.map(item => {
          const isVerified = item.status === 'verified';
          const isChecking = item.status === 'checking' || item.status === 'transfer';

          return (
            <View key={item.id} style={styles.checkItemRow}>
              <View style={styles.checkItemLeft}>
                {isVerified ? (
                  <AntDesign name="check-circle" size={18} color="#16A34A" />
                ) : isChecking ? (
                  <Feather name="sun" size={18} color="#D97706" />
                ) : (
                  <Feather name="clock" size={18} color="#64748B" />
                )}
                <Text style={styles.checkItemTitle}>{item.title}</Text>
              </View>
              <View style={isVerified ? styles.pillGreen : styles.pillOrange}>
                <Text style={isVerified ? styles.pillGreenText : styles.pillOrangeText}>
                  {item.pill}
                </Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* SMS / Notification Card */}
      <View style={styles.infoCard}>
        <Feather name="bell" size={18} color="#64748B" style={{ marginRight: 12, marginTop: 1 }} />
        <Text style={styles.infoCardText}>
          You do not need to wait here. We send a push notification the moment your account is approved.
        </Text>
      </View>
    </View>
  );

  const renderRejected = () => (
    <View>
      {/* Top Rejected Status Card */}
      <View style={styles.statusCardRejected}>
        <View style={styles.statusTopRow}>
          <View style={styles.statusIconWrapRejected}>
            <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: '#EF4444', alignItems: 'center', justifyContent: 'center' }}>
              <AntDesign name="close" size={16} color="#FFFFFF" />
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.statusTitleRejected}>Verification rejected</Text>
            <Text style={styles.statusSubtextRejected}>
              Reviewed by Admin
            </Text>
          </View>
        </View>

        <View style={styles.statusDividerRejected} />

        <View style={styles.pillsRow}>
          <View style={styles.pillCol}>
            <Text style={styles.pillLabel}>KYC status</Text>
            <View style={styles.pillValueRejected}>
              <Text style={styles.pillValueRejectedText}>Rejected</Text>
            </View>
          </View>
          <View style={styles.pillCol}>
            <Text style={styles.pillLabel}>Account status</Text>
            <View style={styles.pillValueGray}>
              <Text style={styles.pillValueGrayText}>Not activated</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Items Need Fixing */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionHeaderRed}>{`${rejectionList.length} ITEMS NEED FIXING`}</Text>
        {rejectionList.map(item => (
          <View key={item.id} style={styles.fixItemCard}>
            <View style={styles.fixItemIconWrap}>
              <AntDesign name="exclamation-circle" size={18} color="#DC2626" />
            </View>
            <View style={styles.fixItemContent}>
              <Text style={styles.fixItemTitle}>{item.title}</Text>
              <Text style={styles.fixItemReason}>{item.reason}</Text>
              <TouchableOpacity
                activeOpacity={0.7}
                accessibilityRole="button"
                onPress={handleFixItem}
                style={styles.fixBtn}>
                <Text style={styles.fixBtnText}>{item.btnLabel}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      {/* Everything Else Accepted Banner */}
      <View style={styles.everythingElseAcceptedBox}>
        <AntDesign name="check-circle" size={18} color="#16A34A" style={{ marginTop: 2, marginRight: 10 }} />
        <View style={{ flex: 1 }}>
          <Text style={styles.everythingElseTitle}>Everything else was accepted</Text>
          <Text style={styles.everythingElseText}>
            Personal details, licence front, vehicle, insurance and payout are verified — you only need to review the items above.
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.root}>
      <Header
        title="Verification status"
        showBack
        onBackPress={handleBack}
        rightIcon="headphone"
        onRightIconPress={handleContactSupport}
      />

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: Math.max(insets.bottom, 16) + 100 },
        ]}
        showsVerticalScrollIndicator={false}>
        {statusMode === 'rejected' ? renderRejected() : renderInProgress()}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 14) }]}>
        <Button
          title="Contact support"
          variant="outline"
          onPress={handleContactSupport}
        />
      </View>
    </View>
  );
}
