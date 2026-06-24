import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../context/ThemeContext";
import type { RootStackParamList } from "../types";

export default function SplashScreen() {
  const { colors, isDark } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const timer = setTimeout(async () => {
      const loggedIn = await AsyncStorage.getItem("isLoggedIn");
      if (loggedIn === "true") {
        navigation.replace("Tabs");
      } else {
        navigation.replace("Welcome");
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={[s.container, { backgroundColor: colors.primary }]}>
      <StatusBar style="light" />
      <Ionicons name="checkmark-done" size={56} color={colors.white} />
      <Text style={[s.title, { color: colors.white }]}>Taskly</Text>
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
  tagline: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 6,
    opacity: 0.8,
  },
});
