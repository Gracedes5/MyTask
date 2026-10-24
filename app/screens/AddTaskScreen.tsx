// screens/AddTaskScreen.tsx
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AddTaskScreenStyles as s } from "../../constants/styles";
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

type Nav = NativeStackNavigationProp<RootStackParamList, "AddTask">;

function formatDate(date: Date) {
  const options: Intl.DateTimeFormatOptions = { weekday: "long", month: "long", day: "numeric", year: "numeric" };
  return date.toLocaleDateString(undefined, options);
}

function formatTime(date: Date) {
  return date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

export default function AddTaskScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const { addTask } = useTasks();
  const { colors } = useTheme();

  // useState for every form field (State management requirement)
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [timeSet, setTimeSet] = useState(false);

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

  const dayName = DAYS[selectedDate.getDay()];
  const timeStr = timeSet ? formatTime(selectedDate) : "";

  const handleSave = () => {
    if (!canSave) return;
    addTask({ title: title.trim(), description: desc.trim(), day: dayName, time: timeStr });
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

          {/* ── Date & Time picker (Date and time requirement) ── */}
          <View
            style={[
              s.card,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={[s.lbl, { color: colors.muted }]}>SCHEDULE</Text>
            <TouchableOpacity
              style={[
                s.timeRow,
                { backgroundColor: colors.bg, borderColor: colors.border, marginBottom: 10 },
              ]}
              onPress={() => setShowDatePicker(true)}
              activeOpacity={0.8}
              disabled={saved}
            >
              <Ionicons name="calendar-outline" size={17} color={colors.primary} />
              <Text style={[s.timeTxt, { color: colors.text }]}>
                {formatDate(selectedDate)}
              </Text>
              <Ionicons name="chevron-forward" size={15} color={colors.muted} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                s.timeRow,
                { backgroundColor: colors.bg, borderColor: colors.border },
              ]}
              onPress={() => setShowTimePicker(true)}
              activeOpacity={0.8}
              disabled={saved}
            >
              <Ionicons name="time-outline" size={17} color={timeSet ? colors.primary : colors.muted} />
              <Text style={[s.timeTxt, { color: timeSet ? colors.text : colors.muted }]}>
                {timeSet ? formatTime(selectedDate) : "Pick a time (optional)"}
              </Text>
              <Ionicons name="chevron-forward" size={15} color={colors.muted} />
            </TouchableOpacity>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(event, date) => {
                setShowDatePicker(Platform.OS === "ios");
                if (date) {
                  const newDate = new Date(selectedDate);
                  newDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
                  setSelectedDate(newDate);
                }
              }}
            />
          )}
          {showTimePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="time"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(event, date) => {
                setShowTimePicker(Platform.OS === "ios");
                if (date) {
                  const newDate = new Date(selectedDate);
                  newDate.setHours(date.getHours(), date.getMinutes());
                  setSelectedDate(newDate);
                  setTimeSet(true);
                }
              }}
            />
          )}

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
                  {formatDate(selectedDate)}
                  {timeSet ? `  ·  ${formatTime(selectedDate)}` : ""}
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
                Scheduled for {formatDate(selectedDate)}
                {timeSet ? ` at ${formatTime(selectedDate)}` : ""}
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

