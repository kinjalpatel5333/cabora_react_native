import React, {useMemo, useState} from 'react';
import {
  Alert,
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
import createStyles from './style';

const SUPPORT_URL = 'mailto:support@cabora.app';

const INITIAL_DOCS = [
  {
    id: 'licence',
    title: 'Driving licence',
    status: 'approved',
    meta: 'Approved 08 Sep',
    icon: 'file-text',
  },
  {
    id: 'rc',
    title: 'Registration certificate',
    status: 'approved',
    meta: 'Approved 08 Sep',
    icon: 'file-text',
  },
  {
    id: 'photo',
    title: 'Profile photo',
    status: 'approved',
    meta: 'Approved 09 Sep',
    icon: 'camera',
  },
  {
    id: 'insurance',
    title: 'Insurance policy',
    status: 'rejected',
    meta: 'Blurred — page 2 unreadable',
    icon: 'shield',
  },
  {
    id: 'passbook',
    title: 'Bank passbook',
    status: 'pending',
    meta: 'Not uploaded yet',
    icon: 'credit-card',
  },
];

function formatApprovedToday() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = now.toLocaleString('en-GB', {month: 'short'});
  return `Approved ${day} ${month}`;
}

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
  const [docs, setDocs] = useState(INITIAL_DOCS);
  const [saving, setSaving] = useState(false);

  const approvedCount = docs.filter(doc => doc.status === 'approved').length;
  const percent = Math.round((approvedCount / docs.length) * 100);
  const allApproved = approvedCount === docs.length;

  const iconTone = useMemo(
    () => ({
      approved: {bg: colors.green[100], fg: colors.green[600]},
      rejected: {bg: colors.red[100], fg: colors.red[500]},
      pending: {bg: colors.gray[100], fg: colors.gray[500]},
    }),
    [colors],
  );

  const markApproved = id => {
    setDocs(current =>
      current.map(doc =>
        doc.id === id
          ? {...doc, status: 'approved', meta: formatApprovedToday()}
          : doc,
      ),
    );
  };

  const goNext = async () => {
    setSaving(true);
    try {
      await dispatch(completeDriverKyc()).unwrap();
      if (locationResolved) {
        navigation.replace('DriverHome');
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
      <StatusBar barStyle={colors.barStyle} />
      <View style={[styles.header, {paddingTop: insets.top + 8}]}>
        <Pressable
          accessibilityRole="button"
          onPress={onBack}
          style={styles.headerBtn}>
          <Feather name="arrow-left" size={22} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Upload documents</Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => Linking.openURL(SUPPORT_URL)}
          style={styles.headerBtn}>
          <Feather name="help-circle" size={22} color={colors.text} />
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
              {approvedCount} of {docs.length} documents uploaded
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
          const tone = iconTone[doc.status];
          const rejected = doc.status === 'rejected';
          return (
            <View
              key={doc.id}
              style={[styles.card, rejected && styles.cardRejected]}>
              <View style={styles.cardRow}>
                <View style={[styles.iconWrap, {backgroundColor: tone.bg}]}>
                  <DocIcon name={doc.icon} color={tone.fg} />
                </View>
                <View style={styles.copy}>
                  <Text style={styles.cardTitle}>{doc.title}</Text>
                  <Text
                    style={[
                      styles.cardMeta,
                      rejected && styles.cardMetaRejected,
                    ]}>
                    {doc.meta}
                  </Text>
                  <StatusBadge
                    label={
                      doc.status === 'approved'
                        ? 'Approved'
                        : doc.status === 'rejected'
                          ? 'Rejected'
                          : 'Pending'
                    }
                    tone={
                      doc.status === 'approved'
                        ? 'success'
                        : doc.status === 'rejected'
                          ? 'danger'
                          : 'neutral'
                    }
                  />
                </View>
                {doc.status === 'approved' ? (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`View ${doc.title}`}
                    onPress={() =>
                      Alert.alert(doc.title, 'Document preview will open here.')
                    }
                    style={styles.eyeBtn}>
                    <Feather name="eye" size={20} color={colors.navy[700]} />
                  </Pressable>
                ) : doc.status === 'rejected' ? (
                  <Button
                    title="Re-upload"
                    variant="danger"
                    size="sm"
                    fullWidth={false}
                    onPress={() => markApproved(doc.id)}
                    style={styles.action}
                  />
                ) : (
                  <Button
                    title="Upload"
                    size="sm"
                    fullWidth={false}
                    onPress={() => markApproved(doc.id)}
                    style={styles.action}
                  />
                )}
              </View>
            </View>
          );
        })}

        {allApproved ? (
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
              Re-upload the insurance page and add your passbook to finish.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
