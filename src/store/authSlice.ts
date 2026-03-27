import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getToken, getUser, clearAuth, saveUser, type AuthUser } from "@/lib/auth";

type AuthState = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
};

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: true,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<AuthUser | null>) {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload || !!getToken();
      state.loading = false;
      if (action.payload) saveUser(action.payload);
    },
    clearUser(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      clearAuth();
    },
    initializeAuth(state) {
      const token = getToken();
      const user = getUser();
      if (token && user) {
        state.user = user;
        state.isAuthenticated = true;
      } else if (token && !user) {
        state.user = null;
        state.isAuthenticated = true;
      } else {
        state.user = null;
        state.isAuthenticated = false;
      }
      state.loading = false;
    },
  },
});

export const { setUser, clearUser, initializeAuth } = authSlice.actions;
export default authSlice.reducer;

