import React, { useState, useEffect } from "react";
import {
  Grid2,
  Typography,
  List,
  ListItem,
  ListItemText,
  Switch,
} from "@mui/material";
import GetLoan from "../../LoanInfo/api/GetLoan";
import ChangeStatusApi from "../../../api/ChangeStatus";

const ChangeStatus = () => {
  const [loanData, setLoanData] = useState([]);

  useEffect(() => {
    // Fetch loan data on component mount
    GetLoan().then((data) => {
      if (data) {
        setLoanData(data.data);
      }
    });
  }, []);

  const handleStatusChange = (loanId, currentStatus) => {
    ChangeStatusApi(loanId, !currentStatus);
    // Update loan status logic (placeholder)
    console.log(`Change status for loan ${loanId} to ${!currentStatus}`);
    // For demonstration, update the status in the local state
    setLoanData((prevData) =>
      prevData.map((loan) =>
        loan._id === loanId ? { ...loan, status: !currentStatus } : loan
      )
    );
  };

  return (
    <Grid2 container bgcolor={"white"} borderRadius={4} p={3}>
      <Grid2 size={12}>
        <Typography fontWeight={"bold"} fontSize={23} p={2}>
          Зээлийн төлөв өөрчлөх
        </Typography>
      </Grid2>
      <Grid2 size={12}>
        <List>
          {loanData.length > 0 ? (
            loanData.map((loan) => (
              <ListItem key={loan._id} sx={{ borderBottom: "1px solid #ddd" }}>
                <ListItemText
                  primary={
                    <Typography variant="body1" fontWeight="bold">
                      {loan.name}
                    </Typography>
                  }
                  secondary={`Төлөв: ${loan.status ? "Идэвхтэй" : "Идэвхгүй"}`}
                />
                <Switch
                  checked={loan.status}
                  onChange={() => handleStatusChange(loan._id, loan.status)}
                />
              </ListItem>
            ))
          ) : (
            <Typography>No loan data available.</Typography>
          )}
        </List>
      </Grid2>
    </Grid2>
  );
};

export default ChangeStatus;
