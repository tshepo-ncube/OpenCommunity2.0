"use client";
import React, { useState } from "react";
import Header from "../_Components/header";
import AddIcon from "@mui/icons-material/Add";
import Fab from "@mui/material/Fab";
import Image from "next/image";
import Logo from "@/lib/images/Logo.jpeg";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import DiscoverCommunity from "../_Components/DiscoverCommunity";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { styled } from "@mui/system";

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

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <div className="App text-center">
        <Header />

        <center>
          <Box sx={{ width: "100%" }}>
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
                  become a member of your very first community
                </p>
              </div>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              <DiscoverCommunity />
            </CustomTabPanel>
          </Box>
        </center>
      </div>
    </>
  );
}

export default Home;
