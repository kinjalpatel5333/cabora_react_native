import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@react-native-vector-icons/ant-design/static';
import { Feather } from '@react-native-vector-icons/feather/static';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../components/Toast';
import useThemedStyles from '../../components/useThemedStyles';
import createStyles from './style';

const VEHICLE_ITEMS = [
  { id: 'tyres', title: 'Tyres have visible tread and correct pressure' },
  { id: 'brakes', title: 'Brakes and handbrake working' },
  { id: 'lights', title: 'Headlights, indicators and horn working' },
  { id: 'mirrors', title: 'Windscreen and mirrors clean' },
];

const IN_CAR_ITEMS = [
  { id: 'firstaid', title: 'First-aid kit present and sealed' },
  { id: 'extinguisher', title: 'Fire extinguisher in date' },
  { id: 'cabin', title: 'Cabin clean, no strong odour' },
  { id: 'emergency', title: 'Emergency numbers sticker visible' },
];

export default function DriverDailySafetyCheckScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { colors } = useApp();
  const styles = useThemedStyles(createStyles);
  const { showToast } = useToast();

  const [checked, setChecked] = useState({
    tyres: true,
    brakes: true,
    lights: true,
    mirrors: false,
    firstaid: true,
    extinguisher: true,
    cabin: false,
    emergency: false,
  });

  const toggleCheck = id => {
    setChecked(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const totalCount = VEHICLE_ITEMS.length + IN_CAR_ITEMS.length;
  const completedCount = Object.values(checked).filter(Boolean).length;
  const percent = Math.round((completedCount / totalCount) * 100);
  const remainingCount = totalCount - completedCount;

  const handleHelp = () => {
    showToast({
      title: 'Safety Guidelines',
      message: 'Daily vehicle inspection ensures driver and rider safety.',
      type: 'info',
    });
  };

  return (
    <View style={styles.root}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.white}
        translucent={false}
      />

      {/* Header Bar */}
      <View
        style={[
          styles.header,
          { paddingTop: insets.top > 0 ? insets.top : 8 },
        ]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => navigation.goBack()}
          style={styles.headerIconBtn}>
          <Feather name="arrow-left" size={22} color={colors.slate[900]} />
        </Pressable>

        <Text style={styles.headerTitle}>Daily safety check</Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Help"
          onPress={handleHelp}
          style={styles.headerIconBtn}>
          <Feather name="help-circle" size={22} color={colors.slate[900]} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Top Progress Card */}
        <View style={styles.progressCard}>
          <View style={styles.progressTopRow}>
            <Text style={styles.progressTitle}>
              {completedCount} of {totalCount} checks complete
            </Text>
            <Text style={styles.progressPercent}>{percent}%</Text>
          </View>
          <Text style={styles.progressSub}>
            Finish the list to go online today
          </Text>

          <View style={styles.track}>
            <View style={[styles.fill, { width: `${percent}%` }]} />
          </View>
        </View>

        {/* VEHICLE Section */}
        <Text style={styles.sectionTitle}>VEHICLE</Text>
        <View style={styles.itemsList}>
          {VEHICLE_ITEMS.map(item => {
            const isDone = Boolean(checked[item.id]);

            return (
              <Pressable
                key={item.id}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: isDone }}
                onPress={() => toggleCheck(item.id)}
                style={[styles.checkCard, isDone && styles.checkCardDone]}>
                <View style={styles.checkLeft}>
                  {isDone ? (
                    <AntDesign name="check-circle" size={19} color={colors.green[600]} />
                  ) : (
                    <Feather name="x-circle" size={19} color={colors.slate[300]} />
                  )}
                  <Text style={styles.checkText}>{item.title}</Text>
                </View>
                {isDone && <Text style={styles.doneText}>Done</Text>}
              </Pressable>
            );
          })}
        </View>

        {/* IN THE CAR Section */}
        <Text style={styles.sectionTitle}>IN THE CAR</Text>
        <View style={styles.itemsList}>
          {IN_CAR_ITEMS.map(item => {
            const isDone = Boolean(checked[item.id]);

            return (
              <Pressable
                key={item.id}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: isDone }}
                onPress={() => toggleCheck(item.id)}
                style={[styles.checkCard, isDone && styles.checkCardDone]}>
                <View style={styles.checkLeft}>
                  {isDone ? (
                    <AntDesign name="check-circle" size={19} color={colors.green[600]} />
                  ) : (
                    <Feather name="x-circle" size={19} color={colors.slate[300]} />
                  )}
                  <Text style={styles.checkText}>{item.title}</Text>
                </View>
                {isDone && <Text style={styles.doneText}>Done</Text>}
              </Pressable>
            );
          })}
        </View>

        {/* Warning / Ready Bottom Card */}
        {remainingCount > 0 ? (
          <View style={styles.warningCard}>
            <Feather name="alert-circle" size={18} color={colors.amber[600]} />
            <Text style={styles.warningText}>
              {remainingCount} {remainingCount === 1 ? 'check' : 'checks'} left before you can go online.
            </Text>
          </View>
        ) : (
          <View style={styles.successCard}>
            <AntDesign name="check-circle" size={18} color={colors.green[600]} />
            <Text style={styles.successText}>
              All checks complete! You're ready to go online.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
