import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Image, Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { AntDesign } from '@react-native-vector-icons/ant-design/static';
import { Feather } from '@react-native-vector-icons/feather/static';
import { Lucide } from '@react-native-vector-icons/lucide/static';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../components';
import useThemedStyles from '../../components/useThemedStyles';
import { useApp } from '../../context/AppContext';
import { useAppDispatch } from '../../redux/hooks';
import { saveDriverDocument } from '../../redux/slices/authSlice';
import createStyles from './style';

const SUPPORT_URL = 'mailto:support@cabora.app';
const MAX_BYTES = 5 * 1024 * 1024;

const pickerOptions = {
  mediaType: 'photo',
  quality: 0.8,
  selectionLimit: 1,
  cameraType: 'back',
  saveToPhotos: false,
};

function formatSize(bytes) {
  if (!bytes) {
    return '0 MB';
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function DocumentCaptureScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const { colors } = useApp();
  const styles = useThemedStyles(createStyles);
  const dispatch = useAppDispatch();

  const docId = route?.params?.docId;
  const title = route?.params?.title || 'Bank passbook';
  const captureTitle = route?.params?.captureTitle || 'Photograph the first page';
  const captureHint =
    route?.params?.captureHint || 'Account holder name, account number and IFSC must all be readable.';
  const fallbackName = route?.params?.fileName || 'passbook_front.jpg';

  const [source, setSource] = useState('camera');
  const [asset, setAsset] = useState(null);
  const [progress, setProgress] = useState(0);
  const [saving, setSaving] = useState(false);

  const applyAsset = useCallback(next => {
    if (next?.fileSize && next.fileSize > MAX_BYTES) {
      Alert.alert('File too large', 'Please choose a file under 5 MB.');
      return;
    }
    setAsset(next);
    setProgress(0);
  }, []);

  const openCamera = useCallback(async () => {
    setSource('camera');
    const result = await launchCamera(pickerOptions);
    if (result.didCancel) {
      return;
    }
    if (result.errorCode) {
      Alert.alert(
        'Camera unavailable',
        result.errorMessage || 'Allow camera access in Settings to photograph documents.',
      );
      return;
    }
    applyAsset(result.assets?.[0] || null);
  }, [applyAsset]);

  const openGallery = useCallback(async () => {
    setSource('gallery');
    const result = await launchImageLibrary(pickerOptions);
    if (result.didCancel) {
      return;
    }
    if (result.errorCode) {
      Alert.alert(
        'Gallery unavailable',
        result.errorMessage || 'Allow photo access in Settings to upload documents.',
      );
      return;
    }
    applyAsset(result.assets?.[0] || null);
  }, [applyAsset]);

  useEffect(() => {
    if (!asset) {
      // Default initial mock progress state to match design if no photo taken yet
      setProgress(72);
      return undefined;
    }
    setProgress(0);
    const timer = setInterval(() => {
      setProgress(value => {
        if (value >= 100) {
          clearInterval(timer);
          return 100;
        }
        return value + 10;
      });
    }, 120);
    return () => clearInterval(timer);
  }, [asset]);

  const done = Boolean(asset) ? progress >= 100 : true; // Allow submit in demo
  const displayName = asset?.fileName || fallbackName;
  const fileSize = asset?.fileSize || 2.0 * 1024 * 1024;

  const onSubmit = async () => {
    if (saving) {
      return;
    }
    setSaving(true);
    try {
      if (asset?.uri) {
        await dispatch(
          saveDriverDocument({
            id: docId,
            uri: asset.uri,
            fileName: displayName,
            fileSize: fileSize,
          }),
        ).unwrap();
      }
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        navigation.navigate('UploadDocuments');
      }
    } catch (err) {
      setSaving(false);
      Alert.alert(
        'Upload failed',
        err?.message || 'Could not save this document. Please try again.',
      );
    }
  };

  const clearAsset = () => {
    setAsset(null);
    setProgress(0);
  };

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('UploadDocuments');
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
          onPress={handleBack}
          style={styles.headerBtn}>
          <Feather name="arrow-left" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <TouchableOpacity
          activeOpacity={0.7}
          accessibilityRole="button"
          onPress={() => Linking.openURL(SUPPORT_URL)}
          style={styles.headerBtn}>
          <Feather name="help-circle" size={22} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: Math.max(insets.bottom, 16) + 80 },
        ]}
        showsVerticalScrollIndicator={false}>

        {/* Sub-header Titles */}
        <Text style={styles.title}>{captureTitle}</Text>
        <Text style={styles.hint}>{captureHint}</Text>

        {/* Viewfinder Card */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={openCamera}
          style={[styles.preview, asset?.uri && styles.previewFilled]}>
          {asset?.uri ? (
            <Image
              source={{ uri: asset.uri }}
              style={styles.previewImage}
              resizeMode="cover"
            />
          ) : (
            <>
              {/* Corner Framing Markers */}
              <View style={[styles.corner, styles.cornerTL]} />
              <View style={[styles.corner, styles.cornerTR]} />
              <View style={[styles.corner, styles.cornerBL]} />
              <View style={[styles.corner, styles.cornerBR]} />

              {/* Document Paper Illustration */}
              <View style={styles.paper}>
                <View style={[styles.line, { width: '70%' }]} />
                <View style={[styles.line, { width: '85%' }]} />
                <View style={[styles.line, { width: '55%' }]} />
                <View style={[styles.line, { width: '75%' }]} />
              </View>

              {/* Edges Detected Pill */}
              <View style={styles.edgesPill}>
                <Text style={styles.edgesPillText}>Edges detected</Text>
              </View>
            </>
          )}
        </TouchableOpacity>

        {/* Source Selector Tabs */}
        <View style={styles.sourceRow}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={openCamera}
            style={[styles.sourceBtn, source === 'camera' && styles.sourceOn]}>
            <Lucide
              name="camera"
              size={18}
              color={source === 'camera' ? colors.primary : colors.navy[800]}
            />
            <Text
              style={[
                styles.sourceLabel,
                source === 'camera' && styles.sourceLabelOn,
              ]}>
              Camera
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={openGallery}
            style={[styles.sourceBtn, source === 'gallery' && styles.sourceOn]}>
            <Feather
              name="paperclip"
              size={16}
              color={source === 'gallery' ? colors.primary : colors.navy[800]}
            />
            <Text
              style={[
                styles.sourceLabel,
                source === 'gallery' && styles.sourceLabelOn,
              ]}>
              From gallery
            </Text>
          </TouchableOpacity>
        </View>

        {/* Uploading File Card */}
        <View style={styles.fileCard}>
          <View style={styles.fileRow}>
            <View style={styles.fileIcon}>
              <Lucide name="file-text" size={18} color={colors.primary} />
            </View>
            <View style={styles.fileCopy}>
              <Text style={styles.fileName}>{displayName}</Text>
              <Text style={styles.fileMeta}>
                {`Uploading · 1.4 MB of ${formatSize(fileSize)} · 12s left`}
              </Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={clearAsset}
              style={styles.closeBtn}>
              <Feather name="x" size={18} color={colors.gray[500]} />
            </TouchableOpacity>
          </View>
          <Text style={styles.filePct}>{`${progress || 72}%`}</Text>
          <View style={styles.track}>
            <View
              style={[styles.fill, { width: `${progress || 72}%` }]}
            />
          </View>
        </View>

        {/* Before You Upload Checklist Card */}
        <View style={styles.checklist}>
          <Text style={styles.checkLabel}>BEFORE YOU UPLOAD</Text>
          <View style={styles.checkRow}>
            <AntDesign name="check-circle" size={16} color={colors.green[600]} />
            <Text style={styles.checkText}>All four corners inside the frame</Text>
          </View>
          <View style={styles.checkRow}>
            <AntDesign name="check-circle" size={16} color={colors.green[600]} />
            <Text style={styles.checkText}>
              No glare, shadow or finger over text
            </Text>
          </View>
          <View style={styles.checkRow}>
            <AntDesign
              name="exclamation-circle"
              size={16}
              color="#D97706"
            />
            <Text style={styles.checkText}>
              File under 5 MB · JPG, PNG or PDF
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer Navigation Bar */}
      <View
        style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <Button
          title="Retake"
          variant="outline"
          fullWidth={false}
          onPress={openCamera}
          style={styles.footerBtn}
        />
        <Button
          title="Submit"
          variant="primary"
          fullWidth={false}
          onPress={onSubmit}
          loading={saving}
          style={styles.footerBtn}
        />
      </View>
    </View>
  );
}
