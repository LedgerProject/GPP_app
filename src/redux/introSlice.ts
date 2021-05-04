// Redux import
import { createSlice } from '@reduxjs/toolkit';

export const sliceIntro = createSlice({
  name: 'intro',
  initialState: {
    value: '',
  },
  reducers: {
    manageIntro: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { manageIntro } = sliceIntro.actions;

export const selectIntro = state => state.intro.value;

export default sliceIntro.reducer;
