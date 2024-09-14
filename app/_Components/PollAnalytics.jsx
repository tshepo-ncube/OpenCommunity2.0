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

// Generate random colors for each dataset
const generateRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export default function PollAnalytics({ poll }) {
  console.log("This is poll from analytics ", poll);

  // Extracting labels and data from poll object
  const labels = poll.Options;
  const dataValues = poll.Opt.map((opt) => opt.votes);

  // Generate colors for each bar
  const backgroundColors = labels.map(() => generateRandomColor());

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Votes",
        data: dataValues,
        backgroundColor: backgroundColors,
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
        max: Math.max(...dataValues) + 5, // Adjust the max value based on the data
      },
    },
  };

  return (
    <Box sx={{ flexGrow: 1, padding: 4 }}>
      <h1 className="text-3xl text-black">{poll.Question}</h1>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Bar
              style={{ padding: 20, width: "80%" }}
              data={data}
              options={options}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
