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
import Toggle from '../../components/Toggle';
import { useToast } from '../../components/Toast';
import useThemedStyles from '../../components/useThemedStyles';
import { useApp } from '../../context/AppContext';
import createStyles from './style';

export default function AddCardScreen({ route }) {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);
  const { colors, isDark } = useApp();
  const navigation = useNavigation();
  const { showToast } = useToast();

  const [cardNumber, setCardNumber] = useState('5412 7512 3412 4417');
  const [expiry, setExpiry] = useState('09 / 29');
  const [cvv, setCvv] = useState('884');
  const [nameOnCard, setNameOnCard] = useState('Ananya Shah');
  const [saveCard, setSaveCard] = useState(true);
  const [focusedField, setFocusedField] = useState('cvv');

  // Format Card Number
  const handleCardNumberChange = text => {
    const clean = text.replace(/[^0-9]/g, '').slice(0, 16);
    const parts = clean.match(/.{1,4}/g) || [];
    setCardNumber(parts.join(' '));
  };

  // Format Expiry
  const handleExpiryChange = text => {
    const clean = text.replace(/[^0-9]/g, '').slice(0, 4);
    if (clean.length > 2) {
      setExpiry(`${clean.slice(0, 2)} / ${clean.slice(2)}`);
    } else {
      setExpiry(clean);
    }
  };

  // Format CVV
  const handleCvvChange = text => {
    const clean = text.replace(/[^0-9]/g, '').slice(0, 4);
    setCvv(clean);
  };

  // Detect card network
  const getCardNetwork = () => {
    const cleanNum = cardNumber.replace(/[^0-9]/g, '');
    if (cleanNum.startsWith('4')) {
      return 'VISA';
    }
    if (cleanNum.startsWith('5')) {
      return 'MASTERCARD';
    }
    if (cleanNum.startsWith('6')) {
      return 'RUPAY';
    }
    return 'NETWORK';
  };

  const getMaskedPreviewNumber = () => {
    const clean = cardNumber.replace(/[^0-9]/g, '');
    if (clean.length >= 4) {
      const last4 = clean.slice(-4);
      return `▪▪▪▪ ▪▪▪▪ ▪▪▪▪ ${last4}`;
    }
    return '▪▪▪▪ ▪▪▪▪ ▪▪▪▪ ▪▪▪▪';
  };

  const handleAddCard = () => {
    const cleanNum = cardNumber.replace(/[^0-9]/g, '');
    if (cleanNum.length < 4) {
      showToast({ type: 'error', message: 'Please enter a valid card number' });
      return;
    }

    const last4 = cleanNum.slice(-4);
    const network = getCardNetwork();
    const formattedTitle = `${network === 'MASTERCARD' ? 'MasterCard' : network === 'VISA' ? 'Visa' : 'Card'} ▪▪▪▪ ${last4}`;
    const formattedSubtitle = `Expires ${expiry || '12/28'} · ${nameOnCard || 'Cardholder'}`;

    const newCardItem = {
      id: `card_${Date.now()}`,
      title: formattedTitle,
      subtitle: formattedSubtitle,
      type: 'card',
      icon: 'card',
    };

    // If callback provided via route params
    if (route?.params?.onCardAdded) {
      route.params.onCardAdded(newCardItem);
    }

    showToast({
      type: 'success',
      message: 'Card added successfully',
    });

    navigation.navigate({
      name: 'PaymentMethods',
      params: { newCard: newCardItem },
      merge: true,
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
        <Text style={styles.headerTitle}>Add card</Text>
        <View style={styles.headerBtn} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[
            styles.scroll,
            { paddingBottom: Math.max(insets.bottom, 20) + 90 },
          ]}>
          {/* Card Visual Preview */}
          <View style={styles.cardPreview}>
            <View style={styles.cardAccentCircle} />
            <View style={styles.cardAccentCircle2} />

            {/* Top row */}
            <View style={styles.cardTopRow}>
              <View>
                <Text style={styles.cardLabel}>CARD HOLDER</Text>
                <Text style={styles.cardHolderName} numberOfLines={1}>
                  {(nameOnCard || 'ANANYA SHAH').toUpperCase()}
                </Text>
              </View>
              <View>
                <Text style={[styles.cardLabel, { textAlign: 'right' }]}>
                  EXPIRES
                </Text>
                <Text style={styles.cardExpiry}>
                  {expiry || '09 / 29'}
                </Text>
              </View>
            </View>

            {/* Chip */}
            <View style={styles.chipBox}>
              <View style={styles.chipLine} />
              <View style={styles.chipLine} />
              <View style={styles.chipLine} />
            </View>

            {/* Bottom row */}
            <View style={styles.cardBottomRow}>
              <Text style={styles.cardNumberText}>
                {getMaskedPreviewNumber()}
              </Text>
              <View style={styles.networkBadge}>
                <Text style={styles.networkText}>{getCardNetwork()}</Text>
              </View>
            </View>
          </View>

          {/* Form Fields */}
          {/* Card Number */}
          <View style={styles.formGroup}>
            <Text style={styles.inputLabel}>Card number *</Text>
            <TextInput
              style={[
                styles.input,
                focusedField === 'cardNumber' && styles.inputFocused,
              ]}
              value={cardNumber}
              onChangeText={handleCardNumberChange}
              onFocus={() => setFocusedField('cardNumber')}
              placeholder="0000 0000 0000 0000"
              placeholderTextColor={isDark ? colors.navy[400] : '#94A3B8'}
              keyboardType="number-pad"
              selectionColor="#FF7A00"
            />
          </View>

          {/* Expiry & CVV */}
          <View style={styles.rowFields}>
            <View style={[styles.formGroup, styles.halfField]}>
              <Text style={styles.inputLabel}>Expiry *</Text>
              <TextInput
                style={[
                  styles.input,
                  focusedField === 'expiry' && styles.inputFocused,
                ]}
                value={expiry}
                onChangeText={handleExpiryChange}
                onFocus={() => setFocusedField('expiry')}
                placeholder="MM / YY"
                placeholderTextColor={isDark ? colors.navy[400] : '#94A3B8'}
                keyboardType="number-pad"
                selectionColor="#FF7A00"
              />
            </View>
            <View style={styles.fieldGap} />
            <View style={[styles.formGroup, styles.halfField]}>
              <Text style={styles.inputLabel}>CVV *</Text>
              <TextInput
                style={[
                  styles.input,
                  focusedField === 'cvv' && styles.inputFocused,
                ]}
                value={cvv}
                onChangeText={handleCvvChange}
                onFocus={() => setFocusedField('cvv')}
                placeholder="•••"
                placeholderTextColor={isDark ? colors.navy[400] : '#94A3B8'}
                keyboardType="number-pad"
                secureTextEntry
                maxLength={4}
                selectionColor="#FF7A00"
              />
            </View>
          </View>

          {/* Name on card */}
          <View style={styles.formGroup}>
            <Text style={styles.inputLabel}>Name on card *</Text>
            <TextInput
              style={[
                styles.input,
                focusedField === 'nameOnCard' && styles.inputFocused,
              ]}
              value={nameOnCard}
              onChangeText={setNameOnCard}
              onFocus={() => setFocusedField('nameOnCard')}
              placeholder="Cardholder Name"
              placeholderTextColor={isDark ? colors.navy[400] : '#94A3B8'}
              autoCapitalize="words"
              selectionColor="#FF7A00"
            />
          </View>

          {/* Save this card row */}
          <View style={styles.saveCardRow}>
            <View style={styles.saveCardTextWrap}>
              <Text style={styles.saveCardTitle}>Save this card</Text>
              <Text style={styles.saveCardSub}>
                Encrypted and tokenised by our PCI-DSS gateway
              </Text>
            </View>
            <Toggle value={saveCard} onValueChange={setSaveCard} />
          </View>

          {/* Security Banner */}
          <View style={styles.securityBanner}>
            <Feather
              name="lock"
              size={18}
              color={isDark ? colors.green[400] : '#059669'}
            />
            <Text style={styles.securityText}>
              Cabora never sees your full card number — it is tokenised by the
              gateway.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Bottom Actions */}
      <View
        style={[
          styles.footer,
          { paddingBottom: Math.max(insets.bottom, 14) },
        ]}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.cancelBtn}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Cancel">
          <Text style={styles.cancelBtnText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.addBtn}
          onPress={handleAddCard}
          accessibilityRole="button"
          accessibilityLabel="Add card">
          <Text style={styles.addBtnText}>Add card</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
