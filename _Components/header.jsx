"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Logo from "@/lib/images/Logo1.png";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
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
import AccountCircle from "@mui/icons-material/AccountCircle";
import Switch from "@mui/material/Switch";
import ManageUser from "@/database/auth/ManageUser";
import { useRouter } from "next/navigation";
import { styled } from "@mui/system";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const drawerWidth = 240;

// Styled components
const CustomAppBar = styled(AppBar)({
  backgroundColor: "white",
});

const CustomMenuIcon = styled(MenuIcon)(({ theme }) => ({
  color: "#bcd727",
  fontSize: 40,
  transition: "color 0.3s",
  "&:hover": {
    color: "#a2b438",
  },
}));

const CustomAccountCircle = styled(AccountCircle)(({ theme }) => ({
  color: "grey",
  fontSize: 50,
  transition: "color 0.3s",
  "&:hover": {
    color: "grey",
  },
}));

const LogoutButton = styled(ListItemButton)({
  position: "absolute",
  bottom: 0,
  width: "100%",
  color: "red",
  textAlign: "center",
  borderTop: "1px solid #e0e0e0",
});

// Navigation items
const userNavItems = [
  "Home",
  "Recommend a community",
  "Leaderboard",
  "Teams",
  "Outlook",
];

const adminNavItems = ["Home", "View Recommendations", "Teams", "Outlook"];

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminToggle, setShowAdminToggle] = useState(false);

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
      localStorage.setItem("isAdminView", JSON.stringify(newState));
      if (newState) {
        router.push("/admin");
      } else {
        router.push("/Home");
      }
      return newState;
    });
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        ManageUser.getProfileData(
          user.email,
          () => {},
          () => {},
          (isAdminUser) => {
            setShowAdminToggle(isAdminUser);
            if (isAdminUser) {
              // Only load the saved admin view state if the user is actually an admin
              const savedAdminView = localStorage.getItem("isAdminView");
              setIsAdmin(savedAdminView ? JSON.parse(savedAdminView) : false);
            } else {
              setIsAdmin(false);
            }
          }
        );
      } else {
        setShowAdminToggle(false);
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, []);

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
          {showAdminToggle && (
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
          )}
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
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              backgroundColor: "#ffffff",
              position: "relative",
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
