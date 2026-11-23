import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { CATEGORIES } from "../constants/categories";
import { COLORS } from "../constants/theme";
import { Note } from "../types/Note";

interface NoteCardProps {
  note: Note;
  onPress: () => void;
}

export default function NoteCard({
  note,
  onPress,
}: NoteCardProps) {
  const category = CATEGORIES.find(
    item => item.name === note.category
  );

  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.title} numberOfLines={1}>
          {note.title || "Untitled Note"}
        </Text>

        <View
          style={[
            styles.category,
            {
              backgroundColor:
                category?.backgroundColor || COLORS.background,
            },
          ]}
        >
          <Text
            style={{
              color: category?.color || COLORS.text,
              fontSize: 11,
              fontWeight: "600",
            }}
          >
            {note.category}
          </Text>
        </View>
      </View>

      <Text style={styles.content} numberOfLines={3}>
        {note.content}
      </Text>

      <View style={styles.bottomRow}>
        <Text style={styles.date}>
          {new Date(note.createdAt).toLocaleDateString()}
        </Text>

        <Text style={styles.editText}>Open note →</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 14,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    gap: 8,
  },

  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
  },

  category: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },

  content: {
    color: COLORS.secondaryText,
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 16,
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  date: {
    fontSize: 12,
    color: COLORS.muted,
  },

  editText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.primary,
  },
});