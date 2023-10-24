import React, { useId } from "react"
import { useTable, useRowSelect, useMountedLayoutEffect } from "react-table"
import Checkbox from "./tableCheckbox"
import Router from "next/router"

const Table = ({
  columns,
  data = [],
  pageSize = 10,
  isCheckbox = true,
  selectedRows = {},
  onSelectedRowsChange = () => null,
}) => {
  const id = useId()
  const route = Router?.router?.state
  const page = +route?.query?.page || 1
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    selectedFlatRows,
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
      isCheckbox
        ? hooks.visibleColumns.push((columns) => [
            {
              id: "selection",
              Header: ({ getToggleAllRowsSelectedProps }) => <Checkbox {...getToggleAllRowsSelectedProps()} />,
              Cell: ({ row }) => {
                return <Checkbox {...row.getToggleRowSelectedProps()} />
              },
            },
            ...columns,
          ])
        : null
    },
  )

  useMountedLayoutEffect(() => {
    onSelectedRowsChange && onSelectedRowsChange(selectedRowIds)
  }, [onSelectedRowsChange, selectedRowIds])

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
        {rows?.length ? (
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
              <b>No data found</b>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  )
}

export default Table
