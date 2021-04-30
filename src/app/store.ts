import { configureStore } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import thunk from 'redux-thunk';

import tokenReducer from './tokenSlice';
import langReducer from './langSlice';
import introReducer from './introSlice';
import emailReducer from './emailSlice';
import privateKeyReducer from './privateKeySlice';
import publicKeyReducer from './publicKeySlice';
import lastLoginEmailReducer from './lastLoginEmailSlice';

// import userTypeReducer from './userTypeSlice';
const reducers = combineReducers({
  token: tokenReducer,
  lang: langReducer,
  intro: introReducer,
  email: emailReducer,
  privateKey: privateKeyReducer,
  publicKey: publicKeyReducer,
  lastLoginEmail: lastLoginEmailReducer,
});
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};
const persistedReducer = persistReducer(persistConfig, reducers);
const store = configureStore({
  reducer: persistedReducer,
  // devTools: process.env.NODE_ENV !== 'production',
  middleware: [thunk],
});
export default store;
