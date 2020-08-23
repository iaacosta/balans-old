/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

export type Theme = 'light' | 'dark';

export const themeInitialState = {
  themeType: (localStorage.getItem('theme') || 'light') as Theme,
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState: themeInitialState,
  reducers: {
    toggleTheme: (state) => {
      state.themeType = state.themeType === 'light' ? 'dark' : 'light';
    },
  },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
