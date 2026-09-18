import React, {useMemo, useState} from 'react';
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
import createStyles from './style';

const RIDERS = [
  {
    id: 'bike',
    title: 'Portal on Bike',
    meta: 'up to 3 kg · 24 min',
    price: 39,
    total: 41,
    icon: 'motorbike',
    badge: 'Cheapest',
    badgeTone: 'orange',
  },
  {
    id: 'auto',
    title: 'Portal on Auto',
    meta: 'up to 10 kg · 28 min',
    price: 79,
    total: 83,
    icon: 'rickshaw',
  },
  {
    id: 'cab',
    title: 'Portal on Cab',
    meta: 'up to 25 kg · 26 min',
    price: 129,
    total: 136,
    icon: 'car-side',
    badge: 'Boot space',
    badgeTone: 'blue',
  },
];

const FARE_ROWS = [
  {id: 'base', label: 'Base fare · 6.4 km', amount: 34},
  {id: 'wait', label: 'Pickup waiting (5 min free)', amount: 0},
  {id: 'handling', label: 'Handling', amount: 5},
  {id: 'gst', label: 'GST (5%)', amount: 2},
];

function formatPrice(n) {
  return `₹${n.toLocaleString('en-IN')}`;
}

function RiderIcon({name, color}) {
  return <MaterialDesignIcons name={name} size={24} color={color} />;
}

export default function PortalStep3Screen() {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);
  const {colors} = useApp();
  const navigation = useNavigation();
  const {showToast} = useToast();
  const [riderId, setRiderId] = useState('bike');

  const selected = useMemo(
    () => RIDERS.find(r => r.id === riderId) || RIDERS[0],
    [riderId],
  );

  const onConfirm = () => {
    navigation.navigate('PortalTracking');
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle={colors.barStyle} backgroundColor={colors.card} />
      <View style={[styles.header, {paddingTop: insets.top + 4}]}>
        <Pressable
          style={styles.headerBtn}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={8}>
          <Feather name="arrow-left" size={22} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Choose a rider</Text>
        <Pressable
          style={styles.headerBtn}
          onPress={() => navigation.navigate('Help')}
          accessibilityRole="button"
          accessibilityLabel="Help"
          hitSlop={8}>
          <Feather name="help-circle" size={22} color={colors.text} />
        </Pressable>
      </View>

      <View style={styles.progressWrap}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressSeg, styles.progressSegActive]} />
          <View style={[styles.progressSeg, styles.progressSegActive]} />
          <View style={[styles.progressSeg, styles.progressSegActive]} />
        </View>
        <Text style={styles.stepText}>Step 3 of 3</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, {paddingBottom: 24}]}>
        <View style={styles.routeCard}>
          <View style={styles.routeTimeline}>
            <View style={styles.routeDotStart} />
            <View style={styles.routeLine} />
            <View style={styles.routeDotEnd} />
          </View>
          <View style={styles.routeCopy}>
            <View style={styles.routeRow}>
              <Text style={styles.routeTitle} numberOfLines={1}>
                Indiranagar 100ft Road
              </Text>
              <Text style={styles.routeMeta}>6.4 km</Text>
            </View>
            <View style={styles.routeRow}>
              <Text style={styles.routeTitle} numberOfLines={1}>
                Koramangala 5th Block
              </Text>
              <Text style={styles.routeMeta}>24 min</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>RIDER OPTIONS</Text>
          <View style={styles.riderList}>
            {RIDERS.map(item => {
              const active = item.id === riderId;
              const iconColor = active
                ? colors.primary
                : colors.text;
              return (
                <Pressable
                  key={item.id}
                  style={[styles.riderCard, active && styles.riderCardActive]}
                  onPress={() => setRiderId(item.id)}
                  accessibilityRole="button"
                  accessibilityState={{selected: active}}>
                  <View style={styles.riderIcon}>
                    <RiderIcon name={item.icon} color={iconColor} />
                  </View>
                  <View style={styles.riderCopy}>
                    <Text style={styles.riderTitle}>{item.title}</Text>
                    <Text style={styles.riderMeta}>{item.meta}</Text>
                    {item.badge ? (
                      <View
                        style={[
                          styles.riderBadge,
                          item.badgeTone === 'blue' && styles.riderBadgeAlt,
                        ]}>
                        <View
                          style={[
                            styles.riderBadgeDot,
                            item.badgeTone === 'blue' &&
                              styles.riderBadgeDotAlt,
                          ]}
                        />
                        <Text
                          style={[
                            styles.riderBadgeText,
                            item.badgeTone === 'blue' &&
                              styles.riderBadgeTextAlt,
                          ]}>
                            {item.badge}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                  <Text
                    style={[
                      styles.riderPrice,
                      active && styles.riderPriceActive,
                    ]}>
                    {formatPrice(item.price)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.fareCard}>
          {FARE_ROWS.map((row, index) => (
            <View
              key={row.id}
              style={[
                styles.fareRow,
                index === FARE_ROWS.length - 1 && styles.fareRowLast,
              ]}>
              <Text style={styles.fareLabel}>{row.label}</Text>
              <Text style={styles.fareAmount}>{formatPrice(row.amount)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.payCard}>
          <View style={styles.payIcon}>
            <Feather name="credit-card" size={18} color={colors.text} />
          </View>
          <View style={styles.payCopy}>
            <Text style={styles.payTitle}>HDFC ....4821</Text>
            <Text style={styles.payMeta}>Charged on pickup</Text>
          </View>
          <Pressable
            onPress={() =>
              showToast({type: 'info', message: 'Change payment method'})
            }
            hitSlop={8}>
            <Text style={styles.changeText}>Change</Text>
          </Pressable>
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          {paddingBottom: Math.max(insets.bottom, 12)},
        ]}>
        <View style={styles.footerCopy}>
          <Text style={styles.footerLabel}>{selected.title}</Text>
          <Text style={styles.footerPrice}>{formatPrice(selected.total)}</Text>
          <Text style={styles.footerNote}>Free cover up to ₹5,000</Text>
        </View>
        <Pressable
          style={styles.confirmBtn}
          onPress={onConfirm}
          accessibilityRole="button"
          accessibilityLabel="Confirm portal booking">
          <Text style={styles.confirmText}>Confirm</Text>
        </Pressable>
      </View>
    </View>
  );
}
