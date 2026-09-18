import React, {useState} from 'react';
import {
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Feather} from '@react-native-vector-icons/feather/static';
import {MaterialDesignIcons} from '@react-native-vector-icons/material-design-icons/static';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useToast} from '../../components/Toast';
import useThemedStyles from '../../components/useThemedStyles';
import {useApp} from '../../context/AppContext';
import EmergencyScreen from '../EmergencyScreen';
import createStyles from './style';

const TOOLS = [
  {
    id: 'sos',
    title: 'Emergency SOS',
    sub: 'Alerts the safety desk in 3 s',
    iconBg: 'red',
  },
  {
    id: 'contacts',
    title: 'Trusted contacts',
    sub: '3 people added',
    iconBg: 'blue',
  },
  {
    id: 'share',
    title: 'Share live location',
    sub: 'On for every night ride',
    iconBg: 'blue',
  },
  {
    id: 'check',
    title: 'Ride check',
    sub: 'Detects long stops automatically',
    iconBg: 'green',
  },
  {
    id: 'report',
    title: 'Report an incident',
    sub: 'Anonymous option available',
    iconBg: 'amber',
  },
  {
    id: 'tips',
    title: 'Safety tips',
    sub: 'Before, during and after a ride',
    iconBg: 'gray',
  },
];

function ToolIcon({id, color}) {
  if (id === 'sos') {
    return <MaterialDesignIcons name="alarm-light" size={20} color={color} />;
  }
  if (id === 'contacts') {
    return <Feather name="users" size={18} color={color} />;
  }
  if (id === 'share') {
    return <Feather name="upload" size={18} color={color} />;
  }
  if (id === 'check') {
    return <MaterialDesignIcons name="shield-check" size={20} color={color} />;
  }
  if (id === 'report') {
    return <Feather name="alert-triangle" size={18} color={color} />;
  }
  return <Feather name="help-circle" size={18} color={color} />;
}

export default function SafetyScreen() {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);
  const {colors} = useApp();
  const navigation = useNavigation();
  const {showToast} = useToast();
  const [emergencyOpen, setEmergencyOpen] = useState(false);

  const iconTone = {
    red: {bg: colors.red[100], fg: colors.red[500]},
    blue: {bg: colors.blue[100], fg: colors.blue[600]},
    green: {bg: colors.green[100], fg: colors.green[600]},
    amber: {bg: colors.amber[100], fg: colors.amber[600]},
    gray: {bg: colors.gray[100], fg: colors.gray[500]},
  };

  const onToolPress = id => {
    if (id === 'sos') {
      setEmergencyOpen(true);
      return;
    }
    if (id === 'contacts') {
      navigation.navigate('TrustedContacts');
      return;
    }
    if (id === 'share') {
      showToast({type: 'info', message: 'Live location sharing is on for night rides'});
      return;
    }
    if (id === 'check') {
      showToast({type: 'info', message: 'Ride check is monitoring long stops'});
      return;
    }
    if (id === 'report') {
      showToast({type: 'info', message: 'Incident report coming soon'});
      return;
    }
    showToast({type: 'info', message: 'Safety tips coming soon'});
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      <View style={[styles.header, {paddingTop: insets.top + 4}]}>
        <Pressable
          style={styles.headerBtn}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={8}>
          <Feather name="arrow-left" size={22} color={colors.navy[900]} />
        </Pressable>
        <Text style={styles.headerTitle}>Safety</Text>
        <Pressable
          style={styles.headerBtn}
          onPress={() =>
            showToast({type: 'info', message: 'Cabora Safety help'})
          }
          accessibilityRole="button"
          accessibilityLabel="Help"
          hitSlop={8}>
          <Feather name="help-circle" size={22} color={colors.navy[900]} />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scroll,
          {paddingBottom: Math.max(insets.bottom, 12) + 90},
        ]}>
        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <MaterialDesignIcons
              name="shield-check-outline"
              size={22}
              color={colors.green[500]}
            />
          </View>
          <Text style={styles.heroTitle}>Your rides are protected</Text>
          <Text style={styles.heroSub}>
            Every trip is insured, tracked and monitored by the Cabora safety
            desk.
          </Text>
        </View>

        <Text style={styles.sectionLabel}>SAFETY TOOLS</Text>
        <View style={styles.toolsGrid}>
          {TOOLS.map(tool => {
            const tone = iconTone[tool.iconBg];
            return (
              <Pressable
                key={tool.id}
                style={styles.toolCard}
                onPress={() => onToolPress(tool.id)}
                accessibilityRole="button"
                accessibilityLabel={tool.title}>
                <View style={[styles.toolIcon, {backgroundColor: tone.bg}]}>
                  <ToolIcon id={tool.id} color={tone.fg} />
                </View>
                <Text style={styles.toolTitle}>{tool.title}</Text>
                <Text style={styles.toolSub}>{tool.sub}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.insuranceCard}>
          <View style={styles.insuranceTop}>
            <View style={styles.insuranceIcon}>
              <MaterialDesignIcons
                name="shield-check"
                size={22}
                color={colors.green[600]}
              />
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.insuranceTitle}>
                In-trip insurance is active
              </Text>
              <Text style={styles.insuranceSub}>
                Cover up to ₹5,00,000 per rider, per trip
              </Text>
            </View>
          </View>
          <View style={styles.insuranceFooter}>
            <Pressable
              onPress={() =>
                showToast({type: 'info', message: 'Opening insurance policy'})
              }
              hitSlop={6}>
              <Text style={styles.policyLink}>View policy</Text>
            </Pressable>
            <Text style={styles.policyId}>Policy CBR-INS-2026</Text>
          </View>
        </View>
      </ScrollView>

      <View
        style={[styles.footer, {paddingBottom: Math.max(insets.bottom, 12)}]}>
        <Pressable
          style={styles.sosBtn}
          onPress={() => setEmergencyOpen(true)}
          accessibilityRole="button"
          accessibilityLabel="Emergency SOS">
          <Text style={styles.sosText}>Emergency SOS</Text>
        </Pressable>
      </View>

      <EmergencyScreen
        visible={emergencyOpen}
        onClose={() => setEmergencyOpen(false)}
      />
    </View>
  );
}
