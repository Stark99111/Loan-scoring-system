import React, { useEffect, useState } from "react";
import { Grid2, Typography } from "@mui/material";
import CustomDataGrid from "../../Components/CustomDataGrid";
import axios from "axios";
import FormatNumber from "../../Components/FormatNumber";

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
    label: "Банк",
    accessor: "bankCategories",
    flex: 4,
    headerAlign: "center",
    contentAlign: "center",
    renderCell: (params) => {
      if (
        params.Loan &&
        params.Loan.bankCategories &&
        params.Loan.bankCategories.CategoryName
      ) {
        return params.Loan.bankCategories.CategoryName;
      } else {
        return "-";
      }
    },
  },
  {
    label: "Зээлийн төрөл",
    accessor: "loanCategories",
    flex: 4,
    headerAlign: "center",
    contentAlign: "center",
    renderCell: (params) => {
      if (
        params.Loan &&
        params.Loan.loanCategories &&
        params.Loan.loanCategories.CategoryName
      ) {
        return params.Loan.loanCategories.CategoryName;
      } else {
        return "-";
      }
    },
  },
  {
    label: "Зээлийн бүтээгдэхүүн",
    accessor: "name",
    flex: 4,
    headerAlign: "center",
    contentAlign: "center",
    renderCell: (params) => {
      if (params.Loan.name) {
        return params.Loan.name;
      } else {
        return "-";
      }
    },
  },
  {
    label: "Зээлийн дүн",
    accessor: "LoanAmount",
    flex: 5,
    headerAlign: "center",
    contentAlign: "right",
    renderCell: (params) => {
      return FormatNumber(params.LoanAmount);
    },
  },
  {
    label: "Хугацаа/сар/",
    accessor: "Term",
    flex: 5,
    headerAlign: "center",
    contentAlign: "right",
  },
  {
    label: "Хүү/жил/",
    accessor: "Interest",
    flex: 5,
    headerAlign: "center",
    contentAlign: "right",
    renderCell: (params) => {
      return params.Interest + "%";
    },
  },
  {
    label: "Огноо",
    accessor: "date",
    flex: 5,
    headerAlign: "center",
    contentAlign: "center",
    renderCell: (params) => {
      const date = new Date(params.createdAt);

      // Add 7 hours
      date.setHours(date.getHours() + 7);

      const formattedDate = date.toISOString().split("T");
      const formattedTime = formattedDate[1].split(".")[0]; // Remove milliseconds

      return `${formattedDate[0]} ${formattedTime}`;
    },
  },
  {
    label: "Төлөв",
    accessor: "Description",
    flex: 5,
    headerAlign: "center",
    contentAlign: "center",
    renderCell: () => {
      return "Хүсэлт үүсгэсэн.";
    },
  },
];

const LoanRequest = ({}) => {
  const [tableData, setTableData] = useState();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchCustomerLoanRequest = async () => {
      const { status, data } = await axios.get(
        `http://localhost:5000/LoanRequest/loanRequests/${userId}`
      );
      if (status === 200) {
        const mapped = data
          .filter((item) => item.isVerification)
          .map((item, index) => ({ ...item, num: index }));
        setTableData(mapped);
      }
    };
    if (userId) {
      fetchCustomerLoanRequest();
    }
  }, [userId]);

  return (
    <>
      <Grid2
        container
        gap={2}
        display={"flex"}
        justifyContent={"center"}
        bgcolor={"white"}
        borderRadius={2}
        p={3}
      >
        <Grid2 size={12}>
          <Typography fontWeight={"bold"} fontSize={23} pt={2} pl={3}>
            Зээлийн хүсэлтийн жагсаалт
          </Typography>
        </Grid2>
        <Grid2 size={12}>
          <CustomDataGrid columns={columns} data={tableData} />
        </Grid2>
      </Grid2>
    </>
  );
};

export default LoanRequest;
