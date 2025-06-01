import React, { useEffect, useState } from "react";
import {
  Grid2,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Box,
} from "@mui/material";
import axios from "axios";
import InfoIcon from "@mui/icons-material/Info";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import CustomDataGrid from "../../../Components/CustomDataGrid";

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

const CalculateScoring = () => {
  const [activeStep, setActiveStep] = useState(0);
  const userId = localStorage.getItem("userId");
  const [customerData, setCustomerData] = useState();
  const [SocialInsurance, setSocialInsurance] = useState([]);
  const [AddressInformation, setAddressInformation] = useState();
  const [CreditDatabase, setCreditDatabase] = useState([]);
  const [CustomerMainInformation, setCustomerMainInformation] = useState();

  useEffect(() => {
    const fetchCustomerData = async () => {
      const res = await axios.get(
        `http://localhost:5000/Customer/getAllById/${userId}`
      );
      if (res.data) {
        setCustomerData(res.data);
        const sortedInsurance = (res.data.SocialInsurance || []).sort(
          (a, b) => new Date(a.paidDate) - new Date(b.paidDate)
        );
        setSocialInsurance(sortedInsurance);

        setAddressInformation(res.data.AddressInformation || null);
        setCreditDatabase(res.data.CreditDatabase || null);
        setCustomerMainInformation(res.data.CustomerMainInformation || null);
      }
    };
    if (userId) {
      fetchCustomerData();
    }
  }, [userId]);
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
  const columns = [
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
      contentAlign: "center",
    },
    {
      label: "Анх олгосон дүн",
      accessor: "amount",
      flex: 2,
      headerAlign: "center",
      contentAlign: "center",
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

  {
    return (
      <Grid2
        container
        gap={2}
        display={"flex"}
        justifyContent={"flex-start"}
        bgcolor={"white"}
        borderRadius={2}
        p={3}
      >
        {/* Stepper */}
        {/* <Grid2 size={12}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel StepIconComponent={CustomStepIcon}>
                  <Typography fontSize={14}>{step.label}</Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Grid2> */}

        {/* Step Content */}
        {/* {activeStep === 0 && (
          <> */}
        <Grid2 size={12}>
          <Typography fontSize={22} fontWeight={"bold"}>
            Үндсэн мэдээлэл
          </Typography>
        </Grid2>
        <Grid2 size={2.9}>
          <TextField
            InputLabelProps={{ shrink: true }}
            fullWidth
            size="small"
            label="Овог"
            value={CustomerMainInformation?.lastName}
            // onChange={(e) => {
            //   setCustomerMainInformation({
            //     ...CustomerMainInformation,
            //     lastName: e.target.value,
            //   });
            // }}
          />
        </Grid2>
        <Grid2 size={2.9}>
          <TextField
            InputLabelProps={{ shrink: true }}
            fullWidth
            size="small"
            label="Нэр"
            value={CustomerMainInformation?.firstName}
            // onChange={(e) => {
            //   setCustomerMainInformation({
            //     ...CustomerMainInformation,
            //     firstName: e.target.value,
            //   });
            // }}
          />
        </Grid2>
        <Grid2 size={2.9}>
          <TextField
            InputLabelProps={{ shrink: true }}
            fullWidth
            size="small"
            label="Ургийн овог"
            value={CustomerMainInformation?.familyName}
            // onChange={(e) => {
            //   setCustomerMainInformation({
            //     ...CustomerMainInformation,
            //     familyName: e.target.value,
            //   });
            // }}
          />
        </Grid2>
        <Grid2 size={2.9}>
          <TextField
            InputLabelProps={{ shrink: true }}
            fullWidth
            size="small"
            label="Хүйс"
            value={CustomerMainInformation?.sex}
            // onChange={(e) => {
            //   setCustomerMainInformation({
            //     ...CustomerMainInformation,
            //     sex: e.target.value,
            //   });
            // }}
          />
        </Grid2>
        <Grid2 size={2.9}>
          <TextField
            InputLabelProps={{ shrink: true }}
            fullWidth
            size="small"
            label="Иргэншил"
            value={CustomerMainInformation?.nation}
            // onChange={(e) => {
            //   setCustomerMainInformation({
            //     ...CustomerMainInformation,
            //     nation: e.target.value,
            //   });
            // }}
          />
        </Grid2>
        <Grid2 size={2.9}>
          <TextField
            InputLabelProps={{ shrink: true }}
            fullWidth
            size="small"
            label="РД"
            value={customerData?.idNumber}
          />
        </Grid2>
        <Grid2 size={2.9}>
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
            // onChange={(e) => {
            //   setCustomerMainInformation({
            //     ...CustomerMainInformation,
            //     bornDate: e.target.value,
            //   });
            // }}
          />
        </Grid2>
        {/* </>
        )} */}

        {/* {activeStep === 1 && (
          <> */}
        <Grid2 size={12}>
          <Typography fontSize={22} fontWeight={"bold"}>
            Хаягийн мэдээлэл
          </Typography>
        </Grid2>
        <Grid2 size={2.9}>
          <TextField
            fullWidth
            size="small"
            label="Улс"
            InputLabelProps={{ shrink: true }}
            value={AddressInformation?.country}
            // onChange={(e) => {
            //   setAddressInformation({
            //     ...AddressInformation,
            //     country: e.target.value,
            //   });
            // }}
          />
        </Grid2>
        <Grid2 size={2.9}>
          <TextField
            fullWidth
            size="small"
            label="Хот"
            InputLabelProps={{ shrink: true }}
            value={AddressInformation?.city}
            // onChange={(e) => {
            //   setAddressInformation({
            //     ...AddressInformation,
            //     city: e.target.value,
            //   });
            // }}
          />
        </Grid2>
        <Grid2 size={2.9}>
          <TextField
            fullWidth
            size="small"
            label="Баг/дүүрэг"
            InputLabelProps={{ shrink: true }}
            value={AddressInformation?.district.CategoryName}
          />
        </Grid2>
        <Grid2 size={2.9}>
          <TextField
            fullWidth
            size="small"
            label="Гудамж"
            InputLabelProps={{ shrink: true }}
            value={AddressInformation?.street}
            // onChange={(e) => {
            //   setAddressInformation({
            //     ...AddressInformation,
            //     street: e.target.value,
            //   });
            // }}
          />
        </Grid2>
        <Grid2 size={2.9}>
          <TextField
            fullWidth
            size="small"
            label="Тоот"
            InputLabelProps={{ shrink: true }}
            value={AddressInformation?.number}
            // onChange={(e) => {
            //   setAddressInformation({
            //     ...AddressInformation,
            //     number: e.target.value,
            //   });
            // }}
          />
        </Grid2>
        <Grid2 size={2.9}>
          <TextField
            fullWidth
            size="small"
            label="Сууцын төрөл"
            InputLabelProps={{ shrink: true }}
            value={AddressInformation?.typeOfSeat}
            // onChange={(e) => {
            //   setAddressInformation({
            //     ...AddressInformation,
            //     typeOfSeat: e.target.value,
            //   });
            // }}
          />
        </Grid2>
        {/* </>
        )} */}

        {/* {activeStep === 2 && ( */}
        <Grid2 size={12}>
          <Typography fontSize={22} fontWeight={"bold"}>
            НДШ мэдээлэл
          </Typography>
        </Grid2>
        <Grid2 size={12}>
          <CustomDataGrid
            data={SocialInsurance}
            columns={columns}
            pagination={true}
          />
        </Grid2>
        {/* )} */}

        <Grid2 size={12}>
          <Typography fontSize={22} fontWeight={"bold"}>
            ЗМС-ын мэдээлэл
          </Typography>
        </Grid2>
        {/* {activeStep === 3 && ( */}
        <Grid2 size={12}>
          <CustomDataGrid
            data={CreditDatabase}
            columns={columnZMS}
            pagination={true}
          />
        </Grid2>
        {/* )} */}
        {/* <Grid2 size={12} display="flex" justifyContent="space-between" mt={2.9}>
          <Button
            variant="outlined"
            onClick={handleBack}
            disabled={activeStep === 0}
            sx={{
              width: "10%",
              color: "white",
              bgcolor: activeStep === 0 ? "ffff" : "#3166cc",
              borderRadius: 5,
            }}
          >
            Буцах
          </Button>
          <Button
            variant="contained"
            sx={{
              width: "20%",
              color: "white",
              bgcolor: "#3166cc",
              borderRadius: 5,
            }}
            disabled={activeStep === 3}
            onClick={handleNext}
          >
            {activeStep === steps.length - 1
              ? "Зэрэглэл тооцоолуулах"
              : "Үргэлжлүүлэх"}
          </Button>
        </Grid2> */}
      </Grid2>
    );
  }
};

export default CalculateScoring;
