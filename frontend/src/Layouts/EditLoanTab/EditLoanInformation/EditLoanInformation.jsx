import React, { useEffect, useState } from "react";
import {
  Grid2,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import Switch, { SwitchProps } from "@mui/material/Switch";
import GetRequirement from "../../../api/GetRequirement";
import GetCondition from "../../../api/GetConditions";
import UpdateLoan from "../../../api/UpdateLoan";
import RegisterCondition from "../../../api/RegisterCondition";
import RegisterRequirement from "../../../api/RegisterRequirement";

const EditLoanInformation = ({
  handleClose,
  loanOptions,
  bankOptions,
  data,
}) => {
  const [fields, setFields] = useState([{ value: "", condition: "" }]);
  const [loanType, setLoanType] = useState("");
  const [bankType, setBankType] = useState("");
  const [loanName, setLoanName] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState([""]);
  const [requirementData, setRequirementData] = useState();
  const [fieldData, setFieldData] = useState([{ value: "", condition: "" }]);
  const [status, setStatus] = useState(false);

  useEffect(() => {
    GetRequirement().then((res) => {
      if (res.data && res.data.length) {
        setRequirementData(res.data);
      }
    });
    GetCondition().then((res) => {
      if (res.data && res.data.length) {
        setFieldData(res.data);
      }
    });
  }, []);

  useEffect(() => {
    if (data.name) setLoanName(data.name);
    if (data.description) setDescription(data.description);

    console.log(data);
    if (data.requirements && data.requirements.length) {
      const reqs = data.requirements.map((item) =>
        requirementData?.find((item1) => item._id === item1._id)
      );
      setRequirements(reqs.map((r) => r?.requirementName || "")); // Set readable requirement text
    }
    if (data.loanCategories) {
      const findedLoanCat = loanOptions.find(
        (item) => item._id === data.loanCategories
      );
      setLoanType(findedLoanCat?.CategoryCode || null);
    }
    if (data.bankCategories) {
      const findedBankCat = bankOptions.find(
        (item) => item._id === data.bankCategories._id
      );
      setBankType(findedBankCat?.CategoryCode || null);
    }
    if (data.conditions && data.conditions.length) {
      const conditionFields = data.conditions.map((condId) =>
        fieldData.find((field) => field._id === condId._id)
      );
      const cleanedFields = conditionFields
        .filter((item) => item)
        .map((item) => ({
          value: item.conditionName || "",
          condition: item.Description || "",
        }));

      setFields(cleanedFields);
    }
    if (data.status != null) {
      setStatus(data.status);
    }
  }, [data, requirementData, fieldData]);

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

  const handleRemoveRequirement = (index) => {
    const updated = [...requirements];
    updated.splice(index, 1);
    setRequirements(updated);
  };

  const handleRemoveField = (index) => {
    const updated = [...fields];
    if (fields.length > 1) {
      updated.splice(index, 1);
      setFields(updated);
    }
  };

  const buttonHandle = async () => {
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
      const response = await UpdateLoan(
        data._id,
        loanName,
        loanType,
        bankType,
        requirements,
        status,
        fields,
        description
      );
      if (response) {
        // Show snackbar
        handleClose();
      }
    }, 1000);
  };

  return (
    <div>
      <Grid2 container display="flex" gap={3} gridAutoRows="auto">
        {/* Bank Type */}
        <Grid2 size={5.8}>
          <FormControl fullWidth size="small">
            <InputLabel id="bank-type-label">Банкны төрөл</InputLabel>
            <Select
              labelId="bank-type-label"
              value={bankType}
              label="Банкны төрөл"
              onChange={(e) => setBankType(e.target.value)}
            >
              {bankOptions?.map((item) => (
                <MenuItem key={item.CategoryCode} value={item.CategoryCode}>
                  {item.CategoryName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid2>
        <Grid2 size={5.8}>
          <FormControl fullWidth size="small">
            <InputLabel id="loan-type-label">Зээлийн төрөл</InputLabel>
            <Select
              labelId="loan-type-label"
              value={loanType}
              label="Зээлийн төрөл"
              onChange={(e) => setLoanType(e.target.value)}
            >
              {loanOptions?.map((item) => (
                <MenuItem key={item.CategoryCode} value={item.CategoryCode}>
                  {item.CategoryName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid2>
        <Grid2 size={5.8}>
          <TextField
            label="Зээлийн нэр"
            fullWidth
            size="small"
            value={loanName}
            onChange={(e) => setLoanName(e.target.value)}
          />
        </Grid2>
        <Grid2 size={5.8}>
          <FormControl fullWidth size="small">
            <InputLabel id="bank-type-label">Зээлийн төлөв</InputLabel>
            <Select
              labelId="bank-type-label"
              value={status}
              label="Зээлийн төлөв"
              onChange={(e) => setStatus(e.target.value)}
            >
              <MenuItem value={true}>{"Идэвхтэй"}</MenuItem>
              <MenuItem value={false}>{"Идэвхгүй"}</MenuItem>
            </Select>
          </FormControl>
        </Grid2>

        <Grid2 size={12}>
          <TextField
            multiline
            rows={3}
            label="Тайлбар"
            fullWidth
            size="small"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
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
                width="70%"
              />
            </Grid2>
            {fields.length > 1 ? (
              <>
                <Grid2 size={1} key={index}>
                  <Button
                    fullWidth
                    onClick={handleRemoveField}
                    variant="contained"
                    sx={{
                      width: "100%",
                      color: "white",
                      bgcolor: "#3166cc",
                      borderRadius: 5,
                    }}
                  >
                    Хасах
                  </Button>
                </Grid2>
                {index === fields.length - 1 ? (
                  <Grid2 size={10.5}></Grid2>
                ) : null}
              </>
            ) : (
              <></>
            )}
          </React.Fragment>
        ))}
        <Grid2
          size={1}
          display="flex"
          alignItems="center"
          ml={requirements.length === 1 ? -2 : -2}
        >
          <Button
            variant="contained"
            fullWidth
            onClick={handleAddField}
            sx={{
              width: "100%",
              color: "white",
              bgcolor: "#3166cc",
              borderRadius: 5,
            }}
          >
            Нэмэх
          </Button>
        </Grid2>

        {/* Requirements */}
        {requirements.map((requirement, index) => (
          <>
            <Grid2 size={10.3} key={index}>
              <TextField
                variant="outlined"
                label={`Шаардлага`}
                fullWidth
                size="small"
                value={requirement}
                onChange={(e) => handleRequirementChange(index, e)}
              />
            </Grid2>
            {requirements.length > 1 ? (
              <>
                <Grid2 size={1}>
                  <Button
                    fullWidth
                    onClick={handleRemoveRequirement}
                    variant="contained"
                    sx={{
                      width: "100%",
                      color: "white",
                      bgcolor: "#3166cc",
                      borderRadius: 5,
                    }}
                  >
                    Хасах
                  </Button>
                </Grid2>
                {index === requirements.length - 1 ? (
                  <Grid2 size={10.5}></Grid2>
                ) : null}
              </>
            ) : (
              <></>
            )}
          </>
        ))}
        <Grid2
          size={1}
          display="flex"
          alignItems="center"
          ml={requirements.length === 1 ? -2 : -2}
        >
          <Button
            variant="contained"
            fullWidth
            onClick={handleAddRequirement}
            sx={{
              width: "100%",
              color: "white",
              bgcolor: "#3166cc",
              borderRadius: 5,
            }}
          >
            Нэмэх
          </Button>
        </Grid2>

        <Grid2
          size={12}
          display="flex"
          justifyContent={"center"}
          alignItems="center"
        >
          <Button
            variant="contained"
            fullWidth
            onClick={buttonHandle}
            sx={{
              color: "white",
              bgcolor: "#3166cc",
              borderRadius: 5,
              width: "20%",
            }}
          >
            Хадгалах
          </Button>
        </Grid2>
      </Grid2>
    </div>
  );
};

export default EditLoanInformation;
