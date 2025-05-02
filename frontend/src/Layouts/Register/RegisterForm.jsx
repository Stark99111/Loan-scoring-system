import React, { useEffect, useState } from "react";
import UseNavigate, { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  CssBaseline,
  Alert,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import BigImage from "../../Assets/logo.png";
import Register from "./api/register";

const RegisterForm = () => {
  const navigate = useNavigate();
  const [formMessage, setFormMessage] = useState("");
  const [formErrorMessage, setFormErrorMessage] = useState("");

  const [phoneNumber, setPhoneNumber] = useState(null);
  const [password, setPassword] = useState(null);
  const [idNumber, setIdNumer] = useState(null);

  const {
    control,
    formState: { errors },
  } = useForm();

  const onSubmit = (e) => {
    e.preventDefault();
    Register(phoneNumber, password, idNumber).then((res) => {
      console.log(res);
      if (res === 200) {
        setFormMessage("Login successful!");
        navigate("/");
        window.location.reload();
      } else {
        setFormErrorMessage(res);
      }
    });
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: 2,
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          padding: 4,
          position: "relative",
        }}
      >
        <img
          src={BigImage}
          alt="Sidebar Logo"
          style={{
            width: "50px",
            height: "100%",
            padding: 2,
            objectFit: "contain",
            cursor: "pointer",
            filter: "saturate(1.5)",
          }}
        />

        <Typography
          component="h1"
          variant="h5"
          width={"80%"}
          textAlign={"center"}
          fontWeight={"540"}
        >
          Зээлжих зэрэглэлийн оноо тооцоолох систем
        </Typography>
        <Box
          component="form"
          noValidate
          sx={{ mt: 2, width: "100%" }}
          onSubmit={onSubmit} // Bind onSubmit to the form
        >
          <Controller
            name="email"
            control={control}
            defaultValue=""
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                message: "Invalid email address",
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                margin="normal"
                required
                fullWidth
                label={"Утасны дугаар"}
                type="email"
                autoComplete="email"
                error={!!errors.email}
                helperText={errors.email ? errors.email.message : ""}
                autoFocus
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            )}
          />
          <Controller
            name="phone"
            control={control}
            defaultValue=""
            rules={{
              required: "Registration number is required",
              pattern: {
                message: "Invalid phone number",
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                margin="normal"
                required
                fullWidth
                label={"Регистрийн дугаар"}
                type="text"
                autoComplete="register number"
                error={!!errors.email}
                helperText={errors.email ? errors.email.message : ""}
                autoFocus
                value={idNumber}
                onChange={(e) => setIdNumer(e.target.value)}
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            defaultValue=""
            rules={{ required: "Password is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                margin="normal"
                required
                fullWidth
                label="Нууц үг"
                type="password"
                autoComplete="current-password"
                error={!!errors.password}
                helperText={errors.password ? errors.password.message : ""}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            )}
          />
          <Button
            type="submit" // Set button type as submit
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
              backgroundColor: "#05357E",
              fontWeight: "bold",
            }}
          >
            Бүртгүүлэх
          </Button>
          <Button onClick={() => navigate("/")}>Нэвтрэх</Button>
        </Box>
        {formMessage && (
          <Alert severity="success" sx={{ mt: 0, width: "100%" }}>
            {formMessage}
          </Alert>
        )}
        {formErrorMessage && (
          <Alert severity="error" sx={{ mt: 0, width: "100%" }}>
            {formErrorMessage}
          </Alert>
        )}
      </Box>
    </Container>
  );
};

export default RegisterForm;
