import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useRef } from "react";
import {
  AccessibilityInfo,
  Animated,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { ToastStyles as s } from "../constants/styles";
import type { ColorSet } from "../constants/theme";
import { useTheme } from "../app/context/ThemeContext";

/** The four notification severities supported by the toast system. */
export type ToastType = "success" | "error" | "warning" | "info";

/** Internal toast record stored by the ToastProvider. */
export type ToastMessage = {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  /** Milliseconds before auto-dismiss. Use 0 to keep the toast until dismissed. */
  duration: number;
};

type ToastProps = {
  message: ToastMessage;
  onDismiss: (id: string) => void;
};

const DEFAULT_ICONS: Record<
  ToastType,
  React.ComponentProps<typeof Ionicons>["name"]
> = {
  success: "checkmark-circle",
  error: "close-circle",
  warning: "warning",
  info: "information-circle",
};

const TYPE_LABELS: Record<ToastType, string> = {
  success: "Success",
  error: "Error",
  warning: "Warning",
  info: "Information",
};

/** Resolve a toast's accent colour from the active Taskly theme. */
function getTint(type: ToastType, colors: ColorSet): string {
  switch (type) {
    case "success":
      return colors.success;
    case "error":
      return colors.danger;
    case "warning":
      return colors.warning;
    case "info":
    default:
      return colors.primary;
  }
}

/**
 * A single animated toast card.
 * Owns its enter/exit animation and auto-dismiss timer, then reports removal
 * back to the provider so the stack can collapse cleanly.
 */
export default function Toast({ message, onDismiss }: ToastProps) {
  const { colors, isDark } = useTheme();
  const progress = useRef(new Animated.Value(0)).current;
  const closingRef = useRef(false);

  const tint = getTint(message.type, colors);
  const icon = DEFAULT_ICONS[message.type];

  const hide = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;

    Animated.timing(progress, {
      toValue: 0,
      duration: 180,
      useNativeDriver: true,
    }).start(() => {
      onDismiss(message.id);
    });
  }, [message.id, onDismiss, progress]);

  // Entrance animation. Runs once when the toast is mounted.
  useEffect(() => {
    Animated.spring(progress, {
      toValue: 1,
      useNativeDriver: true,
      damping: 18,
      stiffness: 220,
      mass: 0.8,
    }).start();
  }, [progress]);

  // Auto-dismiss timer. Cleared on unmount or when `hide` changes.
  useEffect(() => {
    if (message.duration <= 0) return;
    const timer = setTimeout(hide, message.duration);
    return () => clearTimeout(timer);
  }, [hide, message.duration]);

  // Announce the notification to screen readers on both native and web.
  useEffect(() => {
    if (typeof AccessibilityInfo.announceForAccessibility !== "function") {
      return;
    }
    const details = [message.title, message.description]
      .filter(Boolean)
      .join(". ");
    AccessibilityInfo.announceForAccessibility(
      `${TYPE_LABELS[message.type]}. ${details}`,
    );
  }, [message.type, message.title, message.description]);

  const animatedStyle = {
    opacity: progress,
    transform: [
      {
        translateY: progress.interpolate({
          inputRange: [0, 1],
          outputRange: [-18, 0],
        }),
      },
      {
        scale: progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0.97, 1],
        }),
      },
    ],
  };

  return (
    <Animated.View
      style={[
        s.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          shadowColor: isDark ? "#000000" : colors.primary,
        },
        animatedStyle,
      ]}
      accessibilityLiveRegion="polite"
    >
      <View style={[s.accent, { backgroundColor: tint }]} />

      <View style={[s.iconWrap, { backgroundColor: colors.highlight }]}>
        <Ionicons name={icon} size={20} color={tint} />
      </View>

      <View
        style={s.body}
        accessible
        accessibilityRole="alert"
        accessibilityLabel={`${TYPE_LABELS[message.type]}: ${message.title}${
          message.description ? `. ${message.description}` : ""
        }`}
      >
        <Text style={[s.title, { color: colors.text }]} numberOfLines={2}>
          {message.title}
        </Text>
        {message.description ? (
          <Text
            style={[s.description, { color: colors.muted }]}
            numberOfLines={3}
          >
            {message.description}
          </Text>
        ) : null}
      </View>

      <TouchableOpacity
        onPress={hide}
        style={s.closeBtn}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Dismiss notification"
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons name="close" size={16} color={colors.muted} />
      </TouchableOpacity>
    </Animated.View>
  );
}

type ToastViewportProps = {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
  topInset: number;
};

/**
 * Fixed overlay that stacks active toasts below the safe area.
 * `box-none` lets touches pass through the empty area so navigation stays usable.
 */
export function ToastViewport({
  toasts,
  onDismiss,
  topInset,
}: ToastViewportProps) {
  if (toasts.length === 0) return null;

  return (
    <View
      pointerEvents="box-none"
      style={[s.viewport, { paddingTop: topInset + 10 }]}
    >
      <View pointerEvents="box-none" style={s.stack}>
        {toasts.map((message) => (
          <Toast
            key={message.id}
            message={message}
            onDismiss={onDismiss}
          />
        ))}
      </View>
    </View>
  );
}
