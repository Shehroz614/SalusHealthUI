// ** Redux Imports
import { createSlice } from "@reduxjs/toolkit";

// ** ThemeConfig Import
import themeConfig from "@configs/themeConfig";

const initialSkin = () => {
  const item = window.localStorage.getItem("skin");
  //** Parse stored json or if none return initialValue
  return item ? JSON.parse(item) : themeConfig.layout.skin;
};

export const skinSlice = createSlice({
  name: "skin",
  initialState: {
    skin: initialSkin()
  },
  reducers: {
    handleSkin: (state, action) => {
      state.skin = action.payload;
      window.localStorage.setItem("skin", JSON.stringify(action.payload));
    }
  },
});

export const {
  handleSkin,
} = skinSlice.actions;

export default skinSlice.reducer;
