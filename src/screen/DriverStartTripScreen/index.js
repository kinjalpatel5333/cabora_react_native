import React, {useRef, useState} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Feather} from '@react-native-vector-icons/feather/static';
import {Lucide} from '@react-native-vector-icons/lucide/static';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useToast} from '../../components/Toast';
import useThemedStyles from '../../components/useThemedStyles';
import {useApp} from '../../context/AppContext';
import createStyles from './style';

const VALID_CODE = '1234';
const MAX_ATTEMPTS = 3;

export default function DriverStartTripScreen() {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);
  const {colors} = useApp();
  const navigation = useNavigation();
  const {showToast} = useToast();

  const [otp, setOtp] = useState('');
  const [attempts, setAttempts] = useState(1);
  const [isLocked, setIsLocked] = useState(false);
  const [isError, setIsError] = useState(false);

  const inputRef = useRef(null);
  const lastValidatedOtp = useRef('');

  const handleStartTrip = () => {
    if (isLocked) {
      return;
    }

    if (otp === VALID_CODE) {
      Keyboard.dismiss();
      showToast({
        title: 'Trip Started',
        message: 'Drive safely to Airport T2.',
        type: 'success',
      });
      navigation.navigate('DriverTabs');
    } else if (otp.length === 4) {
      if (attempts >= MAX_ATTEMPTS) {
        setIsLocked(true);
        setIsError(true);
        Keyboard.dismiss();
      } else {
        setIsError(true);
        setAttempts(prev => Math.min(prev + 1, MAX_ATTEMPTS));
        showToast({
          title: 'Incorrect start code',
          message: `Attempt ${attempts} of ${MAX_ATTEMPTS} failed. Try code 1234.`,
          type: 'error',
        });
      }
    }
  };

  const handleOtpChange = text => {
    if (isLocked) {
      return;
    }
    const cleaned = text.replace(/[^0-9]/g, '').slice(0, 4);
    setOtp(cleaned);

    if (cleaned.length < 4) {
      setIsError(false);
      lastValidatedOtp.current = '';
    } else if (cleaned.length === 4 && cleaned !== lastValidatedOtp.current) {
      lastValidatedOtp.current = cleaned;
      if (cleaned === VALID_CODE) {
        setIsError(false);
      } else {
        setIsError(true);
        if (attempts >= MAX_ATTEMPTS) {
          setIsLocked(true);
          Keyboard.dismiss();
          showToast({
            title: 'Verification Locked',
            message: '3 of 3 attempts used. Please contact support.',
            type: 'error',
          });
        } else {
          setAttempts(prev => prev + 1);
          showToast({
            title: 'Incorrect start code',
            message: `Attempt ${attempts} of ${MAX_ATTEMPTS} failed. Valid code is 1234.`,
            type: 'error',
          });
        }
      }
    }
  };

  const isValid = otp === VALID_CODE && !isLocked;

  return (
    <View style={[styles.root, {paddingTop: insets.top}]}>
      <StatusBar
        barStyle={colors.isDark ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />

      {/* Header */}
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => navigation.goBack()}
          style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.text} />
        </Pressable>

        <Text style={styles.headerTitle}>Start trip</Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Support"
          onPress={() => {
            Linking.openURL('tel:18004190000').catch(() => {
              showToast({
                title: 'Support',
                message: 'Helpline: 1800 419 0000',
                type: 'info',
              });
            });
          }}
          style={styles.supportBtn}>
          <Feather name="headphones" size={20} color={colors.text} />
        </Pressable>
      </View>

      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={{flexGrow: 1, paddingBottom: 24}}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <Pressable
            style={styles.content}
            onPress={() => !isLocked && inputRef.current?.focus()}>
            {/* Passenger Card */}
            <View style={styles.passengerCard}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>AS</Text>
              </View>
              <View style={styles.passengerDetails}>
                <Text style={styles.passengerName}>Ananya S. · 4.8 ★</Text>
                <Text style={styles.routeText} numberOfLines={2}>
                  Prestige Tech Park, Gate 3 → Airport T2
                </Text>
              </View>
              <View style={styles.fareContainer}>
                <Text style={styles.cashLabel}>CASH</Text>
                <Text style={styles.fareAmount}>₹184</Text>
              </View>
            </View>

            {/* Instruction */}
            <View style={styles.instructionSection}>
              <Text style={styles.instructionTitle}>
                Ask Ananya for her start code
              </Text>
              <Text style={styles.instructionSub}>
                The 4 digits are on her ride screen. Never start a trip without them.
              </Text>
            </View>

            {/* OTP Digit Boxes Container */}
            <Pressable
              style={styles.otpSectionWrapper}
              onPress={() => !isLocked && inputRef.current?.focus()}>
              <View style={styles.otpSection}>
                {[0, 1, 2, 3].map(index => {
                  const digit = otp[index] || '';
                  const isActive = !isLocked && index === otp.length;
                  const isFilled = Boolean(digit);
                  const showBoxError = isError || isLocked;

                  return (
                    <View
                      key={index}
                      style={[
                        styles.otpBox,
                        isFilled && styles.otpBoxFilled,
                        isActive && styles.otpBoxActive,
                        showBoxError && styles.otpBoxError,
                      ]}>
                      {digit ? (
                        <Text
                          style={[
                            styles.otpDigit,
                            showBoxError && styles.otpDigitError,
                          ]}>
                          {digit}
                        </Text>
                      ) : isActive ? (
                        <Text style={styles.cursor}>|</Text>
                      ) : null}
                    </View>
                  );
                })}
              </View>

              {/* Hidden text input */}
              <TextInput
                ref={inputRef}
                value={otp}
                onChangeText={handleOtpChange}
                keyboardType="number-pad"
                maxLength={4}
                style={styles.hiddenInput}
                autoFocus={!isLocked}
                editable={!isLocked}
                caretHidden
              />
            </Pressable>

            {/* Attempt Counter Badge */}
            <View
              style={[
                styles.attemptBadge,
                isLocked && styles.attemptBadgeLocked,
              ]}>
              {isLocked ? (
                <Feather name="lock" size={13} color="#DC2626" />
              ) : (
                <Lucide
                  name="shield-check"
                  size={15}
                  color={colors.isDark ? colors.navy[200] : '#475569'}
                />
              )}
              <Text
                style={[
                  styles.attemptText,
                  isLocked && styles.attemptTextLocked,
                ]}>
                {isLocked
                  ? '3 of 3 attempts used'
                  : `Attempt ${attempts} of ${MAX_ATTEMPTS}`}
              </Text>
            </View>

            {/* Locked Error Row & Support Card */}
            {isLocked && (
              <>
                <View style={styles.errorRow}>
                  <Feather
                    name="alert-circle"
                    size={16}
                    color="#DC2626"
                    style={{marginTop: 1}}
                  />
                  <Text style={styles.errorText}>
                    Incorrect code. Verification is locked for this trip.
                  </Text>
                </View>

                <View style={styles.supportCard}>
                  <View style={styles.supportCardHeader}>
                    <Feather name="headphones" size={18} color="#DC2626" />
                    <Text style={styles.supportCardTitle}>
                      Support can start this trip for you
                    </Text>
                  </View>
                  <Text style={styles.supportCardSub}>
                    Call us and we'll verify the passenger and start the trip
                    manually. If you cancel now there's no penalty and no effect
                    on your rating.
                  </Text>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => Linking.openURL('tel:18004190000')}
                    style={styles.callSupportBtn}>
                    <Feather name="phone" size={16} color="#FFFFFF" />
                    <Text style={styles.callSupportText}>
                      Call support · 1800 419 0000
                    </Text>
                  </Pressable>
                </View>
              </>
            )}
          </Pressable>
        </ScrollView>

        {/* Footer Buttons pinned to bottom with top border and shadow */}
        <View
          style={[
            styles.footer,
            {paddingBottom: Math.max(insets.bottom, 16) + 4},
          ]}>
          <Pressable
            accessibilityRole="button"
            disabled={!isValid}
            onPress={handleStartTrip}
            style={[
              styles.startTripBtn,
              !isValid && styles.startTripBtnDisabled,
            ]}>
            <Text
              style={[
                styles.startTripBtnText,
                !isValid && styles.startTripBtnTextDisabled,
              ]}>
              {isLocked ? 'Start trip · locked' : 'Start trip'}
            </Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={() => {
              Keyboard.dismiss();
              if (isLocked) {
                navigation.navigate('CancelRideReason');
              } else {
                showToast({
                  title: 'Help',
                  message: 'Asking passenger to check the ride details on their phone.',
                  type: 'info',
                });
              }
            }}
            style={styles.cantFindCodeBtn}>
            <Text
              style={
                isLocked ? styles.cancelPenaltyText : styles.cantFindCodeText
              }>
              {isLocked
                ? 'Cancel without penalty'
                : "Passenger can't find the code?"}
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
