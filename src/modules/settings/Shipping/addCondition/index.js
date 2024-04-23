import axios from "axios"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { pathOr, product } from "ramda"
import t from "../../../../translations.json"
import SimpleSnackbar from "../../../../common/SnackBar"
import { handleFormErrors } from "../../../../common/functions"
import { Box, Chip, FormControl, MenuItem, OutlinedInput, Select } from "@mui/material"
import { toast } from "react-toastify"

const AddShippingCondition = ({
  fetchShippingOptionConditionsData,
  setAddConditionModal,
  countries: fetchedCountries,
  products,
}) => {
  const router = useRouter()
  const { locale } = useRouter()
  const { id: shippingOptionsId } = router.query
  const [regions, setRegions] = useState([])
  const [selectedProducts, setSelectedProducts] = useState([])

  // Copied Stuff from addCupon
  const ITEM_HEIGHT = 48
  const ITEM_PADDING_TOP = 8
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm()

  // Handle Submit Condition To API
  const handleAddCondition = async ({
    cashOnDeliveryFee,
    measurableType,
    standardAmount,
    standardPrice,
    extraAmount,
    extraAmountFee,
    cashOnDelivery,
    countries,
    cities,
  }) => {
    try {
      // Wait for the API send response
      await axios.post("/AddEditShippingOptionsConditions", {
        shippingOptionsId,
        cashOnDeliveryFee: parseInt(cashOnDeliveryFee),
        measurableType: parseInt(measurableType),
        standardAmount: parseInt(standardAmount),
        standardPrice: parseInt(standardPrice),
        extraAmount: parseInt(extraAmount),
        extraAmountFee: parseInt(extraAmountFee),
        cashOnDelivery,
        countries: [{ countryId: parseInt(countries) }],
        shippingTime: new Date().toISOString(),
        cities: [{ regionId: parseInt(cities) }],
        products: selectedProducts?.map(({ id }) => ({
          productId: id,
        })),
      })

      setAddConditionModal(false)
      toast.success("Condition Added!")
      fetchShippingOptionConditionsData()
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }

  // Fetch region by current country ID
  const fetchRegionsByCountry = async () => {
    const {
      data: { data: regionList },
    } = await axios.get("/ListRegionsByCountryId", {
      params: { currentPage: 1, countriesIds: [watch("countries")], lang: "ar" },
    })
    setRegions(regionList)
  }

  // Do things every re-render and everytime watch("countries") change
  useEffect(() => {
    fetchRegionsByCountry()
  }, [watch("countries")])

  return (
    <div className="body-content">
      <div>
        <div className="d-flex align-items-center justify-content-between mb-4 gap-2 flex-wrap">
          <h6 className="f-b m-0">{pathOr("", [locale, "Shipping", "addCond"], t)}</h6>
        </div>
        <div className="contint_paner">
          <div className="form-content">
            <form onSubmit={handleSubmit(handleAddCondition)}>
              <div className="row">
                <div className="form-group col-md-6">
                  <label>Cash On Delivery</label>
                  <input type={"checkbox"} {...register("cashOnDelivery")} className="form-control" />
                </div>

                <div className="form-group col-md-6">
                  <label>{pathOr("", [locale, "Shipping", "cashOnDeliveryFee"], t)}</label>
                  <input
                    type={"number"}
                    {...register("cashOnDeliveryFee", { required: "This field is required" })}
                    className="form-control"
                  />
                  <p className="errorMsg">{handleFormErrors(errors, "cashOnDeliveryFee")}</p>
                </div>

                <div className="form-group col-md-6">
                  <label>Measurable type</label>
                  <select className="form-control form-select" defaultValue={0} {...register("measurableType")}>
                    <option value={0}>KG</option>
                    <option value={1}>Count</option>
                  </select>
                  <p className="errorMsg">{handleFormErrors(errors, "measurableType")}</p>
                </div>

                <div className="form-group col-md-6">
                  <label>Country</label>
                  <select className="form-control form-select" {...register("countries")}>
                    {fetchedCountries?.map((country) => (
                      <option key={country.id} value={country.id}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="row">
                <div className="form-group col-md-6">
                  <label>Region</label>
                  <select className="form-control form-select" defaultValue={regions[0]?.id} {...register("cities")}>
                    {regions?.map((region) => (
                      <option key={region.id} value={region.id}>
                        {region.name}
                      </option>
                    ))}
                  </select>
                  <p className="errorMsg">{handleFormErrors(errors, "measurableType")}</p>
                </div>

                <div className="form-group col-md-6">
                  <label>Products</label>
                  <FormControl
                    sx={{
                      m: 1,
                      width: "100%",
                      fontSize: "1rem",
                      fontWeight: "400",
                      lineHeight: 1.5,
                      color: "#495057",
                      backgroundColor: "#fff",
                      border: "1px solid #ced4da",
                      borderRadius: "50px !important",
                      textIndent: 10,
                    }}
                    className="no-outline"
                  >
                    <Select
                      multiple
                      value={selectedProducts}
                      onChange={({ target: { value } }) => {
                        setSelectedProducts(value)
                      }}
                      input={<OutlinedInput />}
                      renderValue={(selected) => (
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                          {selected.map((value, index) => (
                            <Chip key={index} label={value.name} />
                          ))}
                        </Box>
                      )}
                      MenuProps={MenuProps}
                    >
                      {products.map((product) => (
                        <MenuItem key={product.id} value={product}>
                          {product.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </div>

              <div className="row">
                <div className="form-group col-md-6">
                  <label>{pathOr("", [locale, "Shipping", "standardAmount"], t)}</label>
                  <input
                    type={"number"}
                    {...register("standardAmount", { required: "This field is required" })}
                    className="form-control"
                  />
                  <p className="errorMsg">{handleFormErrors(errors, "standardAmount")}</p>
                </div>

                <div className="form-group col-md-6">
                  <label>{pathOr("", [locale, "Shipping", "standardPrice"], t)}</label>
                  <input
                    {...register("standardPrice", { required: "This field is required" })}
                    type={"number"}
                    className="form-control"
                  />
                  <p className="errorMsg">{handleFormErrors(errors, "standardPrice")}</p>
                </div>
              </div>

              <div className="row">
                <div className="form-group col-md-6">
                  <label>{pathOr("", [locale, "Shipping", "extraAmount"], t)}</label>
                  <input
                    {...register("extraAmount", { required: "This field is required" })}
                    type={"number"}
                    className="form-control"
                  />
                  <p className="errorMsg">{handleFormErrors(errors, "extraAmount")}</p>
                </div>
                <div className="form-group col-md-6">
                  <label>{pathOr("", [locale, "Shipping", "extraAmountFee"], t)}</label>
                  <input
                    type={"number"}
                    {...register("extraAmountFee", { required: "This field is required" })}
                    className="form-control"
                  />
                  <p className="errorMsg">{handleFormErrors(errors, "extraAmountFee")}</p>
                </div>
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

export default AddShippingCondition
