// screens/SearchScreen.tsx
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useTasks } from "../context/TaskContext";

const RECENT = [
  { label: "Upcoming", icon: "grid-outline" },
  { label: "Today", icon: "calendar-outline" },
] as const;

export default function SearchScreen() {
  const { tasks, toggleDone } = useTasks();

  // useState for search query (State management requirement)
  const [query, setQuery] = useState("");

  // Derived search results from local task data (Dynamic data display requirement)
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return tasks.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.day.toLowerCase().includes(q),
    );
  }, [query, tasks]);

  const doneTasks = useMemo(() => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - dayOfWeek);
    weekStart.setHours(0, 0, 0, 0);

    return tasks.filter((t) => {
      if (!t.done || !t.completedAt) return false;
      const completed = new Date(t.completedAt);
      return completed >= weekStart;
    });
  }, [tasks]);

  const showRecent = !query.trim();
  const showEmpty = !!query.trim() && results.length === 0;
  const showResults = results.length > 0;

  return (
    <SafeAreaView style={s.safe}>
      {/* ── Header ── */}
      <View style={s.header}>
        <Text style={s.title}>Search</Text>
      </View>

      {/* ── Search bar (Text input requirement) ── */}
      <View style={s.bar}>
        <Ionicons
          name="search-outline"
          size={17}
          color="#6B5A8A"
          style={{ marginRight: 9 }}
        />
        <TextInput
          style={s.barInput}
          value={query}
          onChangeText={setQuery}
          placeholder="Tasks, projects, and more"
          placeholderTextColor="#4A3560"
          selectionColor="#C084FC"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />
        {/* Clear button (Interactive element) */}
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery("")}>
            <Ionicons name="close-circle" size={17} color="#6B5A8A" />
          </TouchableOpacity>
        )}
      </View>

      {/* ── Scrollable content when no search ── */}
      {showRecent && (
        <ScrollView
          contentContainerStyle={s.scrollContent}
          showsVerticalScrollIndicator={true}
        >
          <View style={s.recentWrap}>
            <Text style={s.recentHdr}>Recently visited</Text>
            {RECENT.map((item) => (
              <TouchableOpacity
                key={item.label}
                style={s.recentRow}
                activeOpacity={0.7}
              >
                <View style={s.recentIcon}>
                  <Ionicons name={item.icon as any} size={17} color="#C084FC" />
                </View>
                <Text style={s.recentLabel}>{item.label}</Text>
                <Ionicons name="chevron-forward" size={15} color="#3B1F60" />
              </TouchableOpacity>
            ))}
          </View>

          {doneTasks.length > 0 && (
            <View style={s.doneWrap}>
              <Text style={s.doneHdr}>
                This Week  ·  {doneTasks.length} task{doneTasks.length !== 1 ? "s" : ""}
              </Text>
              {doneTasks.map((task) => (
                <View key={task.id} style={s.doneCard}>
                  <View style={s.doneCardBody}>
                    <Text style={s.doneCardTitle}>{task.title}</Text>
                    <View style={s.doneChips}>
                      <View style={s.doneChip}>
                        <Ionicons name="calendar-outline" size={10} color="#3B1F60" />
                        <Text style={s.doneChipTxt}>{task.day}</Text>
                      </View>
                      {task.time ? (
                        <View style={s.doneChip}>
                          <Ionicons name="time-outline" size={10} color="#3B1F60" />
                          <Text style={s.doneChipTxt}>{task.time}</Text>
                        </View>
                      ) : null}
                    </View>
                  </View>
                  <Ionicons name="checkmark-circle" size={20} color="#3B1F60" />
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      )}

      {/* ── No results ── */}
      {showEmpty && (
        <View style={s.emptyWrap}>
          <Ionicons name="search-outline" size={52} color="#2D1B4E" />
          <Text style={s.emptyTitle}>No tasks found</Text>
          <Text style={s.emptySub}>Try a different title, day or note</Text>
        </View>
      )}

      {/* ── FlatList results (Dynamic data display requirement) ── */}
      {showResults && (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          contentContainerStyle={s.list}
          showsVerticalScrollIndicator={true}
          ListHeaderComponent={
            <Text style={s.resultsHdr}>
              {results.length} result{results.length !== 1 ? "s" : ""}
            </Text>
          }
          renderItem={({ item }) => (
            <View style={[s.card, item.done && s.cardDone]}>
              <View style={s.accent} />

              {/* Touchable checkbox (Interactive element) */}
              <TouchableOpacity
                style={s.checkbox}
                onPress={() => toggleDone(item.id)}
                activeOpacity={0.7}
              >
                {item.done ? (
                  <Ionicons name="checkmark-circle" size={21} color="#C084FC" />
                ) : (
                  <Ionicons name="ellipse-outline" size={21} color="#4A3560" />
                )}
              </TouchableOpacity>

              <View style={s.cardBody}>
                <Text style={[s.cardTitle, item.done && s.cardTitleDone]}>
                  {item.title}
                </Text>
                <View style={s.chips}>
                  <View style={s.chip}>
                    <Ionicons
                      name="calendar-outline"
                      size={10}
                      color="#9D6FCA"
                    />
                    <Text style={s.chipTxt}>{item.day}</Text>
                  </View>
                  {item.time ? (
                    <View style={s.chip}>
                      <Ionicons name="time-outline" size={10} color="#9D6FCA" />
                      <Text style={s.chipTxt}>{item.time}</Text>
                    </View>
                  ) : null}
                  {item.done && (
                    <View style={[s.chip, s.chipDone]}>
                      <Text style={s.chipDoneTxt}>Done</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0D0118" },
  scrollContent: { paddingBottom: 100 },
  header: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 8 },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#EDE9FE",
    letterSpacing: -0.4,
  },

  bar: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 18,
    marginBottom: 20,
    backgroundColor: "#160828",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: "#2D1B4E",
  },
  barInput: { flex: 1, fontSize: 14, color: "#EDE9FE", padding: 0 },

  recentWrap: { paddingHorizontal: 20 },
  recentHdr: {
    fontSize: 13,
    fontWeight: "700",
    color: "#EDE9FE",
    marginBottom: 12,
  },
  recentRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: "#1A0A2E",
  },
  recentIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#2D1B4E",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },
  recentLabel: { flex: 1, fontSize: 14, fontWeight: "500", color: "#C4B5E0" },

  doneWrap: { paddingHorizontal: 20, marginTop: 24, paddingBottom: 100 },
  doneHdr: {
    fontSize: 26,
    fontWeight: "800",
    color: "#C084FC",
    letterSpacing: -0.4,
    marginBottom: 14,
  },
  doneCard: {
    backgroundColor: "#9D6FCA",
    borderRadius: 14,
    padding: 14,
    marginBottom: 9,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#B388D6",
  },
  doneCardBody: { flex: 1, marginRight: 10 },
  doneCardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3B1F60",
    lineHeight: 21,
  },
  doneChips: { flexDirection: "row", flexWrap: "wrap", gap: 5, marginTop: 6 },
  doneChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 7,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  doneChipTxt: { fontSize: 10, color: "#3B1F60", fontWeight: "600" },

  emptyWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 80,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#3B1F60",
    marginTop: 16,
  },
  emptySub: {
    fontSize: 13,
    color: "#2D1B4E",
    marginTop: 6,
    textAlign: "center",
    paddingHorizontal: 40,
  },

  list: { paddingHorizontal: 18, paddingBottom: 100 },
  resultsHdr: {
    fontSize: 10,
    fontWeight: "700",
    color: "#6B5A8A",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 10,
  },

  card: {
    backgroundColor: "#160828",
    borderRadius: 14,
    padding: 13,
    marginBottom: 9,
    flexDirection: "row",
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: "#2D1B4E",
    overflow: "hidden",
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
  },
  cardDone: { opacity: 0.5 },
  accent: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: "#7C3AED",
    borderRadius: 3,
  },
  checkbox: { marginLeft: 8, marginRight: 10, marginTop: 1 },
  cardBody: { flex: 1 },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#EDE9FE",
    lineHeight: 21,
  },
  cardTitleDone: { textDecorationLine: "line-through", color: "#4A3560" },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 5, marginTop: 6 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#1E0A35",
    borderRadius: 7,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: "#2D1B4E",
  },
  chipTxt: { fontSize: 10, color: "#9D6FCA", fontWeight: "500" },
  chipDone: { backgroundColor: "#3B1F60", borderColor: "#5B2D8A" },
  chipDoneTxt: { fontSize: 10, color: "#C084FC", fontWeight: "700" },
});
