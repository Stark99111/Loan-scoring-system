import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register necessary components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const bankNames = [
  "Хаан банк",
  "Голомт банк",
  "Хас банк",
  "Худалдаа хөгжлийн банк",
  "М банк",
];

// Example: Clustered monthly vs total users per bank
const clusteredChartData = {
  labels: bankNames,
  datasets: [
    {
      label: "2025 оны 5-р сар",
      data: [48, 39, 28, 40, 40], // hypothetical May distribution
      backgroundColor: "rgba(23, 114, 224, 0.6)",
    },
    {
      label: "Сүүлийн нэг жилийн хугацаанд",
      data: [240, 190, 160, 200, 162], // total distribution
      backgroundColor: "rgba(214, 137, 16 , 0.6)",
    },
  ],
};

const clusteredChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Сүүлийн нэг жилийн хугацаанд банк тус бүрд бүртгэсэн зээлийн хүсэлт",
    },
  },
};

const ClusteredBarChart = () => {
  return (
    <div style={{ width: "100%", maxWidth: 900, margin: "0 auto" }}>
      <Bar data={clusteredChartData} options={clusteredChartOptions} />
    </div>
  );
};

export default ClusteredBarChart;
