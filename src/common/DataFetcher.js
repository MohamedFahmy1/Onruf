import axios from "axios"
import Alerto from "./Alerto"

const DataFetcher = async (api) => {
    try {
      const {
        data: { data: data },
      } = await axios(api)
      return data
    } catch (e) {
      Alerto(e)
      return []
    }
  }
  export default DataFetcher