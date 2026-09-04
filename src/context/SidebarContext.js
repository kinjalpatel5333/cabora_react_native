import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';

const SidebarContext = createContext({
  open: false,
  activeTab: 'Home',
  openDrawer: () => {},
  closeDrawer: () => {},
  setActiveTab: () => {},
  setNavigator: () => {},
  goTo: () => {},
});

export function SidebarProvider({children}) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Home');
  const navRef = useRef(null);

  const openDrawer = useCallback(() => setOpen(true), []);
  const closeDrawer = useCallback(() => setOpen(false), []);
  const setNavigator = useCallback(navigation => {
    navRef.current = navigation;
  }, []);
  const goTo = useCallback(screen => {
    navRef.current?.navigate(screen);
    setActiveTab(screen);
    setOpen(false);
  }, []);

  const value = useMemo(
    () => ({
      open,
      activeTab,
      openDrawer,
      closeDrawer,
      setActiveTab,
      setNavigator,
      goTo,
    }),
    [open, activeTab, openDrawer, closeDrawer, setNavigator, goTo],
  );

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
}

export function useSidebar() {
  return useContext(SidebarContext);
}
