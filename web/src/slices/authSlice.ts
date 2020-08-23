/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const authInitialState = {
  token: localStorage.getItem('x-auth') || null,
  tokenExpired: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState: authInitialState,
  reducers: {
    addToken: (state, action: PayloadAction<{ token: string }>) => {
      state.token = action.payload.token;
    },
    removeToken: (state) => {
      state.token = null;
    },
    expireToken: (state) => {
      state.token = null;
      state.tokenExpired = true;
    },
  },
});

export const { addToken, removeToken, expireToken } = authSlice.actions;
export default authSlice.reducer;
