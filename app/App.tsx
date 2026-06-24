import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  NavigationContainer,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { TaskProvider, useTasks } from "./context/TaskContext";
import { ThemeProvider, useTheme } from "./context/ThemeContext";

import AddTaskScreen from "./screens/AddTaskScreen";
import CreateAccountScreen from "./screens/CreateAccountScreen";
import LoginScreen from "./screens/LoginScreen";
import SearchScreen from "./screens/SearchScreen";
import SplashScreen from "./screens/SplashScreen";
import TodayScreen from "./screens/TodayScreen";
import UpcomingScreen from "./screens/UpcomingScreen";
import WelcomeScreen from "./screens/WelcomeScreen";
import type { RootStackParamList, TabParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function Tabs() {
  const { tasks, deleteTask } = useTasks();
  const { colors, isDark, toggleDarkMode } = useTheme();
  const route = useRoute();
  const rootNavigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const routeScreen =
    (route.params as { screen?: keyof TabParamList })?.screen || "Today";
  const [initialTab, setInitialTab] = useState<keyof TabParamList>(
    routeScreen as keyof TabParamList,
  );
  useEffect(() => {
    const p = route.params as { screen?: keyof TabParamList } | undefined;
    const target = p?.screen;
    if (target && target !== initialTab) {
      setInitialTab(target);
    }
  }, [route.params, initialTab]);

  const [profileOpen, setProfileOpen] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [notifEnabled, setNotifEnabled] = useState(true);
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [summaryEnabled, setSummaryEnabled] = useState(false);
  const [aboutExpanded, setAboutExpanded] = useState(false);

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileName, setProfileName] = useState("User");
  const [profileUsername, setProfileUsername] = useState("");

  useEffect(() => {
    AsyncStorage.multiGet(["profileImage", "profileName", "profileUsername"]).then(
      ([img, name, uname]) => {
        if (img[1]) setProfileImage(img[1]);
        if (name[1]) setProfileName(name[1]);
        if (uname[1]) setProfileUsername(uname[1]);
      },
    );
  }, []);

  const pickImage = useCallback(async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]?.uri) {
      const uri = result.assets[0].uri;
      setProfileImage(uri);
      await AsyncStorage.setItem("profileImage", uri);
    }
  }, []);

  const handleLogout = useCallback(async () => {
    await AsyncStorage.multiRemove(["isLoggedIn", "profileName", "profileUsername"]);
    setSettingsVisible(false);
    rootNavigation.replace("Login");
  }, [rootNavigation]);

  return (
    <>
      {/* ── Dark-mode-aware status bar ── */}
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* ── Menu bar ── */}
      <View style={[s.menuBar, { backgroundColor: colors.primary }]}>
        <TouchableOpacity
          onPress={() => setProfileOpen(true)}
          style={s.profileBtn}
          activeOpacity={0.7}
        >
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={s.profileBtnImg} />
          ) : (
            <Ionicons name="person-circle-outline" size={24} color={colors.white} />
          )}
        </TouchableOpacity>
        <Text style={[s.menuTitle, { color: colors.white }]}>Taskly</Text>
        <TouchableOpacity
          onPress={() => setSettingsVisible(true)}
          style={s.settingsBtn}
          activeOpacity={0.7}
        >
          <Ionicons name="settings-outline" size={20} color={colors.white} />
        </TouchableOpacity>
      </View>

      <Tab.Navigator
        key={initialTab}
        initialRouteName={initialTab}
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.muted,
          tabBarStyle: {
            backgroundColor: colors.card,
            borderTopColor: colors.border,
          },
          tabBarIcon: ({ color, size }) => {
            const icons: any = {
              Today: "calendar",
              Upcoming: "grid",
              Search: "search",
            };

            return (
              <Ionicons name={icons[route.name]} size={size} color={color} />
            );
          },
        })}
      >
        <Tab.Screen name="Today" component={TodayScreen} />
        <Tab.Screen name="Upcoming" component={UpcomingScreen} />
        <Tab.Screen name="Search" component={SearchScreen} />
      </Tab.Navigator>

      {/* ── Profile modal ── */}
      <Modal
        visible={profileOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setProfileOpen(false)}
      >
        <TouchableOpacity
          style={s.overlay}
          activeOpacity={1}
          onPress={() => setProfileOpen(false)}
        >
          <SafeAreaView
            style={[
              s.menuSheet,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View
              style={[s.menuHandle, { backgroundColor: colors.mutedLight }]}
            />
            <Text style={[s.menuHdr, { color: colors.text }]}>Profile</Text>

            <View style={s.profileAvatarWrap}>
              <TouchableOpacity onPress={pickImage} activeOpacity={0.8}>
                <View
                  style={[
                    s.profileAvatar,
                    { backgroundColor: colors.highlight },
                  ]}
                >
                  {profileImage ? (
                    <Image
                      source={{ uri: profileImage }}
                      style={s.profileAvatarImg}
                    />
                  ) : (
                    <Ionicons
                      name="person"
                      size={40}
                      color={colors.primary}
                    />
                  )}
                </View>
                <View
                  style={[
                    s.profileAvatarBadge,
                    { backgroundColor: colors.primary },
                  ]}
                >
                  <Ionicons name="camera" size={14} color={colors.white} />
                </View>
              </TouchableOpacity>
            </View>

            <Text style={[s.profileName, { color: colors.text }]}>
              {profileName}
            </Text>
            {profileUsername ? (
              <Text style={[s.profileJoin, { color: colors.muted }]}>
                @{profileUsername}
              </Text>
            ) : null}

            <View
              style={[
                s.profileStatsRow,
                {
                  backgroundColor: colors.highlight,
                  borderColor: colors.border,
                },
              ]}
            >
              <View style={s.profileStat}>
                <Text style={[s.profileStatNum, { color: colors.text }]}>
                  {tasks.length}
                </Text>
                <Text style={[s.profileStatLabel, { color: colors.muted }]}>
                  Total
                </Text>
              </View>
              <View style={[s.profileStatDiv, { backgroundColor: colors.border }]} />
              <View style={s.profileStat}>
                <Text style={[s.profileStatNum, { color: colors.text }]}>
                  {tasks.filter((t) => t.done).length}
                </Text>
                <Text style={[s.profileStatLabel, { color: colors.muted }]}>
                  Done
                </Text>
              </View>
              <View style={[s.profileStatDiv, { backgroundColor: colors.border }]} />
              <View style={s.profileStat}>
                <Text style={[s.profileStatNum, { color: colors.text }]}>
                  {tasks.length > 0
                    ? Math.round(
                        (tasks.filter((t) => t.done).length / tasks.length) * 100,
                      )
                    : 0}
                  %
                </Text>
                <Text style={[s.profileStatLabel, { color: colors.muted }]}>
                  Rate
                </Text>
              </View>
            </View>
          </SafeAreaView>
        </TouchableOpacity>
      </Modal>

      {/* ── Settings Modal ── */}
      <Modal
        visible={settingsVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setSettingsVisible(false)}
      >
        <TouchableOpacity
          style={s.overlay}
          activeOpacity={1}
          onPress={() => setSettingsVisible(false)}
        >
          <SafeAreaView
            style={[
              s.settingsSheet,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View
              style={[s.settingsHandle, { backgroundColor: colors.mutedLight }]}
            />
            <Text style={[s.settingsTitle, { color: colors.text }]}>
              Settings
            </Text>

            <TouchableOpacity
              style={s.settingsRow}
              onPress={() => setNotifEnabled(!notifEnabled)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={notifEnabled ? "checkbox" : "square-outline"}
                size={20}
                color={notifEnabled ? colors.primary : colors.muted}
              />
              <Text style={[s.settingsLabel, { color: colors.text }]}>
                Enable Notifications
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={s.settingsRow}
              onPress={() => setReminderEnabled(!reminderEnabled)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={reminderEnabled ? "checkbox" : "square-outline"}
                size={20}
                color={reminderEnabled ? colors.primary : colors.muted}
              />
              <Text style={[s.settingsLabel, { color: colors.text }]}>
                Reminder 15 mins before
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={s.settingsRow}
              onPress={() => setSummaryEnabled(!summaryEnabled)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={summaryEnabled ? "checkbox" : "square-outline"}
                size={20}
                color={summaryEnabled ? colors.primary : colors.muted}
              />
              <Text style={[s.settingsLabel, { color: colors.text }]}>
                Daily Summary
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={s.settingsRow}
              onPress={toggleDarkMode}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isDark ? "checkbox" : "square-outline"}
                size={20}
                color={isDark ? colors.primary : colors.muted}
              />
              <Text style={[s.settingsLabel, { color: colors.text }]}>
                Dark Mode
              </Text>
            </TouchableOpacity>

            <View
              style={[s.settingsDivider, { backgroundColor: colors.highlight }]}
            />

            <TouchableOpacity
              style={s.settingsRow}
              onPress={() => {
                tasks.filter((t) => t.done).forEach((t) => deleteTask(t.id));
                setSettingsVisible(false);
              }}
              activeOpacity={0.7}
            >
              <Ionicons
                name="close-circle-outline"
                size={20}
                color={colors.danger}
              />
              <Text style={[s.settingsLabel, { color: colors.danger }]}>
                Clear Completed Tasks
              </Text>
            </TouchableOpacity>

            <View
              style={[s.settingsDivider, { backgroundColor: colors.highlight }]}
            />

            <TouchableOpacity
              onPress={() => setAboutExpanded(!aboutExpanded)}
              activeOpacity={0.7}
            >
              <View style={s.settingsAboutRow}>
                <Text style={[s.settingsAbout, { color: colors.muted }]}>
                  About Taskly
                </Text>
                <Ionicons
                  name={aboutExpanded ? "chevron-up" : "chevron-forward"}
                  size={14}
                  color={colors.mutedLight}
                />
              </View>
              {aboutExpanded && (
                <>
                  <Text
                    style={[
                      s.settingsVersion,
                      { color: colors.mutedLight, marginTop: 4 },
                    ]}
                  >
                    Taskly v1.0
                  </Text>
                  <Text style={[s.settingsDesc, { color: colors.muted }]}>
                    A simple productivity app, helps you organize,{"\n"}
                    schedule, and complete tasks efficiently.
                  </Text>
                </>
              )}
            </TouchableOpacity>

            <View
              style={[s.settingsDivider, { backgroundColor: colors.highlight }]}
            />

            <TouchableOpacity
              style={s.settingsRow}
              onPress={() => {
                Alert.alert(
                  "Logout",
                  "Are you sure you want to logout?",
                  [
                    { text: "Cancel", style: "cancel" },
                    { text: "Logout", style: "destructive", onPress: handleLogout },
                  ],
                );
              }}
              activeOpacity={0.7}
            >
              <Ionicons
                name="log-out-outline"
                size={20}
                color={colors.danger}
              />
              <Text style={[s.settingsLabel, { color: colors.danger }]}>
                Logout
              </Text>
            </TouchableOpacity>
          </SafeAreaView>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const s = StyleSheet.create({
  menuBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  profileBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  profileBtnImg: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  menuTitle: {
    fontSize: 19,
    fontWeight: "900",
    marginLeft: 8,
    letterSpacing: 0.5,
    flex: 1,
  },
  settingsBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  menuSheet: {
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderTopWidth: 1,
    padding: 22,
    paddingBottom: 36,
  },
  menuHandle: {
    width: 38,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  menuHdr: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  menuItemIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  menuItemTxt: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
  },

  profileAvatarWrap: {
    alignItems: "center",
    marginBottom: 12,
  },
  profileAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  profileAvatarImg: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  profileAvatarBadge: {
    position: "absolute",
    bottom: 0,
    right: -2,
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  profileName: {
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 2,
  },
  profileJoin: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 20,
  },
  profileStatsRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 16,
  },
  profileStat: {
    flex: 1,
    alignItems: "center",
  },
  profileStatNum: {
    fontSize: 18,
    fontWeight: "800",
  },
  profileStatLabel: {
    fontSize: 11,
    fontWeight: "600",
    marginTop: 2,
  },
  profileStatDiv: {
    width: 1,
    height: 32,
  },

  settingsSheet: {
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderTopWidth: 1,
    padding: 22,
    paddingBottom: 36,
  },
  settingsHandle: {
    width: 38,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 18,
  },
  settingsTitle: {
    fontSize: 19,
    fontWeight: "800",
    marginBottom: 18,
  },
  settingsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 12,
  },
  settingsLabel: {
    fontSize: 15,
    fontWeight: "600",
  },
  settingsDivider: {
    height: 1,
    marginVertical: 4,
  },
  settingsAboutRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  settingsAbout: {
    fontSize: 14,
    fontWeight: "700",
  },
  settingsVersion: {
    fontSize: 12,
    marginTop: 2,
  },
  settingsDesc: {
    fontSize: 11,
    lineHeight: 16,
    marginTop: 6,
  },
});

export default function App() {
  return (
    <ThemeProvider>
      <TaskProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Splash"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
            <Stack.Screen name="Tabs" component={Tabs} />
            <Stack.Screen name="AddTask" component={AddTaskScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </TaskProvider>
    </ThemeProvider>
  );
}
