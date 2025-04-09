import React, { useEffect, useState } from "react";
import {
  Grid2,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Typography,
  Button,
} from "@mui/material";
import GetCategories from "../../api/GetCategories";
import RegisterCondition from "../../api/RegisterCondition";
import RegisterLoan from "../../api/RegisterLoan";
import imageCompression from "browser-image-compression";
import RegisterRequirement from "../../api/RegisterRequirement";
import { Snackbar, Alert } from "@mui/material";

const RegisterLoanInfo = () => {
  const [loanOptions, setLoanOptions] = useState([]);
  const [loanImage, setLoanImage] = useState();
  const [fields, setFields] = useState([{ value: "", condition: "" }]);
  const [loanType, setLoanType] = useState();
  const [loanName, setLoanName] = useState();
  const [description, setDescription] = useState();
  const [requirements, setRequirements] = useState([""]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    GetCategories().then((data) => {
      if (data) {
        const LoanOptions = data.data.filter(
          (item) => item.Description === "Зээлийн төрөл"
        );
        setLoanOptions(LoanOptions);
      }
    });
  }, []);

  const imageOnChange = async (e) => {
    const file = e.target.files[0];
    const options = {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1024,
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(file, options);
      const reader = new FileReader();
      reader.readAsDataURL(compressedFile);
      reader.onload = () => {
        setLoanImage(reader.result);
      };
    } catch (error) {
      console.error("Error compressing image:", error);
    }
  };

  const handleAddField = () => {
    setFields([...fields, { value: "", condition: "" }]);
  };

  const handleFieldChange = (index, key, event) => {
    const updatedFields = fields.map((field, i) =>
      i === index ? { ...field, [key]: event.target.value } : field
    );
    setFields(updatedFields);
  };

  const handleAddRequirement = () => {
    setRequirements([...requirements, ""]); // Add a new empty requirement
  };

  const handleRequirementChange = (index, event) => {
    const updatedRequirements = requirements.map((req, i) =>
      i === index ? event.target.value : req
    );
    setRequirements(updatedRequirements);
  };

  const buttonHandle = async () => {
    console.log(fields);
    fields?.map((item) => {
      if (item.value !== "") {
        RegisterCondition(item.value, item.condition);
      }
    });
    requirements?.map((item) => {
      if (item) {
        RegisterRequirement(item);
      }
    });

    setTimeout(async () => {
      const response = await RegisterLoan(
        loanName,
        loanType,
        requirements,
        fields,
        loanImage,
        description
      );
      if (response.status === 200) {
        setSnackbarOpen(true); // Show snackbar
        // Reset all fields
        setLoanName("");
        setLoanType("");
        setRequirements([""]);
        setFields([{ value: "", condition: "" }]);
        setLoanImage(null);
        setDescription("");
      }
    }, 1000);
  };

  return (
    <div>
      <Grid2 container bgcolor={"white"} borderRadius={4} p={3} gap={3}>
        <Grid2 size={12}>
          <Typography fontWeight={"bold"} fontSize={23} p={2}>
            Зээлийн мэдээлэл бүртгэх
          </Typography>
        </Grid2>
        <Grid2 size={2}>
          <FormControl fullWidth size="small">
            <InputLabel id="loan-type-label">Зээлийн төрөл</InputLabel>
            <Select
              labelId="loan-type-label"
              defaultValue=""
              label={"Зээлийн төрөл"}
              size="small"
              value={loanType}
              onChange={(e) => setLoanType(e.target.value)}
            >
              {loanOptions.map((item) => (
                <MenuItem key={item.CategoryCode} value={item.CategoryCode}>
                  {item.CategoryName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid2>
        <Grid2 size={4}>
          <TextField
            variant="outlined"
            label="Зээлийн нэр"
            fullWidth
            size="small"
            value={loanName}
            onChange={(e) => setLoanName(e.target.value)}
          />
        </Grid2>
        <Grid2 size={4}></Grid2>
        <Grid2 size={6.16}>
          <TextField
            type="file"
            label="Зураг"
            variant="outlined"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            size="small"
            onChange={imageOnChange}
          />
        </Grid2>
        <Grid2 size={6.16}>
          <TextField
            multiline
            label="Тайлбар"
            variant="outlined"
            fullWidth
            rows={3}
            size="small"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Grid2>
        <Grid2 size={12}>
          <Typography fontWeight={"bold"} fontSize={19} p={1}>
            Зээлийн нөхцөл
          </Typography>
        </Grid2>
        {fields.map((field, index) => (
          <React.Fragment key={index}>
            <Grid2 size={3}>
              <TextField
                variant="outlined"
                label="Утга"
                fullWidth
                size="small"
                value={field.value}
                onChange={(e) => handleFieldChange(index, "value", e)}
              />
            </Grid2>
            <Grid2 size={7}>
              <TextField
                variant="outlined"
                label="Нөхцөл"
                fullWidth
                size="small"
                value={field.condition}
                onChange={(e) => handleFieldChange(index, "condition", e)}
              />
            </Grid2>
          </React.Fragment>
        ))}
        <Grid2 size={1.6}>
          <Button
            variant="contained"
            fullWidth
            onClick={handleAddField}
            sx={{
              height: "40px",
              fontSize: 15,
              fontWeight: "bold",
              backgroundColor: "#05357E",
            }}
          >
            Нэмэх
          </Button>
        </Grid2>
        <Grid2 size={12}>
          <Typography fontWeight={"bold"} fontSize={19} p={1}>
            Тавигдах шаардлага
          </Typography>
        </Grid2>
        {requirements.map((requirement, index) => (
          <Grid2 size={10.15} key={index}>
            <TextField
              variant="outlined"
              label={`Шаардлага `}
              fullWidth
              size="small"
              value={requirement}
              onChange={(e) => handleRequirementChange(index, e)}
            />
          </Grid2>
        ))}
        <Grid2 size={1.6}>
          <Button
            variant="contained"
            fullWidth
            onClick={handleAddRequirement}
            sx={{
              height: "40px",
              fontSize: 15,
              fontWeight: "bold",
              backgroundColor: "#05357E",
            }}
          >
            Нэмэх
          </Button>
        </Grid2>
        <Grid2 size={12} height={20}></Grid2>
        <Grid2 size={12} display={"flex"} justifyContent={"flex-end"}>
          <Button
            variant="contained"
            sx={{
              width: "20%",
              backgroundColor: "#05357E",
              fontSize: 15,
              fontWeight: "bold",
            }}
            onClick={buttonHandle}
          >
            Зээл бүртгэх
          </Button>
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={3000}
            onClose={() => setSnackbarOpen(false)}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <Alert
              onClose={() => setSnackbarOpen(false)}
              severity="success"
              sx={{ width: "100%" }}
            >
              Амжилттай хадгалагдлаа
            </Alert>
          </Snackbar>
        </Grid2>
      </Grid2>
    </div>
  );
};

export default RegisterLoanInfo;
