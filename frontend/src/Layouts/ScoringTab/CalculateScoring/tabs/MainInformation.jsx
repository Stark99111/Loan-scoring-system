import React, { useState } from "react";
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
import InfoIcon from "@mui/icons-material/Info";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import CustomDataGrid from "../../../../Components/CustomDataGrid";

const steps = [
  { label: "Үндсэн мэдээлэл", icon: InfoIcon },
  { label: "Хаягийн мэдээлэл", icon: HomeIcon },
  { label: "НДШ мэдээлэл", icon: PersonIcon },
  { label: "ЗМС-ын мэдээлэл", icon: ContactMailIcon },
  { label: "Зээлийн хүсэлтийн мэдээлэл", icon: NoteAddIcon },
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

const MainInformation = () => {
  const [activeStep, setActiveStep] = useState(0);

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
      label: "№",
      accessor: "number",
      flex: 2,
      headerAlign: "center",
      contentAlign: "center",
    },
    {
      label: "Дүн",
      accessor: "amount",
      flex: 2,
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
      label: "Байгууллага",
      accessor: "institute",
      flex: 2,
      headerAlign: "center",
      contentAlign: "center",
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
          const formattedDate = date.toLocaleDateString("en-GB");
          return formattedDate; // Return the formatted date
        } else {
          return "-";
        }
      },
    },
  ];

  const columnZMS = [
    {
      label: "Төрөл / валют",
      accessor: "currency",
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
          return params.firstLoanAmount.toLocaleString(2);
        } else {
          return "-";
        }
      },
    },
    {
      label: "Хүү (%)",
      accessor: "institute",
      flex: 2,
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
      label: "Төлөгдөх огноо",
      accessor: "updatedDate",
      flex: 2,
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
      label: "Төлсөн огноо",
      accessor: "updatedDate",
      flex: 2,
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
    {
      label: "Зээл олгосон байгууллага",
      accessor: "updatedDate",
      flex: 2,
      headerAlign: "center",
      contentAlign: "center",
      renderCell: (params) => {
        if (params.paidDate) {
          const date = new Date(params.paidDate);
          const formattedDate = date.toLocaleDateString("en-GB");
          return formattedDate; // Return the formatted date
        } else {
          return "-";
        }
      },
    },
    {
      label: "Тайлбар",
      accessor: "desc",
      flex: 2,
      headerAlign: "center",
      contentAlign: "center",
    },
  ];

  const loanInstitutionRequest = [
    {
      label: "№",
      accessor: "number",
      flex: 2,
      headerAlign: "center",
      contentAlign: "center",
    },
    {
      label: "Хүсэлтийн дүн",
      accessor: "desiredAmount",
      flex: 2,
      headerAlign: "center",
      contentAlign: "center",
      renderCell: (params) => {
        if (params.desiredAmount != null) {
          return params.desiredAmount.toLocaleString() + " MNT";
        } else {
          return "-";
        }
      },
    },
    {
      label: "Байгууллага",
      accessor: "loanInstitution",
      flex: 2,
      headerAlign: "center",
      contentAlign: "center",
    },
    {
      label: "Хүү (%)",
      accessor: "institute",
      flex: 2,
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
      label: "Хугацаа (сар)",
      accessor: "term",
      flex: 2,
      headerAlign: "center",
      contentAlign: "center",
    },
    {
      label: "Огноо",
      accessor: "date",
      flex: 2,
      headerAlign: "center",
      contentAlign: "center",
      renderCell: (params) => {
        if (params.date) {
          const date = new Date(params.date);
          const formattedDate = date.toLocaleDateString("en-GB");
          return formattedDate; // Return the formatted date
        } else {
          return "-";
        }
      },
    },
    {
      label: "Тайлбар",
      accessor: "desc",
      flex: 2,
      headerAlign: "center",
      contentAlign: "center",
    },
  ];

  return (
    <Box>
      <Grid2 container gap={3}>
        {/* Stepper */}
        <Grid2 size={12}>
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

        {/* Step Content */}
        {activeStep === 0 && (
          <Grid2 container spacing={2}>
            <Grid2 size={3}>
              <TextField fullWidth size="small" label="Овог" />
            </Grid2>
            <Grid2 size={3}>
              <TextField fullWidth size="small" label="Нэр" />
            </Grid2>
            <Grid2 size={3}>
              <TextField fullWidth size="small" label="Ургийн овог" />
            </Grid2>
            <Grid2 size={3}>
              <TextField fullWidth size="small" label="Нас" />
            </Grid2>
            <Grid2 size={3}>
              <TextField fullWidth size="small" label="Хүйс" />
            </Grid2>
            <Grid2 size={3}>
              <TextField fullWidth size="small" label="Иргэншил" />
            </Grid2>
            <Grid2 size={3}>
              <TextField fullWidth size="small" label="РД" />
            </Grid2>
            <Grid2 size={3}>
              <TextField
                fullWidth
                size="small"
                label="Төрсөн огноо"
                type="date"
                InputLabelProps={{ shrink: true }}
              />
            </Grid2>
          </Grid2>
        )}

        {activeStep === 1 && (
          <Grid2 container spacing={2}>
            <Grid2 size={3}>
              <TextField fullWidth size="small" label="Улс" />
            </Grid2>
            <Grid2 size={3}>
              <TextField fullWidth size="small" label="Хот" />
            </Grid2>
            <Grid2 size={3}>
              <TextField fullWidth size="small" label="Баг/дүүрэг" />
            </Grid2>
            <Grid2 size={3}>
              <TextField fullWidth size="small" label="Гудамж" />
            </Grid2>
            <Grid2 size={3}>
              <TextField fullWidth size="small" label="Тоот" />
            </Grid2>
            <Grid2 size={3}>
              <TextField fullWidth size="small" label="Сууцын төрөл" />
            </Grid2>
          </Grid2>
        )}

        {activeStep === 2 && (
          <Grid2 size={12}>
            <CustomDataGrid data={[]} columns={columns} />
          </Grid2>
        )}

        {activeStep === 3 && (
          <Grid2 size={12}>
            <CustomDataGrid data={[]} columns={columnZMS} />
          </Grid2>
        )}

        {activeStep === 4 && (
          <Grid2 size={12}>
            <CustomDataGrid data={[]} columns={loanInstitutionRequest} />
          </Grid2>
        )}

        {/* Buttons */}
        <Grid2 size={12} display="flex" justifyContent="space-between" mt={3}>
          <Button
            variant="outlined"
            onClick={handleBack}
            disabled={activeStep === 0}
          >
            Буцах
          </Button>
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={activeStep === steps.length - 1}
          >
            {activeStep === steps.length - 1
              ? "Зэрэглэл тооцоолуулах"
              : "Үргэлжлүүлэх"}
          </Button>
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default MainInformation;
