// screens/AddTaskScreen.tsx
import { Ionicons } from "@expo/vector-icons";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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
import type { RootStackParamList } from "../App";
import { useTasks } from "../context/TaskContext";

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
  }, [saved]);

  const canSave = title.trim().length > 0;

  const handleSave = () => {
    if (!canSave) return;
    addTask({ title: title.trim(), description: desc.trim(), day, time });
    setSaved(true);
  };

  const goToUpcoming = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Tabs", params: { screen: "Upcoming" } }],
      }),
    );
  };

  return (
    <View style={[s.safe, { paddingTop: insets.top }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* ── Header ── */}
        <View style={s.header}>
          {/* Close button (Interactive element) */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={s.closeBtn}
          >
            <Ionicons name="close" size={22} color="#A78BCA" />
          </TouchableOpacity>
          <Text style={s.headerTitle}>New Task</Text>
          <TouchableOpacity
            style={[s.saveTopBtn, !canSave && s.saveTopBtnOff]}
            onPress={handleSave}
            disabled={!canSave}
          >
            <Text style={[s.saveTopTxt, !canSave && s.saveTopTxtOff]}>
              Save
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={s.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={true}
        >
          {/* ── Task title (Text input requirement) ── */}
          <View style={s.card}>
            <Text style={s.lbl}>TASK TITLE *</Text>
            <TextInput
              style={s.titleInput}
              value={title}
              onChangeText={setTitle}
              placeholder="What needs to be done?"
              placeholderTextColor="#4A3560"
              selectionColor="#C084FC"
              autoFocus
              editable={!saved}
            />
          </View>

          {/* ── Description (Text input requirement) ── */}
          <View style={s.card}>
            <Text style={s.lbl}>DESCRIPTION</Text>
            <TextInput
              style={s.descInput}
              value={desc}
              onChangeText={setDesc}
              placeholder="Add a note (optional)"
              placeholderTextColor="#4A3560"
              selectionColor="#C084FC"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              editable={!saved}
            />
          </View>

          {/* ── Day selector (Touchable area requirement) ── */}
          <View style={s.card}>
            <Text style={s.lbl}>SCHEDULE FOR</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={s.dayRow}
            >
              {DAYS.map((d) => (
                <TouchableOpacity
                  key={d}
                  style={[s.dc, day === d && s.dcOn]}
                  onPress={() => setDay(d)}
                  activeOpacity={0.75}
                  disabled={saved}
                >
                  <Text style={[s.dcTxt, day === d && s.dcTxtOn]}>
                    {d.slice(0, 3)}
                  </Text>
                  {d === todayName && <View style={s.todayDot} />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* ── Time picker (Touchable area requirement) ── */}
          <View style={s.card}>
            <Text style={s.lbl}>TIME</Text>
            <TouchableOpacity
              style={s.timeRow}
              onPress={() => setShowTimes(!showTimes)}
              activeOpacity={0.8}
              disabled={saved}
            >
              <Ionicons
                name="time-outline"
                size={17}
                color={time ? "#C084FC" : "#6B5A8A"}
              />
              <Text style={[s.timeTxt, !time && s.timePh]}>
                {time || "Pick a time"}
              </Text>
              <Ionicons
                name={showTimes ? "chevron-up" : "chevron-down"}
                size={15}
                color="#6B5A8A"
              />
            </TouchableOpacity>
            {showTimes && (
              <View style={s.timeGrid}>
                {TIMES.map((t) => (
                  <TouchableOpacity
                    key={t}
                    style={[s.ts, time === t && s.tsOn]}
                    onPress={() => {
                      setTime(t);
                      setShowTimes(false);
                    }}
                    activeOpacity={0.75}
                    disabled={saved}
                  >
                    <Text style={[s.tsTxt, time === t && s.tsTxtOn]}>{t}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* ── Live preview summary ── */}
          {canSave && !saved && (
            <View style={s.summary}>
              <View style={s.summaryDot} />
              <View style={{ flex: 1 }}>
                <Text style={s.summaryTitle}>{title}</Text>
                <Text style={s.summaryMeta}>
                  {day}
                  {time ? `  ·  ${time}` : ""}
                </Text>
              </View>
              <Ionicons name="sparkles" size={15} color="#C084FC" />
            </View>
          )}

          {/* ── Add Task button (Button requirement) ── */}
          {!saved && (
            <TouchableOpacity
              style={[s.addBtn, !canSave && s.addBtnOff]}
              onPress={handleSave}
              disabled={!canSave}
              activeOpacity={0.85}
            >
              <Ionicons name="add-circle-outline" size={19} color="#fff" />
              <Text style={s.addBtnTxt}>Add Task</Text>
            </TouchableOpacity>
          )}
        </ScrollView>

        {/* ── Saved toast ── */}
        {saved && (
          <Animated.View
            style={[s.toast, { transform: [{ translateY: slideAnim }] }]}
          >
            <View style={s.toastIcon}>
              <Ionicons name="checkmark-circle" size={22} color="#C084FC" />
            </View>
            <View style={s.toastBody}>
              <Text style={s.toastTitle}>Task saved!</Text>
              <Text style={s.toastSub}>
                Scheduled for {day}
                {time ? ` at ${time}` : ""}
              </Text>
            </View>
            <TouchableOpacity style={s.toastAction} onPress={goToUpcoming}>
              <Text style={s.toastActionTxt}>View in Upcoming</Text>
              <Ionicons name="chevron-forward" size={14} color="#C084FC" />
            </TouchableOpacity>
          </Animated.View>
        )}
      </KeyboardAvoidingView>
    </View>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0D0118" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#1E0A35",
  },
  closeBtn: { padding: 4 },
  headerTitle: { fontSize: 16, fontWeight: "700", color: "#EDE9FE" },
  saveTopBtn: {
    backgroundColor: "#7C3AED",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  saveTopBtnOff: { backgroundColor: "#2D1B4E" },
  saveTopTxt: { color: "#fff", fontWeight: "700", fontSize: 13 },
  saveTopTxtOff: { color: "#4A3560" },

  scroll: { padding: 18, paddingBottom: 50 },
  card: {
    backgroundColor: "#160828",
    borderRadius: 16,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#2D1B4E",
  },
  lbl: {
    fontSize: 10,
    fontWeight: "700",
    color: "#9D6FCA",
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  titleInput: {
    fontSize: 17,
    fontWeight: "600",
    color: "#EDE9FE",
    padding: 0,
    lineHeight: 24,
  },
  descInput: { fontSize: 14, color: "#C4B5E0", padding: 0, height: 68 },

  dayRow: { gap: 8, paddingVertical: 2 },
  dc: {
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#0D0118",
    borderWidth: 1,
    borderColor: "#2D1B4E",
    minWidth: 52,
    position: "relative",
  },
  dcOn: {
    backgroundColor: "#7C3AED",
    borderColor: "#9D4FEF",
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  dcTxt: { fontSize: 11, fontWeight: "700", color: "#6B5A8A" },
  dcTxtOn: { color: "#fff" },
  todayDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#C084FC",
    position: "absolute",
    top: 5,
    right: 7,
  },

  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    backgroundColor: "#0D0118",
    borderRadius: 10,
    padding: 11,
    borderWidth: 1,
    borderColor: "#2D1B4E",
  },
  timeTxt: { flex: 1, fontSize: 14, fontWeight: "600", color: "#EDE9FE" },
  timePh: { color: "#4A3560" },
  timeGrid: { flexDirection: "row", flexWrap: "wrap", gap: 7, marginTop: 12 },
  ts: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 9,
    backgroundColor: "#0D0118",
    borderWidth: 1,
    borderColor: "#2D1B4E",
  },
  tsOn: { backgroundColor: "#5B21B6", borderColor: "#7C3AED" },
  tsTxt: { fontSize: 11, fontWeight: "600", color: "#6B5A8A" },
  tsTxtOn: { color: "#fff" },

  summary: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#1E0A35",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#3B1F60",
  },
  summaryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#C084FC",
  },
  summaryTitle: { fontSize: 13, fontWeight: "700", color: "#EDE9FE" },
  summaryMeta: { fontSize: 11, color: "#9D6FCA", marginTop: 3 },

  addBtn: {
    backgroundColor: "#7C3AED",
    borderRadius: 14,
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 10,
  },
  addBtnOff: { backgroundColor: "#2D1B4E", shadowOpacity: 0, elevation: 0 },
  addBtnTxt: { color: "#fff", fontSize: 15, fontWeight: "700" },

  toast: {
    position: "absolute",
    bottom: 30,
    left: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E0A35",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#3B1F60",
    shadowColor: "#7C3AED",
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
    color: "#EDE9FE",
  },
  toastSub: {
    fontSize: 11,
    color: "#9D6FCA",
    marginTop: 2,
  },
  toastAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#2D1B4E",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginLeft: 8,
  },
  toastActionTxt: {
    fontSize: 11,
    fontWeight: "700",
    color: "#C084FC",
  },
});
