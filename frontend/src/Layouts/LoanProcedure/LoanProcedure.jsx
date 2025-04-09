import { Typography, Grid2 } from "@mui/material";
import React from "react";
import { PDFViewer } from "@react-pdf/renderer";
import MyDocument from "./pdf";

const LoanProcedure = () => {
  return (
    <div>
      <Grid2 container bgcolor={"white"} borderRadius={4} p={3}>
        <Grid2 size={12}>
          <Typography fontWeight={"bold"} fontSize={23} p={2}>
            Зээлийн журам
          </Typography>
        </Grid2>
        <Grid2 size={12}>
          <PDFViewer
            style={{
              width: "100%",
              height: "900px",
              border: "none",
              boxShadow: 3,
            }}
          >
            <MyDocument />
          </PDFViewer>
        </Grid2>
      </Grid2>
    </div>
  );
};

export default LoanProcedure;
