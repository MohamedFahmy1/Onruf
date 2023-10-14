import { createSlice } from '@reduxjs/toolkit'
import { getFolderList } from './productActions'

const productFoldersSlice = createSlice({
    name: 'folders',
    initialState: { users: [], status: 'idle', error: null },
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(getFolderList.fulfilled, (state, action) => {
          state.status = 'succeeded'
          state.folder = action.payload
        })
    }
  })

  export default productFoldersSlice.reducer