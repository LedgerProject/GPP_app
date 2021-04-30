import { createSlice } from '@reduxjs/toolkit';

export const slicePrivateKey = createSlice({
  name: 'privateKey',
  initialState: {
    value: '',
  },
  reducers: {
    managePrivateKey: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { managePrivateKey } = slicePrivateKey.actions;

export const selectPrivateKey = state => state.privateKey.value;

export default slicePrivateKey.reducer;
