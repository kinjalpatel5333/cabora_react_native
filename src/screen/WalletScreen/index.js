import { PASSENGER_WALLET_TABS, PASSENGER_WALLET_TXNS } from '../../config/staticData';
import React, {useMemo, useState} from 'react';
import {ScrollView, Text, View, TouchableOpacity} from 'react-native';
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
import colors from '../../config/color';

const TABS = PASSENGER_WALLET_TABS;

const TXNS = PASSENGER_WALLET_TXNS;

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
      bg: colors.isDark ? colors.navy.cardBg2 : colors.navy[100],
      fg: colors.isDark ? colors.navy[300] : colors.navy[800],
    },
    green: {
      bg: colors.isDark ? colors.alpha.greenDark20 : colors.green[100],
      fg: colors.green[500],
    },
    blue: {
      bg: colors.isDark ? colors.alpha.blue20 : colors.blue[100],
      fg: colors.blue[500],
    },
    orange: {
      bg: colors.isDark ? colors.alpha.orange20 : colors.orange[100],
      fg: colors.orange[500],
    },
  };

  return (
    <View style={styles.root}>
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
          <TouchableOpacity activeOpacity={0.7}
            style={styles.iconBtn}
            onPress={openDrawer}
            accessibilityRole="button"
            accessibilityLabel="Open menu"
            hitSlop={8}>
            <Feather name="menu" size={20} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Wallet</Text>
          <TouchableOpacity activeOpacity={0.7}
            style={[styles.iconBtn, styles.iconBtnOutline]}
            onPress={() =>
              showToast({type: 'info', message: 'Wallet help'})
            }
            accessibilityRole="button"
            accessibilityLabel="Help"
            hitSlop={8}>
            <Feather name="help-circle" size={20} color={colors.text} />
          </TouchableOpacity>
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
            <TouchableOpacity activeOpacity={0.7}
              style={styles.addMoneyBtn}
              onPress={() => navigation.navigate('AddMoney')}
              accessibilityRole="button"
              accessibilityLabel="Add money">
              <Feather name="plus" size={14} color={colors.white} />
              <Text style={styles.addMoneyText}>Add money</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.7}
              style={styles.historyBtn}
              onPress={() =>
                showToast({type: 'info', message: 'Wallet history'})
              }
              accessibilityRole="button"
              accessibilityLabel="History">
              <Feather name="clock" size={13} color={colors.white} />
              <Text style={styles.historyText}>History</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.tabs}>
          {TABS.map(item => {
            const active = item.id === tab;
            return (
              <TouchableOpacity activeOpacity={0.7}
                key={item.id}
                style={[styles.tab, active && styles.tabActive]}
                onPress={() => setTab(item.id)}>
                <Text
                  style={[styles.tabText, active && styles.tabTextActive]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.txnList}>
          {txns.map(txn => {
            const tone = iconColors[txn.iconTone] || iconColors.navy;
            const isCredit = txn.type === 'credit';
            return (
              <TouchableOpacity activeOpacity={0.7}
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
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
