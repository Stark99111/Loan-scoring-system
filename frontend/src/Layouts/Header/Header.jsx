import React from "react";
import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

function Header({ isSidebarOpen, toggleSidebar }) {
  return (
    <AppBar
      position="fixed"
      sx={{
        width: isSidebarOpen ? `calc(100% - 240px)` : `calc(100% - 60px)`,
        ml: isSidebarOpen ? `240px` : `60px`,
        transition: "width 0.3s",
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="toggle sidebar"
          edge="start"
          onClick={toggleSidebar}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap>
          Dynamic Header
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
