/* eslint-disable no-param-reassign */
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer, { authInitialState } from '../slices/authSlice';

export type AppState = {
  auth: typeof authInitialState;
};

export const store = configureStore({
  reducer: combineReducers({
    auth: authReducer,
  }),
});
