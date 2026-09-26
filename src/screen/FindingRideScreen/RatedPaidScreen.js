import React, {useMemo} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import {Feather} from '@react-native-vector-icons/feather/static';
import {MaterialDesignIcons} from '@react-native-vector-icons/material-design-icons/static';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Button} from '../../components';
import useThemedStyles from '../../components/useThemedStyles';
import {useApp} from '../../context/AppContext';
import createStyles from './ratedPaidStyle';
import colors from '../../config/color';

function formatMoney(amount) {
  const n = Number(amount);
  if (!Number.isFinite(n)) {
    return '₹0.00';
  }
  return `₹${n.toFixed(2)}`;
}

export default function RatedPaidScreen({
  driverName = 'Rajesh',
  rating = 5,
  tip = 20,
  tripFare = 241.5,
  email = 'aarav.mehta@gmail.com',
  txnId = 'CBR8241905',
  onBackHome,
  onBookAgain,
}) {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);
  const {colors} = useApp();

  const tipAmount = Number(tip) || 0;
  const fareAmount = Number(tripFare) || 0;
  const total = fareAmount + tipAmount;

  const stars = useMemo(
    () => Math.min(5, Math.max(0, Math.round(Number(rating) || 0))),
    [rating],
  );

  const tipLabel =
    tipAmount > 0 ? ` and ${formatMoney(tipAmount).replace('.00', '')} tip` : '';

  return (
    <View style={styles.root}>
      <View style={[styles.hero, {paddingTop: Math.max(insets.top, 20) + 16}]}>
        <View style={styles.heroDomeCircle} />
        <View style={styles.heroInnerContent}>
          <View style={styles.checkOuter}>
            <View style={styles.checkInner}>
              <Feather name="check" size={20} color={colors.white} />
            </View>
          </View>
          <Text style={styles.title}>Rated and paid</Text>
          <Text style={styles.subtitle}>
            {driverName} will see your {stars} stars{tipLabel}.
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map(value => (
            <MaterialDesignIcons
              key={value}
              name={value <= stars ? 'star' : 'star-outline'}
              size={30}
              color={value <= stars ? colors.amber[500] : colors.gray[300]}
            />
          ))}
        </View>

        <View style={styles.receiptCard}>
          <View style={styles.receiptHeader}>
            <View style={styles.receiptIcon}>
              <Feather name="file-text" size={18} color={colors.navy[700]} />
            </View>
            <View style={styles.receiptCopy}>
              <Text style={styles.receiptTitle}>Digital receipt sent</Text>
              <Text style={styles.receiptSub}>
                {email} · {txnId}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.fareRow}>
            <Text style={styles.fareLabel}>Trip fare</Text>
            <Text style={styles.fareValue}>{formatMoney(fareAmount)}</Text>
          </View>
          <View style={styles.fareRow}>
            <Text style={styles.fareLabel}>Tip to {driverName}</Text>
            <Text style={styles.fareValue}>{formatMoney(tipAmount)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total charged</Text>
            <Text style={styles.totalValue}>{formatMoney(total)}</Text>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity activeOpacity={0.7} style={styles.actionBtn}>
              <Feather name="share" size={14} color={colors.navy[800]} />
              <Text style={styles.actionText}>Share</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.7} style={styles.actionBtn}>
              <Feather name="copy" size={14} color={colors.navy[800]} />
              <Text style={styles.actionText}>Copy ID</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.7} style={styles.actionBtn}>
              <Feather name="headphones" size={14} color={colors.navy[800]} />
              <Text style={styles.actionText}>Get help</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View
        style={[styles.footer, {paddingBottom: Math.max(insets.bottom, 16)}]}>
        <Button
          title="Back to home"
          onPress={onBackHome}
          style={styles.homeBtn}
          textStyle={styles.homeText}
        />
        <Button
          title="Book this route again"
          variant="outline"
          onPress={onBookAgain}
          style={styles.rebookBtn}
          textStyle={styles.rebookText}
        />
      </View>
    </View>
  );
}
