// ** Redux Imports
import { createSlice } from "@reduxjs/toolkit";

// ** ThemeConfig Import
import themeConfig from "../../../configs/themeConfig";

const initialMenuCollapsed = () => {
  const item = window.localStorage.getItem("menuCollapsed");
  //** Parse stored json or if none return initialValue
  return item ? JSON.parse(item) : themeConfig.layout.menu.isCollapsed;
};

export const menuCollapsedSlice = createSlice({
  name: "menuCollapsed",
  initialState: {
    menuCollapsed: initialMenuCollapsed()
  },
  reducers: {
    handleMenuCollapsed: (state, action) => {
      state.menuCollapsed = action.payload;
      window.localStorage.setItem(
        "menuCollapsed",
        JSON.stringify(action.payload)
      );
    }
  },
});

export const {
  handleMenuCollapsed
} = menuCollapsedSlice.actions;

export default menuCollapsedSlice.reducer;
