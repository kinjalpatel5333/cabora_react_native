import React, {useCallback, useEffect, useRef, useState} from 'react';
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
import {useFocusEffect} from '@react-navigation/native';
import {AntDesign} from '@react-native-vector-icons/ant-design/static';
import {Feather} from '@react-native-vector-icons/feather/static';
import {launchImageLibrary} from 'react-native-image-picker';
import {
  requestGalleryPermission,
  showPermissionSettingsAlert,
} from '../../utils/cameraPermission';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Button, DatePickerInput, DatePickerModal} from '../../components';
import {useToast} from '../../components/Toast';
import useThemedStyles from '../../components/useThemedStyles';
import {useApp} from '../../context/AppContext';
import {getMeApi, updatePassengerProfileApi} from '../../config';
import {updateDriverProfileApi} from '../../services/driverApi';
import {useAppDispatch} from '../../redux/hooks';
import {useAuth} from '../../hooks/useAuth';
import {loginWithPhone} from '../../redux/slices/authSlice';
import {extractUserProfile} from '../../utils/user';
import createStyles from './style';
import {storageSetItem} from '../../utils/storage';
import {STORAGE_KEYS} from '../../config/setting';

function convertDobToApi(dobString) {
  if (!dobString) {
    return '';
  }
  const cleaned = dobString.replace(/\s+/g, '');
  const parts = cleaned.split('/');
  if (
    parts.length === 3 &&
    parts[0].length === 2 &&
    parts[1].length === 2 &&
    parts[2].length === 4
  ) {
    const [day, month, year] = parts;
    return `${year}-${month}-${day}`;
  }
  return dobString;
}

function convertDobToUi(dobString) {
  if (!dobString) {
    return '';
  }
  if (dobString.includes('-')) {
    const parts = dobString.split('T')[0].split('-');
    if (parts.length === 3) {
      const [year, month, day] = parts;
      return `${day} / ${month} / ${year}`;
    }
  }
  return dobString;
}

export default function CompleteProfileScreen({navigation, route}) {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);
  const {colors: themeColors} = useApp();
  const dispatch = useAppDispatch();
  const { user: authUser } = useAuth();
  const {showToast} = useToast();

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle?.(themeColors.isDark ? 'light-content' : 'dark-content');
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor?.('transparent');
        StatusBar.setTranslucent?.(true);
      }
    }, [themeColors.isDark]),
  );

  const userSource = route?.params?.user || authUser;
  const initialProfile = extractUserProfile(
    userSource,
    route?.params?.mobile || authUser?.phone || authUser?.mobile,
  );

  const [phone, setPhone] = useState(
    initialProfile.mobile ||
      route?.params?.mobile ||
      authUser?.phone ||
      authUser?.mobile ||
      '9879522140',
  );
  const role =
    route?.params?.role ||
    initialProfile.role ||
    authUser?.role ||
    'passenger';

  const [photoUri, setPhotoUri] = useState(initialProfile.photo || null);
  const [photoAsset, setPhotoAsset] = useState(null);
  const [fullName, setFullName] = useState(initialProfile.name || '');
  const [dob, setDob] = useState(
    initialProfile.dob ? convertDobToUi(initialProfile.dob) : '',
  );
  const [dobPickerVisible, setDobPickerVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [focusedField, setFocusedField] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const scrollViewRef = useRef(null);

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
    if (keyboardHeight > 0 && focusedField === 'email') {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd?.({ animated: true });
      }, 100);
    }
  }, [keyboardHeight, focusedField]);

  // Fetch initial profile info from /api/v1/auth/me on mount if not provided
  useEffect(() => {
    let isMounted = true;
    async function fetchMe() {
      try {
        const res = await getMeApi();
        const profile = extractUserProfile(res, phone);

        if (isMounted && profile) {
          if (profile.name) {
            setFullName(profile.name);
          }
          if (profile.dob) {
            setDob(convertDobToUi(profile.dob));
          }
          if (profile.photo) {
            setPhotoUri(profile.photo);
          }
          if (profile.mobile) {
            setPhone(profile.mobile);
          }
        }
      } catch (err) {
        console.warn('Failed to load user details in CompleteProfile:', err);
      }
    }
    fetchMe();
    return () => {
      isMounted = false;
    };
  }, [phone]);

  const formattedPhone = phone
    ? `+91 ${phone.slice(0, 5)} ${phone.slice(5)} · already verified`
    : '+91 98795 22140 · already verified';

  const onPickPhoto = async () => {
    try {
      const hasPermission = await requestGalleryPermission();
      if (!hasPermission) {
        return;
      }
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
        maxWidth: 800,
        maxHeight: 800,
      });

      if (result.didCancel) {
        return;
      }

      if (result.errorCode) {
        showPermissionSettingsAlert(
          'Photo Access Required',
          'Photo access is turned off. Please allow photo access in Settings to select a profile photo.',
        );
        return;
      }

      if (result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setPhotoAsset(asset);
        setPhotoUri(asset.uri);
      }
    } catch (err) {
      console.warn('Image picker error:', err);
    }
  };

  const onStartRiding = async () => {
    const newErrors = {};

    if (!fullName || !fullName.trim()) {
      newErrors.fullName = 'Please enter your full name';
    }

    if (!dob || !dob.trim()) {
      newErrors.dob = 'Please select your date of birth';
    }

    if (!email || !email.trim()) {
      newErrors.email = 'Please enter your email address';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);
    try {
      // Build FormData for multipart/form-data PUT /api/v1/passenger/profile
      const formData = new FormData();
      formData.append('name', fullName.trim());

      const apiDob = convertDobToApi(dob.trim());
      if (apiDob) {
        formData.append('dob', apiDob);
      }
      if (email.trim()) {
        formData.append('email', email.trim());
      }

      if (photoAsset?.uri) {
        const fileUri =
          Platform.OS === 'ios'
            ? photoAsset.uri.replace('file://', '')
            : photoAsset.uri;
        formData.append('profilePhoto', {
          uri: fileUri,
          type: photoAsset.type || 'image/jpeg',
          name: photoAsset.fileName || `photo_${Date.now()}.jpg`,
        });
      }

      // Call live Profile update API based on role
      let updatedUser = null;
      try {
        const isDriver = (role || '').toLowerCase() === 'driver';
        const res = isDriver
          ? await updateDriverProfileApi(formData)
          : await updatePassengerProfileApi(formData);
        updatedUser =
          res?.data?.user ||
          res?.user ||
          res?.data?.passenger ||
          res?.passenger ||
          res?.data?.driver ||
          res?.driver ||
          res?.data;
      } catch (apiErr) {
        console.warn('updateProfileApi error:', apiErr);
      }

      const finalName =
        updatedUser?.name || updatedUser?.fullName || fullName.trim();
      const finalEmail =
        updatedUser?.email || email.trim();
      const finalDob = updatedUser?.dob || apiDob || dob.trim();
      const finalPhoto =
        updatedUser?.profilePhoto ||
        updatedUser?.photo ||
        photoAsset?.uri ||
        photoUri ||
        '';

      const userObject = {
        ...(updatedUser || {}),
        name: finalName,
        fullName: finalName,
        email: finalEmail,
        dob: finalDob,
        photo: finalPhoto,
        profilePhoto: finalPhoto,
        avatar: finalPhoto,
        gender: updatedUser?.gender || '',
        mobile: phone,
        phone: phone,
        role,
      };

      await storageSetItem(STORAGE_KEYS.user, JSON.stringify(userObject)).catch(() => {});

      // Complete session state in Redux
      await dispatch(
        loginWithPhone({
          phone: updatedUser?.mobile || updatedUser?.phone || phone,
          role,
          name: finalName,
          email: finalEmail,
          dob: finalDob,
          photo: finalPhoto,
          gender: updatedUser?.gender || '',
          token: route?.params?.token,
          user: {
            ...userObject,
            isOnBoarding: false,
            profileCompleted: true,
            isProfileComplete: true,
          },
          isOnBoarding: false,
        }),
      ).unwrap();

      if (navigation?.canGoBack() && navigation.getState()?.routes?.length > 1) {
        navigation.goBack();
      } else if (navigation?.replace) {
        navigation.replace('MainTabs');
      } else if (navigation?.navigate) {
        navigation.navigate('MainTabs');
      }
    } catch (err) {
      console.warn('Profile completion failed:', err);
      showToast({
        type: 'error',
        message: 'Failed to complete profile. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.root, {paddingTop: insets.top}]}>
      <StatusBar
        barStyle={themeColors.isDark ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Complete your profile</Text>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top : 0}>
        <ScrollView
          ref={scrollViewRef}
          bounces={false}
          alwaysBounceVertical={false}
          overScrollMode="never"
          contentContainerStyle={[
            styles.scroll,
            {
              paddingBottom:
                Math.max(insets.bottom, 20) +
                (keyboardHeight > 0 ? keyboardHeight + 60 : 100),
            },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <Text style={styles.overline}>LAST STEP</Text>
            <Text style={styles.title}>Tell us who you are</Text>
            <Text style={styles.subtitle}>
              Drivers see only your first name, photo and rating. Everything
              else stays private.
            </Text>
          </View>

          {/* Photo Section */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPickPhoto}
            style={styles.avatarSection}>
            <View style={styles.avatarWrapper}>
              {photoUri ? (
                <Image source={{uri: photoUri}} style={styles.avatarImage} />
              ) : (
                <Feather name="user" size={44} color={themeColors.textMuted} />
              )}
              <View style={styles.cameraBadge}>
                <Feather name="camera" size={15} color={themeColors.white} />
              </View>
            </View>
            <Text style={styles.addPhotoText}>Add a photo</Text>
            <Text style={styles.photoHintText}>
              Optional — helps your driver spot you
            </Text>
          </TouchableOpacity>

          {/* Form Fields */}
          <View style={styles.form}>
            {/* Full name */}
            <View style={styles.fieldGroup}>
              <Text style={[styles.label, errors.fullName && styles.labelError]}>
                Full name <Text style={styles.requiredStar}>*</Text>
              </Text>
              <TextInput
                value={fullName}
                onChangeText={text => {
                  setFullName(text);
                  if (errors.fullName) {
                    setErrors(prev => ({...prev, fullName: null}));
                  }
                }}
                placeholder="Ananya Shah"
                placeholderTextColor={themeColors.textMuted}
                style={[
                  styles.input,
                  focusedField === 'fullName' && styles.inputFocused,
                  errors.fullName && styles.inputError,
                ]}
                onFocus={() => setFocusedField('fullName')}
                onBlur={() => setFocusedField(null)}
                autoCapitalize="words"
              />
              {errors.fullName ? (
                <Text style={styles.errorText}>{errors.fullName}</Text>
              ) : (
                <Text style={styles.caption}>
                  Your first name is what drivers see
                </Text>
              )}
            </View>

            {/* Date of birth */}
            <View style={styles.fieldGroup}>
              <DatePickerInput
                label="Date of birth *"
                value={dob}
                placeholder="DD / MM / YYYY"
                error={errors.dob}
                onPress={() => setDobPickerVisible(true)}
                hint={errors.dob ? undefined : "Never shown to drivers — used for age-restricted offers"}
              />
            </View>

            {/* Email */}
            <View style={styles.fieldGroup}>
              <Text style={[styles.label, errors.email && styles.labelError]}>
                Email <Text style={styles.requiredStar}>*</Text>
              </Text>
              <TextInput
                value={email}
                onChangeText={text => {
                  setEmail(text);
                  if (errors.email) {
                    setErrors(prev => ({...prev, email: null}));
                  }
                }}
                placeholder="name@example.com"
                placeholderTextColor={themeColors.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="done"
                style={[
                  styles.input,
                  focusedField === 'email' && styles.inputFocused,
                  errors.email && styles.inputError,
                ]}
                onFocus={() => {
                  setFocusedField('email');
                  setTimeout(() => {
                    scrollViewRef.current?.scrollToEnd?.({ animated: true });
                  }, 120);
                }}
                onBlur={() => setFocusedField(null)}
              />
              {errors.email ? (
                <Text style={styles.errorText}>{errors.email}</Text>
              ) : null}
            </View>

            {/* Verified Phone Badge */}
            <View style={styles.verifiedPhoneBox}>
              <View style={styles.verifiedIconWrap}>
                <AntDesign name="check-circle" size={16} color={themeColors.green[600]} />
              </View>
              <Text style={styles.verifiedPhoneText}>{formattedPhone}</Text>
            </View>
          </View>
        </ScrollView>

        {/* Footer with CTA Button */}
        {keyboardHeight === 0 && (
          <View
            style={[
              styles.footer,
              {paddingBottom: Math.max(insets.bottom, 16) + 6},
            ]}>
            <Button
              title="Start riding"
              onPress={onStartRiding}
              loading={loading}
              disabled={loading}
              style={styles.startBtn}
              textStyle={styles.startBtnText}
            />
          </View>
        )}
      </KeyboardAvoidingView>

      <DatePickerModal
        visible={dobPickerVisible}
        onClose={() => setDobPickerVisible(false)}
        onSelectDate={dateStr => {
          setDob(dateStr);
          if (errors.dob) {
            setErrors(prev => ({...prev, dob: null}));
          }
        }}
        value={dob}
        title="Select Date of Birth"
      />
    </View>
  );
}
