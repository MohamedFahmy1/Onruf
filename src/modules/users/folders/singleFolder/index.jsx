import React, { useState, useMemo, useEffect } from "react"
import Table from "../../../../common/table"
import Pagination from "./../../../../common/pagination"
import Router, { useRouter } from "next/router"
import { propOr, pathOr } from "ramda"
import Link from "next/link"
import axios from "axios"
import { toast } from "react-toastify"
import { AiFillFolderOpen } from "react-icons/ai"
import t from "../../../../translations.json"
const SingleFolder = () => {
  const [users, setUsers] = useState()
  const [selectedRows, setSelectedRows] = useState({})
  const { locale } = useRouter()
  const router = useRouter()
  const folderId = router.query.id

  const rows = Object.keys(selectedRows)
  const selectedUsersIds = rows.map((row) => {
    const selectedRow = users?.filter((_, index) => index === +row)
    return `${selectedRow[0]?.id}`
  })

  const handleRemoveUserFromFolder = async () => {
    if (!selectedUsersIds?.length)
      return toast.warning(locale === "en" ? "No user was selected!" : "من فضلك قم بأضافة المنتجات")
    try {
      await axios.delete(process.env.REACT_APP_API_URL + `/RemoveListUsersFolder`, {
        data: {
          folderId: folderId,
          usersIds: selectedUsersIds,
        },
      })

      toast.success(locale === "en" ? "user has been deleted successfully!" : "تم حذف المنتج بنجاح")
      setSelectedRows({})
      getFolderUsers()
    } catch (error) {
      console.error(error)
      toast.error(error.response.data.message)
    }
  }

  const getFolderUsers = async () => {
    const { data: usersData } = await axios(
      `${process.env.REACT_APP_API_URL}/GetFolderById?id=${folderId}&lang=${locale}`,
    )
    setUsers(usersData.data.listUser)
  }

  useEffect(() => {
    getFolderUsers()
  }, [])

  const columns = useMemo(
    () => [
      {
        Header: pathOr("", [locale, "Users", "username"], t),
        accessor: "name",
        Cell: ({
          row: {
            original: { img, name, id },
          },
        }) => (
          <div className="d-flex align-items-center">
            <img
              src={img}
              className="img_table img_table2 cursor-pointer"
              onClick={() => Router.push(`/users/${id}`)}
            />
            <div className="f-b">{name}</div>
          </div>
        ),
      },
      {
        Header: pathOr("", [locale, "Users", "email"], t),
        accessor: "email",
        Cell: ({
          row: {
            original: { email },
          },
        }) => <div className="f-b">{email}</div>,
      },
      {
        Header: pathOr("", [locale, "Users", "phone"], t),
        accessor: "phone",
        Cell: ({
          row: {
            original: { phone },
          },
        }) => <div className="f-b">{phone}</div>,
      },
    ],
    [locale],
  )

  return (
    <div className="body-content" style={{ padding: 30 }}>
      <div>
        <div className="d-flex align-items-center justify-content-between mb-4 gap-2 flex-wrap">
          <div className="d-flex align-items-center">
            <h6 className="f-b m-0">
              {pathOr("", [locale, "Users", "users"], t)} ({users?.length})
            </h6>
            <Link href="/users/folders">
              <a className="btn-main btn-main-w mr-20">
                {pathOr("", [locale, "Users", "browse"], t)} <AiFillFolderOpen />{" "}
              </a>
            </Link>
          </div>
        </div>

        <div className="contint_paner">
          <div className="outer_table">
            <Table columns={columns} data={users} selectedRows={selectedRows} onSelectedRowsChange={setSelectedRows} />
          </div>
        </div>

        <div className="btns_fixeds">
          <button className="btn-main rounded-0" onClick={() => handleRemoveUserFromFolder(selectedUsersIds)}>
            {pathOr("", [locale, "Users", "removeClient"], t)}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SingleFolder
