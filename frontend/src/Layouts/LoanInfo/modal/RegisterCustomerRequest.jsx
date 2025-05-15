import React, { useState, useEffect } from "react";
import { Grid2, Typography, Button, TextField } from "@mui/material";
import axios from "axios";
import CustomDataGrid from "../../../Components/CustomDataGrid";
import FormatNumber from "../../../Components/FormatNumber";

const RegisterCustomerRequest = ({
  handleBack,
  handleOpenCredit,
  loanData,
  customerId,
  setRegisterLoanRequest,
}) => {
  const [loanTableData, setLoanTableData] = useState();
  const [loanAmount, setLoanAmount] = useState();
  const [term, setTerm] = useState();
  const [interest, setInterest] = useState();
  const [schedule, setSchedule] = useState([]);
  const [maxAmount, setMaxAmount] = useState(null);
  const [maxTerm, setMaxTerm] = useState(null);
  const [maxInterest, setMaxInterest] = useState(null);
  const firstMonthPayment = schedule[0]?.total || 0;
  const totalPayment = schedule?.reduce(
    (acc, curr) => acc + Number(curr.total || 0),
    0
  );
  const totalInterest = schedule?.reduce(
    (acc, curr) => acc + Number(curr.interest || 0),
    0
  );

  const isLoanAmountInvalid = Number(loanAmount) > maxAmount;
  const isTermInvalid = Number(term) > maxTerm;
  const isInterestInvalid = Number(interest) > maxInterest;

  useEffect(() => {
    if (loanData) {
      setMaxAmount(loanData.maxAmount);
      setMaxTerm(loanData.term);
      setMaxInterest(loanData.intRate);
    }
    if (loanData && loanData.conditions) {
      const mapped = loanData.conditions.map((item, index) => ({
        ...item,
        num: index,
      }));
      setLoanTableData(mapped);
    }
  }, [loanData]);

  console.log(loanData, "loanData");

  useEffect(() => {
    if (
      loanAmount > 0 &&
      loanAmount < maxAmount + 1 &&
      term > 0 &&
      term < maxTerm + 1 &&
      interest > 0 &&
      interest < maxInterest + 1
    ) {
      const calc = calculateLoanSchedule(
        Number(loanAmount),
        Number(term),
        Number(interest)
      );
      setSchedule(calc);
    }
  }, [loanAmount, term, interest, maxAmount, maxTerm, maxInterest]);

  const calculateLoanSchedule = (amount, term, annualInterest) => {
    const monthlyInterest = annualInterest / 100 / 12;
    const numberOfPayments = term;

    const monthlyPayment =
      (amount * monthlyInterest) /
      (1 - Math.pow(1 + monthlyInterest, -numberOfPayments));

    const schedule = [];

    let balance = amount;
    let currentDate = new Date();

    for (let i = 0; i < numberOfPayments; i++) {
      const interestPayment = balance * monthlyInterest;
      const principalPayment = monthlyPayment - interestPayment;
      balance -= principalPayment;

      schedule.push({
        num: i + 1,
        date: new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + i,
          currentDate.getDate()
        ).toLocaleDateString(),
        principal: principalPayment.toFixed(2),
        interest: interestPayment.toFixed(2),
        total: monthlyPayment.toFixed(2),
        balance: balance.toFixed(2),
      });
    }

    return schedule;
  };

  const scheduleColumns = [
    { label: "№", accessor: "num", flex: 1 },
    { label: "Огноо", accessor: "date", flex: 2 },
    {
      label: "Үндсэн төлбөр",
      accessor: "principal",
      flex: 2,
      renderCell: (params) => {
        return FormatNumber(params.principal);
      },
    },
    {
      label: "Хүүний төлбөр",
      accessor: "interest",
      flex: 2,
      renderCell: (params) => {
        return FormatNumber(params.interest);
      },
    },
    {
      label: "Нийт төлбөр",
      accessor: "total",
      flex: 2,
      renderCell: (params) => {
        return FormatNumber(params.total);
      },
    },
    {
      label: "Үлдэгдэл",
      accessor: "balance",
      flex: 2,
      renderCell: (params) => {
        return FormatNumber(params.balance);
      },
    },
  ];

  const loanColumns = [
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
      label: "Зээлийн нөхцөл",
      accessor: "conditionName",
      flex: 4,
      headerAlign: "center",
      contentAlign: "left",
    },
    {
      label: "Утга",
      accessor: "Description",
      flex: 5,
      headerAlign: "center",
      contentAlign: "center",
    },
  ];

  // useEffect(() => {
  //   const duration = 4000;
  //   const interval = 100;
  //   const step = 100 / (duration / interval); // → 2.5 per 100ms

  //   const timer = setInterval(() => {
  //     setProgress((prev) => {
  //       if (prev >= 100) {
  //         clearInterval(timer);
  //         setIsLoader(false);
  //         return 100;
  //       }
  //       return prev + step;
  //     });
  //   }, interval);

  //   return () => clearInterval(timer);
  // }, []);

  const registerLoanRequest = async () => {
    const body = {
      customerId: customerId,
      loanId: loanData._id,
      term: term,
      int: interest,
      amount: loanAmount,
    };
    const { status, data } = await axios.post(
      "http://localhost:5000/LoanRequest/registerLoanRequest",
      {
        ...body,
      }
    );
    if (status === 200) {
      setRegisterLoanRequest(data);
      handleOpenCredit();
    }
  };

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
      <Grid2 size={6}>
        <TextField
          size={"small"}
          fullWidth
          label="Банк"
          value={loanData.bankCategories?.CategoryName}
          InputLabelProps={{ shrink: true }}
        />
      </Grid2>
      <Grid2 size={6}>
        <TextField
          size={"small"}
          fullWidth
          label="Зээлийн бүтээгдэхүүн"
          value={loanData.name}
          InputLabelProps={{ shrink: true }}
        />
      </Grid2>
      <Grid2 size={12}>
        <CustomDataGrid columns={loanColumns} data={loanTableData} />
      </Grid2>
      <Grid2 size={12}>
        <Typography variant="h6">Зээлдэгчийн хүсэлт</Typography>
      </Grid2>
      <Grid2 size={4}>
        <TextField
          size="small"
          fullWidth
          label="Хүсэж буй зээлийн хэмжээ"
          onChange={(e) => {
            const value = e.target.value.replace(/,/g, "");
            setLoanAmount(value);
          }}
          value={
            loanAmount ? Number(loanAmount)?.toLocaleString("en-US") : null
          }
          inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
          error={isLoanAmountInvalid}
          helperText={
            isLoanAmountInvalid
              ? `Хамгийн ихдээ ${maxAmount.toLocaleString()}₮`
              : ""
          }
        />
      </Grid2>

      <Grid2 size={4}>
        <TextField
          size="small"
          fullWidth
          label="Зээлийн хугацаа /сар/"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
          error={isTermInvalid}
          helperText={
            isTermInvalid ? `Хамгийн урт хугацаа: ${maxTerm} сар` : ""
          }
        />
      </Grid2>

      <Grid2 size={4}>
        <TextField
          size="small"
          fullWidth
          label="Зээлийн хүү /жил/"
          value={interest}
          onChange={(e) => setInterest(e.target.value)}
          inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
          error={isInterestInvalid}
          helperText={
            isInterestInvalid ? `Хамгийн их хүү: ${maxInterest}%` : ""
          }
        />
      </Grid2>
      {schedule && schedule.length ? (
        <>
          <Grid2 size={12}>
            <Typography variant="h6">Сар бүрийн төлбөрийн хуваарь</Typography>
          </Grid2>
          <Grid2 size={4}>
            <TextField
              label="Эхний сарын төлбөр"
              size="small"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={FormatNumber(firstMonthPayment) + "₮"}
            />
          </Grid2>
          <Grid2 size={4}>
            <TextField
              label="Нийт төлбөр"
              size="small"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={FormatNumber(totalPayment) + "₮"}
            />
          </Grid2>
          <Grid2 size={4}>
            <TextField
              label="Нийт хүүгийн төлбөр"
              size="small"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={FormatNumber(totalInterest) + "₮"}
            />
          </Grid2>
          <Grid2 size={12}>
            <div style={{ height: 400, overflowY: "auto" }}>
              <CustomDataGrid columns={scheduleColumns} data={schedule} />
            </div>
          </Grid2>
        </>
      ) : (
        <></>
      )}

      <Grid2 size={6} display={"flex"} justifyContent={"flex-start"}>
        <Button
          variant="contained"
          sx={{
            width: "30%",
            color: "white",
            bgcolor: "#3166cc",
            borderRadius: 5,
          }}
          onClick={() => handleBack()}
        >
          Буцах
        </Button>
      </Grid2>
      <Grid2 size={6} display={"flex"} justifyContent={"flex-end"}>
        <Button
          variant="contained"
          sx={{
            width: "50%",
            color: "white",
            bgcolor: "#3166cc",
            borderRadius: 5,
          }}
          disabled={!loanAmount || !term || !interest}
          onClick={registerLoanRequest}
        >
          Үргэлжлүүлэх
        </Button>
      </Grid2>
    </Grid2>
  );
};

export default RegisterCustomerRequest;
