import { createSlice } from '@reduxjs/toolkit'
import { getProductCategory } from './productActions'

const productCategorySlice = createSlice({
    name: 'category',
    initialState: { users: [], status: 'idle', error: null },
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(getProductCategory.fulfilled, (state, action) => {
          state.status = 'succeeded'
          state.users = action.payload
        })
    }
  })

  export default productCategorySlice.reducer