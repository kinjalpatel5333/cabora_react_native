import React, {useState} from 'react';
import {Linking, Modal, Text, View} from 'react-native';
import {Lucide} from '@react-native-vector-icons/lucide/static';
import Button from '../Button';
import {STORE_URL} from '../../config/setting';
import useThemedStyles from '../useThemedStyles';
import createStyles from './style';

const STATUS_CONFIG = {
  offline: {
    iconName: 'wifi-off',
    title: 'No internet connection',
    body: 'Cabora needs a connection to find drivers near you. Check Wi-Fi or mobile data and try again.',
    action: 'Retry',
    variant: 'primary',
  },
  no_internet: {
    iconName: 'wifi-off',
    title: 'No internet connection',
    body: 'Cabora needs a connection to find drivers near you. Check Wi-Fi or mobile data and try again.',
    action: 'Retry',
    variant: 'primary',
  },
  update: {
    iconName: 'refresh-cw',
    title: 'Update Cabora to continue',
    body: 'This version is no longer supported. Version 2.1 adds live trip recovery and faster pickups.',
    action: 'Update now',
    variant: 'primary',
  },
  upgrade: {
    iconName: 'refresh-cw',
    title: 'Update Cabora to continue',
    body: 'This version is no longer supported. Version 2.1 adds live trip recovery and faster pickups.',
    action: 'Update now',
    variant: 'primary',
  },
  maintenance: {
    iconName: 'settings',
    title: "We'll be right back",
    body: 'Cabora is under scheduled maintenance until 03:30 IST. Any trip in progress is safe and will resume.',
    action: 'Check again',
    variant: 'inverse',
  },
  under_maintenance: {
    iconName: 'settings',
    title: "We'll be right back",
    body: 'Cabora is under scheduled maintenance until 03:30 IST. Any trip in progress is safe and will resume.',
    action: 'Check again',
    variant: 'inverse',
  },
};

export default function AppStatusModal({
  visible = true,
  type = 'offline',
  title,
  body,
  actionText,
  onAction,
  onRetry,
  loading: externalLoading,
  isModal = true,
  style,
}) {
  const styles = useThemedStyles(createStyles);
  const [internalLoading, setInternalLoading] = useState(false);
  const config = STATUS_CONFIG[type] || STATUS_CONFIG.offline;

  const displayTitle = title || config.title;
  const displayBody = body || config.body;
  const displayAction = actionText || config.action;
  const iconName = config.iconName;
  const isLoading = externalLoading !== undefined ? externalLoading : internalLoading;

  const handleAction = async () => {
    if (isLoading) {
      return;
    }
    setInternalLoading(true);
    try {
      if (onAction) {
        await onAction();
      } else if (onRetry) {
        await onRetry();
      } else if (type === 'update' || type === 'upgrade') {
        await Linking.openURL(STORE_URL).catch(() => {});
      }
    } finally {
      setInternalLoading(false);
    }
  };

  const cardContent = (
    <View style={[styles.card, style]}>
      <View style={styles.iconCircle}>
        <Lucide name={iconName} size={28} color="#FFA048" />
      </View>
      <Text style={styles.cardTitle}>{displayTitle}</Text>
      <Text style={styles.cardBody}>{displayBody}</Text>
      <Button
        title={displayAction}
        variant={config.variant}
        onPress={handleAction}
        loading={isLoading}
        style={[
          styles.cardButton,
          config.variant === 'inverse' && styles.cardButtonInverse,
        ]}
        textStyle={config.variant === 'inverse' ? {color: '#FFFFFF'} : undefined}
      />
    </View>
  );

  if (!isModal) {
    return cardContent;
  }

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      statusBarTranslucent>
      <View style={styles.modalOverlay}>
        {cardContent}
      </View>
    </Modal>
  );
}
