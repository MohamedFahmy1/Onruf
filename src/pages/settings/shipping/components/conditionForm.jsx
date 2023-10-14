import React, { useEffect, useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { pathOr } from "ramda"
import { useRouter } from "next/router"
import t from "../../../../translations.json"
import { handleFormErrors } from "../../../../common/functions"
import { Box, Button, Chip, FormControl, MenuItem, OutlinedInput, Select } from "@mui/material"
import axios from "axios"
import { headersJson } from "../../../../../token"
import { toast } from "react-toastify"

function ConditionForm({ fetchedCountries, products, conditions, setAddConditionModal, handleDeleteOption }) {
  const { locale, query, push } = useRouter()
  const { id: shippingOptionsId } = query
  const [regions, setRegions] = useState([])
  const [selectedProducts, setSelectedProducts] = useState([])

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm()

  const { fields, append, prepend, remove, swap, move, update, insert } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "shippingConditions", // unique name for your Field Array
  })

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

  // Fetch cities with the country ID
  const fetchRegionsByCountry = async () => {
    const {
      data: { data: regionList },
    } = await axios.get(process.env.REACT_APP_API_URL + "/ListRegionsByCountryId", {
      params: { currentPage: 1, countriesIds: [watch("countries")], lang: "ar" },
    })
    setRegions(regionList)
  }

  // Handle Submit Condition To API
  const handleEditCondition = async ({
    cashOnDeliveryFee,
    measurableType,
    standardAmount,
    standardPrice,
    extraAmount,
    extraAmountFee,
    cashOnDelivery,
    countries,
    cities,
    products,
    id,
  }) => {
    try {
      // Wait for the API send response
      await axios.post(
        process.env.REACT_APP_API_URL + "/AddEditShippingOptionsConditions",
        {
          id,
          shippingOptionsId,
          cashOnDeliveryFee: parseInt(cashOnDeliveryFee),
          measurableType: parseInt(measurableType),
          standardAmount: parseInt(standardAmount),
          standardPrice: parseInt(standardPrice),
          extraAmount: parseInt(extraAmount),
          extraAmountFee: parseInt(extraAmountFee),
          cashOnDelivery,
          countries: [{ countryId: countries[0].id }],
          shippingTime: new Date().toISOString(),
          cities: [{ regionId: cities[0].id }],
          products: products?.map(({ id }) => ({
            productId: id,
          })),
        },
        headersJson,
      )
      push(`/settings/shipping/${shippingOptionsId}`)
      toast.success("Condition Saved!")
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }

  // Handle Submit Condition To API
  const handleDeleteCondition = async (condID, conditionIndex) => {
    try {
      // Wait for the API send response
      await axios.delete(process.env.REACT_APP_API_URL + "/DeleteShippingOptionsConditions", {
        params: { shippingOptionsConditionsId: condID },
      })
      toast.success("Condition Deleted!")
      remove(conditionIndex)
      push(`/settings/shipping/${shippingOptionsId}`)
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }

  useEffect(() => {
    if (conditions) {
      conditions?.map((cond) => {
        append(cond)
      })
    }
  }, [conditions])

  useEffect(() => {
    fetchRegionsByCountry()
  }, [watch("countries")])

  return (
    <>
      {fields.map((field, index) => (
        <form
          key={field.id}
          onSubmit={handleSubmit(({ shippingConditions }) => handleEditCondition(shippingConditions[index]))}
        >
          <div key={field.id} style={{ borderBottom: "1px solid orange", padding: 12 }}>
            <p>Shipping Condition No:#{field.id}</p>
            <div className="row">
              <div className="form-group col-md-6">
                <label>{pathOr("", [locale, "Shipping", "cashOnDelivery"], t)}</label>
                <input
                  type={"checkbox"}
                  checked={conditions[index]?.cashOnDelivery}
                  {...register(`shippingConditions.${index}.cashOnDelivery`)}
                  className="form-control"
                />
              </div>

              <div className="form-group col-md-6">
                <label>{pathOr("", [locale, "Shipping", "cashOnDeliveryFee"], t)}</label>
                <input
                  type={"number"}
                  {...register(`shippingConditions.${index}.cashOnDeliveryFee`, { required: "This field is required" })}
                  className="form-control"
                />
                <p className="errorMsg">{handleFormErrors(errors, "cashOnDeliveryFee")}</p>
              </div>

              <div className="form-group col-md-6">
                <label>{pathOr("", [locale, "Shipping", "measurableType"], t)}</label>
                <select
                  className="form-control form-select"
                  defaultValue={0}
                  {...register(`shippingConditions.${index}.measurableType`)}
                >
                  <option value={0}>KG</option>
                  <option value={1}>Count</option>
                </select>
                <p className="errorMsg">{handleFormErrors(errors, "measurableType")}</p>
              </div>

              <div className="form-group col-md-6">
                <label>{pathOr("", [locale, "Branch", "country"], t)}</label>
                <select
                  className="form-control form-select"
                  defaultValue={fields[index]?.countries[0]?.id}
                  {...register(`shippingConditions.${index}.countries`)}
                >
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
                <label>{pathOr("", [locale, "Shipping", "region"], t)}</label>
                <select
                  className="form-control form-select"
                  defaultValue={fields[index]?.cities[0]?.id}
                  {...register(`shippingConditions.${index}.cities`)}
                >
                  {regions?.map((region) => (
                    <option key={region.id} value={region.id}>
                      {region.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group col-md-6">
                <label>{pathOr("", [locale, "sidebar", "products"], t)}</label>
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
                    value={fields[index]?.products}
                    onChange={({ target: { value } }) => {
                      update(index, { products: value })
                    }}
                    input={<OutlinedInput />}
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected?.map((value, index) => (
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
                  {...register(`shippingConditions.${index}.standardAmount`, { required: "This field is required" })}
                  className="form-control"
                />
                <p className="errorMsg">{handleFormErrors(errors, "standardAmount")}</p>
              </div>

              <div className="form-group col-md-6">
                <label>{pathOr("", [locale, "Shipping", "standardPrice"], t)}</label>
                <input
                  {...register(`shippingConditions.${index}.standardPrice`, { required: "This field is required" })}
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
                  {...register(`shippingConditions.${index}.extraAmount`, { required: "This field is required" })}
                  type={"number"}
                  className="form-control"
                />
                <p className="errorMsg">{handleFormErrors(errors, "extraAmount")}</p>
              </div>
              <div className="form-group col-md-6">
                <label>{pathOr("", [locale, "Shipping", "extraAmountFee"], t)}</label>
                <input
                  type={"number"}
                  {...register(`shippingConditions.${index}.extraAmountFee`, { required: "This field is required" })}
                  className="form-control"
                />
                <p className="errorMsg">{handleFormErrors(errors, "extraAmountFee")}</p>
              </div>
            </div>

            <button className="btn-main mt-3" type="submit">
              {pathOr("", [locale, "Products", "save"], t)}
            </button>

            <Button
              onClick={() => {
                handleDeleteCondition(conditions[index].id, index)
              }}
              color="error"
              variant="contained"
              sx={{ mr: 2, width: 240 }}
            >
              {pathOr("", [locale, "Shipping", "delete"], t)}
            </Button>
          </div>
        </form>
      ))}
      <Button className={"btn-main"} style={{ margin: 12 }} onClick={() => setAddConditionModal(true)}>
        {pathOr("", [locale, "Shipping", "addCond"], t)}
      </Button>
      <Button
        variant="contained"
        color="error"
        sx={{ width: 240 }}
        onClick={() => handleDeleteOption(shippingOptionsId)}
      >
        {pathOr("", [locale, "Shipping", "delete"], t)}
      </Button>
    </>
  )
}

export default ConditionForm
