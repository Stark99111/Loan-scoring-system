import React, { useState } from "react";
import { Grid2, Button, TextField } from "@mui/material";
import CustomDataGrid from "../../../Components/CustomDataGrid";

const LoanAmountCalculater = () => {
  const [loanAmount, setLoanAmount] = useState(0);
  const [loanTerm, setLoanTerm] = useState(0);
  const [intRate, setIntRate] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [loanAmountTableData, setLoanAmountTableData] = useState([]);

  const columns = [
    { label: "Сар", accessor: "month", flex: 1 },
    { label: "Огноо", accessor: "date", flex: 2 },
    { label: "Хоног", accessor: "day", flex: 1 },
    {
      label: "Үндсэн зээлийн төлбөр",
      accessor: "loanAmount",
      flex: 2,
      numberFormat: true,
    },
    { label: "Хүүгийн төлбөр", accessor: "intAmount", flex: 2 },
    {
      label: "Тэнцүү төлбөр",
      accessor: "combinedAmount",
      flex: 2,
      numberFormat: true,
    },
    {
      label: "Үндсэн зээлийн үлдэгдэл",
      accessor: "loanBalance",
      flex: 2,
      numberFormat: true,
    },
  ];

  const data = [
    { name: "Alice", age: 30, email: "alice@example.com" },
    { name: "Bob", age: 25, email: "bob@example.com" },
    { name: "Charlie", age: 35, email: "charlie@example.com" },
  ];

  function formatDate(startDate, monthOffset) {
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + monthOffset);
    return date.toISOString().split("T")[0];
  }

  function calculateLoanRepaymentSchedule(
    loanAmount,
    loanTerm,
    intRate,
    startDate
  ) {
    const monthlyInterestRate = intRate / 100 / 12;
    const principalPerMonth = loanAmount / loanTerm;
    let balance = loanAmount;

    let currentDate = new Date(startDate); // Start date for the schedule
    const schedule = [];

    // Function to format the date as YYYY-MM-DD
    const formatDate = (date, monthOffset) => {
      const newDate = new Date(date);
      newDate.setMonth(newDate.getMonth() + monthOffset); // Move forward by `monthOffset` months
      const year = newDate.getFullYear();
      const month = (newDate.getMonth() + 1).toString().padStart(2, "0"); // 01 to 12
      const day = newDate.getDate().toString().padStart(2, "0"); // Ensure it's two digits
      return `${year}-${month}-${day}`;
    };

    for (let i = 0; i < loanTerm; i++) {
      const interestPayment = balance * monthlyInterestRate;
      const totalPayment = principalPerMonth + interestPayment;

      // Move currentDate to the next month for day calculation
      currentDate.setMonth(currentDate.getMonth() + 1); // Move to next month

      // Get the number of days in the current month
      const daysInMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        0
      ).getDate(); // Number of days in current month

      schedule.push({
        month: i + 1,
        date: formatDate(startDate, i),
        day: daysInMonth,
        loanAmount: parseFloat(principalPerMonth.toFixed(2)),
        intAmount: parseFloat(interestPayment.toFixed(2)),
        combinedAmount: parseFloat(totalPayment.toFixed(2)),
        loanBalance: parseFloat(
          Math.max(balance - principalPerMonth, 0).toFixed(2)
        ),
      });

      balance -= principalPerMonth; // Decrease balance by the principal payment
    }

    return schedule;
  }

  const buttonHandle = () => {
    const tableData = calculateLoanRepaymentSchedule(
      loanAmount,
      loanTerm,
      intRate,
      startDate
    );
    setLoanAmountTableData(tableData);
  };

  return (
    <Grid2 container padding={1} justifyContent={"space-between"} gap={2}>
      <Grid2 size={2}>
        <TextField
          label={"Зээлийн хэмжээ "}
          fullWidth
          size="small"
          value={loanAmount.toLocaleString("en-US")}
          onChange={(e) => {
            const rawValue = e.target.value.replace(/[^0-9]/g, "");
            setLoanAmount(Number(rawValue));
          }}
          inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
        />
      </Grid2>
      <Grid2 size={2}>
        <TextField
          label={"Зээлийн хугацаа "}
          fullWidth
          size="small"
          value={loanTerm.toLocaleString("en-US")}
          onChange={(e) => {
            const rawValue = e.target.value.replace(/[^0-9]/g, "");
            setLoanTerm(Number(rawValue));
          }}
          inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
        />
      </Grid2>
      <Grid2 size={2}>
        <TextField
          label={"Зээлийн хүү "}
          fullWidth
          size="small"
          value={intRate.toLocaleString("en-US")}
          onChange={(e) => {
            const rawValue = e.target.value.replace(/[^0-9]/g, "");
            setIntRate(Number(rawValue));
          }}
          inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
        />
      </Grid2>
      <Grid2 size={2}>
        <TextField
          label={"Зээл авах огноо "}
          fullWidth
          size="small"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          inputProps={{ placeholder: "" }}
        />
      </Grid2>
      <Grid2 size={1.5}>
        <Button
          variant="contained"
          fullWidth
          onClick={buttonHandle}
          disabled={!loanAmount || !loanTerm || !intRate || !startDate}
        >
          Тооцоолох
        </Button>
      </Grid2>
      <Grid2 size={1.9}></Grid2>
      <Grid2 size={12}>
        <CustomDataGrid
          columns={columns}
          data={loanAmountTableData}
          fullWidth
        />
      </Grid2>
    </Grid2>
  );
};

export default LoanAmountCalculater;
