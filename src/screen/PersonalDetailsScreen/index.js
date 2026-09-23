import React, {useState} from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Feather} from '@react-native-vector-icons/feather/static';
import {useToast} from '../../components/Toast';
import useThemedStyles from '../../components/useThemedStyles';
import {useApp} from '../../context/AppContext';
import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import {setUser} from '../../redux/slices/authSlice';
import createStyles from './style';

export default function PersonalDetailsScreen({navigation}) {
  const insets = useSafeAreaInsets();
  const {colors} = useApp();
  const styles = useThemedStyles(createStyles);
  const {showToast} = useToast();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(state => state.auth.user);

  const [name, setName] = useState(
    currentUser?.name || currentUser?.fullName || 'Ananya Shah',
  );
  const [dob, setDob] = useState(currentUser?.dob || '08 Jun 1996');
  const [phone, setPhone] = useState(
    currentUser?.phone || currentUser?.mobile || '+91 98795 22140',
  );
  const [email, setEmail] = useState(
    currentUser?.email || 'ananya.shah@example.com',
  );
  const [photo, setPhoto] = useState(
    currentUser?.photo || currentUser?.profilePhoto || currentUser?.avatar || null,
  );
  const [emailVerified, setEmailVerified] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      showToast({type: 'error', message: 'Please enter your full name'});
      return;
    }
    setIsSaving(true);
    try {
      dispatch(
        setUser({
          name: name.trim(),
          dob: dob.trim(),
          email: email.trim(),
          phone: phone.trim(),
          photo: photo,
        }),
      );
      showToast({
        type: 'success',
        message: 'Personal details updated successfully',
      });
      navigation.goBack();
    } catch {
      showToast({type: 'error', message: 'Failed to update details'});
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePhoto = () => {
    showToast({type: 'info', message: 'Select photo from gallery or camera'});
  };

  const handleChangePhone = () => {
    showToast({type: 'info', message: 'Change phone number'});
  };

  const handleVerifyEmail = () => {
    if (!email.trim()) {
      showToast({type: 'error', message: 'Please enter a valid email'});
      return;
    }
    setEmailVerified(true);
    showToast({type: 'success', message: 'Verification link sent to ' + email});
  };

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={[styles.header, {paddingTop: Math.max(insets.top, 14)}]}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          accessibilityRole="button"
          accessibilityLabel="Go back">
          <Feather
            name="arrow-left"
            size={24}
            color={colors.navy?.[900] || '#0F1E36'}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Personal details</Text>
        <View style={styles.headerRightPlaceholder} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{flex: 1}}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            {paddingBottom: Math.max(insets.bottom, 20) + 90},
          ]}>
          {/* Avatar Section */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              {photo ? (
                <Image source={{uri: photo}} style={styles.avatarImage} />
              ) : (
                <Feather
                  name="user"
                  size={42}
                  color={colors.blue?.gray || '#8EA4BE'}
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
              Drivers see your photo and first name only
            </Text>
          </View>

          {/* Full Name */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Full name *</Text>
            <View style={styles.inputBox}>
              <TextInput
                style={styles.inputText}
                value={name}
                onChangeText={setName}
                placeholder="Enter full name"
                placeholderTextColor={colors.textMuted || '#94A3B8'}
                autoCapitalize="words"
              />
            </View>
            <Text style={styles.helperText}>
              Drivers greet you by your first name
            </Text>
          </View>

          {/* Date of Birth */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Date of birth *</Text>
            <View style={styles.inputBox}>
              <Feather
                name="calendar"
                size={18}
                color={colors.navy?.[900] || '#0F1E36'}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.inputText}
                value={dob}
                onChangeText={setDob}
                placeholder="DD MMM YYYY"
                placeholderTextColor={colors.textMuted || '#94A3B8'}
              />
            </View>
            <Text style={styles.helperText}>
              Never shown to drivers — used for age-restricted offers
            </Text>
          </View>

          {/* Mobile Number */}
          <View style={styles.formGroup}>
            <View style={styles.verifiedCard}>
              <View style={styles.verifiedCardLeft}>
                <Text style={styles.verifiedCardLabel}>Mobile number</Text>
                <Text style={styles.verifiedCardValue}>{phone}</Text>
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
            <View style={styles.inputBox}>
              <TextInput
                style={styles.inputText}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor={colors.textMuted || '#94A3B8'}
                keyboardType="email-address"
                autoCapitalize="none"
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
            </View>
            <Text style={styles.helperText}>
              Add it to get receipts and GST invoices by email
            </Text>
          </View>

          {/* Security Banner */}
          <View style={styles.securityBanner}>
            <Feather
              name="lock"
              size={14}
              color={colors.textMuted || '#64748B'}
            />
            <Text style={styles.securityText}>
              Only your first name, photo and rating reach drivers.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Bottom Bar */}
      <View
        style={[
          styles.bottomBar,
          {paddingBottom: Math.max(insets.bottom, 12) + 8},
        ]}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Cancel">
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.saveButton}
          onPress={handleSave}
          disabled={isSaving}
          accessibilityRole="button"
          accessibilityLabel="Save changes">
          <Text style={styles.saveButtonText}>
            {isSaving ? 'Saving...' : 'Save changes'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
