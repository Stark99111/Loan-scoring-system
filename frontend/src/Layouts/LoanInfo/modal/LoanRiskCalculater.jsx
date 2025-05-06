import React, { useState, useEffect } from "react";
import {
  Grid2,
  Typography,
  Button,
  CircularProgress,
  Box,
  Tooltip,
} from "@mui/material";
import GetLoanDataById from "../../../api/GetLoanDataById";
import axios from "axios";
import CustomDataGrid from "../../../Components/CustomDataGrid";

const LoanRiskCalculater = ({ id, handleBack, customerData }) => {
  const [loan, setLoan] = useState();
  const [req, setReq] = useState([]);
  const [clickNumber, setClickNumber] = useState(0);
  const [reqCheck, setReqCheck] = useState([]);
  const [isLoader, setIsLoader] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isApprove, setIsApprove] = useState(false);

  useEffect(() => {
    const duration = 4000;
    const interval = 100;
    const step = 100 / (duration / interval); // → 2.5 per 100ms

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsLoader(false);
          return 100;
        }
        return prev + step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (reqCheck && reqCheck.length) {
      const allApproved = reqCheck.every((item) => item.value === true);
      setIsApprove(allApproved);
    }
  }, [reqCheck]);

  const columns = [
    {
      label: "Зээлийн шаардлага",
      accessor: "requirement",
      flex: 10,
      headerAlign: "center",
    },
    {
      label: "Хангасан эсэх",
      accessor: "value",
      flex: 3,
      headerAlign: "center",
      contentAlign: "center",
      renderCell: (params) => {
        return params.value ? "Хангасан" : "Хангаагүй";
      },
    },
  ];

  const clicked = () => {
    setClickNumber(clickNumber + 1);
  };

  useEffect(() => {
    const fetchRequirements = async () => {
      try {
        const { status, data } = await axios.post(
          `http://localhost:5000/loan/checkLoanRequirements/${id}`,
          {
            userId: customerData._id,
          }
        );
        if (status === 200) {
          console.log(data);
          setReqCheck(data);
        }
      } catch (error) {
        console.error("Error fetching requirements:", error);
      }
    };
    fetchRequirements();
  }, []);

  useEffect(() => {
    GetLoanDataById(id).then((data) => {
      if (data) {
        setLoan(data.data.loans[0]);
        setReq(data.data.requirements || []);
      } else {
        setLoan(null);
        setReq(null);
      }
    });
  }, [id]);

  if (isLoader) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="200px"
      >
        <CircularProgress variant="determinate" value={progress} size={80} />
        <Typography sx={{ mt: 2 }}>{Math.round(progress)}%</Typography>
        <Typography sx={{ mt: 1 }}>Ачааллаж байна...</Typography>
      </Box>
    );
  } else
    return (
      <Grid2
        container
        sx={{ width: 600 }}
        // pt={3}
        height={"auto"}
        display="flex"
        justifyContent="space-between"
        borderRadius={5}
        spacing={2}
      >
        {reqCheck && reqCheck.length > 0 && (
          <>
            <Grid2 size={12}>
              <CustomDataGrid columns={columns} data={reqCheck} />
            </Grid2>
            {isApprove ? (
              <></>
            ) : (
              <>
                <Grid2 size={12} display={"flex"} justifyContent={"flex-end"}>
                  <Typography color="red">
                    Таны санхүүгийн өгөгдөл нь зээлийн бүтээгдэхүүний шаардлагыг
                    хангаж чадсангүй.
                  </Typography>
                </Grid2>
              </>
            )}
            <Grid2 size={6} display={"flex"} justifyContent={"flex-start"}>
              <Button
                variant="contained"
                sx={{ fontWeight: "bold", height: "35px", bgcolor: "#05357E" }}
                onClick={() => handleBack()}
              >
                Буцах
              </Button>
            </Grid2>
            <Grid2 size={6} display={"flex"} justifyContent={"flex-end"}>
              <Button
                variant="contained"
                sx={{
                  fontWeight: "bold",
                  height: "35px",
                  bgcolor: "#05357E",
                }}
                disabled={!isApprove}
              >
                Үргэлжлүүлэх
              </Button>
            </Grid2>
          </>
        )}
      </Grid2>
    );
};

export default LoanRiskCalculater;
