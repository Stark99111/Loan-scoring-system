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

const LoanInfo = () => {
  const [value, setValue] = useState(0);
  const [loanData, setLoanData] = useState([]);
  const [loanModal, setLoanModal] = useState(false);
  const [id, setId] = useState();

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

  const renderTabContent = (filterCategoryId) => {
    const filteredData = filterCategoryId
      ? loanData.filter(
          (item) =>
            item?.categories === filterCategoryId && item?.status === true
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
            bgcolor={"#dddfe0"}
            borderRadius={4}
            display="flex"
            justifyContent="space-between"
          >
            <Grid2 size={4} pl={4} pt={4}>
              <img
                src={item?.image}
                onError={(e) => (e.target.style.display = "none")}
                width={"100%"}
                height={"auto"}
                style={{
                  boxShadow:
                    "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
                  borderRadius: 5,
                }}
              />
            </Grid2>
            <Grid2
              size={8}
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
            >
              <Button
                variant="contained"
                sx={{ fontWeight: "bold", height: "40px", bgcolor: "#05357E" }}
                onClick={() => handleOpen(item._id)}
              >
                Дэлгэрэнгүй
              </Button>
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
                display: "flex",
                justifyContent: "center",
              },
              "& .Mui-selected": {
                fontWeight: "bold",
              },
            }}
          >
            <Tab label="Бүгд" {...a11yProps(0)} />
            <Tab label="Дижитал зээл" {...a11yProps(1)} />
            <Tab label="Ногоон зээл" {...a11yProps(2)} />
            <Tab label="Орон сууцны зээл" {...a11yProps(3)} />
            <Tab label="Хэрэглээний зээл" {...a11yProps(4)} />
            <Tab label="Бизнесийн зээл" {...a11yProps(5)} />
          </Tabs>
        </Grid2>

        <CustomTabPanel value={value} index={0}>
          {renderTabContent(null)}
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          {renderTabContent("67571d947e3de1a6814437d6")}
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          {renderTabContent("67571da87e3de1a6814437d9")}
        </CustomTabPanel>
        <CustomTabPanel value={value} index={3}>
          {renderTabContent("67571db67e3de1a6814437dc")}
        </CustomTabPanel>
        <CustomTabPanel value={value} index={4}>
          {renderTabContent("67571dc27e3de1a6814437df")}
        </CustomTabPanel>
        <CustomTabPanel value={value} index={5}>
          {renderTabContent("67571dd07e3de1a6814437e2")}
        </CustomTabPanel>
        <Grid2 size={12}>
          <Modal
            open={loanModal}
            onClose={handleClose}
            aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description"
          >
            <Box sx={{ ...style, width: 900, borderRadius: 3 }}>
              <LoanDetailsModal id={id} style={style} />
            </Box>
          </Modal>
        </Grid2>
      </Grid2>
    </>
  );
};

export default LoanInfo;
