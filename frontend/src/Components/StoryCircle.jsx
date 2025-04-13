import React from "react";
import { Box, Avatar } from "@mui/material";
import RadioIcon from "@mui/icons-material/Radio";

const StoryCircle = () => {
  return (
    <Box
      sx={{
        width: 80,
        height: 80,
        borderRadius: "50%",
        background:
          "conic-gradient(#feda75, #fa7e1e, #d62976, #962fbf, #4f5bd5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: "3px",
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          backgroundColor: "#fff", // White border inside
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Avatar
          sx={{
            width: 68,
            height: 68,
            bgcolor: "#e0e0e0", // placeholder bg
          }}
        >
          <RadioIcon sx={{ fontSize: 32, color: "#000" }} />
        </Avatar>
      </Box>
    </Box>
  );
};

export default StoryCircle;
