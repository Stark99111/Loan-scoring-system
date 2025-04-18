import React from "react";
import { Modal, Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const modalContainerStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "#dddfe3",
  boxShadow: 24,
  p: 4,
  borderRadius: 3,
  minWidth: 400,
  maxHeight: "90vh", // limit height
  overflow: "auto", // allow scroll if content is large
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  mb: 2,
};

const CustomModal = ({ open, onClose, title, children }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalContainerStyle}>
        <Box sx={headerStyle}>
          <Typography sx={{ fontSize: 23, fontWeight: "bold" }}>
            {title}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        {children}
      </Box>
    </Modal>
  );
};

export default CustomModal;
