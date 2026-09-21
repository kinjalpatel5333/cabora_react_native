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
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useToast} from '../../components/Toast';
import {useApp} from '../../context/AppContext';
import useThemedStyles from '../../components/useThemedStyles';
import createStyles from './style';

const SUB_CATEGORIES = [
  {id: 'waiting', label: 'Charged for waiting'},
  {id: 'surge', label: 'Surge unexpected'},
  {id: 'toll', label: 'Toll added'},
  {id: 'promo', label: 'Promo not applied'},
];

export default function ReportIssueScreen() {
  const insets = useSafeAreaInsets();
  const {colors} = useApp();
  const styles = useThemedStyles(createStyles);
  const navigation = useNavigation();
  const {showToast} = useToast();

  const [selectedSub, setSelectedSub] = useState('surge');
  const [description, setDescription] = useState(
    "The app quoted \u20B9198 before I booked but I was charged \u20B9241.50. I don't think there was any surge at 12:00 pm on a Thursday.",
  );

  const onSubmit = () => {
    showToast({type: 'success', message: 'Ticket submitted successfully'});
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
        <Text style={styles.headerTitle}>Report an issue</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scroll,
          {paddingBottom: Math.max(insets.bottom, 16) + 20},
        ]}>
        <View style={styles.ticketCard}>
          <View style={styles.ticketIcon}>
            <Feather name="file-text" size={18} color={colors.isDark ? '#FF9A4A' : '#B45309'} />
          </View>
          <View style={styles.ticketBody}>
            <Text style={styles.ticketTitle}>Ticket #CB-40218 is open</Text>
            <Text style={styles.ticketSub}>Lost item · replied 3 hours ago</Text>
          </View>
          <View style={styles.ticketStatus}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>In review</Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>WHICH TRIP?</Text>
        <Pressable
          style={styles.tripCard}
          onPress={() => showToast({type: 'info', message: 'Choose trip'})}
          accessibilityRole="button"
          accessibilityLabel="Trip selection">
          <View style={styles.tripIconWrap}>
            <Lucide name="car" size={18} color={colors.text} />
          </View>
          <View style={styles.tripBody}>
            <Text style={styles.tripTitle}>Today 12:24 pm · Airport T2</Text>
            <Text style={styles.tripSub}>
              Cab Sedan · ₹241.50 · CBR8241905
            </Text>
          </View>
          <Feather name="chevron-down" size={18} color={colors.textMuted} />
        </Pressable>

        <Text style={styles.sectionLabel}>ISSUE CATEGORY · REQUIRED</Text>
        <Pressable
          style={styles.categoryDropdown}
          onPress={() =>
            showToast({type: 'info', message: 'Select issue category'})
          }
          accessibilityRole="button"
          accessibilityLabel="Issue category">
          <Text style={styles.categoryText}>Fare looks wrong</Text>
          <Feather name="chevron-down" size={20} color="#FF7006" />
        </Pressable>

        <View style={styles.subCategoriesWrap}>
          {SUB_CATEGORIES.map(item => {
            const isSelected = selectedSub === item.id;
            return (
              <Pressable
                key={item.id}
                style={[
                  styles.subPill,
                  isSelected && styles.subPillSelected,
                ]}
                onPress={() => setSelectedSub(item.id)}
                accessibilityRole="button"
                accessibilityLabel={item.label}>
                <Text
                  style={[
                    styles.subPillText,
                    isSelected && styles.subPillTextSelected,
                  ]}>
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.sectionRow}>
          <Text style={styles.sectionLabel}>WHAT HAPPENED? · REQUIRED</Text>
          <Text style={styles.charCount}>{`${description.length} / 500`}</Text>
        </View>
        <View style={styles.textCard}>
          <TextInput
            style={styles.textInput}
            multiline
            value={description}
            onChangeText={setDescription}
            placeholder="Describe what happened..."
            placeholderTextColor={colors.textMuted}
            maxLength={500}
          />
        </View>

        <Text style={styles.sectionLabel}>ATTACHMENTS · OPTIONAL</Text>
        <View style={styles.attachmentsRow}>
          <View style={styles.fileBox}>
            <Feather name="file-text" size={20} color={colors.textMuted} />
          </View>
          <Pressable
            style={styles.addBox}
            onPress={() =>
              showToast({type: 'info', message: 'Attach image or file'})
            }
            accessibilityRole="button"
            accessibilityLabel="Add attachment">
            <Feather name="camera" size={16} color={colors.textMuted} />
            <Text style={styles.addText}>Add</Text>
          </Pressable>
        </View>
      </ScrollView>

      <View
        style={[styles.footer, {paddingBottom: Math.max(insets.bottom, 12)}]}>
        <Pressable
          style={styles.submitBtn}
          onPress={onSubmit}
          accessibilityRole="button"
          accessibilityLabel="Submit ticket">
          <Text style={styles.submitText}>Submit ticket</Text>
        </Pressable>
        <Text style={styles.replyHint}>
          Most tickets get a first reply within 4 hours.
        </Text>
      </View>
    </View>
  );
}
