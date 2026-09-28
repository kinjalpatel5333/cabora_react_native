import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Dimensions, PanResponder } from 'react-native';

/**
 * Bottom-sheet drag via translateY.
 * Supports:
 * - 2-state: full screen (0) <-> minHeight/bottom limit (h - minHeight)
 * - Drag down to dismiss (calls onClose if provided)
 * - Drag up to expand
 */
export default function useDraggableSheet({
  peekHeight = 180,
  minHeight,
  visible = true,
  initialExpanded = true,
  onClose,
  dismissThreshold = 100,
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

  const dismissDown = useCallback(() => {
    const screenH = Dimensions.get('window').height;
    const target = heightRef.current > 0 ? heightRef.current + 60 : screenH;
    Animated.timing(translateY, {
      toValue: target,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      onClose?.();
    });
  }, [onClose, translateY]);

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
        onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 3,
        onPanResponderGrant: () => {
          translateY.stopAnimation(value => {
            dragStart.current = value;
          });
        },
        onPanResponderMove: (_, g) => {
          const maxCollapse = collapsedOffset();
          const raw = dragStart.current + g.dy;
          const minVal = 0;
          const maxVal = minHeight
            ? Math.min(maxCollapse + 30, Math.max(minVal, raw))
            : onClose
            ? (heightRef.current > 0 ? heightRef.current + 80 : 600)
            : maxCollapse + 80;
          const next = minHeight ? maxVal : Math.min(maxVal, Math.max(minVal, raw));
          translateY.setValue(next);
        },
        onPanResponderRelease: (_, g) => {
          const maxCollapse = collapsedOffset();
          translateY.stopAnimation(currentValue => {
            if (!minHeight && onClose && (g.vy > 0.8 || currentValue > maxCollapse + dismissThreshold)) {
              dismissDown();
              return;
            }
            if (g.vy < -0.3) {
              snapTo(true);
              return;
            }
            if (g.vy > 0.3) {
              if (minHeight) {
                snapTo(false);
              } else if (onClose) {
                dismissDown();
              } else {
                snapTo(false);
              }
              return;
            }
            if (!minHeight && onClose && currentValue > maxCollapse + dismissThreshold * 0.7) {
              dismissDown();
              return;
            }
            if (maxCollapse > 0) {
              snapTo(currentValue < maxCollapse / 2);
            } else {
              snapTo(true);
            }
          });
        },
      }),
    [collapsedOffset, dismissDown, dismissThreshold, minHeight, onClose, snapTo, translateY],
  );

  return {
    sheetTY: translateY,
    expanded,
    snapTo,
    toggle,
    dismissDown,
    onSheetLayout,
    panHandlers: panResponder.panHandlers,
  };
}


