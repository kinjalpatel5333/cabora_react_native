import React from 'react';
import {
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
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
import createStyles from './style';
import colors from '../../config/color';

export default function DriverProfileScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { colors } = useApp();
  const styles = useThemedStyles(createStyles);
  const { openDrawer } = useSidebar();
  const { showToast } = useToast();

  const handleEditProfile = () => {
    showToast({
      title: 'Edit Profile',
      message: 'Profile editing options opening...',
      type: 'info',
    });
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
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.navy[850]}
        translucent={false}
      />

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

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open menu"
            onPress={openDrawer}
            style={styles.menuBtn}>
            <Feather name="menu" size={20} color={colors.white} />
          </Pressable>

          <View style={styles.profileRow}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>RK</Text>
            </View>

            <View style={styles.profileInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.nameText}>Rajesh Kumar</Text>
                <MaterialDesignIcons
                  name="check-decagram"
                  size={18}
                  color={colors.green[550]}
                />
              </View>
              <Text style={styles.statsText}>
                4.92 ★ · 2,140 trips · driving since Mar 2024
              </Text>
              <Text style={styles.contactText}>
                +91 98450 21188 · rajesh.k@gmail.com
              </Text>
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Edit profile"
              onPress={handleEditProfile}
              style={styles.editBtn}>
              <Feather name="edit-2" size={16} color={colors.white} />
            </Pressable>
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

          <Pressable
            accessibilityRole="button"
            onPress={handleVehicleChange}
            style={styles.vehicleActionBtn}>
            <Text style={styles.vehicleActionText}>
              Request a vehicle change
            </Text>
          </Pressable>
        </View>

        {/* DOCUMENTS & COMPLIANCE Section */}
        <Text style={styles.sectionTitle}>DOCUMENTS & COMPLIANCE</Text>
        <View style={styles.listCard}>
          <Pressable
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
          </Pressable>

          <Pressable
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
          </Pressable>
        </View>

        {/* PAYOUTS & ACCOUNT Section */}
        <Text style={styles.sectionTitle}>PAYOUTS & ACCOUNT</Text>
        <View style={styles.listCard}>
          <Pressable
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
          </Pressable>

          <Pressable
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
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
