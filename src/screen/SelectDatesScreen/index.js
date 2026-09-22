import React, {useMemo, useState} from 'react';
import {
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Feather} from '@react-native-vector-icons/feather/static';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useToast} from '../../components/Toast';
import useThemedStyles from '../../components/useThemedStyles';
import {useApp} from '../../context/AppContext';
import createStyles from './style';
import colors from '../../config/color';

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const SHORT_MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const QUICK = [
  {id: 'today', label: 'Today'},
  {id: 'week', label: 'This week'},
  {id: '30', label: '30 days'},
  {id: '90', label: '3 months'},
];

function startOfDay(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function addDays(d, n) {
  const next = new Date(d);
  next.setDate(next.getDate() + n);
  return startOfDay(next);
}

function sameDay(a, b) {
  return (
    a &&
    b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatLong(d) {
  if (!d) {
    return '—';
  }
  const day = String(d.getDate()).padStart(2, '0');
  return `${day} ${SHORT_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

function daysBetween(a, b) {
  if (!a || !b) {
    return 0;
  }
  const ms = Math.abs(startOfDay(b) - startOfDay(a));
  return Math.floor(ms / 86400000) + 1;
}

function buildMonthCells(year, month) {
  const first = new Date(year, month, 1);
  const startPad = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevDays = new Date(year, month, 0).getDate();
  const cells = [];

  for (let i = startPad - 1; i >= 0; i -= 1) {
    cells.push({
      date: new Date(year, month - 1, prevDays - i),
      current: false,
    });
  }
  for (let d = 1; d <= daysInMonth; d += 1) {
    cells.push({date: new Date(year, month, d), current: true});
  }
  while (cells.length % 7 !== 0) {
    const last = cells[cells.length - 1].date;
    cells.push({date: addDays(last, 1), current: false});
  }
  return cells;
}

export default function SelectDatesScreen() {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);
  const {colors} = useApp();
  const navigation = useNavigation();
  const {showToast} = useToast();

  const defaultStart = startOfDay(new Date(2026, 8, 12));
  const defaultEnd = addDays(defaultStart, 29);

  const [cursor, setCursor] = useState({
    year: defaultStart.getFullYear(),
    month: defaultStart.getMonth(),
  });
  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);
  const [quickId, setQuickId] = useState('30');
  const [includeCancelled, setIncludeCancelled] = useState(true);

  const cells = useMemo(
    () => buildMonthCells(cursor.year, cursor.month),
    [cursor.year, cursor.month],
  );

  const rangeCount = daysBetween(startDate, endDate);
  const rangeStart = startDate && endDate
    ? startDate <= endDate
      ? startDate
      : endDate
    : startDate;
  const rangeEnd = startDate && endDate
    ? startDate <= endDate
      ? endDate
      : startDate
    : endDate;

  const applyQuick = id => {
    setQuickId(id);
    const today = startOfDay(new Date(2026, 8, 12));
    if (id === 'today') {
      setStartDate(today);
      setEndDate(today);
      setCursor({year: today.getFullYear(), month: today.getMonth()});
      return;
    }
    if (id === 'week') {
      const end = addDays(today, 6);
      setStartDate(today);
      setEndDate(end);
      setCursor({year: today.getFullYear(), month: today.getMonth()});
      return;
    }
    if (id === '30') {
      // Jo date hai wahan se aage 30 days (inclusive)
      const end = addDays(today, 29);
      setStartDate(today);
      setEndDate(end);
      setCursor({year: today.getFullYear(), month: today.getMonth()});
      return;
    }
    // 3 months ≈ 90 days aage
    const end = addDays(today, 89);
    setStartDate(today);
    setEndDate(end);
    setCursor({year: today.getFullYear(), month: today.getMonth()});
  };

  const onPickDay = date => {
    setQuickId(null);
    if (!startDate || (startDate && endDate)) {
      setStartDate(startOfDay(date));
      setEndDate(null);
      return;
    }
    if (startOfDay(date) < startDate) {
      setEndDate(startDate);
      setStartDate(startOfDay(date));
      return;
    }
    setEndDate(startOfDay(date));
  };

  const onReset = () => {
    setQuickId('30');
    setStartDate(defaultStart);
    setEndDate(defaultEnd);
    setCursor({
      year: defaultStart.getFullYear(),
      month: defaultStart.getMonth(),
    });
    setIncludeCancelled(true);
  };

  const shiftMonth = delta => {
    const d = new Date(cursor.year, cursor.month + delta, 1);
    setCursor({year: d.getFullYear(), month: d.getMonth()});
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
        <Text style={styles.headerTitle}>Select dates</Text>
        <Pressable style={styles.headerBtn} onPress={onReset} hitSlop={8}>
          <Text style={styles.resetText}>Reset</Text>
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, {paddingBottom: 20}]}>
        <View style={styles.chipsRow}>
          {QUICK.map(item => {
            const active = item.id === quickId;
            return (
              <Pressable
                key={item.id}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => applyQuick(item.id)}>
                <Text
                  style={[styles.chipText, active && styles.chipTextActive]}>
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.card}>
          <View style={styles.monthRow}>
            <Text style={styles.monthTitle}>
              {MONTHS[cursor.month]} {cursor.year}
            </Text>
            <View style={styles.monthNav}>
              <Pressable
                style={styles.navBtn}
                onPress={() => shiftMonth(-1)}
                hitSlop={8}>
                <Feather
                  name="chevron-left"
                  size={22}
                  color={colors.text}
                />
              </Pressable>
              <Pressable
                style={styles.navBtn}
                onPress={() => shiftMonth(1)}
                hitSlop={8}>
                <Feather
                  name="chevron-right"
                  size={22}
                  color={colors.text}
                />
              </Pressable>
            </View>
          </View>

          <View style={styles.weekRow}>
            {WEEKDAYS.map((d, i) => (
              <Text key={`${d}-${i}`} style={styles.weekLabel}>
                {d}
              </Text>
            ))}
          </View>

          <View style={styles.daysGrid}>
            {Array.from({length: cells.length / 7}, (_, weekIndex) => {
              const week = cells.slice(weekIndex * 7, weekIndex * 7 + 7);
              return (
                <View key={`week-${weekIndex}`} style={styles.weekDaysRow}>
                  {week.map((cell, dayIndex) => {
                    const index = weekIndex * 7 + dayIndex;
                    const isStart = sameDay(cell.date, rangeStart);
                    const isEnd = sameDay(cell.date, rangeEnd);
                    const inRange =
                      rangeStart &&
                      rangeEnd &&
                      cell.date >= rangeStart &&
                      cell.date <= rangeEnd;
                    const mid = inRange && !isStart && !isEnd;

                    return (
                      <Pressable
                        key={`${cell.date.toISOString()}-${index}`}
                        style={[
                          styles.dayCell,
                          mid && styles.dayInRange,
                          isStart && rangeEnd && styles.dayRangeStart,
                          isEnd && rangeStart && styles.dayRangeEnd,
                          isStart && isEnd && styles.dayInRange,
                        ]}
                        onPress={() => onPickDay(cell.date)}>
                        {isStart || isEnd ? (
                          <View style={styles.daySelected}>
                            <Text
                              style={[styles.dayText, styles.dayTextSelected]}>
                              {cell.date.getDate()}
                            </Text>
                          </View>
                        ) : (
                          <Text
                            style={[
                              styles.dayText,
                              !cell.current && styles.dayTextMuted,
                              mid && styles.dayTextInRange,
                            ]}>
                            {cell.date.getDate()}
                          </Text>
                        )}
                      </Pressable>
                    );
                  })}
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.rangeTop}>
            <Text style={styles.rangeLabel}>SELECTED RANGE</Text>
            <Text style={styles.rangeDays}>
              {rangeCount ? `${rangeCount} days` : 'Pick dates'}
            </Text>
          </View>
          <View style={styles.rangeDates}>
            <View style={styles.rangeFrom}>
              <Text style={styles.rangeHint}>From</Text>
              <Text style={styles.rangeValue}>{formatLong(rangeStart)}</Text>
            </View>
            <Feather name="arrow-right" size={20} color={colors.gray[400]} />
            <View style={styles.rangeTo}>
              <Text style={styles.rangeHint}>To</Text>
              <Text style={styles.rangeValue}>{formatLong(rangeEnd)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryIcon}>
            <Feather name="clock" size={18} color={colors.orange[600]} />
          </View>
          <View style={styles.summaryCopy}>
            <Text style={styles.summaryTitle}>18 trips in this range</Text>
            <Text style={styles.summaryMeta}>
              ₹4,286 total · 14 completed · 4 cancelled
            </Text>
          </View>
        </View>

        <View style={styles.toggleCard}>
          <View style={styles.toggleCopy}>
            <Text style={styles.toggleTitle}>Include cancelled rides</Text>
            <Text style={styles.toggleMeta}>
              Show trips you or the driver cancelled
            </Text>
          </View>
          <Pressable
            accessibilityRole="switch"
            accessibilityState={{checked: includeCancelled}}
            onPress={() => setIncludeCancelled(v => !v)}
            style={[
              styles.switchTrack,
              includeCancelled
                ? styles.switchTrackOn
                : styles.switchTrackOff,
            ]}>
            <View style={styles.switchThumb} />
          </Pressable>
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          {paddingBottom: Math.max(insets.bottom, 12)},
        ]}>
        <Pressable
          style={styles.applyBtn}
          onPress={() => {
            showToast({
              type: 'success',
              message: `Applied ${formatLong(rangeStart)} – ${formatLong(rangeEnd)}`,
            });
            navigation.goBack();
          }}
          accessibilityRole="button"
          accessibilityLabel="Apply date range">
          <Text style={styles.applyText}>Apply date range</Text>
        </Pressable>
      </View>
    </View>
  );
}
