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
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import type { RootStackParamList } from "../types";

export default function CreateAccountScreen() {
  const { colors, isDark } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleCreate = async () => {
    if (!name.trim() || !username.trim()) {
      Alert.alert("Validation", "Please enter name and username.");
      return;
    }
    await AsyncStorage.multiSet([
      ["isLoggedIn", "true"],
      ["profileName", name.trim()],
      ["profileUsername", username.trim()],
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
            onChangeText={setName}
            placeholder="Full Name"
            placeholderTextColor={colors.muted}
            autoCapitalize="words"
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
            name="mail-outline"
            size={18}
            color={colors.muted}
            style={s.inputIcon}
          />
          <TextInput
            style={[s.input, { color: colors.text }]}
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor={colors.muted}
            keyboardType="email-address"
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
  createBtn: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 4,
  },
  createBtnTxt: {
    fontSize: 16,
    fontWeight: "700",
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
