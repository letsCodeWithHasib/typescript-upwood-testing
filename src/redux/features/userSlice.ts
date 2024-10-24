import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    firstName: "",
    lastName: "",
  },
  reducers: {
    setInfo: (state, action) => {
      state.firstName = action?.payload?.firstName;
      state.lastName = action?.payload?.lastName;
    },
    deleteInfo: (state) => {
      state.firstName = "";
      state.lastName = "";
    },
  },
});

// Destructure and export the actions for use in components
export const { setInfo, deleteInfo } = userSlice.actions;

// Export the reducer to be included in the store
export default userSlice.reducer;
