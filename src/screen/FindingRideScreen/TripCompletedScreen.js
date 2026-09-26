import { PASSENGER_TRIP_COMPLETED_FARE_ROWS } from '../../config/staticData';
import React, { useState } from 'react';
import { Dimensions, ScrollView, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Feather } from '@react-native-vector-icons/feather/static';
import { Lucide } from '@react-native-vector-icons/lucide/static';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons/static';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../components';
import { useToast } from '../../components/Toast';
import useThemedStyles from '../../components/useThemedStyles';
import { useApp } from '../../context/AppContext';
import { chargeTripPaymentApi } from '../../services/paymentApi';
import createStyles from './tripCompletedStyle';
import colors from '../../config/color';

const FARE_ROWS = PASSENGER_TRIP_COMPLETED_FARE_ROWS;

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

export default function TripCompletedScreen({
  tripId,
  rideId,
  pickup = '12, Brigade Road, Ashok Nagar',
  drop = 'Kempegowda Intl. Airport, T2',
  rideName = 'Cab Sedan',
  driverName = 'Rajesh',
  fare = 241.5,
  currency = 'INR',
  paymentMethod = 'UPI',
  totalPaid,
  paymentLabel = 'UPI · you@okaxis · Txn CBR8241905',
  initialPaymentFailed = true, // Shows Payment Screen first right after Live Trip
  onRate,
}) {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);
  const { colors } = useApp();
  const { showToast } = useToast();

  const [paymentFailed, setPaymentFailed] = useState(initialPaymentFailed);
  const [selectedMethod, setSelectedMethod] = useState('wallet'); // 'wallet' | 'card' | 'cash'
  const [isProcessing, setIsProcessing] = useState(false);
  const [activePaymentLabel, setActivePaymentLabel] = useState(paymentLabel);

  const bottomPad = Math.max(insets.bottom, 16) + 12;
  const displayFare = Number(fare) > 0 ? Number(fare).toFixed(2) : '241.50';

  const handleCharge = async (method = selectedMethod) => {
    const activeTripId = tripId || rideId || 'ride_123';
    setIsProcessing(true);

    try {
      if (method === 'wallet') {
        // Simulate Wallet failure as requested
        await new Promise(resolve => setTimeout(resolve, 600));
        setPaymentFailed(true);
        showToast({
          type: 'error',
          message: 'UPI / Wallet returned insufficient balance (Declined)',
        });
      } else if (method === 'card') {
        // Simulate Card decline
        await new Promise(resolve => setTimeout(resolve, 600));
        setPaymentFailed(true);
        showToast({
          type: 'error',
          message: 'Card payment declined by bank',
        });
      } else {
        // Cash payment -> SUCCESS!
        const res = await chargeTripPaymentApi({
          tripId: activeTripId,
          amount: Number(fare) || 241.5,
          currency: currency || 'INR',
          paymentMethod: 'CASH',
          idempotencyKey: `pay_${activeTripId}_${Date.now()}`,
        });
        setActivePaymentLabel(`Cash · Handed ₹${displayFare} to ${driverName}`);
        setPaymentFailed(false);
        showToast({
          type: 'success',
          message: 'Cash payment confirmed successfully!',
        });
      }
    } catch (err) {
      console.warn('Payment error:', err);
      if (method === 'cash') {
        setActivePaymentLabel(`Cash · Handed ₹${displayFare} to ${driverName}`);
        setPaymentFailed(false);
        showToast({
          type: 'success',
          message: 'Cash payment marked as completed!',
        });
      } else {
        setPaymentFailed(true);
        showToast({
          type: 'error',
          message: err?.message || 'Payment failed',
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const getPayButtonText = () => {
    if (isProcessing) {
      return 'Processing payment...';
    }
    if (selectedMethod === 'wallet') {
      return `Pay ₹${displayFare} from wallet`;
    }
    if (selectedMethod === 'card') {
      return `Pay ₹${displayFare} via Card`;
    }
    return `Pay with Cash (₹${displayFare})`;
  };

  return (
    <View style={[styles.root, { height: SCREEN_H, width: SCREEN_W }]}>
      {/* ============================================================ */}
      {/* FIXED HERO HEADER (Non-Scrolling)                            */}
      {/* ============================================================ */}
      <View
        style={[
          styles.heroCard,
          !paymentFailed && styles.heroCardSuccess,
          { paddingTop: Math.max(insets.top, 20) + 16 },
        ]}>
        
        {/* Circular Dome Wash behind the Icon */}
        <View
          style={[
            styles.heroDomeCircle,
            !paymentFailed && styles.heroDomeCircleSuccess,
          ]}
        />

        <View style={styles.heroInnerContent}>
          {paymentFailed ? (
            <>
              <View style={styles.alertBadge}>
                <Lucide name="triangle-alert" size={26} color="#DC2626" />
              </View>
              <Text style={styles.failedTitle}>Payment didn't go through</Text>
              <Text style={styles.failedSub}>
                Your trip is complete — only the payment failed.
              </Text>
            </>
          ) : (
            <>
              <View style={styles.checkBadge}>
                <Feather name="check" size={24} color={colors.green[800]} />
              </View>
              <Text style={styles.title}>Trip completed</Text>
              <Text style={styles.meta}>
                14.2 km · 38 min · {rideName} · Today 12:24 pm
              </Text>
            </>
          )}
        </View>
      </View>

      {/* ============================================================ */}
      {/* SCROLLABLE BODY CONTENT                                      */}
      {/* ============================================================ */}
      <ScrollView
        style={styles.scrollFlex}
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.body}>
          {paymentFailed ? (
            /* PAYMENT FAILED VIEW (Matching uploaded design exactly) */
            <>
              {/* Card 1: You have not been charged */}
              <View style={styles.notChargedCard}>
                <Lucide
                  name="shield-check"
                  size={22}
                  color={colors.isDark ? '#60A5FA' : '#2563EB'}
                  style={styles.notChargedIcon}
                />
                <View style={styles.notChargedCopy}>
                  <Text style={styles.notChargedTitle}>You have not been charged</Text>
                  <Text style={styles.notChargedSub}>
                    One attempt was made and declined by your bank. Cabora never retries a payment on its own, so there's no risk of paying twice.
                  </Text>
                </View>
              </View>

              {/* Card 2: WHY IT FAILED */}
              <View style={styles.whyFailedCard}>
                <Text style={styles.whyFailedLabel}>WHY IT FAILED</Text>
                <Text style={styles.whyFailedText}>
                  UPI · you@okaxis returned “insufficient balance”. Reference CBR8241905-F.
                </Text>
              </View>

              {/* PAY WITH Section Header */}
              <Text style={styles.payWithLabel}>PAY WITH</Text>

              {/* Option 1: Cabora Wallet */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setSelectedMethod('wallet')}
                style={[
                  styles.payOptionCard,
                  selectedMethod === 'wallet' && styles.payOptionCardSelected,
                ]}>
                <View
                  style={[
                    styles.payIconWrap,
                    selectedMethod === 'wallet'
                      ? styles.payIconWrapSelected
                      : styles.payIconWrapDefault,
                  ]}>
                  <MaterialDesignIcons
                    name="wallet"
                    size={22}
                    color={selectedMethod === 'wallet' ? colors.orange[600] : colors.textMuted}
                  />
                </View>
                <View style={styles.payOptionCopy}>
                  <Text style={styles.payOptionTitle}>Cabora Wallet</Text>
                  <Text style={styles.payOptionSub}>Balance ₹1,240.00 — covers this fare</Text>
                </View>
                {selectedMethod === 'wallet' ? (
                  <MaterialDesignIcons
                    name="check-circle"
                    size={22}
                    color={colors.orange[500]}
                    style={styles.payCheckIcon}
                  />
                ) : null}
              </TouchableOpacity>

              {/* Option 2: HDFC Credit Card */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setSelectedMethod('card')}
                style={[
                  styles.payOptionCard,
                  selectedMethod === 'card' && styles.payOptionCardSelected,
                ]}>
                <View
                  style={[
                    styles.payIconWrap,
                    selectedMethod === 'card'
                      ? styles.payIconWrapSelected
                      : styles.payIconWrapDefault,
                  ]}>
                  <MaterialDesignIcons
                    name="credit-card-outline"
                    size={22}
                    color={selectedMethod === 'card' ? colors.orange[600] : colors.textMuted}
                  />
                </View>
                <View style={styles.payOptionCopy}>
                  <Text style={styles.payOptionTitle}>HDFC Credit Card</Text>
                  <Text style={styles.payOptionSub}>•••• 4821</Text>
                </View>
                {selectedMethod === 'card' ? (
                  <MaterialDesignIcons
                    name="check-circle"
                    size={22}
                    color={colors.orange[500]}
                    style={styles.payCheckIcon}
                  />
                ) : null}
              </TouchableOpacity>

              {/* Option 3: Cash */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setSelectedMethod('cash')}
                style={[
                  styles.payOptionCard,
                  selectedMethod === 'cash' && styles.payOptionCardSelected,
                ]}>
                <View
                  style={[
                    styles.payIconWrap,
                    selectedMethod === 'cash'
                      ? styles.payIconWrapSelected
                      : styles.payIconWrapDefault,
                  ]}>
                  <MaterialDesignIcons
                    name="currency-inr"
                    size={22}
                    color={selectedMethod === 'cash' ? colors.orange[600] : colors.textMuted}
                  />
                </View>
                <View style={styles.payOptionCopy}>
                  <Text style={styles.payOptionTitle}>Cash</Text>
                  <Text style={styles.payOptionSub}>Hand ₹{displayFare} to {driverName}</Text>
                </View>
                {selectedMethod === 'cash' ? (
                  <MaterialDesignIcons
                    name="check-circle"
                    size={22}
                    color={colors.orange[500]}
                    style={styles.payCheckIcon}
                  />
                ) : null}
              </TouchableOpacity>
            </>
          ) : (
            /* NORMAL TRIP COMPLETED / PAID VIEW */
            <>
              <View style={styles.tripCard}>
                <View style={styles.timeline}>
                  <View style={styles.pickupDot} />
                  <View style={styles.timelineLine} />
                  <View style={styles.dropSquare} />
                </View>
                <View style={styles.tripCopy}>
                  <View style={styles.tripBlock}>
                    <Text style={styles.tripLabel}>PICKUP</Text>
                    <Text style={styles.tripAddress}>{pickup}</Text>
                  </View>
                  <View style={styles.tripBlock}>
                    <Text style={styles.tripLabel}>DROP</Text>
                    <Text style={styles.tripAddress}>{drop}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.fareCard}>
                <Text style={styles.fareTitle}>FARE BREAKDOWN</Text>
                {FARE_ROWS.map(row => (
                  <View key={row.id} style={styles.fareRow}>
                    <Text
                      style={[
                        styles.fareLabel,
                        row.promo && styles.fareLabelPromo,
                      ]}>
                      {row.label}
                    </Text>
                    <Text
                      style={[
                        styles.fareValue,
                        row.promo && styles.fareValuePromo,
                      ]}>
                      {row.value}
                    </Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleCharge('wallet')}
                style={styles.paidBox}>
                <Feather name="check-circle" size={20} color={colors.green[600]} />
                <View style={styles.paidCopy}>
                  <Text style={styles.paidTitle}>Paid in full</Text>
                  <Text style={styles.paidSub}>{activePaymentLabel}</Text>
                </View>
                <Feather name="chevron-right" size={18} color={colors.green[600]} />
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>

      {/* ============================================================ */}
      {/* FOOTER ACTION BAR                                            */}
      {/* ============================================================ */}
      <View style={[styles.footer, { paddingBottom: bottomPad }]}>
        {paymentFailed ? (
          <>
            <View style={styles.dueRow}>
              <Text style={styles.dueLabel}>Amount due</Text>
              <Text style={styles.dueAmount}>₹{displayFare}</Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.8}
              disabled={isProcessing}
              onPress={() => handleCharge(selectedMethod)}
              style={styles.payBtn}>
              {isProcessing ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.payBtnText}>{getPayButtonText()}</Text>
              )}
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total paid</Text>
              <Text style={styles.totalValue}>{totalPaid || `₹${displayFare}`}</Text>
            </View>
            <Button
              title="Rate your ride"
              onPress={onRate}
              style={styles.rateBtn}
              textStyle={styles.rateText}
            />
          </>
        )}
      </View>
    </View>
  );
}
