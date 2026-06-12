// screens/TodayScreen.tsx
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { C } from "../../constants/theme";
import type { RootStackParamList } from "../App";
import { useTasks } from "../context/TaskContext";
import { useTheme } from "../context/ThemeContext";

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

type Nav = NativeStackNavigationProp<RootStackParamList, "Tabs">;

const WELCOME_KEY = "has_seen_welcome";
const CONTINUE_KEY = "has_seen_continue";

function WelcomePopup({
  onDone,
  onClose,
  first,
}: {
  onDone: () => void;
  onClose: () => void;
  first: boolean;
}) {
  const { colors, isDark } = useTheme();
  return (
    <View style={wp.overlay}>
      <View style={[wp.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <TouchableOpacity
          style={[wp.closeBtn, { backgroundColor: colors.highlight }]}
          onPress={onClose}
          activeOpacity={0.7}
        >
          <Ionicons name="close" size={20} color={colors.muted} />
        </TouchableOpacity>
        <View style={wp.iconWrap}>
          <View style={[wp.calendarBody, { backgroundColor: colors.primary }]}>
            <View style={[wp.calendarTop, { backgroundColor: colors.primary }]}>
              <View style={wp.calendarDot} />
              <View style={wp.calendarDot} />
              <View style={wp.calendarDot} />
            </View>
            <Text style={[wp.calendarDate, { color: C.white }]}>17</Text>
          </View>
          <View style={[wp.badge, { backgroundColor: colors.primary, borderColor: C.white }]}>
            <Ionicons name="checkmark" size={18} color={C.white} />
          </View>
        </View>

        <Text style={[wp.title, { color: colors.text }]}>Plan MyTask</Text>
        <Text style={[wp.sub, { color: colors.muted }]}>
          Organize your day, track tasks,{"\n"}and stay on top of what matters.
        </Text>

        <TouchableOpacity style={[wp.btn, { backgroundColor: colors.primary }]} onPress={onDone} activeOpacity={0.85}>
          <Text style={[wp.btnTxt, { color: C.white }]}>
            {first ? "Get Started" : "Continue Tasks Plan"}
          </Text>
          <Ionicons name="arrow-forward" size={18} color={C.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function TodayScreen() {
  const { tasks, toggleDone, deleteTask } = useTasks();
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<Nav>();

  const [actionTaskId, setActionTaskId] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [firstLaunch, setFirstLaunch] = useState(true);
  const actionTask = actionTaskId
    ? (tasks.find((t) => t.id === actionTaskId) ?? null)
    : null;

  useEffect(() => {
    AsyncStorage.getItem(WELCOME_KEY).then((val) => {
      if (val === "true") {
        setFirstLaunch(false);
        AsyncStorage.getItem(CONTINUE_KEY).then((c) => {
          if (c !== "true") setShowWelcome(true);
        });
      } else {
        setShowWelcome(true);
      }
    });
  }, []);

  const todayName = DAYS[new Date().getDay()];
  const todayTasks = tasks.filter((t) => t.day === todayName);
  const doneCount = todayTasks.filter((t) => t.done).length;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning";
    if (h < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: colors.bg }]}>
      {/* ── Header ── */}
      <View style={s.header}>
        <Text style={[s.greeting, { color: colors.text }]}>
          {greeting()} <Text style={s.wave}>👋</Text>
        </Text>
        <Text style={[s.title, { color: colors.text }]}>Today</Text>
        <Text style={[s.subtitle, { color: colors.muted }]}>{todayName}</Text>
      </View>

      {/* ── Summary bar ── */}
      <View style={s.summary}>
        <Text style={[s.summaryTxt, { color: colors.muted }]}>
          {todayTasks.length} task{todayTasks.length !== 1 ? "s" : ""}
          {doneCount > 0 ? ` · ${doneCount} done` : ""}
        </Text>
      </View>

      {/* ── Task list ── */}
      {todayTasks.length === 0 ? (
        <View style={s.empty}>
          <Ionicons name="calendar-outline" size={60} color={colors.mutedLight} />
          <Text style={[s.emptyTitle, { color: colors.text }]}>Don't You have a Task?</Text>
          <Text style={[s.emptySub, { color: colors.muted }]}>Tap + to add one</Text>
        </View>
      ) : (
        <FlatList
          data={todayTasks}
          keyExtractor={(item) => item.id}
          contentContainerStyle={s.list}
          showsVerticalScrollIndicator={true}
          renderItem={({ item }) => (
            <View style={[
              s.card,
              { backgroundColor: isDark ? colors.card : "#F3EFFF", borderColor: isDark ? colors.border : "#D8CCF0" },
              item.done && (isDark ? s.cardDoneDark : s.cardDone),
            ]}>
              <View style={[s.accent, { backgroundColor: colors.primary }, item.done && { backgroundColor: colors.success }]} />

              <TouchableOpacity
                style={s.checkbox}
                onPress={() => setActionTaskId(item.id)}
                activeOpacity={0.7}
              >
                {item.done ? (
                  <Ionicons
                    name="checkmark-circle"
                    size={22}
                    color={colors.success}
                  />
                ) : (
                  <Ionicons name="ellipse-outline" size={22} color={colors.muted} />
                )}
              </TouchableOpacity>

              <View style={s.cardBody}>
                <Text style={[s.cardTitle, { color: colors.text }, item.done && s.cardTitleDone]}>
                  {item.title}
                </Text>
                {item.description ? (
                  <Text style={[s.cardDesc, { color: colors.muted }]}>{item.description}</Text>
                ) : null}
                {item.time ? (
                  <Text style={[s.cardTime, { color: colors.muted }]}>⏰ {item.time}</Text>
                ) : null}
              </View>
            </View>
          )}
        />
      )}

      {/* ── Floating add button ── */}
      <TouchableOpacity
        style={[s.fab, { backgroundColor: colors.primary, shadowColor: colors.primary }]}
        onPress={() => navigation.navigate("AddTask")}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={26} color={C.white} />
      </TouchableOpacity>

      {/* ── Welcome popup ── */}
      {showWelcome && (
        <WelcomePopup
          first={firstLaunch}
          onClose={() => setShowWelcome(false)}
          onDone={() => {
            setShowWelcome(false);
            if (firstLaunch) {
              AsyncStorage.setItem(WELCOME_KEY, "true");
            } else {
              AsyncStorage.setItem(CONTINUE_KEY, "true");
            }
          }}
        />
      )}

      {/* ── Delete / Done prompt ── */}
      <Modal
        visible={actionTask !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setActionTaskId(null)}
      >
        <TouchableOpacity
          style={s.overlay}
          activeOpacity={1}
          onPress={() => setActionTaskId(null)}
        >
          <SafeAreaView style={[s.actionSheet, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[s.actionHandle, { backgroundColor: colors.mutedLight }]} />
            <Text style={[s.actionTitle, { color: colors.text }]}>{actionTask?.title}</Text>
            <Text style={[s.actionSub, { color: colors.muted }]}>
              {actionTask?.done
                ? "Undo done or delete this task"
                : "Mark as done or delete this task"}
            </Text>

            <View style={s.actionRow}>
              <TouchableOpacity
                style={[s.actionBtn, s.actionDelete, { backgroundColor: colors.highlight, borderColor: colors.mutedLight }]}
                onPress={() => {
                  if (actionTask) deleteTask(actionTask.id);
                  setActionTaskId(null);
                }}
                activeOpacity={0.8}
              >
                <Ionicons name="trash-outline" size={18} color={colors.danger} />
                <Text style={[s.actionDeleteTxt, { color: colors.danger }]}>Delete</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  s.actionBtn,
                  actionTask?.done ? s.actionUndo : s.actionDone,
                  { backgroundColor: colors.primary, borderColor: colors.primary },
                ]}
                onPress={() => {
                  if (actionTask) toggleDone(actionTask.id);
                  setActionTaskId(null);
                }}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={
                    actionTask?.done
                      ? "arrow-undo-circle-outline"
                      : "checkmark-circle-outline"
                  }
                  size={18}
                  color={C.white}
                />
                <Text style={s.actionDoneTxt}>
                  {actionTask?.done ? "Undo DONE" : "Done"}
                </Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 4,
  },
  greeting: {
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.4,
    marginBottom: 2,
  },
  wave: {
    fontSize: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
    fontWeight: "600",
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 20,
    width: 54,
    height: 54,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 10,
  },
  summary: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    paddingTop: 8,
  },
  summaryTxt: {
    fontSize: 12,
    fontWeight: "700",
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 80,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginTop: 16,
  },
  emptySub: { fontSize: 13, marginTop: 6 },
  list: { paddingHorizontal: 18, paddingBottom: 100 },
  card: {
    borderRadius: 14,
    padding: 13,
    marginBottom: 9,
    flexDirection: "row",
    alignItems: "flex-start",
    borderWidth: 1,
    overflow: "hidden",
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardDone: {
    backgroundColor: "#EEF8F0",
    borderColor: "#C8E6C9",
  },
  cardDoneDark: {
    backgroundColor: "#1A3020",
    borderColor: "#2D6A4F",
  },
  accent: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    borderRadius: 3,
  },
  checkbox: { marginLeft: 8, marginRight: 10, marginTop: 1 },
  cardBody: { flex: 1 },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 21,
  },
  cardTitleDone: { textDecorationLine: "line-through", color: "#6B9B78" },
  cardDesc: { fontSize: 12, marginTop: 3 },
  cardTime: { fontSize: 11, marginTop: 5 },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  actionSheet: {
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderTopWidth: 1,
    padding: 22,
    paddingBottom: 36,
  },
  actionHandle: {
    width: 38,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 18,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  actionSub: {
    fontSize: 12,
    marginBottom: 20,
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  actionDelete: {},
  actionDeleteTxt: {
    fontSize: 14,
    fontWeight: "700",
  },
  actionUndo: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  actionDone: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  actionDoneTxt: {
    fontSize: 14,
    fontWeight: "700",
    color: C.white,
  },

});

const wp = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  card: {
    borderRadius: 28,
    borderWidth: 1,
    padding: 32,
    marginHorizontal: 30,
    alignItems: "center",
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 16,
    position: "relative",
  },
  closeBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
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
    borderRadius: 18,
    overflow: "hidden",
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  calendarTop: {
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
    backgroundColor: "rgba(123,77,255,0.12)",
  },
  calendarDate: {
    fontSize: 36,
    fontWeight: "800",
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
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  sub: {
    fontSize: 13,
    textAlign: "center",
    lineHeight: 20,
    marginTop: 8,
    marginBottom: 22,
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 28,
    paddingVertical: 13,
    borderRadius: 14,
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 6,
  },
  btnTxt: {
    fontSize: 15,
    fontWeight: "700",
  },
});
