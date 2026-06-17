import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  NavigationContainer,
  NavigatorScreenParams,
  useRoute,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
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
import SearchScreen from "./screens/SearchScreen";
import TodayScreen from "./screens/TodayScreen";
import UpcomingScreen from "./screens/UpcomingScreen";

export type TabParamList = {
  Today: undefined;
  Upcoming: undefined;
  Search: undefined;
};

export type RootStackParamList = {
  Tabs: NavigatorScreenParams<TabParamList>;
  AddTask: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function Tabs() {
  const { tasks, deleteTask } = useTasks();
  const { colors, isDark, toggleDarkMode } = useTheme();
  const route = useRoute();
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

  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [notifEnabled, setNotifEnabled] = useState(true);
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [summaryEnabled, setSummaryEnabled] = useState(false);
  const [aboutExpanded, setAboutExpanded] = useState(false);

  return (
    <>
      {/* ── Dark-mode-aware status bar ── */}
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* ── Menu bar ── */}
      <View style={[s.menuBar, { backgroundColor: colors.primary }]}>
        <TouchableOpacity
          onPress={() => setMenuOpen(true)}
          style={s.menuBtn}
          activeOpacity={0.7}
        >
          <Ionicons name="menu" size={22} color={colors.white} />
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

      {/* ── Menu modal ── */}
      <Modal
        visible={menuOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuOpen(false)}
      >
        <TouchableOpacity
          style={s.overlay}
          activeOpacity={1}
          onPress={() => setMenuOpen(false)}
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
            <Text style={[s.menuHdr, { color: colors.text }]}>Menu</Text>

            <TouchableOpacity
              style={[s.menuItem, { borderBottomColor: colors.border }]}
              onPress={() => {
                setMenuOpen(false);
                setSettingsVisible(true);
              }}
              activeOpacity={0.7}
            >
              <View
                style={[s.menuItemIcon, { backgroundColor: colors.highlight }]}
              >
                <Ionicons
                  name="notifications-outline"
                  size={18}
                  color={colors.primary}
                />
              </View>
              <Text style={[s.menuItemTxt, { color: colors.text }]}>
                Notifications
              </Text>
              <Ionicons
                name="chevron-forward"
                size={14}
                color={colors.mutedLight}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[s.menuItem, { borderBottomColor: colors.border }]}
              onPress={() => {
                setMenuOpen(false);
                setSettingsVisible(true);
              }}
              activeOpacity={0.7}
            >
              <View
                style={[s.menuItemIcon, { backgroundColor: colors.highlight }]}
              >
                <Ionicons
                  name="stats-chart-outline"
                  size={18}
                  color={colors.primary}
                />
              </View>
              <Text style={[s.menuItemTxt, { color: colors.text }]}>
                Task Summary
              </Text>
              <Ionicons
                name="chevron-forward"
                size={14}
                color={colors.mutedLight}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[s.menuItem, { borderBottomColor: colors.border }]}
              onPress={() => {
                setMenuOpen(false);
                tasks.filter((t) => t.done).forEach((t) => deleteTask(t.id));
              }}
              activeOpacity={0.7}
            >
              <View
                style={[s.menuItemIcon, { backgroundColor: colors.highlight }]}
              >
                <Ionicons
                  name="trash-outline"
                  size={18}
                  color={colors.danger}
                />
              </View>
              <Text style={[s.menuItemTxt, { color: colors.text }]}>
                Clear Completed Tasks
              </Text>
              <Ionicons
                name="chevron-forward"
                size={14}
                color={colors.mutedLight}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[s.menuItem, { borderBottomColor: colors.border }]}
              onPress={() => {
                setMenuOpen(false);
                setSettingsVisible(true);
              }}
              activeOpacity={0.7}
            >
              <View
                style={[s.menuItemIcon, { backgroundColor: colors.highlight }]}
              >
                <Ionicons
                  name="information-circle-outline"
                  size={18}
                  color={colors.primary}
                />
              </View>
              <Text style={[s.menuItemTxt, { color: colors.text }]}>
                About Taskly
              </Text>
              <Ionicons
                name="chevron-forward"
                size={14}
                color={colors.mutedLight}
              />
            </TouchableOpacity>
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
  menuBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
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
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Tabs" component={Tabs} />
            <Stack.Screen name="AddTask" component={AddTaskScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </TaskProvider>
    </ThemeProvider>
  );
}
