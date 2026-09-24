import { PASSENGER_SAVE_PLACE_LABELS } from '../../config/staticData';
import React, {useEffect, useState} from 'react';
import {KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, View, TouchableOpacity} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Feather} from '@react-native-vector-icons/feather/static';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Button} from '../../components';
import {useToast} from '../../components/Toast';
import useThemedStyles from '../../components/useThemedStyles';
import {useApp} from '../../context/AppContext';
import {addSavedAddressApi, deleteSavedAddressApi} from '../../services/userApi';
import createStyles from './style';
import colors from '../../config/color';

const LABELS = PASSENGER_SAVE_PLACE_LABELS;

const DEFAULT_ADDRESS =
  '48, 4th Cross Road, Jayanagar 4th Block, Bengaluru, Karnataka 560011';

function labelMeta(labelId) {
  if (labelId === 'home') {
    return {icon: 'home', section: 'pinned', tone: 'orange', tag: 'Default pickup'};
  }
  if (labelId === 'work') {
    return {
      icon: 'briefcase',
      section: 'pinned',
      tone: 'orange',
      tag: 'Weekday mornings',
    };
  }
  return {icon: 'map-pin', section: 'other', tone: 'gray', tag: null};
}

export default function SaveThisPlaceScreen() {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);
  const {colors} = useApp();
  const navigation = useNavigation();
  const route = useRoute();
  const {showToast} = useToast();

  const place = route.params?.place;
  const isEdit = route.params?.mode === 'edit';

  const [label, setLabel] = useState('other');
  const [placeName, setPlaceName] = useState('');
  const [landmark, setLandmark] = useState('');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (place) {
      if (place.icon === 'home' || place.id === 'home') {
        setLabel('home');
      } else if (place.icon === 'briefcase' || place.id === 'work') {
        setLabel('work');
      } else {
        setLabel('other');
      }
      setPlaceName(place.name || '');
      setLandmark(place.landmark || '');
      setNote(place.note || '');
      return;
    }
    setLabel('other');
    setPlaceName('');
    setLandmark('');
    setNote('');
  }, [place]);

  const address = place?.address || DEFAULT_ADDRESS;
  const canSave = placeName.trim().length > 0;

  const onDelete = async () => {
    const targetId = place?.raw?._id || place?.raw?.id || place?.id;
    if (!targetId || deleting) {
      return;
    }
    setDeleting(true);
    try {
      await deleteSavedAddressApi(targetId);
      showToast({type: 'success', message: 'Place removed successfully'});
      navigation.navigate({
        name: 'SavedPlaces',
        params: {placeAction: {type: 'delete', placeId: targetId}},
        merge: true,
      });
    } catch (err) {
      console.warn('deleteSavedAddressApi error:', err);
      showToast({
        type: 'error',
        message: err?.message || 'Failed to remove place',
      });
    } finally {
      setDeleting(false);
    }
  };

  const onSave = async () => {
    if (!canSave || saving) {
      return;
    }
    setSaving(true);
    const meta = labelMeta(label);
    const fullAddress = landmark.trim() ? `${landmark.trim()}, ${address}` : address;
    const apiLabel = label === 'other' ? (placeName.trim().toUpperCase() || 'OTHER') : label.toUpperCase();

    let createdPlace = null;
    try {
      const res = await addSavedAddressApi({
        label: apiLabel,
        address: fullAddress,
        lat: place?.latitude || place?.lat || 12.9716,
        lng: place?.longitude || place?.lng || 77.5946,
      });
      createdPlace = res?.data || res;
    } catch (err) {
      console.warn('addSavedAddressApi error:', err);
    } finally {
      setSaving(false);
    }

    const saved = {
      id: createdPlace?._id || createdPlace?.id || place?.id || `place_${Date.now()}`,
      name: placeName.trim(),
      address: fullAddress,
      landmark: landmark.trim(),
      note: note.trim(),
      icon: meta.icon,
      section: meta.section,
      tone: meta.tone,
      tag: place?.tag ?? meta.tag,
    };

    showToast({
      type: 'success',
      message: isEdit ? 'Place updated' : 'Place saved',
    });

    navigation.navigate({
      name: 'SavedPlaces',
      params: {placeAction: {type: 'upsert', place: saved}},
      merge: true,
    });
  };

  return (
    <View style={styles.root}>

      <View style={styles.mapArea}>
        <View style={styles.roadH} />
        <View style={styles.roadV} />
        <View style={styles.roadH2} />
        <View style={styles.blockA} />
        <View style={styles.blockB} />
        <View style={styles.pinWrap}>
          <View style={styles.pinShadow} />
          <Feather name="map-pin" size={36} color={colors.navy[800]} />
        </View>
        <View style={styles.dragHint}>
          <View style={styles.dragDot} />
          <Text style={styles.dragText}>Drag the map to adjust</Text>
        </View>
        <TouchableOpacity activeOpacity={0.7}
          style={[styles.backBtn, {top: insets.top + 8}]}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={8}>
          <Feather name="arrow-left" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.sheet}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}>
        <View style={[styles.sheetInner, {paddingBottom: Math.max(insets.bottom, 12)}]}>
          <View style={styles.grabber} />
          <Text style={styles.title}>Save this place</Text>

          <View style={styles.addressBox}>
            <Feather name="map-pin" size={18} color={colors.orange[500]} />
            <Text style={styles.addressText}>{address}</Text>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            bounces={false}
            contentContainerStyle={styles.form}>
            <Text style={styles.sectionLabel}>LABEL</Text>
            <View style={styles.labelRow}>
              {LABELS.map(item => {
                const active = label === item.id;
                return (
                  <TouchableOpacity activeOpacity={0.7}
                    key={item.id}
                    style={[styles.labelChip, active && styles.labelChipActive]}
                    onPress={() => setLabel(item.id)}>
                    <Feather
                      name={item.icon}
                      size={15}
                      color={active ? colors.orange[600] : colors.navy[800]}
                    />
                    <Text
                      style={[
                        styles.labelChipText,
                        active && styles.labelChipTextActive,
                      ]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Place name</Text>
              <View style={styles.fieldBox}>
                <TextInput
                  value={placeName}
                  onChangeText={setPlaceName}
                  style={styles.fieldInput}
                  placeholder="e.g. Mum's place"
                  placeholderTextColor={colors.gray[400]}
                />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Flat / door / landmark</Text>
              <View style={styles.fieldBox}>
                <TextInput
                  value={landmark}
                  onChangeText={setLandmark}
                  style={styles.fieldInput}
                  placeholder="Flat, door or landmark"
                  placeholderTextColor={colors.gray[400]}
                />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                Note for the driver (optional)
              </Text>
              <View style={styles.fieldBox}>
                <TextInput
                  value={note}
                  onChangeText={setNote}
                  style={styles.fieldInput}
                  placeholder="Call when you reach the gate"
                  placeholderTextColor={colors.gray[400]}
                />
              </View>
            </View>
          </ScrollView>

          <View style={{flexDirection: 'row', gap: 10, marginTop: 4}}>
            {isEdit ? (
              <Button
                title={deleting ? 'Removing...' : 'Delete'}
                variant="outline"
                disabled={deleting || saving}
                loading={deleting}
                onPress={onDelete}
                style={{flex: 1, borderColor: colors.red[300]}}
                textStyle={{color: colors.red[600]}}
                accessibilityLabel="Delete place"
              />
            ) : null}
            <Button
              title={isEdit ? 'Update place' : 'Save place'}
              disabled={!canSave || deleting}
              loading={saving}
              onPress={onSave}
              style={{flex: isEdit ? 2 : 1}}
              accessibilityLabel="Save place"
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
