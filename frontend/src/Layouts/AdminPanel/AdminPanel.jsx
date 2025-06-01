import { Grid2, Typography, Card, CardContent, Box } from "@mui/material";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pie, Doughnut } from "react-chartjs-2";
import GetLoan from "../LoanInfo/api/GetLoan";
import GroupIcon from "@mui/icons-material/Group";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import MonthlyUserChart from "./MonthlyUserChart";
import ClusteredBarChart from "./ClusteredBarChart";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";

const options = {
  responsive: true,
  plugins: {
    legend: { position: "bottom" },
  },
};
const COLORS = ["#3498db", "#f39c12 ", "#48c9b0", "#9dcfff", "#d4e9ff"];
const bankColorMap = {
  "Хаан банк": ["#3498db", "#f39c12", "#90caf9"],
  "Голомт банк": ["#48c9b0", "#ba68c8", "#e1bee7"],
  "Хас банк": ["#f39c12", "#66bb6a", "#a5d6a7"],
};

const BACKGROUND_COLORS = [
  "#3498db",
  "#f39c12",
  "#0947a6",
  "#d4e9ff",
  "#9dcfff",
];

const monthlyUserData = [
  { month: "2024-06", users: 56 },
  { month: "2024-07", users: 68 },
  { month: "2024-08", users: 72 },
  { month: "2024-09", users: 85 },
  { month: "2024-10", users: 91 },
  { month: "2024-11", users: 74 },
  { month: "2024-12", users: 97 },
  { month: "2025-01", users: 88 },
  { month: "2025-02", users: 63 },
  { month: "2025-03", users: 79 },
  { month: "2025-04", users: 84 },
  { month: "2025-05", users: 95 },
];

const AdminPanel = () => {
  const [requests, setRequests] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [loanData, setLoanData] = useState([]);
  const [loanChartData, setLoanChartData] = useState([]);

  useEffect(() => {
    GetLoan()
      .then((response) => {
        if (response && Array.isArray(response.data)) {
          setLoanData(response.data);
        } else {
          setLoanData([]);
        }
      })
      .catch(() => {
        setLoanData([]);
      });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const { status, data } = await axios.get(
        "http://localhost:5000/LoanRequest/getAll"
      );

      if (status === 200) {
        const mapped = data
          .filter((item) => item.isVerification)
          .map((item, index) => ({ ...item, num: index }));
        setRequests(mapped);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (requests && requests.length) {
      console.log(requests);
      const data2 = requests.reduce((acc, item) => {
        console.log(item);
        const categoryName = item.Loan.bankCategories.CategoryName;
        const existing = acc.find((entry) => entry.name === categoryName);

        if (existing) {
          existing.value += 1;
        } else {
          acc.push({
            name: categoryName,
            value: 1,
          });
        }

        return acc;
      }, []);

      const result = {};

      for (const entry of requests) {
        const bankName = entry.Loan.bankCategories.CategoryName;
        const loanCategory = entry.Loan.loanCategories.CategoryName;
        const loanName = entry.Loan.name;

        if (!result[bankName]) {
          result[bankName] = [];
        }

        // Check if loan category already exists in array
        let categoryEntry = result[bankName].find((c) => c[loanName]);

        if (!categoryEntry) {
          categoryEntry = { [loanName]: 0 };
          result[bankName].push(categoryEntry);
        }

        categoryEntry[loanName]++;
      }

      const backgroundColors = ["#5ca9ff", "#1e6efb", , "#d4e9ff", "#9dcfff"];

      const chartDataPerBank = [];

      for (const bank in result) {
        const labels = [];
        const data = [];

        result[bank].forEach((category) => {
          const [categoryName, count] = Object.entries(category)[0];
          labels.push(categoryName);
          data.push(count);
        });

        chartDataPerBank.push({
          bankName: bank,
          chartData: {
            labels,
            datasets: [
              {
                label: `${bank} - Зээлийн ангилал`,
                data,
                backgroundColor: labels.map(
                  (_, i) => backgroundColors[i % backgroundColors.length]
                ),
                borderWidth: 1,
              },
            ],
          },
        });
      }

      console.log(chartDataPerBank);
      setLoanChartData(chartDataPerBank);

      const data = {
        labels: data2.map((item) => item.name),
        datasets: [
          {
            data: data2.map((item) => item.value),
            backgroundColor: data2.map(
              (_, index) => COLORS[index % COLORS.length]
            ),
            hoverBackgroundColor: data2.map(
              (_, index) =>
                // Slightly darker color for hover (you can define or generate)
                COLORS[index % COLORS.length]
            ),
          },
        ],
      };

      console.log(data);
      setPieData(data);
    }
  }, [requests]);

  console.log(pieData);

  return (
    <div>
      <Grid2
        container
        gap={2}
        display={"flex"}
        justifyContent={"space-around"}
        bgcolor={"white"}
        borderRadius={2}
        p={3}
      >
        <Grid2 size={2.8}>
          <Card
            sx={{
              p: 2,
              display: "flex",
              alignItems: "center",
              borderRadius: 3,
              boxShadow: 4,
              bgcolor: "#E3F2FD",
            }}
          >
            <Box
              sx={{
                bgcolor: "#2196F3",
                p: 1.5,
                borderRadius: 2,
                mr: 2,
                color: "white",
                display: "flex",
              }}
            >
              <GroupIcon fontSize="large" />
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Нийт хүсэлтийн тоо (2025 оны 06 сар)
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                {requests.length}
              </Typography>
            </Box>
          </Card>
        </Grid2>

        <Grid2 size={2.8}>
          <Card
            sx={{
              p: 2,
              display: "flex",
              alignItems: "center",
              borderRadius: 3,
              boxShadow: 4,
              bgcolor: "#E3F2FD",
            }}
          >
            <Box
              sx={{
                bgcolor: "#2196F3",
                p: 1.5,
                borderRadius: 2,
                mr: 2,
                color: "white",
                display: "flex",
              }}
            >
              <ListAltIcon fontSize="large" />
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Идэвхитэй байгаа зээлийн бүтээгдэхүүний тоо
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                {loanData.length}
              </Typography>
            </Box>
          </Card>
        </Grid2>
        <Grid2 size={2.8}>
          <Card
            sx={{
              p: 2,
              display: "flex",
              alignItems: "center",
              borderRadius: 3,
              boxShadow: 4,
              bgcolor: "#E3F2FD",
            }}
          >
            <Box
              sx={{
                bgcolor: "#2196F3",
                p: 1.5,
                borderRadius: 2,
                mr: 2,
                color: "white",
                display: "flex",
              }}
            >
              <AccountBalanceIcon fontSize="large" />
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Хамтран ажилдаг банк
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                6
              </Typography>
            </Box>
          </Card>
        </Grid2>
        <Grid2 size={2.8}>
          <Card
            sx={{
              p: 2,
              display: "flex",
              alignItems: "center",
              borderRadius: 3,
              boxShadow: 4,
              bgcolor: "#E3F2FD",
            }}
          >
            <Box
              sx={{
                bgcolor: "#2196F3",
                p: 1.5,
                borderRadius: 2,
                mr: 2,
                color: "white",
                display: "flex",
              }}
            >
              <LibraryAddIcon fontSize="large" />
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Сүүлийн жилд бүртгэсэн зээлийн хүсэлт
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                952
              </Typography>
            </Box>
          </Card>
        </Grid2>
        <Grid2 size={2.8} display={"flex"} justifyContent={"center"}>
          <Typography fontSize={18}>
            Нийт зээлийн хүсэлт дэх банкны төрөл{" "}
          </Typography>
        </Grid2>
        {loanChartData?.map(({ bankName, chartData }) => (
          <Grid2 size={2.8} display={"flex"} justifyContent={"center"}>
            <Typography fontSize={18}>{bankName}</Typography>
          </Grid2>
        ))}

        {pieData && pieData.datasets && pieData.datasets.length > 0 && (
          <Grid2
            size={2.8}
            sx={{
              height: 360,
              margin: "10px 0",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid #dbd4d3",
              borderRadius: 3,
              padding: 2,
            }}
          >
            <Pie data={pieData} options={options} />
          </Grid2>
        )}

        {/* Doughnut charts per bank */}
        {loanChartData?.map(({ bankName, chartData }) => (
          <Grid2
            key={bankName}
            size={2.8}
            sx={{
              height: 360,
              margin: "10px 0",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid #dbd4d3",
              borderRadius: 3,
              padding: 2,
            }}
          >
            <Doughnut
              data={{
                ...chartData,
                datasets: chartData.datasets.map((ds) => ({
                  ...ds,
                  backgroundColor:
                    bankColorMap[bankName] ||
                    ds.labels?.map(
                      (_, i) => BACKGROUND_COLORS[i % BACKGROUND_COLORS.length]
                    ),
                })),
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: "bottom" },
                },
              }}
            />
          </Grid2>
        ))}
        <Grid2 size={5}>
          <MonthlyUserChart />
        </Grid2>
        <Grid2 size={5.5}>
          <ClusteredBarChart />
        </Grid2>
      </Grid2>
    </div>
  );
};

export default AdminPanel;
