export const NOTE_CATEGORIES = [
  "Work",
  "Study",
  "Personal",
  "Ideas"
] as const;

export type NoteCategory = (typeof NOTE_CATEGORIES)[number];

export interface Note {
  id: string;
  userId: string;
  title: string;
  content: string;
  category: NoteCategory;
  createdAt: string;
  updatedAt: string;
}