import React, { useState, useMemo } from "react";
import "../css/CustomDataGrid.css";

const CustomDataGrid = ({ columns, data }) => {
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

  const sortedData = useMemo(() => {
    if (!sortConfig || !sortConfig.key) return data;
    const { key, direction } = sortConfig;

    if (!data[0] || !(key in data[0])) return data;

    return [...data].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

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

  return (
    <table className="custom-datagrid">
      <thead>
        <tr>
          {columns?.map((col) => (
            <th
              key={col.accessor}
              onClick={() => col.sortable !== false && handleSort(col.accessor)}
              style={{
                width: `${((col.flex || 1) / totalFlex) * 100}%`,
                backgroundColor: "#dddee0",
                textAlign: col.headerAlign || "left",
                cursor: "pointer",
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
        {sortedData?.map((row, idx) => (
          <tr key={idx}>
            {columns.map((col) => (
              <td
                key={col.accessor}
                style={{
                  height: "40px",
                  width: `${((col.flex || 1) / totalFlex) * 100}%`,
                  textAlign: col.contentAlign || "left",
                }}
              >
                {/* Add index column */}
                {col.accessor === "number"
                  ? idx + 1
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
  );
};

export default CustomDataGrid;
