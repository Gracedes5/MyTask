import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer, NavigatorScreenParams, useNavigation, useRoute } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
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

export type TabParamList = {
  Today: undefined;
  Upcoming: undefined;
  Search: undefined;
};

export type RootStackParamList = {
  Tabs: NavigatorScreenParams<TabParamList>;
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
  const route = useRoute();
  const initialTab = ((route.params as any)?.screen as string) || undefined;

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
        initialRouteName={initialTab}
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
  return (
    <TaskProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Tabs" component={Tabs} />
          <Stack.Screen name="AddTask" component={AddTaskScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </TaskProvider>
  );
}
