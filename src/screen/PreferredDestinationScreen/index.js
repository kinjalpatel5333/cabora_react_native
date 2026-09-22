import React, {useState} from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {AntDesign} from '@react-native-vector-icons/ant-design/static';
import {Feather} from '@react-native-vector-icons/feather/static';
import {Lucide} from '@react-native-vector-icons/lucide/static';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {images} from '../../assets';
import {Button, Toggle} from '../../components';
import useThemedStyles from '../../components/useThemedStyles';
import {useApp} from '../../context/AppContext';
import createStyles from './style';
import colors from '../../config/color';

import { DRIVER_MATCHING_RULES as MATCHING_RULES } from '../../config/staticData';

export default function PreferredDestinationScreen() {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);
  const {colors} = useApp();
  const navigation = useNavigation();
  const [headingOn, setHeadingOn] = useState(true);
  const usesLeft = 1;
  const usesTotal = 2;
  const usesPct = (usesLeft / usesTotal) * 100;

  return (
    <View style={[styles.root, {paddingTop: insets.top}]}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => navigation.goBack()}
          style={styles.headerBtn}
          hitSlop={8}>
          <AntDesign name="arrow-left" size={22} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Preferred destination</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Help"
          style={styles.headerBtn}
          hitSlop={8}>
          <Feather name="help-circle" size={22} color={colors.text} />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scroll,
          {paddingBottom: insets.bottom + 120},
        ]}>
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <View style={styles.cardCopy}>
              <Text style={styles.cardTitle}>Head toward a destination</Text>
              <Text style={styles.cardSub}>
                We only offer you rides going that way.
              </Text>
            </View>
            <Toggle
              value={headingOn}
              onValueChange={setHeadingOn}
              size="lg"
            />
          </View>
          {headingOn ? (
            <View style={styles.onBadge}>
              <View style={styles.onDot} />
              <Text style={styles.onBadgeText}>On</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.card}>
          <View style={styles.mapPreview}>
            <Image
              source={images.mapArea}
              style={styles.mapImage}
              resizeMode="cover"
            />
          </View>
          <View style={styles.destRow}>
            <Lucide name="map-pin" size={20} color={colors.orange[600]} />
            <View style={styles.destCopy}>
              <Text style={styles.destTitle}>Home · Jayanagar 4th Block</Text>
              <Text style={styles.destMeta}>14.2 km away · about 34 min</Text>
            </View>
            <Pressable accessibilityRole="button" hitSlop={8}>
              <Text style={styles.changeLink}>Change</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.usesTop}>
            <Text style={styles.cardTitle}>Uses left today</Text>
            <Text style={styles.usesCount}>
              {usesLeft} of {usesTotal}
            </Text>
          </View>
          <View style={styles.usesTrack}>
            <View style={[styles.usesFill, {width: `${usesPct}%`}]} />
          </View>
          <Text style={styles.usesHint}>
            Resets at midnight. Unused trips do not carry over.
          </Text>
          <View style={styles.infoRow}>
            <Feather name="info" size={14} color={colors.gray[500]} />
            <Text style={styles.infoText}>
              Cancelling a matched ride uses one up.
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={[styles.cardTitle, styles.rulesTitle]}>
            How matching works
          </Text>
          {MATCHING_RULES.map(rule => (
            <View key={rule.id} style={styles.ruleRow}>
              {rule.ok ? (
                <AntDesign
                  name="check-circle"
                  size={18}
                  color={colors.green[500]}
                />
              ) : (
                <Feather name="x-circle" size={18} color={colors.gray[400]} />
              )}
              <Text style={styles.ruleText}>{rule.text}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={[styles.footer, {paddingBottom: Math.max(insets.bottom, 16)}]}>
        <Text style={styles.footerHint}>
          Active for 90 minutes once you start
        </Text>
        <Button
          title="Start heading there"
          onPress={() => navigation.navigate('NewRideRequest')}
          style={styles.ctaBtn}
        />
      </View>
    </View>
  );
}
