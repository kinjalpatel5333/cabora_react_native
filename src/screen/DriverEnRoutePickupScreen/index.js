import React from 'react';
import {Dimensions, Image, Text, View, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Feather} from '@react-native-vector-icons/feather/static';
import {FontAwesome6} from '@react-native-vector-icons/fontawesome6/static';
import {Lucide} from '@react-native-vector-icons/lucide/static';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {images} from '../../assets';
import useThemedStyles from '../../components/useThemedStyles';
import {useApp} from '../../context/AppContext';
import createStyles from './style';
import colors from '../../config/color';

const SCREEN_W = Dimensions.get('window').width;
const ROUTE_W = SCREEN_W * 0.7;
const ROUTE_H = 180;

export default function DriverEnRoutePickupScreen() {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);
  const {colors} = useApp();
  const navigation = useNavigation();

  return (
    <View style={styles.root}>

      <Image
        source={images.mapBackdrop}
        style={styles.mapImage}
        resizeMode="cover"
      />

      <View
        style={[styles.navBanner, {top: insets.top + 8}]}
        pointerEvents="none">
        <View style={styles.navLeft}>
          <View style={styles.turnIcon}>
            <Image
              source={images.turnArrow}
              style={styles.turnArrowImage}
              resizeMode="contain"
            />
          </View>
          <View style={styles.navCopy}>
            <Text style={styles.navTitle}>In 300 m, turn left</Text>
            <Text style={styles.navSub} numberOfLines={1}>
              onto 100 Feet Road, Indiranagar
            </Text>
          </View>
        </View>
        <View style={styles.navRight}>
          <Text style={styles.navEta}>4 min</Text>
          <Text style={styles.navDist}>1.2 KM</Text>
        </View>
      </View>

      <View
        style={[styles.mapRoute, {top: insets.top + 78}]}
        pointerEvents="none">
        <View style={[styles.routeStage, {width: ROUTE_W, height: ROUTE_H}]}>
          <View style={styles.pickupZone} />
          <View style={styles.routeLine} />
          <Image
            source={images.mapMarker}
            style={styles.carMarker}
            resizeMode="contain"
          />
          <Image
            source={images.mapMarkerPickup}
            style={styles.pickupPin}
            resizeMode="contain"
          />
        </View>
      </View>

      <View style={[styles.fabs, {top: insets.top + 200}]}>
        <TouchableOpacity activeOpacity={0.7} accessibilityRole="button" style={styles.fab}>
          <FontAwesome6
            name="location-crosshairs"
            iconStyle="solid"
            size={18}
            color={colors.text}
          />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.7} accessibilityRole="button" style={styles.fab}>
          <Feather name="headphones" size={18} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View
        style={[
          styles.sheet,
          {paddingBottom: Math.max(insets.bottom, 12) + 8},
        ]}>
        <View style={styles.statusBanner}>
          <Lucide name="circle-check" size={18} color={colors.green[600]} />
          <Text style={styles.statusText}>
            You're 40 m from the pickup point
          </Text>
        </View>

        <View style={styles.riderRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>AS</Text>
          </View>
          <View style={styles.riderCopy}>
            <Text style={styles.riderName}>Ananya S. · 4.8 ★</Text>
            <Text style={styles.riderMeta}>
              Cab Sedan · Cash ₹184 · 11.4 km trip
            </Text>
          </View>
        </View>

        <View style={styles.pickupBox}>
          <Lucide name="map-pin" size={18} color={colors.orange[600]} />
          <View style={styles.pickupCopy}>
            <Text style={styles.pickupTitle}>Prestige Tech Park, Gate 3</Text>
            <Text style={styles.pickupNote}>
              “Near the security cabin, I'm in a blue kurta”
            </Text>
          </View>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity activeOpacity={0.7} accessibilityRole="button" style={styles.actionBtn}>
            <Feather name="phone" size={16} color={colors.text} />
            <Text style={styles.actionText}>Call</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.7} accessibilityRole="button" style={styles.actionBtn}>
            <Feather name="message-circle" size={16} color={colors.text} />
            <Text style={styles.actionText}>Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.7}
            accessibilityRole="button"
            onPress={() => navigation.navigate('CancelRideReason')}
            style={[styles.actionBtn, styles.cancelActionBtn]}>
            <View style={styles.cancelIcon}>
              <Feather name="x" size={10} color={colors.red[700]} />
            </View>
            <Text style={styles.cancelActionText}>Cancel</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity activeOpacity={0.7}
          accessibilityRole="button"
          style={styles.arriveBtn}
          onPress={() => navigation.navigate('DriverStartTrip')}>
          <Lucide name="circle-check" size={22} color={colors.white} />
          <Text style={styles.arriveText}>I've arrived at pickup</Text>
        </TouchableOpacity>

        <Text style={styles.footerHint}>
          Unlocked because you're inside the pickup zone. Outside 100 m this
          stays disabled.
        </Text>
      </View>
    </View>
  );
}
