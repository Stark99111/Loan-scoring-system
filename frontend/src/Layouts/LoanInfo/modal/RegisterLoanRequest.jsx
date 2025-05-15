import React, { useState, useEffect } from "react";
import {
  Grid2,
  Button,
  Typography,
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import CustomDataGrid from "../../../Components/CustomDataGrid";
import FormatNumber from "../../../Components/FormatNumber";

const RegisterLoanRequest = ({
  handleBackButton,
  registeredLoanRequest,
  customerData,
  loanData,
  onClose,
}) => {
  const [customerCredit, setCustomerCredit] = useState();
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (customerData) {
      const mapped = customerData.CreditDatabase?.filter(
        (item) => item.balance
      )?.map((item, index) => ({
        ...item,
        num: index,
      }));
      setCustomerCredit(mapped);
      console.log(mapped);
    }
  }, [customerData]);

  useEffect(() => {
    let interval;

    if (loading) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setLoading(false);
            return 100;
          }
          return prev + 2;
        });
      }, 80);
    }

    return () => clearInterval(interval);
  }, [loading]);

  const columns = [
    {
      label: "№",
      accessor: "num",
      flex: 1,
      headerAlign: "center",
      contentAlign: "center",
      renderCell: (params) => {
        return params.num + 1;
      },
    },
    {
      label: "Зээлийн үлдэгдэл",
      accessor: "balance",
      flex: 3,
      headerAlign: "center",
      contentAlign: "center",
      renderCell: (params) => {
        return FormatNumber(params.balance);
      },
    },
    {
      label: "Валют",
      accessor: "currency",
      flex: 1,
      headerAlign: "center",
      contentAlign: "center",
    },
    {
      label: "Төлж дуусах хугацаа",
      accessor: "paidDate",
      flex: 3,
      headerAlign: "center",
      contentAlign: "center",
      renderCell: (params) => {
        if (params.paidDate) {
          return params.paidDate.split("T")[0];
        }
      },
    },
    {
      label: "Хүү",
      accessor: "interest",
      flex: 1,
      headerAlign: "center",
      contentAlign: "center",
      renderCell: (params) => {
        return params.interest + "%";
      },
    },
  ];

  const registerLoanRequest = async () => {
    const body = {
      customerId: customerId,
      loanId: loanData._id,
      term: term,
      int: interest,
      amount: loanAmount,
    };
    const { status } = await axios.post(
      "http://localhost:5000/LoanRequest/registerLoanRequest",
      {
        ...body,
      }
    );
    if (status === 200) {
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  };

  return (
    <>
      {loading ? (
        <Grid2
          container
          justifyContent="center"
          alignItems="center"
          style={{ height: "300px" }}
        >
          <Grid2 textAlign="center">
            <CircularProgress
              variant="determinate"
              value={progress}
              size={80}
              sx={{ color: "#3166cc", mb: 2 }}
            />
            <Typography variant="h6">{progress}%</Typography>
          </Grid2>
        </Grid2>
      ) : (
        <div>
          <Grid2 container padding={1} spacing={2}>
            <Grid2 size={12}>
              <Typography fontSize={17} fontWeight={"bold"}>
                Идэвхитэй зээлийн мэдээлэл
              </Typography>
            </Grid2>
            <Grid2 size={12}>
              <CustomDataGrid columns={columns} data={customerCredit} />
            </Grid2>

            <Grid2 size={6}>
              <Button
                variant="contained"
                onClick={handleBackButton}
                sx={{
                  width: "30%",
                  color: "white",
                  bgcolor: "#3166cc",
                  borderRadius: 5,
                }}
              >
                Буцах
              </Button>
            </Grid2>
            <Grid2 size={6} display={"flex"} justifyContent={"flex-end"}>
              <Button
                variant="contained"
                onClick={registerLoanRequest}
                sx={{
                  width: "50%",
                  color: "white",
                  bgcolor: "#3166cc",
                  borderRadius: 5,
                }}
              >
                Хүсэлт үүсгэх
              </Button>
            </Grid2>
          </Grid2>
        </div>
      )}
    </>
  );
};

export default RegisterLoanRequest;
