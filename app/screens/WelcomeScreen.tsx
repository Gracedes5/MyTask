import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../context/ThemeContext";
import type { RootStackParamList } from "../types";

export default function WelcomeScreen() {
  const { colors, isDark } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleGetStarted = () => navigation.replace("CreateAccount");
  const handleSkip = () => navigation.replace("Login");

  return (
    <View style={[s.container, { backgroundColor: colors.bg }]}>
      <StatusBar style={isDark ? "light" : "dark"} />

      <View style={s.top}>
        <View style={[s.logoWrap, { backgroundColor: colors.highlight }]}>
          <Ionicons name="checkmark-done" size={40} color={colors.primary} />
        </View>
      </View>

      <View style={s.illustration}>
        <View
          style={[s.illoCircle, { borderColor: colors.mutedLight }]}
        >
          <Ionicons name="list-outline" size={48} color={colors.primary} />
        </View>
        <View
          style={[s.illoCircleSm, { backgroundColor: colors.highlight, borderColor: colors.border }]}
        >
          <Ionicons name="calendar-outline" size={24} color={colors.primary} />
        </View>
        <View
          style={[s.illoCircleXs, { backgroundColor: colors.highlight, borderColor: colors.border }]}
        >
          <Ionicons name="search-outline" size={18} color={colors.primary} />
        </View>
      </View>

      <View style={s.textSection}>
        <Text style={[s.headline, { color: colors.text }]}>
          Organize Your Day.{"\n"}Focus on What Matters.
        </Text>
        <Text style={[s.subheading, { color: colors.muted }]}>
          Manage tasks, track priorities, and stay productive with Taskly.
        </Text>
      </View>

      <View style={s.buttons}>
        <TouchableOpacity
          style={[s.primaryBtn, { backgroundColor: colors.primary }]}
          onPress={handleGetStarted}
          activeOpacity={0.8}
        >
          <Text style={[s.primaryBtnTxt, { color: colors.white }]}>
            Get Started
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={s.skipBtn}
          onPress={handleSkip}
          activeOpacity={0.7}
        >
          <Text style={[s.skipBtnTxt, { color: colors.muted }]}>Skip</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 28,
  },
  top: {
    alignItems: "center",
    paddingTop: 80,
  },
  logoWrap: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  illustration: {
    alignItems: "center",
    justifyContent: "center",
    height: 200,
    marginTop: 40,
  },
  illoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  illoCircleSm: {
    position: "absolute",
    top: 10,
    right: 50,
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  illoCircleXs: {
    position: "absolute",
    bottom: 20,
    left: 50,
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  textSection: {
    alignItems: "center",
    marginTop: 20,
  },
  headline: {
    fontSize: 26,
    fontWeight: "800",
    textAlign: "center",
    lineHeight: 34,
    letterSpacing: -0.4,
  },
  subheading: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 22,
    marginTop: 12,
    paddingHorizontal: 10,
  },
  buttons: {
    marginTop: "auto",
    paddingBottom: 50,
    gap: 12,
  },
  primaryBtn: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  primaryBtnTxt: {
    fontSize: 16,
    fontWeight: "700",
  },
  skipBtn: {
    paddingVertical: 10,
    alignItems: "center",
  },
  skipBtnTxt: {
    fontSize: 14,
    fontWeight: "600",
  },
});
