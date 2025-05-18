import React from "react";
import CustomDataGrid from "../../../Components/CustomDataGrid";
import { Grid2, Typography } from "@mui/material";

const ScoringList = ({ data }) => {
  const scoringValueColumn = [
    {
      label: "Онооны хүрээ",
      accessor: "numberValues",
      flex: 1,
      headerAlign: "center",
      contentAlign: "center",
      renderCell: (params) => {
        return params.lowAmount + "-" + params.maxAmount;
      },
    },
    {
      label: "Зэрэглэл",
      accessor: "text",
      flex: 1,
      headerAlign: "center",
      contentAlign: "center",
    },
    {
      label: "Тайлбар",
      accessor: "desc",
      flex: 4,
      headerAlign: "center",
      contentAlign: "justify",
    },
  ];

  return (
    <Grid2 container>
      <Grid2 size={12}>
        <CustomDataGrid columns={scoringValueColumn} data={data} />
      </Grid2>
    </Grid2>
  );
};

export default ScoringList;
