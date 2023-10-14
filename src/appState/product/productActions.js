import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { headersJson } from '../../../token'


export const getProductById = createAsyncThunk('data/fetch', async (id, locale) => {
 const productData = await axios(`${process.env.REACT_APP_API_URL}/GetProductById?id=${id}&lang=${locale}`)
  return productData.data.data
})


export const getProductPack = createAsyncThunk('packs/fetch', async (id) => {
    const packs =  await axios(`${process.env.REACT_APP_API_URL}/GetPakaById?Pakatid=${id}`)
    return packs
  })

  export const getProductCategory = createAsyncThunk('category/fetch', async (id , locale) => {
    const category =  await axios(`${process.env.REACT_APP_API_URL}/GetCategoryById?id=${id}&lang=${locale}`)
    return category
  })


  export const getProductsList = createAsyncThunk('products/fetch', async (locale) => {
    const products =  await axios(`${process.env.REACT_APP_API_URL}/ListProductByBusinessAccountId?currentPage=1&lang=${locale}`)
    return products.data.data
  })


  export const getFolderList = createAsyncThunk('folders/fetch', async ( locale) => {
    const folders =  await axios(`${process.env.REACT_APP_API_URL}/ListFolder?type=1&pageIndex=1&PageRowsCount=10&lang=${locale}`)
    return folders.data.data
  })