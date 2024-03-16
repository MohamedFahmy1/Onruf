import { pathOr } from "ramda"
import { Accordion, Col, Row } from "react-bootstrap"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import styles from "./stepTwo.module.css"
import { useRouter } from "next/router"
import { textAlignStyle } from "../../../../styles/stylesObjects"
import t from "../../../../translations.json"
import Alerto from "../../../../common/Alerto"
import axios from "axios"
import { FaFlag, FaMinus, FaPlus } from "react-icons/fa"
import { onlyNumbersInInputs } from "../../../../common/functions"
import Image from "next/image"
import { useFetch } from "../../../../hooks/useFetch"
import regionImage from "../../../../../public/icons/008-maps.svg"
import cityImage from "../../../../../public/icons/neighboor.svg"

const AdDetails = ({ productPayload, setProductPayload, validateAdDetails, setEventKey, regions, setRegions }) => {
  const { locale, pathname } = useRouter()
  const { data: countries } = useFetch(`/ListCountries?lang=${locale}&currentPage=1`)
  const [neighborhoods, setNeighborhoods] = useState([])
  const [unlimtedQuantity, setUnlimtedQuantity] = useState(productPayload.qty ? false : true)

  const handleFetchNeighbourhoodsOrRegions = useCallback(
    async (url, params = "", id, setState) => {
      try {
        const {
          data: { data },
        } = await axios(`${process.env.NEXT_PUBLIC_API_URL}/${url}?${params}=${id}&currentPage=1&lang=${locale}`)
        setState(data)
      } catch (e) {
        Alerto(e)
      }
    },
    [locale],
  )

  useEffect(() => {
    if (productPayload.neighborhoodId && !pathname.includes("add")) {
      handleFetchNeighbourhoodsOrRegions("ListRegionsByCountryId", "countriesIds", productPayload.countryId, setRegions)
      handleFetchNeighbourhoodsOrRegions(
        "ListNeighborhoodByRegionId",
        "regionsIds",
        productPayload.regionId,
        setNeighborhoods,
      )
    }
  }, [
    productPayload.neighborhoodId,
    productPayload.countryId,
    productPayload.regionId,
    handleFetchNeighbourhoodsOrRegions,
    pathname,
    setRegions,
  ])

  const handleUnlimtedQuantity = ({ target: { checked } }) => {
    if (checked) {
      setUnlimtedQuantity(true)
      // Update state without 'qty' and "AlmostSoldOutQuantity" props cause there is not qty
      const { qty, AlmostSoldOutQuantity, ...rest } = productPayload
      setProductPayload(rest)
    } else {
      setUnlimtedQuantity(false)
      setProductPayload({ ...productPayload, qty: 1, AlmostSoldOutQuantity: 1 })
    }
  }

  const countryFlag = useMemo(
    () => countries?.find((item) => item.id === productPayload.countryId)?.countryFlag,
    [countries, productPayload?.countryId],
  )

  const RequiredSympol = () => <span style={{ color: "red", fontSize: "1.3rem" }}>*</span>

  return (
    <Accordion.Body className={`${styles["accordion-body"]} accordion-body`}>
      <form className="form-content">
        <Row>
          <Col md={6}>
            <div className="form-group">
              <label htmlFor="nameAr" style={{ ...textAlignStyle(locale), display: "block" }}>
                {pathOr("", [locale, "Products", "productAddressAr"], t)}
                <RequiredSympol />
              </label>
              <input
                type="text"
                id="nameAr"
                className={`form-control ${styles["form-control"]}`}
                placeholder={pathOr("", [locale, "Products", "enterProductAddressAr"], t)}
                value={productPayload.nameAr}
                onChange={(e) => setProductPayload({ ...productPayload, nameAr: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="subTitleAr" style={{ ...textAlignStyle(locale), display: "block" }}>
                {pathOr("", [locale, "Products", "productSecondaryAddressAr"], t)}
              </label>
              <input
                type="text"
                id="subTitleAr"
                className={`form-control ${styles["form-control"]}`}
                placeholder={
                  productPayload.subTitleAr !== null
                    ? pathOr("", [locale, "Products", "enterProductSecondaryAddressEn"], t)
                    : "-"
                }
                value={!!productPayload.subTitleAr ? productPayload.subTitleAr : ""}
                disabled={productPayload.subTitleAr === null}
                onChange={(e) =>
                  setProductPayload({
                    ...productPayload,
                    subTitleAr: e.target.value,
                  })
                }
              />
            </div>
          </Col>
          <Col md={6}>
            <div className="form-group">
              <label htmlFor="descriptionAr" style={{ ...textAlignStyle(locale), display: "block" }}>
                {pathOr("", [locale, "Products", "productDetailsAr"], t)}
              </label>
              <textarea
                id="descriptionAr"
                className={`form-control ${styles["form-control"]}`}
                placeholder={pathOr("", [locale, "Products", "enterDetailsAr"], t)}
                value={!!productPayload.descriptionAr ? productPayload.descriptionAr : ""}
                onChange={(e) =>
                  setProductPayload({
                    ...productPayload,
                    descriptionAr: e.target.value,
                  })
                }
              />
            </div>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <div className="form-group">
              <label htmlFor="nameEn" style={{ ...textAlignStyle(locale), display: "block" }}>
                {pathOr("", [locale, "Products", "productAddressEn"], t)}
                <RequiredSympol />
              </label>
              <input
                type="text"
                id="nameEn"
                className={`form-control ${styles["form-control"]}`}
                placeholder={pathOr("", [locale, "Products", "enterProductAddressEn"], t)}
                value={productPayload.nameEn}
                onChange={(e) => setProductPayload({ ...productPayload, nameEn: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="subTitleEn" style={{ ...textAlignStyle(locale), display: "block" }}>
                {pathOr("", [locale, "Products", "productSecondaryAddressEn"], t)}
              </label>
              <input
                type="text"
                id="subTitleEn"
                className={`form-control ${styles["form-control"]}`}
                placeholder={
                  productPayload.subTitleEn !== null
                    ? pathOr("", [locale, "Products", "enterProductSecondaryAddressEn"], t)
                    : "-"
                }
                value={!!productPayload.subTitleEn ? productPayload.subTitleEn : ""}
                disabled={productPayload.subTitleEn === null}
                onChange={(e) =>
                  setProductPayload({
                    ...productPayload,
                    subTitleEn: e.target.value,
                  })
                }
              />
            </div>
          </Col>
          <Col md={6}>
            <div className="form-group">
              <label htmlFor="descriptionEn" style={{ ...textAlignStyle(locale), display: "block" }}>
                {pathOr("", [locale, "Products", "productDetailsEn"], t)}
              </label>
              <textarea
                id="descriptionEn"
                className={`form-control ${styles["form-control"]}`}
                placeholder={pathOr("", [locale, "Products", "enterDetailsEn"], t)}
                value={!!productPayload.descriptionEn ? productPayload.descriptionEn : ""}
                onChange={(e) =>
                  setProductPayload({
                    ...productPayload,
                    descriptionEn: e.target.value,
                  })
                }
              />
            </div>
          </Col>
          <Col>
            <div className="form-group">
              <label style={{ ...textAlignStyle(locale), display: "block" }}>
                {pathOr("", [locale, "Products", "itemStatus"], t)}
                <RequiredSympol />
              </label>
              <div className="d-flex gap-3">
                <div
                  onClick={() => setProductPayload({ ...productPayload, status: 2 })}
                  className={`${styles.p_select} ${productPayload.status == 2 ? styles.p_select_active : ""}`}
                >
                  {pathOr("", [locale, "Products", "new"], t)}
                </div>
                <div
                  onClick={() => setProductPayload({ ...productPayload, status: 1 })}
                  className={`${styles.p_select} ${productPayload.status == 1 ? styles.p_select_active : ""}`}
                >
                  {pathOr("", [locale, "Products", "used"], t)}
                </div>
              </div>
            </div>
          </Col>
          <Col md={6}>
            <div className="form-group">
              <label style={{ ...textAlignStyle(locale), display: "block" }}>
                {pathOr("", [locale, "Products", "quantity"], t)}
                <RequiredSympol />
              </label>
              <div className="d-flex align-items-center justify-content-between mb-2">
                <label htmlFor="unlimitedQuantity" className="f-b">
                  {pathOr("", [locale, "Products", "unlimitedQuantity"], t)}
                </label>
                <div className="form-check form-switch p-0 m-0">
                  <input
                    className="form-check-input m-0"
                    type="checkbox"
                    role="switch"
                    id="unlimitedQuantity"
                    onChange={(e) => handleUnlimtedQuantity(e)}
                    checked={unlimtedQuantity}
                  />
                </div>
              </div>
              <div className="inpt_numb">
                <button
                  className="btn_ plus"
                  disabled={unlimtedQuantity}
                  onClick={(e) => {
                    e.preventDefault()
                    setProductPayload({ ...productPayload, qty: productPayload.qty + 1 })
                  }}
                >
                  <FaPlus />
                </button>
                <input
                  type="unlimtedQuantity ? 'text' : 'number'"
                  disabled={unlimtedQuantity}
                  className={`form-control ${styles["form-control"]} ${unlimtedQuantity ? "disabled" : ""}`}
                  value={!!productPayload.qty ? productPayload.qty : "-"}
                  onKeyDown={(e) => onlyNumbersInInputs(e)}
                  onChange={(e) => setProductPayload({ ...productPayload, qty: +e.target.value })}
                />
                <button
                  className="btn_ minus"
                  disabled={productPayload.qty == 1 || unlimtedQuantity}
                  onClick={(e) => {
                    e.preventDefault()
                    setProductPayload({ ...productPayload, qty: productPayload.qty - 1 })
                  }}
                >
                  <FaMinus />
                </button>
              </div>
            </div>
          </Col>
        </Row>
        {!unlimtedQuantity && (
          <Row>
            <Col md={6}>
              <div className="form-group">
                <label style={{ ...textAlignStyle(locale), display: "block" }}>
                  {pathOr("", [locale, "Products", "productsAlmostOut"], t)}
                </label>
                <div className="inpt_numb">
                  <button
                    className="btn_ plus"
                    onClick={(e) => {
                      e.preventDefault()
                      setProductPayload({
                        ...productPayload,
                        AlmostSoldOutQuantity: productPayload.AlmostSoldOutQuantity + 1,
                      })
                    }}
                  >
                    <FaPlus />
                  </button>
                  <input
                    type="unlimtedQuantity ? 'text' : 'number'"
                    className={`form-control ${styles["form-control"]}`}
                    value={productPayload.AlmostSoldOutQuantity <= 0 ? 1 : productPayload.AlmostSoldOutQuantity}
                    onKeyDown={(e) => onlyNumbersInInputs(e)}
                    onChange={(e) => {
                      const value = +e.target.value
                      if (value <= 0) {
                        setProductPayload({ ...productPayload, AlmostSoldOutQuantity: 1 })
                      } else setProductPayload({ ...productPayload, AlmostSoldOutQuantity: value })
                    }}
                  />
                  <button
                    className="btn_ minus"
                    disabled={productPayload.AlmostSoldOutQuantity === 1}
                    onClick={(e) => {
                      e.preventDefault()
                      setProductPayload({
                        ...productPayload,
                        AlmostSoldOutQuantity: productPayload.AlmostSoldOutQuantity - 1,
                      })
                    }}
                  >
                    <FaMinus />
                  </button>
                </div>
              </div>
            </Col>
          </Row>
        )}
        <div className="form-group">
          <label style={{ ...textAlignStyle(locale), display: "block" }}>
            {" "}
            {pathOr("", [locale, "Products", "address"], t)}
          </label>
          <Row>
            <Col md={6}>
              <div className="form-group">
                <div
                  className={`input-group ${styles["input-group"]}`}
                  style={{
                    flexDirection: locale === "en" ? "row-reverse" : "row",
                  }}
                >
                  <span
                    className={`${styles["input-group-text"]} input-group-text`}
                    id="basic-addon1"
                    style={{ padding: "14px" }}
                  >
                    {productPayload.countryId && countryFlag ? (
                      <Image src={countryFlag} alt="country flag" width={30} height={20} />
                    ) : (
                      <FaFlag size={21} style={{ width: "30px" }} />
                    )}
                  </span>
                  <div className="po_R flex-grow-1">
                    <label htmlFor="countryId">{pathOr("", [locale, "Products", "country"], t)}</label>
                    <select
                      id="countryId"
                      className={`${styles["form-control"]} form-control form-select`}
                      value={productPayload.countryId || ""}
                      onChange={(e) => {
                        setProductPayload({ ...productPayload, countryId: +e.target.value })
                        handleFetchNeighbourhoodsOrRegions(
                          "ListRegionsByCountryId",
                          "countriesIds",
                          +e.target.value,
                          setRegions,
                        )
                      }}
                    >
                      <option value="" disabled hidden>
                        {pathOr("", [locale, "Products", "select"], t)} {pathOr("", [locale, "Products", "country"], t)}
                      </option>
                      {countries?.length &&
                        countries.map((country) => (
                          <option value={country?.id} key={country?.id}>
                            {country?.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <div
                  className={`input-group ${styles["input-group"]}`}
                  style={{
                    flexDirection: locale === "en" ? "row-reverse" : "row",
                  }}
                >
                  <span className={`${styles["input-group-text"]} input-group-text`} id="basic-addon1">
                    <Image src={cityImage} alt="region" width={20} height={20} />
                  </span>
                  <div className="po_R flex-grow-1">
                    <label htmlFor="regionId">{pathOr("", [locale, "Products", "region"], t)}</label>
                    <select
                      id="regionId"
                      className={`${styles["form-control"]} form-control form-select`}
                      value={productPayload.regionId || ""}
                      onChange={(e) => {
                        setProductPayload({ ...productPayload, regionId: +e.target.value })
                        handleFetchNeighbourhoodsOrRegions(
                          "ListNeighborhoodByRegionId",
                          "regionsIds",
                          +e.target.value,
                          setNeighborhoods,
                        )
                      }}
                    >
                      <option value="">
                        {pathOr("", [locale, "Products", "select"], t)} {pathOr("", [locale, "Products", "region"], t)}
                      </option>
                      {regions?.length &&
                        regions.map((region) => (
                          <option value={region?.id} key={region?.id}>
                            {region?.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <div
                  className={`input-group ${styles["input-group"]}`}
                  style={{
                    flexDirection: locale === "en" ? "row-reverse" : "row",
                  }}
                >
                  <span className={`${styles["input-group-text"]} input-group-text`} id="basic-addon1">
                    <Image src={regionImage} alt="region" width={20} height={20} />
                  </span>
                  <div className="po_R flex-grow-1">
                    <label htmlFor="neighborhoodId">{pathOr("", [locale, "Products", "city"], t)}</label>
                    <select
                      id="neighborhoodId"
                      className={`${styles["form-control"]} form-control form-select`}
                      value={productPayload?.neighborhoodId || ""}
                      onChange={(e) => {
                        setProductPayload({ ...productPayload, neighborhoodId: +e.target.value })
                      }}
                    >
                      <option value="">
                        {pathOr("", [locale, "Products", "select"], t)} {pathOr("", [locale, "Products", "city"], t)}
                      </option>
                      {neighborhoods?.length &&
                        neighborhoods.map((neighborhood) => (
                          <option value={neighborhood?.id} key={neighborhood?.id}>
                            {neighborhood?.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className="form-group">
                <div className="po_R">
                  <label htmlFor="District">{pathOr("", [locale, "Products", "area"], t)}</label>
                  <input
                    type="text"
                    id="District"
                    className={`form-control ${styles["form-control"]}`}
                    placeholder={pathOr("", [locale, "Products", "enterArea"], t)}
                    value={!!productPayload.District ? productPayload.District : ""}
                    onChange={(e) => {
                      setProductPayload({ ...productPayload, District: e.target.value })
                    }}
                  />
                </div>
              </div>
              <div className="form-group">
                <div className="po_R">
                  <label htmlFor="Street">{pathOr("", [locale, "Products", "street"], t)}</label>
                  <input
                    type="text"
                    id="Street"
                    className={`form-control ${styles["form-control"]}`}
                    placeholder={pathOr("", [locale, "Products", "enterStreet"], t)}
                    value={!!productPayload.Street ? productPayload.Street : ""}
                    onChange={(e) => setProductPayload({ ...productPayload, Street: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <div className="po_R">
                  <label htmlFor="GovernmentCode">{pathOr("", [locale, "Products", "countryCode"], t)}</label>
                  <input
                    id="GovernmentCode"
                    type="text"
                    className={`form-control ${styles["form-control"]}`}
                    placeholder={pathOr("", [locale, "Products", "enterCountryCode"], t)}
                    value={!!productPayload.GovernmentCode ? productPayload.GovernmentCode : ""}
                    onChange={(e) => setProductPayload({ ...productPayload, GovernmentCode: e.target.value })}
                  />
                </div>
              </div>
            </Col>
          </Row>
        </div>
        <div className="d-flex align-items-center justify-content-between flex-wrap mb-2">
          <label htmlFor="flexSwitchCheckCheck" className="f-b">
            {pathOr("", [locale, "Products", "gettingQuestions"], t)}
          </label>
          <div className="form-check form-switch p-0 m-0">
            <input
              className="form-check-input m-0"
              type="checkbox"
              id="flexSwitchCheckCheck"
              checked={productPayload.AcceptQuestion}
              onChange={() => setProductPayload({ ...productPayload, AcceptQuestion: !productPayload.AcceptQuestion })}
            />
          </div>
        </div>
      </form>
      <button
        className="btn-main mt-3"
        type="button"
        onClick={() => {
          validateAdDetails() === true && setEventKey("3")
        }}
      >
        {pathOr("", [locale, "Products", "next"], t)}
      </button>
    </Accordion.Body>
  )
}

export default AdDetails
