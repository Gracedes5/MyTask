import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { Platform, StatusBar } from "react-native";
import { SafeAreaInsetsContext } from "react-native-safe-area-context";

import {
  ToastViewport,
  type ToastMessage,
  type ToastType,
} from "../../components/Toast";

export type { ToastMessage, ToastType } from "../../components/Toast";

/** Options accepted by the generic `show` method. */
export type ToastOptions = {
  title: string;
  description?: string;
  /** Milliseconds before auto-dismiss. Defaults to 4000. Use 0 to stay open. */
  duration?: number;
};

/** Extra options accepted by the convenience helpers. */
export type ToastTimingOptions = {
  duration?: number;
};

export type ToastApi = {
  /** Show a toast of any type. Returns the toast id for later dismissal. */
  show: (type: ToastType, options: ToastOptions) => string;
  success: (
    title: string,
    description?: string,
    options?: ToastTimingOptions,
  ) => string;
  error: (
    title: string,
    description?: string,
    options?: ToastTimingOptions,
  ) => string;
  warning: (
    title: string,
    description?: string,
    options?: ToastTimingOptions,
  ) => string;
  info: (
    title: string,
    description?: string,
    options?: ToastTimingOptions,
  ) => string;
  /** Dismiss a single toast by id. */
  dismiss: (id: string) => void;
  /** Dismiss every visible toast. */
  dismissAll: () => void;
};

const DEFAULT_DURATION = 4000;

const ToastContext = createContext<ToastApi | null>(null);

/**
 * Access the toast API from any component or context provider rendered
 * underneath `ToastProvider`.
 */
export const useToast = (): ToastApi => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
};

/**
 * Owns the active toast stack and exposes a stable API object.
 * The viewport is rendered as a sibling of the app tree so toasts sit above
 * navigation without being part of any screen's layout.
 */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
    setToasts([]);
  }, []);

  const show = useCallback(
    (type: ToastType, options: ToastOptions): string => {
      const id = `toast-${Date.now()}-${idRef.current++}`;
      const message: ToastMessage = {
        id,
        type,
        title: options.title,
        description: options.description,
        duration:
          typeof options.duration === "number"
            ? options.duration
            : DEFAULT_DURATION,
      };

      // Append so multiple notifications stack instead of overlapping.
      setToasts((prev) => [...prev, message]);
      return id;
    },
    [],
  );

  const api = useMemo<ToastApi>(() => {
    const helper =
      (type: ToastType) =>
      (
        title: string,
        description?: string,
        options?: ToastTimingOptions,
      ): string =>
        show(type, { title, description, duration: options?.duration });

    return {
      show,
      success: helper("success"),
      error: helper("error"),
      warning: helper("warning"),
      info: helper("info"),
      dismiss,
      dismissAll,
    };
  }, [show, dismiss, dismissAll]);

  // Read safe-area insets without requiring a SafeAreaProvider at the root.
  // React Navigation installs one further down, but the toast overlay lives
  // above it, so fall back to sensible platform values when unavailable.
  const insets = useContext(SafeAreaInsetsContext);
  const fallbackTop =
    Platform.OS === "ios" ? 44 : Platform.OS === "android" ? (StatusBar.currentHeight ?? 24) : 16;
  const topInset = insets?.top ?? fallbackTop;

  return (
    <ToastContext.Provider value={api}>
      {children}
      <ToastViewport
        toasts={toasts}
        onDismiss={dismiss}
        topInset={topInset}
      />
    </ToastContext.Provider>
  );
}
