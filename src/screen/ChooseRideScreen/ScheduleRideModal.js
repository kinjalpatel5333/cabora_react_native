import { PASSENGER_SCHEDULE_DAY_NAMES, PASSENGER_SCHEDULE_MONTH_NAMES, PASSENGER_SCHEDULE_TIMES, PASSENGER_SCHEDULE_VEHICLES } from '../../config/staticData';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  Dimensions,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Feather} from '@react-native-vector-icons/feather/static';
import {MaterialDesignIcons} from '@react-native-vector-icons/material-design-icons/static';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useToast} from '../../components/Toast';
import useThemedStyles from '../../components/useThemedStyles';
import {useApp} from '../../context/AppContext';
import createStyles from './scheduleRideStyle';

const DAY_NAMES = PASSENGER_SCHEDULE_DAY_NAMES;

const MONTH_NAMES = PASSENGER_SCHEDULE_MONTH_NAMES;

const TIMES = PASSENGER_SCHEDULE_TIMES;

const VEHICLES = PASSENGER_SCHEDULE_VEHICLES;

const QUICK_SUGGESTIONS = [
  {id: 'home', label: 'Home', subtitle: 'Satellite, Ahmedabad'},
  {id: 'office', label: 'Office', subtitle: 'Prahladnagar Corporate Rd'},
  {id: 'airport', label: 'SVPI Airport · T2', subtitle: 'Hansol, Ahmedabad'},
  {id: 'station', label: 'Kalupur Railway Station', subtitle: 'Ahmedabad Junction'},
  {id: 'highway', label: 'SG Highway', subtitle: 'Thaltej, Ahmedabad'},
];

const DAY_CARD_W = 58;
const DAY_GAP = 10;
const SCREEN_W = Dimensions.get('window').width;
const TIME_GAP = 10;
const TIME_CHIP_W = (SCREEN_W - 40 - TIME_GAP * 3) / 4;

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

function daysInMonth(year, monthIndex) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

function buildDays(year, monthIndex) {
  const count = daysInMonth(year, monthIndex);
  const days = [];
  for (let d = 1; d <= count; d += 1) {
    const date = new Date(year, monthIndex, d);
    days.push({
      key: `${year}-${monthIndex}-${d}`,
      day: d,
      weekday: DAY_NAMES[date.getDay()],
    });
  }
  return days;
}

function formatPrice(n) {
  return `₹${Number(n).toLocaleString('en-IN')}`;
}

export default function ScheduleRideModal({
  visible,
  onClose,
  onConfirm,
  onChangePayment,
  pickupTitle = 'Indiranagar 100ft Road',
  pickupSub = 'Home · gate 2',
  dropTitle = 'Kempegowda Airport · T2',
  dropSub = '38.4 km · about 52 min',
  paymentLabel = 'HDFC ....4821',
}) {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);
  const {colors} = useApp();
  const {showToast} = useToast();

  const [monthCursor, setMonthCursor] = useState(() => new Date(2026, 8, 1));
  const [selectedDay, setSelectedDay] = useState(12);
  const [selectedTime, setSelectedTime] = useState('06:30 am');
  const [vehicleId, setVehicleId] = useState('comfort');

  // Editable route locations
  const [currentPickupTitle, setCurrentPickupTitle] = useState(pickupTitle);
  const [currentPickupSub, setCurrentPickupSub] = useState(pickupSub);
  const [currentDropTitle, setCurrentDropTitle] = useState(dropTitle);
  const [currentDropSub, setCurrentDropSub] = useState(dropSub);

  // Inline editing state
  const [isEditingRoute, setIsEditingRoute] = useState(false);
  const [pickupDraft, setPickupDraft] = useState(pickupTitle);
  const [dropDraft, setDropDraft] = useState(dropTitle);
  const [focusedInput, setFocusedInput] = useState('drop');

  const isSamePlace =
    Boolean(pickupDraft.trim()) &&
    Boolean(dropDraft.trim()) &&
    placesMatch(pickupDraft, dropDraft);

  const daysScrollRef = useRef(null);

  useEffect(() => {
    setCurrentPickupTitle(pickupTitle);
    setPickupDraft(pickupTitle);
  }, [pickupTitle]);

  useEffect(() => {
    setCurrentPickupSub(pickupSub);
  }, [pickupSub]);

  useEffect(() => {
    setCurrentDropTitle(dropTitle);
    setDropDraft(dropTitle);
  }, [dropTitle]);

  useEffect(() => {
    setCurrentDropSub(dropSub);
  }, [dropSub]);

  useEffect(() => {
    if (visible) {
      setMonthCursor(new Date(2026, 8, 1));
      setSelectedDay(12);
      setSelectedTime('06:30 am');
      setVehicleId('comfort');
      setIsEditingRoute(false);
      requestAnimationFrame(() => {
        const offset = Math.max(0, (12 - 3) * (DAY_CARD_W + DAY_GAP));
        daysScrollRef.current?.scrollTo({x: offset, animated: false});
      });
    }
  }, [visible]);

  const year = monthCursor.getFullYear();
  const monthIndex = monthCursor.getMonth();
  const days = useMemo(() => buildDays(year, monthIndex), [year, monthIndex]);

  const selectedVehicle =
    VEHICLES.find(v => v.id === vehicleId) || VEHICLES[0];

  const shiftMonth = delta => {
    setMonthCursor(prev => {
      const next = new Date(prev.getFullYear(), prev.getMonth() + delta, 1);
      const maxDay = daysInMonth(next.getFullYear(), next.getMonth());
      setSelectedDay(d => Math.min(d, maxDay));
      return next;
    });
  };

  const handleStartEdit = () => {
    setPickupDraft(currentPickupTitle);
    setDropDraft(currentDropTitle);
    setIsEditingRoute(true);
  };

  const handleSaveRoute = () => {
    if (!pickupDraft.trim()) {
      showToast({type: 'error', message: 'Please enter pickup location'});
      return;
    }
    if (!dropDraft.trim()) {
      showToast({type: 'error', message: 'Please enter destination location'});
      return;
    }
    if (isSamePlace) {
      showToast({
        type: 'error',
        message: 'Pickup and destination cannot be the same location',
      });
      return;
    }
    setCurrentPickupTitle(pickupDraft.trim());
    setCurrentDropTitle(dropDraft.trim());
    showToast({
      type: 'success',
      message: 'Route updated successfully',
    });
    setIsEditingRoute(false);
  };

  const handleCancelEdit = () => {
    setPickupDraft(currentPickupTitle);
    setDropDraft(currentDropTitle);
    setIsEditingRoute(false);
  };

  const handleSelectQuickSuggestion = item => {
    if (focusedInput === 'pickup') {
      setPickupDraft(item.label);
      setCurrentPickupSub(item.subtitle);
    } else {
      setDropDraft(item.label);
      setCurrentDropSub(item.subtitle);
    }
  };

  const handleConfirm = () => {
    if (placesMatch(currentPickupTitle, currentDropTitle)) {
      showToast({
        type: 'error',
        message: 'Pickup and destination cannot be the same location',
      });
      return;
    }
    onConfirm?.({
      date: new Date(year, monthIndex, selectedDay),
      time: selectedTime,
      vehicle: selectedVehicle,
      pickup: {
        title: currentPickupTitle,
        subtitle: currentPickupSub,
      },
      drop: {
        title: currentDropTitle,
        subtitle: currentDropSub,
      },
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}>
      <View style={styles.root}>
        <View style={[styles.header, {paddingTop: insets.top + 4}]}>
          <TouchableOpacity activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            style={styles.headerBtn}
            onPress={onClose}
            hitSlop={8}>
            <Feather name="arrow-left" size={22} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Schedule a ride</Text>
          <TouchableOpacity activeOpacity={0.7} style={styles.headerBtn} hitSlop={8}>
            <Feather name="help-circle" size={22} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}>
          {isEditingRoute ? (
            /* Inline Edit Route Card */
            <View style={styles.routeCardEditing}>
              <Text style={styles.editSectionTitle}>Edit Pickup & Drop</Text>

              {/* Pickup Input */}
              <View
                style={[
                  styles.routeInputRow,
                  focusedInput === 'pickup' && styles.routeInputRowFocused,
                ]}>
                <View style={[styles.inputDot, styles.inputDotPickup]} />
                <TextInput
                  style={styles.routeTextInput}
                  value={pickupDraft}
                  onChangeText={setPickupDraft}
                  onFocus={() => setFocusedInput('pickup')}
                  placeholder="Enter pickup location"
                  placeholderTextColor={colors.textMuted || colors.muted}
                  selectionColor="#FF7A00"
                />
                {pickupDraft.length > 0 ? (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.inputClearBtn}
                    onPress={() => setPickupDraft('')}
                    hitSlop={6}>
                    <Feather
                      name="x"
                      size={16}
                      color={colors.textMuted || colors.muted}
                    />
                  </TouchableOpacity>
                ) : null}
              </View>

              {/* Drop Input */}
              <View
                style={[
                  styles.routeInputRow,
                  focusedInput === 'drop' && styles.routeInputRowFocused,
                ]}>
                <View style={[styles.inputDot, styles.inputDotDrop]} />
                <TextInput
                  style={styles.routeTextInput}
                  value={dropDraft}
                  onChangeText={setDropDraft}
                  onFocus={() => setFocusedInput('drop')}
                  placeholder="Enter destination location"
                  placeholderTextColor={colors.textMuted || colors.muted}
                  selectionColor="#FF7A00"
                />
                {dropDraft.length > 0 ? (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.inputClearBtn}
                    onPress={() => setDropDraft('')}
                    hitSlop={6}>
                    <Feather
                      name="x"
                      size={16}
                      color={colors.textMuted || colors.muted}
                    />
                  </TouchableOpacity>
                ) : null}
              </View>

              {/* Same place error warning */}
              {isSamePlace ? (
                <View style={styles.samePlaceErrorBox}>
                  <Feather name="alert-circle" size={15} color="#EF4444" />
                  <Text style={styles.samePlaceErrorText}>
                    Pickup and destination cannot be the same place.
                  </Text>
                </View>
              ) : null}

              {/* Quick suggestions */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.chipsContainer}>
                {QUICK_SUGGESTIONS.map(item => (
                  <TouchableOpacity
                    key={item.id}
                    activeOpacity={0.7}
                    style={styles.chipBtn}
                    onPress={() => handleSelectQuickSuggestion(item)}>
                    <Text style={styles.chipText}>{item.label}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Edit Actions */}
              <View style={styles.editActionRow}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.editCancelBtn}
                  onPress={handleCancelEdit}>
                  <Text style={styles.editCancelText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.editSaveBtn}
                  onPress={handleSaveRoute}>
                  <Text style={styles.editSaveText}>Save route</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            /* Normal Route Display Card */
            <View style={styles.routeCard}>
              <View style={styles.timeline}>
                <View style={styles.pickupDot} />
                <View style={styles.timelineLine} />
                <View style={styles.dropDot} />
              </View>
              <View style={styles.routeCopy}>
                <View>
                  <Text style={styles.routeTitle} numberOfLines={1}>
                    {currentPickupTitle}
                  </Text>
                  <Text style={styles.routeSub} numberOfLines={1}>
                    {currentPickupSub}
                  </Text>
                </View>
                <View>
                  <Text style={styles.routeTitle} numberOfLines={1}>
                    {currentDropTitle}
                  </Text>
                  <Text style={styles.routeSub} numberOfLines={1}>
                    {currentDropSub}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.editBtn}
                onPress={handleStartEdit}
                accessibilityRole="button"
                accessibilityLabel="Edit route"
                hitSlop={8}>
                <Feather name="edit-2" size={18} color={colors.text} />
              </TouchableOpacity>
            </View>
          )}

          <Text style={styles.sectionLabel}>WHEN</Text>
          <View style={styles.monthRow}>
            <Text style={styles.monthText}>
              {MONTH_NAMES[monthIndex]} {year}
            </Text>
            <View style={styles.monthNav}>
              <TouchableOpacity activeOpacity={0.7}
                style={styles.monthNavBtn}
                onPress={() => shiftMonth(-1)}
                hitSlop={6}>
                <Feather name="chevron-left" size={18} color={colors.text} />
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.7}
                style={styles.monthNavBtn}
                onPress={() => shiftMonth(1)}
                hitSlop={6}>
                <Feather
                  name="chevron-right"
                  size={18}
                  color={colors.text}
                />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView
            ref={daysScrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.daysRow}>
            {days.map(item => {
              const active = item.day === selectedDay;
              return (
                <TouchableOpacity activeOpacity={0.7}
                  key={item.key}
                  onPress={() => setSelectedDay(item.day)}
                  style={[styles.dayCard, active && styles.dayCardActive]}>
                  <Text
                    style={[styles.dayName, active && styles.dayNameActive]}>
                    {item.weekday}
                  </Text>
                  <Text style={[styles.dayNum, active && styles.dayNumActive]}>
                    {item.day}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <Text style={styles.sectionLabel}>PICK-UP TIME</Text>
          <Text style={styles.timeHint}>
            Fares can change if demand shifts before your ride.
          </Text>
          <View style={styles.timeGrid}>
            {TIMES.map(time => {
              const active = time === selectedTime;
              return (
                <TouchableOpacity activeOpacity={0.7}
                  key={time}
                  onPress={() => setSelectedTime(time)}
                  style={[
                    styles.timeChip,
                    {width: TIME_CHIP_W},
                    active && styles.timeChipActive,
                  ]}>
                  <Text
                    style={[styles.timeText, active && styles.timeTextActive]}>
                    {time}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.sectionLabel}>VEHICLE</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.vehicleScroll}
            contentContainerStyle={styles.vehicleRow}>
            {VEHICLES.map(vehicle => {
              const active = vehicle.id === vehicleId;
              const iconColor = active
                ? colors.orange[500]
                : colors.text;
              return (
                <TouchableOpacity activeOpacity={0.7}
                  key={vehicle.id}
                  onPress={() => setVehicleId(vehicle.id)}
                  style={[
                    styles.vehicleCard,
                    active && styles.vehicleCardActive,
                  ]}>
                  <View style={styles.vehicleIcon}>
                    <MaterialDesignIcons
                      name={vehicle.icon}
                      size={28}
                      color={iconColor}
                    />
                  </View>
                  <Text style={styles.vehicleName}>{vehicle.name}</Text>
                  <Text style={styles.vehiclePrice}>
                    {formatPrice(vehicle.price)}
                  </Text>
                  <Text style={styles.vehicleMeta}>{vehicle.meta}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <View style={styles.paymentCard}>
            <View style={styles.paymentIcon}>
              <Feather name="credit-card" size={18} color={colors.text} />
            </View>
            <View style={styles.paymentCopy}>
              <Text style={styles.paymentTitle}>{paymentLabel}</Text>
              <Text style={styles.paymentSub}>
                Charged when the ride completes
              </Text>
            </View>
            <TouchableOpacity activeOpacity={0.7} hitSlop={8} onPress={onChangePayment}>
              <Text style={styles.changeText}>Change</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <View
          style={[styles.footer, {paddingBottom: Math.max(insets.bottom, 14)}]}>
          <View style={styles.fareCol}>
            <Text style={styles.fareLabel}>Estimated fare</Text>
            <Text style={styles.fareValue}>
              {formatPrice(selectedVehicle.price)}
            </Text>
            <Text style={styles.fareNote}>
              Free cancellation until 30 min before
            </Text>
          </View>
          <TouchableOpacity activeOpacity={0.7} style={styles.confirmBtn} onPress={handleConfirm}>
            <Text style={styles.confirmText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
