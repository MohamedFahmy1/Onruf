import React, { useCallback, useEffect, useState } from "react"
import { Accordion } from "react-bootstrap"
import styles from "./stepTwo.module.css"
import { useRouter } from "next/router"
import { textAlignStyle } from "../../../../styles/stylesObjects"
import { pathOr } from "ramda"
import t from "../../../../translations.json"
import Alerto from "../../../../common/Alerto"
import axios from "axios"

const ProductDetails = ({
  productPayload,
  setProductPayload,
  editModeOn,
  catId,
  validateProductDetails,
  setEventKey,
}) => {
  const { locale, pathname } = useRouter()
  const [spesfications, setSpesfications] = useState([])

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
      setSpesfications(spefications)
    } catch (e) {
      Alerto(e)
    }
  }, [locale, catId, pathname, setProductPayload, editModeOn])

  useEffect(() => {
    fetchSpecificationsList()
  }, [locale, fetchSpecificationsList])

  const onChangeSpesfication = ({ target: { value } }, index, type) => {
    const changedSpesfication = { ...productPayload.productSep[index], ValueSpeAr: value, ValueSpeEn: value }
    const updatedSpecififcations = Object.assign([], productPayload.productSep, { [index]: changedSpesfication })
    setProductPayload((prev) => ({ ...prev, productSep: updatedSpecififcations }))
  }

  return (
    <Accordion.Body className={`${styles["accordion-body"]} accordion-body`}>
      <div className="form-content">
        <form>
          {Boolean(spesfications?.length) &&
            spesfications.map((spesfication, index) => (
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
                    {Boolean(spesfication?.subSpecifications?.length) &&
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
                        ? productPayload?.productSep?.find(({ HeaderSpeEn }) => HeaderSpeEn === spesfication?.name)
                            ?.ValueSpeEn
                        : productPayload?.productSep?.find(({ HeaderSpeAr }) => HeaderSpeAr === spesfication?.name)
                            ?.ValueSpeAr) || ""
                    }
                    required={spesfication.isRequired}
                    placeholder={spesfication.placeHolder}
                    onChange={(e) => onChangeSpesfication(e, index, spesfication.type)}
                    className={`${styles["form-control"]} form-control`}
                  />
                )}
              </div>
            ))}
        </form>
      </div>
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
