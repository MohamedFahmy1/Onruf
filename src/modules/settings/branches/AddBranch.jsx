import React, { useState, useEffect, useMemo } from "react"
import Router, { useRouter } from "next/router"
import { useForm } from "react-hook-form"
import axios from "axios"
import GoogleMaps from "../../../common/GoogleMaps"
import map from "../../../public/images/1366_2000.png"
import region from "../../../public/icons/neighboor.svg"
import city from "../../../public/icons/008-maps.svg"
import Link from "next/link"
import { toast } from "react-toastify"
import { pathOr } from "ramda"
import t from "../../../translations.json"
import { FaFlag } from "react-icons/fa"
import Image from "next/image"
const AddBranch = () => {
  const [neighbourhoods, setNeighbourhoods] = useState([])
  const [regions, setRegions] = useState([])
  const [selectedBranch, setSelectedBranch] = useState({})
  const [countries, setCountries] = useState()

  const id = +Router?.router?.state?.query?.id

  const getCountries = async () => {
    const {
      data: { data: countries },
    } = await axios(process.env.REACT_APP_API_URL + `/ListCountries?lang=${locale}`)
    setCountries(countries)
  }

  useEffect(() => {
    getCountries()
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm()
  const { locale } = useRouter()

  const getBranchById = async () => {
    try {
      const {
        data: { data },
      } = await axios(`${process.env.REACT_APP_API_URL}/GetBrancheById?id=${id}&lang=${locale}`)
      const {
        data: { data: neighborhoods },
      } = await axios(
        `${process.env.REACT_APP_API_URL}/ListNeighborhoodByRegionId?id=${data?.region?.id}&currentPage=1&lang=${locale}`,
      )
      const {
        data: { data: regions },
      } = await axios(
        `${process.env.REACT_APP_API_URL}/ListRegionsByCountryId?id=${data?.country?.id}&currentPage=1&lang=${locale}`,
      )

      setNeighbourhoods(neighborhoods)
      setRegions(regions)
      setSelectedBranch(data)

      reset({
        ...data,
        countryId: data?.country?.id,
        neighborhoodId: data?.neighborhood?.id,
        regionId: data?.region?.id,
      })
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (id) {
      getBranchById()
    }
  }, [id])

  useMemo(() => {
    reset({
      ...selectedBranch,
      countryId: selectedBranch?.country?.id,
      neighborhoodId: selectedBranch?.neighborhood?.id,
      regionId: selectedBranch?.region?.id,
    })
  }, [selectedBranch])

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
        await axios.put(process.env.REACT_APP_API_URL + "/EditBranche", formData)
        toast.success(locale === "en" ? "Branch has been edited successfully!" : "تم تعديل الفرع بنجاح")
      } else {
        await axios.post(process.env.REACT_APP_API_URL + "/AddBranche", formData)
        toast.success(locale === "en" ? "Branch has been created successfully!" : "تم انشاء الفرع بنجاح")
      }
      Router.push("/settings/branches")
    } catch (error) {
      console.error(error)
      toast.error(error.response.data.message)
    }
  }

  const handleFetchNeighbourhoodsOrRegions = async (url, id, setState) => {
    try {
      const {
        data: { data },
      } = await axios(`${process.env.REACT_APP_API_URL}/${url}?id=${id}&currentPage=1&lang=${locale}`)
      setState(data)
    } catch (error) {
      console.log({ error })
      setState([])
    }
  }

  useEffect(() => {
    const countryId = watch().countryId
    const regionId = watch().regionId
    if (countryId) {
      handleFetchNeighbourhoodsOrRegions("ListNeighborhoodByRegionId", regionId, setNeighbourhoods)
      handleFetchNeighbourhoodsOrRegions("ListRegionsByCountryId", countryId, setRegions)
    }
  }, [watch("countryId")])

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
            <a className="btn-main btn-main-o">{pathOr("", [locale, "Branch", "cancel"], t)}</a>
          </Link>
        </div>
        <div className="contint_paner">
          <div className="form-content">
            <form onSubmit={handleSubmit(createBranch)}>
              <div className="map mb-3">
                {/*<GoogleMaps isMarkerShown />*/}
                {/*<Image src={map} alt="map" height={500} />*/}
              </div>
              <div className="form-group">
                <label>{pathOr("", [locale, "Branch", "branchName"], t)}</label>
                <input
                  {...register("name", { required: "This field is required" })}
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
                      <span className="input-group-text" id="basic-addon1">
                        <FaFlag size={25} />
                      </span>
                      <div className="po_R flex-grow-1">
                        <label>{pathOr("", [locale, "Branch", "country"], t)}</label>
                        <select
                          className="form-control form-select"
                          {...register("countryId", { required: "This field is required" })}
                        >
                          <option disabled hidden value="">
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
                      <span className="input-group-text" id="basic-addon1">
                        <Image src={region} alt="region" />
                      </span>
                      <div className="po_R flex-grow-1">
                        <label>{pathOr("", [locale, "Branch", "region"], t)}</label>
                        <select
                          className="form-control form-select"
                          {...register("regionId", { required: "This field is required" })}
                        >
                          <option value="">{pathOr("", [locale, "Branch", "select"], t)}</option>
                          {regions
                            .filter(({ isActive }) => isActive)
                            .map(({ name, id }) => (
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
                      <span className="input-group-text" id="basic-addon1">
                        <Image src={city} alt="city" />
                      </span>
                      <div className="po_R flex-grow-1">
                        <label>{pathOr("", [locale, "Branch", "neighbourhood"], t)}</label>
                        <select
                          className="form-control form-select"
                          {...register("neighborhoodId", { required: "This field is required" })}
                        >
                          <option value="">{pathOr("", [locale, "Branch", "select"], t)}</option>
                          {neighbourhoods
                            .filter(({ isActive }) => isActive)
                            .map(({ name, id }) => (
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
                      <label>{pathOr("", [locale, "Branch", "neighbourhoodName"], t)}</label>
                      <input
                        type="text"
                        {...register("location", { required: "This field is required" })}
                        className="form-control"
                      />
                    </div>
                    {errors?.location && errors?.location?.message}
                  </div>

                  <div className="form-group">
                    <div className="po_R">
                      <label>{pathOr("", [locale, "Branch", "streetName"], t)}</label>
                      <input
                        type="text"
                        {...register("streetName", { required: "This field is required" })}
                        className="form-control"
                      />
                    </div>
                    {errors?.streetName && errors?.streetName?.message}
                  </div>
                  <div className="form-group">
                    <div className="po_R">
                      <label>{pathOr("", [locale, "Branch", "regionCode"], t)}</label>
                      <input
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
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddBranch
