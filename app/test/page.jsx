"use client";
import React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";

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
  const data = {
    labels: ["Gender"],
    datasets: [
      {
        label: "Female",
        data: [12], // Hardcoded data for female
        backgroundColor: "aqua",
        borderColor: "black",
        borderWidth: 1,
      },
      {
        label: "Male",
        data: [18], // Hardcoded data for male
        backgroundColor: "red",
        borderColor: "black",
        borderWidth: 1,
      },
    ],
  };

  // Chart configuration
  const options = {
    scales: {
      x: {
        type: "category",
        labels: data.labels,
      },
      y: {
        beginAtZero: true, // Set to true to begin at zero
        min: 0, // Set the minimum value
        max: 20, // Set the maximum value
      },
    },
  };

  return (
    <Box sx={{ flexGrow: 1, padding: 4 }}>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <Bar
              style={{ padding: 20, width: "80%" }}
              data={data}
              options={options}
            ></Bar>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
