import { createSlice } from '@reduxjs/toolkit';

export const slicePublicKey = createSlice({
  name: 'publicKey',
  initialState: {
    value: '',
  },
  reducers: {
    managePublicKey: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { managePublicKey } = slicePublicKey.actions;

export const selectPublicKey = state => state.publicKey.value;

export default slicePublicKey.reducer;
