import React, { useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
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
import { Button } from '../../components';

const SUPPORT_URL = 'mailto:support@cabora.app';

export default function DriverVerificationStatusScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const { colors } = useApp();
  const styles = useThemedStyles(createStyles);
  const { showToast } = useToast();

  // Mode: 'in_progress' | 'rejected'
  const [statusMode, setStatusMode] = useState(route?.params?.mode || 'in_progress');

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
        message: 'Reach out to support@cabora.app for verification help.',
      });
    });
  };

  const handleFixItem = item => {
    navigation.navigate('UploadDocuments');
  };

  const handleFixAndResubmit = () => {
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
            <Text style={styles.statusSubtextProgress}>Submitted 19 Sep 2026, 2:14 pm</Text>
          </View>
        </View>

        <View style={styles.statusDividerProgress} />

        <View style={styles.pillsRow}>
          <View style={styles.pillCol}>
            <Text style={styles.pillLabel}>KYC status</Text>
            <View style={styles.pillValueReview}>
              <Text style={styles.pillValueReviewText}>Under review</Text>
            </View>
          </View>
          <View style={styles.pillCol}>
            <Text style={styles.pillLabel}>Account status</Text>
            <View style={styles.pillValueGray}>
              <Text style={styles.pillValueGrayText}>Pending activation</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Verification Timeline */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionHeader}>VERIFICATION TIMELINE</Text>
        <View style={styles.timelineContainer}>
          {TIMELINE.map((item, idx) => {
            const isDone = item.status === 'done';
            const isActive = item.status === 'active';
            const isLast = idx === TIMELINE.length - 1;

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
        {CHECKING_ITEMS.map(item => {
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
          You do not need to wait here. We send a push and an SMS the moment your account is approved.
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
            <Text style={styles.statusSubtextRejected}>Reviewed by Admin · 19 Sep, 6:40 pm</Text>
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
        <Text style={styles.sectionHeaderRed}>2 ITEMS NEED FIXING</Text>
        {REJECTION_ITEMS.map(item => (
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
                onPress={() => handleFixItem(item)}
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
            Personal details, licence front, vehicle, insurance and payout are all verified — you only need to replace the two items above.
          </Text>
        </View>
      </View>

      {/* What Happens Next Card */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionHeader}>WHAT HAPPENS NEXT</Text>
        <View style={styles.nextStepsList}>
          <View style={styles.nextStepRow}>
            <Feather name="refresh-cw" size={16} color={colors.gray[600]} />
            <Text style={styles.nextStepText}>Replace the two items and resubmit</Text>
          </View>
          <View style={styles.nextStepRow}>
            <Feather name="eye" size={16} color={colors.gray[600]} />
            <Text style={styles.nextStepText}>A reviewer looks at it again within 4 hours</Text>
          </View>
          <View style={styles.nextStepRow}>
            <Feather name="check" size={16} color={colors.gray[600]} />
            <Text style={styles.nextStepText}>Your dashboard unlocks the moment it clears</Text>
          </View>
        </View>
      </View>

      {/* Appeal Option */}
      <View style={styles.appealBox}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Feather name="message-square" size={18} color={colors.gray[500]} style={{ marginRight: 10 }} />
          <Text style={styles.appealText}>Think this is a mistake?</Text>
        </View>
        <TouchableOpacity activeOpacity={0.7} onPress={() => showToast({ type: 'info', message: 'Appeal request submitted to admin' })}>
          <Text style={styles.appealBtnText}>Appeal</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.root}>


      {/* Header Bar */}
      <View style={[styles.header, { paddingTop: insets.top > 0 ? insets.top + 4 : 12 }]}>
        <TouchableOpacity
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={handleBack}
          style={styles.headerBtn}>
          <Feather name="arrow-left" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Verification status</Text>
        <TouchableOpacity
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Contact support"
          onPress={handleContactSupport}
          style={styles.headerBtn}>
          <Feather name="headphones" size={22} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Status Mode Toggle Bar (For testing in-progress vs rejected states) */}
      <View style={{ paddingHorizontal: 20, paddingTop: 14 }}>
        <View style={styles.toggleBar}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setStatusMode('in_progress')}
            style={[styles.toggleTab, statusMode === 'in_progress' && styles.toggleTabActive]}>
            <Text style={[styles.toggleTabText, statusMode === 'in_progress' && styles.toggleTabTextActive]}>
              Under review
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setStatusMode('rejected')}
            style={[styles.toggleTab, statusMode === 'rejected' && styles.toggleTabActive]}>
            <Text style={[styles.toggleTabText, statusMode === 'rejected' && styles.toggleTabTextActive]}>
              Needs fixing
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Body Scroll View */}
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: Math.max(insets.bottom, 12) + 80 },
        ]}
        showsVerticalScrollIndicator={false}>
        {statusMode === 'in_progress' ? renderInProgress() : renderRejected()}
      </ScrollView>

      {/* Footer Navigation Bar */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        {statusMode === 'in_progress' ? (
          <Button
            title="Contact support"
            variant="outline"
            onPress={handleContactSupport}
          />
        ) : (
          <View style={styles.footerTwoBtns}>
            <Button
              title="Back"
              variant="outline"
              fullWidth={false}
              style={styles.btnBack}
              onPress={handleBack}
            />
            <Button
              title="Fix and resubmit"
              variant="primary"
              fullWidth={false}
              style={styles.btnFixSubmit}
              onPress={handleFixAndResubmit}
            />
          </View>
        )}
      </View>
    </View>
  );
}
