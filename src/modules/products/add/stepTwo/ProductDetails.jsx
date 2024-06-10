import React, { useCallback, useEffect, useRef, useState } from "react"
import { Accordion } from "react-bootstrap"
import styles from "./stepTwo.module.css"
import { useRouter } from "next/router"
import { textAlignStyle } from "../../../../styles/stylesObjects"
import { pathOr } from "ramda"
import t from "../../../../translations.json"
import Alerto from "../../../../common/Alerto"
import axios from "axios"
import { Box, Chip, FormControl, MenuItem, OutlinedInput, Select } from "@mui/material"
import { onlyNumbersInInputs } from "../../../../common/functions"

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

const ProductDetails = ({
  productPayload,
  setProductPayload,
  editModeOn,
  catId,
  validateProductDetails,
  setEventKey,
}) => {
  const { locale, pathname } = useRouter()
  const [specifications, setSpecifications] = useState([])
  const [multiSelectedSpecifications, setMultiSelectedSpecifications] = useState({})
  const hasRunEffect = useRef(false)

  const fetchSpecificationsList = useCallback(async () => {
    try {
      const {
        data: { data: spefications },
      } = await axios(`/ListAllSpecificationAndSubSpecificationByCatId?lang=${locale}&id=${catId}&currentPage=1`)
      setSpecifications(spefications)
    } catch (e) {
      Alerto(e)
    }
  }, [locale, catId])

  const handleGoNext = () => {
    if (specifications?.length === 0 || !specifications) {
      setEventKey("2")
    } else if (validateProductDetails() === true) {
      setEventKey("2")
    }
  }

  const onChangeSpesfication = ({ target: { value, checked } }, index, type) => {
    let updatedSpec = { ...productPayload.productSep[index] }

    switch (type) {
      case 1: // Dropdown
      case 2: // Text input
      case 3: // Textarea
      case 4: // Number input
        updatedSpec.ValueSpeAr = value
        updatedSpec.ValueSpeEn = value
        break
      case 5: // Radio buttons
        updatedSpec.ValueSpeAr = value
        updatedSpec.ValueSpeEn = value
        break
      case 6: // Checkboxes
        let values = updatedSpec.ValueSpeAr ? updatedSpec.ValueSpeAr.split(",").map(Number) : []
        if (checked) {
          values.push(parseInt(value))
        } else {
          values = values.filter((val) => val !== parseInt(value))
        }
        updatedSpec.ValueSpeAr = values.join(",")
        updatedSpec.ValueSpeEn = values.join(",")
        break
      case 7: // Multi-select
        // This will be an array for the Select component with 'multiple' attribute
        const allValues = typeof value === "string" ? value.split(",") : value
        updatedSpec.ValueSpeAr = allValues.join(",")
        updatedSpec.ValueSpeEn = allValues.join(",")
        // Update the state to reflect the selected values for the multi-select
        setMultiSelectedSpecifications((prev) => ({
          ...prev,
          [updatedSpec.SpecificationId]: allValues,
        }))
        break
      default:
        console.error("Unhandled type: ", type)
    }
    const updatedSpecifications = Object.assign([], productPayload.productSep, { [index]: updatedSpec })
    setProductPayload((prev) => ({ ...prev, productSep: updatedSpecifications }))
  }

  useEffect(() => {
    fetchSpecificationsList()
  }, [fetchSpecificationsList])

  useEffect(() => {
    function transformCommaSepratedMultiValuesFromBackend(data) {
      let updatedData = data.filter((item) => item.ValueSpeAr.includes(","))
      let result = {}
      updatedData.forEach((item) => {
        // Split ValueSpeAr by comma and convert each item to a number
        let values = item.ValueSpeAr.split(",").map(Number)
        if (!result[item.SpecificationId]) {
          // Create a new array if the key doesn't exist
          result[item.SpecificationId] = values
        } else {
          // Concatenate values if the key already exists
          result[item.SpecificationId] = result[item.SpecificationId].concat(values)
        }
      })
      setMultiSelectedSpecifications(result)
    }
    if (!pathname.includes("add")) {
      transformCommaSepratedMultiValuesFromBackend(productPayload.productSep)
    }
  }, [pathname, productPayload.productSep])

  useEffect(() => {
    // This will make new productSep array when adding new product and user still didn't edit it
    if (!hasRunEffect.current && pathname.includes("add") && !editModeOn && specifications?.length > 0) {
      const speficationsPayloadList = specifications.map((spefication) => ({
        HeaderSpeAr: spefication.nameAr,
        HeaderSpeEn: spefication.nameEn,
        Type: spefication.type,
        SpecificationId: spefication.id,
      }))
      setProductPayload((prev) => ({ ...prev, productSep: speficationsPayloadList }))
      // This will check the effect run only once
      hasRunEffect.current = true
    }
  }, [specifications, editModeOn, pathname, setProductPayload])

  return (
    <Accordion.Body className={`${styles["accordion-body"]} accordion-body`}>
      <section className="form-content">
        {Boolean(specifications?.length) &&
          specifications.map((spesfication, index) => (
            <div className="form-group" key={spesfication?.id}>
              <label htmlFor={index} style={{ ...textAlignStyle(locale), display: "block" }}>
                {spesfication.name}
              </label>
              {spesfication.type === 1 && (
                <select
                  required={spesfication.isRequired}
                  id={index}
                  value={
                    (locale === "en"
                      ? productPayload?.productSep[index]?.ValueSpeEn
                      : productPayload?.productSep[index]?.ValueSpeAr) || ""
                  }
                  className={`${styles["form-control"]} form-control form-select`}
                  onChange={(e) => onChangeSpesfication(e, index, spesfication.type)}
                >
                  <option value="" disabled hidden>
                    {spesfication?.placeHolder}
                  </option>
                  {!!spesfication?.subSpecifications?.length &&
                    spesfication.subSpecifications.map((subSpecification) => (
                      <option key={subSpecification?.id} value={subSpecification?.id}>
                        {locale === "en" ? subSpecification.nameEn : subSpecification.nameAr}
                      </option>
                    ))}
                </select>
              )}
              {!!(spesfication.type === 2 || spesfication.type === 3 || spesfication.type === 4) && (
                <input
                  type={spesfication.type === 4 ? "number" : "text"}
                  id={index}
                  onKeyDown={(e) => {
                    spesfication.type === 4 && onlyNumbersInInputs(e)
                  }}
                  value={
                    (locale === "en"
                      ? productPayload?.productSep?.find(({ HeaderSpeEn }) => HeaderSpeEn === spesfication?.nameEn)
                          ?.ValueSpeEn
                      : productPayload?.productSep?.find(({ HeaderSpeAr }) => HeaderSpeAr === spesfication?.nameAr)
                          ?.ValueSpeAr) || ""
                  }
                  required={spesfication.isRequired}
                  placeholder={spesfication.placeHolder}
                  onChange={(e) => onChangeSpesfication(e, index, spesfication.type)}
                  className={`${styles["form-control"]} form-control`}
                />
              )}
              {spesfication.type === 5 && (
                <div className="d-flex gap-3">
                  {spesfication.subSpecifications.map((subSpecification) => (
                    <div key={subSpecification.id}>
                      <label htmlFor={subSpecification.id}>
                        {locale === "en" ? subSpecification.nameEn : subSpecification.nameAr}
                      </label>
                      <input
                        type="radio"
                        id={subSpecification.id}
                        name={spesfication.id}
                        className="mx-2"
                        checked={productPayload.productSep[index]?.ValueSpeAr === String(subSpecification.id)}
                        onChange={(e) => onChangeSpesfication(e, index, spesfication.type)}
                        value={subSpecification.id}
                      />
                    </div>
                  ))}
                </div>
              )}
              {spesfication.type === 6 && (
                <div className="d-flex gap-3">
                  {spesfication.subSpecifications.map((subSpecification) => (
                    <div key={subSpecification.id}>
                      <label htmlFor={subSpecification.id}>
                        {locale === "en" ? subSpecification.nameEn : subSpecification.nameAr}
                      </label>
                      <input
                        type="checkbox"
                        id={subSpecification.id}
                        name={spesfication.id}
                        className="mx-2"
                        checked={
                          productPayload.productSep[index]?.ValueSpeAr?.split(",").includes(
                            String(subSpecification.id),
                          ) || false
                        }
                        onChange={(e) => onChangeSpesfication(e, index, spesfication.type)}
                        value={subSpecification.id}
                      />
                    </div>
                  ))}
                </div>
              )}
              {spesfication.type === 7 && (
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
                    value={multiSelectedSpecifications[spesfication.id] || []}
                    labelId="selectedRoles-label"
                    id="selectedRoles"
                    onChange={(e) => {
                      onChangeSpesfication(e, index, 7)
                    }}
                    input={<OutlinedInput />}
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((selectedId, index) => {
                          // Find the subSpecification object that matches the selectedId
                          const selectedSpec = spesfication.subSpecifications.find((sub) => sub.id === selectedId)
                          return (
                            <Chip key={index} label={locale === "en" ? selectedSpec?.nameEn : selectedSpec?.nameAr} />
                          )
                        })}
                      </Box>
                    )}
                    MenuProps={MenuProps}
                  >
                    {spesfication.subSpecifications?.map((subSpecification) => (
                      <MenuItem key={subSpecification.id} value={subSpecification.id}>
                        {locale === "en" ? subSpecification.nameEn : subSpecification.nameAr}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </div>
          ))}
      </section>
      <button className="btn-main mt-3" type="button" onClick={handleGoNext}>
        {pathOr("", [locale, "Products", "next"], t)}
      </button>
    </Accordion.Body>
  )
}

export default ProductDetails
