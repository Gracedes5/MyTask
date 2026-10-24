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
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import IconBackground from "../../components/IconBackground";
import NoteModal from "../../components/NoteModal";
import VoiceCaptureButton from "../../components/VoiceCaptureButton";
import VoiceCaptureModal from "../../components/VoiceCaptureModal";
import { C } from "../../constants/theme";
import {
  TodayScreenStyles as s,
  WelcomePopupStyles as wp,
  PriorityRingStyles as pr,
} from "../../constants/styles";
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

type Nav = NativeStackNavigationProp<{ AddTask: undefined }, "AddTask">;

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
      <View
        style={[
          wp.card,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
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
          <View
            style={[
              wp.badge,
              { backgroundColor: colors.primary, borderColor: C.white },
            ]}
          >
            <Ionicons name="checkmark" size={18} color={C.white} />
          </View>
        </View>

        <Text style={[wp.title, { color: colors.text }]}>Plan Taskly</Text>
        <Text style={[wp.sub, { color: colors.muted }]}>
          Organize your day, track tasks,{"\n"}and stay on top of what matters.
        </Text>

        <TouchableOpacity
          style={[wp.btn, { backgroundColor: colors.primary }]}
          onPress={onDone}
          activeOpacity={0.85}
        >
          <Text style={[wp.btnTxt, { color: C.white }]}>
            {first ? "Get Started" : "Continue Tasks Plan"}
          </Text>
          <Ionicons name="arrow-forward" size={18} color={C.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ── Circular progress ring ── */
function ProgressRing({
  pct,
  size = 96,
  stroke = 8,
  color,
  bgColor,
  cardBg,
  children,
}: {
  pct: number;
  size?: number;
  stroke?: number;
  color: string;
  bgColor: string;
  cardBg: string;
  children: React.ReactNode;
}) {
  const half = size / 2;
  const innerSize = size - stroke * 2;
  const clamped = Math.min(100, Math.max(0, pct));

  // Right cover sweeps 0→180deg as progress goes 0→50%
  const rightAngle = Math.min(180, (clamped / 50) * 180);
  // Left cover sweeps 0→180deg as progress goes 50→100%
  const leftAngle = Math.max(0, ((clamped - 50) / 50) * 180);

  return (
    <View style={{ width: size, height: size }}>
      {/* Colored progress (always a full ring, progressively uncovered) */}
      <View
        style={{
          position: "absolute",
          width: size,
          height: size,
          borderRadius: half,
          borderWidth: stroke,
          borderColor: color,
        }}
      />

      {/* Right cover – hides/shows the right half of the colored ring.
          Uses bgColor so the covered portion looks like the "track". */}
      <View
        style={{
          position: "absolute",
          top: 0,
          left: half,
          width: half,
          height: size,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            position: "absolute",
            left: -half,
            top: 0,
            width: half * 2,
            height: size,
            transform: [{ rotate: `${rightAngle}deg` }],
          }}
        >
          <View
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              width: half,
              height: size,
              backgroundColor: bgColor,
            }}
          />
        </View>
      </View>

      {/* Left cover – hides/shows the left half of the colored ring */}
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: half,
          height: size,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: half * 2,
            height: size,
            transform: [{ rotate: `${leftAngle}deg` }],
          }}
        >
          <View
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: half,
              height: size,
              backgroundColor: bgColor,
            }}
          />
        </View>
      </View>

      {/* Center hole */}
      <View
        style={{
          position: "absolute",
          top: stroke,
          left: stroke,
          width: innerSize,
          height: innerSize,
          borderRadius: innerSize / 2,
          backgroundColor: cardBg,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {children}
      </View>
    </View>
  );
}

export default function TodayScreen() {
  const { tasks, toggleDone, deleteTask, updateTaskNote } = useTasks();
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<Nav>();

  const [actionTaskId, setActionTaskId] = useState<string | null>(null);
  const [noteTaskId, setNoteTaskId] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [firstLaunch, setFirstLaunch] = useState(true);
  const [voiceModalVisible, setVoiceModalVisible] = useState(false);
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

  const total = todayTasks.length;
  const completed = doneCount;
  const pct = total > 0 ? (completed / total) * 100 : 0;

  const priorityLevel =
    total >= 3 ? "High Priority" : total >= 1 ? "Medium Priority" : "Low Priority";

  const priorityMsg =
    total > 0 && completed === total
      ? "Priority tasks completed."
      : total - completed === 1
        ? "Almost there! One more to go."
        : "Stay focused on today's goals.";

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning";
    if (h < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const priorityCard = total > 0 ? (
    <View
      style={[
        pr.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      <Text style={[pr.heading, { color: colors.primary }]}>
        TODAY&apos;S PRIORITY
      </Text>

      <View style={pr.ringRow}>
        <ProgressRing
          pct={pct}
          size={88}
          stroke={7}
          color={colors.success}
          bgColor={isDark ? "#2D6A4F" : "#C8E6C9"}
          cardBg={colors.card}
        >
          <View style={pr.ringCenter}>
            <Ionicons
              name="flag"
              size={16}
              color={colors.success}
            />
            <Text style={[pr.ringFrac, { color: colors.text }]}>
              {completed}/{total}
            </Text>
          </View>
        </ProgressRing>

        <View style={pr.info}>
          <Text style={[pr.level, { color: colors.text }]}>
            {priorityLevel}
          </Text>
          <Text style={[pr.msg, { color: colors.muted }]}>{priorityMsg}</Text>
        </View>
      </View>
    </View>
  ) : null;

  return (
    <IconBackground>
      <SafeAreaView style={[s.safe, { backgroundColor: "transparent" }]}>
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
          <Ionicons
            name="calendar-outline"
            size={60}
            color={colors.mutedLight}
          />
          <Text style={[s.emptyTitle, { color: colors.text }]}>
            Don&apos;t You have a Task?
          </Text>
          <Text style={[s.emptySub, { color: colors.muted }]}>
            Tap + to add one
          </Text>
        </View>
      ) : (
        <FlatList
          data={todayTasks}
          keyExtractor={(item) => item.id}
          contentContainerStyle={s.list}
          showsVerticalScrollIndicator={true}
          ListFooterComponent={priorityCard}
          ListFooterComponentStyle={pr.footer}
          renderItem={({ item }) => (
            <View
              style={[
                s.card,
                {
                  backgroundColor: isDark ? colors.card : "#F3EFFF",
                  borderColor: isDark ? colors.border : "#D8CCF0",
                },
                item.done && (isDark ? s.cardDoneDark : s.cardDone),
              ]}
            >
              <View
                style={[
                  s.accent,
                  { backgroundColor: colors.primary },
                  item.done && { backgroundColor: colors.success },
                ]}
              />

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
                    item.done && s.cardTitleDone,
                  ]}
                >
                  {item.title}
                </Text>
                {item.description ? (
                  <Text style={[s.cardDesc, { color: colors.muted }]}>
                    {item.description}
                  </Text>
                ) : null}
                {item.time ? (
                  <Text style={[s.cardTime, { color: colors.muted }]}>
                    ⏰ {item.time}
                  </Text>
                ) : null}
              </View>

              <TouchableOpacity
                style={s.noteBtn}
                onPress={() => setNoteTaskId(item.id)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={item.note ? "document-text" : "document-text-outline"}
                  size={18}
                  color={item.note ? colors.primary : colors.mutedLight}
                />
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      {/* ── Floating add button ── */}
      <TouchableOpacity
        style={[
          s.fab,
          { backgroundColor: colors.primary, shadowColor: colors.primary },
        ]}
        onPress={() => navigation.navigate("AddTask")}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={26} color={C.white} />
      </TouchableOpacity>

      {/* ── Voice capture button ── */}
      <VoiceCaptureButton onPress={() => setVoiceModalVisible(true)} />

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
          <SafeAreaView
            style={[
              s.actionSheet,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View
              style={[s.actionHandle, { backgroundColor: colors.mutedLight }]}
            />
            <Text style={[s.actionTitle, { color: colors.text }]}>
              {actionTask?.title}
            </Text>
            <Text style={[s.actionSub, { color: colors.muted }]}>
              {actionTask?.done
                ? "Undo done or delete this task"
                : "Mark as done or delete this task"}
            </Text>

            <View style={s.actionRow}>
              <TouchableOpacity
                style={[
                  s.actionBtn,
                  s.actionDelete,
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
                <Text style={[s.actionDeleteTxt, { color: colors.danger }]}>
                  Delete
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  s.actionBtn,
                  actionTask?.done ? s.actionUndo : s.actionDone,
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
                <Text style={s.actionDoneTxt}>
                  {actionTask?.done ? "Undo DONE" : "Done"}
                </Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </TouchableOpacity>
      </Modal>

      {/* ── Voice capture modal ── */}
      <VoiceCaptureModal
        visible={voiceModalVisible}
        onClose={() => setVoiceModalVisible(false)}
      />
      </SafeAreaView>
    </IconBackground>
  );
}
