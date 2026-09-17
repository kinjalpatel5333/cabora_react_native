import React, {useMemo, useState} from 'react';
import {
  Linking,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import {AntDesign} from '@react-native-vector-icons/ant-design/static';
import {Feather} from '@react-native-vector-icons/feather/static';
import {Lucide} from '@react-native-vector-icons/lucide/static';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Button, StatusBadge} from '../../components';
import useThemedStyles from '../../components/useThemedStyles';
import {useApp} from '../../context/AppContext';
import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import {completeDriverKyc, logoutUser} from '../../redux/slices/authSlice';
import {setDriverOnline, setDriverRestricted} from '../../redux/slices/driverSlice';
import createStyles from './style';

const SUPPORT_URL = 'mailto:support@cabora.app';

const INITIAL_DOCS = [
  {
    id: 'licence',
    title: 'Driving licence',
    status: 'pending',
    meta: 'Not uploaded yet',
    icon: 'file-text',
    captureTitle: 'Photograph the front',
    captureHint: 'Name, licence number and expiry must all be readable.',
    fileName: 'licence_front.jpg',
  },
  {
    id: 'rc',
    title: 'Registration certificate',
    status: 'pending',
    meta: 'Not uploaded yet',
    icon: 'file-text',
    captureTitle: 'Photograph the RC',
    captureHint: 'Vehicle number and owner name must be clearly visible.',
    fileName: 'rc_front.jpg',
  },
  {
    id: 'photo',
    title: 'Profile photo',
    status: 'pending',
    meta: 'Not uploaded yet',
    icon: 'camera',
    captureTitle: 'Take a profile photo',
    captureHint: 'Face the camera with even lighting and no sunglasses.',
    fileName: 'profile_photo.jpg',
  },
  {
    id: 'insurance',
    title: 'Insurance policy',
    status: 'pending',
    meta: 'Not uploaded yet',
    icon: 'shield',
    captureTitle: 'Photograph the policy',
    captureHint: 'Policy number and validity dates must be readable.',
    fileName: 'insurance_policy.jpg',
  },
  {
    id: 'passbook',
    title: 'Bank passbook',
    status: 'pending',
    meta: 'Not uploaded yet',
    icon: 'credit-card',
    captureTitle: 'Photograph the first page',
    captureHint:
      'Account holder name, account number and IFSC must all be readable.',
    fileName: 'passbook_front.jpg',
  },
];

function DocIcon({name, color}) {
  if (name === 'camera') {
    return <Lucide name="camera" size={20} color={color} />;
  }
  if (name === 'shield') {
    return <Feather name="shield" size={20} color={color} />;
  }
  if (name === 'credit-card') {
    return <Feather name="credit-card" size={20} color={color} />;
  }
  return <Lucide name="file-text" size={20} color={color} />;
}

export default function UploadDocumentsScreen({navigation}) {
  const insets = useSafeAreaInsets();
  const {colors} = useApp();
  const styles = useThemedStyles(createStyles);
  const dispatch = useAppDispatch();
  const locationResolved = useAppSelector(state => state.app.locationResolved);
  const kycDocuments = useAppSelector(
    state => state.auth.user?.kycDocuments || {},
  );
  const [saving, setSaving] = useState(false);

  const docs = useMemo(
    () =>
      INITIAL_DOCS.map(doc => {
        const saved = kycDocuments[doc.id];
        const isUploaded = Boolean(
          saved?.uri || saved?.status === 'uploaded',
        );
        if (!isUploaded) {
          return doc;
        }
        return {
          ...doc,
          status: 'uploaded',
          meta: saved.fileName || saved.meta || 'Uploaded',
          uri: saved.uri,
          fileName: saved.fileName,
        };
      }),
    [kycDocuments],
  );

  const uploadedCount = docs.filter(doc => doc.status === 'uploaded').length;
  const percent = Math.round((uploadedCount / docs.length) * 100);
  const allUploaded = uploadedCount === docs.length;

  const iconTone = useMemo(
    () => ({
      pending: {bg: colors.gray[100], fg: colors.gray[500]},
      uploaded: {bg: colors.green[100], fg: colors.green[600]},
      approved: {bg: colors.green[100], fg: colors.green[600]},
      rejected: {bg: colors.red[100], fg: colors.red[500]},
    }),
    [colors],
  );

  const onUpload = doc => {
    navigation.navigate('DocumentCapture', {
      docId: doc.id,
      title: doc.title,
      captureTitle: doc.captureTitle,
      captureHint: doc.captureHint,
      fileName: doc.fileName,
    });
  };

  const goNext = async () => {
    setSaving(true);
    try {
      await dispatch(completeDriverKyc()).unwrap();
      dispatch(setDriverRestricted(false));
      dispatch(setDriverOnline(true));
      if (navigation.canGoBack()) {
        navigation.goBack();
        return;
      }
      if (locationResolved) {
        navigation.replace('DriverTabs');
      } else {
        navigation.replace('LocationPermission');
      }
    } catch (err) {
      setSaving(false);
    }
  };

  const onBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }
    dispatch(logoutUser());
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />
      <View style={[styles.header, {paddingTop: insets.top + 8}]}>
        <Pressable
          accessibilityRole="button"
          onPress={onBack}
          style={styles.headerBtn}>
          <Feather name="arrow-left" size={22} color={colors.navy[900]} />
        </Pressable>
        <Text style={styles.headerTitle}>Upload documents</Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => Linking.openURL(SUPPORT_URL)}
          style={styles.headerBtn}>
          <Feather name="help-circle" size={22} color={colors.navy[800]} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          {paddingBottom: Math.max(insets.bottom, 20)},
        ]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.progressCard}>
          <View style={styles.progressTop}>
            <Text style={styles.progressTitle}>
              {uploadedCount} of {docs.length} documents uploaded
            </Text>
            <Text style={styles.progressPct}>{percent}%</Text>
          </View>
          <Text style={styles.progressSub}>
            You can go online once all five are approved
          </Text>
          <View style={styles.track}>
            <View style={[styles.fill, {width: `${percent}%`}]} />
          </View>
        </View>

        <Text style={styles.section}>REQUIRED</Text>

        {docs.map(doc => {
          const uploaded = doc.status === 'uploaded';
          const tone = iconTone[doc.status] || iconTone.pending;
          return (
            <View key={doc.id} style={styles.card}>
              <View style={styles.cardRow}>
                <View style={[styles.iconWrap, {backgroundColor: tone.bg}]}>
                  <DocIcon name={doc.icon} color={tone.fg} />
                </View>
                <View style={styles.copy}>
                  <Text style={styles.cardTitle}>{doc.title}</Text>
                  <Text style={styles.cardMeta}>{doc.meta}</Text>
                  <StatusBadge
                    label={uploaded ? 'Uploaded' : 'Pending'}
                    tone={uploaded ? 'success' : 'neutral'}
                  />
                </View>
                {uploaded ? null : (
                  <Button
                    title="Upload"
                    size="sm"
                    fullWidth={false}
                    onPress={() => onUpload(doc)}
                    style={styles.action}
                  />
                )}
              </View>
            </View>
          );
        })}

        {allUploaded ? (
          <Button
            title="Continue"
            onPress={goNext}
            loading={saving}
            style={styles.continue}
          />
        ) : (
          <View style={styles.warning}>
            <AntDesign
              name="exclamation-circle"
              size={16}
              color={colors.amber[600]}
            />
            <Text style={styles.warningText}>
              Upload all five documents so we can start review.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
