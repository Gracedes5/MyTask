import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { C } from "../constants/theme";

type Props = {
  greeting: string;
  todayName: string;
  total: number;
  doneCount: number;
  priorityLevel: string;
  priorityMsg: string;
  pct: number;
};

export default function GradientHeader({
  greeting,
  todayName,
  total,
  doneCount,
  priorityLevel,
  priorityMsg,
  pct,
}: Props) {
  return (
    <LinearGradient
      colors={["#8B5CF6", "#3B82F6"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={s.card}
    >
      <Text style={s.greeting}>
        {greeting} <Text style={s.wave}>👋</Text>
      </Text>
      <Text style={s.title}>Today</Text>
      <Text style={s.day}>{todayName}</Text>

      <View style={s.divider} />

      <View style={s.statsRow}>
        <View style={s.stat}>
          <Text style={s.statNum}>{total}</Text>
          <Text style={s.statLabel}>Tasks</Text>
        </View>
        <View style={s.statDot} />
        <View style={s.stat}>
          <Text style={s.statNum}>{doneCount}</Text>
          <Text style={s.statLabel}>Done</Text>
        </View>
        <View style={s.statDot} />
        <View style={s.stat}>
          <Text style={s.statNum}>{Math.round(pct)}%</Text>
          <Text style={s.statLabel}>Rate</Text>
        </View>
      </View>

      {total > 0 && (
        <>
          <View style={s.divider} />
          <View style={s.priorityRow}>
            <Ionicons name="flag" size={14} color="rgba(255,255,255,0.8)" />
            <Text style={s.priorityLabel}>{priorityLevel}</Text>
          </View>
          <Text style={s.priorityMsg}>{priorityMsg}</Text>
        </>
      )}
    </LinearGradient>
  );
}

const s = StyleSheet.create({
  card: {
    marginHorizontal: 18,
    borderRadius: 20,
    padding: 20,
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
  },
  greeting: {
    fontSize: 20,
    fontWeight: "700",
    color: "rgba(255,255,255,0.9)",
    marginBottom: 2,
  },
  wave: {
    fontSize: 22,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: C.white,
    letterSpacing: -0.5,
    marginTop: 4,
  },
  day: {
    fontSize: 12,
    fontWeight: "600",
    color: "rgba(255,255,255,0.7)",
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.15)",
    marginVertical: 14,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  stat: {
    flex: 1,
    alignItems: "center",
  },
  statDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  statNum: {
    fontSize: 22,
    fontWeight: "800",
    color: C.white,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "rgba(255,255,255,0.65)",
    marginTop: 2,
  },
  priorityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  priorityLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "rgba(255,255,255,0.8)",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  priorityMsg: {
    fontSize: 13,
    fontWeight: "500",
    color: "rgba(255,255,255,0.7)",
    lineHeight: 18,
  },
});
