import { createSlice } from '@reduxjs/toolkit'
import { getProductById , getProductPack } from './productActions'

export const productSlice = createSlice({
  name: 'data',
  initialState: { data: {}, status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProductById.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.data = action.payload;
      })
  }
})

export default productSlice.reducer

