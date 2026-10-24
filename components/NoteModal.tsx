import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Modal,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { NoteModalStyles as s } from "../constants/styles";
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

