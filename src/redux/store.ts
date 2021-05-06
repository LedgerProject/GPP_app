// Redux import
import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import thunk from 'redux-thunk';

// Reducers import
import tokenReducer from './tokenSlice';
import langReducer from './langSlice';
import introReducer from './introSlice';
import emailReducer from './emailSlice';
import privateKeyReducer from './privateKeySlice';
import publicKeyReducer from './publicKeySlice';
import lastLoginEmailReducer from './lastLoginEmailSlice';

// Async Storage import
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  middleware: [thunk],
});

export default store;
