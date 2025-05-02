import React from "react";
import { Grid2, Typography, Button } from "@mui/material";

const LoanRiskCalculater = ({ id, handleBack }) => {
  return (
    <Grid2
      container
      sx={{ width: 600 }}
      // pt={3}
      height={"auto"}
      display="flex"
      justifyContent="space-between"
      borderRadius={5}
    >
      <Grid2 size={6} display={"flex"} justifyContent={"flex-start"}>
        <Button
          variant="contained"
          sx={{ fontWeight: "bold", height: "35px", bgcolor: "#05357E" }}
          onClick={handleBack}
        >
          Буцах
        </Button>
      </Grid2>
      <Grid2 size={6} display={"flex"} justifyContent={"flex-end"}>
        <Button
          variant="contained"
          sx={{ fontWeight: "bold", height: "35px", bgcolor: "#05357E" }}
        >
          Үргэлжлүүлэх
        </Button>
      </Grid2>
    </Grid2>
  );
};

export default LoanRiskCalculater;
