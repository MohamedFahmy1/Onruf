import { Box, Chip, FormControl, MenuItem, OutlinedInput, Select } from "@mui/material"
import Link from "next/link"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/router"
import axios from "axios"
import { pathOr } from "ramda"
import t from "../../../translations.json"
import { toast } from "react-toastify"
import { handleFormErrors } from "../../../common/functions"
import { useFetch } from "../../../hooks/useFetch.js"

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
  const { locale, push } = useRouter()
  const [selectedRoles, setSelectedRoles] = useState([])
  const { data: branches = [] } = useFetch(`/GetListBranche?lang=${locale}`)
  const { data: roles = [] } = useFetch(`/GetBusinessAccountRoles?lang=${locale}`)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  // Submitting Employee To Endpoint
  const handleAddEmployee = async ({ userName, mobileNumber, email, branchId }) => {
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

  return (
    <div className="body-content">
      <div className="d-flex align-items-center justify-content-between mb-4 gap-2 flex-wrap">
        <h6 className="f-b m-0"> {pathOr("", [locale, "Employee", "addEmployee"], t)}</h6>
        <Link href="/settings/employees">
          <a aria-label="cancel" className="btn-main btn-main-o">
            {pathOr("", [locale, "Employee", "cancel"], t)}
          </a>
        </Link>
      </div>
      <div className="contint_paner">
        <div className="form-content">
          <form onSubmit={handleSubmit(handleAddEmployee)}>
            <div className="form-group">
              <label htmlFor="employeeName">{pathOr("", [locale, "Employee", "employeeName"], t)}</label>
              <input
                id="employeeName"
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
                  <label htmlFor="phone">{pathOr("", [locale, "Users", "phone"], t)}</label>
                  <input
                    id="phone"
                    {...register("mobileNumber", { required: "Phone number is a required field" })}
                    type="tel"
                    className="form-control"
                  />
                  <p className="errorMsg">{handleFormErrors(errors, "mobileNumber")}</p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="email">{pathOr("", [locale, "Users", "email"], t)}</label>
                  <input
                    id="email"
                    {...register("email", { required: "Email is a required field" })}
                    type="email"
                    className="form-control"
                  />
                  <p className="errorMsg">{handleFormErrors(errors, "email")}</p>
                </div>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="branch">{pathOr("", [locale, "Employee", "branch"], t)}</label>
              <select id="branch" {...register("branchId")} className="form-control form-select">
                {branches?.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
              {handleFormErrors("branchId")}
            </div>
            <div className="form-group">
              <label id="selectedRoles-label">{pathOr("", [locale, "Employee", "role"], t)}</label>
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
                  labelId="selectedRoles-label"
                  id="selectedRoles"
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
  )
}

export default AddEmployee
