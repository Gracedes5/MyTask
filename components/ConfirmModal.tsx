import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { C } from "../constants/theme";
import { useTheme } from "../app/context/ThemeContext";

type Props = {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({
  visible,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  destructive = false,
  onConfirm,
  onCancel,
}: Props) {
  const { colors } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <TouchableOpacity
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.6)",
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 24,
        }}
        activeOpacity={1}
        onPress={onCancel}
      >
        <View
          style={{
            width: "100%",
            maxWidth: 340,
            backgroundColor: colors.card,
            borderRadius: 16,
            padding: 20,
            borderWidth: 1,
            borderColor: colors.border,
            shadowColor: "#000",
            shadowOpacity: 0.2,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 8 },
            elevation: 8,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: colors.text,
              marginBottom: 8,
            }}
          >
            {title}
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: colors.muted,
              marginBottom: 20,
              lineHeight: 20,
            }}
          >
            {message}
          </Text>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <TouchableOpacity
              onPress={onCancel}
              activeOpacity={0.8}
              style={{
                flex: 1,
                paddingVertical: 10,
                borderRadius: 10,
                backgroundColor: colors.highlight,
                borderWidth: 1,
                borderColor: colors.border,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: colors.muted, fontWeight: "600" }}>
                {cancelText}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onConfirm}
              activeOpacity={0.8}
              style={{
                flex: 1,
                paddingVertical: 10,
                borderRadius: 10,
                backgroundColor: destructive ? colors.danger || "#DC2626" : colors.primary,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: C.white, fontWeight: "700" }}>
                {confirmText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}
