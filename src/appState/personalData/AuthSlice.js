import { createSlice } from "@reduxjs/toolkit"
import { getTokensFromCookie } from "./authActions"

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: null,
    providerId: null,
    buisnessId: null,
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload
    },
    setBuisnessId: (state, action) => {
      state.buisnessId = action.payload
    },
    setproviderId: (state, action) => {
      state.providerId = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getTokensFromCookie.fulfilled, (state, action) => {
      state.token = action.payload.token
      state.buisnessId = parseInt(action.payload.buisnessAccountId)
      state.providerId = action.payload.providerId
    })
  },
})

export const { setToken, setBuisnessId, setproviderId } = authSlice.actions
export default authSlice.reducer
