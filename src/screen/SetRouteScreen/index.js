import { PASSENGER_SET_ROUTE_RECENT_SAVED, PASSENGER_SET_ROUTE_SUGGESTIONS } from '../../config/staticData';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Dimensions, KeyboardAvoidingView, Modal, Platform, ScrollView, Text, TextInput, View, TouchableOpacity } from 'react-native';
import { Feather } from '@react-native-vector-icons/feather/static';
import { Lucide } from '@react-native-vector-icons/lucide/static';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useThemedStyles from '../../components/useThemedStyles';
import { useApp } from '../../context/AppContext';
import useDraggableSheet from '../../hooks/useDraggableSheet';
import createStyles from './style';
import YourRouteModal from './YourRouteModal';
import colors from '../../config/color';
import { ToastHost } from '../../components';

const DEFAULT_PICKUP = '12, Brigade Road, Ashok Nagar';

const RECENT_SAVED = PASSENGER_SET_ROUTE_RECENT_SAVED;

const SUGGESTIONS = PASSENGER_SET_ROUTE_SUGGESTIONS;

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

function PlaceIcon({ icon, colors }) {
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

export default function SetRouteModal({ visible, onClose, onConfirmLocations }) {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);
  const { colors } = useApp();
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

  const windowH = Dimensions.get('window').height;
  const sheetMaxH = windowH - (insets.top > 0 ? insets.top + 8 : 16);
  const minHeight = Math.min(sheetMaxH, windowH * 0.72);
  const { sheetTY, panHandlers, toggle, expanded, onSheetLayout } =
    useDraggableSheet({
      minHeight,
      visible,
      initialExpanded: false,
    });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent>
      <View style={styles.root} pointerEvents="box-none">
        <TouchableOpacity activeOpacity={0.7}
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
                transform: [{ translateY: sheetTY }],
              },
            ]}>
            <View {...panHandlers}>
              <TouchableOpacity activeOpacity={0.7}
                onPress={toggle}
                accessibilityRole="button"
                accessibilityLabel={
                  expanded ? 'Collapse sheet' : 'Expand sheet'
                }
                style={styles.grabberHit}>
                <View style={styles.grabber} />
              </TouchableOpacity>
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
                    <TouchableOpacity activeOpacity={0.7}
                      accessibilityRole="button"
                      accessibilityLabel="Edit pickup"
                      onPress={() => setEditingPickup(true)}
                      hitSlop={8}>
                      <Feather
                        name="edit-2"
                        size={16}
                        color={colors.isDark ? colors.muted : colors.gray[400]}
                      />
                    </TouchableOpacity>
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
                      <TouchableOpacity activeOpacity={0.7}
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
                      </TouchableOpacity>
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
                <TouchableOpacity activeOpacity={0.7} style={styles.actionChip}>
                  <Feather name="map-pin" size={15} color={colors.text} />
                  <Text style={styles.actionChipText}>Choose on map</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.7}
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
                </TouchableOpacity>
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
                  <TouchableOpacity activeOpacity={0.7}
                    style={styles.notifyBtn}
                    onPress={() => setNotifySaved(true)}>
                    <Text style={styles.notifyBtnText}>
                      {notifySaved
                        ? "You're on the list"
                        : 'Notify me when available'}
                    </Text>
                  </TouchableOpacity>
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
                    <TouchableOpacity activeOpacity={0.7}
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
                    </TouchableOpacity>
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
                    <TouchableOpacity activeOpacity={0.7}
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
                    </TouchableOpacity>
                  ))}
                </>
              ) : null}
            </ScrollView>

            <TouchableOpacity activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityState={{ disabled: !canConfirm }}
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
            </TouchableOpacity>
          </Animated.View>
        </KeyboardAvoidingView>

        <TouchableOpacity activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={onClose}
          hitSlop={12}
          style={[styles.backBtn, { top: insets.top + 8 }]}>
          <Feather name="arrow-left" size={22} color={colors.text} />
        </TouchableOpacity>

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
            finishConfirm({ stops, fare });
          }}
        />

        <ToastHost />
      </View>
    </Modal>
  );
}
