import { Box, Chip, FormControl, MenuItem, OutlinedInput, Select } from "@mui/material"
import Link from "next/link"
import { useState } from "react"
import { useForm } from "react-hook-form"
import styles from "../../../styles/AddEmployee.module.css"
import { useRouter } from "next/router"
import axios from "axios"
import { pathOr } from "ramda"
import t from "../../../translations.json"
import { toast } from "react-toastify"
import { useFetch } from "../../../hooks/useFetch"

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
  const {
    locale,
    push,
    query: { id },
  } = useRouter()
  const [selectedRoles, setSelectedRoles] = useState([])
  const { data: branches = [] } = useFetch(`/GetListBranche?lang=${locale}`)
  const { data: userData } = useFetch(`/GetBusinessAccountEmployeeById?employeeId=${id}`, true)
  const { data: roles = [] } = useFetch(`/GetBusinessAccountRoles?lang=${locale}`)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const handleFormErrors = (name) => {
    return <h2 className={styles.formError}>{errors[name] && errors[name].message}</h2>
  }

  const handleEditEmployee = async ({ userName, mobileNumber, email, branchId }) => {
    try {
      const result = await axios.post("/AddEditBusinessAccountEmployee", {
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
  if (!userData) {
    return
  }

  return (
    <article className="body-content">
      <section className="d-flex align-items-center justify-content-between mb-4 gap-2 flex-wrap">
        <h6 className="f-b m-0"> {pathOr("", [locale, "Employee", "editEmployee"], t)}</h6>
        <Link href="/settings/employees">
          <a aria-label="cancel" className="btn-main btn-main-o">
            {pathOr("", [locale, "Employee", "cancel"], t)}
          </a>
        </Link>
      </section>
      <section className="contint_paner">
        <div className="form-content">
          <form onSubmit={handleSubmit(handleEditEmployee)}>
            <div className="form-group">
              <label htmlFor="employeeName">{pathOr("", [locale, "Employee", "employeeName"], t)}</label>
              <input
                id="employeeName"
                {...register("userName", { required: "This field is required", value: userData?.userName })}
                type="text"
                className="form-control"
                placeholder={pathOr("", [locale, "Employee", "employeeName"], t)}
                readOnly
              />
              {handleFormErrors("userName")}
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="phone">{pathOr("", [locale, "Users", "phone"], t)}</label>
                  <input
                    id="phone"
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
                  <label htmlFor="email">{pathOr("", [locale, "Users", "email"], t)}</label>
                  <input
                    id="email"
                    {...register("email", { required: "This field is required", value: userData?.email })}
                    type="email"
                    className="form-control"
                    readOnly
                  />
                  {handleFormErrors("email")}
                </div>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="branch">{pathOr("", [locale, "Employee", "branch"], t)}</label>
              <select
                id="branch"
                {...register("branchId", { required: "This field is required", value: userData?.branchId })}
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
                  onChange={({ target: { value } }) => {
                    setSelectedRoles(value)
                  }}
                  labelId="selectedRoles-label"
                  id="selectedRoles"
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
              {pathOr("", [locale, "Employee", "editEmployee"], t)}{" "}
            </button>
          </form>
        </div>
      </section>
    </article>
  )
}

export default EditEmployee
