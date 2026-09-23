import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Alert, KeyboardAvoidingView, Linking, Modal, Platform, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {AntDesign} from '@react-native-vector-icons/ant-design/static';
import {Feather} from '@react-native-vector-icons/feather/static';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Button} from '../../components';
import useThemedStyles from '../../components/useThemedStyles';
import {useApp} from '../../context/AppContext';
import {sendOtpApi, verifyOtpApi, setAuthToken} from '../../config';
import {formatIndianMobile} from '../../utils/validators';
import createStyles from './style';
import colors from '../../config/color';

const CODE_LENGTH = 6;
const CORRECT_OTP = '123456';
const TEST_INCORRECT_OTP = '000000';
const TEST_EXPIRED_OTP = '111111';
const TEST_PAUSED_OTP = '222222';
const MAX_ATTEMPTS = 5;
const RESEND_SECONDS = 45;
const EXPIRE_SECONDS = 90;
const PAUSE_SECONDS = 15 * 60;
const VERIFY_REDIRECT_MS = 1200;
const SUPPORT_URL = 'mailto:support@cabora.app';

function formatTimer(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function maskPhone(digits, dialCode = '+91') {
  if (!digits) {
    return dialCode;
  }
  if (digits.length < 8) {
    return `${dialCode} ${formatIndianMobile(digits)}`;
  }
  return `${dialCode} ${digits.slice(0, 5)} ••${digits.slice(-3)}`;
}

export default function OtpScreen({navigation, route}) {
  const insets = useSafeAreaInsets();
  const {colors} = useApp();
  const styles = useThemedStyles(createStyles);
  const inputRef = useRef(null);
  const phone = route?.params?.mobile || '';
  const countryCode = route?.params?.countryCode || '+91';

  const [challengeId, setChallengeId] = useState(
    route?.params?.challengeId || '',
  );
  const [serverOtp, setServerOtp] = useState(route?.params?.serverOtp || '');
  const [showOtpModal, setShowOtpModal] = useState(
    Boolean(route?.params?.serverOtp || serverOtp || true),
  );
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState('');
  const [attemptsLeft, setAttemptsLeft] = useState(MAX_ATTEMPTS);
  const [resendIn, setResendIn] = useState(RESEND_SECONDS);
  const [expiresIn, setExpiresIn] = useState(EXPIRE_SECONDS);
  const [pauseIn, setPauseIn] = useState(0);
  const [error, setError] = useState('');
  const [expired, setExpired] = useState(false);
  const [verified, setVerified] = useState(false);
  const [focused, setFocused] = useState(true);

  useEffect(() => {
    console.log('\n==========================================');
    console.log(`📱 [OTP SCREEN] Verification for: ${countryCode} ${phone}`);
    console.log(`🔑 challengeId: ${challengeId || 'N/A'}`);
    console.log(`🔢 >>> ENTER OTP: [ ${serverOtp || CORRECT_OTP} ] <<<`);
    console.log('==========================================\n');
  }, [countryCode, phone, challengeId, serverOtp]);

  const activeOtp = serverOtp || route?.params?.serverOtp || CORRECT_OTP;

  const handleAutoFill = () => {
    setShowOtpModal(false);
    if (activeOtp) {
      const val = String(activeOtp).replace(/\D/g, '').slice(0, CODE_LENGTH);
      setCode(val);
      if (val.length === CODE_LENGTH) {
        verifySubmittedCode(val);
      }
    }
  };

  const paused = pauseIn > 0;
  const digits = code.split('');
  const canResend = resendIn === 0 && !paused && !verified && !loading;
  const canVerify =
    code.length === CODE_LENGTH &&
    !expired &&
    !paused &&
    !verified &&
    !loading;

  const buttonTitle = paused
    ? `Try again in ${formatTimer(pauseIn)}`
    : loading
      ? 'Verifying...'
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

  const [verifiedUser, setVerifiedUser] = useState(null);
  const [verifiedToken, setVerifiedToken] = useState(null);

  useEffect(() => {
    if (!verified) {
      return undefined;
    }
    const timeout = setTimeout(() => {
      navigation.replace('SetupAccount', {
        mobile: phone,
        countryCode,
        userId:
          verifiedUser?.id ||
          verifiedUser?._id ||
          verifiedUser?.userId,
        user: verifiedUser,
        token: verifiedToken,
      });
    }, VERIFY_REDIRECT_MS);
    return () => clearTimeout(timeout);
  }, [navigation, phone, countryCode, verified, verifiedUser, verifiedToken]);

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

  const verifySubmittedCode = async value => {
    if (value.length !== CODE_LENGTH || paused || verified || loading) {
      return;
    }

    // Local test hooks
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

    setLoading(true);
    setError('');

    try {
      if (challengeId) {
        // Call live backend verify OTP API
        const response = await verifyOtpApi({
          challengeId,
          otp: value,
          mobile: phone,
          countryCode,
        });

        const token =
          response?.data?.token ||
          response?.data?.accessToken ||
          response?.token ||
          response?.accessToken;
        if (token) {
          setAuthToken(token);
          setVerifiedToken(token);
        }

        const userData = response?.data?.user || response?.user || response?.data;
        if (userData) {
          setVerifiedUser(userData);
        }

        setError('');
        setExpired(false);
        setVerified(true);
      } else {
        // Fallback check against serverOtp or CORRECT_OTP
        const expectedOtp = serverOtp || CORRECT_OTP;
        if (value === expectedOtp || value === CORRECT_OTP) {
          setError('');
          setExpired(false);
          setVerified(true);
        } else {
          throw new Error("That code isn't right. Please try again.");
        }
      }
    } catch (err) {
      console.warn('verifyOtpApi error:', err);
      const rawMsg = err?.message || err?.error || err;
      const errMsg =
        typeof rawMsg === 'string'
          ? rawMsg
          : typeof rawMsg?.message === 'string'
            ? rawMsg.message
            : "That code isn't right. Please check and try again.";

      const remaining = attemptsLeft - 1;
      setAttemptsLeft(remaining);
      if (remaining <= 0) {
        setCode('');
        setError('');
        setPauseIn(PAUSE_SECONDS);
      } else {
        setError(errMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const onChangeCode = next => {
    if (paused || verified || expired || loading) {
      return;
    }
    const value = String(next || '')
      .replace(/\D/g, '')
      .slice(0, CODE_LENGTH);
    setCode(value);
    setError('');

    // Auto verify as soon as user types 6 digits
    if (value.length === CODE_LENGTH) {
      verifySubmittedCode(value);
    }
  };

  const startNewCode = async () => {
    if (!canResend && !expired) {
      return;
    }
    setCode('');
    setError('');
    setExpired(false);
    setResendIn(RESEND_SECONDS);
    setExpiresIn(EXPIRE_SECONDS);
    inputRef.current?.focus();
    try {
      if (phone) {
        const res = await sendOtpApi({mobile: phone, countryCode});
        const newChallengeId =
          res?.data?.challengeId ||
          res?.challengeId ||
          res?.data?.data?.challengeId;
        const newOtp =
          res?.data?.otp ||
          res?.otp ||
          res?.data?.data?.otp ||
          res?.code;

        if (newChallengeId) {
          setChallengeId(newChallengeId);
        }
        if (newOtp) {
          setServerOtp(newOtp);
          setShowOtpModal(true);
        }
      }
    } catch (err) {
      console.warn('Resend OTP error:', err);
      const rawMsg = err?.message || err?.error || err;
      const errMsg =
        typeof rawMsg === 'string'
          ? rawMsg
          : typeof rawMsg?.message === 'string'
            ? rawMsg.message
            : 'Failed to resend code';
      setError(errMsg);
    }
  };

  const onVerify = () => {
    if (!canVerify) {
      return;
    }
    verifySubmittedCode(code);
  };

  return (
    <View style={[styles.root, {paddingTop: insets.top + 8}]}>
      <KeyboardAvoidingView
        style={styles.body}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.top}>
          <TouchableOpacity
            activeOpacity={0.7}
            accessibilityRole="button"
            onPress={() => navigation.goBack()}
            style={styles.back}>
            <Feather name="arrow-left" size={20} color={colors.text} />
          </TouchableOpacity>

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
              Code sent to {maskPhone(phone, countryCode)} ·{' '}
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.goBack()}>
              <Text style={styles.change}>Change</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            activeOpacity={1}
            onPress={() => inputRef.current?.focus()}
            style={styles.boxesHit}>
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
              editable={!paused && !verified && !expired && !loading}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              style={styles.hiddenInput}
            />
          </TouchableOpacity>

          {paused ? (
            <View style={styles.banner}>
              <Text style={styles.bannerTitle}>Verification paused</Text>
              <Text style={styles.bannerBody}>
                You've used all 5 attempts. For your account's safety, try again
                in 15 minutes or reach support.
              </Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => Linking.openURL(SUPPORT_URL)}>
                <Text style={styles.support}>Contact support →</Text>
              </TouchableOpacity>
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
          ) : (
            <View style={{flexDirection: 'row', gap: 10, flexWrap: 'wrap'}}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={startNewCode}
                disabled={!canResend && !expired}
                style={[styles.chip, expired ? styles.chipResend : null]}>
                <Feather name={expired ? "refresh-cw" : "clock"} size={14} color={expired ? colors.primary : colors.gray[400]} />
                <Text style={[styles.chipLabel, expired ? styles.chipLabelResend : null]}>
                  {expired
                    ? 'Resend code'
                    : resendIn > 0
                      ? `Resend code in ${formatTimer(resendIn)}`
                      : 'Resend code'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setShowOtpModal(true)}
                style={[styles.chip, styles.chipResend]}>
                <Feather name="key" size={14} color={colors.orange[500]} />
                <Text style={[styles.chipLabel, {color: colors.orange[500]}]}>
                  View OTP Code
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View
          style={[styles.footer, {paddingBottom: Math.max(insets.bottom, 8)}]}>
          <Button
            title={buttonTitle}
            onPress={onVerify}
            loading={loading || verified}
            disabled={(!verified && !canVerify) || loading}
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

      {/* OTP Code Modal */}
      <Modal
        visible={showOtpModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowOtpModal(false)}>
        <View style={styles.otpModalOverlay}>
          <View style={styles.otpModalContent}>
            <View style={styles.otpIconContainer}>
              <Feather name="key" size={28} color={colors.orange[500]} />
            </View>
            <Text style={styles.otpModalTitle}>Your OTP Code</Text>
            <Text style={styles.otpModalSub}>
              Use this verification code to complete your login
            </Text>

            <View style={styles.otpBadge}>
              <Text style={styles.otpBadgeText}>{activeOtp}</Text>
            </View>

            <View style={styles.otpModalActions}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleAutoFill}
                style={styles.autoFillBtn}>
                <Text style={styles.autoFillBtnText}>Auto-Fill OTP</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setShowOtpModal(false)}
                style={styles.dismissBtn}>
                <Text style={styles.dismissBtnText}>Dismiss</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
