import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  ActivityIndicator,
} from "react-native";

import { router } from "expo-router";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchNotes } from "@/redux/slices/noteSlice";

import NoteCard from "@/components/NoteCard";
import CustomButton from "@/components/CustomButton";

import { CATEGORIES } from "@/constants/categories";
import { COLORS } from "@/constants/theme";
import { NoteCategory } from "@/types/Note";

export default function DashboardScreen() {
  const dispatch = useAppDispatch();

  const user = useAppSelector(state => state.auth.user);

  const { notes, isLoading } = useAppSelector(
    state => state.notes
  );

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<"All" | NoteCategory>("All");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");

  useEffect(() => {
    if (user) {
      dispatch(fetchNotes(user.id));
    }
  }, [dispatch, user?.id]);

  const filteredNotes = useMemo(() => {
    const words = search
      .toLowerCase()
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    return [...notes]
      .filter(note => {
        const text = `${note.title} ${note.content}`.toLowerCase();

        const matchesSearch = words.every(word =>
          text.includes(word)
        );

        const matchesCategory =
          category === "All" || note.category === category;

        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        const firstDate = new Date(a.createdAt).getTime();
        const secondDate = new Date(b.createdAt).getTime();

        return sort === "newest"
          ? secondDate - firstDate
          : firstDate - secondDate;
      });
  }, [notes, search, category, sort]);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>Nota.</Text>
            <Text style={styles.greeting}>
              Hello, {user?.username || "there"}!
            </Text>
            <Text style={styles.subtitle}>
              What would you like to write today?
            </Text>
          </View>

          <Pressable
            style={styles.profileButton}
            onPress={() => router.push("/(protected)/profile")}
          >
            <Text style={styles.profileInitial}>
              {user?.username?.charAt(0).toUpperCase()}
            </Text>
          </Pressable>
        </View>

        <CustomButton
          title="+ Create a new note"
          onPress={() => router.push("/(protected)/add-note")}
        />

        <View style={styles.summary}>
          <Text style={styles.summaryNumber}>
            {notes.length}
          </Text>
          <Text style={styles.summaryText}>
            {notes.length === 1 ? "Note saved" : "Notes saved"}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Search your notes</Text>

        <TextInput
          style={styles.search}
          placeholder="Search title or content..."
          placeholderTextColor={COLORS.muted}
          value={search}
          onChangeText={setSearch}
        />

        <Text style={styles.sectionTitle}>Categories</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categories}
        >
          <Pressable
            onPress={() => setCategory("All")}
            style={[
              styles.categoryButton,
              category === "All" && styles.activeCategory,
            ]}
          >
            <Text
              style={[
                styles.categoryText,
                category === "All" && styles.activeCategoryText,
              ]}
            >
              All
            </Text>
          </Pressable>

          {CATEGORIES.map(item => (
            <Pressable
              key={item.name}
              onPress={() => setCategory(item.name)}
              style={[
                styles.categoryButton,
                category === item.name && styles.activeCategory,
              ]}
            >
              <Text
                style={[
                  styles.categoryText,
                  category === item.name && styles.activeCategoryText,
                ]}
              >
                {item.name}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.notesHeader}>
          <Text style={styles.sectionTitle}>Your notes</Text>

          <Pressable
            onPress={() =>
              setSort(current =>
                current === "newest" ? "oldest" : "newest"
              )
            }
          >
            <Text style={styles.sortText}>
              {sort === "newest" ? "Newest ↓" : "Oldest ↑"}
            </Text>
          </Pressable>
        </View>

        {isLoading ? (
          <ActivityIndicator
            size="large"
            color={COLORS.primary}
            style={styles.loader}
          />
        ) : filteredNotes.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>
              {search || category !== "All"
                ? "No matching notes"
                : "No notes yet"}
            </Text>

            <Text style={styles.emptyText}>
              {search || category !== "All"
                ? "Try another search or category."
                : "Create your first note to get started."}
            </Text>
          </View>
        ) : (
          filteredNotes.map(note => (
            <NoteCard
              key={note.id}
              note={note}
              onPress={() =>
                router.push({
                  pathname: "/(protected)/edit-note",
                  params: { id: note.id },
                })
              }
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    padding: 20,
    paddingTop: 55,
    paddingBottom: 40,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },

  logo: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.primary,
  },

  greeting: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.text,
    marginTop: 12,
  },

  subtitle: {
    fontSize: 13,
    color: COLORS.secondaryText,
    marginTop: 5,
  },

  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  profileInitial: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: "700",
  },

  summary: {
    backgroundColor: COLORS.surface,
    padding: 20,
    borderRadius: 16,
    marginTop: 18,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  summaryNumber: {
    fontSize: 30,
    fontWeight: "800",
    color: COLORS.primary,
  },

  summaryText: {
    fontSize: 13,
    color: COLORS.secondaryText,
    marginTop: 4,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 12,
  },

  search: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 24,
    color: COLORS.text,
  },

  categories: {
    gap: 8,
    paddingBottom: 20,
  },

  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  activeCategory: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  categoryText: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: "600",
  },

  activeCategoryText: {
    color: COLORS.white,
  },

  notesHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
    marginBottom: 12,
  },

  sortText: {
    color: COLORS.primary,
    fontWeight: "600",
    fontSize: 13,
  },

  loader: {
    marginTop: 30,
  },

  emptyState: {
    backgroundColor: COLORS.surface,
    padding: 30,
    borderRadius: 16,
    alignItems: "center",
  },

  emptyTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 8,
  },

  emptyText: {
    color: COLORS.secondaryText,
    fontSize: 13,
    textAlign: "center",
  },
});