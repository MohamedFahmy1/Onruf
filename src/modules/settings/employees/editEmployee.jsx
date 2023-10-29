import { Box, Chip, FormControl, MenuItem, OutlinedInput, Select } from "@mui/material"
import Link from "next/link"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import styles from "../../../styles/AddEmployee.module.css"
import { useRouter } from "next/router"
import axios from "axios"
import { pathOr } from "ramda"
import t from "../../../translations.json"
import { toast } from "react-toastify"

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

const EditEmployee = () => {
  // state to carry multi-roles
  const [selectedRoles, setSelectedRoles] = useState([])

  const [userData, setUserData] = useState(null)
  const [roles, setRoles] = useState([])
  const [branches, setBranches] = useState([])

  const { locale, push, query } = useRouter()
  const { id } = query

  // Handle Employee Form using useForm Hook
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  // Reusable Error Generator
  const handleFormErrors = (name) => {
    return <h2 className={styles.formError}>{errors[name] && errors[name].message}</h2>
  }

  // Submitting Edit Employee To Endpoint
  const handleEditEmployee = async ({ userName, mobileNumber, email, branchId }) => {
    try {
      const result = await axios.post(process.env.REACT_APP_API_URL + "/AddEditBusinessAccountEmployee", {
        userName,
        mobileNumber,
        email,
        branchId: parseInt(branchId),
        businessAccountEmployeeRoles: selectedRoles.map((role) => ({
          roleId: role.id,
        })),
        id: parseInt(id),
      })
      const {
        data: { status_code },
      } = result

      if (status_code === 200) {
        toast.success(locale === "en" ? "Employee Data Edited Successfully!" : "!تم تعديل معلومات الموظف")
        push("/settings/employees")
      }
    } catch (error) {
      toast.error(
        locale === "en"
          ? "Please recheck the data of your employee and try again!"
          : "!الرجاء التحقق من معلومات الموظف و اعادة المحاولة",
      )
    }
  }

  const fetchData = async () => {
    // Fetch user data from external API

    const { data: userData } = await axios.get(process.env.REACT_APP_API_URL + "/GetBusinessAccountEmployeeById", {
      params: { employeeId: id },
    })

    // Fetch branches data from external API
    const { data: branchData } = await axios.get(process.env.REACT_APP_API_URL + "/GetListBranche", {
      params: { lang: "en" },
    })

    // Fetch roles data from external API
    const { data: rolesData } = await axios.get(process.env.REACT_APP_API_URL + "/GetBusinessAccountRoles", {
      params: { lang: "en" },
    })

    setUserData(userData?.data)
    setBranches(branchData?.data)
    setRoles(rolesData?.data)
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (!userData) return "Loading..."

  return (
    <div className="body-content">
      <div>
        <div className="d-flex align-items-center justify-content-between mb-4 gap-2 flex-wrap">
          <h6 className="f-b m-0"> {pathOr("", [locale, "Employee", "addEmployee"], t)}</h6>
          <Link href="/settings/employees">
            <a className="btn-main btn-main-o">{pathOr("", [locale, "Employee", "cancel"], t)}</a>
          </Link>
        </div>
        <div className="contint_paner">
          <div className="form-content">
            <form onSubmit={handleSubmit(handleEditEmployee)}>
              <div className="form-group">
                <label>{pathOr("", [locale, "Users", "username"], t)}</label>
                <input
                  {...register("userName", { required: "This field is required", value: userData?.userName })}
                  type="text"
                  className="form-control"
                  placeholder={pathOr("", [locale, "Users", "username"], t)}
                  readOnly
                />
                {handleFormErrors("userName")}
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label>{pathOr("", [locale, "Users", "phone"], t)}</label>
                    <input
                      {...register("mobileNumber", {
                        required: "This field is required",
                        value: userData?.mobileNumber,
                      })}
                      type="tel"
                      className="form-control"
                      readOnly
                    />
                    {handleFormErrors("mobileNumber")}
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <label>{pathOr("", [locale, "Users", "email"], t)}</label>
                    <input
                      {...register("email", { required: "This field is required", value: userData.email })}
                      type="email"
                      className="form-control"
                      readOnly
                    />
                    {handleFormErrors("email")}
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>{pathOr("", [locale, "Employee", "branch"], t)}</label>
                <select
                  {...register("branchId", { required: "This field is required", value: userData.branchId })}
                  className="form-control form-select"
                >
                  {branches?.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name}
                    </option>
                  ))}
                </select>
                {handleFormErrors("branchId")}
              </div>

              <div className="form-group">
                <label>{pathOr("", [locale, "Employee", "role"], t)}</label>
                <FormControl
                  sx={{
                    m: 1,
                    width: "100%",
                    fontSize: "1rem",
                    fontWeight: "400",
                    lineHeight: 1.5,
                    color: "#495057",
                    backgroundColor: "#fff`",
                    border: "1px solid #ced4da",
                    borderRadius: "50px !important",
                    textIndent: 10,
                  }}
                  className="no-outline"
                >
                  <Select
                    multiple
                    value={selectedRoles}
                    onChange={({ target: { value } }) => {
                      setSelectedRoles(value)
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
                    {roles.map((role) => (
                      <MenuItem key={role.id} value={role}>
                        {role.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              <button className="btn-main mt-3" type="submit">
                {pathOr("", [locale, "Employee", "addEmployee"], t)}{" "}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditEmployee
