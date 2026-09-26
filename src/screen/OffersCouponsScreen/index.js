import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@react-native-vector-icons/feather/static';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useToast } from '../../components/Toast';
import useThemedStyles from '../../components/useThemedStyles';
import { useApp } from '../../context/AppContext';
import createStyles from './style';

const AVAILABLE_OFFERS = [
  {
    id: 'cab20',
    title: '20% off up to ₹75',
    subtitle: 'On your next 3 cab rides in Ahmedabad',
    code: 'CAB20',
    expiry: 'Ends 30 Sep',
    accentColor: '#FF7A00',
  },
  {
    id: 'auto40',
    title: 'Flat ₹40 off autos',
    subtitle: 'Minimum fare ₹80 · weekdays before 11 am',
    code: 'AUTO40',
    expiry: 'Ends 12 Oct',
    accentColor: '#2563EB',
  },
  {
    id: 'city100',
    title: '₹100 off intercity',
    subtitle: 'Ahmedabad ⇄ Baroda one-way trips',
    code: 'CITY100',
    expiry: 'Ends 31 Oct',
    accentColor: '#0D9488',
  },
];

const EXPIRED_OFFERS = [
  {
    id: 'first50',
    title: '₹50 off your first ride',
    subtitle: 'Used on 12 Aug 2026 · saved ₹50',
    tag: 'Used',
  },
];

export default function OffersCouponsScreen() {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);
  const { colors, isDark } = useApp();
  const navigation = useNavigation();
  const { showToast } = useToast();

  const [inputCode, setInputCode] = useState('');
  const [appliedCode, setAppliedCode] = useState('');

  const handleApply = (codeToApply) => {
    const code = (codeToApply || inputCode).trim().toUpperCase();
    if (!code) {
      showToast({ type: 'warning', message: 'Please enter a coupon code' });
      return;
    }
    setAppliedCode(code);
    showToast({
      type: 'success',
      message: `Coupon ${code} applied successfully!`,
    });
  };

  const handleHelp = () => {
    navigation.navigate('ReferEarn');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.root}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 6 }]}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.headerBtn}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={8}>
          <Feather
            name="arrow-left"
            size={22}
            color={isDark ? colors.white : '#111827'}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Offers & coupons</Text>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.headerBtn}
          onPress={handleHelp}
          accessibilityRole="button"
          accessibilityLabel="Help"
          hitSlop={8}>
          <Feather
            name="help-circle"
            size={22}
            color={isDark ? colors.white : '#111827'}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: Math.max(insets.bottom, 20) + 20 },
        ]}>
        {/* Top Coupon Input Card */}
        <View style={styles.couponInputCard}>
          <View style={styles.giftIconBox}>
            <Feather
              name="gift"
              size={18}
              color={isDark ? colors.navy[300] : '#8E9CAE'}
            />
          </View>
          <TextInput
            style={styles.couponInput}
            value={inputCode}
            onChangeText={setInputCode}
            placeholder="Enter a coupon code"
            placeholderTextColor={isDark ? colors.navy[400] : '#94A3B8'}
            autoCapitalize="characters"
            selectionColor="#FF7A00"
          />
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.topApplyBtn}
            onPress={() => handleApply(inputCode)}
            accessibilityRole="button"
            accessibilityLabel="Apply coupon">
            <Text style={styles.topApplyBtnText}>Apply</Text>
          </TouchableOpacity>
        </View>

        {/* Section 1: AVAILABLE FOR YOU */}
        <Text style={styles.sectionHeader}>AVAILABLE FOR YOU</Text>

        {AVAILABLE_OFFERS.map(offer => {
          const isApplied = appliedCode === offer.code;
          return (
            <View
              key={offer.id}
              style={[
                styles.offerCard,
                { borderLeftColor: offer.accentColor },
              ]}>
              <Text style={styles.offerTitle}>{offer.title}</Text>
              <Text style={styles.offerSubtitle}>{offer.subtitle}</Text>

              <View style={styles.offerBottomRow}>
                <View style={styles.codeTagWrap}>
                  <View style={styles.codeTag}>
                    <Text style={styles.codeTagText}>{offer.code}</Text>
                  </View>
                  <Text style={styles.expiryText}>{offer.expiry}</Text>
                </View>

                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[
                    styles.cardApplyBtn,
                    isApplied && styles.cardApplyBtnApplied,
                  ]}
                  onPress={() => handleApply(offer.code)}
                  accessibilityRole="button"
                  accessibilityLabel={`Apply coupon ${offer.code}`}>
                  <Text
                    style={[
                      styles.cardApplyBtnText,
                      isApplied && styles.cardApplyBtnTextApplied,
                    ]}>
                    {isApplied ? 'Applied' : 'Apply'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}

        {/* Section 2: EXPIRED */}
        <Text style={styles.sectionHeader}>EXPIRED</Text>

        {EXPIRED_OFFERS.map(offer => (
          <View key={offer.id} style={styles.expiredCard}>
            <Text style={styles.expiredTitle}>{offer.title}</Text>
            <Text style={styles.expiredSubtitle}>{offer.subtitle}</Text>
            <View style={styles.usedTag}>
              <Text style={styles.usedTagText}>{offer.tag}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
