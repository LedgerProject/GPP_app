import { createSlice } from '@reduxjs/toolkit';

export const sliceEmail = createSlice({
  name: 'email',
  initialState: {
    value: '',
  },
  reducers: {
    manageEmail: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { manageEmail } = sliceEmail.actions;

export const selectEmail = state => state.email.value;

export default sliceEmail.reducer;
