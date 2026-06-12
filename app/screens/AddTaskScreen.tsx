// screens/AddTaskScreen.tsx
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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

type Nav = NativeStackNavigationProp<RootStackParamList, "AddTask">;

export default function AddTaskScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const { addTask } = useTasks();
  const { colors } = useTheme();
  const todayName = DAYS[new Date().getDay()];

  // useState for every form field (State management requirement)
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [day, setDay] = useState(todayName);
  const [time, setTime] = useState("");
  const [showTimes, setShowTimes] = useState(false);

  const [saved, setSaved] = useState(false);
  const slideAnim = useRef(new Animated.Value(100)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (saved) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        damping: 15,
        stiffness: 200,
      }).start();

      timerRef.current = setTimeout(() => {
        navigation.goBack();
      }, 3000);

      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }
  }, [saved, navigation, slideAnim]);

  const canSave = title.trim().length > 0;

  const handleSave = () => {
    if (!canSave) return;
    addTask({ title: title.trim(), description: desc.trim(), day, time });
    setSaved(true);
  };

  const goToUpcoming = () => {
    console.log("View in Upcoming pressed");
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    navigation.replace("Tabs", { screen: "Upcoming" });
  };
  return (
    <View
      style={[s.safe, { paddingTop: insets.top, backgroundColor: colors.bg }]}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* ── Header ── */}
        <View style={[s.header, { borderBottomColor: colors.highlight }]}>
          {/* Close button (Interactive element) */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={s.closeBtn}
          >
            <Ionicons name="close" size={22} color={colors.muted} />
          </TouchableOpacity>
          <Text style={[s.headerTitle, { color: colors.text }]}>New Task</Text>
          <TouchableOpacity
            style={[
              s.saveTopBtn,
              { backgroundColor: colors.primary },
              !canSave && { backgroundColor: colors.mutedLight },
            ]}
            onPress={handleSave}
            disabled={!canSave}
          >
            <Text
              style={[
                s.saveTopTxt,
                { color: C.white },
                !canSave && { color: colors.muted },
              ]}
            >
              Save
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={[s.scroll]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={true}
        >
          {/* ── Task title (Text input requirement) ── */}
          <View
            style={[
              s.card,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={[s.lbl, { color: colors.muted }]}>TASK TITLE *</Text>
            <TextInput
              style={[s.titleInput, { color: colors.text }]}
              value={title}
              onChangeText={setTitle}
              placeholder="What needs to be done?"
              placeholderTextColor={colors.muted}
              selectionColor={colors.primary}
              autoFocus
              editable={!saved}
            />
          </View>

          {/* ── Description (Text input requirement) ── */}
          <View
            style={[
              s.card,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={[s.lbl, { color: colors.muted }]}>DESCRIPTION</Text>
            <TextInput
              style={[s.descInput, { color: colors.muted }]}
              value={desc}
              onChangeText={setDesc}
              placeholder="Add a note (optional)"
              placeholderTextColor={colors.muted}
              selectionColor={colors.primary}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              editable={!saved}
            />
          </View>

          {/* ── Day selector (Touchable area requirement) ── */}
          <View
            style={[
              s.card,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={[s.lbl, { color: colors.muted }]}>SCHEDULE FOR</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={s.dayRow}
            >
              {DAYS.map((d) => (
                <TouchableOpacity
                  key={d}
                  style={[
                    s.dc,
                    { backgroundColor: colors.bg, borderColor: colors.border },
                    day === d && {
                      backgroundColor: colors.primary,
                      borderColor: colors.mutedLight,
                    },
                  ]}
                  onPress={() => setDay(d)}
                  activeOpacity={0.75}
                  disabled={saved}
                >
                  <Text
                    style={[
                      s.dcTxt,
                      { color: colors.muted },
                      day === d && { color: C.white },
                    ]}
                  >
                    {d.slice(0, 3)}
                  </Text>
                  {d === todayName && (
                    <View
                      style={[s.todayDot, { backgroundColor: colors.primary }]}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* ── Time picker (Touchable area requirement) ── */}
          <View
            style={[
              s.card,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={[s.lbl, { color: colors.muted }]}>TIME</Text>
            <TouchableOpacity
              style={[
                s.timeRow,
                { backgroundColor: colors.bg, borderColor: colors.border },
              ]}
              onPress={() => setShowTimes(!showTimes)}
              activeOpacity={0.8}
              disabled={saved}
            >
              <Ionicons
                name="time-outline"
                size={17}
                color={time ? colors.primary : colors.muted}
              />
              <Text
                style={[
                  s.timeTxt,
                  { color: colors.text },
                  !time && { color: colors.muted },
                ]}
              >
                {time || "Pick a time"}
              </Text>
              <Ionicons
                name={showTimes ? "chevron-up" : "chevron-down"}
                size={15}
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
                      time === t && {
                        backgroundColor: colors.primary,
                        borderColor: colors.primary,
                      },
                    ]}
                    onPress={() => {
                      setTime(t);
                      setShowTimes(false);
                    }}
                    activeOpacity={0.75}
                    disabled={saved}
                  >
                    <Text
                      style={[
                        s.tsTxt,
                        { color: colors.muted },
                        time === t && { color: C.white },
                      ]}
                    >
                      {t}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* ── Live preview summary ── */}
          {canSave && !saved && (
            <View
              style={[
                s.summary,
                {
                  backgroundColor: colors.highlight,
                  borderColor: colors.mutedLight,
                },
              ]}
            >
              <View
                style={[s.summaryDot, { backgroundColor: colors.primary }]}
              />
              <View style={{ flex: 1 }}>
                <Text style={[s.summaryTitle, { color: colors.text }]}>
                  {title}
                </Text>
                <Text style={[s.summaryMeta, { color: colors.muted }]}>
                  {day}
                  {time ? `  ·  ${time}` : ""}
                </Text>
              </View>
              <Ionicons name="sparkles" size={15} color={colors.primary} />
            </View>
          )}

          {/* ── Add Task button (Button requirement) ── */}
          {!saved && (
            <TouchableOpacity
              style={[
                s.addBtn,
                { backgroundColor: colors.primary },
                !canSave && { backgroundColor: colors.mutedLight },
              ]}
              onPress={handleSave}
              disabled={!canSave}
              activeOpacity={0.85}
            >
              <Ionicons name="add-circle-outline" size={19} color={C.white} />
              <Text style={[s.addBtnTxt, { color: C.white }]}>Add Task</Text>
            </TouchableOpacity>
          )}
        </ScrollView>

        {/* ── Saved toast ── */}
        {saved && (
          <Animated.View
            style={[
              s.toast,
              {
                backgroundColor: colors.highlight,
                borderColor: colors.mutedLight,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={s.toastIcon}>
              <Ionicons
                name="checkmark-circle"
                size={22}
                color={colors.success}
              />
            </View>
            <View style={s.toastBody}>
              <Text style={[s.toastTitle, { color: colors.text }]}>
                Task saved!
              </Text>
              <Text style={[s.toastSub, { color: colors.muted }]}>
                Scheduled for {day}
                {time ? ` at ${time}` : ""}
              </Text>
            </View>
            <TouchableOpacity
              style={[s.toastAction, { backgroundColor: colors.border }]}
              onPress={goToUpcoming}
            >
              <Text style={[s.toastActionTxt, { color: colors.primary }]}>
                View in Upcoming
              </Text>
              <Ionicons
                name="chevron-forward"
                size={14}
                color={colors.primary}
              />
            </TouchableOpacity>
          </Animated.View>
        )}
      </KeyboardAvoidingView>
    </View>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  closeBtn: { padding: 4 },
  headerTitle: { fontSize: 16, fontWeight: "700" },
  saveTopBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  saveTopTxt: { fontWeight: "700", fontSize: 13 },

  scroll: { padding: 18, paddingBottom: 50 },
  card: {
    borderRadius: 16,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
  },
  lbl: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  titleInput: {
    fontSize: 17,
    fontWeight: "600",
    padding: 0,
    lineHeight: 24,
  },
  descInput: { fontSize: 14, padding: 0, height: 68 },

  dayRow: { gap: 8, paddingVertical: 2 },
  dc: {
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    minWidth: 52,
    position: "relative",
  },
  dcTxt: { fontSize: 11, fontWeight: "700" },
  todayDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    position: "absolute",
    top: 5,
    right: 7,
  },

  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    borderRadius: 10,
    padding: 11,
    borderWidth: 1,
  },
  timeTxt: { flex: 1, fontSize: 14, fontWeight: "600" },
  timeGrid: { flexDirection: "row", flexWrap: "wrap", gap: 7, marginTop: 12 },
  ts: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 9,
    borderWidth: 1,
  },
  tsTxt: { fontSize: 11, fontWeight: "600" },

  summary: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
  },
  summaryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  summaryTitle: { fontSize: 13, fontWeight: "700" },
  summaryMeta: { fontSize: 11, marginTop: 3 },

  addBtn: {
    borderRadius: 14,
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 10,
  },
  addBtnTxt: { fontSize: 15, fontWeight: "700" },

  toast: {
    position: "absolute",
    bottom: 30,
    left: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 12,
  },
  toastIcon: { marginRight: 12 },
  toastBody: { flex: 1 },
  toastTitle: {
    fontSize: 14,
    fontWeight: "700",
  },
  toastSub: {
    fontSize: 11,
    marginTop: 2,
  },
  toastAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginLeft: 8,
  },
  toastActionTxt: {
    fontSize: 11,
    fontWeight: "700",
  },
});
