import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from 'react-native';
import { AntDesign } from '@react-native-vector-icons/ant-design/static';
import { Feather } from '@react-native-vector-icons/feather/static';
import { Lucide } from '@react-native-vector-icons/lucide/static';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../components/Toast';
import useThemedStyles from '../../components/useThemedStyles';
import { useSidebar } from '../../context/SidebarContext';
import createStyles from './style';
import colors from '../../config/color';

import { DRIVER_WALLET_QUICK_AMOUNTS as QUICK_AMOUNTS, DRIVER_WALLET_PAYOUT_HISTORY as PAYOUT_HISTORY } from '../../config/staticData';

export default function DriverWalletScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useApp();
  const styles = useThemedStyles(createStyles);
  const { openDrawer } = useSidebar();
  const { showToast } = useToast();

  const [selectedPill, setSelectedPill] = useState('4200');
  const [withdrawAmount, setWithdrawAmount] = useState('4,200');

  const handleSelectPill = item => {
    setSelectedPill(item.id);
    setWithdrawAmount(item.value);
  };

  const handleWithdraw = () => {
    showToast({
      title: 'Withdrawal Initiated',
      message: `₹${withdrawAmount} is being transferred to HDFC Bank •••• 6621`,
      type: 'success',
    });
  };

  const handleChangeBank = () => {
    showToast({
      title: 'Linked Bank Accounts',
      message: 'Bank account settings opening...',
      type: 'info',
    });
  };

  return (
    <View style={styles.root}>
      <StatusBar
        barStyle={colors.barStyle}
        backgroundColor={colors.slate[50]}
        translucent={false}
      />

      {/* Top Header */}
      <View
        style={[
          styles.header,
          { paddingTop: insets.top > 0 ? insets.top : 8 },
        ]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open menu"
          onPress={openDrawer}
          style={styles.menuBtn}>
          <Feather name="menu" size={20} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Wallet</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Available to Withdraw Navy Card */}
        <View style={styles.navyCard}>
          <View style={styles.navyDecoration} />
          <Text style={styles.navyKicker}>AVAILABLE TO WITHDRAW</Text>
          <Text style={styles.navyAmount}>₹6,420.00</Text>
          <Text style={styles.navySub}>
            Auto-payout every Monday · next on 15 Sep
          </Text>
        </View>

        {/* Withdraw Amount Card */}
        <View style={styles.card}>
          <Text style={styles.cardKicker}>WITHDRAW AMOUNT</Text>

          {/* Amount Display with TextInput */}
          <View style={styles.inputBox}>
            <View style={styles.amountDisplay}>
              <Text style={styles.currencySymbol}>₹</Text>
              <TextInput
                value={withdrawAmount}
                onChangeText={text => {
                  const cleaned = text.replace(/[^0-9]/g, '');
                  if (!cleaned) {
                    setWithdrawAmount('');
                    setSelectedPill('');
                    return;
                  }
                  const formatted = Number(cleaned).toLocaleString('en-IN');
                  setWithdrawAmount(formatted);
                  const matchingPill = QUICK_AMOUNTS.find(
                    p => p.value.replace(/,/g, '') === cleaned,
                  );
                  setSelectedPill(matchingPill ? matchingPill.id : '');
                }}
                placeholder="0"
                placeholderTextColor={colors.slate[400]}
                keyboardType="numeric"
                cursorColor={colors.primary}
                selectionColor={colors.alpha.orange30}
                style={styles.amountInput}
              />
            </View>
            <Text style={styles.minLabel}>min ₹500</Text>
          </View>

          {/* Quick Amount Pills */}
          <View style={styles.pillsRow}>
            {QUICK_AMOUNTS.map(item => {
              const active = item.id === selectedPill;
              return (
                <Pressable
                  key={item.id}
                  accessibilityRole="button"
                  onPress={() => handleSelectPill(item)}
                  style={[styles.pill, active && styles.pillActive]}>
                  <Text
                    style={[styles.pillText, active && styles.pillTextActive]}>
                    {item.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Linked Bank Card */}
          <View style={styles.bankRow}>
            <View style={styles.bankLeft}>
              <View style={styles.bankIconBox}>
                <Feather name="credit-card" size={18} color={colors.text} />
              </View>
              <View style={styles.bankInfo}>
                <Text style={styles.bankName}>HDFC Bank •••• 6621</Text>
                <Text style={styles.bankVerified}>Rajesh Kumar · verified</Text>
              </View>
            </View>
            <Pressable
              accessibilityRole="button"
              onPress={handleChangeBank}
              style={styles.changeBtn}>
              <Text style={styles.changeText}>Change</Text>
            </Pressable>
          </View>

          {/* Action Button */}
          <Pressable
            accessibilityRole="button"
            onPress={handleWithdraw}
            style={styles.withdrawBtn}>
            <Text style={styles.withdrawBtnText}>
              Withdraw ₹{withdrawAmount} to bank
            </Text>
          </Pressable>
        </View>

        {/* Payout History Section */}
        <Text style={styles.sectionTitle}>PAYOUT HISTORY</Text>

        <View style={styles.historyCard}>
          {PAYOUT_HISTORY.map((item, idx) => {
            const isLast = idx === PAYOUT_HISTORY.length - 1;
            const isPaid = item.status === 'paid';
            const isProcessing = item.status === 'processing';
            const isRefunded = item.status === 'refunded';

            return (
              <View
                key={item.id}
                style={[
                  styles.historyItem,
                  !isLast && styles.historyItemBorder,
                ]}>
                <View style={styles.historyLeft}>
                  <View
                    style={[
                      styles.historyIcon,
                      isPaid && styles.historyIconPaid,
                      isProcessing && styles.historyIconProcessing,
                      isRefunded && styles.historyIconRefunded,
                    ]}>
                    {isPaid && (
                      <AntDesign
                        name="check-circle"
                        size={18}
                        color={colors.green[600]}
                      />
                    )}
                    {isProcessing && (
                      <Feather name="loader" size={18} color={colors.blue[550]} />
                    )}
                    {isRefunded && (
                      <Feather
                        name="alert-circle"
                        size={18}
                        color={colors.red[600]}
                      />
                    )}
                  </View>
                  <View style={styles.historyTextCol}>
                    <Text style={styles.historyTitle}>{item.title}</Text>
                    <Text
                      style={[
                        isPaid && styles.historySubPaid,
                        isProcessing && styles.historySubProcessing,
                        isRefunded && styles.historySubRefunded,
                      ]}>
                      {item.sub}
                    </Text>
                  </View>
                </View>

                <View style={styles.historyRight}>
                  <Text style={styles.historyAmount}>{item.amount}</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      isPaid && styles.statusBadgePaid,
                      isProcessing && styles.statusBadgeProcessing,
                      isRefunded && styles.statusBadgeRefunded,
                    ]}>
                    <View
                      style={[
                        styles.statusDot,
                        isPaid && styles.statusDotPaid,
                        isProcessing && styles.statusDotProcessing,
                        isRefunded && styles.statusDotRefunded,
                      ]}
                    />
                    <Text
                      style={[
                        isPaid && styles.statusTextPaid,
                        isProcessing && styles.statusTextProcessing,
                        isRefunded && styles.statusTextRefunded,
                      ]}>
                      {item.statusLabel}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
