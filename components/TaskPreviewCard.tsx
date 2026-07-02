import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../app/context/ThemeContext";
import type { ParsedTask } from "../utils/parseVoiceTasks";

type Props = {
  task: ParsedTask;
  index: number;
  onEdit: (index: number) => void;
  onRemove: (index: number) => void;
};

const EMOJI_MAP: Record<string, string> = {
  bank: "\u{1F3E6}",
  market: "\u{1F6D2}",
  shop: "\u{1F6CD}",
  store: "\u{1F6CD}",
  food: "\u{1F372}",
  eat: "\u{1F372}",
  lunch: "\u{1F372}",
  dinner: "\u{1F372}",
  breakfast: "\u{1F372}",
  gym: "\u{1F3CB}",
  workout: "\u{1F3CB}",
  exercise: "\u{1F3CB}",
  run: "\u{1F3C3}",
  walk: "\u{1F9B6}",
  call: "\u{1F4DE}",
  phone: "\u{1F4DE}",
  meeting: "\u{1F91D}",
  doctor: "\uD83C\uDFE5",
  hospital: "\uD83C\uDFE5",
  dentist: "\uD83D\uDC36",
  school: "\uD83C\uDFEB",
  work: "\u{1F3E2}",
  office: "\u{1F3E2}",
  home: "\u{1F3E0}",
  house: "\u{1F3E0}",
  buy: "\u{1F6D2}",
  pay: "\u{1F4B3}",
  bill: "\u{1F4B3}",
  read: "\u{1F4DA}",
  book: "\u{1F4DA}",
  write: "\u{270D}",
  email: "\u{1F4E7}",
  message: "\u{1F4E7}",
  text: "\u{1F4E7}",
  clean: "\u{1F9F9}",
  laundry: "\u{1F9FA}",
  cook: "\u{1F373}",
  coffee: "\u2615",
};

function getEmoji(title: string): string {
  const lower = title.toLowerCase();
  for (const [key, emoji] of Object.entries(EMOJI_MAP)) {
    if (lower.includes(key)) return emoji;
  }
  return "\u{1F4CB}";
}

export default function TaskPreviewCard({ task, index, onEdit, onRemove }: Props) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        s.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={s.left}>
        <Text style={s.emoji}>{getEmoji(task.title)}</Text>
        <View style={s.info}>
          <Text style={[s.title, { color: colors.text }]} numberOfLines={2}>
            {task.title}
          </Text>
          {task.time ? (
            <Text style={[s.time, { color: colors.muted }]}>
              {"\u23F0"} {task.time}
            </Text>
          ) : null}
        </View>
      </View>

      <View style={s.actions}>
        <TouchableOpacity
          onPress={() => onEdit(index)}
          style={[s.iconBtn, { backgroundColor: colors.highlight }]}
          activeOpacity={0.7}
        >
          <Ionicons name="create-outline" size={16} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onRemove(index)}
          style={[s.iconBtn, { backgroundColor: colors.highlight }]}
          activeOpacity={0.7}
        >
          <Ionicons name="close-outline" size={16} color={colors.danger} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  emoji: {
    fontSize: 24,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
  },
  time: {
    fontSize: 12,
    fontWeight: "500",
  },
  actions: {
    flexDirection: "row",
    gap: 6,
    marginLeft: 10,
  },
  iconBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});
