import React, { useCallback, useEffect, useState } from "react"
import { Accordion } from "react-bootstrap"
import styles from "./stepTwo.module.css"
import { useRouter } from "next/router"
import { textAlignStyle } from "../../../../styles/stylesObjects"
import { pathOr } from "ramda"
import t from "../../../../translations.json"
import Alerto from "../../../../common/Alerto"
import axios from "axios"
import { Box, Chip, FormControl, MenuItem, OutlinedInput, Select } from "@mui/material"

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
  // const [multiSelectedSpecificationsOnEditOrRepost, setMultiSelectedSpecificationsOnEditOrRepost] = useState({
  //   16: [64, 65],
  //   17: [66, 67],
  // })

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

  const fetchSpecificationsList = useCallback(async () => {
    try {
      const {
        data: { data: spefications },
      } = await axios(
        `${process.env.NEXT_PUBLIC_API_URL}/ListAllSpecificationAndSubSpecificationByCatId?lang=${locale}&id=${catId}&currentPage=1`,
      )
      // this will make new productSep array when adding new product and user still didn't edit it
      if (pathname.includes("add") && !editModeOn) {
        const speficationsPayloadList = spefications.map((spefication) => ({
          HeaderSpeAr: spefication.nameAr,
          HeaderSpeEn: spefication.nameEn,
          Type: spefication.type,
          SpecificationId: spefication.id,
        }))
        setProductPayload((prev) => ({ ...prev, productSep: speficationsPayloadList }))
      }
      if (!pathname.includes("add")) {
        transformCommaSepratedMultiValuesFromBackend(productPayload.productSep)
      }
      setSpecifications(spefications)
    } catch (e) {
      Alerto(e)
    }
  }, [locale, catId, pathname, setProductPayload, editModeOn, productPayload.productSep])

  const onChangeSpesfication = ({ target: { value } }, index, type, specificationId) => {
    if (type == 7) {
      const changedSpesfication = [...value]
      setMultiSelectedSpecifications(
        Object.assign({}, multiSelectedSpecifications, {
          [specificationId]: changedSpesfication,
        }),
      )
      let stringSepratedCommaIds = value.join()
      const changedProductSpesfication = {
        ...productPayload.productSep[index],
        ValueSpeAr: stringSepratedCommaIds,
        ValueSpeEn: stringSepratedCommaIds,
      }
      const updatedSpecififcations = Object.assign([], productPayload.productSep, {
        [index]: changedProductSpesfication,
      })
      setProductPayload((prev) => ({ ...prev, productSep: updatedSpecififcations }))
    } else {
      const changedSpesfication = { ...productPayload.productSep[index], ValueSpeAr: value, ValueSpeEn: value }
      const updatedSpecififcations = Object.assign([], productPayload.productSep, { [index]: changedSpesfication })
      setProductPayload((prev) => ({ ...prev, productSep: updatedSpecififcations }))
    }
  }

  useEffect(() => {
    fetchSpecificationsList()
  }, [locale, fetchSpecificationsList])

  console.log(multiSelectedSpecifications)
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
              {spesfication.type === 2 && (
                <input
                  type={"text"}
                  id={index}
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
                  {pathname.includes("add") ? (
                    <Select
                      multiple
                      value={multiSelectedSpecifications[spesfication.id] || []}
                      labelId="selectedRoles-label"
                      id="selectedRoles"
                      onChange={(e) => {
                        onChangeSpesfication(e, index, 7, spesfication.id)
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
                  ) : (
                    <Select
                      multiple
                      value={multiSelectedSpecifications[spesfication.id] || []}
                      labelId="selectedRoles-label"
                      id="selectedRoles"
                      onChange={(e) => {
                        onChangeSpesfication(e, index, 7, spesfication.id)
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
                  )}
                </FormControl>
              )}
            </div>
          ))}
      </section>
      <button
        className="btn-main mt-3"
        type="button"
        onClick={() => {
          validateProductDetails() === true && setEventKey("2")
        }}
      >
        {pathOr("", [locale, "Products", "next"], t)}
      </button>
    </Accordion.Body>
  )
}

export default ProductDetails
