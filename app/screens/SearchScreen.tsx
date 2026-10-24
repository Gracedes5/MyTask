// screens/SearchScreen.tsx
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SearchScreenStyles as s } from "../../constants/styles";
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

