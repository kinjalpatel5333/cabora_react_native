import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Feather } from '@react-native-vector-icons/feather/static';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../../context/AppContext';
import {
  MONTH_FULL_NAMES,
  formatDateToUi,
  parseDateString,
} from '../../utils/dateUtils';
import useThemedStyles from '../useThemedStyles';
import createStyles from './style';
import Button from '../Button';

const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function DatePickerModal({
  visible,
  onClose,
  onSelectDate,
  value,
  initialDate,
  title = 'Select Date',
  minYear = 1940,
  maxYear = 2035,
}) {
  const insets = useSafeAreaInsets();
  const { colors } = useApp();
  const styles = useThemedStyles(createStyles);
  const yearScrollRef = useRef(null);

  const yearsList = useMemo(() => {
    const list = [];
    for (let y = minYear; y <= maxYear; y++) {
      list.push(y);
    }
    return list;
  }, [minYear, maxYear]);

  const activeDateValue = value || initialDate;
  const initialParsed = useMemo(() => parseDateString(activeDateValue), [activeDateValue]);

  const [year, setYear] = useState(() => {
    const y = initialParsed.getFullYear();
    return Math.min(Math.max(y, minYear), maxYear);
  });
  const [monthIndex, setMonthIndex] = useState(initialParsed.getMonth());
  const [selectedDay, setSelectedDay] = useState(initialParsed.getDate());

  useEffect(() => {
    if (visible) {
      const parsed = parseDateString(activeDateValue);
      const clampedYear = Math.min(Math.max(parsed.getFullYear(), minYear), maxYear);
      setYear(clampedYear);
      setMonthIndex(parsed.getMonth());
      setSelectedDay(parsed.getDate());

      // Auto-scroll year bar to selected year
      requestAnimationFrame(() => {
        const yearIdx = yearsList.indexOf(clampedYear);
        if (yearIdx !== -1 && yearScrollRef.current) {
          yearScrollRef.current.scrollTo({
            x: Math.max(0, (yearIdx - 2) * 60),
            animated: false,
          });
        }
      });
    }
  }, [visible, activeDateValue, minYear, maxYear, yearsList]);

  // Calculate days in current month
  const daysInMonth = useMemo(() => {
    return new Date(year, monthIndex + 1, 0).getDate();
  }, [year, monthIndex]);

  // Calculate starting day of the week for the 1st of month (0 = Sun, 1 = Mon...)
  const firstDayOfWeek = useMemo(() => {
    return new Date(year, monthIndex, 1).getDay();
  }, [year, monthIndex]);

  const shiftMonth = delta => {
    let nextMonth = monthIndex + delta;
    let nextYear = year;
    if (nextMonth > 11) {
      nextMonth = 0;
      nextYear += 1;
    } else if (nextMonth < 0) {
      nextMonth = 11;
      nextYear -= 1;
    }
    setMonthIndex(nextMonth);
    setYear(nextYear);

    const maxDays = new Date(nextYear, nextMonth + 1, 0).getDate();
    if (selectedDay > maxDays) {
      setSelectedDay(maxDays);
    }
  };

  const handleSelectYear = y => {
    setYear(y);
    const maxDays = new Date(y, monthIndex + 1, 0).getDate();
    if (selectedDay > maxDays) {
      setSelectedDay(maxDays);
    }
  };

  const handleConfirm = () => {
    const d = new Date(year, monthIndex, selectedDay);
    const formatted = formatDateToUi(d);
    onSelectDate(formatted);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <TouchableOpacity
          activeOpacity={1}
          style={{ flex: 1 }}
          onPress={onClose}
        />
        <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 20) }]}>
          <View style={styles.dragHandle} />

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.closeButton}
              onPress={onClose}
              hitSlop={8}>
              <Feather name="x" size={18} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Month Navigator */}
          <View style={styles.monthNavRow}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.navBtn}
              onPress={() => shiftMonth(-1)}
              hitSlop={6}>
              <Feather name="chevron-left" size={20} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.monthTitle}>
              {MONTH_FULL_NAMES[monthIndex]} {year}
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.navBtn}
              onPress={() => shiftMonth(1)}
              hitSlop={6}>
              <Feather name="chevron-right" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Horizontal Year Selector */}
          <ScrollView
            ref={yearScrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.yearScroll}
            contentContainerStyle={styles.yearScrollContent}>
            {yearsList.map(y => {
              const active = y === year;
              return (
                <TouchableOpacity
                  key={y}
                  activeOpacity={0.7}
                  onPress={() => handleSelectYear(y)}
                  style={[styles.yearChip, active && styles.yearChipActive]}>
                  <Text
                    style={[
                      styles.yearChipText,
                      active && styles.yearChipTextActive,
                    ]}>
                    {y}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Weekday Labels */}
          <View style={styles.weekHeaderRow}>
            {WEEK_DAYS.map(w => (
              <Text key={w} style={styles.weekDayText}>
                {w}
              </Text>
            ))}
          </View>

          {/* Days Grid */}
          <View style={styles.daysGrid}>
            {/* Blank cells for start offset */}
            {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
              <View key={`blank-${idx}`} style={styles.dayCell} />
            ))}

            {/* Month Day cells */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const dayNum = idx + 1;
              const isSelected = dayNum === selectedDay;
              return (
                <TouchableOpacity
                  key={`day-${dayNum}`}
                  activeOpacity={0.7}
                  onPress={() => setSelectedDay(dayNum)}
                  style={styles.dayCell}>
                  <View
                    style={[
                      styles.dayInner,
                      isSelected && styles.dayInnerSelected,
                    ]}>
                    <Text
                      style={[
                        styles.dayText,
                        isSelected && styles.dayTextSelected,
                      ]}>
                      {dayNum}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Confirm Button */}
          {/* <TouchableOpacity
            activeOpacity={0.7}
            style={styles.confirmBtn}
            onPress={handleConfirm}>
            <Text style={styles.confirmBtnText}>Confirm Date</Text>
          </TouchableOpacity> */}
          <Button
            title={"Confirm Date"}
            onPress={handleConfirm}>

          </Button>

        </View>
      </View>
    </Modal>
  );
}
