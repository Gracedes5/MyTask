import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../context/ThemeContext";
import type { RootStackParamList } from "../types";

const TITLE = "Taskly";
const INTERVAL = 120;

export default function SplashScreen() {
  const { colors, isDark } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const [typeIndex, setTypeIndex] = useState(0);

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.85,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();

    const typeTimer = setInterval(() => {
      setTypeIndex((prev) => {
        if (prev < TITLE.length) return prev + 1;
        clearInterval(typeTimer);
        return prev;
      });
    }, INTERVAL);

    const timer = setTimeout(async () => {
      const loggedIn = await AsyncStorage.getItem("isLoggedIn");
      if (loggedIn === "true") {
        navigation.replace("Tabs");
      } else {
        navigation.replace("Welcome");
      }
    }, 2000);
    return () => {
      clearTimeout(timer);
      clearInterval(typeTimer);
      pulse.stop();
    };
  }, [navigation, pulseAnim]);

  return (
    <View style={[s.container, { backgroundColor: colors.primary }]}>
      <StatusBar style="light" />
      <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
        <Ionicons name="checkmark-done" size={56} color={colors.white} />
      </Animated.View>
      <Text style={[s.title, { color: colors.white }]}>
        {TITLE.slice(0, typeIndex)}
        {typeIndex < TITLE.length && (
          <Text style={[s.cursor, { color: colors.white }]}>|</Text>
        )}
      </Text>
      <Text style={[s.tagline, { color: colors.white }]}>
        Organize your day
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    marginTop: 12,
    letterSpacing: 1,
  },
  cursor: { opacity: 0.7 },
  tagline: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 6,
    opacity: 0.8,
  },
});
