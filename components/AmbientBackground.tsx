import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "../app/context/ThemeContext";

type Props = {
  children: React.ReactNode;
};

export default function AmbientBackground({ children }: Props) {
  const { isDark } = useTheme();

  const colors = isDark
    ? (["#111827", "#0F172A", "#020617"] as const)
    : (["#EEF4FF", "#FFFFFF", "#F8FAFC"] as const);

  return (
    <View style={s.root}>
      <LinearGradient colors={colors} locations={[0, 0.5, 1]} style={s.bg} />

      <View style={s.blobTop} pointerEvents="none">
        <View
          style={[
            s.blob,
            isDark ? s.blobDarkA : s.blobLightA,
          ]}
        />
      </View>
      <View style={s.blobBottom} pointerEvents="none">
        <View
          style={[
            s.blob,
            isDark ? s.blobDarkB : s.blobLightB,
          ]}
        />
      </View>

      <View style={s.content}>{children}</View>
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
  },
  bg: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
  },
  blobTop: {
    position: "absolute",
    top: -80,
    right: -60,
    width: 220,
    height: 220,
  },
  blobBottom: {
    position: "absolute",
    bottom: -60,
    left: -80,
    width: 260,
    height: 260,
  },
  blob: {
    flex: 1,
    borderRadius: 130,
    opacity: 0.35,
  },
  blobLightA: {
    backgroundColor: "#8B5CF6",
  },
  blobLightB: {
    backgroundColor: "#3B82F6",
  },
  blobDarkA: {
    backgroundColor: "#6366F1",
  },
  blobDarkB: {
    backgroundColor: "#8B5CF6",
  },
});
