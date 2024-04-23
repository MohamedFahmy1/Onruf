import { useState, useEffect, useMemo, useCallback } from "react"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"
import axios from "axios"
import region from "../../../../public/icons/neighboor.svg"
import city from "../../../../public/icons/008-maps.svg"
import Link from "next/link"
import { toast } from "react-toastify"
import { pathOr } from "ramda"
import t from "../../../translations.json"
import { FaFlag } from "react-icons/fa"
import Image from "next/image"
import Alerto from "../../../common/Alerto"
import { DevTool } from "@hookform/devtools"

const AddBranch = () => {
  const [neighbourhoods, setNeighbourhoods] = useState([])
  const [regions, setRegions] = useState([])
  const [selectedBranch, setSelectedBranch] = useState()
  const [countries, setCountries] = useState()
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    setValue,
    control,
  } = useForm()
  const {
    locale,
    query: { id },
    push,
  } = useRouter()
  const countryId = watch("countryId")

  const countryFlag = useMemo(() => {
    return countryId && countries?.find((item) => item.id === countryId)?.countryFlag
  }, [countries, countryId])

  const getCountries = useCallback(async () => {
    const {
      data: { data: countries },
    } = await axios(`/ListCountries?lang=${locale}`)
    setCountries(countries)
  }, [locale])

  const handleFetchNeighbourhoodsOrRegions = useCallback(
    async (url, params = "", id, setState) => {
      try {
        const {
          data: { data },
        } = await axios(`/${url}?${params}=${id}&currentPage=1&lang=${locale}`)
        setState(data)
      } catch (e) {
        Alerto(e)
      }
    },
    [locale],
  )

  useEffect(() => {
    getCountries()
  }, [getCountries])

  const getBranchById = useCallback(async () => {
    try {
      const {
        data: { data },
      } = await axios(`/GetBrancheById?id=${id}&lang=${locale}`)
      handleFetchNeighbourhoodsOrRegions(
        "ListNeighborhoodByRegionId",
        "regionsIds",
        data?.region?.id,
        setNeighbourhoods,
      )
      handleFetchNeighbourhoodsOrRegions("ListRegionsByCountryId", "countriesIds", data?.country?.id, setRegions)
      setSelectedBranch(data)
      reset({
        ...data,
        countryId: +data?.country?.id,
        regionId: +data?.region?.id,
        neighborhoodId: +data?.neighborhood?.id,
      })
    } catch (error) {
      Alerto(error)
    }
  }, [id, locale, reset, handleFetchNeighbourhoodsOrRegions])

  useEffect(() => {
    if (id) {
      getBranchById()
    }
  }, [id, getBranchById])

  useEffect(() => {
    const countryId = watch().countryId
    const regionId = watch().regionId
    const neighborhoodId = watch().neighborhoodId
    if (regions && neighbourhoods) {
      reset({
        ...selectedBranch,
        countryId: +countryId,
        regionId: +regionId,
        neighborhoodId: +neighborhoodId,
      })
    }
  }, [regions, neighbourhoods, watch, selectedBranch, reset])

  const createBranch = async ({
    neighborhoodId,
    countryId,
    regionId,
    name,
    isActive,
    streetName,
    regionCode,
    location,
    ...values
  }) => {
    try {
      const values = {
        id: id,
        isActive: isActive,
        neighborhoodId: +neighborhoodId,
        countryId: +countryId,
        regionId: +regionId,
        nameAr: name,
        nameEn: name,
        location: location,
        streetName: streetName,
        regionCode: regionCode,
        lng: 0,
        lat: 0,
      }
      const formData = new FormData()
      for (const key in values) {
        formData.append(key, values[key])
      }
      if (id) {
        await axios.put("/EditBranche", formData)
        toast.success(locale === "en" ? "Branch has been edited successfully!" : "تم تعديل الفرع بنجاح")
      } else {
        await axios.post("/AddBranche", formData)
        toast.success(locale === "en" ? "Branch has been created successfully!" : "تم انشاء الفرع بنجاح")
      }
      push("/settings/branches")
    } catch (error) {
      Alerto(error)
    }
  }
  const handleCountries = (e) => {
    const selectedOption = countries.find((item) => item.id === +e.target.value)
    if (selectedOption) {
      setValue("countryId", +selectedOption.id)
      setValue("regionId", 0)
      setValue("neighborhoodId", 0)
      setNeighbourhoods([])
      setRegions([])
      handleFetchNeighbourhoodsOrRegions("ListRegionsByCountryId", "countriesIds", +selectedOption.id, setRegions)
    }
  }
  const handleRegions = (e) => {
    const selectedOption = regions.find((item) => item.id === +e.target.value)
    if (selectedOption) {
      setValue("regionId", +selectedOption.id)
      setValue("neighborhoodId", 0)
      setNeighbourhoods([])
      handleFetchNeighbourhoodsOrRegions(
        "ListNeighborhoodByRegionId",
        "regionsIds",
        +selectedOption.id,
        setNeighbourhoods,
      )
    }
  }
  return (
    <div className="body-content">
      <div>
        <div className="d-flex align-items-center justify-content-between mb-4 gap-2 flex-wrap">
          <h6 className="f-b m-0">
            {" "}
            {!id ? (locale === "en" ? "Add" : "اضافة") : locale === "en" ? "Edit" : "تعديل"}{" "}
            {pathOr("", [locale, "Branch", "branch"], t)}
          </h6>
          <Link href="/settings/branches">
            <span className="btn-main btn-main-o">{pathOr("", [locale, "Branch", "cancel"], t)}</span>
          </Link>
        </div>
        <div className="contint_paner">
          <div className="form-content">
            <form onSubmit={handleSubmit(createBranch)}>
              <div className="form-group">
                <label htmlFor="branchName">{pathOr("", [locale, "Branch", "branchName"], t)}</label>
                <input
                  {...register("name", { required: "This field is required" })}
                  id="branchName"
                  type="text"
                  className="form-control"
                  placeholder={pathOr("", [locale, "Branch", "branchName"], t)}
                />
                {errors?.name && errors?.name?.message}
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <div className="input-group" style={{ flexDirection: locale === "en" ? "row-reverse" : "row" }}>
                      <span
                        className="input-group-text"
                        style={{ borderTopRightRadius: "30px", borderBottomRightRadius: "30px" }}
                        id="basic-addon1"
                      >
                        {Boolean(countryFlag) ? (
                          <Image src={countryFlag} alt="country flag" width={30} height={20} />
                        ) : (
                          <FaFlag size={25} />
                        )}
                      </span>
                      <div className="po_R flex-grow-1">
                        <label htmlFor="country">{pathOr("", [locale, "Branch", "country"], t)}</label>
                        <select
                          id="country"
                          className="form-control form-select"
                          {...register("countryId", { required: "This field is required" })}
                          onChange={(e) => {
                            handleCountries(e)
                          }}
                        >
                          <option disabled hidden value={0}>
                            {pathOr("", [locale, "Branch", "select"], t)}
                          </option>
                          {countries &&
                            countries
                              .filter(({ isActive }) => isActive)
                              .map(({ name, id }) => (
                                <option key={id} value={id}>
                                  {name}
                                </option>
                              ))}
                        </select>
                        {errors?.countryId && errors?.countryId?.message}
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="input-group" style={{ flexDirection: locale === "en" ? "row-reverse" : "row" }}>
                      <span
                        className="input-group-text"
                        id="basic-addon1"
                        style={{ borderTopRightRadius: "30px", borderBottomRightRadius: "30px" }}
                      >
                        <Image src={region} alt="region" />
                      </span>
                      <div className="po_R flex-grow-1">
                        <label htmlFor="region">{pathOr("", [locale, "Branch", "region"], t)}</label>
                        <select
                          id="region"
                          className="form-control form-select"
                          {...register("regionId", { required: "This field is required" })}
                          value={selectedBranch?.regionId}
                          onChange={(e) => {
                            handleRegions(e)
                          }}
                        >
                          <option disabled hidden value={0}>
                            {pathOr("", [locale, "Branch", "select"], t)}
                          </option>
                          {regions.map(({ name, id }) => (
                            <option key={id} value={id}>
                              {name}
                            </option>
                          ))}
                        </select>
                        {errors?.regionId && errors?.regionId?.message}
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="input-group" style={{ flexDirection: locale === "en" ? "row-reverse" : "row" }}>
                      <span
                        className="input-group-text"
                        id="basic-addon1"
                        style={{ borderTopRightRadius: "30px", borderBottomRightRadius: "30px" }}
                      >
                        <Image src={city} alt="city" />
                      </span>
                      <div className="po_R flex-grow-1">
                        <label htmlFor="neighbourhood">{pathOr("", [locale, "Branch", "neighbourhood"], t)}</label>
                        <select
                          id="neighbourhood"
                          className="form-control form-select"
                          {...register("neighborhoodId", { required: "This field is required" })}
                          value={selectedBranch?.neighborhoodId}
                          onChange={(e) => {
                            setValue("neighborhoodId", +e.target.value)
                          }}
                        >
                          <option disabled hidden value={0}>
                            {pathOr("", [locale, "Branch", "select"], t)}
                          </option>
                          {neighbourhoods.map(({ name, id }) => (
                            <option key={id} value={id}>
                              {name}
                            </option>
                          ))}
                        </select>
                        {errors?.neighborhoodId && errors?.neighborhoodId?.message}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <div className="po_R">
                      <label htmlFor="neighbourhoodName">
                        {pathOr("", [locale, "Branch", "neighbourhoodName"], t)}
                      </label>
                      <input
                        id="neighbourhoodName"
                        type="text"
                        {...register("location", { required: "This field is required" })}
                        className="form-control"
                      />
                    </div>
                    {errors?.location && errors?.location?.message}
                  </div>
                  <div className="form-group">
                    <div className="po_R">
                      <label htmlFor="streetName">{pathOr("", [locale, "Branch", "streetName"], t)}</label>
                      <input
                        id="streetName"
                        type="text"
                        {...register("streetName", { required: "This field is required" })}
                        className="form-control"
                      />
                    </div>
                    {errors?.streetName && errors?.streetName?.message}
                  </div>
                  <div className="form-group">
                    <div className="po_R">
                      <label htmlFor="regionCode">{pathOr("", [locale, "Branch", "regionCode"], t)}</label>
                      <input
                        id="regionCode"
                        type="text"
                        {...register("regionCode", {
                          required: "This field is required",
                          pattern: { value: "/^-?d+.?d*$/", message: "Invalid value" },
                        })}
                        className="form-control"
                      />
                    </div>
                    {errors.regionCode && <p>{errors?.regionCode?.message}</p>}
                  </div>
                </div>
              </div>
              <button type="submit" className="btn-main mt-3">
                {!id ? (locale === "en" ? "Add" : "اضافة") : locale === "en" ? "Edit" : "تعديل"}{" "}
                {pathOr("", [locale, "Branch", "branch"], t)}
              </button>
            </form>
            <DevTool control={control} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddBranch
