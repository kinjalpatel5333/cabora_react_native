import { PASSENGER_PAYMENT_OFFERS_METHODS } from '../../config/staticData';
import React, {useEffect, useState} from 'react';
import {Animated, Dimensions, Modal, ScrollView, Text, View, TouchableOpacity} from 'react-native';
import {Feather} from '@react-native-vector-icons/feather/static';
import {MaterialDesignIcons} from '@react-native-vector-icons/material-design-icons/static';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import useThemedStyles from '../../components/useThemedStyles';
import {useApp} from '../../context/AppContext';
import useDraggableSheet from '../../hooks/useDraggableSheet';
import createStyles from './paymentOffersStyle';
import colors from '../../config/color';

const METHODS = PASSENGER_PAYMENT_OFFERS_METHODS;

function MethodIcon({icon, active, colors}) {
  const tint = active ? colors.white : colors.text;
  if (icon === 'credit-card-outline') {
    return <Feather name="credit-card" size={20} color={tint} />;
  }
  if (icon === 'wallet-outline') {
    return <MaterialDesignIcons name="wallet-outline" size={22} color={tint} />;
  }
  return <MaterialDesignIcons name="currency-inr" size={22} color={tint} />;
}

export default function PaymentOffersModal({
  visible,
  onClose,
  selectedId = 'upi',
  promoCode = 'CABORA50',
  onSave,
}) {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);
  const {colors} = useApp();
  const [draftId, setDraftId] = useState(selectedId);

  useEffect(() => {
    if (visible) {
      setDraftId(selectedId || 'upi');
    }
  }, [visible, selectedId]);

  const onSaveContinue = () => {
    const method = METHODS.find(item => item.id === draftId) || METHODS[0];
    onSave?.(method);
    onClose?.();
  };

  const sheetMaxH = Dimensions.get('window').height * 0.78;
  const {sheetTY, panHandlers, toggle, expanded, onSheetLayout} =
    useDraggableSheet({
      peekHeight: 200,
      visible,
    });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent>
      <View style={styles.root} pointerEvents="box-none">
        <TouchableOpacity activeOpacity={0.7} style={styles.backdrop} onPress={onClose} />

        <Animated.View
          onLayout={onSheetLayout}
          style={[
            styles.sheet,
            {
              maxHeight: sheetMaxH,
              paddingBottom: Math.max(insets.bottom, 10) + 10,
              transform: [{translateY: sheetTY}],
            },
          ]}>
          <View {...panHandlers}>
            <TouchableOpacity activeOpacity={0.7}
              onPress={toggle}
              accessibilityRole="button"
              accessibilityLabel={expanded ? 'Collapse sheet' : 'Expand sheet'}
              style={styles.grabberHit}>
              <View style={styles.grabber} />
            </TouchableOpacity>
          </View>
          <Text style={styles.title}>Payment & offers</Text>

          <ScrollView
            showsVerticalScrollIndicator={false}
            bounces={false}
            style={styles.list}
            contentContainerStyle={styles.listContent}>
            {METHODS.map(method => {
              const active = method.id === draftId;
              return (
                <TouchableOpacity activeOpacity={0.7}
                  key={method.id}
                  onPress={() => setDraftId(method.id)}
                  style={[
                    styles.methodCard,
                    active && styles.methodCardActive,
                  ]}>
                  <View
                    style={[
                      styles.methodIcon,
                      active && styles.methodIconActive,
                    ]}>
                    <MethodIcon
                      icon={method.icon}
                      active={active}
                      colors={colors}
                    />
                  </View>
                  <View style={styles.methodCopy}>
                    <Text style={styles.methodTitle}>{method.title}</Text>
                    <Text style={styles.methodSub} numberOfLines={1}>
                      {method.subtitle}
                    </Text>
                  </View>
                  {active ? (
                    <View style={styles.check}>
                      <MaterialDesignIcons
                        name="check-circle"
                        size={24}
                        color={colors.orange[500]}
                      />
                    </View>
                  ) : null}
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <View style={styles.offerCard}>
            <View style={styles.offerIcon}>
              <Feather name="percent" size={18} color={colors.text} />
            </View>
            <Text style={styles.offerCode}>{promoCode}</Text>
            <View style={styles.appliedBtn}>
              <Text style={styles.appliedText}>Applied</Text>
            </View>
          </View>

          <TouchableOpacity activeOpacity={0.7} style={styles.saveBtn} onPress={onSaveContinue}>
            <Text style={styles.saveText}>Save & continue</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}
