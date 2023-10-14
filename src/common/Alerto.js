import { toast } from "react-toastify"

const Alerto = (e) => {
  console.log("🚀 ~ file: Alerto.js:4 ~ Alerto ~ e", e)
  let obj = e?.response?.data?.errors
  if (e.response) {
    console.log("obj",obj)
    if (e.response.data) {
      if (Object?.keys(obj)?.length> 0) {
        Object.keys(obj).forEach((ele) => {
          toast.error(obj[ele][0])
        })
      } else {
        toast.error(e.response.data.title)
      }
    }
  } else {
    toast.error("!Oops")
  }
}
export default Alerto
