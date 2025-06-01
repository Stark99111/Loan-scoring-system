import React from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

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

const labels = monthlyUserData.map((item) => item.month);
const dataValues = monthlyUserData.map((item) => item.users);

const chartData = {
  labels,
  datasets: [
    {
      label: "Бүртгэсэн хүсэлт",
      data: dataValues,
      backgroundColor: "rgba(8, 129, 255, 0.5)",
      borderColor: "rgba(0, 114, 235, 1)",
      borderWidth: 1,
      fill: true,
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Сүүлийн нэг жилийн хугацаанд бүртгэсэн хүсэлтийн тоо",
    },
  },
};

const MonthlyUserChart = () => {
  return (
    <div style={{ width: "100%", margin: "0 auto" }}>
      {/* Change between Bar and Line */}
      <Bar data={chartData} options={options} />
      {/* <Line data={chartData} options={options} /> */}
    </div>
  );
};

export default MonthlyUserChart;
