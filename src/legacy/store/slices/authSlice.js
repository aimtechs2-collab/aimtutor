import { createSlice } from '@reduxjs/toolkit';
import { getToken, removeToken } from '../../utils/auth';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: true,
  },
  reducers: {
    // Set user data (after login/signup)
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.loading = false;

      // ✅ Save user to localStorage
      if (action.payload) {
        localStorage.setItem('user', JSON.stringify(action.payload));



        // console.log("[AuthSlice → setUser]");
        // console.log("Payload user:", action.payload);
        // console.log("After setUser → isAuthenticated:", state.isAuthenticated);
        // console.log("LocalStorage user:", localStorage.getItem("user"));
        // console.log("Token (localStorage):", localStorage.getItem("accessToken"));

      }
    },

    // Clear user data (on logout)
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;

      // ✅ Remove from localStorage
      localStorage.removeItem('user');
      removeToken();
    },

    // Initialize auth from localStorage

    initializeAuth: (state) => {
      const token = getToken();
      const userStr = localStorage.getItem('user');

      if (token && userStr) {
        try {
          state.user = JSON.parse(userStr);
          state.isAuthenticated = true;
        } catch {
          state.user = null;
          state.isAuthenticated = true; // token still valid
        }
      } else if (token && !userStr) {
        state.user = null;
        state.isAuthenticated = true; // keep token-only sessions valid
      }
      else {
        state.user = null;
        state.isAuthenticated = false;
      }
      state.loading = false;
    },


  },
});

export const { setUser, clearUser, initializeAuth } = authSlice.actions;
export default authSlice.reducer;