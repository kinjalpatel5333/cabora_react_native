import React from 'react';
import { ScrollView, Text, View, TouchableOpacity } from 'react-native';
import { AntDesign } from '@react-native-vector-icons/ant-design/static';
import { Feather } from '@react-native-vector-icons/feather/static';
import { Lucide } from '@react-native-vector-icons/lucide/static';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../components/Toast';
import useThemedStyles from '../../components/useThemedStyles';
import createStyles from './style';

import { DRIVER_DOCUMENTS_LIST as DOCUMENTS_LIST } from '../../config/staticData';

export default function UploadDocumentsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { colors } = useApp();
  const styles = useThemedStyles(createStyles);
  const { showToast } = useToast();

  const handleUploadDoc = doc => {
    navigation.navigate('DocumentCapture', {
      docId: doc.id,
      title: doc.title,
      captureTitle: doc.captureTitle || `Photograph ${doc.title.toLowerCase()}`,
      captureHint: doc.captureHint || 'Ensure all details are clear and readable.',
      fileName: doc.fileName || 'document.jpg',
    });
  };

  const handleHelp = () => {
    showToast({
      title: 'Document Guidelines',
      message: 'Upload clear, unblurred photos of required official documents to get verified.',
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
        <View style={styles.progressCard}>
          <View style={styles.progressTopRow}>
            <Text style={styles.progressCardTitle}>3 of 5 documents uploaded</Text>
            <Text style={styles.progressPctText}>60%</Text>
          </View>
          <Text style={styles.progressCardSub}>
            You can go online once all five are approved
          </Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: '60%' }]} />
          </View>
        </View>

        {/* Section Header */}
        <Text style={styles.sectionTitle}>REQUIRED</Text>

        {/* Documents List */}
        <View style={styles.docsList}>
          {DOCUMENTS_LIST.map(doc => {
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
                      onPress={() => handleUploadDoc(doc)}
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

        {/* Bottom Amber Notice Box */}
        <View style={styles.amberNoticeCard}>
          <AntDesign
            name="exclamation-circle"
            size={18}
            color="#D97706"
            style={{ marginTop: 2, marginRight: 10 }}
          />
          <Text style={styles.amberNoticeText}>
            Re-upload the insurance page and add your passbook to finish.
          </Text>
        </View>

      </ScrollView>
    </View>
  );
}
