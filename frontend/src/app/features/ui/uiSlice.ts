import { createSlice } from "@reduxjs/toolkit";

type UiState = {
  sidebarOpen: boolean;
};

const initialState: UiState = {
  sidebarOpen: true
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setSidebarOpen(state, action: { payload: boolean }) {
      state.sidebarOpen = action.payload;
    }
  }
});

export const { setSidebarOpen } = uiSlice.actions;
export const uiReducer = uiSlice.reducer;

