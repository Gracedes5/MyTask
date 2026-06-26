import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { useTheme } from "../app/context/ThemeContext";

const { width, height } = Dimensions.get("window");

const iconList = [
  { name: "checkmark-done", size: 44 },
  { name: "calendar-outline", size: 28 },
  { name: "search-outline", size: 22 },
  { name: "checkmark-done", size: 36 },
  { name: "time-outline", size: 24 },
  { name: "alarm-outline", size: 20 },
];

const positions = [
  { top: height * 0.08, left: -20 },
  { top: height * 0.22, right: -10 },
  { top: height * 0.4, left: -15 },
  { top: height * 0.55, right: -5 },
  { top: height * 0.7, left: -10 },
  { top: height * 0.85, right: -15 },
];

const rotations = [-12, 8, -6, 10, -8, 6];

export default function IconBackground({
  children,
}: {
  children: React.ReactNode;
}) {
  const { colors } = useTheme();

  return (
    <View style={[s.root, { backgroundColor: colors.bg }]}>
      <View style={s.icons} pointerEvents="none">
        {iconList.map((icon, i) => (
          <View
            key={`${icon.name}-${i}`}
            style={[
              s.circle,
              {
                width: icon.size * 2.2,
                height: icon.size * 2.2,
                borderRadius: icon.size * 1.1,
                borderColor: colors.mutedLight,
                opacity: 0.35,
                transform: [{ rotate: `${rotations[i]}deg` }],
                ...positions[i],
              },
            ]}
          >
            <Ionicons
              name={icon.name as any}
              size={icon.size}
              color={colors.primary}
              style={{ opacity: 0.5 }}
            />
          </View>
        ))}
      </View>

      <View style={s.content}>{children}</View>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  icons: { ...StyleSheet.absoluteFillObject },
  circle: {
    position: "absolute",
    borderWidth: 1.5,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  content: { flex: 1 },
});
