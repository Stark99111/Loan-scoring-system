import React, { useState } from "react";
import {
  Grid2,
  Tabs,
  Tab,
  Box,
  Typography,
  Button,
  Modal,
  TextField,
} from "@mui/material";
import PropTypes from "prop-types";
import CustomDataGrid from "../../Components/CustomDataGrid";

const theme = {
  title: {
    fontSize: 23,
    fontWeight: "bold",
  },
};

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "background.paper",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const LoanAmountCalculater = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const columns = [
    { label: "Name", accessor: "name" },
    { label: "Age", accessor: "age" },
    { label: "Email", accessor: "email" },
  ];

  const data = [
    { name: "Alice", age: 30, email: "alice@example.com" },
    { name: "Bob", age: 25, email: "bob@example.com" },
    { name: "Charlie", age: 35, email: "charlie@example.com" },
  ];

  return (
    <div>
      <Grid2 container bgcolor={"white"} borderRadius={4} p={3} gap={1}>
        {/* <Grid2 size={12}>
          <Typography sx={theme.title}> Тооцоолуур</Typography>
        </Grid2> */}
        <Grid2 size={8}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            sx={{
              "& .MuiTab-root": {
                fontWeight: "bold",
                fontSize: "16px",
                textTransform: "none",
              },
              "& .Mui-selected": {
                fontWeight: "bold",
              },
            }}
          >
            <Tab label="Зээлийн тооцоолуур" {...a11yProps(0)} />
            <Tab label="Хадгаламжийн тооцоолуур" {...a11yProps(1)} />
          </Tabs>
        </Grid2>
        <Grid2 size={12}>
          <CustomTabPanel value={value} index={0}>
            <Grid2 size={12} container justifyContent={"space-between"} gap={2}>
              <Grid2 size={2}>
                <TextField label={"Зээлийн хэмжээ "} fullWidth size="small" />
              </Grid2>
              <Grid2 size={2}>
                <TextField label={"Зээлийн хугацаа "} fullWidth size="small" />
              </Grid2>
              <Grid2 size={2}>
                <TextField label={"Зээлийн хүү "} fullWidth size="small" />
              </Grid2>
              <Grid2 size={2}>
                <TextField
                  label={"Зээлийн эргэн төлөлт "}
                  fullWidth
                  size="small"
                />
              </Grid2>
              <Grid2 size={1.5}>
                <Button variant="contained" fullWidth>
                  Тооцоолох
                </Button>
              </Grid2>
              <Grid2 size={1}></Grid2>
              <Grid2 size={12}>
                <CustomDataGrid columns={columns} data={data} />
              </Grid2>
            </Grid2>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <Grid2 size={12} container justifyContent={"space-between"} gap={2}>
              <Grid2 size={2}>
                <TextField
                  label={"Данс нээх мөнгөн дүн"}
                  fullWidth
                  size="small"
                />
              </Grid2>
              <Grid2 size={2}>
                <TextField
                  label={"Хадгаламжийн жилийн хүү"}
                  fullWidth
                  size="small"
                />
              </Grid2>
              <Grid2 size={2}>
                <TextField label={"Хугацаа (сараар)"} fullWidth size="small" />
              </Grid2>
              <Grid2 size={2}>
                <TextField
                  label={"Сар бүр нэмж хийх мөнгөн дүн"}
                  fullWidth
                  size="small"
                />
              </Grid2>
              <Grid2 size={1.5}>
                <Button variant="contained" fullWidth>
                  Тооцоолох
                </Button>
              </Grid2>
              <Grid2 size={1}></Grid2>
              <Grid2 size={12}>
                <CustomDataGrid columns={columns} data={data} />
              </Grid2>
            </Grid2>
          </CustomTabPanel>
        </Grid2>
      </Grid2>
    </div>
  );
};

export default LoanAmountCalculater;
