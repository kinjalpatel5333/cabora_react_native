import { PASSENGER_PORTAL_TIMELINE } from '../../config/staticData';
import React, {useEffect, useState} from 'react';
import {
  Animated,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Feather} from '@react-native-vector-icons/feather/static';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {images} from '../../assets';
import ConfirmDialog from '../../components/ConfirmDialog';
import {useToast} from '../../components/Toast';
import useThemedStyles from '../../components/useThemedStyles';
import {useApp} from '../../context/AppContext';
import useDraggableSheet from '../../hooks/useDraggableSheet';
import createStyles from './style';
import colors from '../../config/color';

const TIMELINE = PASSENGER_PORTAL_TIMELINE;

export default function PortalTrackingScreen() {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);
  const {colors} = useApp();
  const navigation = useNavigation();
  const {showToast} = useToast();
  const [cancelOpen, setCancelOpen] = useState(false);
  const {sheetTY, panHandlers, toggle, onSheetLayout} = useDraggableSheet({
    peekHeight: 220,
    visible: true,
    initialExpanded: true,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('PortalDelivered');
    }, 10000);
    return () => clearTimeout(timer);
  }, [navigation]);

  const closeTracking = () => {
    navigation.popToTop();
    navigation.navigate('MainTabs', {screen: 'Services'});
  };

  return (
    <View style={styles.root}>
      <StatusBar
        barStyle={colors.barStyle}
        backgroundColor="transparent"
        translucent
      />
      <View style={styles.mapBg}>
        <Image
          source={colors.isDark ? images.homeMapDark : images.homeMap}
          style={styles.mapImage}
          resizeMode="cover"
        />
        <Pressable style={styles.backdrop} onPress={closeTracking} />
      </View>

      <Pressable
        style={[styles.backBtn, {top: insets.top + 8}]}
        onPress={closeTracking}
        accessibilityRole="button"
        accessibilityLabel="Go back"
        hitSlop={8}>
        <Feather name="arrow-left" size={20} color={colors.text} />
      </Pressable>

      <Animated.View
        onLayout={onSheetLayout}
        style={[styles.sheet, {transform: [{translateY: sheetTY}]}]}>
        <View {...panHandlers} style={styles.handleHit}>
          <Pressable onPress={toggle} accessibilityRole="button">
            <View style={styles.handle} />
          </Pressable>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          bounces={false}
          contentContainerStyle={styles.scroll}>
          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>In transit</Text>
          </View>
          <Text style={styles.etaTitle}>Arriving in 14 minutes</Text>
          <Text style={styles.orderMeta}>
            PRC-40218 · Documents · up to 3 kg
          </Text>

          <View style={styles.timeline}>
            {TIMELINE.map((item, index) => {
              const isLast = index === TIMELINE.length - 1;
              const pending = item.status === 'pending';
              const active = item.status === 'active';
              return (
                <View key={item.id} style={styles.timelineRow}>
                  <View style={styles.timelineTrack}>
                    <View
                      style={[
                        styles.timelineDot,
                        item.status === 'done' && styles.timelineDotDone,
                        active && styles.timelineDotActive,
                        pending && styles.timelineDotPending,
                      ]}
                    />
                    {!isLast ? <View style={styles.timelineLine} /> : null}
                  </View>
                  <View style={styles.timelineCopy}>
                    <Text
                      style={[
                        styles.timelineTitle,
                        pending && styles.timelineTitlePending,
                      ]}>
                      {item.title}
                    </Text>
                    <Text
                      style={[
                        styles.timelineTime,
                        active && styles.timelineTimeActive,
                        pending && styles.timelineTimePending,
                      ]}>
                      {item.time}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>

          <View style={styles.codeCard}>
            <View style={styles.codeCopy}>
              <Text style={styles.codeLabel}>HANDOVER CODE</Text>
              <Text style={styles.codeValue}>4 1 8 2</Text>
            </View>
            <Text style={styles.codeHint}>
              Priya shares this with the rider
            </Text>
          </View>

          <View style={styles.riderCard}>
            <View style={styles.riderTop}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>AK</Text>
              </View>
              <View style={styles.riderCopy}>
                <Text style={styles.riderName}>Arun Kumar</Text>
                <Text style={styles.riderMeta}>
                  4.91 · bike · KA 05 HJ 2201
                </Text>
              </View>
            </View>
            <View style={styles.actionRow}>
              <Pressable
                style={styles.actionBtn}
                onPress={() =>
                  showToast({type: 'info', message: 'Calling rider'})
                }>
                <Feather name="phone" size={14} color={colors.text} />
                <Text style={styles.actionText}>Call</Text>
              </Pressable>
              <Pressable
                style={styles.actionBtn}
                onPress={() =>
                  showToast({type: 'info', message: 'Message rider'})
                }>
                <Feather
                  name="message-circle"
                  size={14}
                  color={colors.text}
                />
                <Text style={styles.actionText}>Message</Text>
              </Pressable>
              <Pressable
                style={styles.actionBtn}
                onPress={() =>
                  showToast({type: 'info', message: 'Share tracking link'})
                }>
                <Feather name="upload" size={14} color={colors.text} />
                <Text style={styles.actionText}>Share link</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>

        <View
          style={[
            styles.footer,
            {paddingBottom: Math.max(insets.bottom, 12)},
          ]}>
          <Text style={styles.footerPaid}>Total ₹41 · paid</Text>
          <Pressable onPress={() => setCancelOpen(true)} hitSlop={8}>
            <Text style={styles.cancelText}>Cancel portal</Text>
          </Pressable>
        </View>
      </Animated.View>

      <ConfirmDialog
        visible={cancelOpen}
        variant="danger"
        title="Cancel this portal?"
        message="The rider will be notified and any paid amount will be refunded to your payment method."
        confirmLabel="Cancel portal"
        cancelLabel="Keep portal"
        onClose={() => setCancelOpen(false)}
        onCancel={() => setCancelOpen(false)}
        onConfirm={() => {
          setCancelOpen(false);
          showToast({type: 'info', message: 'Portal cancelled'});
          closeTracking();
        }}
      />
    </View>
  );
}
