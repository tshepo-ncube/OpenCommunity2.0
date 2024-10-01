"use client";
import React, { useState } from "react";
import Sidebar from "./sidebar";
import AddIcon from "@mui/icons-material/Add";
import Fab from "@mui/material/Fab";
import Image from "next/image";
import Logo from "@/lib/images/Logo1.png";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Switch from "@mui/material/Switch"; // Added Switch for the toggle button
import ManageUser from "@/database/auth/ManageUser";
import { useRouter } from "next/navigation";
import { styled } from "@mui/system";

const drawerWidth = 240;

// Separate arrays for user view and admin view
const userNavItems = [
  "Home",
  "Recommend a community",
  "Leaderboard",
  "Teams",
  "Outlook",
  "Logout",
];

const adminNavItems = [
  "Admin View",
  "View Recommendations",
  "Teams",
  "Outlook",
  "Logout",
];

// Override AppBar styles to set background color to green
const CustomAppBar = styled(AppBar)({
  backgroundColor: "white", // Your desired green color
});

// Create a styled MenuIcon with the desired color, hover effect, and larger size
const CustomMenuIcon = styled(MenuIcon)(({ theme }) => ({
  color: "#bcd727",
  fontSize: 40, // Adjust this value to make the icon larger
  transition: "color 0.3s", // Smooth transition for color change
  "&:hover": {
    color: "#a2b438", // Muted color of #bcd727
  },
}));

// Create a styled AccountCircle with the desired color and hover effect
const CustomAccountCircle = styled(AccountCircle)(({ theme }) => ({
  color: "grey",
  fontSize: 50, // Adjust this value to make the icon larger
  transition: "color 0.3s", // Smooth transition for color change
  "&:hover": {
    color: "grey", // Muted color of #bcd727
  },
}));

// Styles for the logout button to fix it at the bottom and make it red
const LogoutButton = styled(ListItemButton)({
  position: "absolute",
  bottom: 0,
  width: "100%",
  color: "red",
  textAlign: "center",
  borderTop: "1px solid #e0e0e0", // Add a divider line above logout
});

function Header() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // Toggle state for User/Admin label

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleListItemClick = (item) => {
    if (item === "Profile") {
      router.push("/auth/Profile");
    } else if (item === "Logout") {
      ManageUser.logoutUser(setLoggedIn, router);
    } else if (item === "Outlook") {
      window.location.href = "mailto:";
    } else if (item === "Teams") {
      window.location.href = "msteams://";
    } else if (item === "Admin View") {
      router.push("/admin");
    } else if (item === "Leaderboard") {
      router.push("/auth/Leaderboard");
    } else if (item === "Home") {
      router.push("/Home");
    } else if (item === "Recommend a community") {
      router.push("/auth/RecommendCommunity");
    } else if (item === "View Recommendations") {
      router.push("/admin/RecommendedCommunities");
    }
  };

  const handleToggleChange = () => {
    setIsAdmin((prev) => {
      const newState = !prev;

      // If switching to Admin view, load the admin page first
      if (newState) {
        router.push("/admin");
      }
      // If switching to User view, load the home page first
      else {
        router.push("/Home");
      }

      return newState; // Toggle between User and Admin
    });
  };

  // Determine which navItems to display based on isAdmin state
  const navItems = isAdmin ? adminNavItems : userNavItems;

  const drawer = (
    <Box sx={{ textAlign: "center", height: "100%", position: "relative" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        <Image src={Logo} alt="Logo" width={300} height={100} />
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem
            key={item}
            disablePadding
            onClick={() => handleListItemClick(item)}
          >
            <ListItemButton sx={{ textAlign: "center" }}>
              <ListItemText primary={item} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      {/* Logout Button styled to be at the bottom and red */}
      <LogoutButton onClick={() => handleListItemClick("Logout")}>
        <ListItemText primary="Logout" />
      </LogoutButton>
    </Box>
  );

  return (
    <div>
      <CustomAppBar position="static" style={{ marginBottom: 30 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <CustomMenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
            <Image src={Logo} alt="Logo" width={250} height={80} />
          </Box>
          {/* Added Toggle Switch and Label */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <Switch
              checked={isAdmin}
              onChange={handleToggleChange}
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": {
                  color: "#bcd727",
                },
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                  backgroundColor: "#bcd727",
                },
              }}
            />

            <Typography sx={{ color: "black", mt: 1 }}>
              {isAdmin ? "Admin View" : "User View"}
            </Typography>
          </Box>

          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            color="inherit"
            onClick={() => router.push("/Profile")}
          >
            <CustomAccountCircle />
          </IconButton>
        </Toolbar>
      </CustomAppBar>
      <nav>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: "20%",
              backgroundColor: "#ffffff", // Match the AppBar background color
              position: "relative", // Make sure the sidebar is positioned relatively
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </div>
  );
}

Header.propTypes = {
  title: PropTypes.string,
  window: PropTypes.func,
};

export default Header;
