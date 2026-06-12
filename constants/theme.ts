export type ColorSet = {
  primary: string;
  bg: string;
  card: string;
  text: string;
  success: string;
  warning: string;
  danger: string;
  border: string;
  muted: string;
  mutedLight: string;
  highlight: string;
  white: string;
};

export const C: ColorSet = {
  primary: "#8B5CF6",
  bg: "#F6F2FF",
  card: "#FFFFFF",
  text: "#1E1B2E",
  success: "#32C671",
  warning: "#FFB84D",
  danger: "#FF6B6B",
  border: "#E8E0F7",
  muted: "#8B7EB8",
  mutedLight: "#D0C4F0",
  highlight: "#F0ECFF",
  white: "#FFFFFF",
};

export const DARK: ColorSet = {
  primary: "#A78BFA",
  bg: "#0F0D1A",
  card: "#1A1730",
  text: "#E8E0F7",
  success: "#4ADE80",
  warning: "#FBBF24",
  danger: "#FF6B6B",
  border: "#2E2848",
  muted: "#9A8EBA",
  mutedLight: "#4A3E6A",
  highlight: "#221A3A",
  white: "#FFFFFF",
};

export const Colors = {
  light: {
    text: C.text,
    background: C.bg,
    icon: C.primary,
    tabIconDefault: C.muted,
    tabIconSelected: C.primary,
  },
  dark: {
    text: DARK.text,
    background: DARK.bg,
    icon: DARK.primary,
    tabIconDefault: DARK.muted,
    tabIconSelected: DARK.primary,
  },
};
