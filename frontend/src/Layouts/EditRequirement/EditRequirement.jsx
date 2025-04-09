import React, { useState, useEffect } from "react";
import {
  Grid2,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Checkbox,
  Modal,
  Snackbar,
} from "@mui/material";
import GetLoan from "../LoanInfo/api/GetLoan";
import GetLoanDataById from "../../api/GetLoanDataById";
import EditReq from "./modal/EditReq";
import axios from "axios";
import AddReq from "./modal/AddReq";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "background.paper",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

const EditRequirement = () => {
  const [loanData, setLoanData] = useState([]);
  const [selectedLoanId, setSelectedLoanId] = useState(null);
  const [selectedLoanData, setSelectedLoanData] = useState();
  const [modal, setModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [addOpen, setAddOpen] = useState(false);

  const handleClosepop = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const handleCloseaddpop = () => {
    setAddModal(false);
  };

  const [selectedReq, setSelectedReq] = useState();

  const handleClose = () => {
    setModal(false);
  };
  const handleOpen = () => {
    setModal(true);
  };

  const deleteHandle = async () => {
    if (selectedReq) {
      try {
        const response = await axios.delete(
          `http://localhost:5000/loan/requirement/${selectedReq}`
        );

        if (response.status === 200) {
          setSnackbarMessage("Амжилттай устгасан.");
          setOpen(true);
          setSelectedLoanData((prev) => ({
            ...prev,
            requirements: prev.requirements.filter(
              (req) => req._id !== selectedReq
            ),
          })); // Remove the deleted requirement from the UI
          setSelectedReq(null); // Reset selected requirement
        } else {
          throw new Error("Failed to delete requirement");
        }
      } catch (e) {
        console.error("Error deleting requirement:", e.message);
        setSnackbarMessage("Устгах үйлдэл амжилтгүй боллоо."); // Update message
        setOpen(true);
      }
    }
  };

  useEffect(() => {
    if (addOpen) {
      setSnackbarMessage("Амжилттай.");
      setOpen(true);
      setAddOpen(false);
      if (selectedLoanId) {
        GetLoanDataById(selectedLoanId).then((data) => {
          if (data) {
            setSelectedLoanData(data.data);
          }
        });
      }
    }
  }, [addOpen, selectedLoanId]);

  useEffect(() => {
    // Fetch loan data on component mount
    GetLoan().then((data) => {
      if (data) {
        setLoanData(data.data);
      }
    });
  }, []);

  useEffect(() => {
    if (selectedLoanId) {
      GetLoanDataById(selectedLoanId).then((data) => {
        if (data) {
          setSelectedLoanData(data.data);
        }
      });
    }
  }, [selectedLoanId]);

  const handleCheckboxChange = (loanId) => {
    setSelectedLoanId(loanId); // Update the selected loan ID
    console.log("Selected Loan ID:", loanId); // Log the selected loan ID
  };
  return (
    <Grid2 container bgcolor={"white"} borderRadius={4} p={3}>
      <Grid2 size={12}>
        <Typography fontWeight={"bold"} fontSize={23} p={2}>
          Зээлийн шаардлагын функц оруулах
        </Typography>
      </Grid2>
      <Grid2 size={12}>
        <List>
          {loanData.length > 0 ? (
            loanData.map((loan) => (
              <ListItem
                key={loan._id}
                sx={{
                  borderBottom: "1px solid #ddd",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <ListItemText primary={loan.name} />
                <Checkbox
                  checked={selectedLoanId === loan._id}
                  onChange={() => handleCheckboxChange(loan._id)}
                />
              </ListItem>
            ))
          ) : (
            <Typography>No loan data available.</Typography>
          )}
        </List>
      </Grid2>
      {selectedLoanId ? (
        <>
          <Grid2 size={12}>
            <Typography fontWeight={"bold"} fontSize={19} p={2}>
              {selectedLoanData?.loans[0].name + "ийн шаардлагууд"}
            </Typography>
          </Grid2>
        </>
      ) : (
        <></>
      )}
      <Grid2 size={12}>
        {selectedLoanData?.requirements.map((item, index) => (
          <ListItem
            key={item._id}
            sx={{
              borderBottom: "1px solid #ddd",
              display: "flex",
              alignItems: "center",
            }}
          >
            <ListItemText
              primary={index + 1 + ". " + item.requirementName}
              sx={{ width: "70%" }}
            />
            <Checkbox
              checked={selectedReq === item._id} // Only the selected requirement is checked
              onChange={(e) =>
                setSelectedReq(e.target.checked ? item._id : null)
              } // Uncheck resets to null
            />
          </ListItem>
        ))}
      </Grid2>
      {selectedLoanData ? (
        <>
          <Grid2
            size={12}
            display={"flex"}
            justifyContent={"flex-end"}
            pt={3}
            gap={2}
          >
            <Button
              variant="contained"
              disabled={selectedReq}
              onClick={() => setAddModal(true)}
            >
              Нэмэх
            </Button>
            <Button
              variant="contained"
              disabled={!selectedReq}
              onClick={handleOpen}
            >
              Засах
            </Button>
            <Button
              variant="contained"
              disabled={!selectedReq}
              onClick={deleteHandle}
            >
              Устгах
            </Button>
          </Grid2>
        </>
      ) : (
        <></>
      )}
      <Modal
        open={modal}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Grid2 sx={{ ...style, width: 900 }} borderRadius={3}>
          <Typography sx={{ fontSize: 23, fontWeight: "bold" }}>
            Шаардлага засах
          </Typography>
          <EditReq
            id={selectedReq}
            onClose={handleClose}
            setAddOpen={setAddOpen}
          />
        </Grid2>
      </Modal>
      <Modal
        open={addModal}
        onClose={handleCloseaddpop}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Grid2 sx={{ ...style, width: 900 }} borderRadius={3}>
          <Typography sx={{ fontSize: 23, fontWeight: "bold" }}>
            Шаардлага нэмэх
          </Typography>
          <AddReq
            loanId={selectedLoanId}
            onClose={handleCloseaddpop}
            setAddOpen={setAddOpen}
          />
        </Grid2>
      </Modal>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClosepop}
        message={snackbarMessage}
      />
      ;
    </Grid2>
  );
};

export default EditRequirement;
