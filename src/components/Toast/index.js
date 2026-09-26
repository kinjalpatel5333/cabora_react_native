import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {Animated, Text, View, TouchableOpacity} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useApp} from '../../context/AppContext';
import Icon from '../Icon';
import useThemedStyles from '../useThemedStyles';
import createStyles from './style';

const ICONS = {
  success: {name: 'check', colorKey: 'success'},
  error: {name: 'alert', colorKey: 'danger'},
  info: {name: 'info', colorKey: 'info'},
  warning: {name: 'warning', colorKey: 'warning'},
};

export default function Toast({
  type = 'success',
  message,
  onPress,
}) {
  const {colors} = useApp();
  const styles = useThemedStyles(createStyles);
  const spec = ICONS[type] || ICONS.info;

  return (
    <TouchableOpacity activeOpacity={0.7}
      accessibilityRole="alert"
      onPress={onPress}
      style={styles.toast}>
      <Icon
        name={spec.name}
        color={colors[spec.colorKey]}
        size={22}
        circle
      />
      <Text style={styles.message}>{message}</Text>
    </TouchableOpacity>
  );
}

function AnimatedToastItem({item, onDismiss}) {
  const {colors} = useApp();
  const styles = useThemedStyles(createStyles);
  const spec = ICONS[item.type] || ICONS.info;
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: 1,
      tension: 70,
      friction: 12,
      useNativeDriver: true,
    }).start();
  }, [anim]);

  const handleDismiss = () => {
    Animated.timing(anim, {
      toValue: 0,
      duration: 180,
      useNativeDriver: true,
    }).start(() => {
      onDismiss(item.id);
    });
  };

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-20, 0],
  });

  const opacity = anim.interpolate({
    inputRange: [0, 0.2, 1],
    outputRange: [0, 0.7, 1],
  });

  const scale = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.96, 1],
  });

  const displayMessage =
    typeof item.message === 'string'
      ? item.message
      : typeof item.message?.message === 'string'
        ? item.message.message
        : typeof item.message?.error === 'string'
          ? item.message.error
          : typeof item.message?.detail === 'string'
            ? item.message.detail
            : JSON.stringify(item.message || '');

  return (
    <Animated.View
      style={[
        styles.toastWrapper,
        {
          opacity,
          transform: [{translateY}, {scale}],
        },
      ]}
      pointerEvents="box-none">
      <TouchableOpacity activeOpacity={0.7}
        accessibilityRole="alert"
        onPress={handleDismiss}
        style={styles.toast}>
        <Icon
          name={spec.name}
          color={colors[spec.colorKey]}
          size={22}
          circle
        />
        <Text style={styles.message}>{displayMessage}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const ToastContext = createContext({
  toasts: [],
  showToast: () => {},
  hideToast: () => {},
});

export function ToastHost() {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);
  const {toasts, hideToast} = useContext(ToastContext);

  if (!toasts || toasts.length === 0) {
    return null;
  }

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.host,
        {paddingTop: insets.top > 0 ? insets.top + 8 : 16},
      ]}>
      <View pointerEvents="box-none" style={styles.stack}>
        {toasts.map(item => (
          <AnimatedToastItem
            key={item.id}
            item={item}
            onDismiss={hideToast}
          />
        ))}
      </View>
    </View>
  );
}

export function ToastProvider({children}) {
  const [toasts, setToasts] = useState([]);
  const styles = useThemedStyles(createStyles);
  const timers = useRef({});

  const hideToast = useCallback(id => {
    setToasts(current => current.filter(item => item.id !== id));
    if (timers.current[id]) {
      clearTimeout(timers.current[id]);
      delete timers.current[id];
    }
  }, []);

  const showToast = useCallback(
    ({type = 'success', message, duration = 3000} = {}) => {
      if (!message) {
        return;
      }
      const id = `${Date.now()}-${Math.random()}`;
      setToasts(current => [...current.slice(-2), {id, type, message}]);
      timers.current[id] = setTimeout(() => hideToast(id), duration);
    },
    [hideToast],
  );

  const value = useMemo(
    () => ({toasts, showToast, hideToast}),
    [toasts, showToast, hideToast],
  );

  return (
    <ToastContext.Provider value={value}>
      <View style={styles.providerRoot} pointerEvents="box-none">
        {children}
        <ToastHost />
      </View>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}

