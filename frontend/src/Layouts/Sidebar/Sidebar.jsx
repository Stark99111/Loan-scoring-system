import React, { useState } from "react";
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
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import { Link, useNavigate } from "react-router-dom";
import CalculateIcon from "@mui/icons-material/Calculate";
import PolicyIcon from "@mui/icons-material/Policy";
import ArticleIcon from "@mui/icons-material/Article";
import PlagiarismIcon from "@mui/icons-material/Plagiarism";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import CreditScoreIcon from "@mui/icons-material/CreditScore";

function Sidebar() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const user = localStorage.getItem("user");

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const logout = () => {
    localStorage.removeItem("jwtToken");
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
        <Box paddingLeft={3}>
          <Typography color="white" fontSize={22}>
            {isSidebarOpen ? "Зээл" : "-"}
          </Typography>
        </Box>
        <Box sx={{ width: 280 }} role="presentation">
          <List>
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
            {/* <ListItem key={"Зээл бүртгэх"} disablePadding>
              <ListItemButton component={Link} to="/createLoan">
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
                    fontSize: 14,
                    color: "white",
                  }}
                  primary={"Зээл бүртгэх"}
                />
              </ListItemButton>
            </ListItem> */}
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
            </ListItem>
            {/* <ListItem key={"Зээлийн эрсдэл"} disablePadding>
              <ListItemButton component={Link} to="/editRequirement">
                <ListItemIcon
                  sx={{
                    color: "white",
                    paddingLeft: isSidebarOpen ? 1 : 0,
                  }}
                >
                  <PolicyIcon fontSize="medium" />
                </ListItemIcon>
                <ListItemText
                  sx={{ color: "white" }}
                  primaryTypographyProps={{
                    fontSize: 14,
                    color: "white",
                  }}
                  primary={"Зээлийн эрсдэл"}
                />
              </ListItemButton>
            </ListItem> */}
          </List>
        </Box>
        <Box paddingLeft={3}>
          <Typography color="white" fontSize={22}>
            {isSidebarOpen ? "Скоринг" : "-"}
          </Typography>
        </Box>
        <Box sx={{ width: 280 }} role="presentation">
          <List>
            <ListItem key={"Тооцоолуур"} disablePadding>
              <ListItemButton component={Link} to="/calculateScoring">
                <ListItemIcon
                  sx={{ color: "white", paddingLeft: isSidebarOpen ? 1 : 0 }}
                >
                  <CreditScoreIcon />
                </ListItemIcon>
                <ListItemText
                  sx={{ color: "white" }}
                  primaryTypographyProps={{
                    fontSize: 14,
                    color: "white",
                  }}
                  primary={"Зэрэглэл"}
                />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
        <Box paddingLeft={3}>
          <Typography color="white" fontSize={22}>
            {isSidebarOpen ? "Тайлан" : "-"}
          </Typography>
        </Box>
        <Box sx={{ width: 280 }} role="presentation">
          <List>
            {/* zeeliin juram */}
            <ListItem key={"Зээлийн журам"} disablePadding>
              <ListItemButton component={Link} to="/loanProcedure">
                <ListItemIcon
                  sx={{ color: "white", paddingLeft: isSidebarOpen ? 1 : 0 }}
                >
                  <ContentPasteIcon />
                </ListItemIcon>
                <ListItemText
                  sx={{ color: "white" }}
                  primaryTypographyProps={{
                    fontSize: 14,
                    color: "white",
                  }}
                  primary={"Зээлийн журам"}
                />
              </ListItemButton>
            </ListItem>
            {/* zeeliin ereltiin tailan */}
            <ListItem key={"Зээлийн эрэлтийн тайлан"} disablePadding>
              <ListItemButton component={Link} to="/loanProcedure">
                <ListItemIcon
                  sx={{ color: "white", paddingLeft: isSidebarOpen ? 1 : 0 }}
                >
                  <PlagiarismIcon />
                </ListItemIcon>
                <ListItemText
                  sx={{ color: "white" }}
                  primaryTypographyProps={{
                    fontSize: 14,
                    color: "white",
                  }}
                  primary={"Зээлийн эрэлтийн тайлан"}
                />
              </ListItemButton>
            </ListItem>
            {/* jurmiin biyleltiin tailan */}
            <ListItem key={"Журмын биелэлтийн тайлан"} disablePadding>
              <ListItemButton component={Link} to="/procedureReport">
                <ListItemIcon
                  sx={{ color: "white", paddingLeft: isSidebarOpen ? 1 : 0 }}
                >
                  <ArticleIcon />
                </ListItemIcon>
                <ListItemText
                  sx={{ color: "white", width: "75%" }}
                  primaryTypographyProps={{
                    fontSize: 14,
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
        <Typography color="white" fontSize={16}>
          {isSidebarOpen ? user : "-"}
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
