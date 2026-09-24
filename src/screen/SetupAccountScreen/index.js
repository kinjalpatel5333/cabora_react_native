import { PASSENGER_SETUP_ACCOUNT_ROLES, SETUP_ACCOUNT_STRINGS } from '../../config/staticData';
import React, { useMemo, useState } from 'react';
import { Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { AntDesign } from '@react-native-vector-icons/ant-design/static';
import { Feather } from '@react-native-vector-icons/feather/static';
import { Lucide } from '@react-native-vector-icons/lucide/static';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons/static';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../components';
import useThemedStyles from '../../components/useThemedStyles';
import { useApp } from '../../context/AppContext';
import { getMeApi, selectRoleApi, setAuthToken } from '../../config';
import { useAppDispatch } from '../../redux/hooks';
import { loginWithPhone } from '../../redux/slices/authSlice';
import { extractUserProfile } from '../../utils/user';
import createStyles from './style';


const SUPPORT_URL = SETUP_ACCOUNT_STRINGS.SUPPORT_URL;

const ROLES = PASSENGER_SETUP_ACCOUNT_ROLES;

function RoleIcon({ id, selected, colors }) {
  const color = selected ? colors.orange[500] : colors.navy[800];
  if (id === 'driver') {
    return (
      <MaterialDesignIcons name="car-hatchback" size={22} color={color} />
    );
  }
  return <Lucide name="user-round" size={20} color={color} />;
}

function HintIcon({ tone, colors }) {
  if (tone === 'success') {
    return <AntDesign name="check-circle" size={14} color={colors.green[600]} />;
  }
  if (tone === 'warning') {
    return (
      <AntDesign name="exclamation-circle" size={14} color={colors.amber[600]} />
    );
  }
  return <AntDesign name="info-circle" size={14} color={colors.blue[600]} />;
}

export default function SetupAccountScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const { colors } = useApp();
  const styles = useThemedStyles(createStyles);
  const phone = route?.params?.mobile || '';
  const userId = route?.params?.userId || route?.params?.user?.id || '';
  const dispatch = useAppDispatch();
  const [selected, setSelected] = useState('passenger');
  const [loading, setLoading] = useState(false);

  const picked = useMemo(
    () => ROLES.find(role => role.id === selected) || ROLES[0],
    [selected],
  );

  const onContinue = async () => {
    setLoading(true);
    const roleEnum = selected === 'driver' ? 'DRIVER' : 'PASSENGER';
    let rawUserData = route?.params?.user || null;

    let activeToken = route?.params?.token || null;

    try {
      if (userId) {
        const response = await selectRoleApi({
          userId,
          role: roleEnum,
        });

        const token =
          response?.data?.accessToken ||
          response?.data?.token ||
          response?.accessToken ||
          response?.token;

        if (token) {
          activeToken = token;
          setAuthToken(token);
        }

        // Call /auth/me to fetch fresh user profile & role state
        const meRes = await getMeApi();
        rawUserData = meRes || rawUserData;
      }
    } catch (err) {
      console.warn('selectRoleApi or getMeApi error:', err);
    }

    const profile = extractUserProfile(rawUserData, phone);

    const isOnBoarding =
      route?.params?.isOnBoarding ??
      rawUserData?.isOnBoarding ??
      rawUserData?.data?.isOnBoarding;

    if (selected === 'driver') {
      try {
        await dispatch(
          loginWithPhone({
            phone: profile.mobile || phone,
            role: selected,
            name: profile.name,
            email: profile.email,
            dob: profile.dob,
            photo: profile.photo,
            gender: profile.gender,
            token: activeToken,
          }),
        ).unwrap();
      } catch (err) {
        console.warn('loginWithPhone driver error:', err);
      } finally {
        setLoading(false);
      }

      // If isOnBoarding === true (or not completed), redirect to Driver Registration Flow
      setLoading(false);
      navigation.navigate('DriverRegistration', {
        mobile: phone,
        userId,
        user: profile,
      });
      return;
    }

    setLoading(false);
    navigation.navigate('LocationPermission', {
      mobile: phone,
      role: selected,
      userId,
      user: profile,
      token: activeToken,
    });
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top + 8 }]}>
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.7}
          accessibilityRole="button"
          onPress={() => navigation.goBack()}
          style={styles.headerBtn}>
          <Feather name="arrow-left" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{SETUP_ACCOUNT_STRINGS.HEADER_TITLE}</Text>
        <TouchableOpacity
          activeOpacity={0.7}
          accessibilityRole="button"
          onPress={() => Linking.openURL(SUPPORT_URL)}
          style={styles.headerBtn}>
          <Feather name="help-circle" size={22} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{SETUP_ACCOUNT_STRINGS.TITLE}</Text>
        <Text style={styles.subtitle}>
          {SETUP_ACCOUNT_STRINGS.SUBTITLE}
        </Text>

        {ROLES.map(role => {
          const isSelected = role.id === selected;
          return (
            <TouchableOpacity
              key={role.id}
              activeOpacity={0.8}
              onPress={() => setSelected(role.id)}
              style={[styles.card, isSelected && styles.cardSelected]}>
              <View style={styles.cardTop}>
                <View style={[styles.iconWrap, isSelected && styles.iconSelected]}>
                  <RoleIcon
                    id={role.id}
                    selected={isSelected}
                    colors={colors}
                  />
                </View>
                <View style={styles.copy}>
                  <Text style={styles.cardTitle}>{role.title}</Text>
                  <Text style={styles.cardBody}>{role.body}</Text>
                </View>
                <View style={[styles.radio, isSelected && styles.radioOn]} />
              </View>
              <View
                style={[styles.divider, isSelected && styles.dividerSelected]}
              />
              <View style={styles.hint}>
                <HintIcon tone={role.tone} colors={colors} />
                <Text
                  style={[
                    styles.hintText,
                    isSelected && styles.hintSuccess,
                  ]}>
                  {role.hint}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}

        <View style={styles.note}>
          <MaterialDesignIcons name="shield-check-outline" size={18} color={colors.navy[700]} />
          <Text style={styles.noteText}>
            {SETUP_ACCOUNT_STRINGS.DRIVER_NOTE}
          </Text>
        </View>
      </ScrollView>

      <View
        style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 8) }]}>
        <View>
          <Text style={styles.pickedLabel}>{SETUP_ACCOUNT_STRINGS.PICKED_LABEL}</Text>
          <Text style={styles.pickedValue}>{picked.label}</Text>
        </View>
        <Button
          title={SETUP_ACCOUNT_STRINGS.CONTINUE_BTN}
          onPress={onContinue}
          loading={loading}
          fullWidth={false}
        // style={styles.continue}
        />
      </View>
    </View>
  );
}
