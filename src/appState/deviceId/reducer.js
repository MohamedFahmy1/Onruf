import { createSlice } from "@reduxjs/toolkit"

export const idSlice = createSlice({
  name: "id",
  initialState: { id: null },
  reducers: {
    setId: (state, action) => {
      state.id = action.payload
    },
  },
})

export const { setId } = idSlice.actions

export default idSlice.reducer
