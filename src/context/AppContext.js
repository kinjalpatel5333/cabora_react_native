import React, {createContext, useContext, useMemo, useState} from 'react';
import {
  DEFAULT_THEME,
  getThemeColors,
  palette,
} from '../config/color';

const AppContext = createContext({
  theme: DEFAULT_THEME,
  colors: getThemeColors(DEFAULT_THEME),
  palette,
  setTheme: () => {},
});

export function AppProvider({children}) {
  const [theme, setTheme] = useState(DEFAULT_THEME);
  const colors = useMemo(() => getThemeColors(theme), [theme]);
  const value = useMemo(
    () => ({theme, colors, palette, setTheme}),
    [theme, colors],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}
