import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  StatusBar,
  Text,
  TextInput,
  View,
} from 'react-native';
import {AntDesign} from '@react-native-vector-icons/ant-design/static';
import {Feather} from '@react-native-vector-icons/feather/static';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Button} from '../../components';
import useThemedStyles from '../../components/useThemedStyles';
import {useApp} from '../../context/AppContext';
import {formatIndianMobile} from '../../utils/validators';
import createStyles from './style';

const CODE_LENGTH = 6;
const CORRECT_OTP = '123456';
const TEST_INCORRECT_OTP = '000000';
const TEST_EXPIRED_OTP = '111111';
const TEST_PAUSED_OTP = '222222';
const MAX_ATTEMPTS = 5;
const RESEND_SECONDS = 45;
const EXPIRE_SECONDS = 90;
const PAUSE_SECONDS = 15 * 60;
const VERIFY_REDIRECT_MS = 15 * 1000;
const SUPPORT_URL = 'mailto:support@cabora.app';

function formatTimer(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function maskPhone(digits) {
  if (!digits) {
    return '+91';
  }
  if (digits.length < 8) {
    return `+91 ${formatIndianMobile(digits)}`;
  }
  return `+91 ${digits.slice(0, 5)} ••${digits.slice(-3)}`;
}

export default function OtpScreen({navigation, route}) {
  const insets = useSafeAreaInsets();
  const {colors} = useApp();
  const styles = useThemedStyles(createStyles);
  const inputRef = useRef(null);
  const phone = route?.params?.mobile || '';

  const [code, setCode] = useState('');
  const [attemptsLeft, setAttemptsLeft] = useState(MAX_ATTEMPTS);
  const [resendIn, setResendIn] = useState(RESEND_SECONDS);
  const [expiresIn, setExpiresIn] = useState(EXPIRE_SECONDS);
  const [pauseIn, setPauseIn] = useState(0);
  const [error, setError] = useState('');
  const [expired, setExpired] = useState(false);
  const [verified, setVerified] = useState(false);
  const [focused, setFocused] = useState(true);

  const paused = pauseIn > 0;
  const digits = code.split('');
  const canResend = resendIn === 0 && !paused && !verified;
  const canVerify =
    code.length === CODE_LENGTH && !expired && !paused && !verified;

  const buttonTitle = paused
    ? `Try again in ${formatTimer(pauseIn)}`
    : verified
      ? 'Verified'
      : 'Verify & continue';

  const avatarStyle = verified
    ? styles.avatarVerified
    : paused
      ? styles.avatarPaused
      : styles.avatarChat;

  const helper = useMemo(() => {
    if (verified) {
      return {
        type: 'success',
        text: 'Number verified. Taking you to Cabora...',
      };
    }
    if (expired) {
      return {
        type: 'error',
        text: 'This code expired. Request a new one to continue.',
      };
    }
    if (error) {
      return {type: 'error', text: error};
    }
    if (resendIn > 0 && code.length >= 5 && !paused) {
      return {
        type: 'info',
        text: "Didn't get it? Check your SMS inbox — delivery can take up to 30 seconds.",
      };
    }
    return null;
  }, [verified, expired, error, resendIn, code.length, paused]);

  useEffect(() => {
    if (verified || paused || expired) {
      return undefined;
    }
    const timer = setInterval(() => {
      setResendIn(value => Math.max(0, value - 1));
      setExpiresIn(value => {
        const next = Math.max(0, value - 1);
        if (next === 0) {
          setExpired(true);
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [expired, paused, verified]);

  useEffect(() => {
    if (!paused) {
      return undefined;
    }
    const timer = setInterval(() => {
      setPauseIn(value => Math.max(0, value - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [paused]);

  useEffect(() => {
    if (!verified) {
      return undefined;
    }
    const timeout = setTimeout(() => {
      navigation.replace('SetupAccount', {mobile: phone});
    }, VERIFY_REDIRECT_MS);
    return () => clearTimeout(timeout);
  }, [navigation, phone, verified]);

  useEffect(() => {
    if (pauseIn > 0 || attemptsLeft > 0) {
      return;
    }
    setAttemptsLeft(MAX_ATTEMPTS);
    setCode('');
    setError('');
    setExpired(false);
    setResendIn(RESEND_SECONDS);
    setExpiresIn(EXPIRE_SECONDS);
  }, [attemptsLeft, pauseIn]);

  const applyCode = value => {
    if (value.length !== CODE_LENGTH || paused || verified) {
      return;
    }
    if (value === CORRECT_OTP) {
      setError('');
      setExpired(false);
      setVerified(true);
      return;
    }
    if (value === TEST_EXPIRED_OTP) {
      setError('');
      setExpired(true);
      return;
    }
    if (value === TEST_PAUSED_OTP) {
      setCode('');
      setError('');
      setExpired(false);
      setAttemptsLeft(0);
      setPauseIn(PAUSE_SECONDS);
      return;
    }
    if (value === TEST_INCORRECT_OTP) {
      setExpired(false);
      setAttemptsLeft(2);
      setError(
        "That code isn't right. 2 attempts left before we pause verification.",
      );
      return;
    }
    if (expired) {
      return;
    }
    const remaining = attemptsLeft - 1;
    setAttemptsLeft(remaining);
    if (remaining <= 0) {
      setCode('');
      setError('');
      setPauseIn(PAUSE_SECONDS);
      return;
    }
    setError(
      `That code isn't right. ${remaining} attempt${
        remaining === 1 ? '' : 's'
      } left before we pause verification.`,
    );
  };

  const onChangeCode = next => {
    if (paused || verified || expired) {
      return;
    }
    const value = String(next || '')
      .replace(/\D/g, '')
      .slice(0, CODE_LENGTH);
    setCode(value);
    setError('');
    if (value.length === CODE_LENGTH) {
      applyCode(value);
    }
  };

  const startNewCode = () => {
    if (!canResend && !expired) {
      return;
    }
    setCode('');
    setError('');
    setExpired(false);
    setResendIn(RESEND_SECONDS);
    setExpiresIn(EXPIRE_SECONDS);
    inputRef.current?.focus();
  };

  const onVerify = () => {
    if (!canVerify) {
      return;
    }
    applyCode(code);
  };

  return (
    <View style={[styles.root, {paddingTop: insets.top + 8}]}>
      <StatusBar barStyle={colors.barStyle} />
      <KeyboardAvoidingView
        style={styles.body}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.top}>
          <Pressable
            accessibilityRole="button"
            onPress={() => navigation.goBack()}
            style={styles.back}>
            <Feather name="arrow-left" size={20} color={colors.text} />
          </Pressable>

          <View style={[styles.avatar, avatarStyle]}>
            {verified ? (
              <AntDesign
                name="check-circle"
                size={28}
                color={colors.green[600]}
              />
            ) : paused ? (
              <Feather name="lock" size={22} color={colors.red[500]} />
            ) : (
              <Feather
                name="message-circle"
                size={22}
                color={colors.orange[500]}
              />
            )}
          </View>

          <Text style={styles.title}>
            {verified ? "You're verified" : 'Verify your number'}
          </Text>
          <View style={styles.meta}>
            <Text style={styles.metaText}>
              Code sent to {maskPhone(phone)} ·{' '}
            </Text>
            <Text style={styles.change} onPress={() => navigation.goBack()}>
              Change
            </Text>
          </View>

          <Pressable onPress={() => inputRef.current?.focus()} style={styles.boxesHit}>
            <View style={styles.boxes}>
              {Array.from({length: CODE_LENGTH}).map((_, index) => {
                const digit = digits[index];
                const isActive =
                  focused &&
                  !verified &&
                  !paused &&
                  index === (code.length === CODE_LENGTH ? CODE_LENGTH - 1 : code.length);
                return (
                  <View
                    key={index}
                    style={[
                      styles.box,
                      digit ? styles.boxFilled : null,
                      isActive && !expired && !error ? styles.boxFocused : null,
                      (error || expired) && digit ? styles.boxError : null,
                      verified ? styles.boxSuccess : null,
                    ]}>
                    {digit ? (
                      <Text
                        style={[
                          styles.boxDigit,
                          (error || expired) && styles.boxDigitError,
                          verified && styles.boxDigitSuccess,
                        ]}>
                        {digit}
                      </Text>
                    ) : isActive && !expired ? (
                      <View style={styles.caret} />
                    ) : null}
                  </View>
                );
              })}
            </View>
            <TextInput
              ref={inputRef}
              value={code}
              onChangeText={onChangeCode}
              keyboardType="number-pad"
              maxLength={CODE_LENGTH}
              autoFocus
              caretHidden
              autoComplete="sms-otp"
              textContentType="oneTimeCode"
              editable={!paused && !verified && !expired}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              style={styles.hiddenInput}
            />
          </Pressable>

          {paused ? (
            <View style={styles.banner}>
              <Text style={styles.bannerTitle}>Verification paused</Text>
              <Text style={styles.bannerBody}>
                You've used all 5 attempts. For your account's safety, try again
                in 15 minutes or reach support.
              </Text>
              <Pressable onPress={() => Linking.openURL(SUPPORT_URL)}>
                <Text style={styles.support}>Contact support →</Text>
              </Pressable>
            </View>
          ) : helper ? (
            <View style={styles.hintRow}>
              {helper.type === 'error' ? (
                <AntDesign name="info-circle" size={14} color={colors.danger} />
              ) : helper.type === 'success' ? (
                <AntDesign name="check-circle" size={14} color={colors.green[600]} />
              ) : (
                <AntDesign name="info-circle" size={14} color={colors.gray[400]} />
              )}
              <Text
                style={[
                  styles.hint,
                  helper.type === 'error' && styles.hintError,
                  helper.type === 'success' && styles.hintSuccess,
                ]}>
                {helper.text}
              </Text>
            </View>
          ) : null}

          {verified ? null : paused ? (
            <View style={styles.chip}>
              <Feather name="clock" size={14} color={colors.gray[400]} />
              <Text style={styles.chipLabel}>Resend paused</Text>
            </View>
          ) : expired ? (
            <Pressable onPress={startNewCode} style={[styles.chip, styles.chipResend]}>
              <Feather name="refresh-cw" size={14} color={colors.primary} />
              <Text style={[styles.chipLabel, styles.chipLabelResend]}>
                Resend code
              </Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={startNewCode}
              disabled={!canResend}
              style={styles.chip}>
              <Feather name="clock" size={14} color={colors.gray[400]} />
              <Text style={styles.chipLabel}>
                {resendIn > 0
                  ? `Resend code in ${formatTimer(resendIn)}`
                  : 'Resend code'}
              </Text>
            </Pressable>
          )}
        </View>

        <View
          style={[styles.footer, {paddingBottom: Math.max(insets.bottom, 8)}]}>
          <Button
            title={buttonTitle}
            onPress={onVerify}
            loading={verified}
            disabled={!verified && !canVerify}
            style={styles.verifyButton}
          />
          <Text style={styles.help}>
            Trouble receiving the code?{' '}
            <Text
              style={styles.helpLink}
              onPress={() => Linking.openURL(SUPPORT_URL)}>
              Get help
            </Text>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
