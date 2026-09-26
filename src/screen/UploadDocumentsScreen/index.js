import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Image,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
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
import { useAppSelector } from '../../redux/hooks';
import { formatImageUrl } from '../../utils/user';
import { requestCameraPermission } from '../../utils/cameraPermission';
import createStyles from './style';

import { DRIVER_DOCUMENTS_LIST as DEFAULT_DOCUMENTS_LIST } from '../../config/staticData';

export default function UploadDocumentsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { colors } = useApp();
  const styles = useThemedStyles(createStyles);
  const { showToast } = useToast();
  const kycData = useAppSelector(state => state.driver.kycData);

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState(null);

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle(colors.isDark ? 'light-content' : 'dark-content');
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor('transparent');
        StatusBar.setTranslucent(true);
      }
    }, [colors.isDark]),
  );

  useEffect(() => {
    requestCameraPermission().catch(() => {});
  }, []);



  // Parse overall KYC / Platform Status
  const platform = kycData?.platform || {};
  const kycStatusRaw = String(
    platform.kycStatus || platform.onboardingStatus || kycData?.status || '',
  ).toUpperCase();

  const isApprovedAll =
    kycStatusRaw === 'APPROVED' || kycStatusRaw === 'VERIFIED';
  const isRejectedAll =
    kycStatusRaw === 'REJECTED' || kycStatusRaw === 'FAILED';
  const isPendingAll =
    kycStatusRaw === 'PENDING' ||
    kycStatusRaw === 'UNDER_REVIEW' ||
    kycStatusRaw === 'IN_REVIEW';

  const rejectionReason =
    platform.rejectionReason ||
    kycData?.rejectionReason ||
    'One or more documents were rejected. Please review and re-upload the highlighted documents below.';

  // Map API sections into document list items
  const documentsList = useMemo(() => {
    if (!kycData) {
      return DEFAULT_DOCUMENTS_LIST;
    }

    const {
      personal,
      drivingLicence,
      vehicle,
      insurance,
      payout,
      documents = [],
    } = kycData;

    // Helper to find document status in documents array
    const findDocStatus = types => {
      const matched = documents.find(d => types.includes(d.documentType));
      return matched?.status?.toUpperCase() || null;
    };

    const findDocUrl = types => {
      const matched = documents.find(d => types.includes(d.documentType));
      return matched?.fileUrl || null;
    };

    // 1. Driving Licence
    const dlStatus =
      findDocStatus(['DRIVING_LICENCE_FRONT', 'DRIVING_LICENCE_BACK']) ||
      (drivingLicence?.isCompleted ? 'APPROVED' : 'PENDING');
    const dlUrl =
      drivingLicence?.dlFront ||
      findDocUrl(['DRIVING_LICENCE_FRONT', 'DRIVING_LICENCE_BACK']);

    // 2. RC / Registration Certificate
    const rcStatus =
      findDocStatus(['VEHICLE_RC', 'RC']) ||
      (vehicle?.isCompleted ? 'APPROVED' : 'PENDING');
    const rcUrl = vehicle?.rcDocument || findDocUrl(['VEHICLE_RC', 'RC']);

    // 3. Profile Photo
    const photoStatus =
      findDocStatus(['PROFILE_PHOTO']) ||
      (personal?.isCompleted ? 'APPROVED' : 'PENDING');
    const photoUrl =
      personal?.profilePhoto || findDocUrl(['PROFILE_PHOTO']);

    // 4. Insurance Policy
    const insuranceStatus =
      findDocStatus(['VEHICLE_INSURANCE', 'INSURANCE']) ||
      (insurance?.isCompleted ? 'APPROVED' : 'PENDING');
    const insuranceUrl =
      insurance?.insuranceDocument ||
      findDocUrl(['VEHICLE_INSURANCE', 'INSURANCE']);

    // 5. Bank Passbook / Payout
    const bankStatus = payout?.isCompleted ? 'APPROVED' : 'PENDING';
    const bankUrl = payout?.passbookDocument || null;

    return [
      {
        id: 'dl',
        title: 'Driving licence',
        sub:
          dlStatus === 'APPROVED'
            ? `Approved · ${drivingLicence?.drivingLicenceNumber || 'DL Verified'}`
            : dlStatus === 'REJECTED'
              ? 'Licence details invalid or blurred'
              : 'Licence verification pending',
        status: dlStatus === 'APPROVED' ? 'approved' : dlStatus === 'REJECTED' ? 'rejected' : 'pending',
        statusLabel: dlStatus === 'APPROVED' ? 'Approved' : dlStatus === 'REJECTED' ? 'Rejected' : 'Pending',
        icon: 'file-text',
        fileUrl: formatImageUrl(dlUrl),
        fileName: 'driving_licence.jpg',
      },
      {
        id: 'rc',
        title: 'Registration certificate',
        sub:
          rcStatus === 'APPROVED'
            ? `Approved · Plate: ${vehicle?.registrationNumber || vehicle?.numberPlate || 'RC Verified'}`
            : rcStatus === 'REJECTED'
              ? 'RC image unreadable'
              : 'RC verification pending',
        status: rcStatus === 'APPROVED' ? 'approved' : rcStatus === 'REJECTED' ? 'rejected' : 'pending',
        statusLabel: rcStatus === 'APPROVED' ? 'Approved' : rcStatus === 'REJECTED' ? 'Rejected' : 'Pending',
        icon: 'file-text',
        fileUrl: formatImageUrl(rcUrl),
        fileName: 'vehicle_rc.jpg',
      },
      {
        id: 'photo',
        title: 'Profile photo',
        sub:
          photoStatus === 'APPROVED'
            ? 'Approved · Clear headshot verified'
            : photoStatus === 'REJECTED'
              ? 'Photo blurry — face not clear'
              : 'Profile photo pending',
        status: photoStatus === 'APPROVED' ? 'approved' : photoStatus === 'REJECTED' ? 'rejected' : 'pending',
        statusLabel: photoStatus === 'APPROVED' ? 'Approved' : photoStatus === 'REJECTED' ? 'Rejected' : 'Pending',
        icon: 'camera',
        fileUrl: formatImageUrl(photoUrl),
        fileName: 'profile_photo.jpg',
      },
      {
        id: 'insurance',
        title: 'Insurance policy',
        sub:
          insuranceStatus === 'APPROVED'
            ? `Approved · Policy #${insurance?.insurancePolicyNumber || 'Valid'}`
            : insuranceStatus === 'REJECTED'
              ? 'Insurance expired — please re-upload'
              : 'Insurance verification pending',
        status: insuranceStatus === 'APPROVED' ? 'approved' : insuranceStatus === 'REJECTED' ? 'rejected' : 'pending',
        statusLabel: insuranceStatus === 'APPROVED' ? 'Approved' : insuranceStatus === 'REJECTED' ? 'Rejected' : 'Pending',
        icon: 'shield',
        fileUrl: formatImageUrl(insuranceUrl),
        fileName: 'insurance_policy.jpg',
      },
      {
        id: 'bank',
        title: 'Bank passbook',
        sub:
          bankStatus === 'APPROVED'
            ? `Approved · A/C ${payout?.bankAccountNumber || 'Verified'}`
            : bankStatus === 'REJECTED'
              ? 'Bank details unreadable'
              : 'Add your passbook or cheque',
        status: bankStatus === 'APPROVED' ? 'approved' : bankStatus === 'REJECTED' ? 'rejected' : 'pending',
        statusLabel: bankStatus === 'APPROVED' ? 'Approved' : bankStatus === 'REJECTED' ? 'Rejected' : 'Pending',
        icon: 'credit-card',
        fileUrl: formatImageUrl(bankUrl),
        fileName: 'bank_passbook.jpg',
      },
    ];
  }, [kycData]);

  // Calculate percentage of approved documents
  const approvedCount = documentsList.filter(
    d => d.status === 'approved',
  ).length;
  const progressPct = Math.round((approvedCount / 5) * 100);

  // Auto-show status modal ONLY when all documents are approved
  useEffect(() => {
    if (isApprovedAll || approvedCount === 5) {
      setShowStatusModal(true);
    }
  }, [isApprovedAll, approvedCount]);

  const handleUploadDoc = doc => {
    if (doc.fileUrl) {
      setPreviewImageUrl(doc.fileUrl);
      return;
    }
    navigation.navigate('DocumentCapture', {
      docId: doc.id,
      title: doc.title,
      captureTitle: doc.captureTitle || `Photograph ${doc.title.toLowerCase()}`,
      captureHint:
        doc.captureHint || 'Ensure all details are clear and readable.',
      fileName: doc.fileName || 'document.jpg',
    });
  };

  const handleReuploadDoc = doc => {
    navigation.navigate('DocumentCapture', {
      docId: doc.id,
      title: doc.title,
      captureTitle: `Re-upload ${doc.title.toLowerCase()}`,
      captureHint: 'Upload a clear, unblurred photo to get verified.',
      fileName: doc.fileName || 'document.jpg',
    });
  };

  const handleHelp = () => {
    showToast({
      title: 'Document Guidelines',
      message:
        'Upload clear, unblurred photos of required official documents to get verified.',
      type: 'info',
    });
  };

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('DriverVerificationStatus');
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar
        barStyle={colors.isDark ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      {/* Header Bar */}
      <View
        style={[
          styles.header,
          { paddingTop: insets.top > 0 ? insets.top + 4 : 12 },
        ]}>
        <TouchableOpacity
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={handleBack}
          style={styles.headerIconBtn}>
          <Feather name="arrow-left" size={22} color={colors.text} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Upload documents</Text>

        <TouchableOpacity
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Help"
          onPress={handleHelp}
          style={styles.headerIconBtn}>
          <Feather name="help-circle" size={22} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 16) + 20 },
        ]}
        showsVerticalScrollIndicator={false}>

        {/* Top Upload Progress Card */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => setShowStatusModal(true)}
          style={styles.progressCard}>
          <View style={styles.progressTopRow}>
            <Text style={styles.progressCardTitle}>
              {approvedCount} of 5 documents approved
            </Text>
            <Text style={styles.progressPctText}>{progressPct}%</Text>
          </View>
          <Text style={styles.progressCardSub}>
            {approvedCount === 5
              ? 'All five documents approved! You are eligible for rides.'
              : 'You can go online once all five are approved'}
          </Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progressPct}%` }]} />
          </View>
        </TouchableOpacity>

        {/* Section Header */}
        <Text style={styles.sectionTitle}>REQUIRED</Text>

        {/* Documents List */}
        <View style={styles.docsList}>
          {documentsList.map(doc => {
            const isApproved = doc.status === 'approved';
            const isRejected = doc.status === 'rejected';
            const isPending = doc.status === 'pending';

            return (
              <View
                key={doc.id}
                style={[
                  styles.docCard,
                  isRejected && styles.docCardRejected,
                ]}>
                <View style={styles.docLeft}>
                  <View
                    style={[
                      styles.docIconBox,
                      isApproved && styles.iconBoxApproved,
                      isRejected && styles.iconBoxRejected,
                      isPending && styles.iconBoxPending,
                    ]}>
                    {doc.icon === 'camera' ? (
                      <Feather
                        name="camera"
                        size={20}
                        color={
                          isApproved
                            ? colors.green[600]
                            : isRejected
                              ? colors.red[600]
                              : colors.gray[500]
                        }
                      />
                    ) : doc.icon === 'shield' ? (
                      <Feather
                        name="shield"
                        size={20}
                        color={
                          isApproved
                            ? colors.green[600]
                            : isRejected
                              ? colors.red[600]
                              : colors.gray[500]
                        }
                      />
                    ) : doc.icon === 'credit-card' ? (
                      <Feather
                        name="credit-card"
                        size={20}
                        color={colors.gray[500]}
                      />
                    ) : (
                      <Feather
                        name="file-text"
                        size={20}
                        color={
                          isApproved
                            ? colors.green[600]
                            : isRejected
                              ? colors.red[600]
                              : colors.gray[500]
                        }
                      />
                    )}
                  </View>

                  <View style={styles.docInfo}>
                    <Text style={styles.docTitle}>{doc.title}</Text>
                    <Text
                      style={[
                        styles.docSub,
                        isRejected && styles.docSubRejected,
                      ]}>
                      {doc.sub}
                    </Text>

                    {/* Status Pill */}
                    <View
                      style={[
                        styles.statusPill,
                        isApproved && styles.pillApproved,
                        isRejected && styles.pillRejected,
                        isPending && styles.pillPending,
                      ]}>
                      <View
                        style={[
                          styles.statusDot,
                          isApproved && styles.dotApproved,
                          isRejected && styles.dotRejected,
                          isPending && styles.dotPending,
                        ]}
                      />
                      <Text
                        style={[
                          styles.statusPillText,
                          isApproved && styles.pillTextApproved,
                          isRejected && styles.pillTextRejected,
                          isPending && styles.pillTextPending,
                        ]}>
                        {doc.statusLabel}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Right Action */}
                <View style={styles.docRight}>
                  {isApproved ? (
                    <TouchableOpacity
                      activeOpacity={0.7}
                      accessibilityRole="button"
                      accessibilityLabel={`View ${doc.title}`}
                      onPress={() => handleUploadDoc(doc)}
                      style={styles.eyeBtn}>
                      <Feather name="eye" size={20} color={colors.gray[500]} />
                    </TouchableOpacity>
                  ) : isRejected ? (
                    <TouchableOpacity
                      activeOpacity={0.8}
                      accessibilityRole="button"
                      onPress={() => handleReuploadDoc(doc)}
                      style={styles.reuploadBtn}>
                      <Text style={styles.reuploadBtnText}>Re-upload</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      activeOpacity={0.8}
                      accessibilityRole="button"
                      onPress={() => handleUploadDoc(doc)}
                      style={styles.uploadBtn}>
                      <Text style={styles.uploadBtnText}>Upload</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        {/* Bottom Notice Box */}
        {isRejectedAll ? (
          <View style={[styles.amberNoticeCard, { backgroundColor: '#FEE2E2', borderColor: '#FCA5A5' }]}>
            <Feather
              name="alert-triangle"
              size={18}
              color="#DC2626"
              style={{ marginTop: 2, marginRight: 10 }}
            />
            <Text style={[styles.amberNoticeText, { color: '#991B1B' }]}>
              {rejectionReason}
            </Text>
          </View>
        ) : (
          <View style={styles.amberNoticeCard}>
            <AntDesign
              name="exclamation-circle"
              size={18}
              color="#D97706"
              style={{ marginTop: 2, marginRight: 10 }}
            />
            <Text style={styles.amberNoticeText}>
              Re-upload any expired pages or add missing documents to finish verification.
            </Text>
          </View>
        )}

      </ScrollView>

      {/* KYC OVERALL STATUS MODAL (APPROVED / REJECTED / PENDING) */}
      <Modal
        visible={showStatusModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowStatusModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {isApprovedAll ? (
              <>
                <View style={[styles.statusIconContainer, styles.iconApproved]}>
                  <AntDesign name="check-circle" size={34} color="#16A34A" />
                </View>
                <Text style={styles.modalTitle}>KYC Verification Approved 🎉</Text>
                <Text style={styles.modalSub}>
                  Congratulations! All your submitted documents have been verified and approved by the Cabora team. You are ready to go online and receive rides!
                </Text>
                <View style={[styles.modalBadge, styles.modalBadgeApproved]}>
                  <Text style={styles.modalBadgeTextApproved}>● APPROVED & ACTIVE</Text>
                </View>
              </>
            ) : isRejectedAll ? (
              <>
                <View style={[styles.statusIconContainer, styles.iconRejected]}>
                  <Feather name="lock" size={32} color="#DC2626" />
                </View>
                <Text style={styles.modalTitle}>KYC Verification Rejected</Text>
                <Text style={styles.modalSub}>
                  {rejectionReason}
                </Text>
                <View style={[styles.modalBadge, styles.modalBadgeRejected]}>
                  <Text style={styles.modalBadgeTextRejected}>● ACTION REQUIRED</Text>
                </View>
              </>
            ) : (
              <>
                <View style={[styles.statusIconContainer, styles.iconPending]}>
                  <Feather name="clock" size={32} color="#D97706" />
                </View>
                <Text style={styles.modalTitle}>Verification In Review</Text>
                <Text style={styles.modalSub}>
                  Your submitted documents are currently under review by our verification team. Approval usually takes up to 24 hours.
                </Text>
                <View style={[styles.modalBadge, styles.modalBadgePending]}>
                  <Text style={styles.modalBadgeTextPending}>● UNDER REVIEW</Text>
                </View>
              </>
            )}

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setShowStatusModal(false)}
              style={styles.modalBtn}>
              <Text style={styles.modalBtnText}>
                {isApprovedAll ? 'Awesome!' : isRejectedAll ? 'Review Documents' : 'Got it'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* DOCUMENT IMAGE PREVIEW MODAL */}
      <Modal
        visible={Boolean(previewImageUrl)}
        transparent
        animationType="slide"
        onRequestClose={() => setPreviewImageUrl(null)}>
        <View style={styles.previewOverlay}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setPreviewImageUrl(null)}
            style={styles.previewCloseBtn}>
            <Feather name="x" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          {previewImageUrl ? (
            <Image
              source={{ uri: previewImageUrl }}
              style={styles.previewImage}
            />
          ) : null}
        </View>
      </Modal>
    </View>
  );
}
