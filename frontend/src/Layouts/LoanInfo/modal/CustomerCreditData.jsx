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
} from "@mui/material";
import axios from "axios";
import CustomDataGrid from "../../../Components/CustomDataGrid";
import FormatNumber from "../../../Components/FormatNumber";

const CustomerCreditData = ({ handleBackButton, customerId, loanData }) => {
  const [loanTableData, setLoanTableData] = useState();
  const [loanAmount, setLoanAmount] = useState(0);
  const [term, setTerm] = useState();
  const [interest, setInterest] = useState();
  const [schedule, setSchedule] = useState([]);
  const firstMonthPayment = schedule[0]?.total || 0;
  const totalPayment = schedule?.reduce(
    (acc, curr) => acc + Number(curr.total || 0),
    0
  );
  const totalInterest = schedule?.reduce(
    (acc, curr) => acc + Number(curr.interest || 0),
    0
  );

  console.log(loanData);

  useEffect(() => {
    if (loanData && loanData.conditions) {
      const mapped = loanData.conditions.map((item, index) => ({
        ...item,
        num: index,
      }));
      setLoanTableData(mapped);
    }
  }, [loanData]);

  useEffect(() => {
    if (loanAmount > 0 && term > 0 && interest > 0) {
      const calc = calculateLoanSchedule(
        Number(loanAmount),
        Number(term),
        Number(interest)
      );
      setSchedule(calc);
    }
  }, [loanAmount, term, interest]);

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
    { label: "Үндсэн төлбөр", accessor: "principal", flex: 2 },
    { label: "Хүүний төлбөр", accessor: "interest", flex: 2 },
    { label: "Нийт төлбөр", accessor: "total", flex: 2 },
    { label: "Үлдэгдэл", accessor: "balance", flex: 2 },
  ];

  return (
    <div>
      <Grid2 container padding={1} spacing={2}>
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
          <CustomDataGrid columns={columns} data={loanTableData} />
        </Grid2>
        <Grid2 size={12}>
          <Typography variant="h6">Зээлдэгчийн хүсэлт</Typography>
        </Grid2>
        <Grid2 size={6}>
          <TextField
            size="small"
            fullWidth
            label="Хүсэж буй зээлийн хэмжээ"
            value={loanAmount}
            onChange={(e) => {
              setLoanAmount(e.target.value);
            }}
          />
        </Grid2>
        <Grid2 size={6}>
          <TextField
            size={"small"}
            fullWidth
            label="Зээлийн хугацаа/сар/"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
          />
        </Grid2>
        <Grid2 size={6}>
          <TextField
            size={"small"}
            fullWidth
            label="Зээлийн хүү/жил/"
            value={interest}
            onChange={(e) => setInterest(e.target.value)}
          />
        </Grid2>
        <Grid2 size={6}></Grid2>
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

        <Grid2 size={6}>
          <Button variant="contained" onClick={handleBackButton}>
            Буцах
          </Button>
        </Grid2>
        <Grid2 size={6} display={"flex"} justifyContent={"flex-end"}>
          <Button variant="contained" onClick={handleBackButton}>
            Хүсэлт үүсгэх
          </Button>
        </Grid2>
      </Grid2>
    </div>
  );
};

export default CustomerCreditData;
