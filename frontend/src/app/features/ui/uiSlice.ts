import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Theme } from "../../../lib/theme";
import { getStoredTheme } from "../../../lib/theme";

type UiState = {
  sidebarOpen: boolean;
  cartOpen: boolean;
  theme: Theme;
};

const initialState: UiState = {
  sidebarOpen: true,
  cartOpen: false,
  theme: getStoredTheme()
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setSidebarOpen(state, action: { payload: boolean }) {
      state.sidebarOpen = action.payload;
    },
    setCartOpen(state, action: { payload: boolean }) {
      state.cartOpen = action.payload;
    },
    setTheme(state, action: PayloadAction<Theme>) {
      state.theme = action.payload;
    },
    toggleTheme(state) {
      state.theme = state.theme === "dark" ? "light" : "dark";
    }
  }
});

export const { setSidebarOpen, setCartOpen, setTheme, toggleTheme } = uiSlice.actions;
export const uiReducer = uiSlice.reducer;

