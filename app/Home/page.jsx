"use client";
import React, { useEffect, useState } from "react";
// import Header from "../_Components/header";
import Header from "../../_Components/header";
import AddIcon from "@mui/icons-material/Add";
import Fab from "@mui/material/Fab";
import Image from "next/image";
import Logo from "@/lib/images/Logo.jpeg";
import ButtonGroup from "@mui/material/ButtonGroup";
import DiscoverCommunity from "../../_Components/DiscoverCommunity";
import MyCommunities from "../../_Components/MyCommunities";
import Tabs from "@mui/material/Tabs";
import UserDB from "../../database/community/users";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { styled } from "@mui/system";
import ManageUser from "@/database/auth/ManageUser";
import {
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import CommunityDB from "@/database/community/community";

// Custom styles
const CustomTab = styled(Tab)({
  borderBottom: "none", // Ensure the underline is initially transparent
  "&.Mui-selected": {
    color: "#bcd727", // Your desired green color
    borderBottom: "2px #bcd727", // Underline color
  },
  "&:focus": {
    outline: "none !important", // Remove default focus outline
  },
});

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function Home() {
  const [value, setValue] = React.useState(0);
  const [profileData, setProfileData] = React.useState({
    CommunitiesJoined: [],
  });

  const [activeTab, setActiveTab] = useState("My Communities");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    console.log(tab);
  };
  const [UserCommunities, setUserCommunities] = React.useState([]);
  const [email, setEmail] = React.useState("");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userEmail = localStorage.getItem("Email");
      if (userEmail) {
        setEmail(userEmail);
        ManageUser.getProfileData(
          userEmail,
          setProfileData,
          setUserCommunities
        );
      }
    }
  }, []);

  // Function to generate consistent color based on category
  const stringToColor = (category) => {
    switch (category.toLowerCase()) {
      case "general":
        return "#2196f3"; // Blue
      case "social":
        return "#ff9800"; // Orange
      case "retreat":
        return "#f44336"; // Red
      case "sports":
        return "#4caf50"; // Green
      case "development":
        return "#9c27b0"; // Purple
      default:
        // Generate a color based on hash if category not specified
        let hash = 0;
        for (let i = 0; i < category.length; i++) {
          hash = category.charCodeAt(i) + ((hash << 5) - hash);
        }
        const color = `hsl(${Math.abs(hash) % 360}, 70%, 80%)`; // Fallback to HSL color
        return color;
    }
  };

  useEffect(() => {
    //Adding points
    console.log("Adding Points...");
    console.log(
      "------------------------------------------------------------------------------------"
    );

    ManageUser.addUserToGlobalIfNotThere("m.be@outlook.com");
  }, []);

  return (
    <>
      <div className="App text-center ">
        <Header />
        <center className="mt-8">
          <Box sx={{ width: "100%", marginTop: 4 }}>
            <div className="flex justify-center mt-6">
              <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
                <ul className="flex flex-wrap -mb-px">
                  <li className="me-2">
                    <a
                      href="#"
                      onClick={() => handleTabClick("My Communities")}
                      className={`inline-block p-4 border-b-2 rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 ${
                        activeTab === "My Communities"
                          ? "text-openbox-green border-openbox-green dark:text-openbox-green dark:border-openbox-green"
                          : "border-transparent"
                      }`}
                    >
                      My Communities
                    </a>
                  </li>
                  <li className="me-2">
                    <a
                      href="#"
                      onClick={() => handleTabClick("Discover Communities")}
                      className={`inline-block p-4 border-b-2 rounded-t-lg ${
                        activeTab === "Discover Communities"
                          ? "text-openbox-green border-openbox-green dark:text-openbox-green dark:border-openbox-green"
                          : "hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 border-transparent"
                      }`}
                    >
                      Discover Communities
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* <Box
              sx={{
                borderBottom: "5px solid white", // Set the border color to green
                borderColor: "white",
                width: "100%",
                height: "12vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
                pt: 2,
              }}
            >
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <CustomTab label="My Communities" {...a11yProps(0)} />
                <CustomTab label="Discover Communities" {...a11yProps(1)} />
              </Tabs>
            </Box> */}

            {/* <CustomTabPanel value={value} index={0}>
              <MyCommunities email={email} />
            </CustomTabPanel>

            <CustomTabPanel value={value} index={1}>
              <DiscoverCommunity email={email} />
            </CustomTabPanel> */}

            {activeTab === "My Communities" ? (
              <>
                <MyCommunities email={email} />
              </>
            ) : (
              <>
                <DiscoverCommunity email={email} />
              </>
            )}
          </Box>
        </center>
      </div>
    </>
  );
}

export default Home;
