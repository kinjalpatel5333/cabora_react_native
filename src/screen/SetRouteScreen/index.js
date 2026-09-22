import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import {Feather} from '@react-native-vector-icons/feather/static';
import {Lucide} from '@react-native-vector-icons/lucide/static';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import useThemedStyles from '../../components/useThemedStyles';
import {useApp} from '../../context/AppContext';
import useDraggableSheet from '../../hooks/useDraggableSheet';
import createStyles from './style';
import YourRouteModal from './YourRouteModal';
import colors from '../../config/color';

const DEFAULT_PICKUP = '12, Brigade Road, Ashok Nagar';

const RECENT_SAVED = [
  {
    id: 'home',
    title: 'Home',
    subtitle: '12, Brigade Road, Ashok Nagar',
    icon: 'home',
    address: '12, Brigade Road, Ashok Nagar',
  },
  {
    id: 'work',
    title: 'Work',
    subtitle: 'Prestige Tech Park, Marathahalli',
    icon: 'briefcase',
    address: 'Prestige Tech Park, Marathahalli',
  },
  {
    id: 'airport',
    title: 'Kempegowda Intl. Airport',
    subtitle: 'Terminal 2, Devanahalli · 38 km',
    icon: 'navigation',
    address: 'Kempegowda Intl. Airport, Terminal 2',
  },
  {
    id: 'phoenix',
    title: 'Phoenix Marketcity',
    subtitle: 'Whitefield Main Rd · 16 km',
    icon: 'map-pin',
    address: 'Phoenix Marketcity, Whitefield',
  },
];

const SUGGESTIONS = [
  {
    id: 'indira-100',
    title: 'Indiranagar 100 Feet Road',
    subtitle: 'Indiranagar, Bengaluru · 4.2 km',
    address: 'Indiranagar 100 Feet Road',
  },
  {
    id: 'indira-metro',
    title: 'Indiranagar Metro Station',
    subtitle: '100 Feet Rd, Indiranagar · 4.5 km',
    address: 'Indiranagar Metro Station',
  },
  {
    id: 'indira-double',
    title: 'Indira Nagar Double Road',
    subtitle: 'Indiranagar, Bengaluru · 4.8 km',
    address: 'Indira Nagar Double Road',
  },
  {
    id: 'indira-fountain',
    title: 'Indira Gandhi Musical Fountain',
    subtitle: 'Cubbon Park · 6.1 km',
    address: 'Indira Gandhi Musical Fountain',
  },
  {
    id: 'mg-road',
    title: 'MG Road Metro Station',
    subtitle: 'MG Road, Bengaluru · 2.1 km',
    address: 'MG Road Metro Station',
  },
  {
    id: 'church',
    title: 'Church Street',
    subtitle: 'Shivaji Nagar, Bengaluru · 1.8 km',
    address: 'Church Street',
  },
  {
    id: 'koramangala',
    title: 'Koramangala 5th Block',
    subtitle: 'Koramangala, Bengaluru · 7.4 km',
    address: 'Koramangala 5th Block',
  },
  {
    id: 'nandi',
    title: 'Nandi Hills Summit',
    subtitle: 'Chikkaballapur · 60 km',
    address: 'Nandi Hills Summit',
    outOfArea: true,
    areaLabel: 'Nandi Hills',
  },
  {
    id: 'mysore',
    title: 'Mysore Palace',
    subtitle: 'Mysuru · 145 km',
    address: 'Mysore Palace',
    outOfArea: true,
    areaLabel: 'Mysore',
  },
  {
    id: 'coorg',
    title: 'Coorg Madikeri',
    subtitle: 'Kodagu · 260 km',
    address: 'Coorg Madikeri',
    outOfArea: true,
    areaLabel: 'Coorg',
  },
];

const SAME_PLACE_ALTS = RECENT_SAVED.filter(
  item => item.id === 'work' || item.id === 'airport',
);

function normalizePlace(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/,/g, ' ')
    .replace(/\s+/g, ' ');
}

function placesMatch(a, b) {
  const left = normalizePlace(a);
  const right = normalizePlace(b);
  if (!left || !right) {
    return false;
  }
  return left === right || left.includes(right) || right.includes(left);
}

function PlaceIcon({icon, colors}) {
  if (icon === 'home') {
    return <Feather name="home" size={18} color={colors.text} />;
  }
  if (icon === 'briefcase') {
    return <Feather name="briefcase" size={18} color={colors.text} />;
  }
  if (icon === 'navigation') {
    return <Lucide name="navigation" size={18} color={colors.text} />;
  }
  return <Feather name="map-pin" size={18} color={colors.text} />;
}

export default function SetRouteModal({visible, onClose, onConfirmLocations}) {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);
  const {colors} = useApp();
  const destinationRef = useRef(null);

  const [pickup, setPickup] = useState(DEFAULT_PICKUP);
  const [destination, setDestination] = useState('');
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [editingPickup, setEditingPickup] = useState(false);
  const [notifySaved, setNotifySaved] = useState(false);
  const [routeStopsOpen, setRouteStopsOpen] = useState(false);

  useEffect(() => {
    if (visible) {
      setDestination('');
      setSelectedDestination(null);
      setEditingPickup(false);
      setPickup(DEFAULT_PICKUP);
      setNotifySaved(false);
      setRouteStopsOpen(false);
      const t = setTimeout(() => destinationRef.current?.focus(), 350);
      return () => clearTimeout(t);
    }
  }, [visible]);

  const query = destination.trim();
  const showSuggestions = query.length > 0 && !selectedDestination;

  const suggestionRows = useMemo(() => {
    if (!showSuggestions) {
      return [];
    }
    const q = query.toLowerCase();
    return SUGGESTIONS.filter(
      item =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q),
    );
  }, [query, showSuggestions]);

  const dropLabel =
    selectedDestination?.address ||
    selectedDestination?.title ||
    destination.trim();

  const isSamePlace =
    Boolean(dropLabel) && placesMatch(pickup, dropLabel);

  const isOutOfArea = Boolean(
    selectedDestination?.outOfArea ||
      (dropLabel &&
        SUGGESTIONS.some(
          item =>
            item.outOfArea &&
            placesMatch(item.address || item.title, dropLabel),
        )),
  );

  const outOfAreaPlace =
    selectedDestination?.outOfArea
      ? selectedDestination
      : SUGGESTIONS.find(
          item =>
            item.outOfArea &&
            placesMatch(item.address || item.title, dropLabel),
        );

  const canConfirm =
    Boolean(dropLabel) &&
    Boolean(selectedDestination || query.length > 2) &&
    !isSamePlace &&
    !isOutOfArea;

  // Add-stop modal opens only after a valid destination is picked from the list.
  const canOpenAddStop =
    Boolean(selectedDestination) && !isSamePlace && !isOutOfArea;

  const listData = showSuggestions ? suggestionRows : RECENT_SAVED;
  const sectionTitle = showSuggestions ? 'SUGGESTIONS' : 'RECENT & SAVED';

  const onPickPlace = place => {
    const label = place.address || place.title;
    setDestination(label);
    setSelectedDestination(place);
    setNotifySaved(false);
    destinationRef.current?.blur();
  };

  const finishConfirm = (extra = {}) => {
    setRouteStopsOpen(false);
    onConfirmLocations?.({
      pickup,
      drop: dropLabel,
      ...extra,
    });
  };

  const onConfirm = () => {
    if (!canConfirm) {
      return;
    }
    finishConfirm();
  };

  const clearDestination = () => {
    setDestination('');
    setSelectedDestination(null);
    setNotifySaved(false);
  };

  const sheetMaxH = Dimensions.get('window').height * 0.82;
  const {sheetTY, panHandlers, toggle, expanded, onSheetLayout} =
    useDraggableSheet({
      peekHeight: 220,
      visible,
    });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent>
      <View style={styles.root} pointerEvents="box-none">
        <Pressable
          style={styles.backdrop}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Dismiss"
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.sheetWrap}
          pointerEvents="box-none">
          <Animated.View
            onLayout={onSheetLayout}
            style={[
              styles.sheet,
              {
                maxHeight: sheetMaxH,
                paddingBottom: Math.max(insets.bottom, 10) + 8,
                transform: [{translateY: sheetTY}],
              },
            ]}>
            <View {...panHandlers}>
              <Pressable
                onPress={toggle}
                accessibilityRole="button"
                accessibilityLabel={
                  expanded ? 'Collapse sheet' : 'Expand sheet'
                }
                style={styles.grabberHit}>
                <View style={styles.grabber} />
              </Pressable>
            </View>
            <Text style={styles.title}>Set your route</Text>

            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              bounces={false}
              style={styles.sheetScroll}
              contentContainerStyle={styles.sheetScrollContent}>
              <View style={styles.routeCard}>
                <View style={styles.timeline}>
                  <View style={styles.dotPickup} />
                  <View style={styles.timelineLine} />
                  <View style={styles.dotDrop} />
                </View>

                <View style={styles.fields}>
                  <View style={styles.fieldRow}>
                    {editingPickup ? (
                      <TextInput
                        style={styles.fieldInput}
                        value={pickup}
                        onChangeText={setPickup}
                        onBlur={() => setEditingPickup(false)}
                        autoFocus
                        placeholderTextColor={
                          colors.isDark ? colors.muted : colors.gray[400]
                        }
                      />
                    ) : (
                      <Text style={styles.fieldValue} numberOfLines={1}>
                        {pickup}
                      </Text>
                    )}
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Edit pickup"
                      onPress={() => setEditingPickup(true)}
                      hitSlop={8}>
                      <Feather
                        name="edit-2"
                        size={16}
                        color={colors.isDark ? colors.muted : colors.gray[400]}
                      />
                    </Pressable>
                  </View>

                  <View style={styles.fieldDivider} />

                  <View style={styles.fieldRow}>
                    <TextInput
                      ref={destinationRef}
                      style={styles.fieldInput}
                      value={destination}
                      onChangeText={text => {
                        setDestination(text);
                        setSelectedDestination(null);
                        setNotifySaved(false);
                      }}
                      placeholder="Search a place, area or landmark"
                      placeholderTextColor={
                        colors.isDark ? colors.muted : colors.gray[400]
                      }
                      returnKeyType="search"
                    />
                    {destination.length > 0 ? (
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Clear destination"
                        onPress={clearDestination}
                        hitSlop={8}>
                        <Feather
                          name="x-circle"
                          size={18}
                          color={
                            colors.isDark ? colors.muted : colors.gray[400]
                          }
                        />
                      </Pressable>
                    ) : null}
                  </View>
                </View>
              </View>

              {isSamePlace ? (
                <View style={styles.sameErrorRow}>
                  <Feather name="info" size={16} color={colors.red[500]} />
                  <Text style={styles.sameErrorText}>
                    Pickup and drop can't be the same place.
                  </Text>
                </View>
              ) : null}

              <View style={styles.actions}>
                <Pressable style={styles.actionChip}>
                  <Feather name="map-pin" size={15} color={colors.text} />
                  <Text style={styles.actionChipText}>Choose on map</Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.actionChip,
                    !canOpenAddStop && styles.actionChipDisabled,
                  ]}
                  disabled={!canOpenAddStop}
                  onPress={() => {
                    if (!canOpenAddStop) {
                      return;
                    }
                    setRouteStopsOpen(true);
                  }}>
                  <Feather
                    name="plus"
                    size={15}
                    color={
                      canOpenAddStop
                        ? colors.text
                        : colors.isDark
                        ? colors.muted
                        : colors.gray[400]
                    }
                  />
                  <Text
                    style={[
                      styles.actionChipText,
                      !canOpenAddStop && styles.actionChipTextDisabled,
                    ]}>
                    Add a stop
                  </Text>
                </Pressable>
              </View>

              {isOutOfArea && !isSamePlace ? (
                <View style={styles.outOfAreaCard}>
                  <View style={styles.outOfAreaIconWrap}>
                    <Lucide
                      name="triangle-alert"
                      size={22}
                      color={colors.red[500]}
                    />
                  </View>
                  <Text style={styles.outOfAreaTitle}>
                    Cabora doesn't reach here yet
                  </Text>
                  <Text style={styles.outOfAreaBody}>
                    {outOfAreaPlace?.areaLabel || 'This place'} is outside our
                    service area. We'll tell you the moment we start operating
                    there.
                  </Text>
                  <Pressable
                    style={styles.notifyBtn}
                    onPress={() => setNotifySaved(true)}>
                    <Text style={styles.notifyBtnText}>
                      {notifySaved
                        ? "You're on the list"
                        : 'Notify me when available'}
                    </Text>
                  </Pressable>
                </View>
              ) : null}

              {isSamePlace
                ? SAME_PLACE_ALTS.map(item => (
                    <View key={item.id}>
                      {item.id === SAME_PLACE_ALTS[0].id ? (
                        <Text style={styles.sectionTitle}>
                          TRY ONE OF THESE INSTEAD
                        </Text>
                      ) : null}
                      <Pressable
                        style={styles.placeRow}
                        onPress={() => onPickPlace(item)}>
                        <View style={styles.placeIcon}>
                          <PlaceIcon icon={item.icon} colors={colors} />
                        </View>
                        <View style={styles.placeCopy}>
                          <Text style={styles.placeTitle} numberOfLines={1}>
                            {item.title}
                          </Text>
                          <Text style={styles.placeSub} numberOfLines={1}>
                            {item.subtitle}
                          </Text>
                        </View>
                      </Pressable>
                    </View>
                  ))
                : null}

              {!isSamePlace && !isOutOfArea ? (
                <>
                  <Text style={styles.sectionTitle}>{sectionTitle}</Text>
                  {listData.length === 0 && showSuggestions ? (
                    <Text style={styles.emptyText}>
                      No places match “{query}”
                    </Text>
                  ) : null}
                  {listData.map(item => (
                    <Pressable
                      key={item.id}
                      style={styles.placeRow}
                      onPress={() => onPickPlace(item)}>
                      <View style={styles.placeIcon}>
                        {showSuggestions ? (
                          <Feather
                            name="map-pin"
                            size={18}
                            color={colors.text}
                          />
                        ) : (
                          <PlaceIcon icon={item.icon} colors={colors} />
                        )}
                      </View>
                      <View style={styles.placeCopy}>
                        <Text style={styles.placeTitle} numberOfLines={1}>
                          {item.title}
                        </Text>
                        <Text style={styles.placeSub} numberOfLines={1}>
                          {item.subtitle}
                        </Text>
                      </View>
                    </Pressable>
                  ))}
                </>
              ) : null}
            </ScrollView>

            <Pressable
              accessibilityRole="button"
              accessibilityState={{disabled: !canConfirm}}
              disabled={!canConfirm}
              onPress={onConfirm}
              style={[
                styles.confirmBtn,
                canConfirm
                  ? styles.confirmBtnActive
                  : styles.confirmBtnDisabled,
              ]}>
              <Text
                style={[
                  styles.confirmText,
                  canConfirm
                    ? styles.confirmTextActive
                    : styles.confirmTextDisabled,
                ]}>
                Confirm locations
              </Text>
            </Pressable>
          </Animated.View>
        </KeyboardAvoidingView>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={onClose}
          hitSlop={12}
          style={[styles.backBtn, {top: insets.top + 8}]}>
          <Feather name="arrow-left" size={22} color={colors.text} />
        </Pressable>

        <YourRouteModal
          visible={routeStopsOpen}
          onClose={() => setRouteStopsOpen(false)}
          pickup={pickup}
          drop={
            selectedDestination?.address ||
            selectedDestination?.title ||
            destination.trim() ||
            'Whitefield · Prestige Tech Park'
          }
          onConfirm={(stops, fare) => {
            finishConfirm({stops, fare});
          }}
        />
      </View>
    </Modal>
  );
}
