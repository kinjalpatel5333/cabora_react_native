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
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { useAuth } from '../../hooks/useAuth';
import { fetchDriverProfile } from '../../redux/slices/authSlice';
import { fetchDriverKycStatus } from '../../redux/slices/driverSlice';
import { images } from '../../assets';
import { formatImageUrl } from '../../utils/user';
import createStyles from './style';

export default function DriverProfileScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { colors } = useApp();
  const styles = useThemedStyles(createStyles);
  const { openDrawer } = useSidebar();
  const { showToast } = useToast();
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const kycData = useAppSelector(state => state.driver.kycData);

  useEffect(() => {
    dispatch(fetchDriverProfile());
    dispatch(fetchDriverKycStatus());
  }, [dispatch]);

  const driverName = kycData?.personal?.fullName || user?.name || user?.fullName || 'Driver';
  const driverMobile = kycData?.personal?.mobile || user?.mobile || user?.phone || '';
  const driverEmail = kycData?.personal?.email || user?.email || '';
  const rawPhoto = kycData?.personal?.profilePhoto || user?.photo || user?.profilePhoto;
  const driverPhoto = formatImageUrl(rawPhoto);
  const driverInitials = (driverName.trim().split(/\s+/).map(p => p[0]).join('') || 'DR').slice(0, 2).toUpperCase();

  // Vehicle data
  const vehicleObj = kycData?.vehicle || user?.vehicle || {};
  const vehicleType = (vehicleObj?.vehicleType || 'BIKE').toUpperCase();
  const registrationNumber = vehicleObj?.registrationNumber || vehicleObj?.numberPlate || 'GJ01GB1234';
  const vehicleTitle = vehicleObj?.vehicleName || vehicleObj?.modelName || (vehicleType === 'BIKE' ? 'Motorcycle / Bike' : vehicleType);
  const vehicleSub = vehicleObj?.vehicleCategory || (vehicleType === 'BIKE' ? 'Two Wheeler' : 'Commercial Vehicle');
  const isBike = vehicleType.includes('BIKE') || vehicleType.includes('SCOOTER') || vehicleType.includes('TWO');
  const vehicleIcon = isBike ? 'motorbike' : 'car-hatchback';

  // KYC status
  const kycStatus = (kycData?.platform?.kycStatus || 'APPROVED').toUpperCase();
  const isApproved = kycStatus === 'APPROVED';
  const isPending = kycStatus === 'PENDING' || kycStatus === 'SUBMITTED' || kycStatus === 'IN_REVIEW';

  const completedDocsCount = [
    kycData?.personal?.isCompleted,
    kycData?.drivingLicence?.isCompleted,
    kycData?.vehicle?.isCompleted,
    kycData?.insurance?.isCompleted,
    kycData?.payout?.isCompleted,
  ].filter(Boolean).length;

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
          <Image
            source={images.loginGlow}
            style={styles.glow}
            resizeMode="cover"
          />

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
                  color={isApproved ? colors.green[550] : colors.amber[500]}
                />
              </View>
              <Text style={styles.statsText}>
                {user?.rating ? `${user.rating} ★` : '4.92 ★'} · {user?.totalTrips ? `${user.totalTrips} trips` : '2,140 trips'} · driving active
              </Text>
              {(driverMobile || driverEmail) ? (
                <Text style={styles.contactText}>
                  {[driverMobile, driverEmail].filter(Boolean).join(' · ')}
                </Text>
              ) : null}
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
            <AntDesign
              name={isApproved ? "check-circle" : isPending ? "clockcircleo" : "exclamationcircleo"}
              size={14}
              color={isApproved ? (colors.green[350] || colors.green[400]) : isPending ? colors.amber[400] : colors.red[400]}
            />
            <Text style={styles.kycText}>
              {isApproved ? 'KYC approved · Account active' : isPending ? 'KYC under review' : 'KYC action required'}
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
                  name={vehicleIcon}
                  size={24}
                  color={colors.text}
                />
              </View>
              <View>
                <Text style={styles.vehicleTitle}>{vehicleTitle}</Text>
                <Text style={styles.vehicleSub}>{vehicleSub}</Text>
              </View>
            </View>
            <View style={styles.platePill}>
              <Text style={styles.plateText}>{registrationNumber}</Text>
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
                  {completedDocsCount > 0 ? `${completedDocsCount} of 5 documents verified` : 'Upload required documents'}
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
                  {kycData?.drivingLicence?.isCompleted ? 'Verified & In compliance' : 'Submitted · in review'}
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

