import { createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import { headersJson } from "../../../token"

export const getProductById = createAsyncThunk("data/fetch", async (id, locale) => {
  const productData = await axios(`/GetProductById?id=${id}&lang=${locale}`)
  return productData.data.data
})

export const getProductPack = createAsyncThunk("packs/fetch", async (id) => {
  const packs = await axios(`/GetPakaById?Pakatid=${id}`)
  return packs
})

export const getProductCategory = createAsyncThunk("category/fetch", async (id, locale) => {
  const category = await axios(`/GetCategoryById?id=${id}&lang=${locale}`)
  return category
})

export const getProductsList = createAsyncThunk("products/fetch", async (locale) => {
  const products = await axios(`/ListProductByBusinessAccountId?currentPage=1&lang=${locale}`)
  return products.data.data
})

export const getFolderList = createAsyncThunk("folders/fetch", async (locale) => {
  const folders = await axios(`/ListFolder?type=1&pageIndex=1&PageRowsCount=10&lang=${locale}`)
  return folders.data.data
})
