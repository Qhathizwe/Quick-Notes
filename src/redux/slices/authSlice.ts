import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { StoredUser, User } from "@/types/User";

const USERS_KEY = "nota_users";
const SESSION_KEY = "nota_session";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

interface RegisterInput {
  username: string;
  email: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

interface UpdateProfileInput {
  username: string;
  email: string;
  password?: string;
}

const initialState: AuthState = {
  user: null,
  isLoading: true,
  error: null,
};

// Get registered users
const getStoredUsers = async (): Promise<StoredUser[]> => {
  const data = await AsyncStorage.getItem(USERS_KEY);

  return data ? JSON.parse(data) : [];
};

// Save registered users
const saveStoredUsers = async (users: StoredUser[]) => {
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// Remove password before putting a user into Redux state
const getPublicUser = (user: StoredUser): User => {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
  };
};

// Restore the active session when the app opens
export const initializeAuth = createAsyncThunk(
  "auth/initialize",
  async () => {
    const userId = await AsyncStorage.getItem(SESSION_KEY);

    if (!userId) {
      return null;
    }

    const users = await getStoredUsers();

    const user = users.find(item => item.id === userId);

    return user ? getPublicUser(user) : null;
  }
);

// Register a new user
export const registerUser = createAsyncThunk(
  "auth/register",
  async (input: RegisterInput, { rejectWithValue }) => {
    try {
      const users = await getStoredUsers();

      const emailExists = users.some(
        user => user.email.toLowerCase() === input.email.toLowerCase()
      );

      if (emailExists) {
        return rejectWithValue("This email is already registered.");
      }

      const newUser: StoredUser = {
        id: Date.now().toString(),
        username: input.username.trim(),
        email: input.email.trim().toLowerCase(),
        password: input.password,
      };

      users.push(newUser);

      await saveStoredUsers(users);

      await AsyncStorage.setItem(SESSION_KEY, newUser.id);

      return getPublicUser(newUser);
    } catch {
      return rejectWithValue("Registration failed. Please try again.");
    }
  }
);

// Login an existing user
export const loginUser = createAsyncThunk(
  "auth/login",
  async (input: LoginInput, { rejectWithValue }) => {
    try {
      const users = await getStoredUsers();

      const user = users.find(
        item =>
          item.email.toLowerCase() === input.email.trim().toLowerCase() &&
          item.password === input.password
      );

      if (!user) {
        return rejectWithValue("Incorrect email or password.");
      }

      await AsyncStorage.setItem(SESSION_KEY, user.id);

      return getPublicUser(user);
    } catch {
      return rejectWithValue("Login failed. Please try again.");
    }
  }
);

// Logout the current user
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async () => {
    await AsyncStorage.removeItem(SESSION_KEY);
  }
);

// Update username, email or password
export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (input: UpdateProfileInput, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: AuthState };
      const currentUser = state.auth.user;

      if (!currentUser) {
        return rejectWithValue("You are not logged in.");
      }

      const users = await getStoredUsers();

      const emailExists = users.some(
        user =>
          user.email.toLowerCase() === input.email.trim().toLowerCase() &&
          user.id !== currentUser.id
      );

      if (emailExists) {
        return rejectWithValue("This email is already in use.");
      }

      const updatedUsers = users.map(user => {
        if (user.id !== currentUser.id) {
          return user;
        }

        return {
          ...user,
          username: input.username.trim(),
          email: input.email.trim().toLowerCase(),
          password: input.password?.trim() || user.password,
        };
      });

      await saveStoredUsers(updatedUsers);

      const updatedUser = updatedUsers.find(
        user => user.id === currentUser.id
      );

      if (!updatedUser) {
        return rejectWithValue("User could not be updated.");
      }

      return getPublicUser(updatedUser);
    } catch {
      return rejectWithValue("Profile update failed.");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    clearAuthError: state => {
      state.error = null;
    },
  },

  extraReducers: builder => {
    builder
      .addCase(initializeAuth.pending, state => {
        state.isLoading = true;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(initializeAuth.rejected, state => {
        state.isLoading = false;
        state.user = null;
      })

      .addCase(registerUser.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(loginUser.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(logoutUser.fulfilled, state => {
        state.user = null;
        state.error = null;
        state.isLoading = false;
      })

      .addCase(updateProfile.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearAuthError } = authSlice.actions;

export default authSlice.reducer;