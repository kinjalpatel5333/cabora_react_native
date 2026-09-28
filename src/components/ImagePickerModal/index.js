import React from 'react';
import {
  Modal,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Feather } from '@react-native-vector-icons/feather/static';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../../context/AppContext';
import useThemedStyles from '../useThemedStyles';
import createStyles from './style';

export default function ImagePickerModal({
  visible,
  onClose,
  onSelectCamera,
  onSelectGallery,
  title = 'Upload Document',
  subtitle = 'Choose an option to upload your photo:',
}) {
  const insets = useSafeAreaInsets();
  const { colors } = useApp();
  const styles = useThemedStyles(createStyles);

  const handleCamera = () => {
    onClose?.();
    setTimeout(() => {
      onSelectCamera?.();
    }, 200);
  };

  const handleGallery = () => {
    onClose?.();
    setTimeout(() => {
      onSelectGallery?.();
    }, 200);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <TouchableOpacity
          activeOpacity={1}
          style={{ flex: 1 }}
          onPress={onClose}
        />
        <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 20) }]}>
          <View style={styles.dragHandle} />

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.closeButton}
              onPress={onClose}
              hitSlop={8}>
              <Feather name="x" size={18} color={colors.text} />
            </TouchableOpacity>
          </View>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}

          {/* Option 1: Take Photo (Camera) */}
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={handleCamera}
            style={styles.optionCard}>
            <View style={[styles.optionIconWrap, styles.optionIconCamera]}>
              <Feather name="camera" size={22} color={colors.primary || '#FF7006'} />
            </View>
            <View style={styles.optionCopy}>
              <Text style={styles.optionTitle}>Take Photo</Text>
              <Text style={styles.optionDesc}>Use camera to photograph your document</Text>
            </View>
            <Feather name="chevron-right" size={20} color={colors.muted || '#9CA3AF'} />
          </TouchableOpacity>

          {/* Option 2: Choose from Gallery */}
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={handleGallery}
            style={styles.optionCard}>
            <View style={[styles.optionIconWrap, styles.optionIconGallery]}>
              <Feather name="image" size={22} color={colors.blue?.[500] || '#2E7BE7'} />
            </View>
            <View style={styles.optionCopy}>
              <Text style={styles.optionTitle}>Choose from Gallery</Text>
              <Text style={styles.optionDesc}>Select document photo from your gallery</Text>
            </View>
            <Feather name="chevron-right" size={20} color={colors.muted || '#9CA3AF'} />
          </TouchableOpacity>

          {/* Cancel Button */}
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={onClose}
            style={styles.cancelBtn}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
