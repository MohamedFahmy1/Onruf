import axios from "axios"
import { useRouter } from "next/router"
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { pathOr } from "ramda"
import t from "../../../../translations.json"
import SimpleSnackbar from "../../../../common/SnackBar"
import { handleFormErrors } from "../../../../common/functions"
import { toast } from "react-toastify"
import { useSelector } from "react-redux"

const AddShippingOption = ({ setAddConditionModal, fetchShippingOptions }) => {
  const [image, setImage] = useState(null)
  const buisnessAccountId = useSelector((state) => state.authSlice.buisnessId)

  // Next Router
  const router = useRouter()
  const { locale } = useRouter()

  // Handle Shipping Option Form using useForm Hook
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm()

  // Handle Add Shipping Option
  const handleAddShippingOption = async (values) => {
    try {
      const formData = new FormData()
      for (const key in values) {
        formData.append(key, values[key])
      }
      formData.append("file", image)
      formData.append("BusinessAccountId", buisnessAccountId)
      formData.append("ShippingOptionTypeId", 1)
      formData.append("ShippingOptionImage", image)
      const result = await axios.post("/AddEditShippingOptions", formData)
      setAddConditionModal(false)
      fetchShippingOptions()
      router.push({ pathname: "/settings/shipping" })
      toast.success("Shipping Option Added!")
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }

  return (
    <div className="body-content">
      <div>
        <div className="d-flex align-items-center justify-content-between mb-4 gap-2 flex-wrap">
          <h6 className="f-b m-0"> {pathOr("", [locale, "Shipping", "addShippingOpt"], t)}</h6>
        </div>
        <div className="contint_paner">
          <div className="form-content">
            <form encType="multipart/form-data" onSubmit={handleSubmit(handleAddShippingOption)}>
              <div className="form-group">
                <label>{pathOr("", [locale, "Shipping", "shippingOptionNameAr"], t)}</label>
                <input
                  {...register("ShippingOptionNameAr", { required: "This field is required" })}
                  className="form-control"
                />
                <p className="errorMsg">{handleFormErrors(errors, "ShippingOptionNameAr")}</p>
              </div>
              <div className="form-group">
                <label>{pathOr("", [locale, "Shipping", "shippingOptionNameEn"], t)}</label>
                <input
                  {...register("ShippingOptionNameEn", { required: "This field is required" })}
                  className="form-control"
                />
                <p className="errorMsg">{handleFormErrors(errors, "ShippingOptionNameEn")}</p>
              </div>
              <div className="form-group">
                <label>{pathOr("", [locale, "Shipping", "shippingOptionDescAr"], t)}</label>
                <input
                  {...register("ShippingOptionDescriptionAr", { required: "This field is required" })}
                  className="form-control"
                />
                <p className="errorMsg">{handleFormErrors(errors, "ShippingOptionDescriptionAr")}</p>
              </div>
              <div className="form-group">
                <label>{pathOr("", [locale, "Shipping", "shippingOptionDescEn"], t)}</label>
                <input
                  type={"text"}
                  {...register("ShippingOptionDescriptionEn", { required: "This field is required" })}
                  className="form-control"
                />
                <p className="errorMsg">{handleFormErrors(errors, "ShippingOptionDescriptionEn")}</p>
              </div>
              <div className="form-group">
                <label style={{ display: "block" }}>{pathOr("", [locale, "Shipping", "image"], t)}</label>
                <input
                  type={"file"}
                  accept={"image/*"}
                  {...register("image", { required: "Image is required" })}
                  onChange={(e) => {
                    setImage(e.target.files[0])
                  }}
                />
                <p className="errorMsg">{handleFormErrors(errors, "image")}</p>
              </div>
              <button className="btn-main mt-3" type="submit">
                {pathOr("", [locale, "Products", "save"], t)}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddShippingOption
