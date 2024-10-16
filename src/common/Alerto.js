import { toast } from "react-toastify"

const Alerto = (e) => {
  if (e?.response?.data?.message) {
    return toast.error(e?.response?.data?.message)
  }

  let obj = e?.response?.data?.errors
  if (e.response) {
    if (e.response.data) {
      if (!obj) {
        toast.error(e?.response?.data?.Message)
      } else if (Object?.keys(obj)?.length > 0) {
        Object.keys(obj).forEach((ele) => {
          toast.error(obj[ele][0])
        })
      } else {
        toast.error(e.response.data.title)
      }
    }
  } else {
    toast.error("!Oops something went wrong")
  }
}
export default Alerto
