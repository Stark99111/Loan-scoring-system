import React, { useEffect, useState } from "react";
import {
  Button,
  Grid2,
  IconButton,
  Typography,
  Box,
  Modal,
  Snackbar,
  Alert,
} from "@mui/material";
import CustomDataGrid from "../../Components/CustomDataGrid";
import GetLoan from "../LoanInfo/api/GetLoan";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RegisterLoanInfo from "../EditLoanTab/RegisterLoanInfo/RegisterLoanInfo";
import GetCategories from "../../api/GetCategories";
import CustomModal from "../../Components/CustomModal";
import DeleteLoanAsk from "../EditLoanTab/DeleteLoanAsk";
import EditLoanInfo from "../EditLoanTab/EditLoanInformation/EditLoanInformation";

const EditLoanInformation = () => {
  const [loanData, setLoanData] = useState([]);
  const [loanModal, setLoanModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [editLoanModal, setEditLoanModal] = useState(false);
  const [selectedLoanData, setSelectedLoanData] = useState();
  const [deleteSnackBar, setDeleteSnackBar] = useState(false);

  const [loanOptions, setLoanOptions] = useState([]);
  const [bankOptions, setBankOptions] = useState([]);

  useEffect(() => {
    GetCategories().then((res) => {
      if (res && res.data.length) {
        const LoanOptions = res.data.filter(
          (item) => item.Description === "Зээлийн төрөл"
        );
        setLoanOptions(LoanOptions);
      }
    });
    GetCategories().then((res) => {
      if (res && res.data.length) {
        const BankOptions = res.data.filter(
          (item) => item.Description === "Банкны төрөл"
        );
        setBankOptions(BankOptions);
      }
    });
  }, []);

  const handleClose = () => {
    setLoanModal(false);
  };

  const openModal = () => {
    setLoanModal(true);
  };

  const approveClose = () => {
    setSnackbarOpen(true);
    setLoanModal(false);
    fetchLoanData();
  };

  useEffect(() => {
    fetchLoanData();
  }, []);

  const fetchLoanData = async () => {
    GetLoan()
      .then((response) => {
        if (response && Array.isArray(response.data)) {
          setLoanData(response.data);
        } else {
          setLoanData([]);
        }
      })
      .catch(() => {
        setLoanData([]);
      });
  };

  const columns = [
    {
      label: "Зээлийн нэр",
      accessor: "name",
      flex: 3,
      headerAlign: "center",
      contentAlign: "left",
      renderCell: (params) => {
        return <div style={{ marginLeft: 12 }}>{params.name}</div>;
      },
    },
    {
      label: "Банкны нэр",
      accessor: "date",
      flex: 2,
      headerAlign: "center",
      contentAlign: "left",
      renderCell: (params) => {
        return params?.bankCategories?.CategoryName || "-";
      },
    },
    {
      label: "Зээлийн төрөл",
      accessor: "day",
      flex: 2,
      headerAlign: "center",
      contentAlign: "left",
      renderCell: (params) => {
        const bank = loanOptions?.find((item) => {
          const match =
            item._id.toString() === params.loanCategories?.toString();
          return match;
        });

        return bank?.CategoryName || "-";
      },
    },
    {
      label: "Төлөв",
      accessor: "status",
      flex: 2,
      headerAlign: "center",
      contentAlign: "center",
      renderCell: (params) => {
        if (params.status != null) {
          return params.status ? "Идэвхтэй" : "Идэвхгүй";
        } else {
          return "-";
        }
      },
    },
    {
      label: "Бүртгэгдсэн огноо",
      accessor: "registeredDate",
      flex: 2,
      headerAlign: "center",
      contentAlign: "center",
      renderCell: (params) => {
        if (params.registeredDate) {
          const date = new Date(params.registeredDate);
          const formattedDate = date.toLocaleDateString("en-GB");
          return formattedDate; // Return the formatted date
        } else {
          return "-";
        }
      },
    },
    {
      label: "Засагдсан огноо",
      accessor: "updatedDate",
      flex: 2,
      headerAlign: "center",
      contentAlign: "center",
      renderCell: (params) => {
        if (params.updatedDate) {
          const date = new Date(params.updatedDate);
          const formattedDate = date.toLocaleDateString("en-GB");
          return formattedDate; // Return the formatted date
        } else {
          return "-";
        }
      },
    },
    {
      label: "",
      accessor: "action1",
      flex: 0.5,
      headerAlign: "center",
      contentAlign: "center",
      renderCell: (params) => {
        return (
          <div>
            <IconButton
              size="small"
              onClick={() => {
                console.log(params);
                setSelectedLoanData(params);
                setEditLoanModal(true);
              }}
            >
              <EditIcon sx={{ color: "#3166cc" }} />
            </IconButton>
          </div>
        );
      },
    },
    {
      label: "",
      accessor: "action2",
      flex: 0.5,
      headerAlign: "center",
      contentAlign: "center",
      renderCell: (params) => {
        return (
          <div>
            <IconButton
              size="small"
              onClick={() => {
                setSelectedLoanData(params);
                setDeleteModal(true);
              }}
            >
              <DeleteIcon sx={{ color: "#3166cc" }} />
            </IconButton>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <Grid2
        container
        bgcolor={"white"}
        borderRadius={4}
        p={3}
        gap={3}
        border={"1px solid #ccd0d9"}
      >
        <Grid2 size={12}>
          <Typography fontWeight={"bold"} fontSize={23} pt={2} pl={3}>
            Зээлийн мэдээлэл засах
          </Typography>
        </Grid2>
        <Grid2 size={1.6}>
          <Button
            sx={{
              fontWeight: "bold",
              color: "white",
              bgcolor: "#3166cc",
              borderRadius: 5,
            }}
            onClick={() => {
              openModal();
            }}
            fullWidth
          >
            <AddIcon sx={{ mr: 1 }} />
            Шинэ зээл бүртгэх
          </Button>
        </Grid2>
        <Grid2 size={12}>
          <CustomDataGrid columns={columns} data={loanData} />
        </Grid2>

        <CustomModal
          open={loanModal}
          onClose={handleClose}
          title="Зээлийн мэдээлэл бүртгэх"
        >
          <Box sx={{ width: 1000, borderRadius: 3 }}>
            <RegisterLoanInfo
              handleClose={approveClose}
              loanOptions={loanOptions}
              bankOptions={bankOptions}
            />
          </Box>
        </CustomModal>
        <CustomModal
          open={deleteModal}
          onClose={() => setDeleteModal(false)}
          title="Зээлийн мэдээлэл устгах"
        >
          <Box sx={{ width: 400, borderRadius: 3 }}>
            <DeleteLoanAsk
              handleClose={() => {
                setDeleteModal(false);
                setDeleteSnackBar(true);
                fetchLoanData();
              }}
              id={selectedLoanData?._id}
            />
          </Box>
        </CustomModal>
        <CustomModal
          open={editLoanModal}
          onClose={() => setEditLoanModal(false)}
          title={"Зээлийн мэдээлэл засах"}
        >
          <Box sx={{ width: 1000, borderRadius: 3 }}>
            <EditLoanInfo
              handleClose={() => {
                setEditLoanModal(false);
                fetchLoanData();
              }}
              bankOptions={bankOptions}
              loanOptions={loanOptions}
              data={selectedLoanData}
            />
          </Box>
        </CustomModal>
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
            Амжилттай хадгалагдлаа.
          </Alert>
        </Snackbar>
        <Snackbar
          open={deleteSnackBar}
          autoHideDuration={3000}
          onClose={() => setDeleteSnackBar(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => setDeleteSnackBar(false)}
            severity="success"
            sx={{ width: "100%" }}
          >
            Амжилттай устгасан.
          </Alert>
        </Snackbar>
      </Grid2>
    </div>
  );
};

export default EditLoanInformation;
