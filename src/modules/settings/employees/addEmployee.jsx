import { Box, Chip, FormControl, MenuItem, OutlinedInput, Select } from "@mui/material"
import Link from "next/link"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import styles from "../../../styles/AddEmployee.module.css"
import { useRouter } from "next/router"
import axios from "axios"
import { pathOr } from "ramda"
import t from "../../../translations.json"
import Alerto from "../../../common/Alerto.js"
import SimpleSnackbar from "../../../common/SnackBar"
import { toast } from "react-toastify"
import { handleFormErrors } from "../../../common/functions"

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

const AddEmployee = () => {
  // state to carry multi-roles
  const [selectedRoles, setSelectedRoles] = useState([])
  const [roles, setRoles] = useState([])
  const [branches, setBranches] = useState([])

  // Next Router
  const { locale, push } = useRouter()

  // Handle Employee Form using useForm Hook
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm()

  // Submitting Employee To Endpoint
  const handleAddEmployee = async ({ userName, mobileNumber, email, branchId }) => {
    // const formData = new FormData();
    // formData.append("userName",userName);
    // formData.append("mobileNumber",mobileNumber);
    // formData.append("email",email);
    // formData.append("branchId",branchId);

    try {
      const result = await axios.post(
        process.env.REACT_APP_API_URL + "/AddEditBusinessAccountEmployee",
        {
          userName,
          mobileNumber,
          email,
          branchId,
          businessAccountEmployeeRoles: selectedRoles.map((role) => ({
            roleId: role.id,
          })),
        },
        { params: { lang: "en" } },
      )
      const {
        data: { status_code },
      } = result
      push("/settings/employees")
      toast.success(locale === "en" ? "Employee Added" : "تم اضافة الموظف")
    } catch (e) {
      toast.error(
        locale === "en"
          ? "Please recheck the data of your employee and try again!"
          : "!الرجاء التحقق من معلومات الموظف و اعادة المحاولة",
      )
    }
  }

  const fetchData = async () => {
    const { data: branchData } = await axios.get(process.env.REACT_APP_API_URL + "/GetListBranche", {
      params: { lang: "en" },
    })

    // Fetch roles data from external API
    const { data: rolesData } = await axios.get(process.env.REACT_APP_API_URL + "/GetBusinessAccountRoles", {
      params: { lang: "en" },
    })

    setRoles(rolesData?.data)
    setBranches(branchData?.data)
  }

  useEffect(() => {
    fetchData()
  }, [])

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
            <form onSubmit={handleSubmit(handleAddEmployee)}>
              <div className="form-group">
                <label>{pathOr("", [locale, "Employee", "employeeName"], t)}</label>
                <input
                  {...register("userName", { required: "Username is a required field" })}
                  type="text"
                  className="form-control"
                  placeholder={pathOr("", [locale, "Employee", "employeeName"], t)}
                />
                <p className="errorMsg">{handleFormErrors(errors, "userName")}</p>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label>{pathOr("", [locale, "Users", "phone"], t)}</label>
                    <input
                      {...register("mobileNumber", { required: "Phone number is a required field" })}
                      type="tel"
                      className="form-control"
                    />
                    <p className="errorMsg">{handleFormErrors(errors, "mobileNumber")}</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>{pathOr("", [locale, "Users", "email"], t)}</label>
                    <input
                      {...register("email", { required: "Email is a required field" })}
                      type="email"
                      className="form-control"
                    />
                    <p className="errorMsg">{handleFormErrors(errors, "email")}</p>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label>{pathOr("", [locale, "Employee", "branch"], t)}</label>
                <select {...register("branchId")} className="form-control form-select">
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
                    backgroundColor: "#fff",
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
                    {roles?.map((role) => (
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

export default AddEmployee
