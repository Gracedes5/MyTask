import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
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

import { TaskProvider } from "./context/TaskContext";

import AddTaskScreen from "./screens/AddTaskScreen";
import SearchScreen from "./screens/SearchScreen";
import TodayScreen from "./screens/TodayScreen";
import UpcomingScreen from "./screens/UpcomingScreen";

export type RootStackParamList = {
  Tabs: undefined;
  AddTask: undefined;
};

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MENU_ITEMS = [
  { name: "Today", icon: "calendar-outline" },
  { name: "Upcoming", icon: "grid-outline" },
  { name: "Search", icon: "search-outline" },
] as const;

function Tabs() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigation = useNavigation<any>();

  return (
    <>
      {/* ── Menu bar ── */}
      <View style={s.menuBar}>
        <TouchableOpacity
          onPress={() => setMenuOpen(true)}
          style={s.menuBtn}
          activeOpacity={0.7}
        >
          <Ionicons name="menu" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={s.menuTitle}>MyTask</Text>
      </View>

      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: "#7C3AED",
          tabBarInactiveTintColor: "#4A3560",
          tabBarStyle: { backgroundColor: "#0D0118", borderTopColor: "#1E0A35" },
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
          <SafeAreaView style={s.menuSheet}>
            <View style={s.menuHandle} />
            <Text style={s.menuHdr}>Navigation</Text>

            {MENU_ITEMS.map((item) => (
              <TouchableOpacity
                key={item.name}
                style={s.menuItem}
                onPress={() => {
                  setMenuOpen(false);
                  navigation.navigate("Tabs", { screen: item.name });
                }}
                activeOpacity={0.7}
              >
                <View style={s.menuItemIcon}>
                  <Ionicons
                    name={item.icon as any}
                    size={18}
                    color="#C084FC"
                  />
                </View>
                <Text style={s.menuItemTxt}>{item.name}</Text>
                <Ionicons name="chevron-forward" size={14} color="#3B1F60" />
              </TouchableOpacity>
            ))}
          </SafeAreaView>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const LAUNCH_KEY = "has_launched";

function LaunchPopup({ onDone }: { onDone: () => void }) {
  return (
    <View style={lp.overlay}>
      <View style={lp.card}>
        {/* ── Calendar icon built from views ── */}
        <View style={lp.iconWrap}>
          <View style={lp.calendarBody}>
            <View style={lp.calendarTop}>
              <View style={lp.calendarDot} />
              <View style={lp.calendarDot} />
              <View style={lp.calendarDot} />
            </View>
            <Text style={lp.calendarDate}>17</Text>
          </View>
          <View style={lp.badge}>
            <Ionicons name="checkmark" size={18} color="#fff" />
          </View>
        </View>

        <Text style={lp.title}>Plan MyTask</Text>
        <Text style={lp.sub}>
          Organize your day, track tasks,{'\n'}and stay on top of what matters.
        </Text>

        <TouchableOpacity style={lp.btn} onPress={onDone} activeOpacity={0.85}>
          <Text style={lp.btnTxt}>Get Started</Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const lp = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  card: {
    backgroundColor: "#160828",
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#2D1B4E",
    padding: 32,
    marginHorizontal: 30,
    alignItems: "center",
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 16,
  },
  iconWrap: {
    width: 100,
    height: 110,
    marginBottom: 20,
    position: "relative",
    alignItems: "center",
  },
  calendarBody: {
    width: 90,
    height: 100,
    backgroundColor: "#9D6FCA",
    borderRadius: 18,
    overflow: "hidden",
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  calendarTop: {
    backgroundColor: "#7C3AED",
    paddingVertical: 6,
    paddingHorizontal: 10,
    flexDirection: "row",
    gap: 5,
    justifyContent: "center",
  },
  calendarDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.4)",
  },
  calendarDate: {
    fontSize: 36,
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
    marginTop: 10,
  },
  badge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#C084FC",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#160828",
    shadowColor: "#C084FC",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#EDE9FE",
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  sub: {
    fontSize: 13,
    color: "#9D6FCA",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#7C3AED",
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 14,
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  btnTxt: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
  },
});

const s = StyleSheet.create({
  menuBar: {
    backgroundColor: "#9D6FCA",
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
    fontSize: 17,
    fontWeight: "800",
    color: "#fff",
    marginLeft: 8,
    letterSpacing: -0.3,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  menuSheet: {
    backgroundColor: "#160828",
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderTopWidth: 1,
    borderColor: "#2D1B4E",
    padding: 22,
    paddingBottom: 36,
  },
  menuHandle: {
    width: 38,
    height: 4,
    backgroundColor: "#3B1F60",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  menuHdr: {
    fontSize: 18,
    fontWeight: "800",
    color: "#EDE9FE",
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#1E0A35",
  },
  menuItemIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#2D1B4E",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  menuItemTxt: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: "#EDE9FE",
  },
});

export default function App() {
  const [showLaunch, setShowLaunch] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(LAUNCH_KEY).then((val) => {
      if (val !== "true") {
        setShowLaunch(true);
        AsyncStorage.setItem(LAUNCH_KEY, "true");
      }
    });
  }, []);

  return (
    <TaskProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Tabs" component={Tabs} />
          <Stack.Screen name="AddTask" component={AddTaskScreen} />
        </Stack.Navigator>
      </NavigationContainer>
      {showLaunch && <LaunchPopup onDone={() => setShowLaunch(false)} />}
    </TaskProvider>
  );
}
