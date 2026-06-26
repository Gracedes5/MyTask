// screens/UpcomingScreen.tsx
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
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
import IconBackground from "../../components/IconBackground";
import NoteModal from "../../components/NoteModal";
import { C } from "../../constants/theme";
import type { TabParamList } from "../App";
import { Task, useTasks } from "../context/TaskContext";
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
  const { tasks, toggleDone, editTask, deleteTask, updateTaskNote } = useTasks();
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<BottomTabNavigationProp<TabParamList>>();
  const todayName = DAYS[new Date().getDay()];

  // useState for modal form (State management requirement)
  const [modalVisible, setModal] = useState(false);
  const [selected, setSelected] = useState<Task | null>(null);
  const [actionTaskId, setActionTaskId] = useState<string | null>(null);
  const [noteTaskId, setNoteTaskId] = useState<string | null>(null);
  const actionTask = actionTaskId
    ? (tasks.find((t) => t.id === actionTaskId) ?? null)
    : null;
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
    <IconBackground>
      <SafeAreaView style={[s.safe, { backgroundColor: "transparent" }]}>
      {/* ── Header ── */}
      <View style={s.header}>
        <Text style={[s.title, { color: colors.text }]}>Upcoming</Text>
      </View>

      {/* ── FlatList with sections (Dynamic data display requirement) ── */}
      {sections.length === 0 ? (
        <View style={s.empty}>
          <Ionicons
            name="calendar-outline"
            size={60}
            color={colors.mutedLight}
          />
          <Text style={[s.emptyTitle, { color: colors.text }]}>
            No upcoming tasks
          </Text>
          <Text style={[s.emptySub, { color: colors.muted }]}>
            Add tasks from the Today tab
          </Text>
        </View>
      ) : (
        <FlatList
          data={sections}
          keyExtractor={(item) => item.day}
          contentContainerStyle={s.list}
          showsVerticalScrollIndicator={true}
          renderItem={({ item }) => {
            const isToday = item.day === todayName;
            return (
              <View style={s.section}>
                {/* Day divider */}
                <View style={s.dayRow}>
                  <View
                    style={[s.dayLine, { backgroundColor: colors.border }]}
                  />
                  <Text style={[s.dayName, { color: colors.primary }]}>
                    {dayLabel(item.day)}
                  </Text>
                  <View
                    style={[s.dayLine, { backgroundColor: colors.border }]}
                  />
                </View>

                {/* Tasks for this day */}
                {item.data.map((task) => (
                  <View
                    key={task.id}
                    style={[
                      s.card,
                      {
                        backgroundColor: isToday
                          ? isDark
                            ? colors.card
                            : "#F3EFFF"
                          : colors.card,
                        borderColor: isToday
                          ? isDark
                            ? colors.border
                            : "#D8CCF0"
                          : colors.border,
                      },
                      task.done &&
                        (isDark ? s.cardDoneDark : s.cardDone),
                    ]}
                  >
                    <View
                      style={[
                        s.accent,
                        { backgroundColor: colors.primary },
                        task.done && { backgroundColor: colors.success },
                      ]}
                    />

                    {/* Touchable checkbox (Interactive element requirement) */}
                    <TouchableOpacity
                      style={s.checkbox}
                      onPress={() => setActionTaskId(task.id)}
                      activeOpacity={0.7}
                    >
                      {task.done ? (
                        <Ionicons
                          name="checkmark-circle"
                          size={22}
                          color={colors.success}
                        />
                      ) : (
                        <Ionicons
                          name="ellipse-outline"
                          size={22}
                          color={colors.muted}
                        />
                      )}
                    </TouchableOpacity>

                    <View style={s.cardBody}>
                      <Text
                        style={[
                          s.cardTitle,
                          { color: colors.text },
                          task.done && s.cardTitleDone,
                        ]}
                      >
                        {task.title}
                      </Text>
                      {task.description ? (
                        <Text style={[s.cardDesc, { color: colors.muted }]}>
                          {task.description}
                        </Text>
                      ) : null}
                      {task.time ? (
                        <Text style={[s.cardTime, { color: colors.muted }]}>
                          ⏰ {task.time}
                        </Text>
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
                          color={colors.muted}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={s.actBtn}
                        onPress={() => deleteTask(task.id)}
                      >
                        <Ionicons
                          name="trash-outline"
                          size={15}
                          color={colors.danger}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={s.actBtn}
                        onPress={() => setNoteTaskId(task.id)}
                      >
                        <Ionicons
                          name={task.note ? "document-text" : "document-text-outline"}
                          size={15}
                          color={task.note ? colors.primary : colors.mutedLight}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            );
          }}
        />
      )}

      {/* ── Done count badge (tappable → Search tab) ── */}
      {doneCount > 0 && (
        <View style={s.badgeWrap}>
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => navigation.navigate("Search")}
          >
            <View
              style={[
                s.badge,
                {
                  backgroundColor: isDark ? "#1A3020" : "#EEF8F0",
                  borderColor: isDark ? "#2D6A4F" : "#C8E6C9",
                },
              ]}
            >
              <Ionicons
                name="checkmark-done-circle"
                size={16}
                color={colors.success}
              />
              <Text
                style={[s.badgeTxt, { color: isDark ? "#4ADE80" : "#2D6A4F" }]}
              >
                {doneCount} task{doneCount > 1 ? "s" : ""} completed
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      )}

      {/* ── Note modal ── */}
      <NoteModal
        visible={noteTaskId !== null}
        initialNote={noteTaskId ? (tasks.find((t) => t.id === noteTaskId)?.note ?? "") : ""}
        taskTitle={noteTaskId ? (tasks.find((t) => t.id === noteTaskId)?.title ?? "") : ""}
        onSave={(n) => {
          if (noteTaskId) updateTaskNote(noteTaskId, n);
          setNoteTaskId(null);
        }}
        onCancel={() => setNoteTaskId(null)}
      />

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
          <View
            style={[
              s.sheet,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View style={[s.handle, { backgroundColor: colors.mutedLight }]} />
            <Text style={[s.sheetTitle, { color: colors.text }]}>
              Edit Task
            </Text>

            {/* Text inputs (Interactive element requirement) */}
            <Text style={[s.lbl, { color: colors.muted }]}>TITLE</Text>
            <TextInput
              style={[
                s.mInput,
                {
                  backgroundColor: colors.bg,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              value={eTitle}
              onChangeText={setETitle}
              placeholder="Task title"
              placeholderTextColor={colors.muted}
              selectionColor={colors.primary}
            />

            <Text style={[s.lbl, { color: colors.muted }]}>DESCRIPTION</Text>
            <TextInput
              style={[
                s.mInput,
                s.mInputTall,
                {
                  backgroundColor: colors.bg,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              value={eDesc}
              onChangeText={setEDesc}
              placeholder="Optional note"
              placeholderTextColor={colors.muted}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              selectionColor={colors.primary}
            />

            <Text style={[s.lbl, { color: colors.muted }]}>DAY</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginBottom: 14 }}
              contentContainerStyle={{ gap: 7, paddingVertical: 2 }}
            >
              {DAYS.map((d) => (
                <TouchableOpacity
                  key={d}
                  style={[
                    s.dc,
                    { backgroundColor: colors.bg, borderColor: colors.border },
                    eDay === d && { backgroundColor: colors.primary },
                  ]}
                  onPress={() => setEDay(d)}
                >
                  <Text
                    style={[
                      s.dcTxt,
                      { color: colors.muted },
                      eDay === d && s.dcTxtOn,
                    ]}
                  >
                    {d.slice(0, 3)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={[s.lbl, { color: colors.muted }]}>TIME</Text>
            <TouchableOpacity
              style={[
                s.timeRow,
                { backgroundColor: colors.bg, borderColor: colors.border },
              ]}
              onPress={() => setShowTimes(!showTimes)}
            >
              <Ionicons
                name="time-outline"
                size={16}
                color={eTime ? colors.primary : colors.muted}
              />
              <Text
                style={[
                  s.timeTxt,
                  { color: colors.text },
                  !eTime && { color: colors.muted },
                ]}
              >
                {eTime || "Pick a time"}
              </Text>
              <Ionicons
                name={showTimes ? "chevron-up" : "chevron-down"}
                size={14}
                color={colors.muted}
              />
            </TouchableOpacity>
            {showTimes && (
              <View style={s.timeGrid}>
                {TIMES.map((t) => (
                  <TouchableOpacity
                    key={t}
                    style={[
                      s.ts,
                      {
                        backgroundColor: colors.bg,
                        borderColor: colors.border,
                      },
                      eTime === t && {
                        backgroundColor: colors.primary,
                        borderColor: colors.primary,
                      },
                    ]}
                    onPress={() => {
                      setETime(t);
                      setShowTimes(false);
                    }}
                  >
                    <Text
                      style={[
                        s.tsTxt,
                        { color: colors.muted },
                        eTime === t && { color: C.white },
                      ]}
                    >
                      {t}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Modal action buttons */}
            <View style={s.mActions}>
              <TouchableOpacity
                style={[
                  s.cancelBtn,
                  {
                    backgroundColor: colors.highlight,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => setModal(false)}
              >
                <Text style={[s.cancelTxt, { color: colors.muted }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.saveBtn, { backgroundColor: colors.primary }]}
                onPress={saveEdit}
              >
                <Text style={[s.saveTxt, { color: C.white }]}>
                  Save Changes
                </Text>
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
        onRequestClose={() => setActionTaskId(null)}
      >
        <TouchableOpacity
          style={s.promptOverlay}
          activeOpacity={1}
          onPress={() => setActionTaskId(null)}
        >
          <SafeAreaView
            style={[
              s.promptSheet,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View
              style={[s.promptHandle, { backgroundColor: colors.mutedLight }]}
            />
            <Text style={[s.promptTitle, { color: colors.text }]}>
              {actionTask?.title}
            </Text>
            <Text style={[s.promptSub, { color: colors.muted }]}>
              {actionTask?.done
                ? "Undo done or delete this task"
                : "Mark as done or delete this task"}
            </Text>

            <View style={s.promptRow}>
              <TouchableOpacity
                style={[
                  s.promptBtn,
                  s.promptDelete,
                  {
                    backgroundColor: colors.highlight,
                    borderColor: colors.mutedLight,
                  },
                ]}
                onPress={() => {
                  if (actionTask) deleteTask(actionTask.id);
                  setActionTaskId(null);
                }}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="trash-outline"
                  size={18}
                  color={colors.danger}
                />
                <Text style={[s.promptDeleteTxt, { color: colors.danger }]}>
                  Delete
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  s.promptBtn,
                  actionTask?.done ? s.promptUndo : s.promptDone,
                  {
                    backgroundColor: colors.primary,
                    borderColor: colors.primary,
                  },
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
                <Text style={[s.promptDoneTxt, { color: C.white }]}>
                  {actionTask?.done ? "Undo DONE" : "Done"}
                </Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </TouchableOpacity>
      </Modal>
      </SafeAreaView>
    </IconBackground>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 8 },
  title: {
    fontSize: 26,
    fontWeight: "800",
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
    marginTop: 16,
  },
  emptySub: { fontSize: 13, marginTop: 6 },

  list: { paddingHorizontal: 18, paddingTop: 6, paddingBottom: 130 },
  section: { marginBottom: 18 },

  dayRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  dayLine: { flex: 1, height: 1 },
  dayName: {
    fontSize: 10,
    fontWeight: "700",
    paddingHorizontal: 10,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },

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
    borderRadius: 30,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    shadowColor: "#32C671",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  badgeTxt: { fontSize: 12, fontWeight: "700" },

  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  sheet: {
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    padding: 22,
    borderTopWidth: 1,
  },
  handle: {
    width: 38,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 18,
  },
  sheetTitle: {
    fontSize: 19,
    fontWeight: "800",
    marginBottom: 18,
  },

  lbl: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.8,
    marginBottom: 7,
  },
  mInput: {
    borderWidth: 1,
    borderRadius: 11,
    paddingHorizontal: 13,
    paddingVertical: 11,
    fontSize: 14,
    marginBottom: 14,
  },
  mInputTall: { height: 74, textAlignVertical: "top" },

  dc: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  dcTxt: { fontSize: 12, fontWeight: "700" },
  dcTxtOn: { color: C.white },

  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 10,
    padding: 11,
    borderWidth: 1,
    marginBottom: 4,
  },
  timeTxt: { flex: 1, fontSize: 13, fontWeight: "600" },
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
    borderWidth: 1,
  },
  tsTxt: { fontSize: 10, fontWeight: "600" },

  mActions: { flexDirection: "row", gap: 10, marginTop: 14 },
  cancelBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
  },
  cancelTxt: { fontSize: 14, fontWeight: "700" },
  saveBtn: {
    flex: 2,
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  saveTxt: { fontSize: 14, fontWeight: "700" },

  promptOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  promptSheet: {
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderTopWidth: 1,
    padding: 22,
    paddingBottom: 36,
  },
  promptHandle: {
    width: 38,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 18,
  },
  promptTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  promptSub: {
    fontSize: 12,
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
  promptDelete: {},
  promptDeleteTxt: {
    fontSize: 14,
    fontWeight: "700",
  },
  promptUndo: {
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  promptDone: {
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  promptDoneTxt: {
    fontSize: 14,
    fontWeight: "700",
  },
});
