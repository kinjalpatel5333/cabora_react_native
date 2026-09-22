import { PASSENGER_PORTAL_DELIVERED_FARE_ROWS } from '../../config/staticData';
import React, {useState} from 'react';
import {ScrollView, Text, View, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Feather} from '@react-native-vector-icons/feather/static';
import {MaterialDesignIcons} from '@react-native-vector-icons/material-design-icons/static';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useToast} from '../../components/Toast';
import useThemedStyles from '../../components/useThemedStyles';
import {useApp} from '../../context/AppContext';
import createStyles from './style';
import colors from '../../config/color';

const FARE_ROWS = PASSENGER_PORTAL_DELIVERED_FARE_ROWS;

export default function PortalDeliveredScreen() {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);
  const {colors} = useApp();
  const navigation = useNavigation();
  const {showToast} = useToast();
  const [rating, setRating] = useState(0);

  const goServices = () => {
    navigation.popToTop();
    navigation.navigate('MainTabs', {screen: 'Services'});
  };

  const sendAnother = () => {
    navigation.popToTop();
    navigation.navigate('Portal');
  };

  return (
    <View style={styles.root}>
      <View style={[styles.header, {paddingTop: insets.top + 4}]}>
        <TouchableOpacity activeOpacity={0.7}
          style={styles.headerBtn}
          onPress={goServices}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={8}>
          <Feather name="arrow-left" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Portal delivered</Text>
        <TouchableOpacity activeOpacity={0.7}
          style={styles.headerBtn}
          onPress={() => navigation.navigate('Help')}
          accessibilityRole="button"
          accessibilityLabel="Help"
          hitSlop={8}>
          <Feather name="help-circle" size={22} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, {paddingBottom: 20}]}>
        <View style={styles.heroCard}>
          <View style={styles.heroGlow} />
          <View style={styles.heroCheck}>
            <Feather name="check" size={20} color={colors.green[500]} />
          </View>
          <Text style={styles.heroTitle}>Handed to Priya Sharma</Text>
          <Text style={styles.heroMeta}>
            19:31 · code 4182 verified at the door
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Proof of delivery</Text>
          <View style={styles.proofRow}>
            <View style={styles.photoCol}>
              <View style={styles.photoBox}>
                <Feather name="camera" size={24} color={colors.muted} />
              </View>
              <Text style={styles.photoLabel}>Photo at the door</Text>
            </View>
            <View style={styles.proofCopy}>
              <View>
                <Text style={styles.proofLabel}>Code verified</Text>
                <Text style={[styles.proofValue, styles.proofValueGreen]}>
                  4182
                </Text>
              </View>
              <View>
                <Text style={styles.proofLabel}>Received by</Text>
                <Text style={styles.proofValue}>Priya Sharma</Text>
              </View>
              <View>
                <Text style={styles.proofLabel}>Delivered at</Text>
                <Text style={styles.proofValue}>19:31</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Receipt · PRC-40218</Text>
          <Text style={styles.receiptMeta}>
            12 Sep 2026 · Portal on Bike · 6.4 km
          </Text>
          {FARE_ROWS.map(row => (
            <View key={row.id} style={styles.fareRow}>
              <Text style={styles.fareLabel}>{row.label}</Text>
              <Text style={styles.fareAmount}>₹{row.amount}</Text>
            </View>
          ))}
          <View style={styles.divider} />
          <View style={styles.paidRow}>
            <Text style={styles.paidLabel}>Paid with HDFC ....4821</Text>
            <Text style={styles.paidAmount}>₹41</Text>
          </View>
          <TouchableOpacity activeOpacity={0.7}
            onPress={() =>
              showToast({type: 'success', message: 'Receipt downloaded'})
            }
            hitSlop={8}>
            <Text style={styles.downloadText}>Download receipt</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>How was the delivery?</Text>
          <View style={styles.rateRow}>
            <View style={styles.stars}>
              {[1, 2, 3, 4, 5].map(star => (
                <TouchableOpacity activeOpacity={0.7}
                  key={star}
                  onPress={() => setRating(star)}
                  hitSlop={4}
                  accessibilityRole="button"
                  accessibilityLabel={`Rate ${star} stars`}>
                  <MaterialDesignIcons
                    name={star <= rating ? 'star' : 'star-outline'}
                    size={28}
                    color={colors.primary}
                  />
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity activeOpacity={0.7}
              onPress={() =>
                showToast({type: 'info', message: 'Tip the rider'})
              }
              hitSlop={8}>
              <Text style={styles.tipText}>Tip the rider</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          {paddingBottom: Math.max(insets.bottom, 12)},
        ]}>
        <TouchableOpacity activeOpacity={0.7}
          style={styles.sendBtn}
          onPress={sendAnother}
          accessibilityRole="button"
          accessibilityLabel="Send another package">
          <Text style={styles.sendText}>Send another package</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
