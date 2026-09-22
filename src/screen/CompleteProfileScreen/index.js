import React, {useEffect, useState} from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from 'react-native';
import {AntDesign} from '@react-native-vector-icons/ant-design/static';
import {Feather} from '@react-native-vector-icons/feather/static';
import {launchImageLibrary} from 'react-native-image-picker';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import useThemedStyles from '../../components/useThemedStyles';
import {getMeApi, updatePassengerProfileApi} from '../../config';
import {useAppDispatch} from '../../redux/hooks';
import {loginWithPhone} from '../../redux/slices/authSlice';
import createStyles from './style';
import colors from '../../config/color';


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
  const dispatch = useAppDispatch();

  const [phone, setPhone] = useState(route?.params?.mobile || '9879522140');
  const role = route?.params?.role || 'passenger';

  const [photoUri, setPhotoUri] = useState(null);
  const [photoAsset, setPhotoAsset] = useState(null);
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [focusedField, setFocusedField] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch initial profile info from /api/v1/auth/me on mount
  useEffect(() => {
    let isMounted = true;
    async function fetchMe() {
      try {
        const res = await getMeApi();
        const user =
          res?.data?.user ||
          res?.user ||
          res?.data?.passenger ||
          res?.passenger ||
          res?.data;

        if (isMounted && user) {
          if (user.name || user.fullName) {
            setFullName(user.name || user.fullName);
          }
          if (user.email) {
            setEmail(user.email);
          }
          if (user.gender) {
            setGender(user.gender);
          }
          if (user.dob) {
            setDob(convertDobToUi(user.dob));
          }
          if (user.profilePhoto || user.photo || user.avatar) {
            setPhotoUri(user.profilePhoto || user.photo || user.avatar);
          }
          if (user.mobile || user.phone) {
            setPhone(user.mobile || user.phone);
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
  }, []);

  const formattedPhone = phone
    ? `+91 ${phone.slice(0, 5)} ${phone.slice(5)} · already verified`
    : '+91 98795 22140 · already verified';

  const onPickPhoto = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
        selectionLimit: 1,
      });

      if (result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setPhotoAsset(asset);
        setPhotoUri(asset.uri);
      }
    } catch (err) {
      console.warn('Image picker error:', err);
    }
  };

  const onChangeDob = text => {
    setDob(formatDob(text));
  };

  const onStartRiding = async () => {
    if (!fullName.trim()) {
      Alert.alert(
        'Full name required',
        'Please enter your full name to complete your profile.',
      );
      return;
    }

    setLoading(true);
    try {
      // Build FormData for multipart/form-data PUT /api/v1/passenger/profile
      const formData = new FormData();
      formData.append('name', fullName.trim());
      formData.append('gender', gender || '');

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

      // Call live Passenger profile update API
      let updatedUser = null;
      try {
        const res = await updatePassengerProfileApi(formData);
        updatedUser =
          res?.data?.user ||
          res?.user ||
          res?.data?.passenger ||
          res?.passenger ||
          res?.data;
      } catch (apiErr) {
        console.warn('updatePassengerProfileApi error:', apiErr);
      }

      const finalName =
        updatedUser?.name || updatedUser?.fullName || fullName.trim();
      const finalEmail =
        updatedUser?.email || email.trim() || `${phone}@cabora.local`;
      const finalDob = updatedUser?.dob || dob.trim() || undefined;
      const finalPhoto =
        updatedUser?.profilePhoto ||
        updatedUser?.photo ||
        photoUri ||
        undefined;

      // Complete session state in Redux
      await dispatch(
        loginWithPhone({
          phone: updatedUser?.mobile || updatedUser?.phone || phone,
          role,
          name: finalName,
          email: finalEmail,
          dob: finalDob,
          photo: finalPhoto,
          gender: updatedUser?.gender || gender || '',
        }),
      ).unwrap();
    } catch (err) {
      console.warn('Profile completion failed:', err);
      Alert.alert('Error', 'Failed to complete profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.root, {paddingTop: insets.top}]}>
      <StatusBar barStyle="dark-content" backgroundColor=colors.white />

      {/* Header */}
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          onPress={() => navigation.goBack()}
          style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color=colors.navy[925] />
        </Pressable>
        <Text style={styles.headerTitle}>Complete your profile</Text>
      </View>

      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.scroll}
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
          <Pressable onPress={onPickPhoto} style={styles.avatarSection}>
            <View style={styles.avatarWrapper}>
              {photoUri ? (
                <Image source={{uri: photoUri}} style={styles.avatarImage} />
              ) : (
                <Feather name="user" size={44} color=colors.slate[400] />
              )}
              <View style={styles.cameraBadge}>
                <Feather name="camera" size={15} color=colors.white />
              </View>
            </View>
            <Text style={styles.addPhotoText}>Add a photo</Text>
            <Text style={styles.photoHintText}>
              Optional — helps your driver spot you
            </Text>
          </Pressable>

          {/* Form Fields */}
          <View style={styles.form}>
            {/* Full name */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>
                Full name <Text style={styles.requiredStar}>*</Text>
              </Text>
              <TextInput
                value={fullName}
                onChangeText={setFullName}
                placeholder="Ananya Shah"
                placeholderTextColor=colors.slate[400]
                style={[
                  styles.input,
                  focusedField === 'fullName' && styles.inputFocused,
                ]}
                onFocus={() => setFocusedField('fullName')}
                onBlur={() => setFocusedField(null)}
                autoCapitalize="words"
              />
              <Text style={styles.caption}>
                Your first name is what drivers see
              </Text>
            </View>

            {/* Date of birth */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>
                Date of birth <Text style={styles.requiredStar}>*</Text>
              </Text>
              <View
                style={[
                  styles.inputIconWrapper,
                  focusedField === 'dob' && styles.inputFocused,
                ]}>
                <Feather
                  name="calendar"
                  size={18}
                  color=colors.navy[925]
                  style={{marginRight: 10}}
                />
                <TextInput
                  value={dob}
                  onChangeText={onChangeDob}
                  placeholder="DD / MM / YYYY"
                  placeholderTextColor=colors.slate[400]
                  keyboardType="numeric"
                  maxLength={14}
                  style={styles.inputWithIcon}
                  onFocus={() => setFocusedField('dob')}
                  onBlur={() => setFocusedField(null)}
                />
              </View>
              <Text style={styles.caption}>
                Never shown to drivers — used for age-restricted offers
              </Text>
            </View>

            {/* Email */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="name@example.com"
                placeholderTextColor=colors.slate[400]
                keyboardType="email-address"
                autoCapitalize="none"
                style={[
                  styles.input,
                  focusedField === 'email' && styles.inputFocused,
                ]}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
              />
            </View>

            {/* Verified Phone Badge */}
            <View style={styles.verifiedPhoneBox}>
              <View style={styles.verifiedIconWrap}>
                <AntDesign name="check-circle" size={16} color=colors.green[600] />
              </View>
              <Text style={styles.verifiedPhoneText}>{formattedPhone}</Text>
            </View>
          </View>
        </ScrollView>

        {/* Footer with CTA Button */}
        <View
          style={[
            styles.footer,
            {paddingBottom: Math.max(insets.bottom, 16) + 6},
          ]}>
          <Pressable
            accessibilityRole="button"
            onPress={onStartRiding}
            disabled={loading}
            style={({pressed}) => [
              styles.startBtn,
              pressed && {opacity: 0.9, transform: [{scale: 0.99}]},
            ]}>
            <Text style={styles.startBtnText}>
              {loading ? 'Starting...' : 'Start riding'}
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
