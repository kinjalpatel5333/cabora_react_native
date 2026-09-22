import { PASSENGER_SORT_OPTIONS, PASSENGER_SORT_SERVICES } from '../../config/staticData';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Dimensions, Modal, PanResponder, ScrollView, Text, View, TouchableOpacity} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import useThemedStyles from '../../components/useThemedStyles';
import {useApp} from '../../context/AppContext';
import createStyles from './sortFilterStyle';
import colors from '../../config/color';

const SORT_OPTIONS = PASSENGER_SORT_OPTIONS;

const SERVICES = PASSENGER_SORT_SERVICES;

const PAYMENTS = ['UPI', 'Cash', 'Wallet', 'Card'];

const FARE_MIN = 0;
const FARE_MAX = 3000;
const FARE_STEP = 50;
const DEFAULT_FARE = [0, 1500];
const THUMB = 22;

function formatFare(n) {
  return `₹${Number(n).toLocaleString('en-IN')}`;
}

function snap(value) {
  const stepped = Math.round(value / FARE_STEP) * FARE_STEP;
  return Math.min(FARE_MAX, Math.max(FARE_MIN, stepped));
}

function FareRangeSlider({minValue, maxValue, onChange, colors, styles}) {
  const trackRef = useRef(null);
  const pageXRef = useRef(0);
  const [width, setWidth] = useState(0);
  const values = useRef({min: minValue, max: maxValue});
  const widthRef = useRef(0);

  useEffect(() => {
    values.current = {min: minValue, max: maxValue};
  }, [minValue, maxValue]);

  useEffect(() => {
    widthRef.current = width;
  }, [width]);

  const toX = value => {
    if (width <= 0) {
      return 0;
    }
    return ((value - FARE_MIN) / (FARE_MAX - FARE_MIN)) * width;
  };

  const valueFromPageX = pageX => {
    const w = widthRef.current;
    if (w <= 0) {
      return FARE_MIN;
    }
    const x = Math.min(w, Math.max(0, pageX - pageXRef.current));
    return snap(FARE_MIN + (x / w) * (FARE_MAX - FARE_MIN));
  };

  const measureTrack = () => {
    trackRef.current?.measureInWindow?.((x, _y, w) => {
      pageXRef.current = x;
      if (w > 0) {
        widthRef.current = w;
        setWidth(w);
      }
    });
  };

  const minPan = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          measureTrack();
        },
        onPanResponderMove: (_evt, g) => {
          const next = valueFromPageX(g.moveX);
          const min = Math.min(next, values.current.max - FARE_STEP);
          onChange([min, values.current.max]);
        },
      }),
    [onChange],
  );

  const maxPan = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          measureTrack();
        },
        onPanResponderMove: (_evt, g) => {
          const next = valueFromPageX(g.moveX);
          const max = Math.max(next, values.current.min + FARE_STEP);
          onChange([values.current.min, max]);
        },
      }),
    [onChange],
  );

  const minX = toX(minValue);
  const maxX = toX(maxValue);

  return (
    <View style={styles.sliderBlock}>
      <View
        ref={trackRef}
        style={styles.sliderTrackHit}
        onLayout={e => {
          const w = e.nativeEvent.layout.width;
          widthRef.current = w;
          setWidth(w);
          measureTrack();
        }}>
        <View style={styles.sliderTrack} />
        <View
          style={[
            styles.sliderFill,
            {
              left: minX,
              width: Math.max(0, maxX - minX),
            },
          ]}
        />
        <View
          {...minPan.panHandlers}
          hitSlop={12}
          style={[
            styles.sliderThumb,
            {
              left: Math.max(0, minX - THUMB / 2),
              borderColor: colors.primary,
            },
          ]}
        />
        <View
          {...maxPan.panHandlers}
          hitSlop={12}
          style={[
            styles.sliderThumb,
            {
              left: Math.max(0, maxX - THUMB / 2),
              borderColor: colors.primary,
            },
          ]}
        />
      </View>
      <View style={styles.sliderLabels}>
        <Text style={styles.sliderLabel}>{formatFare(FARE_MIN)}</Text>
        <Text style={styles.sliderLabel}>{formatFare(FARE_MAX)}</Text>
      </View>
    </View>
  );
}

const DEFAULT_STATE = {
  sort: 'newest',
  services: ['Cab', 'Portal'],
  payments: ['UPI'],
  fare: DEFAULT_FARE,
};

export default function SortFilterModal({
  visible,
  onClose,
  tripCount = 18,
  onApply,
}) {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);
  const {colors} = useApp();

  const [sort, setSort] = useState(DEFAULT_STATE.sort);
  const [services, setServices] = useState(DEFAULT_STATE.services);
  const [payments, setPayments] = useState(DEFAULT_STATE.payments);
  const [fare, setFare] = useState(DEFAULT_STATE.fare);

  useEffect(() => {
    if (visible) {
      setSort(DEFAULT_STATE.sort);
      setServices([...DEFAULT_STATE.services]);
      setPayments([...DEFAULT_STATE.payments]);
      setFare([...DEFAULT_STATE.fare]);
    }
  }, [visible]);

  const resetAll = () => {
    setSort(DEFAULT_STATE.sort);
    setServices([...DEFAULT_STATE.services]);
    setPayments([...DEFAULT_STATE.payments]);
    setFare([...DEFAULT_STATE.fare]);
  };

  const clearAll = () => {
    setSort('newest');
    setServices([]);
    setPayments([]);
    setFare([FARE_MIN, FARE_MAX]);
  };

  const toggleIn = (list, setList, item) => {
    setList(prev =>
      prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item],
    );
  };

  const sheetMaxH = Dimensions.get('window').height * 0.72;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      presentationStyle="overFullScreen"
      onRequestClose={onClose}
      statusBarTranslucent>
      <View style={styles.root}>
        <TouchableOpacity activeOpacity={0.7}
          style={styles.backdrop}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Dismiss"
        />

        <View
          style={[
            styles.sheet,
            {
              maxHeight: sheetMaxH,
              paddingBottom: Math.max(insets.bottom, 12),
            },
          ]}>
          <View style={styles.grabberHit}>
            <View style={styles.grabber} />
          </View>

          <View style={styles.headerRow}>
            <Text style={styles.title}>Sort & filter</Text>
            <TouchableOpacity activeOpacity={0.7} onPress={resetAll} hitSlop={8}>
              <Text style={styles.resetText}>Reset all</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            bounces={false}>
            <Text style={styles.sectionLabel}>SORT BY</Text>
            <View style={styles.sortList}>
              {SORT_OPTIONS.map(opt => {
                const active = sort === opt.id;
                return (
                  <TouchableOpacity activeOpacity={0.7}
                    key={opt.id}
                    style={styles.sortRow}
                    onPress={() => setSort(opt.id)}
                    accessibilityRole="radio"
                    accessibilityState={{selected: active}}>
                    <Text
                      style={[
                        styles.sortLabel,
                        active && styles.sortLabelActive,
                      ]}>
                      {opt.label}
                    </Text>
                    <View
                      style={[
                        styles.radioOuter,
                        active && styles.radioOuterActive,
                      ]}>
                      {active ? <View style={styles.radioInner} /> : null}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.divider} />

            <Text style={styles.sectionLabel}>SERVICE</Text>
            {Array.from(
              {length: Math.ceil(SERVICES.length / 5)},
              (_, rowIndex) => {
                const row = SERVICES.slice(rowIndex * 5, rowIndex * 5 + 5);
                return (
                  <View
                    key={`service-row-${rowIndex}`}
                    style={[
                      styles.serviceRow,
                      rowIndex > 0 && styles.serviceRowSpaced,
                    ]}>
                    {row.map(item => {
                      const active = services.includes(item);
                      return (
                        <TouchableOpacity activeOpacity={0.7}
                          key={item}
                          style={[
                            styles.serviceChip,
                            active && styles.chipActive,
                          ]}
                          onPress={() =>
                            toggleIn(services, setServices, item)
                          }>
                          <Text
                            style={[
                              styles.chipText,
                              active && styles.chipTextActive,
                            ]}
                            numberOfLines={1}>
                            {item}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                    {row.length < 5
                      ? Array.from({length: 5 - row.length}, (_pad, i) => (
                          <View
                            key={`pad-${i}`}
                            style={styles.serviceChipSpacer}
                          />
                        ))
                      : null}
                  </View>
                );
              },
            )}

            <View style={styles.divider} />

            <Text style={styles.sectionLabel}>PAYMENT</Text>
            <View style={styles.chipsWrap}>
              {PAYMENTS.map(item => {
                const active = payments.includes(item);
                return (
                  <TouchableOpacity activeOpacity={0.7}
                    key={item}
                    style={[styles.chip, active && styles.chipActive]}
                    onPress={() => toggleIn(payments, setPayments, item)}>
                    <Text
                      style={[
                        styles.chipText,
                        active && styles.chipTextActive,
                      ]}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.divider} />

            <View style={styles.fareHeader}>
              <Text style={styles.sectionLabelFare}>FARE RANGE</Text>
              <Text style={styles.fareValue}>
                {formatFare(fare[0])} – {formatFare(fare[1])}
              </Text>
            </View>
            <FareRangeSlider
              minValue={fare[0]}
              maxValue={fare[1]}
              onChange={setFare}
              colors={colors}
              styles={styles}
            />
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity activeOpacity={0.7}
              style={styles.clearBtn}
              onPress={clearAll}
              accessibilityRole="button"
              accessibilityLabel="Clear all filters">
              <Text style={styles.clearText}>Clear all</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.7}
              style={styles.applyBtn}
              onPress={() => {
                onApply?.({sort, services, payments, fare});
                onClose?.();
              }}
              accessibilityRole="button"
              accessibilityLabel={`Show ${tripCount} trips`}>
              <Text style={styles.applyText}>Show {tripCount} trips</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
