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
  Snackbar,
  Alert,
  CircularProgress,
  Box,
} from "@mui/material";
import axios from "axios";
import CustomDataGrid from "../../../Components/CustomDataGrid";
import FormatNumber from "../../../Components/FormatNumber";
import BalanceIcon from "@mui/icons-material/Balance";
import RestoreIcon from "@mui/icons-material/Restore";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ScoringAdvice from "../../ScoringTab/CalculateScoring/tabs/ScoringAdvice";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import PaymentsIcon from "@mui/icons-material/Payments";
import { Doughnut } from "react-chartjs-2";
import CustomModal from "../../../Components/CustomModal";
import GppBadIcon from "@mui/icons-material/GppBad";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
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
        width: "32%",
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
      right: 0, // Negative values are invalid, use 0 or adjust layout another way
    },
  },
  plugins: {
    legend: {
      position: "top", // Places legend at the top
      align: "center", // Aligns legend in the center
      labels: {
        boxWidth: 20, // Smaller legend box
        padding: 15, // Space between legend items
        // textAlign: "flex-start", // Aligns text inside each item (valid here)
      },
    },
  },
};

const RegisterLoanRequest = ({
  handleBackButton,
  registeredLoanRequest,
  customerData,
  loanData,
  onClose,
}) => {
  const [customerCredit, setCustomerCredit] = useState();
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [scoringData, setScoringData] = useState(null);
  const [scoringValue, setCategoryValue] = useState("");
  const [scoringAdviceModal, setScoringAdvice] = useState(false);
  const [data, setData] = useState();
  const [scoringDesc, setScoringDesc] = useState();

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
        customerInfoScore:
          scoringData.customerInfoScore / (scoringData.scoring / 100),
        availableLoanAmount:
          scoringData.availableLoanAmount / (scoringData.scoring / 100),
        loanHistoryLength:
          scoringData.loanHistoryLength / (scoringData.scoring / 100),
        paymentHistory:
          scoringData.paymentHistory / (scoringData.scoring / 100),
        DTI: scoringData.DTI / (scoringData.scoring / 100),
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
              customerInfoScore: "Хэрэглэгчийн анкет",
              availableLoanAmount: "Одоогийн өрийн хэмжээ",
              loanHistoryLength: "Зээлийн түүхийн урт",
              paymentHistory: "Чанаргүй зээлийн түүх",
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
    if (customerData) {
      const mapped = customerData.CreditDatabase?.filter(
        (item) => item.balance
      )?.map((item, index) => ({
        ...item,
        num: index,
      }));
      setCustomerCredit(mapped);
      console.log(mapped);
    }
  }, [customerData]);

  useEffect(() => {
    let interval;

    if (loading) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setLoading(false);
            return 100;
          }
          return prev + 2;
        });
      }, 80);
    }

    return () => clearInterval(interval);
  }, [loading]);

  const checkRequerement = async () => {
    const { status, data } = await axios.post(
      `http://localhost:5000/loan/checkLoanRequirements/${registeredLoanRequest._id}`,
      {
        userId: customerData._id,
      }
    );
    if (status === 200) {
      console.log(data);
    }
  };

  useEffect(() => {
    const fetchScoringData = async () => {
      const { status, data } = await axios.post(
        `http://localhost:5000/customer/calculateScoring/${customerData._id}/${registeredLoanRequest._id}`
      );

      if (status === 200) {
        setScoringData(data);
      }
    };
    if (customerData && registeredLoanRequest) {
      console.log(registeredLoanRequest);
      fetchScoringData();
      checkRequerement();
    }
  }, [customerData, registeredLoanRequest]);

  useEffect(() => {
    const translations = {
      customerInfoScore: "Хэрэглэгчийн анкет",
      availableLoanAmount: "Одоогийн өрийн хэмжээ",
      loanHistoryLength: "Зээлийн түүхийн урт",
      paymentHistory: "Чанаргүй зээлийн түүх",
      DTI: "Өр орлогын харьцаа",
    };
    const scores = {
      customerInfoScore: 82.5,
      availableLoanAmount: 137.5,
      loanHistoryLength: 110,
      paymentHistory: 110,
      DTI: 110,
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
      label: "Зээлийн үлдэгдэл",
      accessor: "balance",
      flex: 3,
      headerAlign: "center",
      contentAlign: "center",
      renderCell: (params) => {
        return FormatNumber(params.balance);
      },
    },
    {
      label: "Валют",
      accessor: "currency",
      flex: 1,
      headerAlign: "center",
      contentAlign: "center",
    },
    {
      label: "Төлж дуусах хугацаа",
      accessor: "paidDate",
      flex: 3,
      headerAlign: "center",
      contentAlign: "center",
      renderCell: (params) => {
        if (params.paidDate) {
          return params.paidDate.split("T")[0];
        }
      },
    },
    {
      label: "Хүү",
      accessor: "interest",
      flex: 1,
      headerAlign: "center",
      contentAlign: "center",
      renderCell: (params) => {
        return params.interest + "%";
      },
    },
  ];

  // const registerLoanRequest = async () => {
  //   const body = {
  //     customerId: customerId,
  //     loanId: loanData._id,
  //     term: term,
  //     int: interest,
  //     amount: loanAmount,
  //   };
  //   const { status } = await axios.post(
  //     "http://localhost:5000/LoanRequest/registerLoanRequest",
  //     {
  //       ...body,
  //     }
  //   );
  //   if (status === 200) {
  //     setTimeout(() => {
  //       onClose();
  //     }, 2000);
  //   }
  // };

  return (
    <>
      {loading ? (
        <Grid2
          container
          justifyContent="center"
          alignItems="center"
          style={{ height: "300px" }}
        >
          <Grid2 textAlign="center">
            <CircularProgress
              variant="determinate"
              value={progress}
              size={80}
              sx={{ color: "#3166cc", mb: 2 }}
            />
            <Typography variant="h6">{progress}%</Typography>
          </Grid2>
        </Grid2>
      ) : (
        <div>
          <Grid2 container padding={1} spacing={2}>
            <Grid2 size={4}>
              <TextField
                size="small"
                fullWidth
                label="Цалин"
                value={FormatNumber(scoringData.salary)}
              />
            </Grid2>
            <Grid2 size={4}>
              <TextField
                size="small"
                fullWidth
                label="Идэвхитэй зээлийн нийт дүн"
                value={FormatNumber(scoringData.totalMonthlyPayment)}
              />
            </Grid2>
            <Grid2 size={4}>
              <TextField
                size="small"
                fullWidth
                label="Өр орлогын харьцаа"
                value={(
                  (scoringData.totalMonthlyPayment / scoringData.salary) *
                  100
                ).toFixed(1)}
              />
            </Grid2>
            <Grid2 size={12}>
              <Typography fontSize={17} fontWeight={"bold"}>
                Идэвхитэй зээлийн мэдээлэл
              </Typography>
            </Grid2>
            <Grid2 size={12}>
              <CustomDataGrid columns={columns} data={customerCredit} />
            </Grid2>
            <>
              <Grid2 size={12}>
                <Typography
                  fontSize={22}
                  fontWeight="bold"
                  textAlign={"justify"}
                >
                  Онооны дэлгэрэнгүй жагсаалт
                </Typography>
              </Grid2>
              {/* Left: Detailed Scores */}
              <Grid2
                size={12}
                container
                display={"flex"}
                justifyContent="space-between"
                p={0}
                gap={2}
              >
                <ScoreCard
                  title="Хэрэглэгчийн анкет"
                  score={scoringData.customerInfoScore}
                  icon={<PermIdentityIcon color="primary" sx={{ mr: 1 }} />}
                  maxScore={82.5}
                  getSecondary={() => `-`}
                />

                <ScoreCard
                  title="Одоогийн өрийн хэмжээ"
                  score={scoringData.availableLoanAmount}
                  icon={<PaymentsIcon color="primary" sx={{ mr: 1 }} />}
                  maxScore={137.5}
                  getSecondary={() => `-`}
                />

                <ScoreCard
                  title="Зээлийн түүхийн урт"
                  score={scoringData.loanHistoryLength}
                  maxScore={110}
                  icon={<RestoreIcon color="primary" sx={{ mr: 1 }} />}
                  getColor={(score, max) =>
                    Math.round(score / 22) < 3 ? "error.main" : "success.main"
                  }
                  getSecondary={(score) => `${Math.round(score / 22)} жил`}
                />

                <ScoreCard
                  title="Чанаргүй зээлийн түүх"
                  score={scoringData.paymentHistory}
                  icon={<GppBadIcon color="primary" sx={{ mr: 1 }} />}
                  maxScore={110}
                  getColor={(score, max) =>
                    5 - score / 22 > 3 ? "error.main" : "success.main"
                  }
                  getSecondary={(score, max) => `${5 - score / 22}`}
                />

                <ScoreCard
                  title="Өр орлогын харьцаа"
                  score={scoringData.DTI}
                  maxScore={110}
                  getColor={() =>
                    (scoringData.totalMonthlyPayment / scoringData.salary) *
                      100 >
                    45
                      ? "error.main"
                      : "success.main"
                  }
                  getSecondary={() =>
                    `${(
                      (scoringData.totalMonthlyPayment / scoringData.salary) *
                      100
                    ).toFixed(1)}%`
                  }
                />
                <Grid2
                  width={"32%"}
                  display={"flex"}
                  justifyContent={"flex-start"}
                >
                  <Button
                    variant="contained"
                    onClick={() => setScoringAdvice(true)}
                    sx={{
                      marginTop: 10.5,
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
                size={6}
                container
                direction="column"
                alignItems="center"
                justifyContent="center"
                bgcolor="#f5f7fb"
                borderRadius={3}
                p={3}
              >
                <Typography fontSize={22} fontWeight="bold" mb={3}>
                  Нийт оноо: {scoringData.scoring.toFixed(1)} ({scoringValue})
                </Typography>
                {data ? (
                  <Box
                    style={{ width: "300px", height: "350px" }}
                    display={"flex"}
                  >
                    <Doughnut data={data} options={options} />
                  </Box>
                ) : (
                  <Typography>Түр хүлээнэ үү...</Typography>
                )}
              </Grid2>

              {/* Right: Recommendations */}
              <Grid2
                size={6}
                container
                direction="column"
                alignItems="center"
                gap={2}
              >
                <CustomDataGrid
                  data={scoringCategory}
                  columns={scoringValueColumn}
                />
              </Grid2>
            </>

            <Grid2 size={6}>
              <Button
                variant="contained"
                onClick={handleBackButton}
                sx={{
                  width: "30%",
                  color: "white",
                  bgcolor: "#3166cc",
                  borderRadius: 5,
                }}
              >
                Буцах
              </Button>
            </Grid2>
            <Grid2 size={6} display={"flex"} justifyContent={"flex-end"}>
              <Button
                variant="contained"
                onClick={() => null}
                sx={{
                  width: "50%",
                  color: "white",
                  bgcolor: "#3166cc",
                  borderRadius: 5,
                }}
              >
                Хүсэлт үүсгэх
              </Button>
            </Grid2>
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
          </Grid2>
        </div>
      )}
    </>
  );
};

export default RegisterLoanRequest;
