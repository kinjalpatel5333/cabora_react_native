import React from 'react';
import {
  Dimensions,
  Image,
  Linking,
  Pressable,
  Share,
  StatusBar,
  Text,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Feather} from '@react-native-vector-icons/feather/static';
import {FontAwesome6} from '@react-native-vector-icons/fontawesome6/static';
import {Lucide} from '@react-native-vector-icons/lucide/static';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {images} from '../../assets';
import {useToast} from '../../components/Toast';
import useThemedStyles from '../../components/useThemedStyles';
import {useApp} from '../../context/AppContext';
import createStyles from './style';
import colors from '../../config/color';

const SCREEN_W = Dimensions.get('window').width;
const ROUTE_W = SCREEN_W * 0.8;
const ROUTE_H = 220;

export default function DriverTripInProgressScreen() {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);
  const {colors} = useApp();
  const navigation = useNavigation();
  const {showToast} = useToast();

  const handleSos = () => {
    Linking.openURL('tel:112').catch(() => {
      showToast({
        title: 'Emergency SOS',
        message: 'Emergency Helpline: 112',
        type: 'error',
      });
    });
  };

  const handleCallPassenger = () => {
    Linking.openURL('tel:9876543210').catch(() => {
      showToast({
        title: 'Calling Ananya S.',
        message: 'Connecting via masked number...',
        type: 'info',
      });
    });
  };

  const handleChatPassenger = () => {
    showToast({
      title: 'Chat with Ananya S.',
      message: 'Opening in-app chat...',
      type: 'info',
    });
  };

  const handleShareTrip = async () => {
    try {
      await Share.share({
        message:
          'Live Trip Status: En route to Kempegowda Intl. Airport, T2 with CabOra.',
      });
    } catch {
      showToast({
        title: 'Share Trip',
        message: 'Trip link copied to clipboard.',
        type: 'info',
      });
    }
  };

  const handleEndTrip = () => {
    navigation.navigate('DriverTripSummary');
  };

  return (
    <View style={styles.root}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.transparent}
        translucent
      />

      {/* Map Backdrop */}
      <Image
        source={images.mapBackdrop}
        style={styles.mapImage}
        resizeMode="cover"
      />

      {/* Top Bar: Nav Guidance Card + SOS */}
      <View style={[styles.topBar, {top: insets.top + 8}]}>
        <View style={styles.navBanner}>
          <View style={styles.turnIconContainer}>
            <Lucide name="navigation" size={24} color={colors.primary} />
          </View>
          <View style={styles.navCopy}>
            <Text style={styles.navTitle} numberOfLines={1}>
              Keep left for Terminal 2
            </Text>
            <Text style={styles.navSub} numberOfLines={1}>
              600 m · Airport Trumpet Interchange
            </Text>
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="SOS Emergency"
          onPress={handleSos}
          style={styles.sosBtn}>
          <Lucide name="siren" size={16} color={colors.red[600]} />
          <Text style={styles.sosText}>SOS</Text>
        </Pressable>
      </View>

      {/* Recenter / Crosshairs FAB */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Recenter Map"
        onPress={() => {
          showToast({
            title: 'Map',
            message: 'Map centered on vehicle.',
            type: 'info',
          });
        }}
        style={[styles.crosshairFab, {top: insets.top + 78}]}>
        <FontAwesome6
          name="location-crosshairs"
          iconStyle="solid"
          size={18}
          color={colors.navy[800]}
        />
      </Pressable>

      {/* Map Route Graphic Overlay */}
      <View
        style={[styles.mapRouteContainer, {top: insets.top + 80}]}
        pointerEvents="none">
        <View style={[styles.routeStage, {width: ROUTE_W, height: ROUTE_H}]}>
          {/* Drop Zone Green Ring */}
          <View style={styles.dropZone} />

          {/* Destination Pin */}
          <View style={styles.dropPinContainer}>
            <Image
              source={images.mapMarkerDrop}
              style={styles.dropPin}
              resizeMode="contain"
            />
          </View>

          {/* Curved Route Path */}
          <View style={styles.routeCurve} />

          {/* Vehicle Position Marker */}
          <View style={styles.carMarkerBadge}>
            <FontAwesome6
              name="car-side"
              iconStyle="solid"
              size={18}
              color={colors.white}
            />
          </View>
        </View>
      </View>

      {/* Bottom Sheet Card */}
      <View
        style={[
          styles.sheet,
          {paddingBottom: Math.max(insets.bottom, 12) + 4},
        ]}>
        {/* Solid Top Drag Handle */}
        <View style={styles.dragHandleWrapper}>
          <View style={styles.dragHandleBar} />
        </View>

        {/* Destination & On Trip Badge */}
        <View style={styles.destRow}>
          <View style={styles.onTripBadge}>
            <View style={styles.onTripDot} />
            <Text style={styles.onTripText}>ON TRIP</Text>
          </View>
          <Text style={styles.destTitle} numberOfLines={1}>
            Kempegowda Intl. Airport, T2
          </Text>
        </View>

        {/* Trip Progress Bar */}
        <View style={styles.progressBarTrack}>
          <View style={styles.progressBarFill} />
        </View>

        {/* 3-Column Stats Box */}
        <View style={styles.statsContainer}>
          <View style={styles.statCol}>
            <Text style={styles.statLabel}>ARRIVING</Text>
            <Text style={styles.statValue}>12:24 pm</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCol}>
            <Text style={styles.statLabel}>LEFT</Text>
            <Text style={styles.statValue}>1.2 km</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCol}>
            <Text style={styles.statLabel}>RUNNING FARE</Text>
            <Text style={styles.statValueOrange}>₹236</Text>
          </View>
        </View>

        {/* Rider Information & Quick Actions */}
        <View style={styles.riderRow}>
          <View style={styles.riderInfoLeft}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>AS</Text>
            </View>
            <View style={styles.riderDetails}>
              <Text style={styles.riderName}>Ananya S. · 4.8 ★</Text>
              <Text style={styles.riderSub} numberOfLines={2}>
                {'Cash · collect ₹241.50\nat drop'}
              </Text>
            </View>
          </View>

          <View style={styles.actionIconGroup}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Call rider"
              onPress={handleCallPassenger}
              style={styles.roundActionBtn}>
              <Feather name="phone" size={17} color={colors.slate[900]} />
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Message rider"
              onPress={handleChatPassenger}
              style={styles.roundActionBtn}>
              <Feather name="message-circle" size={17} color={colors.slate[900]} />
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Share trip"
              onPress={handleShareTrip}
              style={styles.roundActionBtn}>
              <Lucide name="share" size={17} color={colors.slate[900]} />
            </Pressable>
          </View>
        </View>

        {/* Drop Proximity Notification */}
        <View style={styles.proximityBanner}>
          <Lucide name="circle-check" size={17} color={colors.green[600]} />
          <Text style={styles.proximityText}>
            You're 60 m from the drop point
          </Text>
        </View>

        {/* End Trip Primary Action Button with green border & orange background */}
        <Pressable
          accessibilityRole="button"
          onPress={handleEndTrip}
          style={styles.endTripBtn}>
          <Lucide name="circle-check" size={20} color={colors.white} />
          <Text style={styles.endTripText}>End trip & collect ₹241.50</Text>
        </Pressable>

        {/* Home Indicator */}
        <View style={styles.homeIndicator} />
      </View>
    </View>
  );
}
