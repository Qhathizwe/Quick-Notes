import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  Note,
  CreateNoteInput,
  UpdateNoteInput,
} from "@/types/Note";

const NOTES_KEY = "AmaNote";

interface NoteState {
  notes: Note[];
  isLoading: boolean;
  error: string | null;
}

const initialState: NoteState = {
  notes: [],
  isLoading: false,
  error: null,
};

// Get all notes saved on the device
const getStoredNotes = async (): Promise<Note[]> => {
  const data = await AsyncStorage.getItem(NOTES_KEY);

  return data ? JSON.parse(data) : [];
};

// Save notes to AsyncStorage
const saveStoredNotes = async (notes: Note[]) => {
  await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(notes));
};

// Fetch notes belonging to a particular user
export const fetchNotes = createAsyncThunk(
  "notes/fetch",
  async (userId: string) => {
    const notes = await getStoredNotes();

    return notes.filter(note => note.userId === userId);
  }
);

// Create a note
export const addNote = createAsyncThunk(
  "notes/add",
  async (input: CreateNoteInput, { rejectWithValue }) => {
    try {
      const notes = await getStoredNotes();

      const newNote: Note = {
        id: Date.now().toString(),
        userId: input.userId,
        title: input.title.trim(),
        content: input.content.trim(),
        category: input.category,
        createdAt: new Date().toISOString(),
      };

      const updatedNotes = [...notes, newNote];

      await saveStoredNotes(updatedNotes);

      return newNote;
    } catch {
      return rejectWithValue("Could not save your note.");
    }
  }
);

// Update an existing note
export const updateNote = createAsyncThunk(
  "notes/update",
  async (input: UpdateNoteInput, { rejectWithValue }) => {
    try {
      const notes = await getStoredNotes();

      const noteExists = notes.some(
        note => note.id === input.id && note.userId === input.userId
      );

      if (!noteExists) {
        return rejectWithValue("Note could not be found.");
      }

      const updatedNotes = notes.map(note => {
        if (note.id !== input.id || note.userId !== input.userId) {
          return note;
        }

        return {
          ...note,
          title: input.title.trim(),
          content: input.content.trim(),
          category: input.category,
          updatedAt: new Date().toISOString(),
        };
      });

      await saveStoredNotes(updatedNotes);

      return updatedNotes.find(note => note.id === input.id)!;
    } catch {
      return rejectWithValue("Could not update your note.");
    }
  }
);

// Delete a note
export const deleteNote = createAsyncThunk(
  "notes/delete",
  async (
    input: { id: string; userId: string },
    { rejectWithValue }
  ) => {
    try {
      const notes = await getStoredNotes();

      const noteExists = notes.some(
        note => note.id === input.id && note.userId === input.userId
      );

      if (!noteExists) {
        return rejectWithValue("Note could not be found.");
      }

      const updatedNotes = notes.filter(
        note => !(note.id === input.id && note.userId === input.userId)
      );

      await saveStoredNotes(updatedNotes);

      return input.id;
    } catch {
      return rejectWithValue("Could not delete your note.");
    }
  }
);

const noteSlice = createSlice({
  name: "notes",
  initialState,

  reducers: {
    clearNotes: state => {
      state.notes = [];
      state.error = null;
    },

    clearNoteError: state => {
      state.error = null;
    },
  },

  extraReducers: builder => {
    builder
      .addCase(fetchNotes.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notes = action.payload;
      })
      .addCase(fetchNotes.rejected, state => {
        state.isLoading = false;
        state.error = "Could not load notes.";
      })

      .addCase(addNote.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addNote.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notes.push(action.payload);
      })
      .addCase(addNote.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(updateNote.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateNote.fulfilled, (state, action) => {
        state.isLoading = false;

        const index = state.notes.findIndex(
          note => note.id === action.payload.id
        );

        if (index !== -1) {
          state.notes[index] = action.payload;
        }
      })
      .addCase(updateNote.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(deleteNote.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteNote.fulfilled, (state, action) => {
        state.isLoading = false;

        state.notes = state.notes.filter(
          note => note.id !== action.payload
        );
      })
      .addCase(deleteNote.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearNotes, clearNoteError } = noteSlice.actions;

export default noteSlice.reducer;