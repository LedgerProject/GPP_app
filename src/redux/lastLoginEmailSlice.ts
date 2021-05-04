// Redux import
import { createSlice } from '@reduxjs/toolkit';

export const sliceLastLoginEmail = createSlice({
  name: 'lastLoginEmail',
  initialState: {
    value: '',
  },
  reducers: {
    manageLastLoginEmail: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { manageLastLoginEmail } = sliceLastLoginEmail.actions;

export const selectLastLoginEmail = state => state.lastLoginEmail.value;

export default sliceLastLoginEmail.reducer;
