import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, PanResponder } from 'react-native';

/**
 * Bottom-sheet drag via translateY.
 * Supports:
 * - 2-state: full screen (0) <-> minHeight/bottom limit (h - minHeight)
 * - standard peekHeight if minHeight not provided
 */
export default function useDraggableSheet({
  peekHeight = 180,
  minHeight,
  visible = true,
  initialExpanded = true,
}) {
  const translateY = useRef(new Animated.Value(0)).current;
  const dragStart = useRef(0);
  const heightRef = useRef(0);
  const [expanded, setExpanded] = useState(initialExpanded);

  const collapsedOffset = useCallback(() => {
    const h = heightRef.current;
    if (h <= 0) {
      return 0;
    }
    const targetMin = minHeight || peekHeight;
    return Math.max(0, h - targetMin);
  }, [minHeight, peekHeight]);

  const snapTo = useCallback(
    nextExpanded => {
      const target = nextExpanded ? 0 : collapsedOffset();
      setExpanded(nextExpanded);
      Animated.spring(translateY, {
        toValue: target,
        useNativeDriver: true,
        tension: 68,
        friction: 12,
      }).start();
    },
    [collapsedOffset, translateY],
  );

  useEffect(() => {
    if (!visible) {
      return;
    }
    const initOffset = initialExpanded ? 0 : collapsedOffset();
    translateY.setValue(initOffset);
    dragStart.current = initOffset;
    setExpanded(initialExpanded);
  }, [visible, initialExpanded, collapsedOffset, translateY]);

  const toggle = useCallback(() => {
    snapTo(!expanded);
  }, [expanded, snapTo]);

  const onSheetLayout = useCallback(
    event => {
      const h = event.nativeEvent.layout.height;
      if (h > 0 && Math.abs(h - heightRef.current) > 1) {
        heightRef.current = h;
        if (!expanded) {
          translateY.setValue(collapsedOffset());
        }
      }
    },
    [collapsedOffset, expanded, translateY],
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 4,
        onPanResponderGrant: () => {
          translateY.stopAnimation(value => {
            dragStart.current = value;
          });
        },
        onPanResponderMove: (_, g) => {
          const max = collapsedOffset();
          const next = Math.min(max, Math.max(0, dragStart.current + g.dy));
          translateY.setValue(next);
        },
        onPanResponderRelease: (_, g) => {
          const max = collapsedOffset();
          translateY.stopAnimation(currentValue => {
            if (g.vy < -0.4) {
              snapTo(true);
              return;
            }
            if (g.vy > 0.4) {
              snapTo(false);
              return;
            }
            snapTo(currentValue < max / 2);
          });
        },
      }),
    [collapsedOffset, snapTo, translateY],
  );

  return {
    sheetTY: translateY,
    expanded,
    snapTo,
    toggle,
    onSheetLayout,
    panHandlers: panResponder.panHandlers,
  };
}

