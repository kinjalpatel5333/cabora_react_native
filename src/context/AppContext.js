import React, {createContext, useContext, useMemo} from 'react';
import colors from '../config/color';

const AppContext = createContext({colors});

export function AppProvider({children}) {
  const value = useMemo(() => ({colors}), []);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}
