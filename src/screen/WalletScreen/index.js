import React, {useMemo, useState} from 'react';
import {Pressable, ScrollView, StatusBar, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Feather} from '@react-native-vector-icons/feather/static';
import {Lucide} from '@react-native-vector-icons/lucide/static';
import {MaterialDesignIcons} from '@react-native-vector-icons/material-design-icons/static';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useToast} from '../../components/Toast';
import useThemedStyles from '../../components/useThemedStyles';
import {useApp} from '../../context/AppContext';
import {useSidebar} from '../../context/SidebarContext';
import {getHomeTabBarInset} from '../../navigation/homeTabBarMetrics';
import createStyles from './style';

const TABS = [
  {id: 'all', label: 'All'},
  {id: 'credits', label: 'Credits'},
  {id: 'debits', label: 'Debits'},
];

const TXNS = [
  {
    id: 't1',
    type: 'debit',
    title: 'Cab Sedan to Airport',
    meta: 'Today 12:24 pm · CBR8241905',
    amount: '- ₹241.50',
    status: 'Paid',
    icon: 'car',
    iconTone: 'navy',
  },
  {
    id: 't2',
    type: 'credit',
    title: 'Added money',
    meta: 'Yesterday 9:10 pm · UPI',
    amount: '+ ₹500.00',
    status: 'Success',
    icon: 'plus',
    iconTone: 'green',
  },
  {
    id: 't3',
    type: 'credit',
    title: 'Refund · Cancelled Auto',
    meta: 'Fri 11 Sep · CBR8192044',
    amount: '+ ₹30.00',
    status: 'Refunded',
    icon: 'rotate-ccw',
    iconTone: 'blue',
  },
  {
    id: 't4',
    type: 'credit',
    title: 'Referral bonus',
    meta: 'Thu 10 Sep · Promo',
    amount: '+ ₹100.00',
    status: 'Success',
    icon: 'gift',
    iconTone: 'orange',
  },
  {
    id: 't5',
    type: 'debit',
    title: 'Bike to Koramangala',
    meta: 'Wed 9 Sep · CBR8102211',
    amount: '- ₹41.00',
    status: 'Paid',
    icon: 'bike',
    iconTone: 'navy',
  },
];

function TxnIcon({name, color, size = 18}) {
  if (name === 'car') {
    return <Lucide name="car" size={size} color={color} />;
  }
  if (name === 'gift') {
    return <Feather name="gift" size={size} color={color} />;
  }
  if (name === 'bike') {
    return <MaterialDesignIcons name="motorbike" size={size} color={color} />;
  }
  if (name === 'rotate-ccw') {
    return <Feather name="rotate-ccw" size={size} color={color} />;
  }
  return <Feather name="plus" size={size} color={color} />;
}

export default function WalletScreen() {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);
  const {colors} = useApp();
  const navigation = useNavigation();
  const {openDrawer} = useSidebar();
  const {showToast} = useToast();
  const tabInset = getHomeTabBarInset(insets);
  const [tab, setTab] = useState('all');

  const txns = useMemo(() => {
    if (tab === 'credits') {
      return TXNS.filter(t => t.type === 'credit');
    }
    if (tab === 'debits') {
      return TXNS.filter(t => t.type === 'debit');
    }
    return TXNS;
  }, [tab]);

  const iconColors = {
    navy: {
      bg: colors.isDark ? '#1C3F5E' : colors.navy[100],
      fg: colors.isDark ? '#C3CFDF' : colors.navy[800],
    },
    green: {
      bg: colors.isDark ? 'rgba(38, 168, 94, 0.2)' : colors.green[100],
      fg: colors.green[500],
    },
    blue: {
      bg: colors.isDark ? 'rgba(46, 123, 231, 0.2)' : colors.blue[100],
      fg: colors.blue[500],
    },
    orange: {
      bg: colors.isDark ? 'rgba(255, 112, 6, 0.2)' : colors.orange[100],
      fg: colors.orange[500],
    },
  };

  return (
    <View style={styles.root}>
      <StatusBar
        barStyle={colors.barStyle}
        backgroundColor={colors.background}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scroll,
          {
            paddingTop: insets.top + 8,
            paddingBottom: tabInset + 20,
          },
        ]}>
        <View style={styles.headerRow}>
          <Pressable
            style={styles.iconBtn}
            onPress={openDrawer}
            accessibilityRole="button"
            accessibilityLabel="Open menu"
            hitSlop={8}>
            <Feather name="menu" size={20} color={colors.text} />
          </Pressable>
          <Text style={styles.title}>Wallet</Text>
          <Pressable
            style={[styles.iconBtn, styles.iconBtnOutline]}
            onPress={() =>
              showToast({type: 'info', message: 'Wallet help'})
            }
            accessibilityRole="button"
            accessibilityLabel="Help"
            hitSlop={8}>
            <Feather name="help-circle" size={20} color={colors.text} />
          </Pressable>
        </View>

        <View style={styles.balanceCard}>
          <View style={styles.balanceDecor} />
          <View style={styles.balanceTop}>
            <Text style={styles.balanceLabel}>CABORA WALLET</Text>
            <MaterialDesignIcons
              name="wallet-outline"
              size={22}
              color={colors.orange[500]}
            />
          </View>
          <Text style={styles.balanceValue}>₹1,240.00</Text>
          <Text style={styles.balanceMeta}>
            Updated just now · Auto top-up on
          </Text>
          <View style={styles.balanceActions}>
            <Pressable
              style={styles.addMoneyBtn}
              onPress={() => navigation.navigate('AddMoney')}
              accessibilityRole="button"
              accessibilityLabel="Add money">
              <Feather name="plus" size={14} color={colors.white} />
              <Text style={styles.addMoneyText}>Add money</Text>
            </Pressable>
            <Pressable
              style={styles.historyBtn}
              onPress={() =>
                showToast({type: 'info', message: 'Wallet history'})
              }
              accessibilityRole="button"
              accessibilityLabel="History">
              <Feather name="clock" size={13} color={colors.white} />
              <Text style={styles.historyText}>History</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.tabs}>
          {TABS.map(item => {
            const active = item.id === tab;
            return (
              <Pressable
                key={item.id}
                style={[styles.tab, active && styles.tabActive]}
                onPress={() => setTab(item.id)}>
                <Text
                  style={[styles.tabText, active && styles.tabTextActive]}>
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.txnList}>
          {txns.map(txn => {
            const tone = iconColors[txn.iconTone] || iconColors.navy;
            const isCredit = txn.type === 'credit';
            return (
              <Pressable
                key={txn.id}
                style={styles.txnCard}
                onPress={() =>
                  showToast({type: 'info', message: txn.title})
                }
                accessibilityRole="button">
                <View
                  style={[styles.txnIcon, {backgroundColor: tone.bg}]}>
                  <TxnIcon name={txn.icon} color={tone.fg} />
                </View>
                <View style={styles.txnCopy}>
                  <Text style={styles.txnTitle} numberOfLines={1}>
                    {txn.title}
                  </Text>
                  <Text style={styles.txnMeta} numberOfLines={1}>
                    {txn.meta}
                  </Text>
                </View>
                <View style={styles.txnRight}>
                  <Text
                    style={[
                      styles.txnAmount,
                      isCredit && styles.txnAmountCredit,
                    ]}>
                    {txn.amount}
                  </Text>
                  <Text style={styles.txnStatus}>{txn.status}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
