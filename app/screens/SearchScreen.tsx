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
import IconBackground from "../../components/IconBackground";
import { useTasks } from "../context/TaskContext";
import { useTheme } from "../context/ThemeContext";

export default function SearchScreen() {
  const { tasks, toggleDone } = useTasks();
  const { colors, isDark } = useTheme();

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

  const doneTasks = useMemo(
    () => tasks.filter((t) => t.done),
    [tasks],
  );

  const showRecent = !query.trim();
  const showEmpty = !!query.trim() && results.length === 0;
  const showResults = results.length > 0;

  return (
    <IconBackground>
      <SafeAreaView style={[s.safe, { backgroundColor: "transparent" }]}>
      {/* ── Header ── */}
      <View style={s.header}>
        <Text style={[s.title, { color: colors.text }]}>Search</Text>
      </View>

      {/* ── Search bar (Text input requirement) ── */}
      <View
        style={[
          s.bar,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <Ionicons
          name="search-outline"
          size={17}
          color={colors.muted}
          style={{ marginRight: 9 }}
        />
        <TextInput
          style={[s.barInput, { color: colors.text }]}
          value={query}
          onChangeText={setQuery}
          placeholder="Tasks, projects, and more"
          placeholderTextColor={colors.muted}
          selectionColor={colors.primary}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />
        {/* Clear button (Interactive element) */}
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery("")}>
            <Ionicons name="close-circle" size={17} color={colors.muted} />
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
            <Text style={[s.recentHdr, { color: colors.text }]}>
              Quick Filters
            </Text>
            <View
              style={[s.recentDivider, { backgroundColor: colors.border }]}
            />

            <TouchableOpacity
              style={[s.recentRow, { borderBottomColor: colors.highlight }]}
              activeOpacity={0.7}
            >
              <View
                style={[s.recentIcon, { backgroundColor: colors.highlight }]}
              >
                <Ionicons
                  name="calendar-outline"
                  size={17}
                  color={colors.primary}
                />
              </View>
              <Text style={[s.recentLabel, { color: colors.muted }]}>Day</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[s.recentRow, { borderBottomColor: colors.highlight }]}
              activeOpacity={0.7}
            >
              <View
                style={[s.recentIcon, { backgroundColor: colors.highlight }]}
              >
                <Ionicons
                  name="time-outline"
                  size={17}
                  color={colors.primary}
                />
              </View>
              <Text style={[s.recentLabel, { color: colors.muted }]}>Time</Text>
            </TouchableOpacity>
          </View>

          {doneTasks.length > 0 && (
            <View style={s.doneWrap}>
              <Text
                style={[s.doneHdr, { color: isDark ? "#4ADE80" : "#2D6A4F" }]}
              >
                Completed · {doneTasks.length} task
                {doneTasks.length !== 1 ? "s" : ""}
              </Text>
              {doneTasks.map((task) => (
                <View
                  key={task.id}
                  style={[
                    s.doneCard,
                    {
                      backgroundColor: isDark ? "#1A3020" : "#EEF8F0",
                      borderColor: isDark ? "#2D6A4F" : "#C8E6C9",
                    },
                  ]}
                >
                  <View style={s.doneCardBody}>
                    <Text style={[s.doneCardTitle, { color: colors.text }]}>
                      {task.title}
                    </Text>
                    <View style={s.doneChips}>
                      <View
                        style={[
                          s.doneChip,
                          { backgroundColor: isDark ? "#2D6A4F" : "#D4EDDA" },
                        ]}
                      >
                        <Ionicons
                          name="calendar-outline"
                          size={10}
                          color={isDark ? "#4ADE80" : "#2D6A4F"}
                        />
                        <Text
                          style={[
                            s.doneChipTxt,
                            { color: isDark ? "#4ADE80" : "#2D6A4F" },
                          ]}
                        >
                          {task.day}
                        </Text>
                      </View>
                      {task.time ? (
                        <View
                          style={[
                            s.doneChip,
                            { backgroundColor: isDark ? "#2D6A4F" : "#D4EDDA" },
                          ]}
                        >
                          <Ionicons
                            name="time-outline"
                            size={10}
                            color={isDark ? "#4ADE80" : "#2D6A4F"}
                          />
                          <Text
                            style={[
                              s.doneChipTxt,
                              { color: isDark ? "#4ADE80" : "#2D6A4F" },
                            ]}
                          >
                            {task.time}
                          </Text>
                        </View>
                      ) : null}
                    </View>
                  </View>
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color={colors.success}
                  />
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      )}

      {/* ── No results ── */}
      {showEmpty && (
        <View style={s.emptyWrap}>
          <Ionicons name="search-outline" size={52} color={colors.mutedLight} />
          <Text style={[s.emptyTitle, { color: colors.text }]}>
            No tasks found
          </Text>
          <Text style={[s.emptySub, { color: colors.muted }]}>
            Try a different title, day or note
          </Text>
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
            <Text style={[s.resultsHdr, { color: colors.muted }]}>
              {results.length} result{results.length !== 1 ? "s" : ""}
            </Text>
          }
          renderItem={({ item }) => (
            <View
              style={[
                s.card,
                {
                  backgroundColor: isDark ? colors.card : "#F3EFFF",
                  borderColor: isDark ? colors.border : "#D8CCF0",
                },
                item.done && (isDark ? s.cardDoneDark : s.cardDone),
              ]}
            >
              <View
                style={[
                  s.accent,
                  { backgroundColor: colors.primary },
                  item.done && { backgroundColor: colors.success },
                ]}
              />

              {/* Touchable checkbox (Interactive element) */}
              <TouchableOpacity
                style={s.checkbox}
                onPress={() => toggleDone(item.id)}
                activeOpacity={0.7}
              >
                {item.done ? (
                  <Ionicons
                    name="checkmark-circle"
                    size={21}
                    color={colors.success}
                  />
                ) : (
                  <Ionicons
                    name="ellipse-outline"
                    size={21}
                    color={colors.muted}
                  />
                )}
              </TouchableOpacity>

              <View style={s.cardBody}>
                <Text
                  style={[
                    s.cardTitle,
                    { color: colors.text },
                    item.done && s.cardTitleDone,
                  ]}
                >
                  {item.title}
                </Text>
                <View style={s.chips}>
                  <View
                    style={[
                      s.chip,
                      {
                        backgroundColor: colors.highlight,
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    <Ionicons
                      name="calendar-outline"
                      size={10}
                      color={colors.primary}
                    />
                    <Text style={[s.chipTxt, { color: colors.primary }]}>
                      {item.day}
                    </Text>
                  </View>
                  {item.time ? (
                    <View
                      style={[
                        s.chip,
                        {
                          backgroundColor: colors.highlight,
                          borderColor: colors.border,
                        },
                      ]}
                    >
                      <Ionicons
                        name="time-outline"
                        size={10}
                        color={colors.primary}
                      />
                      <Text style={[s.chipTxt, { color: colors.primary }]}>
                        {item.time}
                      </Text>
                    </View>
                  ) : null}
                  {item.done && (
                    <View
                      style={[
                        s.chip,
                        s.chipDone,
                        {
                          backgroundColor: isDark ? "#2D6A4F" : "#D4EDDA",
                          borderColor: isDark ? "#2D6A4F" : "#C8E6C9",
                        },
                      ]}
                    >
                      <Text style={[s.chipDoneTxt, { color: colors.success }]}>
                        Done
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          )}
        />
      )}
      </SafeAreaView>
    </IconBackground>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1 },
  scrollContent: { paddingBottom: 100 },
  header: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 8 },
  title: {
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: -0.4,
  },

  bar: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 18,
    marginBottom: 20,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderWidth: 1,
  },
  barInput: { flex: 1, fontSize: 14, padding: 0 },

  recentWrap: { paddingHorizontal: 20 },
  recentHdr: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 12,
  },
  recentRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
    borderBottomWidth: 1,
  },
  recentIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },
  recentLabel: { flex: 1, fontSize: 14, fontWeight: "500" },
  recentDivider: {
    height: 1,
    marginVertical: 8,
  },

  doneWrap: { paddingHorizontal: 20, marginTop: 24, paddingBottom: 100 },
  doneHdr: {
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: -0.4,
    marginBottom: 14,
  },
  doneCard: {
    borderRadius: 14,
    padding: 14,
    marginBottom: 9,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    shadowColor: "#32C671",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  doneCardBody: { flex: 1, marginRight: 10 },
  doneCardTitle: {
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 21,
  },
  doneChips: { flexDirection: "row", flexWrap: "wrap", gap: 5, marginTop: 6 },
  doneChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: 7,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  doneChipTxt: { fontSize: 10, fontWeight: "600" },

  emptyWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 80,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginTop: 16,
  },
  emptySub: {
    fontSize: 13,
    marginTop: 6,
    textAlign: "center",
    paddingHorizontal: 40,
  },

  list: { paddingHorizontal: 18, paddingBottom: 100 },
  resultsHdr: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 10,
  },

  card: {
    borderRadius: 14,
    padding: 13,
    marginBottom: 9,
    flexDirection: "row",
    alignItems: "flex-start",
    borderWidth: 1,
    overflow: "hidden",
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
  },
  cardDone: {
    backgroundColor: "#EEF8F0",
    borderColor: "#C8E6C9",
    shadowColor: "#32C671",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  cardDoneDark: {
    backgroundColor: "#1A3020",
    borderColor: "#2D6A4F",
    shadowColor: "#4ADE80",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  accent: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    borderRadius: 3,
  },
  checkbox: { marginLeft: 8, marginRight: 10, marginTop: 1 },
  cardBody: { flex: 1 },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 21,
  },
  cardTitleDone: { textDecorationLine: "line-through", color: "#6B9B78" },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 5, marginTop: 6 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: 7,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
  },
  chipTxt: { fontSize: 10, fontWeight: "500" },
  chipDone: {},
  chipDoneTxt: { fontSize: 10, fontWeight: "700" },
});
