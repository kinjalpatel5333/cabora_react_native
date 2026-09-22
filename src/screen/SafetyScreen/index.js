import React, {useState} from 'react';
import {
  Pressable,
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
import EmergencyModal from '../EmergencyScreen';
import createStyles from './style';

const TOOLS = [
  {
    id: 'sos',
    title: 'Emergency SOS',
    sub: 'Alert local police & contacts',
    iconBg: 'red',
  },
  {
    id: 'contacts',
    title: 'Trusted contacts',
    sub: 'Share trip details automatically',
    iconBg: 'blue',
  },
  {
    id: 'share',
    title: 'Share live trip',
    sub: 'Auto-share after 9:00 PM is ON',
    iconBg: 'sky',
  },
  {
    id: 'check',
    title: 'Ride check',
    sub: 'Auto-detect long unexpected stops',
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

const ICON_TONES = {
  red: {bg: colors.red[200], fg: colors.danger},
  blue: {bg: colors.blue.softBg, fg: colors.blue[550]},
  sky: {bg: colors.blue.skyBg, fg: colors.blue[600]},
  green: {bg: colors.green[200], fg: colors.green[600]},
  amber: {bg: colors.amber[100], fg: colors.amber[600]},
  gray: {bg: colors.slate[100], fg: colors.slate[500]},
};

function ToolIcon({id, color}) {
  if (id === 'sos') {
    return <MaterialDesignIcons name="alarm-light-outline" size={20} color={color} />;
  }
  if (id === 'contacts') {
    return <Feather name="users" size={18} color={color} />;
  }
  if (id === 'share') {
    return <Feather name="upload" size={18} color={color} />;
  }
  if (id === 'check') {
    return <Feather name="shield" size={18} color={color} />;
  }
  if (id === 'report') {
    return <Feather name="flag" size={18} color={color} />;
  }
  return <MaterialDesignIcons name="lightbulb-on-outline" size={20} color={color} />;
}

export default function SafetyScreen() {
  const insets = useSafeAreaInsets();
  const {colors} = useApp();
  const styles = useThemedStyles(createStyles);
  const navigation = useNavigation();
  const {showToast} = useToast();
  const [emergencyOpen, setEmergencyOpen] = useState(false);

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
      navigation.navigate('ReportIncident');
      return;
    }
    if (id === 'tips') {
      navigation.navigate('SafetyComplaint');
      return;
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar
        barStyle={colors.barStyle}
        backgroundColor={colors.card}
      />
      <View style={[styles.header, {paddingTop: insets.top + 4}]}>
        <Pressable
          style={styles.headerBtn}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={8}>
          <Feather name="arrow-left" size={22} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Safety</Text>
        <Pressable
          style={styles.headerBtn}
          onPress={() => navigation.navigate('Help')}
          accessibilityRole="button"
          accessibilityLabel="Help"
          hitSlop={8}>
          <Feather name="help-circle" size={22} color={colors.text} />
        </Pressable>
      </View>

      <View style={styles.content}>
        <View style={styles.hero}>
          <View style={styles.heroCircle} pointerEvents="none" />
          <View style={styles.heroIcon}>
            <MaterialDesignIcons
              name="shield-check-outline"
              size={24}
              color={colors.success}
            />
          </View>
          <Text style={styles.heroTitle}>Your rides are protected</Text>
          <Text style={styles.heroSub}>
            Every trip is insured, tracked and monitored by the Cabora safety desk.
          </Text>
        </View>

        <View style={styles.toolsSection}>
          <Text style={styles.sectionLabel}>SAFETY TOOLS</Text>
          <View style={styles.toolsGrid}>
            {TOOLS.map(tool => {
              const tone = ICON_TONES[tool.iconBg] || ICON_TONES.gray;
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
        </View>

        <View style={styles.insuranceCard}>
          <View style={styles.insuranceTop}>
            <View style={styles.insuranceIcon}>
              <MaterialDesignIcons
                name="shield-check-outline"
                size={22}
                color={colors.green[600]}
              />
            </View>
            <View style={styles.insuranceBody}>
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
      </View>

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

      <EmergencyModal
        visible={emergencyOpen}
        onClose={() => setEmergencyOpen(false)}
      />
    </View>
  );
}
