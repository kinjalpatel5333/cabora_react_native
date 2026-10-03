import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Image,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import CameraIOS from 'react-native-camera-kit/src/Camera.ios';
import CameraAndroid from 'react-native-camera-kit/src/Camera.android';
import { CameraType } from 'react-native-camera-kit';
import { launchImageLibrary } from 'react-native-image-picker';
import { Feather } from '@react-native-vector-icons/feather/static';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../components';
import { useToast } from '../../components/Toast';
import useThemedStyles from '../../components/useThemedStyles';
import { useApp } from '../../context/AppContext';
import {
  requestCameraPermission,
  requestGalleryPermission,
  showPermissionSettingsAlert,
} from '../../utils/cameraPermission';
import { formatDisplayPlate, isValidNumberPlate, normalizeNumberPlate } from '../../utils/numberPlate';
import { scanNumberPlate } from '../../services/numberPlateService';
import createStyles from './style';

const Camera = Platform.OS === 'ios' ? CameraIOS : CameraAndroid;

/**
 * Error boundary to ensure native camera view errors never crash the screen
 */
class CameraErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error) {
    console.warn('CameraErrorBoundary caught an error:', error);
    if (this.props.onError) {
      this.props.onError(error);
    }
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback || null;
    }
    return this.props.children;
  }
}

const pickerOptions = {
  mediaType: 'photo',
  quality: 0.85,
  selectionLimit: 1,
  cameraType: 'back',
  saveToPhotos: false,
};

const MAX_BYTES = 10 * 1024 * 1024; // 10MB limit

export default function ScanVehicleScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const { colors } = useApp();
  const { showToast } = useToast();
  const styles = useThemedStyles(createStyles);

  const onScanComplete = route?.params?.onScanComplete;
  const initialPlate = route?.params?.initialPlate;

  const [imageUri, setImageUri] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [detectedPlate, setDetectedPlate] = useState(null);
  const [plateInput, setPlateInput] = useState(initialPlate ? formatDisplayPlate(initialPlate) : '');
  const [confidence, setConfidence] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Live in-app camera scanner states
  const cameraRef = useRef(null);
  const [torchMode, setTorchMode] = useState('off');
  const isScanningActiveRef = useRef(false);

  // Animated laser scanning beam
  const scanAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isScanning) {
      const animLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(scanAnim, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(scanAnim, {
            toValue: 0,
            duration: 1200,
            useNativeDriver: true,
          }),
        ]),
      );
      animLoop.start();
      return () => animLoop.stop();
    } else {
      scanAnim.setValue(0.5);
    }
  }, [isScanning, scanAnim]);

  /**
   * Request camera permission on mount and trigger camera initialization
   */
  useEffect(() => {
    requestCameraPermission().then(() => {
      if (cameraRef.current?.requestDeviceCameraAuthorization) {
        cameraRef.current.requestDeviceCameraAuthorization();
      }
    });
  }, []);

  /**
   * Process a captured or selected image URI through the on-device ANPR service
   */
  const processImage = useCallback(
    async uri => {
      if (!uri) return;
      setImageUri(uri);
      setIsProcessing(true);
      setErrorMessage(null);
      setDetectedPlate(null);
      setPlateInput('');
      setConfidence(null);

      try {
        const result = await scanNumberPlate(uri);
        const normalized = normalizeNumberPlate(result.plateNumber);

        if (!normalized || !isValidNumberPlate(normalized)) {
          throw new Error('Only valid Indian vehicle number plates are supported (e.g. GJ05AB1234, MH12DE1433, 22BH1234AA).');
        }

        setDetectedPlate(normalized);
        setPlateInput(formatDisplayPlate(normalized));
        setConfidence(result.confidence ?? null);
        showToast({
          type: 'success',
          message: `Plate detected: ${formatDisplayPlate(normalized)}`,
        });

        if (typeof onScanComplete === 'function') {
          onScanComplete({
            plateNumber: normalized,
            formattedPlate: formatDisplayPlate(normalized),
            confidence: result.confidence ?? null,
            imageUri: uri,
          });
        }
      } catch (err) {
        console.warn('ScanVehicle process error:', err);
        const userMsg =
          err?.message ||
          'No number plate detected. Please position the number plate clearly in good light.';
        setErrorMessage(userMsg);
        showToast({
          type: 'error',
          message: userMsg,
        });
      } finally {
        setIsProcessing(false);
      }
    },
    [onScanComplete, showToast],
  );

  /**
   * Handle Gallery image selection
   */
  const handleUploadFromGallery = useCallback(async () => {
    stopScan();
    const hasPermission = await requestGalleryPermission();
    if (!hasPermission) {
      showPermissionSettingsAlert(
        'Photo Access Required',
        'Photo library access is required to select a vehicle photo. Please enable it in Settings.',
      );
      return;
    }

    try {
      const result = await launchImageLibrary(pickerOptions);
      if (result.didCancel) return;
      if (result.errorCode) {
        showPermissionSettingsAlert(
          'Gallery Error',
          result.errorMessage || 'Unable to open photo library. Please grant permission in Settings.',
        );
        return;
      }

      const asset = result.assets?.[0];
      if (!asset?.uri) return;

      if (asset.fileSize && asset.fileSize > MAX_BYTES) {
        showToast({
          type: 'error',
          message: 'Image exceeds 10MB. Please select a smaller photo.',
        });
        return;
      }

      processImage(asset.uri);
    } catch (e) {
      console.warn('Gallery launch exception:', e);
      showToast({ type: 'error', message: 'Failed to open gallery.' });
    }
  }, [processImage, showToast]);

  /**
   * Stop scanning
   */
  const stopScan = useCallback(() => {
    isScanningActiveRef.current = false;
    setIsScanning(false);
  }, []);

  /**
   * Start auto-scanning with live camera
   */
  const startAutoScan = useCallback(async () => {
    if (isScanningActiveRef.current || isProcessing) return;

    // Check camera permission
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      showPermissionSettingsAlert(
        'Camera Access Required',
        'Camera access is required to scan the vehicle number plate. Please enable it in Settings.',
      );
      return;
    }

    // Reset previous image / results to start fresh scan
    setImageUri(null);
    setDetectedPlate(null);
    setErrorMessage(null);
    setConfidence(null);
    setIsScanning(true);
    isScanningActiveRef.current = true;

    // Give Camera component a brief moment to mount and initialize hardware
    await new Promise(resolve => setTimeout(resolve, 600));

    try {
      while (isScanningActiveRef.current) {
        if (!cameraRef.current?.capture) {
          await new Promise(resolve => setTimeout(resolve, 300));
          continue;
        }

        try {
          const capture = await cameraRef.current.capture();
          if (!isScanningActiveRef.current) break;

          if (capture?.uri) {
            try {
              const result = await scanNumberPlate(capture.uri, { minConfidence: 45 });
              if (result?.plateNumber) {
                const normalized = normalizeNumberPlate(result.plateNumber);
                if (isValidNumberPlate(normalized)) {
                  // Found valid plate! Stop scanning and set result
                  isScanningActiveRef.current = false;
                  setIsScanning(false);
                  setImageUri(capture.uri);
                  setDetectedPlate(normalized);
                  setPlateInput(formatDisplayPlate(normalized));
                  setConfidence(result.confidence ?? 95);
                  showToast({
                    type: 'success',
                    message: `Plate detected: ${formatDisplayPlate(normalized)}`,
                  });

                  if (typeof onScanComplete === 'function') {
                    onScanComplete({
                      plateNumber: normalized,
                      formattedPlate: formatDisplayPlate(normalized),
                      confidence: result.confidence ?? 95,
                      imageUri: capture.uri,
                    });
                  }
                  break;
                }
              }
            } catch {
              // Frame did not contain valid plate, keep continuous scan going
            }
          }
        } catch (capErr) {
          console.log('Capture frame warning:', capErr);
        }

        // Delay between frame scans (350ms for smooth performance without throttling)
        await new Promise(resolve => setTimeout(resolve, 350));
      }
    } catch (err) {
      console.warn('Auto-scan error:', err);
    } finally {
      if (isScanningActiveRef.current) {
        isScanningActiveRef.current = false;
        setIsScanning(false);
      }
    }
  }, [isProcessing, onScanComplete, showToast]);

  // Auto-start scanning on mount when opened to scan plate
  useEffect(() => {
    const shouldAutoStart = route?.params?.autoStart !== false;
    if (shouldAutoStart && !imageUri && !detectedPlate) {
      const timer = setTimeout(() => {
        startAutoScan();
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [route?.params?.autoStart, startAutoScan]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isScanningActiveRef.current = false;
    };
  }, []);

  /**
   * Confirm the detected plate and return result to caller
   */
  const handleConfirm = useCallback(() => {
    if (!detectedPlate) return;

    if (!isValidNumberPlate(detectedPlate)) {
      showToast({
        type: 'error',
        message: 'Please enter a valid Indian vehicle number plate (e.g. GJ 05 AB 1234).',
      });
      return;
    }

    if (typeof onScanComplete === 'function') {
      onScanComplete({
        plateNumber: detectedPlate,
        formattedPlate: formatDisplayPlate(detectedPlate),
        confidence,
        imageUri,
      });
    }

    navigation.goBack();
  }, [confidence, detectedPlate, imageUri, navigation, onScanComplete, showToast]);

  /**
   * Reset scanner state for a new capture
   */
  const handleRescan = useCallback(() => {
    setDetectedPlate(null);
    setConfidence(null);
    setErrorMessage(null);
    setImageUri(null);
    startAutoScan();
  }, [startAutoScan]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
          style={styles.headerBtn}
          hitSlop={8}>
          <Feather name="arrow-left" size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan Vehicle</Text>
        <View style={styles.headerRightPlaceholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitleText}>
          Position the Indian vehicle number plate inside the frame or upload a clear photo from your gallery.
        </Text>

        {/* Scanner Viewfinder / Camera Section Area */}
        <View style={styles.scannerContainer}>
          {/* Standby placeholder when scan has not started and no captured image */}
          {!isScanning && !imageUri && (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={startAutoScan}
              style={styles.emptyStateContainer}>
              <View style={styles.emptyStateIconWrap}>
                <Feather name="camera" size={32} color={colors.orange[500]} />
              </View>
              <Text style={styles.emptyStatePrompt}>Tap to Start Camera Scan</Text>
              <Text style={styles.emptyStateSubtext}>Align Indian number plate inside the frame</Text>
            </TouchableOpacity>
          )}

          {/* Live In-App Camera: Active and visible only when scan starts */}
          {isScanning && !imageUri && (
            <CameraErrorBoundary>
              <Camera
                ref={cameraRef}
                cameraType={CameraType.Back}
                flashMode="auto"
                torchMode={torchMode}
                style={styles.liveCameraPreview}
                resetFocusTimeout={0}
                resetFocusWhenMotionDetected={true}
              />
            </CameraErrorBoundary>
          )}

          {/* Captured Image Freeze Overlay (when a plate has been detected) */}
          {imageUri && (
            <Image source={{ uri: imageUri }} style={styles.capturedImage} />
          )}

          {/* Torch Toggle Button (only when live camera is scanning) */}
          {isScanning && !imageUri && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setTorchMode(prev => (prev === 'on' ? 'off' : 'on'))}
              style={styles.liveTorchBtn}>
              <Feather
                name={torchMode === 'on' ? 'zap' : 'zap-off'}
                size={18}
                color={torchMode === 'on' ? colors.orange[500] : colors.white}
              />
            </TouchableOpacity>
          )}

          {/* Viewfinder Target Frame with Animated Laser Scanning Line */}
          {isScanning && !imageUri && !isProcessing && (
            <View style={styles.viewfinderOverlay} pointerEvents="none">
              <View style={styles.targetFrame}>
                <View style={styles.targetCornerTL} />
                <View style={styles.targetCornerTR} />
                <View style={styles.targetCornerBL} />
                <View style={styles.targetCornerBR} />
                {/* Laser scan line */}
                <Animated.View
                  style={[
                    styles.scanLaserLine,
                    {
                      transform: [
                        {
                          translateY: scanAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [-36, 36],
                          }),
                        },
                      ],
                    },
                  ]}
                />
                <Text style={styles.frameHintText}>
                  SCANNING INDIAN PLATE
                </Text>
              </View>
            </View>
          )}

          {/* Live Status Badge */}
          {isScanning && !imageUri && (
            <View style={styles.liveStatusBadge}>
              <View style={[styles.pulseDot, styles.pulseDotScanning]} />
              <Text style={styles.liveStatusText}>
                Auto-scanning plate... hold steady
              </Text>
            </View>
          )}

          {/* Processing / Detecting State */}
          {isProcessing && (
            <View style={styles.detectingOverlay}>
              <ActivityIndicator size="large" color={colors.orange[500]} style={styles.detectingSpinner} />
              <Text style={styles.detectingTitle}>Detecting number plate...</Text>
              <Text style={styles.detectingSubtitle}>Reading registration number with on-device OCR</Text>
            </View>
          )}
        </View>

        {/* Capture / Select Buttons */}
        <View style={styles.actionButtonsRow}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={isScanning ? stopScan : startAutoScan}
            disabled={isProcessing}
            style={[styles.actionBtn, isScanning ? styles.actionBtnDanger : styles.actionBtnPrimary]}>
            {isScanning ? (
              <Feather name="square" size={18} color={colors.white} />
            ) : (
              <Feather name="camera" size={18} color={colors.white} />
            )}
            <Text style={[styles.actionBtnText, styles.actionBtnTextPrimary]}>
              {isScanning ? 'Stop Scan' : 'Scan Vehicle'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleUploadFromGallery}
            disabled={isProcessing}
            style={styles.actionBtn}>
            <Feather name="image" size={18} color={colors.text} />
            <Text style={styles.actionBtnText}>Upload Image</Text>
          </TouchableOpacity>
        </View>

        {/* Success: Detected Number Plate Card */}
        {detectedPlate && !isProcessing && (
          <View style={styles.resultCard}>
            <View style={styles.resultHeaderRow}>
              <Text style={styles.resultLabel}>Number Plate</Text>
              {confidence !== null && confidence !== undefined && (
                <View style={styles.confidenceBadge}>
                  <Feather name="check-circle" size={13} color="#15803D" />
                  <Text style={styles.confidenceText}>Confidence: {confidence}%</Text>
                </View>
              )}
            </View>

            {/* Styled Indian Number Plate Badge (Editable) */}
            <View style={styles.plateGraphicContainer}>
              <View style={styles.plateIndStripe}>
                <View style={styles.plateIndChakra} />
                <Text style={styles.plateIndText}>IND</Text>
              </View>
              <TextInput
                value={plateInput}
                onChangeText={text => {
                  const upper = text.toUpperCase();
                  setPlateInput(upper);
                  setDetectedPlate(normalizeNumberPlate(upper));
                }}
                onBlur={() => {
                  if (detectedPlate) {
                    setPlateInput(formatDisplayPlate(detectedPlate));
                  }
                }}
                autoCapitalize="characters"
                maxLength={14}
                style={styles.plateNumberInput}
              />
              <Feather name="edit-2" size={15} color={colors.isDark ? colors.gray[400] : colors.gray[500]} />
            </View>

            <Text style={styles.editHintText}>Tap plate above to adjust characters if needed</Text>
            <Text style={styles.normalizedHint}>Normalized: {detectedPlate}</Text>
          </View>
        )}

        {/* Error Feedback Card */}
        {errorMessage && !isProcessing && (
          <View style={styles.errorCard}>
            <View style={styles.errorIconWrap}>
              <Feather name="alert-triangle" size={18} color="#DC2626" />
            </View>
            <View style={styles.errorCopy}>
              <Text style={styles.errorTitle}>Detection Failed</Text>
              <Text style={styles.errorDesc}>{errorMessage}</Text>
            </View>
          </View>
        )}

        {/* Confirm / Rescan Buttons */}
        {detectedPlate && !isProcessing && (
          <View style={styles.confirmSection}>
            <Button
              title="Confirm Plate"
              onPress={handleConfirm}
              size="lg"
              style={styles.confirmBtn}
            />
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={handleRescan}
              style={styles.rescanBtn}>
              <Text style={styles.rescanBtnText}>Rescan / Try Again</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Retry Button on Error */}
        {errorMessage && !isProcessing && (
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={handleRescan}
            style={[styles.rescanBtn, styles.retryBtn]}>
            <Text style={styles.rescanBtnText}>Try Again</Text>
          </TouchableOpacity>
        )}

        {/* Tips for high accuracy */}
        <View style={styles.tipsCard}>
          <View style={styles.tipsHeader}>
            <Feather name="info" size={16} color={colors.orange[600]} />
            <Text style={styles.tipsTitle}>Indian Vehicle Plates Only</Text>
          </View>
          <Text style={styles.tipsItem}>• Strictly detects Indian State plates (e.g. GJ 05 AB 1234, DL 3C AA 1111) and BH series.</Text>
          <Text style={styles.tipsItem}>• Keep the number plate level and centered within the frame.</Text>
          <Text style={styles.tipsItem}>• Avoid severe glare, heavy shadow, or night darkness.</Text>
        </View>
      </ScrollView>
    </View>
  );
}
