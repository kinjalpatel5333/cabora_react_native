import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@react-native-vector-icons/feather/static';
import { launchImageLibrary } from 'react-native-image-picker';
import { Button, DatePickerModal, Header } from '../../components';
import { useToast } from '../../components/Toast';
import useThemedStyles from '../../components/useThemedStyles';
import { useApp } from '../../context/AppContext';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchDriverProfile, fetchPassengerProfile, fetchUserProfile, setUser } from '../../redux/slices/authSlice';
import { updatePassengerProfileApi } from '../../services/userApi';
import { updateDriverProfileApi } from '../../services/driverApi';
import { extractUserProfile, formatImageUrl } from '../../utils/user';
import { storageSetItem } from '../../utils/storage';
import { STORAGE_KEYS } from '../../config/setting';
import createStyles from './style';

function formatDob(text) {
  const digits = text.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) {
    return digits;
  }
  if (digits.length <= 4) {
    return `${digits.slice(0, 2)} / ${digits.slice(2)}`;
  }
  return `${digits.slice(0, 2)} / ${digits.slice(2, 4)} / ${digits.slice(4, 8)}`;
}

function convertDobToApi(dobString) {
  if (!dobString) {
    return '';
  }
  const str = String(dobString).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    return str;
  }
  if (str.includes('T') && /^\d{4}-\d{2}-\d{2}/.test(str)) {
    return str.split('T')[0];
  }
  const slashParts = str.replace(/\s+/g, '').split(/[\/\-]/);
  if (slashParts.length === 3) {
    if (slashParts[0].length === 2 && slashParts[1].length === 2 && slashParts[2].length === 4) {
      const [day, month, year] = slashParts;
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    if (slashParts[0].length === 4 && slashParts[1].length === 2 && slashParts[2].length === 2) {
      const [year, month, day] = slashParts;
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
  }
  const parsed = new Date(str);
  if (!isNaN(parsed.getTime())) {
    const yyyy = parsed.getFullYear();
    const mm = String(parsed.getMonth() + 1).padStart(2, '0');
    const dd = String(parsed.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
  return str;
}

function convertDobToUi(dobString) {
  if (!dobString) {
    return '';
  }
  const str = String(dobString).trim();
  if (str.includes('T')) {
    const parts = str.split('T')[0].split('-');
    if (parts.length === 3) {
      const [year, month, day] = parts;
      return `${day} / ${month} / ${year}`;
    }
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    const [year, month, day] = str.split('-');
    return `${day} / ${month} / ${year}`;
  }
  return str;
}

export default function PersonalDetailsScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const { colors } = useApp();
  const styles = useThemedStyles(createStyles);
  const { showToast } = useToast();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(state => state.auth.user);

  const isDriver =
    route?.params?.isDriver ||
    route?.params?.role === 'driver' ||
    currentUser?.role === 'driver' ||
    currentUser?.currentRole === 'DRIVER' ||
    currentUser?.isDriver === true;

  const scrollViewRef = useRef(null);
  const nameInputRef = useRef(null);
  const emailInputRef = useRef(null);

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle?.(colors.isDark ? 'light-content' : 'dark-content');
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor?.('transparent');
        StatusBar.setTranslucent?.(true);
      }
      setTimeout(() => {
        scrollViewRef.current?.scrollTo?.({ y: 0, animated: false });
      }, 50);
      if (isDriver) {
        if (typeof fetchDriverProfile === 'function') {
          dispatch(fetchDriverProfile());
        }
      } else {
        if (typeof fetchPassengerProfile === 'function') {
          dispatch(fetchPassengerProfile());
        }
      }
    }, [colors.isDark, isDriver, dispatch]),
  );

  const initialExtracted = useMemo(() => {
    return extractUserProfile(currentUser, currentUser?.phone || currentUser?.mobile || '');
  }, [currentUser]);

  const [name, setName] = useState(
    initialExtracted.name || currentUser?.name || currentUser?.fullName || '',
  );
  const [dob, setDob] = useState(
    initialExtracted.dob
      ? convertDobToUi(initialExtracted.dob)
      : currentUser?.dob
        ? convertDobToUi(currentUser.dob)
        : '',
  );
  const [dobPickerVisible, setDobPickerVisible] = useState(false);
  const [gender, setGender] = useState(
    (initialExtracted.gender || currentUser?.gender || '').toLowerCase(),
  );
  const [phone, setPhone] = useState(
    initialExtracted.phone || currentUser?.phone || currentUser?.mobile || '',
  );
  const [email, setEmail] = useState(
    initialExtracted.email || currentUser?.email || '',
  );
  const [photo, setPhoto] = useState(
    initialExtracted.photo || currentUser?.photo || currentUser?.profilePhoto || currentUser?.avatar || null,
  );
  const [photoAsset, setPhotoAsset] = useState(null);
  const [emailVerified, setEmailVerified] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      e => {
        const h = e?.endCoordinates?.height || 0;
        setKeyboardHeight(h);
      },
    );
    const hideSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
      },
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  useEffect(() => {
    if (keyboardHeight > 0 && focusedInput === 'email') {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [keyboardHeight, focusedInput]);

  useEffect(() => {
    if (currentUser) {
      const p = extractUserProfile(currentUser, currentUser.phone || currentUser.mobile);
      if (p.name) setName(p.name);
      if (p.dob) setDob(convertDobToUi(p.dob));
      if (p.gender) setGender((p.gender || '').toLowerCase());
      if (p.email) setEmail(p.email);
      if (p.mobile || p.phone) setPhone(p.mobile || p.phone);
      if (p.photo || p.profilePhoto) setPhoto(p.photo || p.profilePhoto);
    }
  }, [currentUser]);

  const handleChangePhoto = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
        selectionLimit: 1,
      });

      if (result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setPhotoAsset(asset);
        setPhoto(asset.uri);
      }
    } catch (err) {
      console.warn('Image picker error:', err);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      showToast({ type: 'error', message: 'Please enter your full name' });
      return;
    }
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append('name', name.trim());
      if (gender) {
        formData.append('gender', gender.trim().toUpperCase());
      }
      const apiDob = convertDobToApi(dob.trim());
      if (apiDob) {
        formData.append('dob', apiDob);
      }
      if (email && email.trim()) {
        formData.append('email', email.trim());
      }

      if (photoAsset?.uri) {
        const fileUri =
          Platform.OS === 'android'
            ? photoAsset.uri
            : photoAsset.uri.replace('file://', '');
        const fileObj = {
          uri: fileUri,
          type: photoAsset.type || 'image/jpeg',
          name: photoAsset.fileName || `profilePhoto_${Date.now()}.jpg`,
        };
        formData.append('profilePhoto', fileObj);
      }

      const updatedPhoto = photoAsset?.uri || photo || currentUser?.photo || '';
      let updatedUser = {
        ...currentUser,
        name: name.trim(),
        fullName: name.trim(),
        dob: apiDob || currentUser?.dob || '',
        gender: gender ? gender.trim().toUpperCase() : currentUser?.gender || '',
        email: email ? email.trim() : currentUser?.email || '',
        photo: updatedPhoto,
        profilePhoto: updatedPhoto,
        avatar: updatedPhoto,
        phone: phone || currentUser?.phone || '',
        mobile: phone || currentUser?.mobile || '',
      };

      try {
        const res = isDriver
          ? await updateDriverProfileApi(formData)
          : await updatePassengerProfileApi(formData);
        const profile = extractUserProfile(res, phone);
        if (profile?.name) updatedUser.name = profile.name;
        if (profile?.dob) updatedUser.dob = profile.dob;
        if (profile?.gender) updatedUser.gender = profile.gender;
        if (profile?.email) updatedUser.email = profile.email;
        if (profile?.photo) {
          updatedUser.photo = profile.photo;
          updatedUser.profilePhoto = profile.photo;
          updatedUser.avatar = profile.photo;
        }
      } catch (apiErr) {
        console.warn('API profile update error, persisting local profile changes:', apiErr);
      }

      await storageSetItem(STORAGE_KEYS.user, updatedUser).catch(() => {});
      dispatch(setUser(updatedUser));

      try {
        if (isDriver) {
          await dispatch(fetchDriverProfile()).unwrap();
        } else {
          await dispatch(fetchPassengerProfile()).unwrap();
        }
      } catch (_) {}

      showToast({
        type: 'success',
        message: 'Personal details updated successfully',
      });
      navigation.goBack();
    } catch (err) {
      console.error('Failed to update profile:', err);
      showToast({
        type: 'error',
        message: err?.message || 'Failed to update details',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePhone = () => {
    showToast({ type: 'info', message: 'Phone number cannot be changed here' });
  };

  const handleVerifyEmail = () => {
    if (!email.trim()) {
      showToast({ type: 'error', message: 'Please enter a valid email' });
      return;
    }
    setEmailVerified(true);
    showToast({ type: 'success', message: 'Verification link sent to ' + email });
  };

  return (
    <View style={styles.root}>
      <StatusBar
        barStyle={colors.isDark ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      {/* Header */}
      <Header
        title="Personal details"
        showBack
        onBackPress={() => navigation.goBack()}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}>
        <ScrollView
          ref={scrollViewRef}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingBottom:
                Math.max(insets.bottom, 20) +
                (keyboardHeight > 0 ? keyboardHeight + 10 : 120),
            },
          ]}>
          {/* Avatar Section */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              {photo ? (
                <Image source={{ uri: photo }} style={styles.avatarImage} />
              ) : (
                <Feather
                  name="user"
                  size={42}
                  color={colors.textMuted}
                />
              )}
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.cameraBadge}
                onPress={handleChangePhoto}
                accessibilityRole="button"
                accessibilityLabel="Take photo">
                <Feather name="camera" size={14} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleChangePhoto}
              style={styles.changePhotoBtn}>
              <Text style={styles.changePhotoText}>Change photo</Text>
            </TouchableOpacity>
            <Text style={styles.changePhotoSub}>
              {isDriver
                ? 'Riders see your photo and full name'
                : 'Drivers see your photo and first name only'}
            </Text>
          </View>

          {/* Full Name */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Full name *</Text>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => nameInputRef.current?.focus()}
              style={[
                styles.inputBox,
                focusedInput === 'name' && styles.inputBoxFocused,
              ]}>
              <TextInput
                ref={nameInputRef}
                style={styles.inputText}
                value={name}
                onChangeText={setName}
                placeholder="Enter full name"
                placeholderTextColor={colors.textMuted}
                autoCapitalize="words"
                onFocus={() => setFocusedInput('name')}
                onBlur={() => setFocusedInput(null)}
              />
            </TouchableOpacity>
            <Text style={styles.helperText}>
              {isDriver
                ? 'Riders identify you by your name and photo'
                : 'Drivers greet you by your first name'}
            </Text>
          </View>

          {/* Gender Selection */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Gender</Text>
            <View style={styles.genderRow}>
              {['male', 'female', 'other'].map((g, idx) => {
                const isSelected = gender === g;
                const isLast = idx === 2;
                return (
                  <TouchableOpacity
                    key={g}
                    activeOpacity={0.7}
                    style={[
                      styles.genderChip,
                      isLast && styles.genderChipLast,
                      isSelected && styles.genderChipActive,
                    ]}
                    onPress={() => setGender(g)}>
                    <Text
                      style={[
                        styles.genderChipText,
                        isSelected && styles.genderChipTextActive,
                      ]}>
                      {g.charAt(0).toUpperCase() + g.slice(1)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Date of Birth */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Date of birth</Text>
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.inputBox}
              accessibilityRole="button"
              accessibilityLabel="Open date picker"
              onPress={() => setDobPickerVisible(true)}>
              <Feather
                name="calendar"
                size={18}
                color={colors.text}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.inputText, styles.margin10]}
                value={dob}
                placeholder="DD / MM / YYYY"
                placeholderTextColor={colors.textMuted}
                pointerEvents="none"
                editable={false}
              />
            </TouchableOpacity>
            <Text style={styles.helperText}>
              {isDriver
                ? 'Used for driver verification and age requirements'
                : 'Never shown to drivers — used for age-restricted offers'}
            </Text>
          </View>

          {/* Mobile Number */}
          <View style={styles.formGroup}>
            <View style={styles.verifiedCard}>
              <View style={styles.verifiedCardLeft}>
                <Text style={styles.verifiedCardLabel}>Mobile number</Text>
                <Text style={styles.verifiedCardValue}>
                  {phone ? (phone.startsWith('+') ? phone : `+91 ${phone}`) : '+91 98795 22140'}
                </Text>
                <View style={styles.verifiedStatusRow}>
                  <Feather name="check-circle" size={14} color="#10B981" />
                  <Text style={styles.verifiedStatusText}>
                    Verified · used to sign in
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleChangePhone}
                style={styles.chipButton}
                accessibilityRole="button"
                accessibilityLabel="Change phone number">
                <Text style={styles.chipButtonText}>Change</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Email */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Email</Text>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                emailInputRef.current?.focus();
                setTimeout(() => {
                  scrollViewRef.current?.scrollToEnd({ animated: true });
                }, 120);
              }}
              style={[
                styles.inputBox,
                focusedInput === 'email' && styles.inputBoxFocused,
              ]}>
              <TextInput
                ref={emailInputRef}
                style={styles.inputText}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor={colors.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                onFocus={() => {
                  setFocusedInput('email');
                  setTimeout(() => {
                    scrollViewRef.current?.scrollToEnd({ animated: true });
                  }, 120);
                }}
                onBlur={() => setFocusedInput(null)}
              />
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleVerifyEmail}
                style={styles.chipButton}
                accessibilityRole="button"
                accessibilityLabel="Verify email">
                <Text style={styles.chipButtonText}>
                  {emailVerified ? 'Verified' : 'Verify'}
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>
            <Text style={styles.helperText}>
              Add it to get receipts and GST invoices by email
            </Text>
          </View>

          {/* Security Banner */}
          <View style={styles.securityBanner}>
            <Feather
              name="lock"
              size={14}
              color={colors.textMuted}
            />
            <Text style={styles.securityText}>
              {isDriver
                ? 'Your verified profile details build trust and safety with riders.'
                : 'Only your first name, photo and rating reach drivers.'}
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Date Picker Modal */}
      <DatePickerModal
        visible={dobPickerVisible}
        onClose={() => setDobPickerVisible(false)}
        value={dob}
        initialDate={dob}
        onSelectDate={selectedDate => {
          if (selectedDate) {
            setDob(selectedDate);
          }
        }}
      />

      {/* Bottom Bar */}
      {keyboardHeight === 0 && (
        <View
          style={[
            styles.bottomBar,
            { paddingBottom: Math.max(insets.bottom, 12) + 8 },
          ]}>
          <Button
            title="Cancel"
            variant="outline"
            onPress={() => navigation.goBack()}
            fullWidth={false}
            style={styles.cancelButton}
            textStyle={styles.cancelButtonText}
          />

          <Button
            title="Save changes"
            onPress={handleSave}
            loading={isSaving}
            disabled={isSaving}
            fullWidth={false}
            style={styles.saveButton}
            textStyle={styles.saveButtonText}
          />
        </View>
      )}
    </View>
  );
}

