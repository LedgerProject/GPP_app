// Redux import
import { createSlice } from '@reduxjs/toolkit';

export const slice = createSlice({
  name: 'lang',
  initialState: {
    value: '',
  },
  reducers: {
    manageLang: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { manageLang } = slice.actions;

export const selectLang = state => state.lang.value;

export default slice.reducer;
