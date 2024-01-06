/* eslint-disable @next/next/no-img-element */
import { Box, Button, Modal, Typography } from "@mui/material"
import axios from "axios"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"
import React, { useEffect, useRef, useState } from "react"
import AddShippingOptionConditions from "../../../modules/settings/Shipping/addCondition"
import { pathOr } from "ramda"
import t from "../../../translations.json"
import { toast } from "react-toastify"
import { Accordion } from "react-bootstrap"
import styles from "../../../modules/products/add/stepTwo/stepTwo.module.css"
import ConditionForm from "./components/conditionForm"
import { headers } from "../../../../token"

const ShippingOptionPage = ({}) => {
  const [addConditionModal, setAddConditionModal] = useState(false)
  const [newImage, setNewImage] = useState(null)
  const [shippingOptionData, setShippingOptionData] = useState(null)
  const [shippingOptionConditionsData, setShippingOptionConditionsData] = useState([])
  const [countriesList, setCountriesList] = useState([])
  const [productList, setProductList] = useState([])

  const { query } = useRouter()
  const [eventKey, setEventKey] = useState("0")
  const { push, locale } = useRouter()
  const { register, handleSubmit, setValue } = useForm()

  const ref = useRef(null)

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    height: 720,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    overflow: "scroll",
  }

  const toggleAccordionPanel = (eKey) => {
    eventKey === eKey ? setEventKey("") : setEventKey(eKey)
  }

  const handleDeleteOption = async (shippingOptionsId) => {
    try {
      const result = await axios.delete(process.env.REACT_APP_API_URL + "/DeleteShippingOptions", {
        params: {
          shippingOptionsId,
        },
      })
      push({ pathname: "/settings/shipping" })
      toast.success("Option deleted successfully!")
    } catch (error) {
      toast.success("Something went wrong!")
    }
  }

  const handleOnChangeImage = (e) => {
    ref?.current?.firstChild.click()
  }

  const handleEditOption = async (values) => {
    try {
      await axios.post(
        process.env.REACT_APP_API_URL + "/AddEditShippingOptions",
        newImage
          ? { ...values, shippingOptionImage: newImage, businessAccountId, shippingOptionTypeId, id }
          : { ...values, businessAccountId, shippingOptionTypeId, id },
        headers,
      )
      toast.success("Done")
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }

  const fetchShippingOptionData = async () => {
    const {
      data: { data: shippingOptionData },
    } = await axios.get(process.env.REACT_APP_API_URL + "/GetShippingOptionsById", {
      params: { shippingOptionsId: query?.id },
    })

    setShippingOptionData(shippingOptionData)
  }

  const fetchShippingOptionConditionsData = async () => {
    const {
      data: { data: shippingOptionConditionsData },
    } = await axios.get(process.env.REACT_APP_API_URL + "/GetAllShippingOptionsConditions", {
      params: { shippingOptionId: query?.id, lang: "en" },
    })

    setShippingOptionConditionsData(shippingOptionConditionsData)
  }

  const fetchCountries = async () => {
    const {
      data: { data: countriesList },
    } = await axios.get(process.env.REACT_APP_API_URL + "/ListCountries", {
      params: { currentPage: 1, maxRows: 10, lang: "en" },
    })

    setCountriesList(countriesList)
  }

  const fetchProducts = async () => {
    const {
      data: { data: productList },
    } = await axios.get(process.env.REACT_APP_API_URL + "/ListProductByBusinessAccountId", {
      params: { currentPage: 1, lang: "en" },
    })

    setProductList(productList)
  }

  useEffect(() => {
    fetchShippingOptionData()
    fetchCountries()
    fetchProducts()
    fetchShippingOptionConditionsData()
  }, [])

  if (!shippingOptionData) return "loading"

  const {
    shippingOptionNameEn,
    shippingOptionNameAr,
    shippingOptionTypeId,
    shippingOptionImage,
    shippingOptionDescriptionEn,
    shippingOptionDescriptionAr,
    isDeleted,
    isActive,
    id,
    businessAccountId,
    ...shippingOptionRest
  } = shippingOptionData

  return (
    <Box sx={{ padding: 4, position: "relative" }} component={"main"}>
      <div ref={ref} style={{ display: "none" }}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            setNewImage(e.target.files[0])
          }}
        />
      </div>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <Accordion activeKey={eventKey} flush>
          <Accordion.Item className={`${styles["accordion-item"]} accordion-item`} eventKey="0">
            <Accordion.Button
              style={{ display: "flex" }}
              bsPrefix={styles["header_Accord"]}
              onClick={() => toggleAccordionPanel("0")}
            >
              <span>1</span>
              {pathOr("", [locale, "Shipping", "companyInfo"], t)}
              {/* <div style={{ flex: 1, border: "1px solid red", textAlign: "end" }}>
                <Button
                  onClick={() => {
                    handleDeleteCondition(id)
                  }}
                  color="error"
                  variant="contained"
                  sx={{ mr: 2, width: 240, justifySelf: "ƒlex-end" }}
                >
                  {pathOr("", [locale, "Shipping", "delete"], t)}
                </Button>
              </div> */}
            </Accordion.Button>
            <Accordion.Body>
              <form onSubmit={handleSubmit(handleEditOption)}>
                <div className="row">
                  <div className="col-md-12" style={{ position: "relative" }}>
                    <img
                      src={newImage ? URL.createObjectURL(newImage) : shippingOptionImage}
                      alt="123"
                      style={{
                        width: 240,
                        height: 240,
                        borderRadius: "50%",
                        textAlign: "center",
                        objectFit: "cover",
                      }}
                      onClick={handleOnChangeImage}
                    />
                  </div>
                  <div className="form-group col-md-6 mt-4">
                    <label>{pathOr("", [locale, "Shipping", "shippingOptionNameAr"], t)}</label>
                    <input
                      type={"text"}
                      {...register("shippingOptionNameAr", { value: shippingOptionNameAr })}
                      name="shippingOptionNameAr"
                      placeholder="Shipping Option Name AR"
                      className="form-control"
                    />
                  </div>
                  <div className="form-group col-md-6 mt-4">
                    <label>{pathOr("", [locale, "Shipping", "shippingOptionNameEn"], t)}</label>
                    <input
                      type={"text"}
                      {...register("shippingOptionNameEn", { value: shippingOptionNameEn })}
                      name="shippingOptionNameEn"
                      placeholder="Shipping Option Name EN"
                      className="form-control"
                    />
                  </div>
                  <div className="form-group col-md-6 mt-4">
                    <label>{pathOr("", [locale, "Shipping", "shippingOptionDescAr"], t)}</label>
                    <input
                      type={"text"}
                      {...register("shippingOptionDescriptionAr", { value: shippingOptionDescriptionAr })}
                      name="shippingOptionDescriptionAr"
                      placeholder="Shipping Option Description AR"
                      className="form-control"
                    />
                  </div>
                  <div className="form-group col-md-6 mt-4">
                    <label>{pathOr("", [locale, "Shipping", "shippingOptionDescEn"], t)}</label>
                    <input
                      type={"text"}
                      {...register("shippingOptionDescriptionEn", { value: shippingOptionDescriptionEn })}
                      name="shippingOptionDescriptionEn"
                      placeholder="Shipping Option Description EN"
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="d-flex">
                  <button
                    onClick={() => toggleAccordionPanel("1")}
                    className="btn-main"
                    type="button"
                    style={{ width: 180, marginTop: "24px" }}
                  >
                    {pathOr("", [locale, "Shipping", "next"], t)}
                  </button>
                  <button type="submit" className="btn-main" style={{ width: 180, marginTop: "24px", marginRight: 24 }}>
                    {pathOr("", [locale, "EditAccount", "save"], t)}
                  </button>
                </div>
              </form>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item className={`${styles["accordion-item"]} accordion-item`} eventKey="1">
            <Accordion.Button bsPrefix={styles["header_Accord"]} onClick={() => toggleAccordionPanel("1")}>
              <span>2</span>
              {pathOr("", [locale, "Shipping", "conditions"], t)}
            </Accordion.Button>
            <Accordion.Body>
              <ConditionForm
                fetchedCountries={countriesList}
                products={productList}
                conditions={shippingOptionConditionsData}
                setAddConditionModal={setAddConditionModal}
                handleDeleteOption={handleDeleteOption}
                shippingOptionId={id}
              />
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Box>

      <hr />

      <Modal
        open={addConditionModal}
        onClose={() => {
          setAddConditionModal(false)
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <AddShippingOptionConditions
            fetchShippingOptionConditionsData={fetchShippingOptionConditionsData}
            products={productList}
            countries={countriesList}
            setAddConditionModal={setAddConditionModal}
          />
        </Box>
      </Modal>
    </Box>
  )
}

export default ShippingOptionPage
