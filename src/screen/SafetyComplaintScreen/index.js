import { PASSENGER_SAFETY_SERIOUS_LEVELS, PASSENGER_SAFETY_COMPLAINT_CATEGORIES } from '../../config/staticData';
import React, {useState} from 'react';
import {
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Feather} from '@react-native-vector-icons/feather/static';
import {Lucide} from '@react-native-vector-icons/lucide/static';
import {MaterialDesignIcons} from '@react-native-vector-icons/material-design-icons/static';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useToast} from '../../components/Toast';
import {useApp} from '../../context/AppContext';
import useThemedStyles from '../../components/useThemedStyles';
import createStyles from './style';
import colors from '../../config/color';

const SERIOUS_LEVELS = PASSENGER_SAFETY_SERIOUS_LEVELS;

const COMPLAINT_CATEGORIES = PASSENGER_SAFETY_COMPLAINT_CATEGORIES;

function CategoryIcon({item, isSelected, colors}) {
  const color = isSelected ? colors.primary : colors.textMuted;
  if (item.iconType === 'lucide') {
    return <Lucide name={item.icon} size={18} color={color} />;
  }
  if (item.iconType === 'mdi') {
    return (
      <MaterialDesignIcons
        name={item.icon}
        size={18}
        color={color}
      />
    );
  }
  return <Feather name={item.icon} size={18} color={color} />;
}

export default function SafetyComplaintScreen() {
  const insets = useSafeAreaInsets();
  const {colors} = useApp();
  const styles = useThemedStyles(createStyles);
  const navigation = useNavigation();
  const {showToast} = useToast();

  const [seriousLevel, setSeriousLevel] = useState('unsafe');
  const [selectedCategory, setSelectedCategory] = useState('driver');
  const [description, setDescription] = useState(
    'He kept taking calls and drove through a red light near Marathahalli bridge.',
  );

  const onSubmit = () => {
    showToast({type: 'success', message: 'Safety complaint submitted'});
    navigation.goBack();
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
        <Text style={styles.headerTitle}>Safety complaint</Text>
        <Pressable
          style={styles.headerBtn}
          onPress={() => navigation.navigate('Help')}
          accessibilityRole="button"
          accessibilityLabel="Help"
          hitSlop={8}>
          <Feather name="help-circle" size={22} color={colors.text} />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scroll,
          {paddingBottom: Math.max(insets.bottom, 16) + 20},
        ]}>
        <View style={styles.rideCard}>
          <View style={styles.rideTop}>
            <View style={styles.rideIcon}>
              <Lucide name="car" size={22} color={colors.text} />
            </View>
            <View style={styles.rideInfo}>
              <Text style={styles.rideTitle}>CBR-88214</Text>
              <Text style={styles.rideSub}>
                Today 18:42 · Indiranagar → Whitefield
              </Text>
            </View>
          </View>
          <View style={styles.driverRow}>
            <View style={styles.driverAvatar}>
              <Text style={styles.driverAvatarText}>SN</Text>
            </View>
            <Text style={styles.driverName}>Suresh Nair · KA 05 MJ 4821</Text>
          </View>
        </View>

        <View style={styles.seriousCard}>
          <Text style={styles.seriousTitle}>How serious was it?</Text>
          <View style={styles.seriousRow}>
            {SERIOUS_LEVELS.map(item => {
              const isSelected = seriousLevel === item.id;
              return (
                <Pressable
                  key={item.id}
                  style={[
                    styles.seriousChip,
                    isSelected && styles.seriousChipSelected,
                  ]}
                  onPress={() => setSeriousLevel(item.id)}
                  accessibilityRole="button"
                  accessibilityLabel={item.label}>
                  <Text
                    style={[
                      styles.seriousChipText,
                      isSelected && styles.seriousChipTextSelected,
                    ]}>
                    {item.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <Text style={styles.sectionLabel}>WHAT HAPPENED</Text>
        <View style={styles.categoriesGrid}>
          {COMPLAINT_CATEGORIES.map(item => {
            const isSelected = selectedCategory === item.id;
            return (
              <Pressable
                key={item.id}
                style={[
                  styles.categoryCard,
                  isSelected && styles.categoryCardSelected,
                ]}
                onPress={() => setSelectedCategory(item.id)}
                accessibilityRole="button"
                accessibilityLabel={item.label}>
                <View style={styles.categoryIcon}>
                  <CategoryIcon item={item} isSelected={isSelected} colors={colors} />
                </View>
                <Text
                  style={[
                    styles.categoryText,
                    isSelected && styles.categoryTextSelected,
                  ]}>
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.textCard}>
          <TextInput
            style={styles.textInput}
            multiline
            value={description}
            onChangeText={setDescription}
            placeholder="Tell us what happened in detail..."
            placeholderTextColor={colors.textMuted}
          />
        </View>

        <Pressable
          style={styles.attachBtn}
          onPress={() =>
            showToast({type: 'info', message: 'Attach evidence'})
          }
          accessibilityRole="button"
          accessibilityLabel="Attach evidence">
          <Feather name="paperclip" size={18} color={colors.textMuted} />
          <Text style={styles.attachBtnText}>Attach evidence (optional)</Text>
        </Pressable>

        <View style={styles.whatNextCard}>
          <Text style={styles.whatNextTitle}>What happens next</Text>
          <View style={styles.whatNextRow}>
            <Feather name="check-circle" size={16} color={colors.green[600]} />
            <Text style={styles.whatNextText}>
              Reviewed by the safety desk within 4 hours
            </Text>
          </View>
          <View style={[styles.whatNextRow, styles.whatNextRowLast]}>
            <Feather name="check-circle" size={16} color={colors.green[600]} />
            <Text style={styles.whatNextText}>
              The driver is not told who reported
            </Text>
          </View>
        </View>
      </ScrollView>

      <View
        style={[styles.footer, {paddingBottom: Math.max(insets.bottom, 12)}]}>
        <Pressable
          style={styles.submitBtn}
          onPress={onSubmit}
          accessibilityRole="button"
          accessibilityLabel="Submit complaint">
          <Text style={styles.submitText}>Submit complaint</Text>
        </Pressable>
      </View>
    </View>
  );
}
