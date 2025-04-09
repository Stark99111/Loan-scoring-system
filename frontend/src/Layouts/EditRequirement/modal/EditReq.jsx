import React, { useEffect, useState } from "react";
import { Grid2, Button, TextField } from "@mui/material";
import GetReqById from "../../../api/GetReqById";
import axios from "axios";

const EditReq = ({ id, onClose, setAddOpen }) => {
  const [fnc, setFunction] = useState();
  const [reqName, setReqName] = useState("test");
  useEffect(() => {
    if (id) {
      GetReqById(id).then((data) => {
        if (data) {
          setFunction(data.data.requirementCode ?? "");
          setReqName(data.data.requirementName ?? "");
        }
      });
    }
  }, [id]);

  const buttonHandle = async () => {
    if (fnc && reqName) {
      const response = await axios.put(
        `http://localhost:5000/loan/requirement/${id}`,
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

export default EditReq;
