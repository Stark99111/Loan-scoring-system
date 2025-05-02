import React, { useEffect, useState } from "react";
import {
  Grid2,
  Typography,
  Button,
  Box,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import CustomModal from "../../../Components/CustomModal";
import CustomerMainInformation from "./tabs/MainInformation";
import axios from "axios";
import CustomDataGrid from "../../../Components/CustomDataGrid";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ScoringAdvice from "./tabs/ScoringAdvice";

ChartJS.register(ArcElement, Tooltip, Legend);

const options = {
  layout: {
    padding: {
      right: -30, // Shifts legend further left
    },
  },
  plugins: {
    legend: {
      position: "left",
      align: "center",
      labels: {
        boxWidth: 40,
        padding: 10,
      },
    },
  },
};

const CalculateScoring = () => {
  const [isScoringCalculated, setIsScoringCalculated] = useState(null);
  const [approveModal, setApproveModal] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [customerMainInfoModal, setCustomerMainInfoModal] = useState(false);
  const [customerData, setCustomerData] = useState();
  const [scoringData, setScoringData] = useState();
  const userId = localStorage.getItem("userId");
  const [data, setData] = useState();
  const [scoringValue, setCategoryValue] = useState("");
  const [scoringDesc, setScoringDesc] = useState();
  const [scoringAdviceModal, setScoringAdvice] = useState(false);

  const formatNumber = (value) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const scoringCategory = [
    {
      maxAmount: 850,
      lowAmount: 800,
      text: "Маш сайн",
      desc: "Зээл авахад хамгийн таатай нөхцөлтэй, бага хүүтэй зээл авах боломжтой.",
    },
    {
      maxAmount: 799,
      lowAmount: 740,
      text: "Сайн",
      desc: "Зээлийн нөхцөл таатай, ихэнх зээлийг батлах магадлал өндөр.",
    },
    {
      maxAmount: 739,
      lowAmount: 670,
      text: "Дундаж",
      desc: "Ихэнх зээлд хамрагдах боломжтой ч зарим тохиолдолд өндөр хүү санал болгож магадгүй.",
    },
    {
      maxAmount: 669,
      lowAmount: 580,
      text: "Муу",
      desc: "Зээлийн нөхцөл хатуу, өндөр хүүтэй байх магадлалтай. Батлан даалт шаардаж болзошгүй.",
    },
    {
      maxAmount: 579,
      lowAmount: 300,
      text: "Маш муу",
      desc: "Зээл авах магадлал маш бага, нэмэлт барьцаа, батлан даалт шаардана.",
    },
  ];

  const scoringValueCol = [
    {
      label: "Хүчин зүйл",
      accessor: "label",
      flex: 2,
      headerAlign: "center",
      contentAlign: "left",
    },
    {
      label: "Оноо",
      accessor: "value",
      flex: 1,
      headerAlign: "center",
      contentAlign: "center",
      renderCell: (params) => {
        return formatNumber(params.value);
      },
    },
    {
      label: "Дээд оноо",
      accessor: "maxValue",
      flex: 1,
      headerAlign: "center",
      contentAlign: "center",
      renderCell: (params) => {
        return formatNumber(params.maxValue);
      },
    },
  ];

  const scoringValueColumn = [
    {
      label: "Онооны хүрээ",
      accessor: "numberValues",
      flex: 1,
      headerAlign: "center",
      contentAlign: "center",
      renderCell: (params) => {
        return params.lowAmount + "-" + params.maxAmount;
      },
    },
    {
      label: "Зэрэглэл",
      accessor: "text",
      flex: 1,
      headerAlign: "center",
      contentAlign: "center",
    },
    {
      label: "Тайлбар",
      accessor: "desc",
      flex: 4,
      headerAlign: "center",
      contentAlign: "justify",
    },
  ];

  useEffect(() => {
    const fetchCustomerData = async () => {
      const res = await axios.get(
        `http://localhost:5000/Customer/getAllById/${userId}`
      );
      if (res.data) {
        setCustomerData(res.data);
        if (res.data.Scoring) {
          setScoringData(res.data.Scoring);
          setIsScoringCalculated(true);
        } else {
          setIsScoringCalculated(false);
        }
      }
    };
    if (userId) {
      fetchCustomerData();
    }
  }, [userId]);

  useEffect(() => {
    if (isScoringCalculated === false) {
      setApproveModal(true);
    }
  }, [isScoringCalculated]);

  useEffect(() => {
    if (scoringData) {
      const string = scoringCategory.find(
        (item) =>
          scoringData.scoring >= item.lowAmount &&
          scoringData.scoring < item.maxAmount
      )?.text;

      if (string) {
        setCategoryValue(string);
      }

      console.log(scoringData);
      const maxLoanHistory = 10;
      const maxDebt = 50000000;
      const maxLoanLength = 60;
      const maxNewRequests = 10;
      const maxDTI = 2;

      const loanHistory = scoringData.loanHistory;
      const totalDebt = scoringData.availableLoanAmount;
      const loanHistoryLength = scoringData.loanHistoryLength;
      const newLoanRequests = scoringData.newLoanRequests;
      const DTI = scoringData.DTI;

      const normalized = {
        loanHistory: Math.min(loanHistory / maxLoanHistory, 1),
        availableLoanAmount: 1 - Math.min(totalDebt / maxDebt, 1),
        loanHistoryLength: Math.min(loanHistoryLength / maxLoanLength, 1),
        newLoanRequests: 1 - Math.min(newLoanRequests / maxNewRequests, 1),
        DTI: 1 - Math.min(DTI / maxDTI, 1),
      };

      const weighted = {
        loanHistory: normalized.loanHistory * 0.35,
        availableLoanAmount: normalized.availableLoanAmount * 0.3,
        loanHistoryLength: normalized.loanHistoryLength * 0.15,
        newLoanRequests: normalized.newLoanRequests * 0.1,
        DTI: normalized.DTI * 0.1,
      };

      const total = Object.values(weighted).reduce((sum, val) => sum + val, 0);

      const pieData = Object.entries(weighted).map(([label, value]) => ({
        name: label,
        value: parseFloat(((value / total) * 100).toFixed(1)), // convert to %
      }));

      console.log(pieData);

      if (pieData) {
        const dataPie = {
          labels: pieData.map((item) => {
            const translations = {
              loanHistory: "Зээлийн түүх",
              availableLoanAmount: "Одоогийн өрийн хэмжээ",
              loanHistoryLength: "Зээлийн түүхийн урт",
              newLoanRequests: "Шинэ зээлийн хүсэлт",
              DTI: "Өр орлогын харьцаа",
            };
            return translations[item.name] || item.name;
          }),
          datasets: [
            {
              label: "FICO Components",
              data: pieData.map((item) => item.value),
              backgroundColor: [
                "#0088FE",
                "#00C49F",
                "#FFBB28",
                "#FF8042",
                "#AA66CC",
              ],
              borderWidth: 1,
            },
          ],
        };

        setData(dataPie);
      }
    }
  }, [scoringData]);

  useEffect(() => {
    const translations = {
      loanHistory: "Зээлийн түүх",
      availableLoanAmount: "Одоогийн өрийн хэмжээ",
      loanHistoryLength: "Зээлийн түүхийн урт",
      newLoanRequests: "Шинэ зээлийн хүсэлт",
      DTI: "Өр орлогын харьцаа",
    };
    const scores = {
      loanHistory: 192.5,
      availableLoanAmount: 165,
      loanHistoryLength: 82.5,
      newLoanRequests: 55,
      DTI: 55,
    };
    if (scoringData) {
      const mapped = Object.keys(translations).map((key) => ({
        label: translations[key],
        value: scoringData[key],
        maxValue: scores[key],
      }));

      console.log(mapped);
      setScoringDesc(mapped);
    }
  }, [scoringData]);

  const CalculateScoringData = () => {
    return (
      <>
        <Grid2 container spacing={2} p={1} borderRadius={4}>
          <Grid2 size={12}>
            <Typography fontSize={16} lineHeight={1.7} textAlign={"justify"}>
              1. Зээлжих зэрэглэлийн оноо (scoring) тооцоолох зорилгоор таны
              хувийн мэдээллийг дотоод өгөгдлийн санд хадгалж, тооцоолол хийхэд
              ашиглахыг зөвшөөрж байна.
            </Typography>
          </Grid2>

          <Grid2 size={12}>
            <Typography fontSize={16} lineHeight={1.7} textAlign={"justify"}>
              2. Энэхүү мэдээлэл нь зөвхөн дотоод хэрэгцээнд ашиглагдах бөгөөд
              гуравдагч этгээдэд дамжуулахгүй болно.
            </Typography>
          </Grid2>

          <Grid2 size={12} display="flex" justifyContent="center">
            <FormControlLabel
              sx={{
                mt: 1,
                border: "1px solid #d1d5db",
                borderRadius: 2,
                px: 2,
                py: 1,
                bgcolor: "#f9fafb",
              }}
              control={
                <Checkbox
                  checked={isChecked}
                  onChange={(e) => setIsChecked(e.target.checked)}
                  color="primary"
                />
              }
              label={
                <Typography fontSize={15}>
                  Би дээрх нөхцөлийг зөвшөөрч байна.
                </Typography>
              }
            />
          </Grid2>

          <Grid2 size={12} display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              disabled={!isChecked}
              sx={{ minWidth: 160 }}
              onClick={() => {
                setApproveModal(false);
                setCustomerMainInfoModal(true);
              }}
            >
              Үргэлжлүүлэх
            </Button>
          </Grid2>
        </Grid2>
      </>
    );
  };

  {
    return (
      <div>
        <Grid2
          container
          bgcolor="white"
          borderRadius={4}
          p={4}
          spacing={4}
          boxShadow={3}
        >
          <Grid2 size={12}>
            <Typography fontWeight="bold" fontSize={24} pl={1}>
              Зээлжих зэрэглэлийн оноо (Скоринг)
            </Typography>
          </Grid2>

          {isScoringCalculated ? (
            <>
              {/* Left: Detailed Scores */}
              <Grid2
                size={3.5}
                container
                direction="column"
                alignItems="center"
                p={1}
                gap={2}
              >
                <Typography fontSize={22} fontWeight="bold">
                  Онооны дэлгэрэнгүй жагсаалт
                </Typography>
                <Grid2 size={12} width="100%">
                  <CustomDataGrid
                    columns={scoringValueCol}
                    data={scoringDesc}
                  />
                </Grid2>
                <Grid2 size={12} display={"flex"} justifyContent={"flex-end"}>
                  <Button
                    variant="contained"
                    onClick={() => setScoringAdvice(true)}
                  >
                    Зөвлөмж
                    {/* <ThumbUpIcon
                      fontSize="small"
                      sx={{ ml: 1, color: "white" }}
                    /> */}
                  </Button>
                </Grid2>
              </Grid2>

              {/* Center: Score Chart */}
              <Grid2
                size={4.5}
                container
                direction="column"
                alignItems="center"
                justifyContent="center"
                bgcolor="#f5f7fb"
                borderRadius={3}
                p={3}
              >
                <Typography fontSize={22} fontWeight="bold" mb={2}>
                  Нийт оноо: {scoringData.scoring} ({scoringValue})
                </Typography>
                {data ? (
                  <Box
                    style={{ width: "500px", height: "500px" }}
                    display={"flex"}
                    marginTop={-10}
                    marginBottom={-12}
                  >
                    <Doughnut data={data} options={options} />
                  </Box>
                ) : (
                  <Typography>Түр хүлээнэ үү...</Typography>
                )}
              </Grid2>

              {/* Right: Recommendations */}
              <Grid2
                size={3.8}
                container
                direction="column"
                alignItems="center"
                gap={2}
              >
                <Typography fontSize={22} fontWeight="bold">
                  Онооны тайлбар
                </Typography>
                <CustomDataGrid
                  data={scoringCategory}
                  columns={scoringValueColumn}
                />
              </Grid2>

              {/* Button - Bottom Right */}
              <Grid2 size={12} display="flex" justifyContent="flex-end">
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => setApproveModal(true)}
                >
                  Зэрэглэл бодуулах
                  <ArrowForwardIosIcon
                    fontSize="small"
                    sx={{ ml: 1, color: "white" }}
                  />
                </Button>
              </Grid2>
            </>
          ) : (
            approveModal &&
            customerMainInfoModal && (
              <Grid2 size={12} display="flex" justifyContent="center">
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => setApproveModal(true)}
                >
                  Зэрэглэл тооцоолуулах
                </Button>
              </Grid2>
            )
          )}
        </Grid2>

        {/* Approval Modal */}
        <CustomModal
          open={approveModal}
          onClose={() => setApproveModal(false)}
          title="Зөвшөөрлийн хуудас"
        >
          <Box sx={{ width: 600, borderRadius: 3 }}>
            <CalculateScoringData />
          </Box>
        </CustomModal>

        {/* Main Info Modal */}
        <CustomModal
          open={customerMainInfoModal}
          onClose={() => setCustomerMainInfoModal(false)}
          title="Үндсэн мэдээлэл"
        >
          <Box sx={{ width: 1200, borderRadius: 3 }}>
            <CustomerMainInformation
              onClose={() => setCustomerMainInfoModal(false)}
            />
          </Box>
        </CustomModal>

        <CustomModal
          open={scoringAdviceModal}
          onClose={() => setScoringAdvice(false)}
          title="Зээлжих зэрэглэлийн онооны зөвлөмж"
        >
          <Box sx={{ width: 1200, borderRadius: 3 }}>
            <ScoringAdvice
              onClose={() => setScoringAdvice(false)}
              components={scoringDesc}
            />
          </Box>
        </CustomModal>
      </div>
    );
  }
};

export default CalculateScoring;
