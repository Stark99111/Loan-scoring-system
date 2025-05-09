import React, { useEffect, useState } from "react";
import {
  Grid2,
  Tabs,
  Tab,
  Box,
  Typography,
  Button,
  Modal,
} from "@mui/material";
import PropTypes from "prop-types";
import GetLoan from "./api/GetLoan";
import LoanDetailsModal from "./modal/LoanMainInfo";
import CustomModal from "../../Components/CustomModal";
import LoanRiskCalculater from "./modal/LoanRiskCalculater";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import axios from "axios";
import CustomerCreditData from "./modal/CustomerCreditData";

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
  // position: "absolute",
  // top: "50%",
  // left: "50%",
  // transform: "translate(-50%, -50%)",
  // // width: 800,
  // bgcolor: "background.paper",
  // boxShadow: 24,
  // pt: 2,
  // px: 4,
  // pb: 3,
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

const LoanInfo = () => {
  const [value, setValue] = useState(0);
  const [loanData, setLoanData] = useState([]);
  const [loanModal, setLoanModal] = useState(false);
  const [id, setId] = useState();
  const [loanRiskModal, setLoanRIskModal] = useState(false);
  const user = localStorage.getItem("userId");
  const [customerData, setCustomerData] = useState(null);
  const [customerCreditModal, setCustomerCreditModal] = useState(false);

  useEffect(() => {
    const fetchCustomerData = async () => {
      const { status, data } = await axios.get(
        `http://localhost:5000/Customer/getAllById/${user}`
      );
      if (status === 200) {
        setCustomerData(data);
      }
    };
    fetchCustomerData();
  }, [user]);

  const handleOpenCredit = () => {
    setLoanRIskModal(false);
    setCustomerCreditModal(true);
  };

  const handleOpen = (id) => {
    setId(id);
    setLoanModal(true);
  };
  const handleClose = () => {
    setLoanModal(false);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    GetLoan()
      .then((response) => {
        if (response && Array.isArray(response.data)) {
          setLoanData(response.data);
        } else {
          setLoanData([]);
        }
      })
      .catch(() => {
        setLoanData([]);
      });
  }, []);

  const handleCloseModal = () => {
    setLoanModal(false);
    setLoanRIskModal(true);
  };

  const handleBack = () => {
    setLoanModal(true);
    setLoanRIskModal(false);
  };

  const renderTabContent = (filterCategoryId) => {
    console.log(loanData);
    console.log(filterCategoryId);
    const filteredData = filterCategoryId
      ? loanData.filter(
          (item) =>
            item?.bankCategories === filterCategoryId && item?.status === true
        )
      : loanData.filter((item) => item?.status === true);

    return (
      <Grid2 container gap={2} justifyContent={"space-around"}>
        {filteredData.map((item, index) => (
          <Grid2
            key={index}
            size={5}
            height={"auto"}
            container
            // bgcolor={"#dddfe0"}
            borderRadius={4}
            display="flex"
            justifyContent="space-between"
            sx={{
              boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.5)",
            }}
          >
            <Grid2 size={5} pl={4} pt={4}>
              <img
                src={item?.image}
                onError={(e) => (e.target.style.display = "none")}
                width={"100%"}
                height={"auto"}
                display={"flex"}
                alignItems={"center"}
                style={{
                  boxShadow:
                    "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
                  borderRadius: 5,
                }}
              />
            </Grid2>
            <Grid2
              size={7}
              container
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              textAlign={"justify"}
            >
              <Typography
                sx={{
                  paddingTop: 2,
                  paddingBottom: 2,
                  fontSize: 22,
                  textAlign: "center",
                  color: "#05357E",
                }}
              >
                {item?.name}
              </Typography>
              <Typography
                sx={{
                  paddingLeft: 2,
                  paddingRight: 4,
                  fontSize: 17,
                }}
              >
                {item?.description}
              </Typography>
            </Grid2>

            <Grid2
              size={12}
              pr={3}
              pb={2}
              display={"flex"}
              justifyContent={"flex-end"}
              alignItems="center"
            >
              <Button
                variant="contained"
                sx={{
                  fontWeight: "bold",
                  height: "40px",
                  bgcolor: "#ffffff",
                  border: "none",
                  boxShadow: "none",
                  "&:hover": {
                    border: "none",
                    boxShadow: "none",
                    bgcolor: "#ffffff",
                    color: "#05357E",
                  },
                  color: "#05357E",
                }}
                onClick={() => handleOpen(item._id)}
              >
                Дэлгэрэнгүй
              </Button>
              <TrendingFlatIcon
                sx={{
                  color: "#05357E",
                }}
              ></TrendingFlatIcon>
            </Grid2>
          </Grid2>
        ))}
        {Array.from(
          { length: (2 - (filteredData.length % 2)) % 2 },
          (_, idx) => (
            <Grid2 key={`empty-${idx}`} size={5} bgcolor={"transparent"} />
          )
        )}
      </Grid2>
    );
  };

  return (
    <>
      <Grid2
        container
        gap={2}
        display={"flex"}
        justifyContent={"center"}
        bgcolor={"white"}
        borderRadius={2}
        p={3}
      >
        <Grid2 size={12} display="flex" justifyContent="center">
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            sx={{
              "& .MuiTab-root": {
                fontWeight: "bold",
                fontSize: "16px",
                textTransform: "none",
                display: "flex",
                justifyContent: "center",
              },
              "& .Mui-selected": {
                fontWeight: "bold",
              },
            }}
          >
            <Tab label="Бүгд" {...a11yProps(0)} />
            <Tab label="Хаан банк" {...a11yProps(1)} />
            <Tab label="Голомт банк" {...a11yProps(2)} />
            <Tab label="Худалдаа хөгжлийн банк" {...a11yProps(3)} />
            <Tab label="Хас банк" {...a11yProps(4)} />
          </Tabs>
        </Grid2>

        <CustomTabPanel value={value} index={0}>
          {renderTabContent(null)}
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          {renderTabContent("67ff936badca6cbc0e9aa14b")}
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          {renderTabContent("67ff9379adca6cbc0e9aa14e")}
        </CustomTabPanel>
        <CustomTabPanel value={value} index={3}>
          {renderTabContent("67ff9388adca6cbc0e9aa154")}
        </CustomTabPanel>
        <CustomTabPanel value={value} index={4}>
          {renderTabContent("67ff937eadca6cbc0e9aa151")}
        </CustomTabPanel>
        {/* <CustomTabPanel value={value} index={5}>
          {renderTabContent("67ff9390adca6cbc0e9aa157")}
        </CustomTabPanel> */}
        <Grid2 size={12}>
          <CustomModal open={loanModal} onClose={handleClose}>
            <Box sx={{ width: 900, borderRadius: 3 }}>
              <LoanDetailsModal
                id={id}
                onClose={handleCloseModal}
                customerData={customerData}
              />
            </Box>
          </CustomModal>
          <CustomModal
            open={loanRiskModal}
            onClose={() => setLoanRIskModal(false)}
            title={"Зээлийн хүсэлт үүсгэх"}
          >
            <Box sx={{ width: 800, borderRadius: 3 }}>
              <LoanRiskCalculater
                id={id}
                handleBack={handleBack}
                customerData={customerData}
                handleOpenCredit={handleOpenCredit}
                customerId={user}
              />
            </Box>
          </CustomModal>

          <CustomModal
            open={customerCreditModal}
            title={"Зээлийн хүсэлт үүсгэх"}
            onClose={() => setCustomerCreditModal(false)}
          >
            <Box sx={{ width: 800, borderRadius: 3 }}>
              <CustomerCreditData
                handleBackButton={() => {
                  setCustomerCreditModal(false);
                  setLoanModal(true);
                }}
                customerId={user}
                loanData={loanData.find((item) => item._id === id)}
              />
            </Box>
          </CustomModal>
        </Grid2>
      </Grid2>
    </>
  );
};

export default LoanInfo;
