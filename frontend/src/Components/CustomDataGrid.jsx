import React, { useState, useMemo } from "react";
import "../css/CustomDataGrid.css";

const ROWS_PER_PAGE_OPTIONS = [5, 10, 25];

const CustomDataGrid = ({
  columns,
  data,
  checkboxSelection = false,
  onRowSelection,
  pagination,
}) => {
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [selectedRows, setSelectedRows] = useState([]);
  const [pageSize, setPageSize] = useState(ROWS_PER_PAGE_OPTIONS[0]);
  const [currentPage, setCurrentPage] = useState(0);

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  const totalFlex = columns.reduce((sum, col) => sum + (col.flex || 1), 0);

  const formatNumber = (value) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;
    const { key, direction } = sortConfig;
    if (!data[0] || !(key in data[0])) return data;

    return [...data].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;
    const start = currentPage * pageSize;
    return sortedData?.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize, pagination]);

  const handleSelectRow = (row) => {
    const alreadySelected = selectedRows.includes(row);
    const updated = alreadySelected ? [] : [row]; // only allow one selected
    setSelectedRows(updated);
    onRowSelection && onRowSelection(updated);
  };

  return (
    <div>
      <table className="custom-datagrid">
        <thead>
          <tr>
            {checkboxSelection && (
              <th
                style={{
                  width: "40px",
                  backgroundColor: "#dddee0",
                  textAlign: "center",
                  cursor: "default",
                }}
              ></th>
            )}
            {columns.map((col) => (
              <th
                key={col.accessor}
                onClick={() =>
                  col.sortable !== false && handleSort(col.accessor)
                }
                style={{
                  width: `${((col.flex || 1) / totalFlex) * 100}%`,
                  backgroundColor: "#dddee0",
                  textAlign: col.headerAlign || "left",
                  cursor: col.sortable === false ? "default" : "pointer",
                }}
              >
                {col.label}
                {sortConfig?.key === col.accessor &&
                  (sortConfig.direction === "asc" ? " 🔼" : " 🔽")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData?.map((row, idx) => (
            <tr key={idx}>
              {checkboxSelection && (
                <td style={{ textAlign: "center", width: "2%" }}>
                  <input
                    type="radio"
                    name="single-row-select"
                    checked={selectedRows.includes(row)}
                    onChange={() => handleSelectRow(row)}
                  />
                </td>
              )}
              {columns.map((col) => (
                <td
                  key={col.accessor}
                  style={{
                    height: "40px",
                    width: `${((col.flex || 1) / totalFlex) * 100}%`,
                    textAlign: col.contentAlign || "left",
                  }}
                >
                  {col.accessor === "number"
                    ? idx + 1 + currentPage * pageSize
                    : col.renderCell
                    ? col.renderCell(row)
                    : col.numberFormat
                    ? formatNumber(row[col.accessor])
                    : row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination controls */}
      {pagination && (
        <div
          className="pagination-controls"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "12px",
            marginTop: "16px",
            fontFamily: "Arial, sans-serif",
          }}
        >
          <button
            onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
            disabled={currentPage === 0}
            style={{
              padding: "6px 12px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              backgroundColor: currentPage === 0 ? "#f0f0f0" : "#fff",
              cursor: currentPage === 0 ? "not-allowed" : "pointer",
            }}
          >
            ◀
          </button>

          <span style={{ fontSize: "14px" }}>
            Page{currentPage + 1} of {Math.ceil(sortedData?.length / pageSize)}
          </span>

          <button
            onClick={() =>
              setCurrentPage((p) =>
                Math.min(Math.ceil(sortedData?.length / pageSize) - 1, p + 1)
              )
            }
            disabled={(currentPage + 1) * pageSize >= sortedData?.length}
            style={{
              padding: "6px 12px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              backgroundColor:
                (currentPage + 1) * pageSize >= sortedData?.length
                  ? "#f0f0f0"
                  : "#fff",
              cursor:
                (currentPage + 1) * pageSize >= sortedData?.length
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            ▶
          </button>

          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(0);
            }}
            style={{
              padding: "6px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              backgroundColor: "#fff",
              fontSize: "14px",
            }}
          >
            {ROWS_PER_PAGE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default CustomDataGrid;
