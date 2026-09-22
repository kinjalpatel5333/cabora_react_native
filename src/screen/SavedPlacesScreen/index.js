import { PASSENGER_SAVED_PLACES } from '../../config/staticData';
import React, {useEffect, useMemo, useState} from 'react';
import {
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Feather} from '@react-native-vector-icons/feather/static';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useToast} from '../../components/Toast';
import useThemedStyles from '../../components/useThemedStyles';
import {useApp} from '../../context/AppContext';
import createStyles from './style';
import colors from '../../config/color';

const INITIAL_PLACES = PASSENGER_SAVED_PLACES;

export default function SavedPlacesScreen() {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);
  const {colors} = useApp();
  const navigation = useNavigation();
  const route = useRoute();
  const {showToast} = useToast();
  const [query, setQuery] = useState('');
  const [places, setPlaces] = useState(INITIAL_PLACES);

  useEffect(() => {
    const action = route.params?.placeAction;
    if (!action?.place) {
      return;
    }

    setPlaces(prev => {
      const idx = prev.findIndex(p => p.id === action.place.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = {...next[idx], ...action.place};
        return next;
      }
      return [action.place, ...prev];
    });

    navigation.setParams({placeAction: undefined});
  }, [navigation, route.params?.placeAction]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return places;
    }
    return places.filter(
      p =>
        p.name.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q) ||
        (p.tag && p.tag.toLowerCase().includes(q)),
    );
  }, [places, query]);

  const pinned = filtered.filter(p => p.section === 'pinned');
  const other = filtered.filter(p => p.section === 'other');

  const onDelete = id => {
    setPlaces(prev => prev.filter(p => p.id !== id));
    showToast({type: 'success', message: 'Place removed'});
  };

  const openSave = (mode, place) => {
    navigation.navigate('SaveThisPlace', {mode, place});
  };

  const renderPlace = place => {
    const iconBg =
      place.tone === 'orange' ? colors.orange[100] : colors.gray[100];
    const iconColor =
      place.tone === 'orange' ? colors.orange[600] : colors.navy[700];
    const description = place.landmark
      ? `${place.landmark} · ${place.address}`
      : place.address;

    return (
      <View key={place.id} style={styles.placeCard}>
        <View style={[styles.placeIcon, {backgroundColor: iconBg}]}>
          <Feather name={place.icon} size={18} color={iconColor} />
        </View>
        <View style={styles.placeCopy}>
          <View style={styles.placeTitleRow}>
            <Text style={styles.placeName} numberOfLines={1}>
              {place.name}
            </Text>
            {place.tag ? (
              <View style={styles.tagPill}>
                <Text style={styles.tagText}>{place.tag}</Text>
              </View>
            ) : null}
          </View>
          <Text style={styles.placeAddress} numberOfLines={2}>
            {description}
          </Text>
        </View>
        <Pressable
          style={styles.actionBtn}
          onPress={() => openSave('edit', place)}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={`Edit ${place.name}`}>
          <Feather name="edit-2" size={16} color={colors.gray[500]} />
        </Pressable>
        <Pressable
          style={styles.actionBtn}
          onPress={() => onDelete(place.id)}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={`Delete ${place.name}`}>
          <Feather name="trash-2" size={16} color={colors.red[500]} />
        </Pressable>
      </View>
    );
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
        <Text style={styles.headerTitle}>Saved places</Text>
        <View style={styles.headerBtn} />
      </View>

      <View style={styles.searchBox}>
        <Feather name="search" size={18} color={colors.muted} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search your saved places"
          placeholderTextColor={colors.muted}
          style={styles.searchInput}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.scroll,
          {paddingBottom: Math.max(insets.bottom, 12) + 90},
        ]}>
        {pinned.length > 0 ? (
          <>
            <Text style={styles.sectionLabel}>PINNED</Text>
            <View style={styles.list}>{pinned.map(renderPlace)}</View>
          </>
        ) : null}

        {other.length > 0 ? (
          <>
            <Text
              style={[
                styles.sectionLabel,
                pinned.length > 0 && styles.sectionSpaced,
              ]}>
              OTHER PLACES
            </Text>
            <View style={styles.list}>{other.map(renderPlace)}</View>
          </>
        ) : null}

        {filtered.length === 0 ? (
          <Text style={styles.emptyText}>No places match your search</Text>
        ) : null}
      </ScrollView>

      <View
        style={[
          styles.footer,
          {paddingBottom: Math.max(insets.bottom, 12)},
        ]}>
        <Pressable
          style={styles.addBtn}
          onPress={() => openSave('add')}
          accessibilityRole="button"
          accessibilityLabel="Add a place">
          <Text style={styles.addText}>Add a place</Text>
        </Pressable>
      </View>
    </View>
  );
}
