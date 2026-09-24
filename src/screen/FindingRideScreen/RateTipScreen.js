import { PASSENGER_RATE_TIP_TAGS, PASSENGER_RATE_TIP_OPTIONS } from '../../config/staticData';
import React, {useMemo, useState} from 'react';
import {KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, View, TouchableOpacity} from 'react-native';
import {Feather} from '@react-native-vector-icons/feather/static';
import {MaterialDesignIcons} from '@react-native-vector-icons/material-design-icons/static';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Button} from '../../components';
import {useToast} from '../../components/Toast';
import useThemedStyles from '../../components/useThemedStyles';
import {useApp} from '../../context/AppContext';
import {rateRideApi} from '../../services/rideApi';
import createStyles from './rateTipStyle';

const TAGS = PASSENGER_RATE_TIP_TAGS;

const TIP_OPTIONS = PASSENGER_RATE_TIP_OPTIONS;

export default function RateTipScreen({
  rideId = '6aa28cc7e02cb357dd298432',
  driverName = 'Rajesh',
  driverInitials = 'RK',
  onClose,
  onSkip,
  onSubmit,
}) {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);
  const {colors} = useApp();
  const {showToast} = useToast();

  const [rating, setRating] = useState(5);
  const [selectedTags, setSelectedTags] = useState([
    'Safe driving',
    'Clean vehicle',
    'On time',
  ]);
  const [note, setNote] = useState('');
  const [tipId, setTipId] = useState(20);
  const [customTip, setCustomTip] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tipAmount = useMemo(() => {
    if (tipId === 'custom') {
      const n = Number(String(customTip).replace(/[^\d.]/g, ''));
      return Number.isFinite(n) && n > 0 ? n : null;
    }
    return tipId;
  }, [tipId, customTip]);

  const submitLabel = useMemo(() => {
    if (isSubmitting) {
      return 'Submitting...';
    }
    if (tipAmount != null) {
      return `Submit rating & pay ₹${tipAmount} tip`;
    }
    if (tipId === 'custom') {
      return 'Submit rating & tip';
    }
    return 'Submit rating';
  }, [tipAmount, tipId, isSubmitting]);

  const toggleTag = tag => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag],
    );
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const commentText =
      note.trim() ||
      (selectedTags.length > 0 ? selectedTags.join(', ') : 'Great ride');

    try {
      await rateRideApi(rideId, {
        rating,
        comment: commentText,
      });

      showToast({
        type: 'success',
        message: 'Rating submitted successfully!',
      });
    } catch (err) {
      console.warn('Rate ride error:', err);
      showToast({
        type: 'info',
        message: err?.message || 'Rating recorded',
      });
    } finally {
      setIsSubmitting(false);
      onSubmit?.({
        rating,
        tags: selectedTags,
        note: commentText,
        tip: tipAmount,
        rideId,
      });
    }
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
        <TouchableOpacity activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Close"
          style={styles.closeBtn}
          onPress={onClose}
          hitSlop={8}>
          <Feather name="x" size={20} color={colors.text} />
        </TouchableOpacity>

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
            <TouchableOpacity activeOpacity={0.7}
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
              />
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionLabel}>WHAT WENT WELL?</Text>
        <View style={styles.tagsWrap}>
          {TAGS.map(tag => {
            const selected = selectedTags.includes(tag);
            return (
              <TouchableOpacity activeOpacity={0.7}
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
              </TouchableOpacity>
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
              <TouchableOpacity activeOpacity={0.7}
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
              </TouchableOpacity>
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
        <Button
          title={submitLabel}
          onPress={handleSubmit}
          disabled={isSubmitting}
          style={styles.submitBtn}
          textStyle={styles.submitText}
        />
        <Button
          title="Not now"
          variant="ghost"
          onPress={onSkip}
          disabled={isSubmitting}
          style={styles.skipBtn}
          textStyle={styles.skipText}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
