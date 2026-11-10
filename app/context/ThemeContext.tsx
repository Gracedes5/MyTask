import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { C, type ColorSet, DARK } from "../../constants/theme";
import { storage, StorageKeys } from "../../utils/storage";

type ThemeContextType = {
  isDark: boolean;
  colors: ColorSet;
  toggleDarkMode: () => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be inside ThemeProvider");
  return ctx;
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    storage.getItem(StorageKeys.DARK_MODE).then((v) => {
      setIsDark(v === "true");
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!loaded) return;
    storage.setItem(StorageKeys.DARK_MODE, isDark ? "true" : "false");
  }, [isDark, loaded]);

  const toggleDarkMode = useCallback(() => {
    setIsDark((prev) => !prev);
  }, []);

  const colors = useMemo(() => (isDark ? DARK : C), [isDark]);

  return (
    <ThemeContext.Provider value={{ isDark, colors, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}
