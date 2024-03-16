import { configureStore } from "@reduxjs/toolkit"
import productSlice from "./product/productSlice"
import productPack from "./product/productPackSlice"
import productCategory from "./product/productCategory"
import foldersSlice from "./product/foldersSlice"
import allProducts from "./product/allProducts"
import authSlice from "./personalData/AuthSlice"
// import { idReducer } from "./deviceId/reducer"

export const store = configureStore({
  reducer: {
    product: productSlice,
    productPack,
    productCategory,
    foldersSlice,
    allProducts,
    authSlice,
    // id: idReducer,
  },
})
