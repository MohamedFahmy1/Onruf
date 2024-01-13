import React, { useState, useMemo } from "react"
import Table from "../../../../common/table"
import Pagination from "./../../../../common/pagination"
import Router, { useRouter } from "next/router"
import { pathOr } from "ramda"
import Link from "next/link"
import axios from "axios"
import { toast } from "react-toastify"
import { AiFillFolderOpen } from "react-icons/ai"
import t from "../../../../translations.json"
import Alerto from "../../../../common/Alerto"
import { useFetch } from "../../../../hooks/useFetch"
import { formatDate } from "../../../../common/functions"
import ResponsiveImage from "../../../../common/ResponsiveImage"

const SingleFolder = () => {
  const [selectedRows, setSelectedRows] = useState({})
  const { locale } = useRouter()
  const router = useRouter()
  const folderId = router.query.id
  const { data: users, fetchData: getFolderUsers } = useFetch(`/GetFolderById?id=${folderId}&lang=${locale}`, true)
  const rows = Object.keys(selectedRows)
  const selectedUsersIds = rows.map((row) => {
    const selectedRow = users?.listUser.filter((_, index) => index === +row)
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
      Alerto(error)
    }
  }

  const columns = useMemo(
    () => [
      {
        Header: pathOr("", [locale, "Users", "username"], t),
        accessor: "userName",
        Cell: ({
          row: {
            original: { img, userName, id },
          },
        }) => (
          <button onClick={() => Router.push(`/users/${id}`)} className="d-flex align-items-center">
            <ResponsiveImage
              imageSrc={img.includes("http") ? img.replace("http", "https") : img}
              alt={"client"}
              width="75px"
              height="75px"
            />
            <div className="f-b mx-3">{userName}</div>
          </button>
        ),
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
        Header: pathOr("", [locale, "Users", "memberSince"], t),
        accessor: "memberSince",
        Cell: ({
          row: {
            original: { createdAt },
          },
        }) => <div className="f-b">{formatDate(createdAt)}</div>,
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
              {pathOr("", [locale, "Users", "users"], t)} ({users?.listUser.length})
            </h6>
            <Link href="/users/folders">
              <a aria-label={pathOr("", [locale, "Users", "browse"], t)} className="btn-main btn-main-w mr-20">
                {pathOr("", [locale, "Users", "browse"], t)} <AiFillFolderOpen />{" "}
              </a>
            </Link>
          </div>
        </div>
        <div className="contint_paner">
          <div className="outer_table">
            {users && (
              <Table
                columns={columns}
                data={users && users.listUser}
                selectedRows={selectedRows}
                pageSize={10}
                onSelectedRowsChange={setSelectedRows}
              />
            )}
          </div>
        </div>
        {users?.listUser.length > 10 && <Pagination listLength={users?.listUser.length} pageSize={10} />}
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
