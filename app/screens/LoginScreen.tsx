import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { LoginScreenStyles as s } from "../../constants/styles";
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

