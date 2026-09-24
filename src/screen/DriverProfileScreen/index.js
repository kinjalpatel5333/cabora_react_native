import React, { useEffect } from 'react';
import {ScrollView, Text, View, TouchableOpacity, Image} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@react-native-vector-icons/ant-design/static';
import { Feather } from '@react-native-vector-icons/feather/static';
import { Lucide } from '@react-native-vector-icons/lucide/static';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons/static';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../components/Toast';
import useThemedStyles from '../../components/useThemedStyles';
import { useSidebar } from '../../context/SidebarContext';
import { useAppDispatch } from '../../redux/hooks';
import { useAuth } from '../../hooks/useAuth';
import { fetchDriverProfile } from '../../redux/slices/authSlice';
import createStyles from './style';
import colors from '../../config/color';

export default function DriverProfileScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { colors } = useApp();
  const styles = useThemedStyles(createStyles);
  const { openDrawer } = useSidebar();
  const { showToast } = useToast();
  const dispatch = useAppDispatch();
  const { user } = useAuth();

  useEffect(() => {
    dispatch(fetchDriverProfile());
  }, [dispatch]);

  const driverName = user?.name || user?.fullName || 'Rajesh Kumar';
  const driverMobile = user?.mobile || user?.phone || '+91 98450 21188';
  const driverEmail = user?.email || 'rajesh.k@gmail.com';
  const driverPhoto = user?.photo || user?.profilePhoto || null;
  const driverInitials = (driverName.trim().split(/\s+/).map(p => p[0]).join('') || 'RK').slice(0, 2).toUpperCase();

  const handleEditProfile = () => {
    const parent = navigation.getParent();
    if (parent) {
      parent.navigate('PersonalDetails');
      return;
    }
    navigation.navigate('PersonalDetails');
  };

  const handleVehicleChange = () => {
    showToast({
      title: 'Vehicle Change Request',
      message: 'Upload new RC and commercial insurance to proceed.',
      type: 'warning',
    });
  };

  const handleDocuments = () => {
    const parent = navigation.getParent();
    if (parent) {
      parent.navigate('UploadDocuments');
      return;
    }
    navigation.navigate('UploadDocuments');
  };

  const handleAction = title => {
    showToast({
      title: title,
      message: `${title} details opening...`,
      type: 'info',
    });
  };

  return (
    <View style={styles.root}>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 110 },
        ]}
        showsVerticalScrollIndicator={false}>
        {/* Navy Hero Header */}
        <View
          style={[
            styles.navyHero,
            { paddingTop: insets.top > 0 ? insets.top : 12 },
          ]}>
          <View style={styles.heroDeco} />

          <TouchableOpacity activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Open menu"
            onPress={openDrawer}
            style={styles.menuBtn}>
            <Feather name="menu" size={20} color={colors.white} />
          </TouchableOpacity>

          <View style={styles.profileRow}>
            <View style={styles.avatarCircle}>
              {driverPhoto ? (
                <Image source={{ uri: driverPhoto }} style={{ width: 56, height: 56, borderRadius: 28 }} />
              ) : (
                <Text style={styles.avatarText}>{driverInitials}</Text>
              )}
            </View>

            <View style={styles.profileInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.nameText}>{driverName}</Text>
                <MaterialDesignIcons
                  name="check-decagram"
                  size={18}
                  color={colors.green[550]}
                />
              </View>
              <Text style={styles.statsText}>
                {user?.rating ? `${user.rating} ★` : '4.92 ★'} · {user?.totalTrips ? `${user.totalTrips} trips` : '2,140 trips'} · driving active
              </Text>
              <Text style={styles.contactText}>
                {driverMobile} · {driverEmail}
              </Text>
            </View>

            <TouchableOpacity activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Edit profile"
              onPress={handleEditProfile}
              style={styles.editBtn}>
              <Feather name="edit-2" size={16} color={colors.white} />
            </TouchableOpacity>
          </View>

          <View style={styles.kycBanner}>
            <AntDesign name="check-circle" size={14} color={colors.green[350] || colors.green[400]} />
            <Text style={styles.kycText}>
              KYC approved · 1 document expiring soon
            </Text>
          </View>
        </View>

        {/* VEHICLE Section */}
        <Text style={styles.sectionTitle}>VEHICLE</Text>
        <View style={styles.card}>
          <View style={styles.vehicleHead}>
            <View style={styles.vehicleLeft}>
              <View style={styles.vehicleIconBox}>
                <MaterialDesignIcons
                  name="car-hatchback"
                  size={24}
                  color={colors.text}
                />
              </View>
              <View>
                <Text style={styles.vehicleTitle}>Swift Dzire</Text>
                <Text style={styles.vehicleSub}>Sedan · 2022</Text>
              </View>
            </View>
            <View style={styles.platePill}>
              <Text style={styles.plateText}>KA 05 MJ 4821</Text>
            </View>
          </View>

          <View style={styles.warnBox}>
            <Feather name="alert-triangle" size={16} color={colors.amber[600]} />
            <Text style={styles.warnText}>
              Changing the vehicle or plate sends your account back to
              verification. You'll stay offline for up to 24 hours.
            </Text>
          </View>

          <TouchableOpacity activeOpacity={0.7}
            accessibilityRole="button"
            onPress={handleVehicleChange}
            style={styles.vehicleActionBtn}>
            <Text style={styles.vehicleActionText}>
              Request a vehicle change
            </Text>
          </TouchableOpacity>
        </View>

        {/* DOCUMENTS & COMPLIANCE Section */}
        <Text style={styles.sectionTitle}>DOCUMENTS & COMPLIANCE</Text>
        <View style={styles.listCard}>
          <TouchableOpacity activeOpacity={0.7}
            accessibilityRole="button"
            onPress={handleDocuments}
            style={[styles.listItem, styles.listBorder]}>
            <View style={styles.listLeft}>
              <View style={styles.listIconBox}>
                <Lucide name="file-text" size={18} color={colors.text} />
              </View>
              <View style={styles.listInfo}>
                <Text style={styles.listTitle}>Documents</Text>
                <Text style={styles.listSub}>
                  1 expiring in 7 days · 1 expired
                </Text>
              </View>
            </View>
            <Feather name="chevron-right" size={18} color={colors.slate[400]} />
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.7}
            accessibilityRole="button"
            onPress={() => handleAction('Police verification')}
            style={styles.listItem}>
            <View style={styles.listLeft}>
              <View style={styles.listIconBox}>
                <Lucide name="shield-check" size={18} color={colors.text} />
              </View>
              <View style={styles.listInfo}>
                <Text style={styles.listTitle}>Police verification</Text>
                <Text style={styles.listSub}>
                  Submitted 9 Sep · in review
                </Text>
              </View>
            </View>
            <Feather name="chevron-right" size={18} color={colors.slate[400]} />
          </TouchableOpacity>
        </View>

        {/* PAYOUTS & ACCOUNT Section */}
        <Text style={styles.sectionTitle}>PAYOUTS & ACCOUNT</Text>
        <View style={styles.listCard}>
          <TouchableOpacity activeOpacity={0.7}
            accessibilityRole="button"
            onPress={() => handleAction('App settings')}
            style={[styles.listItem, styles.listBorder]}>
            <View style={styles.listLeft}>
              <View style={styles.listIconBox}>
                <Feather name="settings" size={18} color={colors.text} />
              </View>
              <View style={styles.listInfo}>
                <Text style={styles.listTitle}>App settings</Text>
                <Text style={styles.listSub}>
                  Navigation, audio, language
                </Text>
              </View>
            </View>
            <Feather name="chevron-right" size={18} color={colors.slate[400]} />
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.7}
            accessibilityRole="button"
            onPress={() => handleAction('Help & Support')}
            style={styles.listItem}>
            <View style={styles.listLeft}>
              <View style={styles.listIconBox}>
                <Feather name="help-circle" size={18} color={colors.text} />
              </View>
              <View style={styles.listInfo}>
                <Text style={styles.listTitle}>Help & Support</Text>
                <Text style={styles.listSub}>24/7 Driver priority support</Text>
              </View>
            </View>
            <Feather name="chevron-right" size={18} color={colors.slate[400]} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
