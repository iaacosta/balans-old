/* eslint-disable no-param-reassign */
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer, { authInitialState } from '../slices/authSlice';
import themeReducer, { themeInitialState } from '../slices/themeSlice';

export type AppState = {
  auth: typeof authInitialState;
  theme: typeof themeInitialState;
};

export const store = configureStore({
  reducer: combineReducers({
    auth: authReducer,
    theme: themeReducer,
  }),
});
