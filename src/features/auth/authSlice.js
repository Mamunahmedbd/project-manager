import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accessToken: undefined,
  user: undefined,
  search: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userLoggedIn: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
    },
    userLoggedOut: (state) => {
      state.accessToken = undefined;
      state.user = undefined;
    },
    searchValue: (state, action) => {
      state.search = action.payload;
    },
  },
});

export const { userLoggedIn, userLoggedOut, searchValue } = authSlice.actions;
export default authSlice.reducer;
