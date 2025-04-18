import React, { useState } from "react";
import { Grid2, Tabs, Tab, Box } from "@mui/material";
import PropTypes from "prop-types";
import LoanAmountCalculater from "./utils/LoanAmountCalculater";
import SavingCalculater from "./utils/SavingCalculater";

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

const Calculater = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <Grid2 container bgcolor={"white"} borderRadius={4} p={3} gap={1}>
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
            <LoanAmountCalculater />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <SavingCalculater />
          </CustomTabPanel>
        </Grid2>
      </Grid2>
    </div>
  );
};

export default Calculater;
