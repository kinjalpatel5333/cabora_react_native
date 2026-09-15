import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import {Pressable, Text, View} from 'react-native';
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
    <Pressable
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
    </Pressable>
  );
}

const ToastContext = createContext({
  showToast: () => {},
  hideToast: () => {},
});

export function ToastProvider({children}) {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const hideToast = useCallback(id => {
    setToasts(current => current.filter(item => item.id !== id));
    if (timers.current[id]) {
      clearTimeout(timers.current[id]);
      delete timers.current[id];
    }
  }, []);

  const showToast = useCallback(
    ({type = 'success', message, duration = 3200} = {}) => {
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
    () => ({showToast, hideToast}),
    [showToast, hideToast],
  );

  return (
    <ToastContext.Provider value={value}>
      <View style={{flex: 1, backgroundColor: 'transparent'}}>
        {children}
        <View
          pointerEvents="box-none"
          style={[styles.host, {paddingTop: insets.top + 8}]}>
          <View pointerEvents="box-none" style={styles.stack}>
            {toasts.map(item => (
              <Toast
                key={item.id}
                type={item.type}
                message={item.message}
                onPress={() => hideToast(item.id)}
              />
            ))}
          </View>
        </View>
      </View>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
