import React, { useEffect, useState } from "react";
import GetLoanDataById from "../../../api/GetLoanDataById";
import { Typography, Grid2, Button, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import GetFunction from "../../../api/GetFunction";
import Snackbar from "@mui/material/Snackbar";

const CheckData = ({ cusId, loanId, onClose }) => {
  const [requirements, setRequirements] = useState([]);
  const [loanName, setLoanName] = useState();

  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  useEffect(() => {
    if (loanId) {
      GetLoanDataById(loanId).then((data) => {
        if (data) {
          setRequirements(
            data.data.requirements.map((req) => ({ ...req, status: null }))
          ); // Initialize requirements with null status
          setLoanName(data.data.loans[0].name);
        }
      });
    }
  }, [loanId]);

  const buttonHandle = () => {
    if (cusId && requirements.length > 0) {
      const updatedRequirements = [...requirements];
      const fetchStatusPromises = requirements.map((item, index) => {
        if (item.requirementCode) {
          return GetFunction(cusId, item.requirementCode).then((data) => {
            if (data) {
              const status = Object.values(data)[0];
              updatedRequirements[index].status = status;
            }
          });
        }
        handleClick();
        return Promise.resolve();
      });

      Promise.all(fetchStatusPromises).then(() => {
        setRequirements(updatedRequirements);
      });
    }
  };

  return (
    <Grid2 container borderRadius={3}>
      <Grid2
        size={10}
        container
        alignItems="center"
        justifyContent={"center"}
        flexDirection="row"
        style={{
          display: "flex", // Ensure Flexbox is applied
          gap: "8px", // Add spacing between items
        }}
      >
        <Typography variant="body1" style={{ fontWeight: 500 }} fontSize={21}>
          {loanName}
        </Typography>
      </Grid2>
      <Grid2
        size={2}
        display="flex"
        justifyContent="flex-end"
        onClick={onClose}
        style={{ cursor: "pointer" }}
      >
        <CloseIcon fontSize="large" />
      </Grid2>

      {requirements.length > 0 ? (
        <Grid2 size={12}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "20px",
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    border: "1px solid rgb(160, 152, 152)",
                    padding: "8px",
                    borderTopLeftRadius: 20,
                    width: "80%",
                  }}
                >
                  Зээлийн шаардлага
                </th>
                <th
                  style={{
                    border: "1px solid rgb(160, 152, 152)",
                    padding: "8px",
                  }}
                >
                  Шаардлага хангасан эсэх
                </th>
              </tr>
            </thead>
            <tbody>
              {requirements.map((requirement, index) => (
                <tr key={index}>
                  <td
                    style={{
                      border: "1px solid rgb(160, 152, 152)",
                      padding: "8px",
                    }}
                  >
                    {requirement.requirementName}
                  </td>
                  <td
                    style={{
                      border: "1px solid rgb(160, 152, 152)",
                      padding: "8px",
                      textAlign: "center",
                    }}
                  >
                    {requirement.status === null
                      ? "Тодорхойгүй"
                      : requirement.status
                      ? "Тийм"
                      : "Үгүй"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Grid2>
      ) : (
        <p>No requirements available.</p>
      )}
      <Grid2
        size={12}
        display={"flex"}
        justifyContent={"center"}
        paddingTop={2}
      >
        <Button
          variant="contained"
          sx={{ bgcolor: "#05357E" }}
          onClick={buttonHandle}
        >
          Мэдээлэл шалгах
        </Button>
      </Grid2>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message="Мэдээлэл шалгах боломжгүй байна."
        action={action}
      />
    </Grid2>
  );
};

export default CheckData;
