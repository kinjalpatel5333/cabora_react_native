import React from 'react';
import {
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Lucide } from '@react-native-vector-icons/lucide/static';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useToast } from '../../components/Toast';
import useThemedStyles from '../../components/useThemedStyles';
import { useApp } from '../../context/AppContext';
import createStyles from './style';

export default function DriverCollectCashScreen() {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);
  const { colors } = useApp();
  const navigation = useNavigation();
  const { showToast } = useToast();

  const handleCashReceived = () => {
    navigation.navigate('DriverAirportQueue');
  };

  const handlePaidOnlineInstead = () => {
    navigation.navigate('DriverTripSummary');
  };

  return (
    <View style={styles.root}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Top Warm Peach Hero Header */}
        <View style={[styles.heroArea, { paddingTop: insets.top + 16 }]}>
          <View style={styles.heroCircleBg} />
          <View style={styles.rupeeBadge}>
            <Text style={styles.rupeeSymbol}>₹</Text>
          </View>
          <Text style={styles.heroTitle}>Collect ₹241.50</Text>
          <Text style={styles.heroSub}>
            Take the cash before you tap the button below.
          </Text>
        </View>

        {/* Trip Route Brief Pill */}
        <View style={styles.tripPill}>
          <Lucide name="git-branch" size={17} color={colors.slate[500]} />
          <Text style={styles.tripPillText} numberOfLines={1}>
            Ananya S. · 14.2 km · 38 min · Airport T2
          </Text>
        </View>

        {/* Passenger Pays Card */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>PASSENGER PAYS</Text>

          <View style={styles.cardRow}>
            <Text style={styles.cardRowLabel}>Base + distance + time</Text>
            <Text style={styles.cardRowValue}>₹258.00</Text>
          </View>

          <View style={styles.cardRow}>
            <Text style={styles.cardRowLabel}>Taxes & fees</Text>
            <Text style={styles.cardRowValue}>₹33.50</Text>
          </View>

          <View style={styles.cardRow}>
            <Text style={styles.promoLabel}>Promo CABORA50</Text>
            <Text style={styles.promoValue}>− ₹50.00</Text>
          </View>

          <View style={styles.cardDivider} />

          <View style={[styles.cardRow, { marginBottom: 0, marginTop: 4 }]}>
            <Text style={styles.totalLabel}>Collect in cash</Text>
            <Text style={styles.totalValue}>₹241.50</Text>
          </View>
        </View>

        {/* Your Earning Card (Navy) */}
        <View style={styles.earningCard}>
          <Text style={styles.earningHeader}>YOUR EARNING</Text>

          <View style={styles.cardRow}>
            <Text style={styles.earningLabel}>Trip fare</Text>
            <Text style={styles.earningValue}>₹241.50</Text>
          </View>

          <View style={styles.cardRow}>
            <Text style={styles.earningLabel}>Cabora commission (18%)</Text>
            <Text style={styles.deductedValue}>− ₹43.47</Text>
          </View>

          <View style={styles.cardRow}>
            <Text style={styles.earningLabel}>Deducted from wallet</Text>
            <Text style={styles.deductedValue}>− ₹43.47</Text>
          </View>

          <View style={styles.earningDivider} />

          <View style={[styles.cardRow, { marginBottom: 0, marginTop: 4 }]}>
            <Text style={styles.keepLabel}>You keep</Text>
            <Text style={styles.keepValue}>₹198.03</Text>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Action Section */}
      <View
        style={[
          styles.actionSection,
          { paddingBottom: Math.max(insets.bottom, 12) + 4 },
        ]}>
        <Pressable
          accessibilityRole="button"
          onPress={handleCashReceived}
          style={styles.completeBtn}>
          <Text style={styles.btnRupee}>₹</Text>
          <Text style={styles.completeBtnText}>Cash received · complete trip</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          onPress={handlePaidOnlineInstead}
          style={styles.secondaryLink}>
          <Text style={styles.secondaryLinkText}>Passenger paid online instead</Text>
        </Pressable>
      </View>
    </View>
  );
}
