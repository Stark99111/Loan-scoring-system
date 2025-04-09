import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
} from "@mui/material";
import ListItemButton from "@mui/material/ListItemButton";
import InfoIcon from "@mui/icons-material/Info";
import BigImage from "../../Assets/bigimage.png";
import Image from "../../Assets/image.png";
import CreateIcon from "@mui/icons-material/Create";
import LogoutIcon from "@mui/icons-material/Logout";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import TouchAppIcon from "@mui/icons-material/TouchApp";
import SettingsIcon from "@mui/icons-material/Settings";
import { Link } from "react-router-dom";

function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const roleId = localStorage.getItem("role");
  const user = JSON.parse(localStorage.getItem("user"));
  console.log(user);

  const handleMouseEnter = () => {
    setIsSidebarOpen(true);
  };

  const handleMouseLeave = () => {
    setIsSidebarOpen(false);
  };

  const logout = () => {
    localStorage.removeItem("jwtToken"); // Remove the token from localStorage
    console.log("JWT token removed from localStorage");
    window.location.reload(); // Optional: Reload or redirect the user
  };

  return (
    <Drawer
      variant="permanent"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={{
        width: isSidebarOpen ? 240 : 60,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        "& .MuiDrawer-paper": {
          width: isSidebarOpen ? 240 : 60,
          boxSizing: "border-box",
          transition: "width 0.3s ease",
          backgroundColor: "#1a1c1d",
          overflowX: "hidden",
        },
      }}
    >
      <Box
        sx={{
          paddingTop: 3,
          paddingBottom: 3,
          display: "flex",
          justifyContent: "center",
          height: isSidebarOpen ? 110 : 80,
          overflow: "hidden",
        }}
      >
        <Link to="/" style={{ textDecoration: "none" }}>
          <img
            src={isSidebarOpen ? BigImage : Image}
            alt="Sidebar Logo"
            style={{
              width: "auto",
              height: "100%",
              objectFit: "contain",
              cursor: "pointer", // Add pointer cursor for better UX
            }}
          />
        </Link>
      </Box>
      {isSidebarOpen ? (
        <></>
      ) : (
        <>
          <Box sx={{ height: 30 }}></Box>
        </>
      )}
      <Box sx={{ flexGrow: 1 }}>
        <Box paddingLeft={3}>
          <Typography color="white" fontSize={24} fontFamily={"Cambria"}>
            {isSidebarOpen ? "Зээл" : "-"}
          </Typography>
        </Box>
        <Box sx={{ width: 250 }} role="presentation">
          <List>
            <ListItem key={"Зээлийн мэдээлэл"} disablePadding>
              <ListItemButton component={Link} to="/loanInformation">
                <ListItemIcon
                  sx={{ color: "white", paddingLeft: isSidebarOpen ? 1 : 0 }}
                >
                  <InfoIcon />
                </ListItemIcon>
                <ListItemText
                  sx={{ color: "white" }}
                  primaryTypographyProps={{
                    fontSize: 16,
                    fontFamily: "Cambria",
                    color: "white",
                  }}
                  primary={"Зээлийн мэдээлэл"}
                />
              </ListItemButton>
            </ListItem>
            {roleId !== "3" ? (
              <>
                <ListItem key={"Зээл бүртгэх"} disablePadding>
                  <ListItemButton component={Link} to="/createLoan">
                    <ListItemIcon
                      sx={{
                        color: "white",
                        paddingLeft: isSidebarOpen ? 1 : 0,
                      }}
                    >
                      <CreateIcon />
                    </ListItemIcon>
                    <ListItemText
                      sx={{ color: "white" }}
                      primaryTypographyProps={{
                        fontSize: 16,
                        fontFamily: "Cambria",
                        color: "white",
                      }}
                      primary={"Зээл бүртгэх"}
                    />
                  </ListItemButton>
                </ListItem>
              </>
            ) : (
              <></>
            )}

            {roleId === "3" ? (
              <>
                <ListItem key={"Зээлийн мэдээлэл бүртгэх"} disablePadding>
                  <ListItemButton component={Link} to="/registerLoan">
                    <ListItemIcon
                      sx={{
                        color: "white",
                        paddingLeft: isSidebarOpen ? 1 : 0,
                      }}
                    >
                      <LibraryAddIcon />
                    </ListItemIcon>
                    <ListItemText
                      sx={{ color: "white" }}
                      primaryTypographyProps={{
                        fontSize: 16,
                        fontFamily: "Cambria",
                        color: "white",
                      }}
                      primary={"Зээлийн мэдээлэл бүртгэх"}
                    />
                  </ListItemButton>
                </ListItem>
                <ListItem key={"Зээлийн төлөв"} disablePadding>
                  <ListItemButton component={Link} to="/changeStatus">
                    <ListItemIcon
                      sx={{
                        color: "white",
                        paddingLeft: isSidebarOpen ? 1 : 0,
                      }}
                    >
                      <TouchAppIcon fontSize="medium" />
                    </ListItemIcon>
                    <ListItemText
                      sx={{ color: "white" }}
                      primaryTypographyProps={{
                        fontSize: 16,
                        fontFamily: "Cambria",
                        color: "white",
                      }}
                      primary={"Зээлийн төлөв"}
                    />
                  </ListItemButton>
                </ListItem>
                <ListItem key={"Зээлийн шаардлага"} disablePadding>
                  <ListItemButton component={Link} to="/editRequirement">
                    <ListItemIcon
                      sx={{
                        color: "white",
                        paddingLeft: isSidebarOpen ? 1 : 0,
                      }}
                    >
                      <SettingsIcon fontSize="medium" />
                    </ListItemIcon>
                    <ListItemText
                      sx={{ color: "white" }}
                      primaryTypographyProps={{
                        fontSize: 16,
                        fontFamily: "Cambria",
                        color: "white",
                      }}
                      primary={"Зээлийн шаардлага"}
                    />
                  </ListItemButton>
                </ListItem>
              </>
            ) : (
              <></>
            )}
          </List>
        </Box>
        <Box paddingLeft={3}>
          <Typography color="white" fontSize={24} fontFamily={"Cambria"}>
            {isSidebarOpen ? "Тайлан" : "-"}
          </Typography>
        </Box>
        <Box sx={{ width: 250 }} role="presentation">
          <List>
            <ListItem key={"Зээлийн журам"} disablePadding>
              <ListItemButton component={Link} to="/loanProcedure">
                <ListItemIcon
                  sx={{ color: "white", paddingLeft: isSidebarOpen ? 1 : 0 }}
                >
                  <InfoIcon />
                </ListItemIcon>
                <ListItemText
                  sx={{ color: "white" }}
                  primaryTypographyProps={{
                    fontSize: 16,
                    fontFamily: "Cambria",
                    color: "white",
                  }}
                  primary={"Зээлийн журам"}
                />
              </ListItemButton>
            </ListItem>
            <ListItem key={"Журмын биелэлтийн тайлан"} disablePadding>
              <ListItemButton component={Link} to="/procedureReport">
                <ListItemIcon
                  sx={{ color: "white", paddingLeft: isSidebarOpen ? 1 : 0 }}
                >
                  <CreateIcon />
                </ListItemIcon>
                <ListItemText
                  sx={{ color: "white" }}
                  primaryTypographyProps={{
                    fontSize: 16,
                    fontFamily: "Cambria",
                    color: "white",
                  }}
                  primary={"Журмын биелэлтийн тайлан"}
                />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Box>
      <Box
        borderTop={"1px solid white"}
        borderBottom={"1px solid white"}
        display={"flex"}
        justifyContent={"center"}
        padding={2}
        sx={{
          transition: "opacity 0.3s linear",
          opacity: isSidebarOpen ? 1 : 0,
        }}
      >
        <Typography color="white" fontSize={18} fontFamily={"Cambria"}>
          {isSidebarOpen ? user?.firstname + " - " + user?.domain : "-"}
        </Typography>
      </Box>
      <Box>
        <List>
          <ListItem disablePadding>
            <ListItemButton onDoubleClick={logout}>
              <ListItemIcon
                sx={{ color: "white", paddingLeft: isSidebarOpen ? 1 : 0 }}
              >
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText
                sx={{ color: "white" }}
                primaryTypographyProps={{
                  fontSize: 16,
                  fontFamily: "Cambria",
                  color: "white",
                }}
                primary="Log out"
                onDoubleClick={logout}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
}

export default Sidebar;
