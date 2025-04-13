import {
  Grid2,
  TextField,
  Button,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  Typography,
  Modal,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import GetCategories from "../../api/GetCategories";
import GetLoanByCategory from "../../api/GetLoanByCategory";
import GetCustomerInfo from "../../api/GetCustomerInfo";
import CheckData from "./modal/CheckData";
import Snackbar from "@mui/material/Snackbar";

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

const RegisterLoan = () => {
  const [name, setName] = useState();
  const [ovog, setOvog] = useState();
  const [id, setID] = useState();
  const [phoneNumber, setPhoneNumber] = useState();
  const [loanType, setLoanType] = useState();
  const [loanName, setLoanName] = useState();
  const [loanOptions, setLoanOptions] = useState([]);
  const [loans, setLoans] = useState([]);
  const [customerMainInfo, setCustomerMainInfo] = useState();
  const [customerAddressInfo, setCustomerAddressInfo] = useState();
  const [socialInsurance, setSocialInsurance] = useState([]);
  const [creditDatabase, setCreditDatabase] = useState();
  const [handleModel, setHandleModal] = useState(false);
  const [loanId, setLoanId] = useState();
  const [cusId, setCusId] = useState();
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const openModal = () => {
    setHandleModal(true);
  };
  const closeModal = () => {
    setHandleModal(false);
  };

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

  useEffect(() => {
    if (loanType) {
      GetLoanByCategory(loanType).then((data) => {
        if (data) {
          setLoans(data.data);
        }
      });
    }
  }, [loanType]);

  useEffect(() => {
    const selectedLoan = loans.find((item) => item.name === loanName);
    console.log(selectedLoan);
    if (selectedLoan) {
      setLoanId(selectedLoan._id);
    }
  }, [loans, loanName]);

  const buttonHandle = () => {
    if (ovog && name && id && phoneNumber) {
      setLoading(true); // Start loading
      handleClick();
      GetCustomerInfo(name, id, phoneNumber)
        .then((data) => {
          if (data.data) {
            console.log(data);
            setCustomerAddressInfo(data.data.AddressInformation ?? null);
            setCusId(data.data._id);
            setCustomerMainInfo(data.data ?? null);
            setSocialInsurance(data.data.SocialInsurance ?? null);
            setCreditDatabase(data.data.CreditDatabase ?? null);
          }
        })
        .finally(() => {
          setTimeout(() => {
            setLoading(false); // Stop loading after 5 seconds
            handleClose(); // Call handleClose after 5 seconds
          }, 3000);
        });
    }
  };

  return (
    <>
      <Grid2
        container
        gap={2}
        justifyContent={"space-around"}
        bgcolor={"white"}
        borderRadius={4}
        p={2}
      >
        <Grid2 size={12}>
          <Typography fontWeight={"bold"} fontSize={23} p={2}>
            Зээл бүртгэх
          </Typography>
        </Grid2>
        <Grid2 size={2}>
          <FormControl fullWidth size="small">
            <InputLabel id="loan-type-label" size="small">
              Зээлийн төрөл
            </InputLabel>
            <Select
              labelId="loan-type-label"
              defaultValue=""
              label={"Зээлийн төрөл"}
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

        <Grid2 size={2}>
          <FormControl fullWidth size="small">
            <InputLabel id="loan-type-label" size="small">
              Зээлийн нэр
            </InputLabel>
            <Select
              labelId="loan-type-label"
              defaultValue=""
              label={"Зээлийн нэр"}
              value={loanName}
              onChange={(e) => setLoanName(e.target.value)}
            >
              {loans?.map((item) => (
                <MenuItem key={item.name} value={item.name}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid2>
        <Grid2 size={2}></Grid2>
        <Grid2 size={2}></Grid2>
        <Grid2 size={2}></Grid2>
        <Grid2 size={2}>
          <TextField
            label="Овог"
            variant="outlined"
            type="text"
            fullWidth
            size="small"
            value={ovog}
            onChange={(e) => setOvog(e.target.value)}
          />
        </Grid2>
        <Grid2 size={2}>
          <TextField
            label="Нэр"
            variant="outlined"
            type="text"
            fullWidth
            size="small"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Grid2>
        <Grid2 size={2}>
          <TextField
            label="Регистрийн дугаар"
            variant="outlined"
            type="text"
            fullWidth
            size="small"
            value={id}
            onChange={(e) => setID(e.target.value)}
          />
        </Grid2>
        <Grid2 size={2}>
          <TextField
            label="Утасны дугаар"
            variant="outlined"
            type="text"
            fullWidth
            size="small"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </Grid2>
        <Grid2 size={2}>
          <Button
            variant="contained"
            fullWidth
            onClick={buttonHandle}
            sx={{ bgcolor: "#05357E" }}
          >
            {loading ? "Loading..." : "Мэдээлэл татах"}
          </Button>
        </Grid2>
        {customerMainInfo && !loading ? (
          <>
            <Grid2 size={12}>
              <Typography fontWeight={"bold"} fontSize={20} p={2}>
                Хувийн мэдээлэл
              </Typography>
            </Grid2>
            <Grid2 size={2}>
              <TextField
                label="Иргэншил"
                variant="outlined"
                type="text"
                fullWidth
                size="small"
                value={customerMainInfo?.nation}
              />
            </Grid2>
            <Grid2 size={2}>
              <TextField
                label="Яс үндэс"
                variant="outlined"
                type="text"
                fullWidth
                size="small"
                value={"Халх"}
              />
            </Grid2>
            <Grid2 size={2}>
              <TextField
                label="Ургийн овог"
                variant="outlined"
                type="text"
                fullWidth
                size="small"
                value={customerMainInfo?.urgiinOvog}
              />
            </Grid2>
            <Grid2 size={2}>
              <TextField
                label="Төрсөн он сар өдөр"
                variant="outlined"
                type="text"
                fullWidth
                size="small"
                value={customerMainInfo?.bornDate?.split("T")[0]}
              />
            </Grid2>
            <Grid2 size={2}>
              <TextField
                label="Хүйс"
                variant="outlined"
                type="text"
                fullWidth
                size="small"
                value={customerMainInfo?.sex}
              />
            </Grid2>
          </>
        ) : (
          <></>
        )}
        {customerAddressInfo && !loading ? (
          <>
            <Grid2 size={12}>
              <Typography fontWeight={"bold"} fontSize={20} p={2}>
                Хаягийн мэдээлэл
              </Typography>
            </Grid2>
            <Grid2 size={2}>
              <TextField
                label="Улс"
                variant="outlined"
                type="text"
                fullWidth
                size="small"
                value={customerAddressInfo?.country}
              />
            </Grid2>
            <Grid2 size={2}>
              <TextField
                label="Хот / аймаг"
                variant="outlined"
                type="text"
                fullWidth
                size="small"
                value={customerAddressInfo?.city}
              />
            </Grid2>
            <Grid2 size={2}>
              <TextField
                label="Дүүрэг / Сум"
                variant="outlined"
                type="text"
                fullWidth
                size="small"
                value={customerAddressInfo?.district}
              />
            </Grid2>
            <Grid2 size={2}>
              <TextField
                label="Хороо / баг"
                variant="outlined"
                type="text"
                fullWidth
                size="small"
                value={customerAddressInfo?.street}
              />
            </Grid2>
            <Grid2 size={2}>
              <TextField
                label="Гудамж тоот"
                variant="outlined"
                type="text"
                fullWidth
                size="small"
                value={customerAddressInfo?.number}
              />
            </Grid2>
          </>
        ) : (
          <></>
        )}
        {socialInsurance.length && !loading ? (
          <>
            <Grid2 size={12}>
              <Typography fontWeight={"bold"} fontSize={20} p={2}>
                Нийгмийн даатгал төлөлт
              </Typography>
            </Grid2>
            <Grid2 size={12}>
              <table
                style={{
                  width: "100%",
                  textAlign: "left",
                  borderCollapse: "collapse",
                  border: "1px solid #ddd",
                  backgroundColor: "#f9f9f9",
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: "#f2f2f2", color: "#333" }}>
                    <th
                      style={{
                        padding: "12px",
                        borderBottom: "2px solid #ddd",
                      }}
                    >
                      №
                    </th>
                    <th
                      style={{
                        padding: "12px",
                        borderBottom: "2px solid #ddd",
                      }}
                    >
                      Дүн
                    </th>
                    <th
                      style={{
                        padding: "12px",
                        borderBottom: "2px solid #ddd",
                      }}
                    >
                      Байгууллага
                    </th>
                    <th
                      style={{
                        padding: "12px",
                        borderBottom: "2px solid #ddd",
                      }}
                    >
                      Төлсөн огноо
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {socialInsurance?.map((item, index) => (
                    <tr
                      key={item._id}
                      style={{
                        backgroundColor:
                          index % 2 === 0 ? "#ffffff" : "#f2f2f2",
                        transition: "background-color 0.3s",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#e9ecef")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          index % 2 === 0 ? "#ffffff" : "#f2f2f2")
                      }
                    >
                      <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                        {index + 1}
                      </td>
                      <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                        {item.amount.toLocaleString()} MNT
                      </td>
                      <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                        {item.institute}
                      </td>
                      <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                        {new Date(item.paidDate).toISOString().split("T")[0]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Grid2>
          </>
        ) : (
          <></>
        )}
        {creditDatabase && !loading ? (
          <>
            <Grid2 size={12}>
              <Typography fontWeight={"bold"} fontSize={20} p={2}>
                Чанаргүй зээлийн түүх
              </Typography>
            </Grid2>
            <Grid2 size={12}>
              <table
                style={{
                  width: "100%",
                  textAlign: "left",
                  borderCollapse: "collapse",
                  border: "1px solid #ddd",
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: "#f2f2f2" }}>
                    <th
                      style={{
                        padding: "12px",
                        borderBottom: "2px solid #ddd",
                      }}
                    >
                      Төрөл / валют
                    </th>
                    <th
                      style={{
                        padding: "12px",
                        borderBottom: "2px solid #ddd",
                      }}
                    >
                      Анх олгосон дүн
                    </th>
                    <th
                      style={{
                        padding: "12px",
                        borderBottom: "2px solid #ddd",
                      }}
                    >
                      Хүү (%)
                    </th>
                    <th
                      style={{
                        padding: "12px",
                        borderBottom: "2px solid #ddd",
                      }}
                    >
                      Төлөгдөх огноо
                    </th>
                    <th
                      style={{
                        padding: "12px",
                        borderBottom: "2px solid #ddd",
                      }}
                    >
                      Төлсөн огноо
                    </th>
                    <th
                      style={{
                        padding: "12px",
                        borderBottom: "2px solid #ddd",
                      }}
                    >
                      Зээл олгосон байгууллага
                    </th>
                    <th
                      style={{
                        padding: "12px",
                        borderBottom: "2px solid #ddd",
                      }}
                    >
                      Тайлбар
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    style={{
                      backgroundColor: "#f9f9f9",
                      border: "1px solid #ddd",
                    }}
                  >
                    <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                      {creditDatabase.currency}
                    </td>
                    <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                      {creditDatabase.firstLoanAmount.toLocaleString()}
                    </td>
                    <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                      {creditDatabase.interest.toFixed(2)}%
                    </td>
                    <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                      {creditDatabase.payDate
                        ? new Date(creditDatabase.payDate)
                            .toISOString()
                            .split("T")[0]
                        : "N/A"}
                    </td>
                    <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                      {creditDatabase.paidDate
                        ? new Date(creditDatabase.paidDate)
                            .toISOString()
                            .split("T")[0]
                        : "N/A"}
                    </td>
                    <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                      {creditDatabase.loanInstitution}
                    </td>
                    <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                      {creditDatabase.desc}
                    </td>
                  </tr>
                </tbody>
              </table>
            </Grid2>
          </>
        ) : (
          <></>
        )}
        {customerMainInfo && !loading ? (
          <>
            <Grid2 size={12} display={"flex"} justifyContent={"flex-end"} p={2}>
              <Button
                variant="contained"
                sx={{ bgcolor: "#05357E" }}
                onClick={openModal}
              >
                Мэдээлэл шалгах
              </Button>
            </Grid2>
          </>
        ) : (
          <></>
        )}
        <Modal
          open={handleModel}
          onClose={closeModal}
          aria-labelledby="parent-modal-title"
          aria-describedby="parent-modal-description"
        >
          <Grid2 sx={{ ...style, width: 900 }} borderRadius={3}>
            <CheckData cusId={cusId} loanId={loanId} onClose={closeModal} />
          </Grid2>
        </Modal>

        <Snackbar
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
          message="Хур, Дан болон ЗМС-ээс өгөгдөл татаж байна.."
        />
      </Grid2>
    </>
  );
};

export default RegisterLoan;
