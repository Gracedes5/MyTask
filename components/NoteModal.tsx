import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { C } from "../constants/theme";
import { useTheme } from "../app/context/ThemeContext";

const MAX = 200;

type Props = {
  visible: boolean;
  initialNote: string;
  taskTitle: string;
  onSave: (note: string) => void;
  onCancel: () => void;
};

export default function NoteModal({
  visible,
  initialNote,
  taskTitle,
  onSave,
  onCancel,
}: Props) {
  const { colors } = useTheme();
  const [note, setNote] = useState(initialNote);

  useEffect(() => {
    if (visible) setNote(initialNote);
  }, [visible, initialNote]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <TouchableOpacity
        style={s.overlay}
        activeOpacity={1}
        onPress={onCancel}
      >
        <SafeAreaView
          style={[
            s.sheet,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={[s.handle, { backgroundColor: colors.mutedLight }]} />
          <Text style={[s.title, { color: colors.text }]}>Task Notes</Text>
          <Text style={[s.sub, { color: colors.muted }]} numberOfLines={1}>
            {taskTitle}
          </Text>

          <TextInput
            style={[
              s.input,
              {
                backgroundColor: colors.bg,
                borderColor: colors.border,
                color: colors.text,
              },
            ]}
            value={note}
            onChangeText={(t) => setNote(t.slice(0, MAX))}
            placeholder="Add a note..."
            placeholderTextColor={colors.muted}
            multiline
            textAlignVertical="top"
            autoFocus
          />

          <Text style={[s.counter, { color: colors.muted }]}>
            {note.length}/{MAX}
          </Text>

          <View style={s.actions}>
            <TouchableOpacity
              style={[
                s.cancelBtn,
                {
                  backgroundColor: colors.highlight,
                  borderColor: colors.border,
                },
              ]}
              onPress={onCancel}
              activeOpacity={0.8}
            >
              <Text style={[s.cancelTxt, { color: colors.muted }]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.saveBtn, { backgroundColor: colors.primary }]}
              onPress={() => onSave(note)}
              activeOpacity={0.8}
            >
              <Ionicons name="checkmark" size={16} color={C.white} />
              <Text style={[s.saveTxt, { color: C.white }]}>Save</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
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
  sheet: {
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderTopWidth: 1,
    padding: 22,
    paddingBottom: 36,
  },
  handle: {
    width: 38,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 18,
  },
  title: {
    fontSize: 19,
    fontWeight: "800",
    marginBottom: 2,
  },
  sub: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    fontWeight: "500",
    minHeight: 120,
    lineHeight: 20,
  },
  counter: {
    fontSize: 11,
    fontWeight: "600",
    textAlign: "right",
    marginTop: 6,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
  },
  cancelTxt: {
    fontSize: 14,
    fontWeight: "700",
  },
  saveBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 13,
    borderRadius: 12,
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  saveTxt: {
    fontSize: 14,
    fontWeight: "700",
  },
});
