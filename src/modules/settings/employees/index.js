import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import axios from "axios"
import { useRouter } from "next/router"
import { MdModeEdit } from "react-icons/md"
import { RiDeleteBin5Line } from "react-icons/ri"
import { pathOr } from "ramda"
import t from "../../../translations.json"
import Alerto from "../../../common/Alerto"
import { toast } from "react-toastify"
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io"

const Employees = () => {
  const [employees, setEmployees] = useState([])
  const {
    locale,
    push,
    query: { page },
  } = useRouter()
  const inputRef = useRef(null)
  const [filter, setFilter] = useState(false)

  const handleFetchEmployees = async (pageIndex = 1, PageRowsCount = 10) => {
    try {
      const { data } = await axios.get(process.env.REACT_APP_API_URL + "/GetAllBusinessAccountEmployees", {
        params: {
          pageIndex,
          PageRowsCount,
        },
      })
      setEmployees(data.data)
    } catch (error) {
      Alerto(error)
    }
  }

  const handleDeleteEmployee = async (employeeId) => {
    try {
      const result = await axios.delete(process.env.REACT_APP_API_URL + "/DeleteBusinessAccountEmployee", {
        params: { employeeId },
      })
      handleFetchEmployees(1)
      toast.success(locale === "en" ? "Employee data has been Deleted!" : "تم مسح بيانات الموظف")
    } catch (error) {
      Alerto(error)
    }
  }

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
    return employees?.map((employee) => (
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
            <div className="form-check form-switch p-0 m-0">
              <Link href={`employees/add/${employee.id}`}>
                <a aria-label="Edit Employee">
                  <MdModeEdit className="btn_Measures pointer" />
                </a>
              </Link>
              <RiDeleteBin5Line className="btn_Measures pointer" onClick={() => handleDeleteEmployee(employee.id)} />
              <label htmlFor={`flexSwitchCheckChecked${employee.id}`} className="visually-hidden">
                Change employee status
              </label>
              <input
                className="form-check-input m-0"
                type="checkbox"
                role="switch"
                id={`flexSwitchCheckChecked${employee.id}`}
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

  return (
    <article className="body-content">
      <section className="d-flex align-items-center justify-content-between mb-4 gap-2 flex-wrap">
        <h6 className="f-b m-0">
          {pathOr("", [locale, "Employee", "employees"], t)} ({employees?.length})
        </h6>
        <Link href="/settings/employees/add">
          <a aria-label="add employee" className="btn-main">
            {pathOr("", [locale, "Employee", "addEmployee"], t)}
            <i className="fas fa-plus-circle font-18"></i>
          </a>
        </Link>
      </section>
      <section className="d-flex">
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
      </section>
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
      <section className="contint_paner">
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
        <section aria-label="Page navigation example" className="mt-3">
          <ul className="pagination justify-content-center">
            <li className="page-item">
              <button type="button" className="page-link" aria-label="Next">
                <i className="fas fa-chevron-left" onClick={() => handleTableNextPrevPage("prev")}>
                  {locale === "en" ? <IoIosArrowBack /> : <IoIosArrowForward />}
                </i>
              </button>
            </li>
            <li className="page-item">
              <button type="button" className="page-link" aria-label="Previous">
                <i className="fas fa-chevron-right" onClick={handleTableNextPrevPage}>
                  {locale === "en" ? <IoIosArrowForward /> : <IoIosArrowBack />}
                </i>
              </button>
            </li>
          </ul>
        </section>
      </section>
    </article>
  )
}

export default Employees
