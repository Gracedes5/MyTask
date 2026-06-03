// screens/TodayScreen.tsx
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import type { RootStackParamList } from "../App";
import { Task, useTasks } from "../context/TaskContext";

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

function WelcomePopup({ onDone, onClose, first }: { onDone: () => void; onClose: () => void; first: boolean }) {
  return (
    <View style={wp.overlay}>
      <View style={wp.card}>
        <TouchableOpacity style={wp.closeBtn} onPress={onClose} activeOpacity={0.7}>
          <Ionicons name="close" size={20} color="#6B5A8A" />
        </TouchableOpacity>
        <View style={wp.iconWrap}>
          <View style={wp.calendarBody}>
            <View style={wp.calendarTop}>
              <View style={wp.calendarDot} />
              <View style={wp.calendarDot} />
              <View style={wp.calendarDot} />
            </View>
            <Text style={wp.calendarDate}>17</Text>
          </View>
          <View style={wp.badge}>
            <Ionicons name="checkmark" size={18} color="#fff" />
          </View>
        </View>

        <Text style={wp.title}>Plan MyTask</Text>
        <Text style={wp.sub}>
          Organize your day, track tasks,{'\n'}and stay on top of what matters.
        </Text>

        <TouchableOpacity style={wp.btn} onPress={onDone} activeOpacity={0.85}>
          <Text style={wp.btnTxt}>{first ? "Get Started" : "Continue Tasks Plan"}</Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function TodayScreen() {
  const { tasks, toggleDone, deleteTask } = useTasks();
  const navigation = useNavigation<Nav>();

  const [actionTask, setActionTask] = useState<Task | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [firstLaunch, setFirstLaunch] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(WELCOME_KEY).then((val) => {
      if (val === "true") setFirstLaunch(false);
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      setShowWelcome(true);
    }, []),
  );

  const todayName = DAYS[new Date().getDay()];
  const todayTasks = tasks.filter((t) => t.day === todayName);
  const doneCount = todayTasks.filter((t) => t.done).length;

  return (
    <SafeAreaView style={s.safe}>
      {/* ── Background watermark ── */}
      <View style={s.bgIcon} pointerEvents="none">
        <View style={s.bgCalendarBody}>
          <View style={s.bgCalendarTop}>
            <View style={s.bgDot} />
            <View style={s.bgDot} />
            <View style={s.bgDot} />
          </View>
          <Text style={s.bgDate}>My</Text>
          <Text style={s.bgDateSub}>Task</Text>
        </View>
        <View style={s.bgBadge}>
          <Ionicons name="checkmark" size={24} color="#fff" />
        </View>
      </View>

      {/* ── Header ── */}
      <View style={s.header}>
        <Text style={s.title}>Today</Text>
        <Text style={s.subtitle}>{todayName}</Text>
      </View>

      {/* ── Summary bar ── */}
      <View style={s.summary}>
        <Text style={s.summaryTxt}>
          {todayTasks.length} task{todayTasks.length !== 1 ? "s" : ""}
          {doneCount > 0 ? ` · ${doneCount} done` : ""}
        </Text>
      </View>

      {/* ── Task list ── */}
      {todayTasks.length === 0 ? (
        <View style={s.empty}>
          <Ionicons name="calendar-outline" size={60} color="#2D1B4E" />
          <Text style={s.emptyTitle}>Don't You have a Task?</Text>
          <Text style={s.emptySub}>Tap + to add one</Text>
        </View>
      ) : (
        <FlatList
          data={todayTasks}
          keyExtractor={(item) => item.id}
          contentContainerStyle={s.list}
          showsVerticalScrollIndicator={true}
          renderItem={({ item }) => (
            <View style={[s.card, item.done && s.cardDone]}>
              <View style={[s.accent, item.done && s.accentDone]} />

              <TouchableOpacity
                style={s.checkbox}
                onPress={() => setActionTask(item)}
                activeOpacity={0.7}
              >
                {item.done ? (
                  <Ionicons name="checkmark-circle" size={22} color="#C084FC" />
                ) : (
                  <Ionicons name="ellipse-outline" size={22} color="#4A3560" />
                )}
              </TouchableOpacity>

              <View style={s.cardBody}>
                <Text style={[s.cardTitle, item.done && s.cardTitleDone]}>
                  {item.title}
                </Text>
                {item.description ? (
                  <Text style={s.cardDesc}>{item.description}</Text>
                ) : null}
                {item.time ? (
                  <Text style={s.cardTime}>⏰ {item.time}</Text>
                ) : null}
              </View>
            </View>
          )}
        />
      )}

      {/* ── Floating add button ── */}
      <TouchableOpacity
        style={s.fab}
        onPress={() => navigation.navigate("AddTask")}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={26} color="#fff" />
      </TouchableOpacity>

      {/* ── Welcome popup ── */}
      {showWelcome && (
        <WelcomePopup
          first={firstLaunch}
          onClose={() => setShowWelcome(false)}
          onDone={() => {
            setShowWelcome(false);
            if (firstLaunch) AsyncStorage.setItem(WELCOME_KEY, "true");
          }}
        />
      )}

      {/* ── Delete / Done prompt ── */}
      <Modal
        visible={actionTask !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setActionTask(null)}
      >
        <TouchableOpacity
          style={s.overlay}
          activeOpacity={1}
          onPress={() => setActionTask(null)}
        >
          <SafeAreaView style={s.actionSheet}>
            <View style={s.actionHandle} />
            <Text style={s.actionTitle}>{actionTask?.title}</Text>
            <Text style={s.actionSub}>Mark as done or delete this task</Text>

            <View style={s.actionRow}>
              <TouchableOpacity
                style={[s.actionBtn, s.actionDelete]}
                onPress={() => {
                  if (actionTask) deleteTask(actionTask.id);
                  setActionTask(null);
                }}
                activeOpacity={0.8}
              >
                <Ionicons name="trash-outline" size={18} color="#F87171" />
                <Text style={s.actionDeleteTxt}>Delete</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[s.actionBtn, s.actionDone]}
                onPress={() => {
                  if (actionTask) toggleDone(actionTask.id);
                  setActionTask(null);
                }}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="checkmark-circle-outline"
                  size={18}
                  color="#fff"
                />
                <Text style={s.actionDoneTxt}>Done</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0D0118" },
  bgIcon: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.025,
  },
  bgCalendarBody: {
    width: 160,
    height: 180,
    backgroundColor: "#7C3AED",
    borderRadius: 32,
    overflow: "hidden",
  },
  bgCalendarTop: {
    backgroundColor: "#5B2D8A",
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
  },
  bgDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "rgba(255,255,255,0.4)",
  },
  bgDate: {
    fontSize: 36,
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
    marginTop: 28,
    letterSpacing: 1,
  },
  bgBadge: {
    position: "absolute",
    bottom: 4,
    right: 4,
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#C084FC",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: "#0D0118",
  },
  bgDateSub: {
    fontSize: 36,
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
    letterSpacing: 3,
    marginTop: -2,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#EDE9FE",
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 13,
    color: "#9D6FCA",
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
    backgroundColor: "#7C3AED",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#7C3AED",
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
    color: "#6B5A8A",
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
    color: "#3B1F60",
    marginTop: 16,
  },
  emptySub: { fontSize: 13, color: "#2D1B4E", marginTop: 6 },
  list: { paddingHorizontal: 18, paddingBottom: 100 },
  card: {
    backgroundColor: "#160828",
    borderRadius: 14,
    padding: 13,
    marginBottom: 9,
    flexDirection: "row",
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: "#2D1B4E",
    overflow: "hidden",
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardDone: { opacity: 0.5 },
  accent: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: "#7C3AED",
    borderRadius: 3,
  },
  accentDone: { backgroundColor: "#3B1F60" },
  checkbox: { marginLeft: 8, marginRight: 10, marginTop: 1 },
  cardBody: { flex: 1 },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#EDE9FE",
    lineHeight: 21,
  },
  cardTitleDone: { textDecorationLine: "line-through", color: "#4A3560" },
  cardDesc: { fontSize: 12, color: "#6B5A8A", marginTop: 3 },
  cardTime: { fontSize: 11, color: "#9D6FCA", marginTop: 5 },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  actionSheet: {
    backgroundColor: "#160828",
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderTopWidth: 1,
    borderColor: "#2D1B4E",
    padding: 22,
    paddingBottom: 36,
  },
  actionHandle: {
    width: 38,
    height: 4,
    backgroundColor: "#3B1F60",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 18,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#EDE9FE",
    marginBottom: 4,
  },
  actionSub: {
    fontSize: 12,
    color: "#6B5A8A",
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
  actionDelete: {
    backgroundColor: "#1E0A35",
    borderColor: "#3B1F60",
  },
  actionDeleteTxt: {
    fontSize: 14,
    fontWeight: "700",
    color: "#F87171",
  },
  actionDone: {
    backgroundColor: "#7C3AED",
    borderColor: "#9D4FEF",
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  actionDoneTxt: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
  },
});

const wp = StyleSheet.create({
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
    position: "relative",
  },
  closeBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#1E0A35",
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
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#EDE9FE",
    letterSpacing: -0.3,
  },
  sub: {
    fontSize: 13,
    color: "#9D6FCA",
    textAlign: "center",
    lineHeight: 20,
    marginTop: 8,
    marginBottom: 22,
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#7C3AED",
    paddingHorizontal: 28,
    paddingVertical: 13,
    borderRadius: 14,
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 6,
  },
  btnTxt: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
  },
});
