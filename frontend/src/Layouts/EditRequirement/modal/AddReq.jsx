import React, { useState } from "react";
import { Grid2, Button, TextField } from "@mui/material";
import axios from "axios";

const AddReq = ({ loanId, onClose, setAddOpen }) => {
  const [fnc, setFunction] = useState("ewffew");

  const [reqName, setReqName] = useState();

  const buttonHandle = async () => {
    if (fnc && reqName) {
      const response = await axios.post(
        `http://localhost:5000/loan/${loanId}/add-requirement`,
        {
          requirementName: reqName,
          requirementCode: fnc,
        }
      );
      if (response.status === 200) {
        setAddOpen(true);
        onClose();
      }
    } else {
      onClose();
    }
  };
  return (
    <Grid2
      container
      sx={{ width: 900 }}
      pt={3}
      height={"auto"}
      display="flex"
      justifyContent="space-between"
      gap={3}
    >
      <Grid2 size={11}>
        <TextField
          variant="outlined"
          label="Шаардлагын нэр"
          value={reqName}
          onChange={(e) => setReqName(e.target.value)}
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Grid2>
      <Grid2 size={11} display={"flex"} justifyContent={"center"}>
        <Button
          variant="contained"
          onClick={buttonHandle}
          sx={{ bgcolor: "#05357E" }}
        >
          Хадгалах
        </Button>
      </Grid2>
    </Grid2>
  );
};

export default AddReq;
