import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import type { RootStackParamList } from "../types";

export default function LoginScreen() {
  const { colors, isDark } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    await AsyncStorage.multiSet([
      ["isLoggedIn", "true"],
      ["profileUsername", username.trim() || "guest"],
    ]);
    navigation.replace("Splash");
  };

  return (
    <KeyboardAvoidingView
      style={[s.container, { backgroundColor: colors.bg }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar style={isDark ? "light" : "dark"} />

      <View style={s.top}>
        <View style={[s.logoWrap, { backgroundColor: colors.highlight }]}>
          <Ionicons name="checkmark-done" size={28} color={colors.primary} />
        </View>
        <Text style={[s.heading, { color: colors.text }]}>Welcome Back</Text>
        <Text style={[s.subtitle, { color: colors.muted }]}>
          Sign in to continue using Taskly
        </Text>
      </View>

      <View style={s.form}>
        <View
          style={[
            s.inputWrap,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Ionicons
            name="at-outline"
            size={18}
            color={colors.muted}
            style={s.inputIcon}
          />
          <TextInput
            style={[s.input, { color: colors.text }]}
            value={username}
            onChangeText={setUsername}
            placeholder="Username"
            placeholderTextColor={colors.muted}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View
          style={[
            s.inputWrap,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Ionicons
            name="lock-closed-outline"
            size={18}
            color={colors.muted}
            style={s.inputIcon}
          />
          <TextInput
            style={[s.input, { color: colors.text }]}
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor={colors.muted}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={18}
              color={colors.muted}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[s.loginBtn, { backgroundColor: colors.primary }]}
          onPress={handleLogin}
          activeOpacity={0.8}
        >
          <Text style={[s.loginBtnTxt, { color: colors.white }]}>Login</Text>
        </TouchableOpacity>

        <View style={s.divider}>
          <View style={[s.dividerLine, { backgroundColor: colors.border }]} />
          <Text style={[s.dividerTxt, { color: colors.muted }]}>
            or continue with
          </Text>
          <View style={[s.dividerLine, { backgroundColor: colors.border }]} />
        </View>

        <TouchableOpacity
          style={[
            s.googleBtn,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
          onPress={() => {}}
          activeOpacity={0.8}
        >
          <Ionicons name="logo-google" size={18} color={colors.text} />
          <Text style={[s.googleBtnTxt, { color: colors.text }]}>
            Continue with Google
          </Text>
        </TouchableOpacity>
      </View>

      <View style={s.footer}>
        <TouchableOpacity
          onPress={() => navigation.replace("CreateAccount")}
          activeOpacity={0.7}
        >
          <Text style={[s.link, { color: colors.primary }]}>
            Don't have an account?{" "}
            <Text style={{ fontWeight: "700" }}>Create One</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  heading: {
    fontSize: 24,
    fontWeight: "800",
    marginTop: 18,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 6,
  },
  form: {
    marginTop: 36,
    gap: 14,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    padding: 0,
  },
  loginBtn: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 4,
  },
  loginBtnTxt: {
    fontSize: 16,
    fontWeight: "700",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerTxt: {
    fontSize: 11,
    fontWeight: "600",
    marginHorizontal: 12,
  },
  googleBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  googleBtnTxt: {
    fontSize: 14,
    fontWeight: "600",
  },
  footer: {
    marginTop: "auto",
    paddingBottom: 40,
    alignItems: "center",
  },
  link: {
    fontSize: 13,
    fontWeight: "500",
  },
});
