import React, { useEffect, useState } from "react";
import { Box, Typography, Tab, Tabs, Grid2, Button } from "@mui/material";
import GetLoanDataById from "../../../api/GetLoanDataById";
import Divider from "@mui/material/Divider";
import ChecklistRtlIcon from "@mui/icons-material/ChecklistRtl";
import AssignmentIcon from "@mui/icons-material/Assignment";

const LoanDetailsModal = ({ id, style, onClose, customerData }) => {
  const [loan, setLoan] = useState();
  const [req, setReq] = useState([]);
  const [con, setCon] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [isRequirementAvailable, setIsRequirementAvailable] = useState(false);
  useEffect(() => {
    GetLoanDataById(id).then((data) => {
      if (data) {
        setLoan(data.data.loans[0]);
        setReq(data.data.requirements || []);
        setCon(data.data.conditions || []);
      } else {
        setLoan(null);
        setReq(null);
        setCon(null);
      }
    });
  }, [id]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    if (req && req.length) {
      setIsRequirementAvailable(req.some((item) => item.requirementCode));
    } else {
      setIsRequirementAvailable(false);
    }
  }, [req]);

  if (!loan) {
    return (
      <Box sx={{ ...style, width: 900, textAlign: "center" }}>
        <Typography variant="h6" component="h2" mb={2}>
          Loan not found
        </Typography>
      </Box>
    );
  }

  return (
    <Grid2
      container
      sx={{ width: 900 }}
      // pt={3}
      height={"auto"}
      display="flex"
      justifyContent="space-between"
      borderRadius={5}
    >
      {/* Image Section */}
      {/* <Grid2 size={4} pl={1}>
        {loan.image && (
          <img
            src={loan.image}
            onError={(e) => (e.target.style.display = "none")}
            alt={loan.name}
            width={"100%"}
            height={"auto"}
            style={{
              boxShadow:
                "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
              borderRadius: 5,
            }}
          />
        )}
      </Grid2> */}

      {/* Details Section */}
      <Grid2
        size={12}
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
            display: "flex",
            justifyContent: "center",
          }}
        >
          {loan.name}
        </Typography>
        <Typography
          sx={{
            paddingLeft: 2,
            paddingRight: 8,
            fontSize: 17,
            fontWeight: "500",
            textAlign: "center",
          }}
        >
          {loan.description}
        </Typography>
      </Grid2>

      {/* Tabs Section */}
      <Grid2 size={12} sx={{ marginTop: 2, marginRight: 10 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          centered
          sx={{
            flexGrow: 1,
            spacing: 10,
            // bgcolor: "yellow",
            paddingBottom: 1,
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
          <Tab
            icon={<ChecklistRtlIcon />}
            iconPosition="start"
            label="Зээлийн нөхцөл"
            sx={{ marginRight: 5 }}
            lab
          />
          <Tab
            icon={<AssignmentIcon />}
            iconPosition="start"
            label="Тавигдах шаардлага"
            sx={{ marginLeft: 1 }}
          />
        </Tabs>
      </Grid2>
      <Grid2 size={12}></Grid2>

      {/* Tab Content */}
      {tabValue === 0 && (
        <>
          {con.length > 0 ? (
            con.map((item, index) => (
              <>
                <Grid2
                  size={6}
                  pr={10}
                  pl={7}
                  alignItems={"center"}
                  container
                  flexDirection={"row"}
                  spacing={2}
                  pt={1}
                  textAlign={"justify"}
                >
                  {/* <ChevronRightIcon fontSize="medium" /> */}
                  <Typography
                    key={index}
                    sx={{ fontWeight: "600", color: "#464a50" }}
                  >
                    {item.conditionName}
                  </Typography>
                </Grid2>
                <Grid2 size={6} p={1} paddingRight={5} spacing={2}>
                  <Typography
                    key={index}
                    sx={{
                      fontWeight: "600",
                      color: "#787b80",
                    }}
                  >
                    {item.Description}
                  </Typography>
                </Grid2>
                <Grid2 size={12} paddingRight={4} paddingLeft={4}>
                  <Divider />
                </Grid2>
              </>
            ))
          ) : (
            <Grid2 size={6} sx={{ padding: 2 }} flexDirection={"row"}>
              <Typography>No conditions available</Typography>
            </Grid2>
          )}
        </>
      )}
      {tabValue === 1 && (
        <>
          {req.length > 0 ? (
            req.map((item, index) => (
              <>
                {/* <Grid2 size={12} paddingRight={9}>
                  <Divider />
                </Grid2> */}
                <Grid2
                  size={12}
                  p={1}
                  pr={10}
                  pl={7}
                  alignItems={"center"}
                  container
                  flexDirection={"row"}
                  textAlign={"justify"}
                >
                  <Typography
                    key={index}
                    sx={{
                      fontWeight: "600",
                      color: "#787b80",
                    }}
                    textAlign={"justify"}
                  >
                    {index + 1 + ". " + item.requirementName}
                  </Typography>
                </Grid2>
                <Grid2 size={12} paddingRight={9} paddingLeft={7}>
                  <Divider />
                </Grid2>
              </>
            ))
          ) : (
            <Grid2 sx={{ padding: 2 }}>
              <Typography>No requirements available</Typography>
            </Grid2>
          )}
        </>
      )}
      {isRequirementAvailable && (
        <Grid2 size={11.4} pt={2} display={"flex"} justifyContent={"flex-end"}>
          <Button
            variant={"contained"}
            sx={{
              width: "25%",
              color: "white",
              bgcolor: "#3166cc",
              borderRadius: 5,
            }}
            onClick={onClose}
          >
            Хүсэлт үүсгэх
          </Button>
        </Grid2>
      )}
    </Grid2>
  );
};

export default LoanDetailsModal;
