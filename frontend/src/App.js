import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Box, CssBaseline } from "@mui/material";
import Sidebar from "./Layouts/Sidebar/Sidebar.jsx";
import LoanInfo from "./Layouts/LoanInfo/LoanInfo.jsx";
import RegisterLoan from "./Layouts/RegisterLoan/RegisterLoan.jsx";
import LoanProcedure from "./Layouts/LoanProcedure/LoanProcedure.jsx";
import ProcedureReport from "./Layouts/ProcedureReport/ProcedureReport.jsx";
import Login from "./Layouts/Login/index.jsx";
import RegisterLoanInfo from "./Layouts/RegisterLoanInfo/RegisterLoanInfo.jsx";
import ChangeStatus from "./Layouts/ChangeStatus/ChangeStatus.jsx";
import EditRequirement from "./Layouts/EditRequirement/EditRequirement.jsx";
import LoanAmountCalculater from "./Layouts/Calculater/Calculater.jsx";
import Default from "./Layouts/Default/Default.jsx";
import Footer from "./Layouts/Footer/Footer.jsx";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      try {
        const isValid = validateToken(token);
        setIsAuthenticated(isValid);
      } catch (err) {
        console.error("Invalid token:", err);
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const validateToken = (token) => token.length > 10;

  return (
    <BrowserRouter>
      <CssBaseline />
      {isAuthenticated ? (
        <Box display="flex" minHeight="100vh">
          <Sidebar />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              bgcolor: "#dddfe3",
              display: "flex",
              flexDirection: "column",
              minHeight: "100vh",
            }}
          >
            <Box sx={{ flexGrow: 1, p: 4 }}>
              <Routes>
                <Route path="/" element={<Default />} />
                <Route path="/loanInformation" element={<LoanInfo />} />
                <Route path="/createLoan" element={<RegisterLoan />} />
                <Route path="/loanProcedure" element={<LoanProcedure />} />
                <Route path="/procedureReport" element={<ProcedureReport />} />
                <Route path="/registerLoan" element={<RegisterLoanInfo />} />
                <Route path="/changeStatus" element={<ChangeStatus />} />
                <Route path="/editRequirement" element={<EditRequirement />} />
                <Route
                  path="/loanAmountCalculater"
                  element={<LoanAmountCalculater />}
                />
              </Routes>
            </Box>
            <Box sx={{ flexGrow: 1, p: 4, pt: 1 }}>
              <Footer />
            </Box>
          </Box>
        </Box>
      ) : (
        <Routes>
          <Route path="/*" element={<Login />} />
        </Routes>
      )}
    </BrowserRouter>
  );
};

export default App;
