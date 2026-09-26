import { PASSENGER_SET_ROUTE_STOP_POOL } from '../../config/staticData';
import React, {useEffect, useMemo, useState} from 'react';
import {Animated, Dimensions, Modal, ScrollView, Text, View, TouchableOpacity} from 'react-native';
import {Feather} from '@react-native-vector-icons/feather/static';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import useThemedStyles from '../../components/useThemedStyles';
import {useApp} from '../../context/AppContext';
import useDraggableSheet from '../../hooks/useDraggableSheet';
import createStyles from './yourRouteStyle';
import colors from '../../config/color';
import {ToastHost} from '../../components';

const STOP_POOL = PASSENGER_SET_ROUTE_STOP_POOL;

const BASE_FARE = 480;
const PER_STOP_FARE = 66;

function makeId() {
  return `stop-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export default function YourRouteModal({
  visible,
  onClose,
  pickup = 'Indiranagar 100ft Road',
  drop = 'Whitefield · Prestige Tech Park',
  onConfirm,
}) {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);
  const {colors} = useApp();

  const [stops, setStops] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    if (!visible) {
      return;
    }
    const initial = [
      {
        id: 'pickup',
        kind: 'pickup',
        label: 'Pickup',
        address: pickup || 'Indiranagar 100ft Road',
      },
      {
        id: makeId(),
        kind: 'stop',
        label: 'Stop 1',
        address: STOP_POOL[0],
      },
      {
        id: makeId(),
        kind: 'stop',
        label: 'Stop 2',
        address: STOP_POOL[1],
      },
      {
        id: 'drop',
        kind: 'drop',
        label: 'Drop',
        address: drop || 'Whitefield · Prestige Tech Park',
      },
    ];
    setStops(initial);
    setSelectedId(initial[2].id);
  }, [visible, pickup, drop]);

  const midStops = useMemo(
    () => stops.filter(item => item.kind === 'stop'),
    [stops],
  );

  const fare = BASE_FARE + midStops.length * PER_STOP_FARE;
  const canAddStop = midStops.length < 3;

  const relabel = list => {
    let stopIndex = 0;
    return list.map(item => {
      if (item.kind === 'stop') {
        stopIndex += 1;
        return {...item, label: `Stop ${stopIndex}`};
      }
      return item;
    });
  };

  const removeStop = id => {
    setStops(prev => relabel(prev.filter(item => item.id !== id)));
    if (selectedId === id) {
      setSelectedId(null);
    }
  };

  const addStop = () => {
    if (!canAddStop) {
      return;
    }
    const nextAddress = STOP_POOL[midStops.length % STOP_POOL.length];
    setStops(prev => {
      const dropIndex = prev.findIndex(item => item.kind === 'drop');
      const next = [...prev];
      const created = {
        id: makeId(),
        kind: 'stop',
        label: `Stop ${midStops.length + 1}`,
        address: nextAddress,
      };
      next.splice(dropIndex, 0, created);
      return relabel(next);
    });
  };

  const moveStop = (id, direction) => {
    setStops(prev => {
      const index = prev.findIndex(item => item.id === id);
      if (index < 0 || prev[index].kind !== 'stop') {
        return prev;
      }
      const target = index + direction;
      if (target <= 0 || target >= prev.length - 1) {
        return prev;
      }
      if (prev[target].kind !== 'stop') {
        return prev;
      }
      const next = [...prev];
      const [row] = next.splice(index, 1);
      next.splice(target, 0, row);
      return relabel(next);
    });
  };

  const sheetMaxH = Dimensions.get('window').height * 0.72;
  const {sheetTY, panHandlers, toggle, expanded, onSheetLayout} =
    useDraggableSheet({
      peekHeight: 200,
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
        <TouchableOpacity activeOpacity={0.7} style={styles.backdrop} onPress={onClose} />

        <View style={styles.routePreview} pointerEvents="none">
          <View style={styles.routeLine} />
          <View style={[styles.routeDot, styles.routeDotStart]} />
          {midStops.slice(0, 3).map((_, index) => (
            <View
              key={`pin-${index}`}
              style={[
                styles.routePin,
                {left: `${28 + index * 22}%`, top: 28 + index * 18},
              ]}>
              <Text style={styles.routePinText}>{index + 1}</Text>
            </View>
          ))}
          <View style={[styles.routeDot, styles.routeDotEnd]} />
        </View>

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
            <TouchableOpacity activeOpacity={0.7}
              onPress={toggle}
              accessibilityRole="button"
              accessibilityLabel={expanded ? 'Collapse sheet' : 'Expand sheet'}
              style={styles.grabberHit}>
              <View style={styles.grabber} />
            </TouchableOpacity>
          </View>

          <View style={styles.headerRow}>
            <View style={styles.headerCopy}>
              <Text style={styles.title}>Your route</Text>
              <Text style={styles.subtitle}>
                Drag to reorder · up to 3 stops
              </Text>
            </View>
            <View style={styles.fareBadge}>
              <View style={styles.fareBadgeDot} />
              <Text style={styles.fareBadgeText}>Fare updated</Text>
            </View>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            style={styles.list}
            contentContainerStyle={styles.listContent}>
            {stops.map((item, index) => {
              const selected = selectedId === item.id;
              const isMid = item.kind === 'stop';
              return (
                <TouchableOpacity activeOpacity={0.7}
                  key={item.id}
                  onPress={() => setSelectedId(item.id)}
                  style={[styles.stopCard, selected && styles.stopCardActive]}>
                  <TouchableOpacity activeOpacity={0.7}
                    hitSlop={6}
                    onPress={() => {
                      if (!isMid) {
                        return;
                      }
                      moveStop(item.id, index < stops.length / 2 ? 1 : -1);
                    }}
                    style={styles.dragHandle}>
                    <Feather name="menu" size={18} color={colors.muted} />
                  </TouchableOpacity>

                  <View
                    style={[
                      styles.stopDot,
                      item.kind === 'pickup'
                        ? styles.stopDotPickup
                        : styles.stopDotNavy,
                    ]}
                  />

                  <View style={styles.stopCopy}>
                    <Text style={styles.stopLabel}>{item.label}</Text>
                    <Text style={styles.stopAddress} numberOfLines={1}>
                      {item.address}
                    </Text>
                  </View>

                  {isMid ? (
                    <TouchableOpacity activeOpacity={0.7}
                      accessibilityRole="button"
                      accessibilityLabel={`Remove ${item.label}`}
                      onPress={() => removeStop(item.id)}
                      hitSlop={8}>
                      <Feather name="x" size={18} color={colors.muted} />
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.xSpacer} />
                  )}
                </TouchableOpacity>
              );
            })}

            {canAddStop ? (
              <TouchableOpacity activeOpacity={0.7} style={styles.addStopBtn} onPress={addStop}>
                <Feather name="plus" size={18} color={colors.orange[500]} />
                <Text style={styles.addStopText}>Add another stop</Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.maxStopsHint}>Maximum of 3 stops added</Text>
            )}
          </ScrollView>

          <View style={styles.footer}>
            <View style={styles.fareCopy}>
              <Text style={styles.fareLabel}>Updated fare</Text>
              <Text style={styles.fareValue}>₹{fare}</Text>
              <Text style={styles.fareHint}>
                Each stop adds up to 5 free waiting minutes
              </Text>
            </View>
            <TouchableOpacity activeOpacity={0.7}
              style={styles.confirmBtn}
              onPress={() => {
                onConfirm?.(stops, fare);
                onClose?.();
              }}>
              <Text style={styles.confirmText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        <TouchableOpacity activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={onClose}
          hitSlop={12}
          style={[styles.backBtn, {top: insets.top + 8}]}>
          <Feather name="arrow-left" size={22} color={colors.text} />
        </TouchableOpacity>

        <ToastHost />
      </View>
    </Modal>
  );
}
