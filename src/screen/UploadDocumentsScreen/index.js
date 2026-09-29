import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
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

import useThemedStyles from '../../components/useThemedStyles';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchDriverProfile } from '../../redux/slices/authSlice';
import { fetchDriverKycStatus } from '../../redux/slices/driverSlice';
import { formatImageUrl } from '../../utils/user';
import createStyles from './style';

import { DRIVER_DOCUMENTS_LIST as DEFAULT_DOCUMENTS_LIST } from '../../config/staticData';
import { useToast } from '../../components';

export default function UploadDocumentsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { colors } = useApp();
  const styles = useThemedStyles(createStyles);
  const dispatch = useAppDispatch();
  const authUser = useAppSelector(state => state.auth.user);
  const driverKycData = useAppSelector(state => state.driver.kycData);
  const kycData = driverKycData || authUser?.driver || authUser;
  const { showToast } = useToast();

  console.log('driverKycData', driverKycData);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle?.(colors.isDark ? 'light-content' : 'dark-content');
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor?.('transparent');
        StatusBar.setTranslucent?.(true);
      }
      dispatch(fetchDriverKycStatus()).catch(() => { });
      dispatch(fetchDriverProfile()).catch(() => { });
    }, [colors.isDark, dispatch]),
  );

  // Parse overall KYC / Platform Status
  const platform = kycData?.platform || {};
  const kycStatusRaw = String(
    platform.kycStatus || platform.onboardingStatus || kycData?.status || '',
  ).toUpperCase();

  const isApprovedAll =
    kycStatusRaw === 'APPROVED' || kycStatusRaw === 'VERIFIED';
  const isRejectedAll =
    kycStatusRaw === 'REJECTED' || kycStatusRaw === 'FAILED';

  const rejectionReason =
    platform.rejectionReason ||
    kycData?.rejectionReason ||
    'One or more documents were rejected. Please review and re-upload the highlighted documents below.';

  // Map API sections into document list items
  const documentsList = useMemo(() => {
    if (!kycData) {
      return DEFAULT_DOCUMENTS_LIST;
    }

    const driverObj = kycData?.driver || kycData || {};
    const personal = kycData?.personal || driverObj?.personal || {};
    const drivingLicence = kycData?.drivingLicence || driverObj?.drivingLicence || {};
    const vehicle = kycData?.vehicle || driverObj?.vehicle || {};
    const insurance = kycData?.insurance || driverObj?.insurance || {};
    const payout = kycData?.payout || driverObj?.payout || {};
    const documents = kycData?.documents || driverObj?.documents || [];
    const completedSteps = kycData?.completedSteps || driverObj?.completedSteps || [];
    const platformObj = kycData?.platform || driverObj?.platform || {};

    const isStepDone = stepKey =>
      Array.isArray(completedSteps) &&
      completedSteps.some(s => (s.key === stepKey || s.step === stepKey) && (s.isCompleted !== false));

    const getDocStatusAndUrl = (types, stepObj, stepKey, fallbackUrl) => {
      const docs = Array.isArray(documents) ? documents.filter(d => types.includes(d?.documentType)) : [];
      const foundDoc = docs[0];
      const docStatusRaw = foundDoc?.status?.toUpperCase() || null;
      let url = foundDoc?.fileUrl || fallbackUrl || null;

      let statusKey = 'pending';
      let statusLabel = 'Pending';

      if (docStatusRaw === 'APPROVED' || docStatusRaw === 'VERIFIED') {
        statusKey = 'approved';
        statusLabel = 'Approved';
      } else if (docStatusRaw === 'REJECTED' || docStatusRaw === 'FAILED') {
        statusKey = 'rejected';
        statusLabel = 'Rejected';
      } else if (docStatusRaw === 'PENDING' || docStatusRaw === 'SUBMITTED' || docStatusRaw === 'UNDER_REVIEW' || docStatusRaw === 'IN_REVIEW') {
        statusKey = 'pending';
        statusLabel = 'Pending';
      } else {
        // Not explicitly listed in documents array
        const stepDone = stepObj?.isCompleted || isStepDone(stepKey) || Boolean(fallbackUrl);
        const overallStatus = String(platformObj.kycStatus || platformObj.onboardingStatus || kycData?.status || '').toUpperCase();

        if (stepDone) {
          if (overallStatus === 'APPROVED' || overallStatus === 'VERIFIED') {
            statusKey = 'approved';
            statusLabel = 'Approved';
          } else {
            statusKey = 'pending';
            statusLabel = 'Pending';
          }
        } else {
          statusKey = 'pending';
          statusLabel = 'Pending';
        }
      }

      return {
        status: statusKey,
        statusLabel,
        fileUrl: formatImageUrl(url),
      };
    };

    // 1. Driving Licence
    const dlInfo = getDocStatusAndUrl(
      ['DRIVING_LICENCE_FRONT', 'DRIVING_LICENCE_BACK', 'DRIVING_LICENCE'],
      drivingLicence,
      'DRIVING_LICENCE',
      drivingLicence?.dlFront || drivingLicence?.dlBack,
    );

    // 2. RC / Registration Certificate
    const rcInfo = getDocStatusAndUrl(
      ['VEHICLE_RC', 'RC'],
      vehicle,
      'VEHICLE',
      vehicle?.rcDocument,
    );

    // 3. Profile Photo
    const photoInfo = getDocStatusAndUrl(
      ['PROFILE_PHOTO'],
      personal,
      'PERSONAL',
      personal?.profilePhoto,
    );

    // 4. Insurance Policy
    const insuranceInfo = getDocStatusAndUrl(
      ['VEHICLE_INSURANCE', 'INSURANCE'],
      insurance,
      'INSURANCE',
      insurance?.insuranceDocument,
    );

    // 5. Bank Passbook / Payout
    const bankInfo = getDocStatusAndUrl(
      ['BANK_PASSBOOK', 'PAYOUT', 'PASSBOOK'],
      payout,
      'PAYOUT',
      payout?.passbookDocument,
    );

    return [
      {
        id: 'dl',
        title: 'Driving licence',
        sub:
          dlInfo.status === 'approved'
            ? `Approved · ${drivingLicence?.drivingLicenceNumber || 'DL Verified'}`
            : dlInfo.status === 'rejected'
              ? 'Licence details invalid or blurred'
              : dlInfo.fileUrl
                ? `Submitted · ${drivingLicence?.drivingLicenceNumber || 'Licence under review'}`
                : 'Licence verification pending',
        status: dlInfo.status,
        statusLabel: dlInfo.statusLabel,
        icon: 'file-text',
        fileUrl: dlInfo.fileUrl,
        fileName: 'driving_licence.jpg',
      },
      {
        id: 'rc',
        title: 'Registration certificate',
        sub:
          rcInfo.status === 'approved'
            ? `Approved · Plate: ${vehicle?.registrationNumber || vehicle?.numberPlate || 'RC Verified'}`
            : rcInfo.status === 'rejected'
              ? 'RC image unreadable'
              : rcInfo.fileUrl
                ? `Submitted · Plate: ${vehicle?.registrationNumber || vehicle?.numberPlate || 'RC under review'}`
                : 'RC verification pending',
        status: rcInfo.status,
        statusLabel: rcInfo.statusLabel,
        icon: 'file-text',
        fileUrl: rcInfo.fileUrl,
        fileName: 'vehicle_rc.jpg',
      },
      {
        id: 'photo',
        title: 'Profile photo',
        sub:
          photoInfo.status === 'approved'
            ? 'Approved · Clear headshot verified'
            : photoInfo.status === 'rejected'
              ? 'Photo blurry — face not clear'
              : photoInfo.fileUrl
                ? 'Submitted · Photo under review'
                : 'Profile photo pending',
        status: photoInfo.status,
        statusLabel: photoInfo.statusLabel,
        icon: 'camera',
        fileUrl: photoInfo.fileUrl,
        fileName: 'profile_photo.jpg',
      },
      {
        id: 'insurance',
        title: 'Insurance policy',
        sub:
          insuranceInfo.status === 'approved'
            ? `Approved · Policy #${insurance?.insurancePolicyNumber || 'Valid'}`
            : insuranceInfo.status === 'rejected'
              ? 'Insurance expired — please re-upload'
              : insuranceInfo.fileUrl
                ? `Submitted · Policy #${insurance?.insurancePolicyNumber || 'Under review'}`
                : 'Insurance verification pending',
        status: insuranceInfo.status,
        statusLabel: insuranceInfo.statusLabel,
        icon: 'shield',
        fileUrl: insuranceInfo.fileUrl,
        fileName: 'insurance_policy.jpg',
      },
      {
        id: 'bank',
        title: 'Bank passbook',
        sub:
          bankInfo.status === 'approved'
            ? `Approved · A/C ${payout?.bankAccountNumber || 'Verified'}`
            : bankInfo.status === 'rejected'
              ? 'Bank details unreadable'
              : payout?.bankAccountNumber || bankInfo.fileUrl
                ? `Pending approval from bank · A/C ${payout?.bankAccountNumber || 'Submitted'}`
                : 'Add your passbook or cheque',
        status: bankInfo.status,
        statusLabel:
          bankInfo.status === 'pending' && (payout?.bankAccountNumber || bankInfo.fileUrl)
            ? 'Pending approval'
            : bankInfo.statusLabel,
        icon: 'credit-card',
        fileUrl: bankInfo.fileUrl,
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
      setImageError(false);
      setImageLoading(true);
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

  const handleClosePreview = () => {
    setPreviewImageUrl(null);
    setImageError(false);
    setImageLoading(false);
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
                  ) : doc.fileUrl ? (
                    <TouchableOpacity
                      activeOpacity={0.7}
                      accessibilityRole="button"
                      accessibilityLabel={`View ${doc.title}`}
                      onPress={() => handleUploadDoc(doc)}
                      style={styles.eyeBtn}>
                      <Feather name="eye" size={20} color={colors.gray[500]} />
                    </TouchableOpacity>
                  ) : (
                    // <TouchableOpacity
                    //   activeOpacity={0.8}
                    //   accessibilityRole="button"
                    //   onPress={() => handleUploadDoc(doc)}
                    //   style={styles.uploadBtn}>
                    //   <Text style={styles.uploadBtnText}>Upload</Text>
                    // </TouchableOpacity>
                    //  <TouchableOpacity
                    //   activeOpacity={0.8}
                    //   accessibilityRole="button"
                    //   onPress={() => handleUploadDoc(doc)}
                    //   style={styles.uploadBtn}>
                    //   <Text style={styles.uploadBtnText}></Text>
                    // </TouchableOpacity>
                    <></>
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
            <Feather
              name="info"
              size={18}
              color={colors.amber[700]}
              style={{ marginTop: 2, marginRight: 10 }}
            />
            <Text style={styles.amberNoticeText}>
              All documents must be valid and legible to start driving with Cabora. Verification usually takes 24–48 hours.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Status Modal (When all approved or tapped top card) */}
      <Modal
        visible={showStatusModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowStatusModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View
              style={[
                styles.modalBadge,
                isApprovedAll || approvedCount === 5
                  ? { backgroundColor: '#DCFCE7' }
                  : { backgroundColor: '#FEF3C7' },
              ]}>
              <Feather
                name={isApprovedAll || approvedCount === 5 ? 'check-circle' : 'clock'}
                size={36}
                color={
                  isApprovedAll || approvedCount === 5
                    ? colors.green[600]
                    : colors.amber[600]
                }
              />
            </View>

            <Text style={styles.modalTitle}>
              {isApprovedAll || approvedCount === 5
                ? 'All Documents Verified!'
                : 'Verification in Progress'}
            </Text>

            <Text style={styles.modalSub}>
              {isApprovedAll || approvedCount === 5
                ? 'Your documents have been approved by the admin team. You can now go online and accept ride requests.'
                : `${approvedCount} of 5 documents approved. Our team is currently reviewing the remaining documents.`}
            </Text>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => {
                setShowStatusModal(false);
                if (isApprovedAll || approvedCount === 5) {
                  navigation.reset({
                    index: 0,
                    routes: [{ name: 'DriverHome' }],
                  });
                }
              }}
              style={styles.modalBtn}>
              <Text style={styles.modalBtnText}>
                {isApprovedAll || approvedCount === 5
                  ? 'Go to Dashboard'
                  : 'Got it'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Document Image Preview Modal */}
      <Modal
        visible={Boolean(previewImageUrl)}
        transparent
        animationType="fade"
        onRequestClose={handleClosePreview}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={handleClosePreview}
          style={styles.previewOverlay}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {}}
            style={styles.previewCard}>
            {/* Modal Header */}
            <View style={styles.previewHeader}>
              <Text style={styles.previewTitle}>Document Preview</Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleClosePreview}
                style={styles.previewCloseBtn}>
                <AntDesign name="close" size={16} color={colors.text} />
              </TouchableOpacity>
            </View>

            {/* Image Box */}
            <View style={styles.previewImageContainer}>
              {imageLoading && (
                <ActivityIndicator
                  size="large"
                  color={colors.primary || '#FF7A00'}
                  style={{ position: 'absolute' }}
                />
              )}

              {imageError ? (
                <View style={{ alignItems: 'center', paddingHorizontal: 16 }}>
                  <Feather name="alert-circle" size={38} color="#F87171" />
                  <Text
                    style={{
                      color: colors.text,
                      fontFamily: colors.fonts.sora.bold,
                      fontSize: 14,
                      marginTop: 8,
                    }}>
                    Unable to Load Image
                  </Text>
                  <Text
                    style={{
                      color: colors.gray[500],
                      fontFamily: colors.fonts.sora.regular,
                      fontSize: 12,
                      textAlign: 'center',
                      marginTop: 4,
                      lineHeight: 16,
                    }}>
                    The document image could not be fetched from the server.
                  </Text>
                </View>
              ) : previewImageUrl ? (
                <Image
                  source={{ uri: previewImageUrl }}
                  style={styles.previewImage}
                  resizeMode="contain"
                  onLoadStart={() => {
                    setImageLoading(true);
                    setImageError(false);
                  }}
                  onLoadEnd={() => setImageLoading(false)}
                  onError={e => {
                    console.log(
                      'Image preview load error:',
                      e.nativeEvent?.error,
                      previewImageUrl,
                    );
                    setImageLoading(false);
                    setImageError(true);
                  }}
                />
              ) : null}
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
