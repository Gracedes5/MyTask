import { Ionicons } from "@expo/vector-icons";
import React, { useRef } from "react";
import {
  Animated,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useTheme } from "../app/context/ThemeContext";

type Props = {
  onPress: () => void;
};

export default function VoiceCaptureButton({ onPress }: Props) {
  const { colors } = useTheme();
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 3,
      tension: 200,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={[
        s.wrapper,
        { transform: [{ scale }] },
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        style={[
          s.button,
          {
            backgroundColor: colors.primary,
            shadowColor: colors.primary,
          },
        ]}
      >
        <Ionicons name="mic" size={22} color="#FFFFFF" />
      </TouchableOpacity>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 90,
    right: 20,
    zIndex: 50,
  },
  button: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
});
