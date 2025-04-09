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

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Simulate JWT token validation
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      try {
        // Add your token validation logic here
        // For example, decode the token and check its expiration
        const isValid = validateToken(token); // Replace with your actual validation function
        setIsAuthenticated(isValid);
      } catch (err) {
        console.error("Invalid token:", err);
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  // Replace this with your actual token validation logic
  const validateToken = (token) => {
    // For simplicity, we'll assume the token is valid if it exists.
    // Add real validation here (e.g., decode the JWT and check expiration).
    return token.length > 10; // Example validation
  };

  return (
    <BrowserRouter>
      <Box display={isAuthenticated ? "flex" : 0}>
        <CssBaseline />
        {isAuthenticated ? (
          <>
            <Sidebar />
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                p: 4,
                bgcolor: "#dddfe3",
                minHeight: "100vh",
              }}
            >
              <Routes>
                <Route path="/" element={<Navigate to="/loanInformation" />} />
                <Route path="/loanInformation" element={<LoanInfo />} />
                <Route path="/createLoan" element={<RegisterLoan />} />
                <Route path="/loanProcedure" element={<LoanProcedure />} />
                <Route path="/procedureReport" element={<ProcedureReport />} />
                <Route path="/registerLoan" element={<RegisterLoanInfo />} />
                <Route path="/changeStatus" element={<ChangeStatus />} />
                <Route path="/editRequirement" element={<EditRequirement />} />
              </Routes>
            </Box>
          </>
        ) : (
          <Routes>
            <Route path="/*" element={<Login />} />
          </Routes>
        )}
      </Box>
    </BrowserRouter>
  );
};

export default App;
