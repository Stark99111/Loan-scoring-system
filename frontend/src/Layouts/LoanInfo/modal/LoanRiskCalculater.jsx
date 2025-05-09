import React, { useState, useEffect } from "react";
import {
  Grid2,
  Typography,
  Button,
  CircularProgress,
  Box,
  Tooltip,
  Divider,
  TextField,
} from "@mui/material";
import GetLoanDataById from "../../../api/GetLoanDataById";
import axios from "axios";
import CustomDataGrid from "../../../Components/CustomDataGrid";
import BlockIcon from "@mui/icons-material/RemoveCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CustomModal from "../../../Components/CustomModal";
import FormatNumber from "../../../Components/FormatNumber";

const LoanRiskCalculater = ({
  id,
  handleBack,
  customerData,
  handleOpenCredit,
  customerId,
}) => {
  const [clickNumber, setClickNumber] = useState(0);
  const [reqCheck, setReqCheck] = useState([]);
  const [isLoader, setIsLoader] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isApprove, setIsApprove] = useState(false);
  const [customerCredit, setCustomerCredit] = useState();
  const [salary, setSalary] = useState();
  const [dti, setDTI] = useState();
  const [totalCredit, setTotalCredit] = useState();
  const [scoring, setScoring] = useState();

  useEffect(() => {
    const fetchCustomerData = async () => {
      const { status, data } = await axios.get(
        `http://localhost:5000/loan/getActiveLoanDetails/${customerId}`
      );
      if (status === 200 && data) {
        const mapped = data.map((item, index) => ({
          ...item,
          num: index,
        }));
        setCustomerCredit(mapped);
        console.log(mapped);
      }
    };
    if (customerId) {
      fetchCustomerData();
    }
  }, [customerId]);

  useEffect(() => {
    const fetchCustomerData = async () => {
      const { status, data } = await axios.get(
        `http://localhost:5000/loan/getCustomerFinancialInformation/${customerId}`
      );
      if (status === 200 && data) {
        console.log(data);
        setTotalCredit(data.activeLoans);
        setSalary(data.totalSalary);
        setDTI(data.dti);
        setScoring(data.scoring);
      }
    };
    if (customerId) {
      fetchCustomerData();
    }
  }, [customerId]);

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
        sx={{ width: 800 }}
        // pt={3}
        height={"auto"}
        display="flex"
        justifyContent="space-between"
        borderRadius={5}
        spacing={2}
      >
        {reqCheck && reqCheck.length > 0 && (
          <>
            <Grid2 size={3}>
              <TextField
                size="small"
                fullWidth
                label="Цалингийн хэмжээ"
                value={FormatNumber(salary)}
              />
            </Grid2>
            <Grid2 size={3}>
              <TextField
                size="small"
                fullWidth
                label="Өр орлогын харьцаа"
                value={FormatNumber(dti)}
              />
            </Grid2>
            <Grid2 size={3}>
              <TextField
                size="small"
                fullWidth
                label="Идэвхитэй зээлийн нийт дүн"
                value={FormatNumber(totalCredit)}
              />
            </Grid2>
            <Grid2 size={3}>
              <TextField
                size="small"
                fullWidth
                label="Зэрэглэл/Скоринг/"
                value={scoring}
              />
            </Grid2>
            <Grid2 size={12}>
              <Typography fontSize={17} fontWeight={"bold"}>
                Идэвхитэй зээлийн мэдээлэл
              </Typography>
            </Grid2>
            <Grid2 size={12}>
              <CustomDataGrid columns={columns} data={customerCredit} />
            </Grid2>
            <Grid2 size={12}>
              <Typography fontSize={17} fontWeight={"bold"}>
                Зээлийн шалгуур
              </Typography>
            </Grid2>
            {reqCheck.map((item) => (
              <>
                <Grid2 size={1} display={"flex"} justifyContent={"center"}>
                  {item.value ? (
                    <>
                      <CheckCircleOutlineIcon
                        fontSize="medium"
                        sx={{ color: "green" }}
                      />
                    </>
                  ) : (
                    <>
                      <BlockIcon fontSize="medium" sx={{ color: "red" }} />
                    </>
                  )}
                </Grid2>
                <Grid2 size={11}>
                  <Typography fontSize={16}>{item.requirement}</Typography>
                </Grid2>
              </>
            ))}
            {isApprove ? (
              <></>
            ) : (
              <>
                <Grid2 size={12} display={"flex"} justifyContent={"center"}>
                  <Typography color="red" width={"80%"} textAlign={"center"}>
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
                onClick={handleOpenCredit}
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
