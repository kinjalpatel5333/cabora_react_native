import React from 'react';
import {Animated, ScrollView, Text, View, TouchableOpacity} from 'react-native';
import {Feather} from '@react-native-vector-icons/feather/static';
import {MaterialDesignIcons} from '@react-native-vector-icons/material-design-icons/static';
import useThemedStyles from '../../components/useThemedStyles';
import {useApp} from '../../context/AppContext';
import createStyles from './matchedStyle';
import colors from '../../config/color';

export function CoRiderMatchedSheet({fare = 412, onCancel}) {
  const styles = useThemedStyles(createStyles);
  const {colors} = useApp();

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      bounces={false}
      contentContainerStyle={styles.scroll}>
      <View style={styles.matchBadge}>
        <View style={styles.matchDot} />
        <Text style={styles.matchBadgeText}>Co-rider matched</Text>
      </View>

      <Text style={styles.headline}>Driver is 4 minutes away</Text>
      <Text style={styles.subline}>Cabora Pool · 1 seat · ₹{fare}</Text>

      <View style={styles.driverCard}>
        <View style={styles.driverTop}>
          <View style={[styles.avatar, styles.avatarOrange]}>
            <Text style={[styles.avatarText, styles.avatarTextOrange]}>SN</Text>
          </View>
          <View style={styles.driverCopy}>
            <Text style={styles.driverName}>Suresh Nair</Text>
            <Text style={styles.driverMeta}>4.92 · Swift Dzire · white</Text>
          </View>
          <View style={styles.plate}>
            <Text style={styles.plateText}>KA 05 MJ 4821</Text>
          </View>
        </View>
        <View style={styles.otpInline}>
          <Feather name="shield" size={16} color={colors.green[600]} />
          <Text style={styles.otpInlineText}>Start OTP 4182</Text>
        </View>
      </View>

      <Text style={styles.sectionLabel}>YOUR POOL</Text>

      <View style={[styles.poolCard, styles.poolCardYou]}>
        <View style={[styles.avatar, styles.avatarOrange]}>
          <Text style={[styles.avatarText, styles.avatarTextOrange]}>AM</Text>
        </View>
        <View style={styles.poolCopy}>
          <Text style={styles.poolName}>You</Text>
          <Text style={styles.poolRoute}>Indiranagar → Whitefield</Text>
        </View>
        <Text style={[styles.poolStatus, styles.poolStatusYou]}>
          picked up first
        </Text>
      </View>

      <View style={styles.poolCard}>
        <View style={[styles.avatar, styles.avatarBlue]}>
          <Text style={[styles.avatarText, styles.avatarTextBlue]}>RK</Text>
        </View>
        <View style={styles.poolCopy}>
          <Text style={styles.poolName}>Rhea K.</Text>
          <Text style={styles.poolRoute}>Domlur → Marathahalli</Text>
        </View>
        <Text style={[styles.poolStatus, styles.poolStatusOther]}>
          joins in 6 min
        </Text>
      </View>

      <View style={styles.infoBanner}>
        <Feather name="info" size={16} color={colors.blue[600]} />
        <Text style={styles.infoBannerText}>
          One pickup on the way adds about 6 minutes to your trip.
        </Text>
      </View>

      <TouchableOpacity activeOpacity={0.7} style={styles.cancelLinkSpaced} onPress={onCancel}>
        <Text style={styles.cancelLinkText}>Cancel ride</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

export function DriverOnWaySheet({
  driverName = 'Rajesh',
  onCancel,
  onSos,
  onShare,
}) {
  const styles = useThemedStyles(createStyles);
  const {colors} = useApp();
  const otp = ['4', '8', '2', '6'];

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      bounces={false}
      contentContainerStyle={styles.scroll}>
      <View style={styles.headlineRow}>
        <Text style={styles.headlineOnWay} numberOfLines={1}>
          {driverName} is on the way
        </Text>
        <View style={styles.liveBadge}>
          <View style={styles.matchDot} />
          <Text style={styles.matchBadgeText}>LIVE</Text>
        </View>
      </View>

      <View style={styles.otpBox}>
        <View style={styles.otpHead}>
          <Feather name="lock" size={14} color={colors.orange[600]} />
          <Text style={styles.otpHeadText}>RIDE START OTP</Text>
        </View>
        <View style={styles.otpDigits}>
          {otp.map((digit, index) => (
            <View key={`${digit}-${index}`} style={styles.otpDigit}>
              <Text style={styles.otpDigitText}>{digit}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.otpHint}>
          Share this OTP with your driver when they arrive. Never share it
          before.
        </Text>
      </View>

      <View style={styles.driverRow}>
        <View style={[styles.avatar, styles.avatarNavy]}>
          <Text style={[styles.avatarText, styles.avatarTextNavy]}>RK</Text>
        </View>
        <View style={styles.driverCopy}>
          <View style={styles.nameRatingRow}>
            <Text style={styles.driverName}>Rajesh Kumar</Text>
            <Feather name="star" size={13} color={colors.amber[500]} />
            <Text style={styles.ratingText}>4.92</Text>
          </View>
          <Text style={styles.driverMeta}>
            White Maruti Dzire · 2,140 trips
          </Text>
        </View>
        <View style={[styles.plate, styles.plateDark]}>
          <Text style={[styles.plateText, styles.plateTextLight]}>
            KA 05 MJ 4821
          </Text>
        </View>
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity activeOpacity={0.7} style={styles.actionBtn}>
          <Feather name="phone" size={18} color={colors.text} />
          <Text style={styles.actionLabel}>Call</Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.7} style={styles.actionBtn}>
          <Feather name="message-circle" size={18} color={colors.text} />
          <Text style={styles.actionLabel}>Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.7} style={styles.actionBtn} onPress={onShare}>
          <Feather name="upload" size={18} color={colors.text} />
          <Text style={styles.actionLabel}>Share trip</Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.7}
          style={[styles.actionBtn, styles.actionBtnSos]}
          onPress={onSos}
          accessibilityRole="button"
          accessibilityLabel="SOS">
          <MaterialDesignIcons
            name="alarm-light"
            size={20}
            color={colors.red[500]}
          />
          <Text style={[styles.actionLabel, styles.actionLabelSos]}>SOS</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity activeOpacity={0.7} style={styles.safetyBanner}>
        <View style={styles.safetyIcon}>
          <Feather name="shield" size={18} color={colors.blue[600]} />
        </View>
        <View style={styles.safetyCopy}>
          <Text style={styles.safetyTitle}>Run the safety checklist</Text>
          <Text style={styles.safetyBody}>
            Match the plate, driver photo and OTP before you get in.
          </Text>
        </View>
        <Feather name="chevron-right" size={18} color={colors.blue[600]} />
      </TouchableOpacity>

      <TouchableOpacity activeOpacity={0.7} style={styles.cancelLink} onPress={onCancel}>
        <Text style={styles.cancelLinkText}>Cancel ride</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

export function OnTripSheet({
  drop = 'Kempegowda Intl. Airport, T2',
  progressWidth,
  onShare,
}) {
  const styles = useThemedStyles(createStyles);
  const {colors} = useApp();

  return (
    <View>
      <View style={styles.onTripHead}>
        <View style={styles.onTripBadge}>
          <View style={styles.onTripDot} />
          <Text style={styles.onTripBadgeText}>ON TRIP</Text>
        </View>
        <Text style={styles.onTripDrop} numberOfLines={1}>
          {drop}
        </Text>
      </View>

      <View style={styles.onTripTrack}>
        <Animated.View
          style={[styles.onTripFill, {width: progressWidth || '38%'}]}
        />
      </View>

      <View style={styles.metricsRow}>
        <View style={styles.metricCol}>
          <Text style={styles.metricLabel}>ARRIVING</Text>
          <Text style={styles.metricValue}>12:24 pm</Text>
        </View>
        <View style={styles.metricCol}>
          <Text style={styles.metricLabel}>DISTANCE LEFT</Text>
          <Text style={styles.metricValue}>9.8 km</Text>
        </View>
        <View style={styles.metricCol}>
          <Text style={styles.metricLabel}>FARE SO FAR</Text>
          <Text style={styles.metricValue}>₹164</Text>
        </View>
      </View>

      <View style={styles.onTripDriver}>
        <View style={[styles.avatar, styles.avatarNavy]}>
          <Text style={[styles.avatarText, styles.avatarTextNavy]}>RK</Text>
        </View>
        <View style={styles.driverCopy}>
          <Text style={styles.onTripDriverName}>Rajesh Kumar · 4.92</Text>
          <Text style={styles.driverMeta}>
            White Maruti Dzire · KA 05 MJ 4821
          </Text>
        </View>
        <TouchableOpacity activeOpacity={0.7} style={styles.miniAction}>
          <Feather name="phone" size={16} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.7} style={styles.miniAction}>
          <Feather name="message-circle" size={16} color={colors.text} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity activeOpacity={0.7} style={styles.shareLiveBtn} onPress={onShare}>
        <Text style={styles.shareLiveText}>Share live location</Text>
      </TouchableOpacity>
    </View>
  );
}
