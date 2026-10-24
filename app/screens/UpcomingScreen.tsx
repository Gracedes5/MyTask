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
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { UpcomingScreenStyles as s } from "../../constants/styles";
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

