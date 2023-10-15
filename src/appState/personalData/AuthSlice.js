import { createSlice } from "@reduxjs/toolkit"
import { getTokensFromCookie } from "./authActions"

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token:
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhbmRyZWQiLCJ1c2VyX2lkIjoiMDI5YWNmZGMtOTQyOS00M2RhLTgzYTctNTJhYTQ5NzZjZDY2IiwidHlwZV91c2VyIjoiMiIsImV4cCI6MTcwMzgyODk1MSwiaXNzIjoiaHR0cDovL3d3dy5zZWN1cml0eS5vcmciLCJhdWQiOiJodHRwOi8vd3d3LnNlY3VyaXR5Lm9yZyJ9.7nt9Z4fc-Nf1YxS0HAqiWEagY2f3qz1EiesLos6EjBQ",
    providerId: "029acfdc-9429-43da-83a7-52aa4976cd66",
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
      state.token =
        action.payload.token ||
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhbmRyZWQiLCJ1c2VyX2lkIjoiMDI5YWNmZGMtOTQyOS00M2RhLTgzYTctNTJhYTQ5NzZjZDY2IiwidHlwZV91c2VyIjoiMiIsImV4cCI6MTcwMzgyODk1MSwiaXNzIjoiaHR0cDovL3d3dy5zZWN1cml0eS5vcmciLCJhdWQiOiJodHRwOi8vd3d3LnNlY3VyaXR5Lm9yZyJ9.7nt9Z4fc-Nf1YxS0HAqiWEagY2f3qz1EiesLos6EjBQ"
      state.buisnessId = parseInt(action.payload.buisnessAccountId) || 3
      state.providerId = action.payload.providerId || "029acfdc-9429-43da-83a7-52aa4976cd66"
    })
  },
})

export const { setToken, setBuisnessId, setproviderId } = authSlice.actions
export default authSlice.reducer
