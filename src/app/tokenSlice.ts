import { createSlice } from "@reduxjs/toolkit";

export const slice = createSlice({
  name: "token",
  initialState: {
    value: "",
  },
  reducers: {
    manageToken: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { manageToken } = slice.actions;

export const selectToken = (state) => state.token.value;

export default slice.reducer;
