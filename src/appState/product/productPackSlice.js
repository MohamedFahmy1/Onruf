import { createSlice } from '@reduxjs/toolkit'
import { getProductPack } from './productActions'

const productPackSlice = createSlice({
    name: 'packs',
    initialState: { users: [], status: 'idle', error: null },
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(getProductPack.fulfilled, (state, action) => {
          state.status = 'succeeded'
          state.users = action.payload
        })
    }
  })

  export default productPackSlice.reducer