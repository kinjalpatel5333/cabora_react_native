import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Linking, Platform, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@react-native-vector-icons/feather/static';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { images } from '../../assets';
import { Button, CountryPickerModal, Input } from '../../components';
import useThemedStyles from '../../components/useThemedStyles';
import { useApp } from '../../context/AppContext';
import { sendOtpApi } from '../../config';
import { DEFAULT_COUNTRY } from '../../utils/countries';
import {
  digitsOnly,
  formatIndianMobile,
  isValidIndianMobile,
} from '../../utils/validators';
import createStyles from './style';

const TEST_BLOCKED_NUMBER = '0000000000';
const TEST_COOLDOWN_NUMBER = '1234567890';
const COOLDOWN_SECONDS = 5 * 60;
const MAX_SEND_ATTEMPTS = 3;
const SUPPORT_URL = 'mailto:support@cabora.app';

function formatTimer(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function parseCooldownSeconds(errMsg, errData) {
  if (errData?.retryAfter) return Number(errData.retryAfter);
  if (errData?.cooldown) return Number(errData.cooldown);
  if (errData?.expiresIn) return Number(errData.expiresIn);

  if (typeof errMsg === 'string') {
    const lower = errMsg.toLowerCase();
    const secMatch =
      errMsg.match(/(\d+)\s*seconds?\s*remaining/i) ||
      errMsg.match(/try again in\s*(\d+)/i) ||
      errMsg.match(/after\s*(\d+)\s*sec/i);

    if (secMatch && secMatch[1]) {
      const parsed = parseInt(secMatch[1], 10);
      if (!isNaN(parsed) && parsed > 0) {
        return parsed;
      }
    }
    if (
      lower.includes('already been sent') ||
      lower.includes('please try again after')
    ) {
      return COOLDOWN_SECONDS;
    }
  }
  return null;
}

export default function LoginScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useApp();
  const styles = useThemedStyles(createStyles);

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle('light-content');
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor('transparent');
        StatusBar.setTranslucent(true);
      }
    }, [])
  );

  const [country, setCountry] = useState(DEFAULT_COUNTRY);
  const [countryPickerVisible, setCountryPickerVisible] = useState(false);
  const [mobile, setMobile] = useState('');
  const [touched, setTouched] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [sendCount, setSendCount] = useState(0);
  const [cooldown, setCooldown] = useState(0);
  const [loading, setLoading] = useState(false);
  const prevDigitsRef = useRef('');

  const digits = useMemo(() => digitsOnly(mobile), [mobile]);
  const isTestBlocked = digits === TEST_BLOCKED_NUMBER;
  const isTestCooldown = digits === TEST_COOLDOWN_NUMBER;
  const isIndian = country.code === 'IN';
  const isRequiredDigits = isIndian
    ? digits.length === 10
    : digits.length >= 7 && digits.length <= 15;

  const isValid = isIndian
    ? isValidIndianMobile(digits) || isTestBlocked || isTestCooldown
    : digits.length >= 7 && digits.length <= 15;

  const coolingDown = cooldown > 0;
  const showInvalid =
    !blocked &&
    !coolingDown &&
    digits.length > 0 &&
    !isValid &&
    (touched || isRequiredDigits);

  const error = blocked
    ? 'This number is blocked for security reasons.'
    : showInvalid
      ? isIndian
        ? 'Enter a valid 10-digit Indian mobile number.'
        : 'Enter a valid phone number.'
      : undefined;

  const hint = coolingDown
    ? 'You can request a new code once the timer ends.'
    : !error
      ? "We'll send a 6-digit code. Standard SMS rates may apply."
      : undefined;

  const canSend = isValid && !blocked && !coolingDown && !loading;
  const buttonTitle = coolingDown
    ? `Resend in ${formatTimer(cooldown)}`
    : 'Send OTP';

  useEffect(() => {
    if (prevDigitsRef.current !== digits) {
      prevDigitsRef.current = digits;
      if (digits === TEST_BLOCKED_NUMBER) {
        setBlocked(true);
        setCooldown(0);
        return;
      }
      if (digits === TEST_COOLDOWN_NUMBER) {
        setBlocked(false);
        setCooldown(value => (value > 0 ? value : COOLDOWN_SECONDS));
        return;
      }
      setBlocked(false);
    }
  }, [digits]);

  useEffect(() => {
    if (cooldown <= 0) {
      return undefined;
    }
    const timer = setInterval(() => {
      setCooldown(value => Math.max(0, value - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const onChangeMobile = next => {
    if (country.code === 'IN') {
      setMobile(formatIndianMobile(next));
    } else {
      setMobile(String(next || '').replace(/[^\d\s]/g, ''));
    }
  };

  const onSendOtp = async () => {
    setTouched(true);
    if (!isValid) {
      return;
    }
    if (isTestBlocked) {
      setBlocked(true);
      return;
    }
    if (isTestCooldown) {
      setCooldown(COOLDOWN_SECONDS);
      return;
    }

    setLoading(true);
    try {
      const response = await sendOtpApi({
        mobile: digits,
        countryCode: country.dialCode,
      });
      const receivedOtp =
        response?.data?.otp ||
        response?.otp ||
        response?.data?.data?.otp ||
        response?.code ||
        response?.data?.code ||
        '123456';

      const nextCount = sendCount + 1;
      setSendCount(nextCount);
      if (nextCount >= MAX_SEND_ATTEMPTS) {
        setCooldown(COOLDOWN_SECONDS);
      } else {
        navigation.navigate('Otp', {
          mobile: digits,
          countryCode: country.dialCode,
          serverOtp: receivedOtp,
        });
      }
    } catch (err) {
      console.warn('sendOtpApi error:', err);
      const rawMsg = err?.message || err?.error || err;
      const errMsg =
        typeof rawMsg === 'string'
          ? rawMsg
          : typeof rawMsg?.message === 'string'
            ? rawMsg.message
            : 'Failed to send OTP. Please check your connection and try again.';

      const extractedCooldown = parseCooldownSeconds(errMsg, err?.data || err);
      if (extractedCooldown) {
        setCooldown(extractedCooldown > 0 ? extractedCooldown : COOLDOWN_SECONDS);
      } else {
        Alert.alert('Send OTP Failed', String(errMsg));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <View style={[styles.hero, { paddingTop: insets.top + 16 }]}>
        <Image
          source={images.loginGlow}
          style={styles.glow}
          resizeMode="contain"
        />
        <View style={styles.logoContainer}>
          <Image source={images.cabOraMark} style={styles.logoImage} resizeMode="contain" />
        </View>
        <View style={styles.badge}>
          <Feather name="shield" size={12} color={colors.orange[425]} />
          <Text style={styles.badgeLabel}>SECURE OTP LOGIN</Text>
        </View>
        <Text style={styles.title}>Let's get you{'\n'}moving.</Text>
        <Text style={styles.subtitle}>
          Enter your mobile number — we'll text a 6-digit code to verify it's
          really you.
        </Text>
      </View>

      <KeyboardAvoidingView
        style={styles.body}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[
            styles.scroll,
            { paddingBottom: Math.max(insets.bottom, 8) },
          ]}
          showsVerticalScrollIndicator={false}>
          <View style={styles.form}>
            <Input
              label="Mobile number"
              value={mobile}
              onChangeText={onChangeMobile}
              onBlur={() => setTouched(true)}
              placeholder={country.placeholder || '98765 43210'}
              placeholderTextColor={colors.navy[400]}
              keyboardType="phone-pad"
              maxLength={country.code === 'IN' ? 11 : 16}
              error={error}
              hint={hint}
              hintStyle={coolingDown ? styles.cooldownHint : undefined}
              statusIcon={false}
              showFocusBorder={false}
              fieldStyle={styles.phoneField}
              style={styles.phoneInput}
              right={
                blocked ? (
                  <Feather name="lock" size={22} color={colors.red[500]} />
                ) : null
              }
              left={
                <TouchableOpacity
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  onPress={() => setCountryPickerVisible(false)}
                  style={styles.prefix}>
                  <View style={styles.dial}>
                    {country.code === 'IN' ? (
                      <Image
                        source={images.indiaFlag}
                        style={styles.flag}
                        resizeMode="cover"
                      />
                    ) : (
                      <Text style={{ fontSize: 20 }}>{country.flag}</Text>
                    )}
                    <Text style={styles.dialCode}>{country.dialCode}</Text>
                    <Feather name="chevron-down" size={16} color={colors.navy[600]} />
                  </View>
                  <View style={styles.dialDivider} />
                </TouchableOpacity>
              }
            />

            {blocked ? (
              <View style={[styles.banner, styles.bannerBlocked]}>
                <View style={styles.bannerRow}>
                  <Feather name="lock" size={22} color={colors.red[500]} />
                  <View style={styles.bannerCopy}>
                    <Text style={[styles.bannerTitle, styles.bannerTitleBlocked]}>
                      Number temporarily blocked
                    </Text>
                    <Text style={[styles.bannerBody, styles.bannerBodyBlocked]}>
                      Too many failed verifications. Contact support to unblock,
                      or try a different number.
                    </Text>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => Linking.openURL(SUPPORT_URL)}>
                      <Text style={styles.support}>Contact support →</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ) : null}

            {coolingDown ? (
              <View style={[styles.banner, styles.bannerCooldown]}>
                <View style={styles.bannerRow}>
                  <Feather name="clock" size={22} color={colors.orange.amberText} />
                  <View style={styles.bannerCopy}>
                    <Text
                      style={[styles.bannerTitle, styles.bannerTitleCooldown]}>
                      Too many code requests
                    </Text>
                    <Text
                      style={[styles.bannerBody, styles.bannerBodyCooldown]}>
                      For your security we've paused new codes for 5 minutes.
                      Your last code may still work.
                    </Text>
                  </View>
                </View>
              </View>
            ) : null}
          </View>

          <View style={styles.actions}>
            <Button
              title={buttonTitle}
              onPress={onSendOtp}
              loading={loading}
              disabled={!canSend}
            />
            <Text style={styles.terms}>
              By continuing you agree to{' '}
              <Text style={styles.termsBrand}>Cabora's</Text>{' '}
              <Text style={styles.termsLink}>Terms of Service</Text>
              {'\n'}and{' '}
              <Text style={styles.termsLink}>Privacy Policy.</Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <CountryPickerModal
        visible={countryPickerVisible}
        selectedCountry={country}
        onSelect={setCountry}
        onClose={() => setCountryPickerVisible(false)}
      />
    </View>
  );
}
