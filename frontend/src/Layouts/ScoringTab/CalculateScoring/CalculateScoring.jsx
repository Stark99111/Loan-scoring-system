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
import ScoringAdvice from "./tabs/ScoringAdvice";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import BalanceIcon from "@mui/icons-material/Balance";
import RestoreIcon from "@mui/icons-material/Restore";

ChartJS.register(ArcElement, Tooltip, Legend);

const ScoreCard = ({
  title,
  score,
  maxScore,
  icon,
  unit = "оноо",
  getColor,
  getSecondary,
}) => {
  const color = getColor ? getColor(score, maxScore) : "text.primary";
  const secondary = getSecondary ? getSecondary(score, maxScore) : null;

  return (
    <Grid2
      xs={6}
      sx={{
        border: "1px solid #ccc",
        borderRadius: 2,
        height: "120px",
        backgroundColor: "#f9f9f9",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        px: 2,
        boxShadow: 1,
        width: "48%",
      }}
    >
      <Box display="flex" alignItems="center" mb={0.5}>
        {icon || <BalanceIcon color="primary" sx={{ mr: 1 }} />}
        <Typography variant="subtitle1" fontWeight={600}>
          {title}
        </Typography>
      </Box>

      <Typography variant="h6">
        {Math.round(score)} {unit}
      </Typography>

      {secondary !== null && (
        <Typography variant="body2" mb={0.5} color={color}>
          {secondary}
        </Typography>
      )}

      <Typography variant="caption" color="text.secondary">
        Дээд оноо: {Math.round(maxScore)}
      </Typography>
    </Grid2>
  );
};

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
  const [loanHistoryScore, setLoanHistoryScore] = useState(0);
  const [availableLoanAmountScore, setAvailableLoanAmountScore] = useState(0);
  const [loanHistoryLengthScore, setLoanHistoryLengthScore] = useState(0);
  const [DTI, setDTI] = useState(0);

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

  useEffect(() => {
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

      const weighted = {
        availableLoanAmount:
          scoringData.availableLoanAmount / (scoringData.scoring / 100),
        paymentHistory:
          scoringData.paymentHistory / (scoringData.scoring / 100),
        DTI: scoringData.DTI / (scoringData.scoring / 100),
        loanHistoryLength:
          scoringData.loanHistoryLength / (scoringData.scoring / 100),
        loanHistory: scoringData.loanHistory / (scoringData.scoring / 100),
      };

      // Total weighted score
      const total = Object.values(weighted).reduce((sum, val) => sum + val, 0);

      // Convert to percentage for the pie chart
      const pieData = Object.entries(weighted).map(([label, value]) => ({
        name: label,
        value: parseFloat(((value / total) * 100).toFixed(1)), // convert to %
      }));

      console.log(pieData);

      if (pieData) {
        const dataPie = {
          labels: pieData.map((item) => {
            const translations = {
              loanHistory: "Зээлийн тоо",
              paymentHistory: "Зээлийн төлөлтийн түүх",
              availableLoanAmount: "Одоогийн өрийн хэмжээ",
              loanHistoryLength: "Зээлийн түүхийн урт",
              DTI: "Өр орлогын харьцаа",
            };
            return translations[item.name] || item.name;
          }),
          datasets: [
            {
              label: "FICO Components",
              data: pieData.map((item) => item.value),
              backgroundColor: [
                "#0947a6",
                "#1e6efb",
                "#5ca9ff",
                "#9dcfff",
                "#d4e9ff",
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
      DTI: "Өр орлогын харьцаа",
    };
    const scores = {
      loanHistory: 220,
      availableLoanAmount: 165,
      loanHistoryLength: 55,
      DTI: 110,
    };
    if (scoringData) {
      setLoanHistoryScore(scoringData.loanHistory);
      setAvailableLoanAmountScore(scoringData.availableLoanAmount);
      setLoanHistoryLengthScore(scoringData.loanHistoryLength);
      setDTI(scoringData.DTI);
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
              sx={{
                width: "30%",
                color: "white",
                bgcolor: "#3166cc",
                borderRadius: 5,
              }}
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
                size={4}
                container
                display={"flex"}
                justifyContent="space-between"
                p={0}
                gap={2}
              >
                <Typography
                  fontSize={22}
                  fontWeight="bold"
                  textAlign={"justify"}
                >
                  Онооны дэлгэрэнгүй жагсаалт
                </Typography>
                <ScoreCard
                  title="Зээлийн төлөлтийн түүх"
                  score={scoringData.paymentHistory}
                  maxScore={192.5}
                  getColor={(score, max) =>
                    Math.round(100 - (score / max) * 100) / 12 > 5
                      ? "error.main"
                      : "success.main"
                  }
                  getSecondary={(score, max) =>
                    (Math.round(100 - (score / max) * 100) / 12).toFixed(1) +
                    " жил"
                  }
                />

                <ScoreCard
                  title="Одоогийн өрийн хэмжээ"
                  score={scoringData.availableLoanAmount}
                  maxScore={165}
                  getColor={(score, max) =>
                    Math.round(100 - (score / max) * 100) > 70
                      ? "error.main"
                      : "success.main"
                  }
                  getSecondary={(score, max) =>
                    `${Math.round(100 - (score / max) * 100)}%`
                  }
                />

                <ScoreCard
                  title="Зээлийн түүхийн урт"
                  score={scoringData.loanHistoryLength}
                  maxScore={55}
                  icon={<RestoreIcon color="primary" sx={{ mr: 1 }} />}
                  getColor={(score, max) =>
                    Math.round((score / 55) * 5) < 3
                      ? "error.main"
                      : "success.main"
                  }
                  getSecondary={(score) => `${(score / 55) * 5} жил`}
                />

                <ScoreCard
                  title="Өр орлогын харьцаа"
                  score={scoringData.DTI}
                  maxScore={82}
                  getColor={(score, max) =>
                    100 - (score / max) * 100 > 45
                      ? "error.main"
                      : "success.main"
                  }
                  getSecondary={(score, max) =>
                    `${(100 - (score / max) * 100).toFixed(1)}%`
                  }
                />

                <ScoreCard
                  title="Зээлийн тоо"
                  score={scoringData.loanHistory}
                  maxScore={55}
                  getColor={(score, max) =>
                    Math.round((score / max) * 100) > 2
                      ? "error.main"
                      : "success.main"
                  }
                  getSecondary={(score, max) =>
                    `${Math.round((score / max) * 5)} зээл`
                  }
                />

                <Grid2 size={12} display={"flex"} justifyContent={"flex-end"}>
                  <Button
                    variant="contained"
                    onClick={() => setScoringAdvice(true)}
                    sx={{
                      width: "40%",
                      color: "white",
                      bgcolor: "#3166cc",
                      borderRadius: 5,
                      height: "35px",
                    }}
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
                size={4}
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
                    style={{ width: "450px", height: "450px" }}
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
                  sx={{
                    width: "17%",
                    color: "white",
                    bgcolor: "#3166cc",
                    borderRadius: 5,
                  }}
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
                  sx={{
                    width: "100%",
                    color: "white",
                    bgcolor: "#3166cc",
                    borderRadius: 5,
                  }}
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
              onClose={() => {
                setCustomerMainInfoModal(false);
                fetchCustomerData();
              }}
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
