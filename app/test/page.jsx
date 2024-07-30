"use client";
import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { Button, IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Skeleton from "@mui/material/Skeleton";

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function CandidateGenderGraph() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ flexGrow: 1, padding: 4 }}>
      <div className="w-full max-w-sm bg-white border border-gray_og rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 relative">
        <a href="#">
          <img
            className="h-40 w-full rounded-t-lg object-cover"
            src="https://images.unsplash.com/photo-1607656311408-1e4cfe2bd9fc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGRyaW5rc3xlbnwwfHwwfHx8MA%3D%3D"
            alt="product image"
          />
        </a>
        <IconButton
          aria-label="more"
          aria-controls="long-menu"
          aria-haspopup="true"
          onClick={handleClick}
          style={{ position: "absolute", top: 10, right: 10 }}
        >
          <MoreVertIcon className="text-white font-bold" />
        </IconButton>
        <Menu
          id="long-menu"
          anchorEl={anchorEl}
          keepMounted
          open={open}
          onClose={handleClose}
          PaperProps={{
            style: {
              maxHeight: 48 * 4.5,
              width: "20ch",
            },
          }}
        >
          <MenuItem onClick={handleClose}>Edit</MenuItem>
          <MenuItem onClick={handleClose}>View</MenuItem>
          <MenuItem onClick={handleClose}>Archive</MenuItem>
          <MenuItem onClick={handleClose} color="error">
            Delete
          </MenuItem>
        </Menu>

        <div
          style={{ position: "absolute", top: 12, left: 10 }}
          className="absolute bg-orange-500 text-white px-2 py-1 rounded-md text-xs font-bold z-10"
        >
          Archived
        </div>
        <div className="mt-4 px-5 pb-5">
          <a href="#">
            <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
              The Beer Guys
            </h5>
          </a>
          <div className="flex items-center mt-2.5 mb-5">
            <div className="flex items-center space-x-1 rtl:space-x-reverse"></div>
            <div className="text-sm text-black py-1  font-semibold">
              The descripton bla blah blah. Drinks of Fridays, after work. Don't
              touch the beer fridge during the week!
            </div>
          </div>
          <div className="flex items-center justify-between">
            {/* <>
              <Button size="small" onClick={() => {}}>
                Edit
              </Button>
              <Button
                size="small"
                onClick={() => {
                  // localStorage.setItem(
                  //   "CurrentCommunity",
                  //   data.id
                  // );
                }}
              >
                View
              </Button>
              <Button size="small" color="error" onClick={() => {}}>
                Archive
              </Button>
              <Button size="small" color="error" onClick={() => {}}>
                Delete
              </Button>
            </> */}
          </div>
        </div>
      </div>
    </Box>
  );
}
