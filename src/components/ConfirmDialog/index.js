import React from 'react';
import {Modal, Text, View, TouchableOpacity} from 'react-native';
import {Feather} from '@react-native-vector-icons/feather/static';
import {Lucide} from '@react-native-vector-icons/lucide/static';
import useThemedStyles from '../useThemedStyles';
import {useApp} from '../../context/AppContext';
import createStyles from './style';
import colors from '../../config/color';
import {ToastHost} from '../Toast';

/**
 * Centered confirmation card over a full-screen dim.
 * variant: 'default' (orange) | 'danger' (red)
 */
export default function ConfirmDialog({
  visible,
  onClose,
  variant = 'default',
  icon,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}) {
  const styles = useThemedStyles(createStyles);
  const {colors} = useApp();
  const isDanger = variant === 'danger';

  const handleCancel = () => {
    onCancel?.();
    onClose?.();
  };

  const handleConfirm = () => {
    onConfirm?.();
    onClose?.();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      presentationStyle="overFullScreen"
      onRequestClose={handleCancel}
      statusBarTranslucent>
      <View style={styles.root}>
        <TouchableOpacity activeOpacity={0.7}
          style={styles.backdrop}
          onPress={handleCancel}
          accessibilityRole="button"
          accessibilityLabel="Dismiss"
        />
        <View style={styles.card}>
          <View
            style={[
              styles.iconWrap,
              isDanger ? styles.iconWrapDanger : styles.iconWrapDefault,
            ]}>
            {icon ||
              (isDanger ? (
                <Lucide
                  name="triangle-alert"
                  size={28}
                  color={colors.red[500]}
                />
              ) : (
                <Feather
                  name="help-circle"
                  size={28}
                  color={colors.orange[600]}
                />
              ))}
          </View>

          <Text style={styles.title}>{title}</Text>
          {message ? (
            <Text style={styles.message}>
              {typeof message === 'string'
                ? message
                : typeof message?.message === 'string'
                  ? message.message
                  : typeof message?.error === 'string'
                    ? message.error
                    : JSON.stringify(message)}
            </Text>
          ) : null}

          <TouchableOpacity activeOpacity={0.7}
            style={[
              styles.primaryBtn,
              isDanger ? styles.primaryBtnDanger : styles.primaryBtnDefault,
            ]}
            onPress={handleConfirm}>
            <Text style={styles.primaryText}>{confirmLabel}</Text>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.7} style={styles.secondaryBtn} onPress={handleCancel}>
            <Text style={styles.secondaryText}>{cancelLabel}</Text>
          </TouchableOpacity>
        </View>
        <ToastHost />
      </View>
    </Modal>
  );
}
