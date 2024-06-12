import React, { useState, useEffect, useId } from "react"
import { useTable, useRowSelect, useMountedLayoutEffect } from "react-table"
import Checkbox from "./tableCheckbox"
import Router, { useRouter } from "next/router"
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
  const id = useId()
  const route = Router?.router?.state
  const page = +route?.query?.page || 1
  const { locale } = useRouter()

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
      initialState: {
        selectedRowIds: selectedRows,
      },
    },
    useRowSelect,
    (hooks) => {
      isCheckbox &&
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
    },
  )

  useMountedLayoutEffect(() => {
    onSelectedRowsChange && onSelectedRowsChange(selectedRowIds)
  }, [onSelectedRowsChange, selectedRowIds])

  useEffect(() => {
    if (data.length > 0 || !Array.isArray(data)) {
      setIsLoading(false)
    }
  }, [data])

  return (
    <table className="table table_dash" {...getTableProps()}>
      <thead>
        {headerGroups?.map((headerGroup, index) => (
          <tr {...headerGroup.getHeaderGroupProps()} key={index}>
            {headerGroup?.headers?.map((column) => (
              <th key={id} {...column.getHeaderProps()}>
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
          rows?.slice((page - 1) * pageSize, page * pageSize).map((row, i) => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()} key={Math.random()}>
                {row?.cells?.map((cell, index) => (
                  <td {...cell.getCellProps()} key={index}>
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
