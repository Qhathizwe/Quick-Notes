import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Pressable,
  Alert,
} from "react-native";

import { router, useLocalSearchParams } from "expo-router";

import CustomButton from "@/components/CustomButton";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  updateNote,
  deleteNote,
} from "@/redux/slices/noteSlice";

import { CATEGORIES } from "@/constants/categories";
import { COLORS } from "@/constants/theme";
import { NoteCategory } from "@/types/Note";

export default function EditNoteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const dispatch = useAppDispatch();

  const user = useAppSelector(state => state.auth.user);

  const notes = useAppSelector(state => state.notes.notes);

  const isLoading = useAppSelector(
    state => state.notes.isLoading
  );

  const note = notes.find(
    item => item.id === id && item.userId === user?.id
  );

  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [category, setCategory] = useState<NoteCategory>(
    note?.category || "Personal"
  );

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setCategory(note.category);
    }
  }, [note?.id]);

  if (!note) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.heading}>Note not found</Text>

        <CustomButton
          title="Go Back"
          onPress={() => router.back()}
        />
      </View>
    );
  }

  const handleUpdate = async () => {
    if (!content.trim()) {
      Alert.alert("Missing content", "Your note cannot be empty.");
      return;
    }

    if (!user) return;

    try {
      await dispatch(
        updateNote({
          id: note.id,
          userId: user.id,
          title,
          content,
          category,
        })
      ).unwrap();

      Alert.alert("Success", "Your note has been updated.");

      router.back();
    } catch (error) {
      Alert.alert("Error", String(error));
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete note",
      "Are you sure you want to delete this note?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            if (!user) return;

            try {
              await dispatch(
                deleteNote({
                  id: note.id,
                  userId: user.id,
                })
              ).unwrap();

              router.back();
            } catch (error) {
              Alert.alert("Error", String(error));
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Pressable onPress={() => router.back()}>
        <Text style={styles.back}>← Back to notes</Text>
      </Pressable>

      <Text style={styles.heading}>Edit note</Text>

      <Text style={styles.label}>Title</Text>

      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Note title"
        placeholderTextColor={COLORS.muted}
      />

      <Text style={styles.label}>Category</Text>

      <View style={styles.categories}>
        {CATEGORIES.map(item => (
          <Pressable
            key={item.name}
            onPress={() => setCategory(item.name)}
            style={[
              styles.categoryButton,
              {
                backgroundColor:
                  category === item.name
                    ? item.backgroundColor
                    : COLORS.surface,
                borderColor:
                  category === item.name
                    ? item.color
                    : COLORS.border,
              },
            ]}
          >
            <Text
              style={{
                color: item.color,
                fontWeight: "600",
              }}
            >
              {item.name}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>Content</Text>

      <TextInput
        style={styles.textArea}
        multiline
        textAlignVertical="top"
        value={content}
        onChangeText={setContent}
        placeholder="Write your note..."
        placeholderTextColor={COLORS.muted}
      />

      <Text style={styles.date}>
        Created: {new Date(note.createdAt).toLocaleString()}
      </Text>

      {note.updatedAt && (
        <Text style={styles.date}>
          Last updated: {new Date(note.updatedAt).toLocaleString()}
        </Text>
      )}

      <CustomButton
        title="Save Changes"
        onPress={handleUpdate}
        loading={isLoading}
      />

      <CustomButton
        title="Delete Note"
        onPress={handleDelete}
        variant="danger"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    padding: 22,
    paddingTop: 55,
    paddingBottom: 40,
  },

  notFound: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: COLORS.background,
  },

  back: {
    color: COLORS.primary,
    fontWeight: "600",
    marginBottom: 28,
  },

  heading: {
    fontSize: 27,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 20,
  },

  label: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
    marginTop: 15,
    marginBottom: 9,
  },

  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 15,
    color: COLORS.text,
  },

  categories: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 9,
  },

  categoryButton: {
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },

  textArea: {
    minHeight: 200,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 15,
    color: COLORS.text,
    fontSize: 15,
  },

  date: {
    color: COLORS.secondaryText,
    fontSize: 12,
    marginTop: 12,
  },
});