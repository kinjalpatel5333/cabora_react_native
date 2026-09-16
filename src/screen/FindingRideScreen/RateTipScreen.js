import React, {useMemo, useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import {Feather} from '@react-native-vector-icons/feather/static';
import {MaterialDesignIcons} from '@react-native-vector-icons/material-design-icons/static';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import useThemedStyles from '../../components/useThemedStyles';
import {useApp} from '../../context/AppContext';
import createStyles from './rateTipStyle';

const TAGS = [
  'Safe driving',
  'Clean vehicle',
  'Polite',
  'On time',
  'Great route',
];

const TIP_OPTIONS = [
  {id: 10, label: '₹10'},
  {id: 20, label: '₹20'},
  {id: 50, label: '₹50'},
  {id: 'custom', label: 'Custom'},
];

export default function RateTipScreen({
  driverName = 'Rajesh',
  driverInitials = 'RK',
  onClose,
  onSkip,
  onSubmit,
}) {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);
  const {colors} = useApp();

  const [rating, setRating] = useState(5);
  const [selectedTags, setSelectedTags] = useState([
    'Safe driving',
    'Clean vehicle',
    'On time',
  ]);
  const [note, setNote] = useState('');
  const [tipId, setTipId] = useState(20);
  const [customTip, setCustomTip] = useState('');

  const tipAmount = useMemo(() => {
    if (tipId === 'custom') {
      const n = Number(String(customTip).replace(/[^\d.]/g, ''));
      return Number.isFinite(n) && n > 0 ? n : null;
    }
    return tipId;
  }, [tipId, customTip]);

  const submitLabel = useMemo(() => {
    if (tipAmount != null) {
      return `Submit rating & pay ₹${tipAmount} tip`;
    }
    if (tipId === 'custom') {
      return 'Submit rating & tip';
    }
    return 'Submit rating';
  }, [tipAmount, tipId]);

  const toggleTag = tag => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag],
    );
  };

  const handleSubmit = () => {
    onSubmit?.({
      rating,
      tags: selectedTags,
      note: note.trim(),
      tip: tipAmount,
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        style={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          {paddingTop: insets.top + 8},
        ]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close"
          style={styles.closeBtn}
          onPress={onClose}
          hitSlop={8}>
          <Feather name="x" size={20} color={colors.navy[800]} />
        </Pressable>

        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{driverInitials}</Text>
        </View>

        <Text style={styles.title}>
          How was your ride with {driverName}?
        </Text>
        <Text style={styles.subtitle}>
          Your rating is anonymous and helps keep Cabora safe.
        </Text>

        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map(value => (
            <Pressable
              key={value}
              style={styles.starHit}
              onPress={() => setRating(value)}
              hitSlop={6}>
              <MaterialDesignIcons
                name={value <= rating ? 'star' : 'star-outline'}
                size={36}
                color={
                  value <= rating ? colors.amber[500] : colors.gray[300]
                }
              />            </Pressable>
          ))}
        </View>

        <Text style={styles.sectionLabel}>WHAT WENT WELL?</Text>
        <View style={styles.tagsWrap}>
          {TAGS.map(tag => {
            const selected = selectedTags.includes(tag);
            return (
              <Pressable
                key={tag}
                onPress={() => toggleTag(tag)}
                style={[styles.tag, selected && styles.tagSelected]}>
                <Text
                  style={[
                    styles.tagText,
                    selected && styles.tagTextSelected,
                  ]}>
                  {tag}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <TextInput
          style={styles.noteInput}
          placeholder={`Add a note for ${driverName} (optional)`}
          placeholderTextColor={colors.gray[400]}
          value={note}
          onChangeText={setNote}
          multiline
        />

        <Text style={styles.sectionLabel}>ADD A TIP</Text>
        <View style={styles.tipRow}>
          {TIP_OPTIONS.map(opt => {
            const selected = tipId === opt.id;
            return (
              <Pressable
                key={String(opt.id)}
                onPress={() => setTipId(opt.id)}
                style={[styles.tipBtn, selected && styles.tipBtnSelected]}>
                <Text
                  style={[
                    styles.tipText,
                    selected && styles.tipTextSelected,
                  ]}>
                  {opt.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {tipId === 'custom' ? (
          <TextInput
            style={styles.customInput}
            placeholder="Enter tip amount"
            placeholderTextColor={colors.gray[400]}
            keyboardType="numeric"
            value={customTip}
            onChangeText={setCustomTip}
          />
        ) : null}
      </ScrollView>

      <View style={[styles.footer, {paddingBottom: Math.max(insets.bottom, 16)}]}>
        <Pressable style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitText}>{submitLabel}</Text>
        </Pressable>
        <Pressable style={styles.skipBtn} onPress={onSkip}>
          <Text style={styles.skipText}>Not now</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
