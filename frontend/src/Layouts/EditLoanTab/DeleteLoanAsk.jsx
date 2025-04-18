import { Grid2, Typography, Button } from "@mui/material";
import React from "react";
import DeleteLoan from "../../api/DeleteLoan";

const DeleteLoanAsk = ({ handleClose, id }) => {
  const deleteLoanHandle = () => {
    DeleteLoan(id).then(() => {
      handleClose();
    });
  };
  return (
    <div>
      <Grid2 container gap={2} spacing={1}>
        <Grid2 size={12}>
          <Typography>
            Та зээлийн бүтээгдэхүүн устгах гэж байна. Итгэлтэй байна уу?
          </Typography>
        </Grid2>
        <Grid2 size={5}></Grid2>
        <Grid2 size={3}>
          <Button
            fullWidth
            sx={{
              color: " #3166cc",
              border: "1px solid #3166cc",
              fontSize: 13,
            }}
            onClick={() => {
              deleteLoanHandle();
            }}
          >
            Тийм
          </Button>
        </Grid2>
        <Grid2 size={3}>
          <Button
            fullWidth
            sx={{
              color: " #3166cc",
              border: "1px solid #3166cc",
              fontSize: 13,
            }}
            onClick={handleClose}
          >
            Үгүй
          </Button>
        </Grid2>
      </Grid2>
    </div>
  );
};

export default DeleteLoanAsk;
