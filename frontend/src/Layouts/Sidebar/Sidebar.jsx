import React, { useEffect, useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ListItemButton from "@mui/material/ListItemButton";
import InfoIcon from "@mui/icons-material/Info";
import BigImage from "../../Assets/bigimage.png";
import Image from "../../Assets/image.png";
import CreateIcon from "@mui/icons-material/Create";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link, useNavigate } from "react-router-dom";
import CalculateIcon from "@mui/icons-material/Calculate";
import PlagiarismIcon from "@mui/icons-material/Plagiarism";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

function Sidebar() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  console.log(user);

  useEffect(() => {
    if (localStorage.getItem("userId")) {
      const token = localStorage.getItem("jwtToken");
      const base64Payload = token.split(".")[1];

      const jsonPayload = decodeURIComponent(
        atob(base64Payload)
          .split("")
          .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
          .join("")
      );
      setUser(JSON.parse(jsonPayload));
      console.log(JSON.parse(jsonPayload));
    } else if (localStorage.getItem("domain")) {
      const token = localStorage.getItem("jwtToken");
      const base64Payload = token.split(".")[1];

      const jsonPayload = decodeURIComponent(
        atob(base64Payload)
          .split("")
          .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
          .join("")
      );
      setAdmin(JSON.parse(jsonPayload));
      console.log(JSON.parse(jsonPayload));
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const logout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    localStorage.removeItem("domain");
    localStorage.removeItem("admin");
    navigate("/");
    console.log("JWT token removed from localStorage");
    window.location.reload();
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: isSidebarOpen ? 260 : 60,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        "& .MuiDrawer-paper": {
          width: isSidebarOpen ? 260 : 60,
          boxSizing: "border-box",
          transition: "width 0.3s ease",
          backgroundColor: "#1a1c1d",
          overflowX: "hidden",
        },
      }}
    >
      {/* Toggle Button */}
      <Box
        sx={{
          paddingTop: 2,
          paddingBottom: 2,
          display: "flex",
          justifyContent: isSidebarOpen ? "flex-end" : "center",
          paddingX: 2,
        }}
      >
        <IconButton onClick={toggleSidebar} sx={{ color: "white" }}>
          <MenuIcon />
        </IconButton>
      </Box>

      {/* Logo */}
      <Box
        sx={{
          paddingBottom: 3,
          display: "flex",
          justifyContent: "center",
          height: isSidebarOpen ? 90 : 60,
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
              cursor: "pointer",
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
        <Box sx={{ width: 280 }} role="presentation">
          <List>
            {user && (
              <ListItem key={"Хэрэглэгчийн мэдээлэл"} disablePadding>
                <ListItemButton component={Link} to="/calculateScoring">
                  <ListItemIcon
                    sx={{
                      color: "white",
                      paddingLeft: isSidebarOpen ? 1 : 0,
                    }}
                  >
                    <AccountCircleIcon fontSize="medium" />
                  </ListItemIcon>
                  <ListItemText
                    sx={{ color: "white" }}
                    primaryTypographyProps={{
                      fontSize: 14,
                      color: "white",
                    }}
                    primary={"Хэрэглэгчийн мэдээлэл"}
                  />
                </ListItemButton>
              </ListItem>
            )}
            <ListItem key={"Зээлийн бүтээгдэхүүний мэдээлэл"} disablePadding>
              <ListItemButton component={Link} to="/loanInformation">
                <ListItemIcon
                  sx={{ color: "white", paddingLeft: isSidebarOpen ? 1 : 0 }}
                >
                  <InfoIcon />
                </ListItemIcon>
                <ListItemText
                  sx={{ color: "white" }}
                  primaryTypographyProps={{
                    fontSize: 14,
                    color: "white",
                  }}
                  primary={"Зээлийн бүтээгдэхүүний мэдээлэл"}
                />
              </ListItemButton>
            </ListItem>
            {admin && (
              <>
                <ListItem key={"Зээлийн мэдээлэл засах"} disablePadding>
                  {/* <ListItemButton component={Link} to="/registerLoan"> */}
                  <ListItemButton component={Link} to="/editLoanInformation">
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
                        fontSize: 14,
                        color: "white",
                      }}
                      primary={"Зээлийн мэдээлэл засах"}
                    />
                  </ListItemButton>
                </ListItem>
                <ListItem key={"Зээлийн хүсэлт"} disablePadding>
                  <ListItemButton component={Link} to="/loanRequests">
                    <ListItemIcon
                      sx={{
                        color: "white",
                        paddingLeft: isSidebarOpen ? 1 : 0,
                      }}
                    >
                      <PlagiarismIcon />
                    </ListItemIcon>
                    <ListItemText
                      sx={{ color: "white" }}
                      primaryTypographyProps={{
                        fontSize: 14,
                        color: "white",
                        width: "80%",
                      }}
                      primary={"Зээлийн хүсэлт"}
                    />
                  </ListItemButton>
                </ListItem>
              </>
            )}
            {user && (
              <>
                <ListItem key={"Тооцоолуур"} disablePadding>
                  <ListItemButton component={Link} to="/loanAmountCalculater">
                    <ListItemIcon
                      sx={{
                        color: "white",
                        paddingLeft: isSidebarOpen ? 1 : 0,
                      }}
                    >
                      <CalculateIcon fontSize="medium" />
                    </ListItemIcon>
                    <ListItemText
                      sx={{ color: "white" }}
                      primaryTypographyProps={{
                        fontSize: 14,
                        color: "white",
                      }}
                      primary={"Тооцоолуур"}
                    />
                  </ListItemButton>
                </ListItem>{" "}
                <ListItem key={"Зээлийн хүсэлт"} disablePadding>
                  <ListItemButton component={Link} to="/loanRequest">
                    <ListItemIcon
                      sx={{
                        color: "white",
                        paddingLeft: isSidebarOpen ? 1 : 0,
                      }}
                    >
                      <ListAltIcon fontSize="medium" />
                    </ListItemIcon>
                    <ListItemText
                      sx={{ color: "white" }}
                      primaryTypographyProps={{
                        fontSize: 14,
                        color: "white",
                      }}
                      primary={"Зээлийн хүсэлт"}
                    />
                  </ListItemButton>
                </ListItem>
              </>
            )}
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
        <Typography color="white" fontSize={16}>
          {isSidebarOpen
            ? user
              ? `${user.idNumber}`
              : `${admin.domain} /Admin/`
            : "-"}
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
                  fontSize: 14,
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
