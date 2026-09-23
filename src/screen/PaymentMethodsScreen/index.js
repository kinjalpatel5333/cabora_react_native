import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Feather } from '@react-native-vector-icons/feather/static';
import { Lucide } from '@react-native-vector-icons/lucide/static';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toggle from '../../components/Toggle';
import { useToast } from '../../components/Toast';
import useThemedStyles from '../../components/useThemedStyles';
import { useApp } from '../../context/AppContext';
import createStyles from './style';

const INITIAL_METHODS = [
  {
    id: 'cash',
    type: 'cash',
    title: 'Cash',
    subtitle: 'Pay the driver directly at drop-off',
  },
  {
    id: 'card_hdfc_4417',
    type: 'card',
    title: 'HDFC Card ▪▪▪▪ 4417',
    subtitle: 'Expires 09/29 · Ananya Shah',
  },
  {
    id: 'wallet',
    type: 'wallet',
    title: 'Cabora Wallet',
    subtitle: 'Balance ₹240 · auto-tops up below ₹100',
    badge: 'Active',
  },
];

export default function PaymentMethodsScreen() {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);
  const { colors, isDark } = useApp();
  const navigation = useNavigation();
  const route = useRoute();
  const { showToast } = useToast();

  const [selectedMethodId, setSelectedMethodId] = useState('upi');
  const [methodsList, setMethodsList] = useState(INITIAL_METHODS);
  const [askBeforeRide, setAskBeforeRide] = useState(false);
  const [autoPay, setAutoPay] = useState(true);

  // Sync new card when navigated back with route params
  useEffect(() => {
    if (route?.params?.newCard) {
      const newCard = route.params.newCard;
      setMethodsList(prev => {
        const exists = prev.some(item => item.id === newCard.id);
        if (exists) {
          return prev;
        }
        // Place new card in the card list
        return [prev[0], newCard, ...prev.slice(1)];
      });
      setSelectedMethodId(newCard.id);
    }
  }, [route?.params?.newCard]);

  const handleSelectMethod = (id, title) => {
    setSelectedMethodId(id);
    showToast({
      type: 'info',
      message: `${title} set as default payment method`,
    });
  };

  const handleAddMethod = () => {
    navigation.navigate('AddCard', {
      onCardAdded: newCard => {
        setMethodsList(prev => {
          const exists = prev.some(item => item.id === newCard.id);
          if (exists) {
            return prev;
          }
          return [prev[0], newCard, ...prev.slice(1)];
        });
        setSelectedMethodId(newCard.id);
      },
    });
  };

  return (
    <View style={styles.root}>
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
        <Text style={styles.headerTitle}>Payment methods</Text>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.headerBtn}
          onPress={handleAddMethod}
          accessibilityRole="button"
          accessibilityLabel="Add payment method"
          hitSlop={8}>
          <Feather
            name="plus"
            size={22}
            color={isDark ? colors.white : '#111827'}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: Math.max(insets.bottom, 20) + 20 },
        ]}>
        {/* Section 1: DEFAULT FOR ALL RIDES */}
        <Text style={styles.sectionHeader}>DEFAULT FOR ALL RIDES</Text>

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.defaultCard}
          onPress={() => handleSelectMethod('upi', 'UPI · ananya@okhdfc')}>
          <View style={styles.defaultIconContainer}>
            <Text style={styles.defaultCurrencySymbol}>₹</Text>
          </View>
          <View style={styles.defaultContent}>
            <Text style={styles.defaultTitle}>UPI · ananya@okhdfc</Text>
            <Text style={styles.defaultSubtitle}>
              HDFC Bank · linked 12 Aug 2026
            </Text>
            <Text style={styles.defaultBadgeText}>Default</Text>
          </View>
          <View style={styles.radioSelectedOuter}>
            <View style={styles.radioSelectedInner} />
          </View>
        </TouchableOpacity>

        {/* Section 2: OTHER METHODS */}
        <Text style={[styles.sectionHeader, styles.sectionHeaderOther]}>
          OTHER METHODS
        </Text>

        {/* Dynamic Methods List */}
        {methodsList.map(item => {
          const isSelected = selectedMethodId === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.7}
              style={styles.methodCard}
              onPress={() => handleSelectMethod(item.id, item.title)}>
              <View style={styles.methodIconContainer}>
                {item.type === 'cash' ? (
                  <Text style={styles.methodCurrencySymbol}>₹</Text>
                ) : item.type === 'wallet' ? (
                  <Lucide
                    name="wallet"
                    size={20}
                    color={isDark ? colors.navy[200] : '#475569'}
                  />
                ) : (
                  <Lucide
                    name="credit-card"
                    size={20}
                    color={isDark ? colors.navy[200] : '#475569'}
                  />
                )}
              </View>
              <View style={styles.methodContent}>
                <Text style={styles.methodTitle}>{item.title}</Text>
                <Text style={styles.methodSubtitle}>{item.subtitle}</Text>
              </View>
              {item.badge ? (
                <View style={styles.activeBadge}>
                  <Text style={styles.activeBadgeText}>{item.badge}</Text>
                </View>
              ) : (
                <View
                  style={
                    isSelected
                      ? styles.radioSelectedOuter
                      : styles.radioUnselected
                  }>
                  {isSelected ? <View style={styles.radioSelectedInner} /> : null}
                </View>
              )}
            </TouchableOpacity>
          );
        })}

        {/* Add a card or UPI ID */}
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.addCardContainer}
          onPress={handleAddMethod}>
          <View style={styles.addCardIconBox}>
            <Feather name="plus" size={18} color="#FF7A00" />
          </View>
          <Text style={styles.addCardTitle}>Add a card or UPI ID</Text>
          <Feather name="chevron-right" size={18} color="#FF7A00" />
        </TouchableOpacity>

        {/* Section 3: PREFERENCES */}
        <Text style={[styles.sectionHeader, styles.sectionHeaderPrefs]}>
          PREFERENCES
        </Text>

        <View style={styles.prefsCard}>
          {/* Ask before every ride */}
          <View style={styles.prefRow}>
            <View style={styles.prefTextWrap}>
              <Text style={styles.prefTitle}>Ask before every ride</Text>
              <Text style={styles.prefSubtitle}>
                Confirm the payment method on the ride selection screen
              </Text>
            </View>
            <Toggle
              value={askBeforeRide}
              onValueChange={setAskBeforeRide}
            />
          </View>

          <View style={styles.prefDivider} />

          {/* Auto-pay with default */}
          <View style={styles.prefRow}>
            <View style={styles.prefTextWrap}>
              <Text style={styles.prefTitle}>Auto-pay with default</Text>
            </View>
            <Toggle
              value={autoPay}
              onValueChange={setAutoPay}
            />
          </View>
        </View>

        {/* Footer note */}
        <Text style={styles.footerNote}>
          Cabora never stores your full card number.
        </Text>
      </ScrollView>
    </View>
  );
}
