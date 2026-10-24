import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { CreateAccountScreenStyles as s } from "../../constants/styles";
import { useTheme } from "../context/ThemeContext";
import type { RootStackParamList } from "../types";
import { validateCreateAccount } from "../../utils/validation";

export default function CreateAccountScreen() {
  const { colors, isDark } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleCreate = async () => {
    setTouched({ name: true, username: true, email: true, password: true });
    const result = validateCreateAccount({ name, username, email, password });
    if (!result.ok) {
      const err: Record<string, string> = {};
      (Object.keys(result.errors) as Array<keyof typeof result.errors>).forEach((k) => {
        const v = result.errors[k];
        if (typeof v === "string" && v.length > 0) {
          err[k as string] = v;
        }
      });
      setErrors(err);
      // Show first error as alert for visibility
      const firstKey = Object.keys(err)[0];
      if (firstKey && err[firstKey]) {
        Alert.alert("Validation Error", err[firstKey]);
      }
      return;
    }
    await AsyncStorage.multiSet([
      ["isLoggedIn", "true"],
      ["profileName", result.trimmed.name],
      ["profileUsername", result.trimmed.username],
      ["profileEmail", result.trimmed.email],
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
        <Text style={[s.heading, { color: colors.text }]}>
          Create Account
        </Text>
        <Text style={[s.subtitle, { color: colors.muted }]}>
          Set up your profile to get started
        </Text>
        <Text style={{ color: colors.muted, fontSize: 12, marginTop: 6 }}>
          Fields marked with <Text style={{ color: colors.danger }}>*</Text> are required
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
            name="person-outline"
            size={18}
            color={colors.muted}
            style={s.inputIcon}
          />
          <TextInput
            style={[s.input, { color: colors.text }]}
            value={name}
            onChangeText={(v) => {
              setName(v);
              if (touched.name) {
                const r = validateCreateAccount({ name: v, username, email, password });
                setErrors((e) => {
                  const next = { ...e };
                  if (r.errors.name) next.name = r.errors.name;
                  else delete next.name;
                  return next;
                });
              }
            }}
            onBlur={() => {
              setTouched((t) => ({ ...t, name: true }));
              const r = validateCreateAccount({ name, username, email, password });
              setErrors((e) => {
                const next = { ...e };
                if (r.errors.name) next.name = r.errors.name;
                else delete next.name;
                return next;
              });
            }}
            placeholder="Full Name (e.g. John Doe) *"
            placeholderTextColor={colors.muted}
            autoCapitalize="words"
            autoCorrect={false}
          />
        </View>
        {touched.name && errors.name ? (
          <Text style={{ color: colors.danger, marginTop: 6, marginLeft: 4, fontSize: 12 }}>
            {errors.name}
          </Text>
        ) : null}

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
            onChangeText={(v) => {
              setUsername(v);
              if (touched.username) {
                const r = validateCreateAccount({ name, username: v, email, password });
                setErrors((e) => {
                  const next = { ...e };
                  if (r.errors.username) next.username = r.errors.username;
                  else delete next.username;
                  return next;
                });
              }
            }}
            onBlur={() => {
              setTouched((t) => ({ ...t, username: true }));
              const r = validateCreateAccount({ name, username, email, password });
              setErrors((e) => {
                const next = { ...e };
                if (r.errors.username) next.username = r.errors.username;
                else delete next.username;
                return next;
              });
            }}
            placeholder="Username *"
            placeholderTextColor={colors.muted}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
        {touched.username && errors.username ? (
          <Text style={{ color: colors.danger, marginTop: 6, marginLeft: 4, fontSize: 12 }}>
            {errors.username}
          </Text>
        ) : null}

        <View
          style={[
            s.inputWrap,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Ionicons
            name="mail-outline"
            size={18}
            color={colors.muted}
            style={s.inputIcon}
          />
          <TextInput
            style={[s.input, { color: colors.text }]}
            value={email}
            onChangeText={(v) => {
              setEmail(v);
              if (touched.email) {
                const r = validateCreateAccount({ name, username, email: v, password });
                setErrors((e) => {
                  const next = { ...e };
                  if (r.errors.email) next.email = r.errors.email;
                  else delete next.email;
                  return next;
                });
              }
            }}
            onBlur={() => {
              setTouched((t) => ({ ...t, email: true }));
              const r = validateCreateAccount({ name, username, email, password });
              setErrors((e) => {
                const next = { ...e };
                if (r.errors.email) next.email = r.errors.email;
                else delete next.email;
                return next;
              });
            }}
            placeholder="Email *"
            placeholderTextColor={colors.muted}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
        {touched.email && errors.email ? (
          <Text style={{ color: colors.danger, marginTop: 6, marginLeft: 4, fontSize: 12 }}>
            {errors.email}
          </Text>
        ) : null}

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
            onChangeText={(v) => {
              setPassword(v);
              if (touched.password) {
                const r = validateCreateAccount({ name, username, email, password: v });
                setErrors((e) => {
                  const next = { ...e };
                  if (r.errors.password) next.password = r.errors.password;
                  else delete next.password;
                  return next;
                });
              }
            }}
            onBlur={() => {
              setTouched((t) => ({ ...t, password: true }));
              const r = validateCreateAccount({ name, username, email, password });
              setErrors((e) => {
                const next = { ...e };
                if (r.errors.password) next.password = r.errors.password;
                else delete next.password;
                return next;
              });
            }}
            placeholder="Password *"
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
        {touched.password && errors.password ? (
          <Text style={{ color: colors.danger, marginTop: 6, marginLeft: 4, fontSize: 12 }}>
            {errors.password}
          </Text>
        ) : null}

        <TouchableOpacity
          style={[s.createBtn, { backgroundColor: colors.primary }]}
          onPress={handleCreate}
          activeOpacity={0.8}
        >
          <Text style={[s.createBtnTxt, { color: colors.white }]}>
            Create Account
          </Text>
        </TouchableOpacity>
      </View>

      <View style={s.footer}>
        <TouchableOpacity
          onPress={() => navigation.replace("Login")}
          activeOpacity={0.7}
        >
          <Text style={[s.link, { color: colors.primary }]}>
            Already have an account?{" "}
            <Text style={{ fontWeight: "700" }}>Sign In</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

