import React, { useState } from "react";
import { Grid2, Typography, Button, TextField } from "@mui/material";
import CustomDataGrid from "../../../Components/CustomDataGrid";
import FormatNumber from "../../../Components/FormatNumber";
import NumberFormat from "react-number-format";

const SavingCalculater = () => {
  const [firstAmount, setFirstAmount] = useState(0);
  const [intRatePerYear, setIntRatePerYear] = useState(0);
  const [term, setTerm] = useState(0);
  const [addAmountEachMonth, setAddAmountEachMonth] = useState("");
  const [loanAmountTableData, setLoanAmountTableData] = useState([]);

  const columns = [
    { label: "Огноо", accessor: "date", flex: 2 },
    { label: "Хүү тооцсон хоног", accessor: "intDay", flex: 2 },
    {
      label: "Бодогдсон хүү",
      accessor: "calculatedInt",
      flex: 2,
      numberFormat: true,
    },
    {
      label: "Хадгалсан мөнгө",
      accessor: "savedAmount",
      flex: 2,
      numberFormat: true,
    },
    {
      label: "Нийт мөнгө",
      accessor: "TotalAmount",
      flex: 2,
      numberFormat: true,
    },
    {
      label: "Хуримтлагдсан хүү",
      accessor: "combinedAmount",
      flex: 2,
      numberFormat: true,
    },
  ];

  function calculateSavings(
    firstAmount,
    annualInterestRate,
    termInMonths,
    monthlyAddition
  ) {
    const monthlyRate = annualInterestRate / 12 / 100;
    let balance = firstAmount;
    let data = [];

    let currentDate = new Date();

    for (let i = 1; i <= termInMonths; i++) {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth(); // 0-based
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      const interest = balance * monthlyRate;
      balance += interest + monthlyAddition;

      // Format date as YYYY-MM-DD
      const formattedDate = `${year}-${(month + 1)
        .toString()
        .padStart(2, "0")}-01`;

      data.push({
        date: formattedDate,
        intDay: daysInMonth,
        calculatedInt: interest.toFixed(2),
        savedAmount: (monthlyAddition * i + firstAmount).toFixed(2),
        TotalAmount: balance.toFixed(2),
        combinedAmount: (balance - firstAmount - monthlyAddition * i).toFixed(
          2
        ),
      });

      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    return data;
  }

  return (
    <Grid2 container padding={1} justifyContent={"space-between"} gap={2}>
      <Grid2 size={2}>
        <TextField
          label={"Данс нээх мөнгөн дүн"}
          fullWidth
          size="small"
          value={firstAmount.toLocaleString("en-US")}
          onChange={(e) => {
            const rawValue = e.target.value.replace(/[^0-9]/g, "");
            setFirstAmount(Number(rawValue));
          }}
          inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
        />
      </Grid2>
      <Grid2 size={2}>
        <TextField
          label={"Хадгаламжийн жилийн хүү"}
          fullWidth
          size="small"
          value={Number(intRatePerYear).toLocaleString()}
          onChange={(e) => {
            const rawValue = e.target.value.replace(/,/g, "");
            setIntRatePerYear(Number(rawValue));
          }}
          inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
        />
      </Grid2>
      <Grid2 size={2}>
        <TextField
          label={"Хугацаа (сараар)"}
          fullWidth
          size="small"
          value={Number(term).toLocaleString()}
          onChange={(e) => {
            const rawValue = e.target.value.replace(/,/g, "");
            setTerm(Number(rawValue));
          }}
          inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
        />
      </Grid2>
      <Grid2 size={2}>
        <TextField
          label="Сар бүр нэмж хийх мөнгөн дүн"
          fullWidth
          size="small"
          value={Number(addAmountEachMonth).toLocaleString()}
          onChange={(e) => {
            const rawValue = e.target.value.replace(/,/g, "");
            setAddAmountEachMonth(Number(rawValue));
          }}
          inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
        />
      </Grid2>
      <Grid2 size={1.5}>
        <Button
          variant="contained"
          fullWidth
          onClick={() => {
            const result = calculateSavings(
              firstAmount,
              intRatePerYear,
              term,
              addAmountEachMonth
            );
            setLoanAmountTableData(result);
          }}
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

export default SavingCalculater;
