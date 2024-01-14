import { createAsyncThunk } from "@reduxjs/toolkit"
import Cookies from "js-cookie"

export const getTokensFromCookie = createAsyncThunk("auth/getTokensFromCookie", async () => {
  const token = Cookies.get("Token")
  const providerId = Cookies.get("ProviderId")
  const buisnessAccountId = Cookies.get("businessAccountId")

  // Remove cookies after getting their values
  // Cookies.remove("Token")
  // Cookies.remove("ProviderId")
  // Cookies.remove("businessAccountId")

  return { token, providerId, buisnessAccountId }
})
