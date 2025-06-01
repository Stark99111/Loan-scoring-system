import React, { useEffect, useState } from "react";
import {
  Grid2,
  Typography,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Box,
  Button,
} from "@mui/material";
import axios from "axios";
import FormatNumber from "../../Components/FormatNumber";
import CustomDataGrid from "../../Components/CustomDataGrid";
import { Doughnut } from "react-chartjs-2";
import BalanceIcon from "@mui/icons-material/Balance";
import InfoIcon from "@mui/icons-material/Info";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import RestoreIcon from "@mui/icons-material/Restore";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import PaymentsIcon from "@mui/icons-material/Payments";
import GppBadIcon from "@mui/icons-material/GppBad";

const steps = [
  { label: "Үндсэн мэдээлэл", icon: InfoIcon },
  { label: "Хаягийн мэдээлэл", icon: HomeIcon },
  { label: "НДШ мэдээлэл", icon: PersonIcon },
  { label: "ЗМС-ын мэдээлэл", icon: ContactMailIcon },
];

const CustomStepIcon = ({ active, completed, icon }) => {
  const Icon = steps[Number(icon) - 1].icon;
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 40,
        height: 40,
        borderRadius: "50%",
        bgcolor: active || completed ? "primary.main" : "grey.400",
        color: "white",
        transition: "all 0.3s ease",
      }}
    >
      <Icon />
    </Box>
  );
};

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

const LoanRequests = () => {
  const [requests, setRequests] = useState([]);
  const [selected, setSelected] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [customerData, setCustomerData] = useState();
  const [SocialInsurance, setSocialInsurance] = useState([]);
  const [AddressInformation, setAddressInformation] = useState();
  const [CreditDatabase, setCreditDatabase] = useState([]);
  const [CustomerMainInformation, setCustomerMainInformation] = useState();
  const [scoringValue, setCategoryValue] = useState("");
  const [data, setData] = useState();

  const [scoringData, setScoringData] = useState();

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
    }
  };
  useEffect(() => {
    if (selected && selected[0].Customer) {
      setCustomerData(selected[0].Customer);
      const sortedInsurance = (selected[0].Customer.SocialInsurance || []).sort(
        (a, b) => new Date(a.paidDate) - new Date(b.paidDate)
      );
      setSocialInsurance(sortedInsurance);

      setAddressInformation(selected[0].Customer.AddressInformation || null);
      setCreditDatabase(selected[0].Customer.CreditDatabase || null);
      setCustomerMainInformation(
        selected[0].Customer.CustomerMainInformation || null
      );
    }
    if (selected && selected[0].Scoring) {
      setScoringData(selected[0].Scoring);
    }
  }, [selected]);

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

      const total = Object.values(weighted).reduce((sum, val) => sum + val, 0);

      const pieData = Object.entries(weighted).map(([label, value]) => ({
        name: label,
        value: parseFloat(((value / total) * 100).toFixed(1)),
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
        if (params.Loan && params.Loan.name) {
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

  const columns2 = [
    {
      label: "Ажил олгогчын нэр",
      accessor: "institute",
      flex: 2,
      headerAlign: "center",
      contentAlign: "center",
    },
    {
      label: "Ажил олгогчын код",
      accessor: "instituteCode",
      flex: 2,
      headerAlign: "center",
      contentAlign: "center",
    },
    {
      label: "Цалингийн хэмжээ",
      accessor: "salaryAmount",
      flex: 3,
      headerAlign: "center",
      contentAlign: "center",
      renderCell: (params) => {
        if (params.salaryAmount != null) {
          return params.salaryAmount.toLocaleString() + " MNT";
        } else {
          return "-";
        }
      },
    },
    {
      label: "Дүн",
      accessor: "amount",
      flex: 3,
      headerAlign: "center",
      contentAlign: "center",
      renderCell: (params) => {
        if (params.amount != null) {
          return params.amount.toLocaleString() + " MNT";
        } else {
          return "-";
        }
      },
    },
    {
      label: "Төлсөн огноо",
      accessor: "updatedDate",
      flex: 2,
      headerAlign: "center",
      contentAlign: "center",
      renderCell: (params) => {
        if (params.paidDate) {
          const date = new Date(params.paidDate);
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const year = date.getFullYear();
          return `${month}/${year}`;
        } else {
          return "-";
        }
      },
    },
  ];

  const columnZMS = [
    {
      label: "Байгууллага",
      accessor: "loanInstitution",
      flex: 2,
      headerAlign: "center",
      contentAlign: "left",
    },
    {
      label: "Анх олгосон дүн",
      accessor: "amount",
      flex: 2,
      headerAlign: "center",
      contentAlign: "right",
      renderCell: (params) => {
        if (params.firstLoanAmount != null) {
          return (
            params.firstLoanAmount.toLocaleString(2) + " " + params.currency
          );
        } else {
          return "-";
        }
      },
    },
    {
      label: "Зээлийн үлдэгдэл",
      accessor: "balance",
      flex: 2,
      headerAlign: "center",
      contentAlign: "center",
      renderCell: (params) => {
        if (params.balance != null) {
          return params.balance.toLocaleString(2) + " " + params.currency;
        } else {
          return "-";
        }
      },
    },
    {
      label: "Хүү (%)",
      accessor: "institute",
      flex: 1,
      headerAlign: "center",
      contentAlign: "center",
      renderCell: (params) => {
        if (params.interest != null) {
          return params.interest.toFixed(2) + " %";
        } else {
          return "-";
        }
      },
    },
    {
      label: "Олгосон огноо",
      accessor: "updatedDate",
      flex: 1.5,
      headerAlign: "center",
      contentAlign: "center",
      renderCell: (params) => {
        if (params.payDate) {
          const date = new Date(params.payDate);
          const formattedDate = date.toLocaleDateString("en-GB");
          return formattedDate;
        } else {
          return "-";
        }
      },
    },
    {
      label: "Төлөх ёстой огноо",
      accessor: "updatedDate",
      flex: 1.5,
      headerAlign: "center",
      contentAlign: "center",
      renderCell: (params) => {
        if (params.paidDate) {
          const date = new Date(params.paidDate);
          const formattedDate = date.toLocaleDateString("en-GB");
          return formattedDate;
        } else {
          return "-";
        }
      },
    },
  ];

  console.log(selected);

  return (
    <div>
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
            Бүртгэгдсэн зээлийн хүсэлтүүд
          </Typography>
        </Grid2>
        <Grid2 size={12} p={1}>
          <Typography fontSize={18}>
            Нийт бүртгэгдсэн зээлийн хүсэлт : {requests.length}
          </Typography>
        </Grid2>
        <Grid2 size={12}>
          <CustomDataGrid
            columns={columns}
            data={requests}
            checkboxSelection
            onRowSelection={(data) => {
              if (data) {
                setSelected(data);
              } else {
                setSelected(null);
              }
            }}
            pagination={true}
          />
        </Grid2>

        {selected && (
          <Grid2
            size={12}
            container
            gap={2}
            border={"1px solid rgb(228, 225, 225)"}
            display={"flex"}
            justifyContent={"center"}
            // bgcolor={"#f4eeed"}
            borderRadius={2}
            p={3}
          >
            <Grid2 size={12} pl={3}>
              <Typography fontSize={23}>
                Зээлийн хүсэлтийн хэрэглэгчийн мэдээлэл
              </Typography>
            </Grid2>
            <Grid2 size={12} pt={2}>
              <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((step, index) => (
                  <Step key={step.label}>
                    <StepLabel StepIconComponent={CustomStepIcon}>
                      <Typography fontSize={14}>{step.label}</Typography>
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Grid2>

            {activeStep === 0 && (
              <Grid2 container spacing={2}>
                <Grid2 size={3}>
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    size="small"
                    label="Овог"
                    value={CustomerMainInformation?.lastName}
                  />
                </Grid2>
                <Grid2 size={3}>
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    size="small"
                    label="Нэр"
                    value={CustomerMainInformation?.firstName}
                  />
                </Grid2>
                <Grid2 size={3}>
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    size="small"
                    label="Ургийн овог"
                    value={CustomerMainInformation?.familyName}
                  />
                </Grid2>
                <Grid2 size={3}>
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    size="small"
                    label="Хүйс"
                    value={CustomerMainInformation?.sex}
                  />
                </Grid2>
                <Grid2 size={3}>
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    size="small"
                    label="Иргэншил"
                    value={CustomerMainInformation?.nation}
                  />
                </Grid2>
                <Grid2 size={3}>
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    size="small"
                    label="РД"
                    value={customerData?.idNumber}
                  />
                </Grid2>
                <Grid2 size={3}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Төрсөн огноо"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={
                      CustomerMainInformation?.bornDate
                        ? new Date(CustomerMainInformation?.bornDate)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                  />
                </Grid2>
              </Grid2>
            )}

            {activeStep === 1 && (
              <Grid2 container spacing={2}>
                <Grid2 size={3}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Улс"
                    InputLabelProps={{ shrink: true }}
                    value={AddressInformation?.country}
                  />
                </Grid2>
                <Grid2 size={3}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Хот"
                    InputLabelProps={{ shrink: true }}
                    value={AddressInformation?.city}
                  />
                </Grid2>
                <Grid2 size={3}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Баг/дүүрэг"
                    InputLabelProps={{ shrink: true }}
                    value={AddressInformation?.district.CategoryName}
                  />
                </Grid2>
                <Grid2 size={3}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Гудамж"
                    InputLabelProps={{ shrink: true }}
                    value={AddressInformation?.street}
                  />
                </Grid2>
                <Grid2 size={3}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Тоот"
                    InputLabelProps={{ shrink: true }}
                    value={AddressInformation?.number}
                  />
                </Grid2>
                <Grid2 size={3}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Сууцын төрөл"
                    InputLabelProps={{ shrink: true }}
                    value={AddressInformation?.typeOfSeat}
                  />
                </Grid2>
              </Grid2>
            )}

            {activeStep === 2 && (
              <Grid2 size={12}>
                <CustomDataGrid
                  data={SocialInsurance}
                  columns={columns2}
                  pagination={true}
                />
              </Grid2>
            )}

            {activeStep === 3 && (
              <Grid2 size={12}>
                <CustomDataGrid
                  data={CreditDatabase}
                  columns={columnZMS}
                  pagination={true}
                />
              </Grid2>
            )}

            <Grid2 size={11.2} display="flex" justifyContent="space-between">
              <Button
                variant="outlined"
                onClick={handleBack}
                disabled={activeStep === 0}
                sx={{
                  color: "white",
                  bgcolor: activeStep === 0 ? "ffff" : "#3166cc",
                  borderRadius: 5,
                }}
              >
                {"< өмнөх"}
              </Button>
              <Button
                variant="contained"
                sx={{
                  color: "white",
                  bgcolor: "#3166cc",
                  borderRadius: 5,
                }}
                disabled={activeStep === 3}
                onClick={handleNext}
              >
                {"Дараагийх >"}
              </Button>
            </Grid2>
            <Grid2 size={12} pl={3}>
              <Typography fontSize={20}>Хэрэглэгчийн скоринг</Typography>
            </Grid2>
            <>
              {/* Left: Detailed Scores */}
              <Grid2
                size={5}
                container
                display={"flex"}
                justifyContent="space-between"
                p={0}
                gap={2}
              >
                <ScoreCard
                  title="Хэрэглэгчийн анкет"
                  score={scoringData?.customerInfoScore}
                  icon={<PermIdentityIcon color="primary" sx={{ mr: 1 }} />}
                  maxScore={82.5}
                  getSecondary={() => `-`}
                />

                <ScoreCard
                  title="Одоогийн өрийн хэмжээ"
                  score={scoringData?.availableLoanAmount}
                  icon={<PaymentsIcon color="primary" sx={{ mr: 1 }} />}
                  maxScore={137.5}
                  getSecondary={() => `-`}
                />

                <ScoreCard
                  title="Зээлийн түүхийн урт"
                  score={scoringData?.loanHistoryLength}
                  maxScore={110}
                  icon={<RestoreIcon color="primary" sx={{ mr: 1 }} />}
                  getColor={(score, max) =>
                    Math.round(score / 22) < 3 ? "error.main" : "success.main"
                  }
                  getSecondary={(score) => `${Math.round(score / 22)} жил`}
                />

                <ScoreCard
                  title="Чанаргүй зээлийн түүх"
                  score={scoringData?.paymentHistory}
                  icon={<GppBadIcon color="primary" sx={{ mr: 1 }} />}
                  maxScore={110}
                  getColor={(score, max) =>
                    5 - score / 22 > 3 ? "error.main" : "success.main"
                  }
                  getSecondary={(score, max) => `${5 - score / 22}`}
                />

                <ScoreCard
                  title="Өр орлогын харьцаа"
                  score={scoringData?.DTI}
                  maxScore={110}
                  getColor={() =>
                    (scoringData?.totalMonthlyPayment / scoringData?.salary) *
                      100 >
                    45
                      ? "error.main"
                      : "success.main"
                  }
                  getSecondary={() => `-`}
                />
              </Grid2>

              {/* Center: Score Chart */}
              <Grid2
                size={5.8}
                container
                direction="column"
                alignItems="center"
                justifyContent="center"
                bgcolor="#f5f7fb"
                borderRadius={3}
                p={3}
              >
                <Typography fontSize={22} fontWeight="bold" mb={2}>
                  Нийт оноо: {scoringData?.scoring.toFixed(2)} ({scoringValue})
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
            </>
          </Grid2>
        )}
      </Grid2>
    </div>
  );
};

export default LoanRequests;
