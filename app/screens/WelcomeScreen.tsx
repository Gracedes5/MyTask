import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { WelcomeScreenStyles as s } from "../../constants/styles";
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

