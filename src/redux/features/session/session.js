import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isActive: false,
  sessionData: {},
  retry: 0,
  isLoading: false,
  error: null,
};

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    setLoading: (state) => {
      state.isLoading = true;
    },
    removeLoading: (state) => {
        state.isLoading = false;
      },
    setSessionData: (state, action) => {
      state.isLoading = false;
      state.isActive = true;
      state.sessionData = action.payload;
    },
    removeSession: (state, action) => {
      state.isLoading = false;
      state.sessionData = {};
      state.isActive = false;
    },
    incRetry: (state) => {
      state.retry = state.retry + 1;
    },
    resetRetry: (state) => {
      state.retry = 0;
    },
    setError: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const {
  setLoading,
  removeLoading,
  setSessionData,
  removeSession,
  incRetry,
  resetRetry,
  setError,
} = sessionSlice.actions;

export default sessionSlice.reducer;
