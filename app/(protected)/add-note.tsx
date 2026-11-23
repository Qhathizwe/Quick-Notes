import { useState } from "react";
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { router } from "expo-router";

import CustomButton from "@/components/CustomButton";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addNote } from "@/redux/slices/noteSlice";

import { CATEGORIES } from "@/constants/categories";
import { COLORS } from "@/constants/theme";
import { NoteCategory } from "@/types/Note";

export default function AddNoteScreen() {
  const dispatch = useAppDispatch();

  const user = useAppSelector(state => state.auth.user);

  const isLoading = useAppSelector(
    state => state.notes.isLoading
  );

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<NoteCategory>("Personal");

  const handleSave = async () => {
    if (!content.trim()) {
      Alert.alert("Missing content", "Please write something first.");
      return;
    }

    if (!user) {
      Alert.alert("Error", "You must be logged in.");
      return;
    }

    try {
      await dispatch(
        addNote({
          userId: user.id,
          title: title.trim(),
          content: content.trim(),
          category,
        })
      ).unwrap();

      router.back();
    } catch (error) {
      Alert.alert("Error", String(error));
    }
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

      <Text style={styles.heading}>Create a note</Text>

      <Text style={styles.subtitle}>
        Write down something worth remembering.
      </Text>

      <Text style={styles.label}>Note title</Text>

      <TextInput
        style={styles.input}
        placeholder="Give your note a title"
        placeholderTextColor={COLORS.muted}
        value={title}
        onChangeText={setTitle}
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

      <Text style={styles.label}>Your note</Text>

      <TextInput
        style={styles.textArea}
        placeholder="Start writing here..."
        placeholderTextColor={COLORS.muted}
        multiline
        textAlignVertical="top"
        value={content}
        onChangeText={setContent}
      />

      <Text style={styles.date}>
        Date: {new Date().toLocaleDateString()}
      </Text>

      <CustomButton
        title="Save Note"
        onPress={handleSave}
        loading={isLoading}
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

  back: {
    color: COLORS.primary,
    fontWeight: "600",
    marginBottom: 28,
  },

  heading: {
    fontSize: 27,
    fontWeight: "800",
    color: COLORS.text,
  },

  subtitle: {
    color: COLORS.secondaryText,
    marginTop: 7,
    marginBottom: 30,
  },

  label: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 9,
    marginTop: 15,
  },

  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 15,
    color: COLORS.text,
    fontSize: 15,
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
    fontSize: 15,
    color: COLORS.text,
  },

  date: {
    fontSize: 12,
    color: COLORS.secondaryText,
    marginVertical: 18,
  },
});