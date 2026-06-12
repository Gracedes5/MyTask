import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { C, type ColorSet, DARK } from "../../constants/theme";

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

  useEffect(() => {
    AsyncStorage.getItem("dark_mode").then((v) => {
      if (v === "true") setIsDark(true);
    });
  }, []);

  const toggleDarkMode = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      AsyncStorage.setItem("dark_mode", next ? "true" : "false");
      return next;
    });
  }, []);

  const colors = useMemo(() => (isDark ? DARK : C), [isDark]);

  return (
    <ThemeContext.Provider value={{ isDark, colors, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}
