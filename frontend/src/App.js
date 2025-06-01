import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Box, CssBaseline } from "@mui/material";
import Sidebar from "./Layouts/Sidebar/Sidebar.jsx";
import LoanInfo from "./Layouts/LoanInfo/LoanInfo.jsx";
import RegisterLoan from "./Layouts/RegisterLoan/RegisterLoan.jsx";
import LoanRequests from "./Layouts/LoanRequests/LoanRequests.jsx";
import Login from "./Layouts/Login/index.jsx";
import RegisterLoanInfo from "./Layouts/EditLoanTab/RegisterLoanInfo/RegisterLoanInfo.jsx";
import ChangeStatus from "./Layouts/EditLoanTab/ChangeStatus/ChangeStatus.jsx";
import EditRequirement from "./Layouts/EditRequirement/EditRequirement.jsx";
import LoanAmountCalculater from "./Layouts/Calculater/Calculater.jsx";
import Default from "./Layouts/Default/Default.jsx";
import Footer from "./Layouts/Footer/Footer.jsx";
import EditLoanInformation from "./Layouts/EditLoanInformation/EditLoanInformation.jsx";
import CalculateScoring from "./Layouts/ScoringTab/CalculateScoring/CalculateScoring.jsx";
import Register from "./Layouts/Register/index.jsx";
import LoanRequest from "./Layouts/LoanRequest/LoanRequest.jsx";
import AdminPanel from "./Layouts/AdminPanel/AdminPanel.jsx";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const type = localStorage.getItem("domain") !== null ? "admin" : "user";

  console.log(localStorage.getItem("domain") !== null ? "admin" : "user");

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
                <Route
                  path="/"
                  element={type === "admin" ? <AdminPanel /> : <Default />}
                />
                <Route path="/loanInformation" element={<LoanInfo />} />
                <Route path="/createLoan" element={<RegisterLoan />} />
                <Route
                  path="/editLoanInformation"
                  element={<EditLoanInformation />}
                />
                <Route path="/loanRequests" element={<LoanRequests />} />
                <Route path="/registerLoan" element={<RegisterLoanInfo />} />
                <Route path="/changeStatus" element={<ChangeStatus />} />
                <Route path="/editRequirement" element={<EditRequirement />} />
                <Route path="/loanRequest" element={<LoanRequest />} />
                <Route
                  path="/loanAmountCalculater"
                  element={<LoanAmountCalculater />}
                />
                <Route
                  path="/calculateScoring"
                  element={<CalculateScoring />}
                />
              </Routes>
            </Box>
            <Box sx={{ p: 0, pt: 0 }}>
              <Footer />
            </Box>
          </Box>
        </Box>
      ) : (
        <Routes>
          <Route path="/*" element={<Login />} />
          <Route path="/signUp" element={<Register />} />
        </Routes>
      )}
    </BrowserRouter>
  );
};

export default App;
