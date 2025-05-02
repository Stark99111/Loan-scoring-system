import React from "react";
import { Grid2 } from "@mui/material"; // Import Grid2 from MUI
import picture from "../../Assets/bg-sign-in-basic.jpeg";
import RegisterForm from "./RegisterForm";

const Register = () => {
  return (
    <Grid2
      container
      sx={{
        minHeight: "100vh", // Full viewport height
        backgroundImage: `url(${picture})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      padding={0}
      justifyContent="center"
      alignItems="center"
    >
      <Grid2 xs={8}>
        <RegisterForm />
      </Grid2>
    </Grid2>
  );
};

export default Register;
