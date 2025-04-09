import React from "react";
import { Grid2 } from "@mui/material"; // Import Grid2 from MUI
import Form from "./Utils/Form";
import picture from "../../Assets/bg-sign-in-basic.jpeg";

const Login = () => {
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
        <Form />
      </Grid2>
    </Grid2>
  );
};

export default Login;
