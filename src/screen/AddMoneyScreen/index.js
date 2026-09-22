import {
  PASSENGER_ADD_MONEY_QUICK,
  PASSENGER_ADD_MONEY_MIN,
  PASSENGER_ADD_MONEY_MAX,
  PASSENGER_ADD_MONEY_METHODS,
} from '../../config/staticData';
import React, {useMemo, useState} from 'react';
import {
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Feather} from '@react-native-vector-icons/feather/static';
import {MaterialDesignIcons} from '@react-native-vector-icons/material-design-icons/static';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useToast} from '../../components/Toast';
import useThemedStyles from '../../components/useThemedStyles';
import {useApp} from '../../context/AppContext';
import createStyles from './style';
import colors from '../../config/color';

const QUICK = PASSENGER_ADD_MONEY_QUICK;

function formatAmount(n) {
  return Number(n || 0).toLocaleString('en-IN');
}

export default function AddMoneyScreen() {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);
  const {colors} = useApp();
  const navigation = useNavigation();
  const {showToast} = useToast();

  const [amount, setAmount] = useState('500');
  const [method, setMethod] = useState('upi');

  const amountNum = useMemo(() => {
    const n = parseInt(String(amount).replace(/[^0-9]/g, ''), 10);
    return Number.isFinite(n) ? n : 0;
  }, [amount]);

  const onChangeAmount = text => {
    const digits = text.replace(/[^0-9]/g, '');
    if (digits.length > 5) {
      return;
    }
    setAmount(digits.replace(/^0+(?=\d)/, ''));
  };

  const pickQuick = value => {
    setAmount(String(value));
  };

  const canSubmit = amountNum >= MIN && amountNum <= MAX;

  return (
    <View style={styles.root}>
      <StatusBar barStyle={colors.barStyle} backgroundColor={colors.card} />
      <View style={[styles.header, {paddingTop: insets.top + 4}]}>
        <Pressable
          style={styles.headerBtn}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={8}>
          <Feather name="arrow-left" size={22} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Add money</Text>
        <View style={styles.headerBtn} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.scroll,
          {paddingBottom: Math.max(insets.bottom, 12) + 90},
        ]}>
        <View style={styles.amountCard}>
          <Text style={styles.amountLabel}>ENTER AMOUNT</Text>
          <View style={styles.amountRow}>
            <Text style={styles.currency}>₹</Text>
            <TextInput
              value={amount}
              onChangeText={onChangeAmount}
              keyboardType="number-pad"
              style={styles.amountInput}
              selectionColor={colors.orange[500]}
              cursorColor={colors.orange[500]}
              caretHidden={false}
              placeholder="0"
              placeholderTextColor={colors.gray[300]}
            />
          </View>
          <Text style={styles.amountHint}>
            Minimum ₹100 · Maximum ₹10,000 per top-up
          </Text>
        </View>

        <View style={styles.quickRow}>
          {QUICK.map(value => {
            const active = amountNum === value;
            return (
              <Pressable
                key={value}
                style={[styles.quickChip, active && styles.quickChipActive]}
                onPress={() => pickQuick(value)}>
                <Text
                  style={[
                    styles.quickText,
                    active && styles.quickTextActive,
                  ]}>
                  ₹{formatAmount(value)}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.sectionLabel}>PAY FROM</Text>
        <View style={styles.methodList}>
          {METHODS.map(item => {
            const active = method === item.id;
            return (
              <Pressable
                key={item.id}
                style={[styles.methodCard, active && styles.methodCardActive]}
                onPress={() => setMethod(item.id)}
                accessibilityRole="radio"
                accessibilityState={{selected: active}}>
                <View
                  style={[
                    styles.methodIcon,
                    active && styles.methodIconActive,
                  ]}>
                  {item.icon === 'card' ? (
                    <Feather
                      name="credit-card"
                      size={18}
                      color={active ? colors.orange[500] : colors.navy[700]}
                    />
                  ) : (
                    <MaterialDesignIcons
                      name="currency-inr"
                      size={20}
                      color={active ? colors.orange[500] : colors.navy[700]}
                    />
                  )}
                </View>
                <View style={styles.methodCopy}>
                  <Text style={styles.methodTitle}>{item.title}</Text>
                  <Text style={styles.methodSub}>{item.subtitle}</Text>
                </View>
                {active ? (
                  <View style={styles.methodCheck}>
                    <Feather name="check" size={12} color={colors.orange[500]} />
                  </View>
                ) : null}
              </Pressable>
            );
          })}
        </View>

        <View style={styles.infoBanner}>
          <Feather name="info" size={16} color={colors.blue[600]} />
          <Text style={styles.infoText}>
            Money lands in your wallet instantly. Wallet balance never expires
            and can be withdrawn to your bank.
          </Text>
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          {paddingBottom: Math.max(insets.bottom, 12)},
        ]}>
        <Pressable
          style={[styles.submitBtn, !canSubmit && styles.submitBtnDisabled]}
          disabled={!canSubmit}
          onPress={() => {
            showToast({
              type: 'success',
              message: `₹${formatAmount(amountNum)} added to wallet`,
            });
            navigation.goBack();
          }}
          accessibilityRole="button"
          accessibilityLabel={`Add ₹${formatAmount(amountNum)} to wallet`}>
          <Text style={styles.submitText}>
            Add ₹{formatAmount(amountNum || 0)} to wallet
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
