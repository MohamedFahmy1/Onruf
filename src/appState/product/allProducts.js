import { createSlice } from '@reduxjs/toolkit'
import { getProductsList } from './productActions'

const allProducts = createSlice({
    name: 'products',
    initialState: { products: [], status: 'idle', error: null },
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(getProductsList.fulfilled, (state, action) => {
          state.status = 'succeeded'
          state.products = action.payload
        })
    }
  })

  export default allProducts.reducer