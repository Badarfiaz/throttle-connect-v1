import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// ================== Types ==================
export type User = {
  id: string;
  email: string;
  name?: string;
  completed?: boolean;
  marketplace?: {
    completed: boolean;
    [key: string]: any;
  };
  networking?: {
    completed: boolean;
    [key: string]: any;
  };
};

export type UserInput = {
  email: string;
  password: string;
  name?: string;
};

export type AuthState = {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
};

// ================== Initial State ==================
const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
};

// ================== Slice ==================
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.isLoading = false;
    },
    updateUserOnboarding: (
      state,
      action: PayloadAction<{
        pageType: "marketplace" | "networking";
        data: any;
        completed: boolean;
      }>,
    ) => {
      if (state.user) {
        const { pageType, data, completed } = action.payload;
        console.log("payload", action.payload);
        state.user[pageType] = {
          ...data,
          completed,
        };
      }
    },
  },
});

// ================== Exports ==================
export const { logout, clearError, setUser, updateUserOnboarding } =
  authSlice.actions;

export default authSlice.reducer;
