"use client";
import React, { useEffect, useState } from "react";
import Header from "../_Components/header";
import AddIcon from "@mui/icons-material/Add";
import Fab from "@mui/material/Fab";
import Image from "next/image";
import Logo from "@/lib/images/Logo.jpeg";

import ButtonGroup from "@mui/material/ButtonGroup";
import DiscoverCommunity from "../_Components/DiscoverCommunity";
import Tabs from "@mui/material/Tabs";
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

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
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

function a11yProps(index: number) {
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
  const [UserCommunities, setUserCommunities] = React.useState([]);
  const [email, setEmail] = React.useState("");

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    const userEmail = localStorage.getItem("Email");
    if (userEmail) {
      setEmail(userEmail);
      ManageUser.getProfileData(userEmail, setProfileData, setUserCommunities);
    }
  }, []);

  // Function to generate consistent color based on category
  const stringToColor = (category: string): string => {
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

  return (
    <>
      <div className="App text-center">
        <Header />
        <center>
          <Box sx={{ width: "100%" }}>
            <Typography variant="h4">Hello, {email}</Typography>
            <Box
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
            </Box>

            <CustomTabPanel value={value} index={0}>
              {profileData.CommunitiesJoined.length === 0 ? (
                <>
                  <div>
                    <div className="mt-9">
                      {/* Add margin-top to create space above the image */}
                      <Image
                        src={Logo} // Replace "/path/to/logo.png" with the path to your logo image
                        alt="Logo"
                        width={500} // Adjust width as needed
                        height={500} // Adjust height as needed
                        className="mx-auto"
                        style={{ marginBottom: "20px" }}
                      />
                    </div>
                    <p className="text-gray-900 text-lg">
                      You are not a member of any communities yet.
                    </p>
                    <p className="text-gray-900 text-lg">
                      Click on{" "}
                      <span className="font-bold">Discover communities</span> to
                      become a member of your very first community.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  {/* <h1>Tshepo</h1> */}

                  <Grid container spacing={2} style={{ padding: 14 }}>
                    {UserCommunities.map((data: any, index: any) => (
                      <Grid item xs={6} md={3} key={index}>
                        <Card
                          sx={{
                            position: "relative",
                            maxWidth: 345,
                            marginBottom: 10,
                            padding: "6px",
                            "&::before": {
                              content: `"${data.category}"`,
                              position: "absolute",
                              top: 0,
                              left: 0,
                              backgroundColor: stringToColor(data.category),
                              color: "#fff",
                              padding: "2px 6px",
                              fontSize: "0.75rem",
                              fontWeight: "bold",
                            },
                          }}
                          onClick={() => {
                            window.open(
                              `http://localhost:3000/Home/community/${data.id}`,
                              //"_self"
                              "_blank"
                            );
                          }}
                        >
                          <CardContent>
                            <Typography
                              gutterBottom
                              variant="h6"
                              component="div"
                            >
                              {data.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {data.description}
                            </Typography>
                          </CardContent>
                          <CardActions>
                            {/* Add more actions as needed */}
                          </CardActions>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </>
              )}
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              <DiscoverCommunity email={email} />
            </CustomTabPanel>
          </Box>
        </center>
      </div>
    </>
  );
}

export default Home;
