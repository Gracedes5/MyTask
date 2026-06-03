// screens/UpcomingScreen.tsx
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
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
const TIMES = [
  "06:00 AM",
  "07:00 AM",
  "08:00 AM",
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
  "07:00 PM",
  "08:00 PM",
  "09:00 PM",
  "10:00 PM",
];

function dayLabel(day: string): string {
  const today = DAYS[new Date().getDay()];
  const tomorrow = DAYS[(new Date().getDay() + 1) % 7];
  if (day === today) return `${day}  ·  Today`;
  if (day === tomorrow) return `${day}  ·  Tomorrow`;
  return day;
}

type Section = { day: string; data: Task[] };

export default function UpcomingScreen() {
  const { tasks, toggleDone, editTask, deleteTask } = useTasks();

  // useState for modal form (State management requirement)
  const [modalVisible, setModal] = useState(false);
  const [selected, setSelected] = useState<Task | null>(null);
  const [actionTask, setActionTask] = useState<Task | null>(null);
  const [eTitle, setETitle] = useState("");
  const [eDesc, setEDesc] = useState("");
  const [eDay, setEDay] = useState("");
  const [eTime, setETime] = useState("");
  const [showTimes, setShowTimes] = useState(false);

  // Build ordered sections — only days that have tasks
  const sections: Section[] = DAYS.reduce<Section[]>((acc, day) => {
    const dayTasks = tasks.filter((t) => t.day === day);
    if (dayTasks.length) acc.push({ day, data: dayTasks });
    return acc;
  }, []);

  const doneCount = tasks.filter((t) => t.done).length;

  const openEdit = (task: Task) => {
    setSelected(task);
    setETitle(task.title);
    setEDesc(task.description);
    setEDay(task.day);
    setETime(task.time);
    setShowTimes(false);
    setModal(true);
  };

  const saveEdit = () => {
    if (!eTitle.trim() || !selected) return;
    editTask(selected.id, {
      title: eTitle.trim(),
      description: eDesc.trim(),
      day: eDay,
      time: eTime,
    });
    setModal(false);
  };

  return (
    <SafeAreaView style={s.safe}>
      {/* ── Header ── */}
      <View style={s.header}>
        <Text style={s.title}>Upcoming</Text>
      </View>

      {/* ── FlatList with sections (Dynamic data display requirement) ── */}
      {sections.length === 0 ? (
        <View style={s.empty}>
          <Ionicons name="calendar-outline" size={60} color="#2D1B4E" />
          <Text style={s.emptyTitle}>No upcoming tasks</Text>
          <Text style={s.emptySub}>Add tasks from the Today tab</Text>
        </View>
      ) : (
        <FlatList
          data={sections}
          keyExtractor={(item) => item.day}
          contentContainerStyle={s.list}
          showsVerticalScrollIndicator={true}
          renderItem={({ item }) => (
            <View style={s.section}>
              {/* Day divider */}
              <View style={s.dayRow}>
                <View style={s.dayLine} />
                <Text style={s.dayName}>{dayLabel(item.day)}</Text>
                <View style={s.dayLine} />
              </View>

              {/* Tasks for this day */}
              {item.data.map((task) => (
                <View key={task.id} style={[s.card, task.done && s.cardDone]}>
                  <View style={[s.accent, task.done && s.accentDone]} />

                  {/* Touchable checkbox (Interactive element requirement) */}
                  <TouchableOpacity
                    style={s.checkbox}
                    onPress={() => setActionTask(task)}
                    activeOpacity={0.7}
                  >
                    {task.done ? (
                      <Ionicons
                        name="checkmark-circle"
                        size={22}
                        color="#C084FC"
                      />
                    ) : (
                      <Ionicons
                        name="ellipse-outline"
                        size={22}
                        color="#4A3560"
                      />
                    )}
                  </TouchableOpacity>

                  <View style={s.cardBody}>
                    <Text style={[s.cardTitle, task.done && s.cardTitleDone]}>
                      {task.title}
                    </Text>
                    {task.description ? (
                      <Text style={s.cardDesc}>{task.description}</Text>
                    ) : null}
                    {task.time ? (
                      <Text style={s.cardTime}>⏰ {task.time}</Text>
                    ) : null}
                  </View>

                  {/* Edit / Delete buttons (Interactive elements) */}
                  <View style={s.actions}>
                    <TouchableOpacity
                      style={s.actBtn}
                      onPress={() => openEdit(task)}
                    >
                      <Ionicons
                        name="pencil-outline"
                        size={15}
                        color="#9D6FCA"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={s.actBtn}
                      onPress={() => deleteTask(task.id)}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={15}
                        color="#F87171"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        />
      )}

      {/* ── Done count badge ── */}
      {doneCount > 0 && (
        <View style={s.badgeWrap}>
          <View style={s.badge}>
            <Ionicons name="checkmark-done-circle" size={16} color="#C084FC" />
            <Text style={s.badgeTxt}>
              {doneCount} task{doneCount > 1 ? "s" : ""} completed
            </Text>
          </View>
        </View>
      )}

      {/* ── Edit Modal ── */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModal(false)}
      >
        <KeyboardAvoidingView
          style={s.overlay}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={s.sheet}>
            <View style={s.handle} />
            <Text style={s.sheetTitle}>Edit Task</Text>

            {/* Text inputs (Interactive element requirement) */}
            <Text style={s.lbl}>TITLE</Text>
            <TextInput
              style={s.mInput}
              value={eTitle}
              onChangeText={setETitle}
              placeholder="Task title"
              placeholderTextColor="#4A3560"
              selectionColor="#C084FC"
            />

            <Text style={s.lbl}>DESCRIPTION</Text>
            <TextInput
              style={[s.mInput, s.mInputTall]}
              value={eDesc}
              onChangeText={setEDesc}
              placeholder="Optional note"
              placeholderTextColor="#4A3560"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              selectionColor="#C084FC"
            />

            <Text style={s.lbl}>DAY</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginBottom: 14 }}
              contentContainerStyle={{ gap: 7, paddingVertical: 2 }}
            >
              {DAYS.map((d) => (
                <TouchableOpacity
                  key={d}
                  style={[s.dc, eDay === d && s.dcOn]}
                  onPress={() => setEDay(d)}
                >
                  <Text style={[s.dcTxt, eDay === d && s.dcTxtOn]}>
                    {d.slice(0, 3)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={s.lbl}>TIME</Text>
            <TouchableOpacity
              style={s.timeRow}
              onPress={() => setShowTimes(!showTimes)}
            >
              <Ionicons
                name="time-outline"
                size={16}
                color={eTime ? "#C084FC" : "#6B5A8A"}
              />
              <Text style={[s.timeTxt, !eTime && s.timePh]}>
                {eTime || "Pick a time"}
              </Text>
              <Ionicons
                name={showTimes ? "chevron-up" : "chevron-down"}
                size={14}
                color="#6B5A8A"
              />
            </TouchableOpacity>
            {showTimes && (
              <View style={s.timeGrid}>
                {TIMES.map((t) => (
                  <TouchableOpacity
                    key={t}
                    style={[s.ts, eTime === t && s.tsOn]}
                    onPress={() => {
                      setETime(t);
                      setShowTimes(false);
                    }}
                  >
                    <Text style={[s.tsTxt, eTime === t && s.tsTxtOn]}>{t}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Modal action buttons */}
            <View style={s.mActions}>
              <TouchableOpacity
                style={s.cancelBtn}
                onPress={() => setModal(false)}
              >
                <Text style={s.cancelTxt}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.saveBtn} onPress={saveEdit}>
                <Text style={s.saveTxt}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ── Delete / Done prompt ── */}
      <Modal
        visible={actionTask !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setActionTask(null)}
      >
        <TouchableOpacity
          style={s.promptOverlay}
          activeOpacity={1}
          onPress={() => setActionTask(null)}
        >
          <SafeAreaView style={s.promptSheet}>
            <View style={s.promptHandle} />
            <Text style={s.promptTitle}>{actionTask?.title}</Text>
            <Text style={s.promptSub}>Mark as done or delete this task</Text>

            <View style={s.promptRow}>
              <TouchableOpacity
                style={[s.promptBtn, s.promptDelete]}
                onPress={() => {
                  if (actionTask) deleteTask(actionTask.id);
                  setActionTask(null);
                }}
                activeOpacity={0.8}
              >
                <Ionicons name="trash-outline" size={18} color="#F87171" />
                <Text style={s.promptDeleteTxt}>Delete</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[s.promptBtn, s.promptDone]}
                onPress={() => {
                  if (actionTask) toggleDone(actionTask.id);
                  setActionTask(null);
                }}
                activeOpacity={0.8}
              >
                <Ionicons name="checkmark-circle-outline" size={18} color="#fff" />
                <Text style={s.promptDoneTxt}>Done</Text>
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
  header: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 8 },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#EDE9FE",
    letterSpacing: -0.4,
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

  list: { paddingHorizontal: 18, paddingTop: 6, paddingBottom: 130 },
  section: { marginBottom: 18 },

  dayRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  dayLine: { flex: 1, height: 1, backgroundColor: "#2D1B4E" },
  dayName: {
    fontSize: 10,
    fontWeight: "700",
    color: "#7C3AED",
    paddingHorizontal: 10,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },

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
  actions: { flexDirection: "row", gap: 2, marginLeft: 6 },
  actBtn: { padding: 6, borderRadius: 8 },

  badgeWrap: {
    position: "absolute",
    bottom: 72,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#1E0A35",
    borderRadius: 30,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#3B1F60",
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  badgeTxt: { fontSize: 12, fontWeight: "700", color: "#C084FC" },

  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.72)",
  },
  sheet: {
    backgroundColor: "#160828",
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    padding: 22,
    borderTopWidth: 1,
    borderColor: "#2D1B4E",
  },
  handle: {
    width: 38,
    height: 4,
    backgroundColor: "#3B1F60",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 18,
  },
  sheetTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#EDE9FE",
    marginBottom: 18,
  },

  lbl: {
    fontSize: 10,
    fontWeight: "700",
    color: "#9D6FCA",
    letterSpacing: 0.8,
    marginBottom: 7,
  },
  mInput: {
    backgroundColor: "#0D0118",
    borderWidth: 1,
    borderColor: "#2D1B4E",
    borderRadius: 11,
    paddingHorizontal: 13,
    paddingVertical: 11,
    color: "#EDE9FE",
    fontSize: 14,
    marginBottom: 14,
  },
  mInputTall: { height: 74, textAlignVertical: "top" },

  dc: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#0D0118",
    borderWidth: 1,
    borderColor: "#2D1B4E",
  },
  dcOn: { backgroundColor: "#7C3AED", borderColor: "#9D4FEF" },
  dcTxt: { fontSize: 12, fontWeight: "700", color: "#6B5A8A" },
  dcTxtOn: { color: "#fff" },

  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#0D0118",
    borderRadius: 10,
    padding: 11,
    borderWidth: 1,
    borderColor: "#2D1B4E",
    marginBottom: 4,
  },
  timeTxt: { flex: 1, fontSize: 13, fontWeight: "600", color: "#EDE9FE" },
  timePh: { color: "#4A3560" },
  timeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 10,
    marginBottom: 10,
  },
  ts: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: "#0D0118",
    borderWidth: 1,
    borderColor: "#2D1B4E",
  },
  tsOn: { backgroundColor: "#5B21B6", borderColor: "#7C3AED" },
  tsTxt: { fontSize: 10, fontWeight: "600", color: "#6B5A8A" },
  tsTxtOn: { color: "#fff" },

  mActions: { flexDirection: "row", gap: 10, marginTop: 14 },
  cancelBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: "#1E0A35",
    borderWidth: 1,
    borderColor: "#2D1B4E",
    alignItems: "center",
  },
  cancelTxt: { color: "#9D6FCA", fontSize: 14, fontWeight: "700" },
  saveBtn: {
    flex: 2,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: "#7C3AED",
    alignItems: "center",
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  saveTxt: { color: "#fff", fontSize: 14, fontWeight: "700" },

  promptOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  promptSheet: {
    backgroundColor: "#160828",
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderTopWidth: 1,
    borderColor: "#2D1B4E",
    padding: 22,
    paddingBottom: 36,
  },
  promptHandle: {
    width: 38,
    height: 4,
    backgroundColor: "#3B1F60",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 18,
  },
  promptTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#EDE9FE",
    marginBottom: 4,
  },
  promptSub: {
    fontSize: 12,
    color: "#6B5A8A",
    marginBottom: 20,
  },
  promptRow: {
    flexDirection: "row",
    gap: 10,
  },
  promptBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  promptDelete: {
    backgroundColor: "#1E0A35",
    borderColor: "#3B1F60",
  },
  promptDeleteTxt: {
    fontSize: 14,
    fontWeight: "700",
    color: "#F87171",
  },
  promptDone: {
    backgroundColor: "#7C3AED",
    borderColor: "#9D4FEF",
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  promptDoneTxt: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
  },
});
