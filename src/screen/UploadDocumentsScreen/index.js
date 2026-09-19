import React from 'react';
import {
  Linking,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { AntDesign } from '@react-native-vector-icons/ant-design/static';
import { Feather } from '@react-native-vector-icons/feather/static';
import { Lucide } from '@react-native-vector-icons/lucide/static';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../components/Toast';
import useThemedStyles from '../../components/useThemedStyles';
import createStyles from './style';

const SUPPORT_URL = 'mailto:compliance@cabora.app';

const DOCUMENTS_LIST = [
  {
    id: 'insurance',
    title: 'Insurance certificate',
    sub: 'Expired 2 Sep 2026 · blocks you now',
    status: 'expired',
    statusLabel: 'Expired',
    actionText: 'Re-upload',
    captureTitle: 'Photograph Insurance Policy',
    captureHint: 'Policy number and validity dates must be readable.',
    fileName: 'insurance_policy.jpg',
  },
  {
    id: 'rc',
    title: 'Registration certificate (RC)',
    sub: 'Expires 25 Sep 2026 · 7 days left',
    status: 'warning',
    statusLabel: '7 days left',
    actionText: 'Renew now',
    captureTitle: 'Photograph the RC',
    captureHint: 'Vehicle number and owner name must be clearly visible.',
    fileName: 'rc_front.jpg',
  },
  {
    id: 'licence',
    title: 'Driving licence',
    sub: 'Valid till 14 Mar 2028',
    status: 'verified',
    statusLabel: 'Verified',
    actionText: null,
    captureTitle: 'Photograph Driving Licence',
    captureHint: 'Name, licence number and expiry must all be readable.',
    fileName: 'licence_front.jpg',
  },
  {
    id: 'police',
    title: 'Police verification',
    sub: 'Submitted 9 Sep · under review',
    status: 'review',
    statusLabel: 'In review',
    actionText: null,
    captureTitle: 'Photograph Police Verification',
    captureHint: 'Certificate number and stamp must be clear.',
    fileName: 'police_verification.jpg',
  },
];

export default function UploadDocumentsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { colors } = useApp();
  const styles = useThemedStyles(createStyles);
  const { showToast } = useToast();

  const handleUploadDoc = doc => {
    navigation.navigate('DocumentCapture', {
      docId: doc.id,
      title: doc.title,
      captureTitle: doc.captureTitle,
      captureHint: doc.captureHint,
      fileName: doc.fileName,
    });
  };

  const handleHelp = () => {
    showToast({
      title: 'Compliance Guidelines',
      message: 'Government regulations require all commercial transport documents to be up to date.',
      type: 'info',
    });
  };

  const handleComplianceSupport = () => {
    Linking.openURL(SUPPORT_URL).catch(() => {
      showToast({
        title: 'Compliance Support',
        message: 'Email us at compliance@cabora.app',
        type: 'info',
      });
    });
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
          onPress={() => navigation.goBack()}
          style={styles.headerIconBtn}>
          <Feather name="arrow-left" size={22} color={colors.slate[900]} />
        </Pressable>

        <Text style={styles.headerTitle}>Documents</Text>

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
        {/* Blocked Notice Card */}
        <View style={styles.blockedCard}>
          <View style={styles.blockedHead}>
            <Lucide name="lock" size={18} color={colors.red[600]} />
            <Text style={styles.blockedTitle}>
              You're blocked from going online
            </Text>
          </View>
          <Text style={styles.blockedSub}>
            Insurance is a mandatory document and it expired on 2 Sep. Upload a
            valid certificate and you'll be back online as soon as it's approved
            — usually within 2 hours.
          </Text>
        </View>

        {/* Section: MANDATORY DOCUMENTS */}
        <Text style={styles.sectionTitle}>MANDATORY DOCUMENTS</Text>

        <View style={styles.docsList}>
          {DOCUMENTS_LIST.map(doc => {
            const isExpired = doc.status === 'expired';
            const isWarning = doc.status === 'warning';
            const isVerified = doc.status === 'verified';
            const isReview = doc.status === 'review';

            return (
              <Pressable
                key={doc.id}
                accessibilityRole="button"
                onPress={() => handleUploadDoc(doc)}
                style={[
                  styles.docCard,
                  isExpired && styles.docCardExpired,
                  isWarning && styles.docCardWarning,
                ]}>
                <View style={styles.docLeft}>
                  <View
                    style={[
                      styles.docIconBox,
                      isExpired && styles.iconBoxExpired,
                      isWarning && styles.iconBoxWarning,
                      isVerified && styles.iconBoxVerified,
                      isReview && styles.iconBoxReview,
                    ]}>
                    {isExpired && (
                      <Feather name="x-circle" size={20} color={colors.red[600]} />
                    )}
                    {isWarning && (
                      <Feather
                        name="alert-triangle"
                        size={20}
                        color={colors.amber[600]}
                      />
                    )}
                    {isVerified && (
                      <AntDesign
                        name="check-circle"
                        size={20}
                        color={colors.green[600]}
                      />
                    )}
                    {isReview && (
                      <Feather name="loader" size={20} color={colors.blue[550]} />
                    )}
                  </View>

                  <View style={styles.docInfo}>
                    <Text style={styles.docTitle}>{doc.title}</Text>
                    <Text
                      style={[
                        isExpired && styles.docSubExpired,
                        isWarning && styles.docSubWarning,
                        isVerified && styles.docSubVerified,
                        isReview && styles.docSubReview,
                      ]}>
                      {doc.sub}
                    </Text>
                  </View>
                </View>

                <View style={styles.docRight}>
                  <View
                    style={[
                      styles.statusBadge,
                      isExpired && styles.badgeExpired,
                      isWarning && styles.badgeWarning,
                      isVerified && styles.badgeVerified,
                      isReview && styles.badgeReview,
                    ]}>
                    <View
                      style={[
                        styles.statusDot,
                        isExpired && styles.statusDotExpired,
                        isWarning && styles.statusDotWarning,
                        isVerified && styles.statusDotVerified,
                        isReview && styles.statusDotReview,
                      ]}
                    />
                    <Text
                      style={[
                        isExpired && styles.statusTextExpired,
                        isWarning && styles.statusTextWarning,
                        isVerified && styles.statusTextVerified,
                        isReview && styles.statusTextReview,
                      ]}>
                      {doc.statusLabel}
                    </Text>
                  </View>

                  {doc.actionText && (
                    <Text style={styles.actionLinkText}>{doc.actionText}</Text>
                  )}
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View
        style={[
          styles.bottomBar,
          { paddingBottom: Math.max(insets.bottom, 12) },
        ]}>
        <Pressable
          accessibilityRole="button"
          onPress={() => handleUploadDoc(DOCUMENTS_LIST[0])}
          style={styles.uploadBtn}>
          <Text style={styles.uploadBtnText}>Upload insurance certificate</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          onPress={handleComplianceSupport}
          style={styles.supportLink}>
          <Text style={styles.supportLinkText}>Talk to the compliance team</Text>
        </Pressable>
      </View>
    </View>
  );
}
