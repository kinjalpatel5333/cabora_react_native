import React, { useCallback, useState } from 'react';
import {Image, Platform, ScrollView, StatusBar, Text, View, TouchableOpacity} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Feather } from '@react-native-vector-icons/feather/static';
import { Lucide } from '@react-native-vector-icons/lucide/static';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { images } from '../../assets';
import { Button } from '../../components';
import { useToast } from '../../components/Toast';
import useThemedStyles from '../../components/useThemedStyles';
import { useApp } from '../../context/AppContext';
import createStyles from './style';
import colors from '../../config/color';

export default function DriverAirportQueueScreen() {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);
  const { colors } = useApp();
  const navigation = useNavigation();
  const { showToast } = useToast();

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle(colors.isDark ? 'light-content' : 'dark-content');
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor('transparent');
        StatusBar.setTranslucent(true);
      }
    }, [colors.isDark])
  );

  const [position, setPosition] = useState(14);
  const [waitMin, setWaitMin] = useState(38);

  const handleLeaveQueue = () => {
    navigation.navigate('DriverAirportTripSummary');
  };

  const handleRefresh = () => {
    showToast({
      title: 'Queue Updated',
      message: `Position #${position} · ~${waitMin} min wait`,
      type: 'success',
    });
  };

  return (
    <View style={styles.root}>
      <StatusBar
        barStyle={colors.isDark ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />

      {/* Map Backdrop */}
      <Image
        source={images.mapBackdrop}
        style={styles.mapImage}
        resizeMode="cover"
      />

      {/* Back Button */}
      <TouchableOpacity activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Go back"
        onPress={() => navigation.navigate('DriverTabs')}
        style={[styles.backBtn, { top: insets.top + 8 }]}>
        <Feather name="arrow-left" size={20} color={colors.text} />
      </TouchableOpacity>

      {/* Map Geofence Overlay */}
      <View
        style={[styles.mapZoneContainer, { top: insets.top + 50 }]}
        pointerEvents="none">
        <View style={styles.geofenceBox}>
          <View style={styles.zoneMarker} />
          <Text style={styles.zoneLabel}>Holding area · T2</Text>
        </View>
      </View>

      {/* Bottom Sheet Card */}
      <View style={styles.sheet}>
        {/* Drag Handle */}
        <View style={styles.dragHandleWrapper}>
          <View style={styles.dragHandleBar} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {/* Status Badge */}
          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Inside the holding area</Text>
          </View>

          {/* Heading */}
          <Text style={styles.sheetTitle}>You're in the airport queue</Text>

          {/* Hero Position Card */}
          <View style={styles.positionCard}>
            <View style={styles.posCircleBg} />
            <View style={styles.posLeft}>
              <Text style={styles.posLabel}>YOUR POSITION</Text>
              <Text style={styles.posNumber}>#{position}</Text>
              <Text style={styles.posSub}>in the Comfort queue</Text>
            </View>
            <View style={styles.posRight}>
              <View style={styles.posTopLine} />
              <Text style={styles.posLabel}>EST. WAIT</Text>
              <Text style={styles.waitValue}>
                {waitMin} <Text style={styles.waitMinText}>min</Text>
              </Text>
              <Text style={styles.waitSub}>6 cleared in 20 min</Text>
            </View>
          </View>

          {/* Vehicle Class Queue Breakdown */}
          <View style={styles.classCard}>
            <Text style={styles.classCardTitle}>Queue by vehicle class</Text>

            <View style={styles.classRow}>
              <Text style={styles.className}>Economy</Text>
              <Text style={styles.classWaiting}>22 waiting · ~54 min</Text>
            </View>

            <View style={styles.classRow}>
              <Text style={styles.classNameActive}>Comfort</Text>
              <Text style={styles.classWaitingActive}>14 waiting · ~38 min</Text>
            </View>

            <View style={styles.classRow}>
              <Text style={styles.className}>XL</Text>
              <Text style={styles.classWaiting}>5 waiting · ~16 min</Text>
            </View>
          </View>

          {/* Guidelines */}
          <View style={styles.guideCard}>
            <Text style={styles.guideTitle}>Keeping your place</Text>

            <View style={styles.guideItem}>
              <Lucide name="circle-check" size={16} color={colors.green[600]} />
              <Text style={styles.guideText}>Stay inside the holding area</Text>
            </View>

            <View style={styles.guideItem}>
              <Lucide name="triangle-alert" size={16} color={colors.amber[500]} />
              <Text style={styles.guideText}>
                Leaving the geofence drops your position
              </Text>
            </View>

            <View style={[styles.guideItem, { marginBottom: 2 }]}>
              <Lucide name="circle-check" size={16} color={colors.green[600]} />
              <Text style={styles.guideText}>
                Accept within 30 seconds when offered
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Fixed Footer Buttons */}
        <View
          style={[
            styles.footer,
            { paddingBottom: Math.max(insets.bottom, 12) + 4 },
          ]}>
          <Button
            title="Leave queue"
            variant="outline"
            onPress={handleLeaveQueue}
            style={styles.leaveBtn}
            textStyle={styles.leaveBtnText}
            fullWidth={false}
          />

          <Button
            title="Refresh"
            variant="primary"
            onPress={handleRefresh}
            style={styles.refreshBtn}
            textStyle={styles.refreshBtnText}
            fullWidth={false}
          />
        </View>
      </View>
    </View>
  );
}
