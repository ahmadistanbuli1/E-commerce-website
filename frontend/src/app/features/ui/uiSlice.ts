import { createSlice } from "@reduxjs/toolkit";

type UiState = {
  sidebarOpen: boolean;
  cartOpen: boolean;
};

const initialState: UiState = {
  sidebarOpen: true,
  cartOpen: false
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
    }
  }
});

export const { setSidebarOpen, setCartOpen } = uiSlice.actions;
export const uiReducer = uiSlice.reducer;

