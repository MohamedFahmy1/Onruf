// Table.js
import React, { useState, useEffect } from "react"
import { useTable, useRowSelect, useMountedLayoutEffect } from "react-table"
import Checkbox from "./tableCheckbox"
import { useRouter } from "next/router"
import { pathOr } from "ramda"
import t from "../translations.json"

const Table = ({
  columns,
  data = [],
  pageSize = 10,
  isCheckbox = true,
  selectedRows = {},
  onSelectedRowsChange = () => null,
}) => {
  const [isLoading, setIsLoading] = useState(true)
  const { locale, query } = useRouter()
  const page = parseInt(query.page, 10) || 1

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state: { selectedRowIds },
  } = useTable(
    {
      columns,
      data,
      getRowId: (row) => row.orderId || row.id || row.orderMasterId,
      initialState: {
        selectedRowIds: selectedRows,
      },
    },
    useRowSelect,
    (hooks) => {
      if (isCheckbox) {
        hooks.visibleColumns.push((columns) => [
          {
            id: "selection",
            Header: ({ getToggleAllRowsSelectedProps }) => <Checkbox {...getToggleAllRowsSelectedProps()} />,
            Cell: ({ row }) => {
              return <Checkbox {...row.getToggleRowSelectedProps()} />
            },
          },
          ...columns,
        ])
      }
    },
  )

  useMountedLayoutEffect(() => {
    onSelectedRowsChange && onSelectedRowsChange(selectedRowIds)
  }, [onSelectedRowsChange, selectedRowIds])

  useEffect(() => {
    if (data.length > 0 || !Array.isArray(data)) {
      setIsLoading(false)
    }

    return () => {
      setIsLoading(false)
    }
  }, [data])

  return (
    <table className="table table_dash" {...getTableProps()}>
      <thead>
        {headerGroups?.map((headerGroup, index) => (
          <tr {...headerGroup.getHeaderGroupProps()} key={index}>
            {headerGroup?.headers?.map((column) => (
              <th key={column.id} {...column.getHeaderProps()}>
                {column.render("Header")}
              </th>
            ))}
          </tr>
        ))}
      </thead>

      <tbody {...getTableBodyProps()}>
        {isLoading ? (
          <tr>
            <td className="text-center" rowSpan={3} colSpan={8}>
              <b>{locale === "en" ? "Loading..." : "جاري التحميل..."}</b>
            </td>
          </tr>
        ) : rows?.length ? (
          rows?.slice((page - 1) * pageSize, page * pageSize).map((row) => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()} key={row.id}>
                {row?.cells?.map((cell) => (
                  <td {...cell.getCellProps()} key={cell.column.id}>
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
            )
          })
        ) : (
          <tr>
            <td className="text-center" rowSpan={3} colSpan={8}>
              <b>{pathOr("", [locale, "Products", "NoDataFound"], t)}</b>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  )
}

export default Table
