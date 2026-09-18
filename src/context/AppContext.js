import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  DEFAULT_THEME,
  getThemeColors,
  palette,
} from '../config/color';

const THEME_STORAGE_KEY = '@cabora_app_theme';

const AppContext = createContext({
  theme: DEFAULT_THEME,
  isDark: false,
  colors: getThemeColors(DEFAULT_THEME),
  palette,
  setTheme: () => {},
  toggleTheme: () => {},
});

export function AppProvider({children}) {
  const [theme, setThemeState] = useState(DEFAULT_THEME);

  useEffect(() => {
    AsyncStorage.getItem(THEME_STORAGE_KEY)
      .then(saved => {
        if (saved === 'dark' || saved === 'light') {
          setThemeState(saved);
        }
      })
      .catch(() => {});
  }, []);

  const setTheme = useCallback(nextTheme => {
    setThemeState(nextTheme);
    AsyncStorage.setItem(THEME_STORAGE_KEY, nextTheme).catch(() => {});
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      AsyncStorage.setItem(THEME_STORAGE_KEY, next).catch(() => {});
      return next;
    });
  }, []);

  const colors = useMemo(() => getThemeColors(theme), [theme]);
  const isDark = theme === 'dark';

  const value = useMemo(
    () => ({theme, isDark, colors, palette, setTheme, toggleTheme}),
    [theme, isDark, colors, setTheme, toggleTheme],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}
