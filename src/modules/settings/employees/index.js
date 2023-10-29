import React, { useEffect, useRef, useState } from "react"
import Link from "next/link"
import axios from "axios"
import { useRouter } from "next/router"
import { MdModeEdit } from "react-icons/md"
import { RiDeleteBin5Line } from "react-icons/ri"
import { pathOr } from "ramda"
import t from "../../../translations.json"
import Alerto from "../../../common/Alerto"
import SimpleSnackbar from "../../../common/SnackBar"
import { toast } from "react-toastify"
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io"

const Employees = () => {
  const [employees, setEmployees] = useState([])
  const { locale, push, query } = useRouter()
  const { page } = query
  const inputRef = useRef(null)
  const [filter, setFilter] = useState(false)

  // Get all business employees, also handle page params if exsisted
  const handleFetchEmployees = async (pageIndex = 1, PageRowsCount = 10) => {
    const { data } = await axios.get(process.env.REACT_APP_API_URL + "/GetAllBusinessAccountEmployees", {
      params: {
        pageIndex,
        PageRowsCount,
      },
    })
    console.log(data.data)
    setEmployees(data.data)
  }

  // Handle delete employee
  const handleDeleteEmployee = async (employeeId) => {
    try {
      const result = await axios.delete(process.env.REACT_APP_API_URL + "/DeleteBusinessAccountEmployee", {
        params: { employeeId },
      })
      handleFetchEmployees(1)
      toast.success(locale === "en" ? "Employee data has been Deleted!" : "تم مسح بيانات الموظف")
    } catch (error) {}
  }

  // Handle employee status change
  const handleChangeEmployeeStatus = async (employeeId, isActive) => {
    try {
      const result = await axios.post(
        process.env.REACT_APP_API_URL +
          `/ChangeBusinessAccountEmployeeStatus?employeeId=${employeeId}&isActive=${isActive}`,
      )
      toast.success(locale === "en" ? "Employee data changed successfully!" : "تم تغيير بيانات الموظف")
    } catch (error) {
      Alerto(error)
    }
  }

  // Handle table next page
  const handleTableNextPrevPage = (state) => {
    const currentPage = parseInt(page)
    const newPage = state === "prev" ? currentPage - 1 : currentPage + 1
    if (newPage < 1) {
      return
    }
    if (employees.length === 0 && state !== "prev") {
      return push({ query: { page: currentPage } })
    }
    push({ query: { page: newPage } })
  }
  // Render all fetched employees to the screen
  const renderedEmployees = () => {
    return employees?.map((employee, idx) => (
      <tr key={employee.id}>
        <td>
          <div className="f-b">{employee.userName}</div>
        </td>
        <td>
          <div className="f-b">{employee.email}</div>
        </td>
        <td>
          <div className="f-b">{employee.mobileNumber}</div>
        </td>
        <td>
          <div className="f-b">
            {employee.employeeRoles.map((item, index) => {
              if (index === employee.employeeRoles.length - 1) {
                return ` ${item.roleName}.`
              } else return ` ${item.roleName} -`
            })}
          </div>
        </td>
        <td>
          <div className="d-flex align-items-center gap-2">
            <button type="button" className="btn_Measures">
              <i className="fas fa-trash-alt"></i>
            </button>
            <div className="form-check form-switch p-0 m-0">
              <MdModeEdit className="btn_Measures" onClick={() => push({ pathname: `employees/add/${employee.id}` })} />
              <RiDeleteBin5Line className="btn_Measures" onClick={() => handleDeleteEmployee(employee.id)} />
              <input
                className="form-check-input m-0"
                type="checkbox"
                role="switch"
                id="flexSwitchCheckChecked"
                defaultChecked={employee.isActive}
                onChange={(e) => {
                  handleChangeEmployeeStatus(employee.id, e.target.checked)
                }}
              />
            </div>
          </div>
        </td>
      </tr>
    ))
  }
  const filterEmployees = () => {
    const filtered = employees.filter((employee) =>
      employee.employeeRoles?.some((role) =>
        role.roleName?.toLowerCase().includes(inputRef.current.value.toLowerCase()),
      ),
    )
    setFilter(true)
    setEmployees(filtered)
  }

  useEffect(() => {
    handleFetchEmployees(page)
    return () => {
      setEmployees([])
    }
  }, [page])

  console.log(employees)
  return (
    <div className="body-content">
      <div>
        <div className="d-flex align-items-center justify-content-between mb-4 gap-2 flex-wrap">
          <h6 className="f-b m-0">
            {pathOr("", [locale, "Employee", "employees"], t)} ({employees?.length})
          </h6>
          <Link href="/settings/employees/add">
            <a className="btn-main">
              {pathOr("", [locale, "Employee", "addEmployee"], t)}
              <i className="fas fa-plus-circle font-18"></i>
            </a>
          </Link>
        </div>
        <div className="d-flex">
          <div className="filtter_2">
            <input
              className="form-control rounded-0"
              placeholder={pathOr("", [locale, "Employee", "filterByRole"], t)}
              ref={inputRef}
            />
            <button className="btn-main rounded-0" onClick={filterEmployees}>
              {pathOr("", [locale, "Users", "filter"], t)}
            </button>
          </div>
        </div>
        {filter && (
          <button
            className="btn-main d-flex mt-3 justifiy-content-center"
            onClick={() => {
              handleFetchEmployees(1, 10)
              setFilter(false)
              inputRef.current.value = ""
            }}
          >
            {pathOr("", [locale, "Users", "resetFilter"], t)}
          </button>
        )}
        <div className="contint_paner">
          <div className="outer_table">
            <table className="table table_dash">
              <thead>
                <tr>
                  <th>{pathOr("", [locale, "Users", "username"], t)}</th>
                  <th>{pathOr("", [locale, "Users", "email"], t)}</th>
                  <th>{pathOr("", [locale, "Users", "phone"], t)}</th>
                  <th>{pathOr("", [locale, "Employee", "role"], t)}</th>
                  <th>{pathOr("", [locale, "Employee", "actions"], t)}</th>
                </tr>
              </thead>
              <tbody>{employees.length > 0 && renderedEmployees()}</tbody>
            </table>
            {!employees.length > 0 && <p className="text-center f-b fs-5">No Data To Show!</p>}
          </div>
          <nav aria-label="Page navigation example" className="mt-3">
            <ul className="pagination justify-content-center">
              <li className="page-item">
                <a className="page-link" aria-label="Next">
                  <i className="fas fa-chevron-left" onClick={() => handleTableNextPrevPage("prev")}>
                    {locale === "en" ? <IoIosArrowBack /> : <IoIosArrowForward />}
                  </i>
                </a>
              </li>
              {/*[1, 2, 3].map((pageIdx) => (
              <li key={pageIdx} className="page-item">
                  <a
                    className={pageIdx == page ? "page-link active" : "page-link"}
                    onClick={() => push({ query: { page: pageIdx } })}
                  >
                    {pageIdx}
                    </a>
                    </li>
                  ))*/}
              <li className="page-item">
                <a className="page-link" aria-label="Previous">
                  <i className="fas fa-chevron-right" onClick={handleTableNextPrevPage}>
                    {locale === "en" ? <IoIosArrowForward /> : <IoIosArrowBack />}
                  </i>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  )
}

export default Employees
