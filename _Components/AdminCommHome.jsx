"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Typography,
  Button,
  Chip,
  Grid,
  CircularProgress,
  Snackbar,
  Alert,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Modal,
  Box,
  Divider,
} from "@mui/material";
import CommunityDB from "../database/community/community";
const AdminCommHome = ({ community }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [recommendedCommunities, setRecommendedCommunities] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % 3); // Cycles through the slides
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handlePrev = () => {
    setActiveIndex((prevIndex) => (prevIndex === 0 ? 2 : prevIndex - 1)); // Cycles backwards
  };

  return (
    <>
      {/* <h1 className="text-black font-bold text-4xl text-center mt-6 mb-4 ">
        Recommended Communities
      </h1> */}

      {loading ? (
        <>
          <CircularProgress style={{ color: "#bcd727" }} />
        </>
      ) : (
        <>
          <div
            id="carouselExampleCaptions"
            className="relative w-screen h-[300px] overflow-hidden"
            data-twe-carousel-init
            data-twe-ride="carousel"
          >
            {/* Carousel indicators */}
            <div
              className="absolute bottom-0 left-0 right-0 z-[2] mx-[15%] mb-4 flex list-none justify-center p-0"
              data-twe-carousel-indicators
            >
              {[0].map((index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`mx-[3px] box-content h-[3px] w-[30px] flex-initial cursor-pointer border-0 border-y-[10px] border-solid border-transparent bg-white bg-clip-padding p-0 -indent-[999px] ${
                    activeIndex === index ? "opacity-100" : "opacity-50"
                  } transition-opacity duration-[600ms] ease-[cubic-bezier(0.25,0.1,0.25,1.0)] motion-reduce:transition-none`}
                  aria-label={`Slide ${index + 1}`}
                ></button>
              ))}
            </div>

            {/* Carousel items */}
            <div className="relative w-full overflow-hidden after:clear-both after:block after:content-[''] h-full">
              {/* Third item */}

              <div
                className={`relative float-left w-full h-full transition-transform duration-[600ms] ease-in-out block`}
                style={{ backfaceVisibility: "hidden" }}
              >
                <img
                  src={
                    community && community.communityImage
                      ? community.communityImage
                      : "https://images.unsplash.com/photo-1553073520-80b5ad5ec870?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  }
                  className="block w-full h-full object-cover"
                  alt="Third slide"
                />

                {/* Black overlay */}
                <div className="absolute inset-0 bg-black opacity-40"></div>
                <div className="absolute left-[6%] bottom-5 pt-0 pb-5 text-white z-10">
                  <h1 className="font-bold text-6xl text-left mt-0 mb-1 ">
                    {community && community.name
                      ? community.name
                      : "Default Name"}
                  </h1>
                  <h1 className="text-2xl text-left mt-4 mb-6">
                    {community && community.description
                      ? community.description
                      : "Default description"}
                  </h1>
                  <div className="mt-4 mb-30 flex justify-start"></div>
                </div>
              </div>
            </div>

            {/* Carousel controls */}
          </div>
        </>
      )}
    </>
  );
};

export default AdminCommHome;
