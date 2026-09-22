import { PASSENGER_BOOK_FOR_OTHERS_RECEIVES } from '../../config/staticData';
import React, {useEffect, useState} from 'react';
import {Modal, Pressable, ScrollView, Text, View} from 'react-native';
import {Feather} from '@react-native-vector-icons/feather/static';
import {MaterialDesignIcons} from '@react-native-vector-icons/material-design-icons/static';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Toggle from '../../components/Toggle';
import useThemedStyles from '../../components/useThemedStyles';
import {useApp} from '../../context/AppContext';
import createStyles from './bookForSomeoneStyle';
import colors from '../../config/color';

const RECEIVES = PASSENGER_BOOK_FOR_OTHERS_RECEIVES;

export default function BookForSomeoneElseModal({
  visible,
  onClose,
  onBook,
  onChangePayment,
  riderName = 'Rohit Malhotra',
  riderInitials = 'RM',
  riderPhone = '+91 98110 44029',
  firstName = 'Rohit',
  pickupTitle = 'Koramangala 5th Block',
  dropTitle = 'Kempegowda Airport · T2',
  dropSub = '42.1 km · about 58 min',
  paymentLabel = 'HDFC ....4821',
  vehicleName = 'Comfort',
  fare = 1640,
}) {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);
  const {colors} = useApp();
  const [forSomeoneElse, setForSomeoneElse] = useState(true);

  useEffect(() => {
    if (visible) {
      setForSomeoneElse(true);
    }
  }, [visible]);

  const fareText = `₹${Number(fare).toLocaleString('en-IN')}`;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}>
      <View style={styles.root}>
        <View style={[styles.header, {paddingTop: insets.top + 4}]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            style={styles.headerBtn}
            onPress={onClose}
            hitSlop={8}>
            <Feather name="arrow-left" size={22} color={colors.text} />
          </Pressable>
          <Text style={styles.headerTitle}>Book for someone else</Text>
          <Pressable style={styles.headerBtn} hitSlop={8}>
            <Feather name="help-circle" size={22} color={colors.text} />
          </Pressable>
        </View>

        <ScrollView
          style={styles.scroll}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          <View style={styles.toggleCard}>
            <View style={styles.toggleIcon}>
              <MaterialDesignIcons
                name="account-multiple-plus"
                size={22}
                color={colors.orange[500]}
              />
            </View>
            <View style={styles.toggleCopy}>
              <Text style={styles.toggleTitle}>
                This ride is for someone else
              </Text>
              <Text style={styles.toggleSub}>
                They get the driver details by SMS
              </Text>
            </View>
            <Toggle value={forSomeoneElse} onValueChange={setForSomeoneElse} />
          </View>

          <Text style={styles.sectionLabel}>WHO IS RIDING</Text>
          <View style={styles.card}>
            <View style={styles.riderRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{riderInitials}</Text>
              </View>
              <View style={styles.riderCopy}>
                <Text style={styles.riderName}>{riderName}</Text>
                <Text style={styles.riderPhone}>{riderPhone}</Text>
              </View>
              <Pressable hitSlop={8}>
                <Text style={styles.changeText}>Change</Text>
              </Pressable>
            </View>
            <View style={styles.riderFooter}>
              <Feather name="users" size={14} color={colors.muted} />
              <Text style={styles.riderFooterText}>
                Picked from your contacts
              </Text>
            </View>
          </View>

          <Text style={styles.sectionLabel}>ROUTE</Text>
          <View style={styles.card}>
            <View style={styles.routeRow}>
              <View style={styles.timeline}>
                <View style={styles.pickupDot} />
                <View style={styles.timelineLine} />
                <View style={styles.dropDot} />
              </View>
              <View style={styles.routeCopy}>
                <View>
                  <Text style={styles.routeTitle} numberOfLines={1}>
                    {pickupTitle}
                  </Text>
                  <Text style={styles.routeSub}>
                    {firstName}'s pickup point
                  </Text>
                </View>
                <View>
                  <Text style={styles.routeTitle} numberOfLines={1}>
                    {dropTitle}
                  </Text>
                  <Text style={styles.routeSub}>{dropSub}</Text>
                </View>
              </View>
              <Pressable style={styles.editBtn} hitSlop={8} onPress={onClose}>
                <Feather name="edit-2" size={18} color={colors.text} />
              </Pressable>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.receivesTitle}>
              What {firstName} receives
            </Text>
            {RECEIVES.map(item => (
              <View key={item} style={styles.receiveRow}>
                <MaterialDesignIcons
                  name="check-circle"
                  size={18}
                  color={colors.green[600]}
                />
                <Text style={styles.receiveText}>{item}</Text>
              </View>
            ))}
          </View>

          <View style={styles.card}>
            <View style={styles.paymentRow}>
              <View style={styles.paymentIcon}>
                <Feather name="credit-card" size={18} color={colors.text} />
              </View>
              <View style={styles.paymentCopy}>
                <Text style={styles.paymentTitle}>
                  You pay · {paymentLabel}
                </Text>
                <Text style={styles.paymentSub}>
                  {firstName} is not asked for payment
                </Text>
              </View>
              <Pressable hitSlop={8} onPress={onChangePayment}>
                <Text style={styles.changeText}>Change</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>

        <View
          style={[styles.footer, {paddingBottom: Math.max(insets.bottom, 14)}]}>
          <View style={styles.fareCol}>
            <Text style={styles.fareLabel}>
              Estimated fare · {vehicleName}
            </Text>
            <Text style={styles.fareValue}>{fareText}</Text>
            <Text style={styles.fareNote}>
              Charged to you when the trip ends
            </Text>
          </View>
          <Pressable style={styles.bookBtn} onPress={onBook}>
            <Text style={styles.bookText}>Book</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
