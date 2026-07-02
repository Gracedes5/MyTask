import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
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
import { useTheme } from "../app/context/ThemeContext";
import { useTasks } from "../app/context/TaskContext";
import { parseVoiceTasks, type ParsedTask } from "../utils/parseVoiceTasks";
import TaskPreviewCard from "./TaskPreviewCard";

const DAYS = [
  "Sunday", "Monday", "Tuesday", "Wednesday",
  "Thursday", "Friday", "Saturday",
];

type Props = {
  visible: boolean;
  onClose: () => void;
};

function getTodayName(): string {
  return DAYS[new Date().getDay()];
}

function formatTimeDisplay(time: string): string {
  if (!time) return "";
  const match = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return time;
  let h = parseInt(match[1], 10);
  const m = match[2];
  const meridiem = match[3].toUpperCase();
  if (meridiem === "PM" && h !== 12) h += 12;
  if (meridiem === "AM" && h === 12) h = 0;
  return `${String(h).padStart(2, "0")}:${m} ${meridiem}`;
}

export default function VoiceCaptureModal({ visible, onClose }: Props) {
  const { colors, isDark } = useTheme();
  const { addTask } = useTasks();

  const [step, setStep] = useState<"input" | "review" | "editing">("input");
  const [inputText, setInputText] = useState("");
  const [parsedTasks, setParsedTasks] = useState<ParsedTask[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editTime, setEditTime] = useState("");
  const [savedCount, setSavedCount] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const successOpacity = useRef(new Animated.Value(0)).current;

  /* ── Focus input on open ── */
  useEffect(() => {
    if (visible) {
      setStep("input");
      setInputText("");
      setParsedTasks([]);
      setEditIndex(null);
      setSavedCount(0);
      setShowSuccess(false);
      setTimeout(() => inputRef.current?.focus(), 400);
    }
  }, [visible]);

  /* ── Success animation ── */
  useEffect(() => {
    if (showSuccess) {
      successOpacity.setValue(0);
      Animated.timing(successOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        Animated.timing(successOpacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }).start(() => {
          setShowSuccess(false);
          onClose();
        });
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [showSuccess, successOpacity, onClose]);

  /* ── Handlers ── */
  const handleGenerate = () => {
    const tasks = parseVoiceTasks(inputText);
    setParsedTasks(tasks);
    setStep(tasks.length > 0 ? "review" : "review");
  };

  const handleSave = () => {
    const today = getTodayName();
    let count = 0;
    for (const t of parsedTasks) {
      if (t.title.trim()) {
        addTask({
          title: t.title.trim(),
          description: "",
          day: today,
          time: formatTimeDisplay(t.time),
        });
        count++;
      }
    }
    setSavedCount(count);
    setShowSuccess(true);
  };

  const handleEdit = (index: number) => {
    const task = parsedTasks[index];
    setEditIndex(index);
    setEditTitle(task.title);
    setEditTime(task.time);
    setStep("editing");
  };

  const handleRemove = (index: number) => {
    const updated = parsedTasks.filter((_, i) => i !== index);
    setParsedTasks(updated);
    if (updated.length === 0) setStep("input");
  };

  const handleEditSave = () => {
    if (editIndex === null) return;
    setParsedTasks((prev) =>
      prev.map((t, i) =>
        i === editIndex
          ? {
              title: editTitle.trim() || t.title,
              time: editTime.trim() || t.time,
            }
          : t,
      ),
    );
    setEditIndex(null);
    setEditTitle("");
    setEditTime("");
    setStep("review");
  };

  const handleEditCancel = () => {
    setEditIndex(null);
    setEditTitle("");
    setEditTime("");
    setStep("review");
  };

  const handleAddManual = () => {
    setParsedTasks((prev) => [...prev, { title: "", time: "" }]);
    handleEdit(parsedTasks.length);
  };

  const handleBackToInput = () => {
    setStep("input");
    setParsedTasks([]);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={s.overlay} activeOpacity={1} onPress={onClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={s.keyboard}
        >
          <SafeAreaView
            style={[
              s.sheet,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View style={[s.handle, { backgroundColor: colors.mutedLight }]} />

            {step === "input" && (
              <View style={s.content}>
                <Text style={s.micEmoji}>{"\uD83C\uDFA4"}</Text>
                <Text style={[s.heading, { color: colors.text }]}>
                  Voice Quick Capture
                </Text>
                <Text style={[s.comingSoon, { color: colors.warning }]}>
                  COMING SOON
                </Text>
                <Text style={[s.subtitle, { color: colors.muted }]}>
                  What would you like to do today?
                </Text>

                <View
                  style={[
                    s.inputWrap,
                    {
                      backgroundColor: colors.highlight,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <TextInput
                    ref={inputRef}
                    style={[s.input, { color: colors.text }]}
                    value={inputText}
                    onChangeText={setInputText}
                    placeholder='e.g. "I need to visit the bank at 9am and buy groceries at 11am"'
                    placeholderTextColor={colors.mutedLight}
                    multiline
                    textAlignVertical="top"
                  />
                </View>

                <TouchableOpacity
                  style={[
                    s.generateBtn,
                    {
                      backgroundColor: inputText.trim()
                        ? colors.primary
                        : colors.mutedLight,
                    },
                  ]}
                  onPress={handleGenerate}
                  activeOpacity={0.85}
                  disabled={!inputText.trim()}
                >
                  <Ionicons name="sparkles" size={16} color="#FFFFFF" />
                  <Text style={s.generateBtnTxt}>Generate Tasks</Text>
                </TouchableOpacity>
              </View>
            )}

            {step === "review" && (
              <View style={s.content}>
                <View style={s.foundBadge}>
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color={colors.success}
                  />
                  <Text style={[s.foundTxt, { color: colors.text }]}>
                    {parsedTasks.length > 0
                      ? `Found ${parsedTasks.length} task${parsedTasks.length > 1 ? "s" : ""}`
                      : "No tasks detected"}
                  </Text>
                </View>

                {parsedTasks.length > 0 ? (
                  <ScrollView style={s.taskList} showsVerticalScrollIndicator={false}>
                    {parsedTasks.map((task, i) => (
                      <TaskPreviewCard
                        key={i}
                        task={task}
                        index={i}
                        onEdit={handleEdit}
                        onRemove={handleRemove}
                      />
                    ))}
                    <TouchableOpacity
                      style={[s.addBtn, { borderColor: colors.border }]}
                      onPress={handleAddManual}
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name="add-circle-outline"
                        size={18}
                        color={colors.primary}
                      />
                      <Text style={[s.addBtnTxt, { color: colors.primary }]}>
                        Add task
                      </Text>
                    </TouchableOpacity>
                  </ScrollView>
                ) : (
                  <View style={s.noTasks}>
                    <Ionicons
                      name="document-text-outline"
                      size={48}
                      color={colors.mutedLight}
                    />
                    <Text style={[s.noTasksSub, { color: colors.muted }]}>
                      Try a different description,{'\n'}e.g. "Visit the bank at 9am"
                    </Text>
                    <TouchableOpacity
                      style={[s.retryBtn, { backgroundColor: colors.primary }]}
                      onPress={handleBackToInput}
                      activeOpacity={0.85}
                    >
                      <Ionicons name="arrow-back" size={16} color="#FFFFFF" />
                      <Text style={s.retryBtnTxt}>Go Back</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {parsedTasks.length > 0 && (
                  <View style={s.btnRow}>
                    <TouchableOpacity
                      style={[
                        s.btn,
                        s.btnCancel,
                        {
                          borderColor: colors.border,
                          backgroundColor: colors.highlight,
                        },
                      ]}
                      onPress={handleBackToInput}
                      activeOpacity={0.7}
                    >
                      <Text style={[s.btnCancelTxt, { color: colors.muted }]}>
                        Back
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        s.btn,
                        s.btnSave,
                        { backgroundColor: colors.primary },
                      ]}
                      onPress={handleSave}
                      activeOpacity={0.85}
                    >
                      <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                      <Text style={s.btnSaveTxt}>Save All</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}

            {step === "editing" && editIndex !== null && (
              <ScrollView
                style={s.editScroll}
                contentContainerStyle={s.editScrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                <Text style={[s.heading, { color: colors.text }]}>
                  Edit Task
                </Text>

                <Text style={[s.fieldLabel, { color: colors.muted }]}>
                  Task
                </Text>
                <TextInput
                  style={[
                    s.editInput,
                    {
                      color: colors.text,
                      backgroundColor: colors.highlight,
                      borderColor: colors.border,
                    },
                  ]}
                  value={editTitle}
                  onChangeText={setEditTitle}
                  placeholder="What do you need to do?"
                  placeholderTextColor={colors.mutedLight}
                />

                <Text
                  style={[s.fieldLabel, { color: colors.muted, marginTop: 14 }]}
                >
                  Time (optional)
                </Text>
                <TextInput
                  style={[
                    s.editInput,
                    {
                      color: colors.text,
                      backgroundColor: colors.highlight,
                      borderColor: colors.border,
                    },
                  ]}
                  value={editTime}
                  onChangeText={setEditTime}
                  placeholder='e.g. "9:00 AM"'
                  placeholderTextColor={colors.mutedLight}
                />

                <View style={s.editBtnRow}>
                  <TouchableOpacity
                    style={[s.editBtn, { borderColor: colors.danger }]}
                    onPress={() => {
                      handleRemove(editIndex);
                      handleEditCancel();
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={[s.editBtnDangerTxt, { color: colors.danger }]}>
                      Remove Task
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={s.btnRow}>
                  <TouchableOpacity
                    style={[
                      s.btn,
                      s.btnCancel,
                      {
                        borderColor: colors.border,
                        backgroundColor: colors.highlight,
                      },
                    ]}
                    onPress={handleEditCancel}
                    activeOpacity={0.7}
                  >
                    <Text style={[s.btnCancelTxt, { color: colors.muted }]}>
                      Cancel
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      s.btn,
                      s.btnSave,
                      { backgroundColor: colors.primary },
                    ]}
                    onPress={handleEditSave}
                    activeOpacity={0.85}
                  >
                    <Text style={s.btnSaveTxt}>Save</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}

            {showSuccess && (
              <Animated.View
                style={[
                  s.successOverlay,
                  { backgroundColor: colors.card, opacity: successOpacity },
                ]}
                pointerEvents="none"
              >
                <View
                  style={[s.successCircle, { backgroundColor: colors.success }]}
                >
                  <Ionicons name="checkmark" size={36} color="#FFFFFF" />
                </View>
                <Text style={[s.successTxt, { color: colors.text }]}>
                  {savedCount} Task{savedCount !== 1 ? "s" : ""} Added
                </Text>
              </Animated.View>
            )}
          </SafeAreaView>
        </KeyboardAvoidingView>
      </TouchableOpacity>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  keyboard: {
    flex: 1,
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderTopWidth: 1,
    padding: 22,
    paddingBottom: 40,
    maxHeight: "85%",
  },
  handle: {
    width: 38,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 18,
  },
  content: {
    alignItems: "center",
  },
  micEmoji: {
    fontSize: 28,
    marginBottom: 6,
  },
  heading: {
    fontSize: 19,
    fontWeight: "800",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 16,
  },
  comingSoon: {
    fontSize: 11,
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: 2,
    marginBottom: 2,
  },
  inputWrap: {
    width: "100%",
    borderRadius: 14,
    borderWidth: 1.5,
    padding: 4,
    marginBottom: 16,
  },
  input: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "500",
    minHeight: 100,
    maxHeight: 160,
    padding: 12,
  },
  generateBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 14,
    width: "100%",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  generateBtnTxt: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  btnRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
    width: "100%",
  },
  btn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  btnCancel: {},
  btnCancelTxt: { fontSize: 14, fontWeight: "700" },
  btnSave: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 0,
  },
  btnSaveTxt: { fontSize: 14, fontWeight: "700", color: "#FFFFFF" },
  foundBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
  },
  foundTxt: {
    fontSize: 16,
    fontWeight: "700",
  },
  taskList: {
    width: "100%",
    maxHeight: 280,
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderStyle: "dashed",
    width: "100%",
    marginBottom: 4,
  },
  addBtnTxt: {
    fontSize: 13,
    fontWeight: "600",
  },
  noTasks: {
    alignItems: "center",
    paddingVertical: 24,
    gap: 12,
  },
  noTasksSub: {
    fontSize: 13,
    textAlign: "center",
    lineHeight: 20,
  },
  retryBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  retryBtnTxt: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 6,
    alignSelf: "flex-start",
  },
  editBtnRow: {
    width: "100%",
    marginTop: 16,
  },
  editBtn: {
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  editBtnDangerTxt: { fontSize: 14, fontWeight: "700" },
  editScroll: {
    width: "100%",
  },
  editScrollContent: {
    alignItems: "center",
  },
  editInput: {
    width: "100%",
    fontSize: 15,
    fontWeight: "500",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  successOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    zIndex: 100,
  },
  successCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  successTxt: {
    fontSize: 18,
    fontWeight: "800",
  },
});
