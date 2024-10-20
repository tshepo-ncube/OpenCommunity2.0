"use client";
import React, { useEffect, useState } from "react";
import { RiAiGenerate } from "react-icons/ri";
import { MdRecommend } from "react-icons/md";
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
import { FaFire } from "react-icons/fa"; // Import the fire icon from react-icons
import ExitToApp from "@mui/icons-material/ExitToApp";
import Image from "next/image";
import FireSvg from "@/lib/images/trace.svg";
import {
  CheckCircle,
  People,
  CalendarToday, // Calendar Icon
  ArrowBack,
  ArrowForward,
  Search,
} from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import { FaFireAlt } from "react-icons/fa";
import CommunityDB from "../database/community/community";
import { useRouter } from "next/navigation";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Lens } from "../components/ui/lens";

const DiscoverCommunity = ({ email }) => {
  const interests = [
    { interest: "Running", category: "Sports" },
    { interest: "Yoga", category: "Sports" },
    { interest: "Team Sports", category: "Sports" },
    { interest: "Strength Training", category: "Sports" },
    { interest: "Outdoor Adventure", category: "Sports" },

    { interest: "Movies and TV", category: "General" },
    { interest: "Reading", category: "General" },
    { interest: "Music", category: "General" },
    { interest: "Cooking", category: "General" },
    { interest: "Board Games", category: "General" },

    { interest: "Team-Building Activities", category: "Social" },
    { interest: "Workshops", category: "Social" },
    { interest: "Outdoor Activities", category: "Social" },
    { interest: "Cultural Experiences", category: "Social" },
    { interest: "Relaxation Sessions", category: "Social" },

    { interest: "Networking", category: "Development" },
    {
      interest: "Workshops and Seminars",
      category: "Development",
    },
    { interest: "Public Speaking", category: "Development" },
    { interest: "Leadership Training", category: "Development" },
    { interest: "Mentorship", category: "Development" },
  ];

  const [hovering, setHovering] = useState(false);

  const [loading, setLoading] = useState(true);
  const [submittedData, setSubmittedData] = useState([]);
  // const [searchQuery, setSearchQuery] = useState < string > "";

  // const [selectedCategory, setSelectedCategory] =
  //   useState < string > "All Communities";
  // const [selectedStatus, setSelectedStatus] = useState < string > "active";
  // const [openSnackbar, setOpenSnackbar] = useState(false);
  // const [snackbarMessage, setSnackbarMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Communities");
  const [selectedStatus, setSelectedStatus] = useState("active");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const router = useRouter();

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        await CommunityDB.getAllCommunities(setSubmittedData, setLoading);
      } catch (error) {
        console.error("Error fetching communities:", error);
      }
    };

    fetchCommunities();
  }, []);

  useEffect(() => {
    console.log("Submitted Data : ", submittedData);
  }, [submittedData]);

  const handleViewCommunity = (data) => {
    // Redirect to the specified path format with community ID
    router.push(`/Home/community/${data.id}`);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };
  const handleLeaveCommunity = async (data) => {
    const result = await CommunityDB.leaveCommunity(data.id, email);
    if (result.success) {
      const updatedData = submittedData.map((community) => {
        if (community.id === data.id) {
          return {
            ...community,
            users: community.users.filter((user) => user !== email),
          };
        }
        return community;
      });
      setSubmittedData(updatedData);

      setSnackbarMessage(`You have left the "${data.name}" community.`);
      setOpenSnackbar(true);
    } else {
      alert(result.message);
    }
  };
  const filterDataByCategoryAndStatus = (data) => {
    return data
      .filter((item) => Array.isArray(item.users) && item.users.includes(email))
      .filter((item) => {
        const categoryMatch =
          selectedCategory.toLowerCase() === "all communities" ||
          item.category.toLowerCase().includes(selectedCategory.toLowerCase());

        const statusMatch =
          selectedStatus.toLowerCase() === "all communities" ||
          item.status === selectedStatus;

        const searchQueryMatch =
          `${item.name.toLowerCase()} ${item.description.toLowerCase()} ${item.category.toLowerCase()}`.includes(
            searchQuery.toLowerCase()
          );

        return categoryMatch && statusMatch && searchQueryMatch;
      });
  };

  const filteredData = filterDataByCategoryAndStatus(submittedData);

  // Function to capitalize the first letter of a category
  const capitalizeFirstLetter = (category) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  const uniqueCategories = Array.from(
    new Set(submittedData.map((data) => capitalizeFirstLetter(data.category)))
  );
  uniqueCategories.unshift("All Communities");

  // Function to generate consistent color based on category
  const stringToColor = (category) => {
    switch (category.toLowerCase()) {
      case "general":
        return "#a3c2e7"; // Pastel Blue
      case "socia":
        return "#f7b7a3"; // Pastel Orange
      case "retreat":
        return "#f7a4a4"; // Pastel Red
      case "sports":
        return "#a3d9a5"; // Pastel Green
      case "development":
        return "#d4a1d1"; // Pastel Purple
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

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const selectCategory = (category) => {
    setSelectedCategory(category);
    setDropdownOpen(false); // Close the dropdown after selecting a category
  };

  const getInterestsByCategory = (category) => {
    return interests
      .filter((item) => item.category.toLowerCase() === category.toLowerCase())
      .map((item) => item.interest);
  };

  return (
    <>
      <div className="flex justify-center mt-4 mb-2">
        <form className="max-w-lg mx-auto w-full z-10">
          <div className="flex relative">
            <label
              htmlFor="search-dropdown"
              className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
            >
              Search
            </label>

            <div className="relative w-full">
              <button
                type="submit"
                className="absolute top-0 start-0 mr-44 p-2.5 text-sm font-medium h-full text-white bg-openbox-green rounded-s-lg border border-openbox-green hover:bg-openbox-green focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                <svg
                  className="w-4 h-4"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
                <span className="sr-only">Search</span>
              </button>
              <input
                placeholder="Search my communities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                type="search"
                id="search-dropdown"
                className="ml-8 block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-s-lg border-s-gray-50 border-s-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-s-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
                required
              />
            </div>

            <label
              htmlFor="search-dropdown"
              className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
            >
              Category
            </label>

            <button
              id="dropdown-button"
              onClick={toggleDropdown}
              type="button"
              className="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-e-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600"
            >
              {selectedCategory}
              <svg
                className="w-2.5 h-2.5 ms-2.5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 4 4 4-4"
                />
              </svg>
            </button>
            {dropdownOpen && (
              <div
                id="dropdown"
                className="absolute right-0 mt-12 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
              >
                <ul
                  className="py-2 text-sm text-gray-700 dark:text-gray-200 z-99"
                  aria-labelledby="dropdown-button"
                >
                  {uniqueCategories.map((category) => (
                    <li key={category}>
                      <button
                        type="button"
                        className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                        onClick={() => selectCategory(category)}
                      >
                        {category}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </form>
      </div>

      {/* <button>hey</button> */}

      <button
        onClick={() => {
          router.push("/auth/RecommendCommunity");
        }}
        className="flex items-center px-4 py-2 bg-openbox-green text-white rounded-md hover:bg-openbox-green"
      >
        <MdRecommend className="mr-2 w-5 h-5" />
        Recommend a Community
      </button>

      <div className="flex justify-center flex-wrap mt-2">
        {!loading ? (
          <>
            {filteredData.length === 0 ? (
              <Typography variant="body1" className="mt-4">
                No communities found.
              </Typography>
            ) : (
              <>
                <div class="grid grid-cols-4 gap-4 p-2">
                  {filteredData.map((data, index) => (
                    <div className="relative">
                      {data.isHot ? (
                        <>
                          <button className="flex items-center absolute mt-1 mr-1  top-0 right-0 bg-red-500 text-white px-2 py-2 rounded-full">
                            <FaFire className="mr-2" />
                            <span>Hot</span>
                          </button>
                        </>
                      ) : (
                        <></>
                      )}

                      <div className=""></div>

                      <Card
                        className="flex flex-col h-full"
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          height: "350px", // Fixed card height
                          boxShadow: 3,
                          borderRadius: 2,
                        }}
                        onClick={() => {
                          router.push(`/Home/community/${data.id}`);
                        }}
                      >
                        {/* Community Image */}

                        <CardMedia
                          onClick={() => handleViewCommunity(data)} // Replace `data.id` with the appropriate property for the community identifier
                          component="img"
                          height="175" // Half of the card height (350px / 2)
                          className="h-40"
                          image={
                            data.communityImage
                              ? data.communityImage
                              : "https://images.unsplash.com/photo-1607656311408-1e4cfe2bd9fc?w=500&auto=format&fit=crop&q=60"
                          }
                          alt={`Image of ${data.name} community`}
                          loading="lazy" // Enables lazy loading
                          sx={{
                            objectFit: "cover",
                            width: "100%",
                          }}
                        />

                        {/* Community Content */}
                        <CardContent
                          sx={{ flexGrow: 1, padding: "12px !important" }}
                        >
                          {/* Community Name */}
                          <Typography
                            gutterBottom
                            variant="h6"
                            component="div"
                            style={{
                              fontFamily: "Poppins, sans-serif",
                              fontWeight: "bold", // Bold community names
                              textAlign: "left",
                            }}
                          >
                            {data.name}
                          </Typography>

                          {/* Community Description */}
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            style={{
                              fontFamily: "Poppins, sans-serif",
                              display: "-webkit-box",
                              WebkitLineClamp: 2, // Two lines for better readability
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              textAlign: "left",
                            }}
                          >
                            {data.description.length > 100
                              ? `${data.description.substring(0, 100)}... `
                              : data.description}
                            {data.description.length > 100 && (
                              <Button
                                size="small"
                                onClick={() =>
                                  handleOpenModal(data.description)
                                }
                                sx={{
                                  textTransform: "none",
                                  padding: 0,
                                  minWidth: "auto",
                                  color: "#bcd727",
                                  "&:hover": {
                                    backgroundColor: "transparent",
                                    textDecoration: "underline",
                                  },
                                }}
                              >
                                Read More
                              </Button>
                            )}
                          </Typography>

                          {/* Interest Tags */}
                          <div className="flex flex-wrap gap-1 mt-2">
                            {data.selectedInterests &&
                              data.selectedInterests.map((tag) => (
                                <>
                                  <Chip
                                    key={tag}
                                    label={tag}
                                    variant="filled"
                                    size="small"
                                    sx={{
                                      borderColor: "",
                                      color: "black",
                                      fontFamily: "Poppins, sans-serif",
                                    }}
                                    className="hover:bg-gray-200 bg-gray-300"
                                  />

                                  {/* <span className="bg-gray-400 text-black rounded px-1 py-1">
                                      {tag}
                                    </span> */}
                                </>
                              ))}
                            {data.tags && data.tags.length > 3 && (
                              <Chip
                                label={`+${data.tags.length - 3}`}
                                variant="outlined"
                                size="small"
                                sx={{
                                  borderColor: "#bcd727",
                                  color: "#bcd727",
                                  fontFamily: "Poppins, sans-serif",
                                }}
                              />
                            )}
                          </div>
                        </CardContent>

                        {/* Community Stats and Actions */}
                        <CardContent
                          sx={{
                            paddingTop: "0px !important",
                            paddingBottom: "0px !important",
                          }}
                        >
                          <Grid container alignItems="center">
                            {/* Left-aligned: Number of Members */}
                            <Grid item xs={6}>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                className="flex items-center"
                                style={{
                                  fontFamily: "Poppins, sans-serif",
                                  textAlign: "left",
                                }}
                              >
                                <People
                                  fontSize="small"
                                  style={{ marginRight: 4 }}
                                />
                                {data.users
                                  ? data.users.length.toLocaleString()
                                  : 0}
                                {data.users.length > 1 ? " Members" : " Member"}
                              </Typography>
                            </Grid>

                            {/* Right-aligned: Number of Events */}
                            <Grid item xs={6}>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                className="flex items-center justify-end"
                                style={{
                                  fontFamily: "Poppins, sans-serif",
                                  textAlign: "right",
                                }}
                              >
                                <CalendarToday
                                  fontSize="small"
                                  style={{ marginRight: 4 }}
                                />
                                {data.UpcomingEventCount
                                  ? data.UpcomingEventCount.toLocaleString()
                                  : ""}

                                {data.UpcomingEventCount > 1
                                  ? " Events"
                                  : " No Events"}
                              </Typography>
                            </Grid>
                          </Grid>
                        </CardContent>

                        {/* Join/Joined Button */}
                        <CardActions sx={{ padding: "12px !important" }}>
                          {data.users.includes(email) &&
                          data.name !== "OpenBox Community" ? (
                            <Button
                              fullWidth
                              variant="outlined"
                              onClick={() => handleLeaveCommunity(data)}
                              startIcon={<ExitToApp />} // Using ExitToApp as the leave icon
                              sx={{
                                borderColor: "#bcd727",
                                color: "#bcd727",
                                "&:disabled": {
                                  borderColor: "#bcd727",
                                  color: "#bcd727",
                                },
                                fontFamily: "Poppins, sans-serif",
                              }}
                            >
                              LEAVE
                            </Button>
                          ) : (
                            data.name !== "OpenBox Community" && (
                              <Button
                                fullWidth
                                variant="contained"
                                onClick={() => {}}
                                startIcon={<AddCircleOutlineIcon />}
                                sx={{
                                  backgroundColor: "#bcd727",
                                  color: "#fff",
                                  "&:hover": {
                                    backgroundColor: "#a4b622",
                                  },
                                  fontFamily: "Poppins, sans-serif",
                                }}
                              >
                                Join Community
                              </Button>
                            )
                          )}
                        </CardActions>
                      </Card>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <CircularProgress />
        )}
      </div>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

const Beams = () => {
  return (
    <svg
      width="380"
      height="315"
      viewBox="0 0 380 315"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute top-0 left-1/2 -translate-x-1/2 w-full pointer-events-none"
    >
      <g filter="url(#filter0_f_120_7473)">
        <circle cx="34" cy="52" r="114" fill="#6925E7" />
      </g>
      <g filter="url(#filter1_f_120_7473)">
        <circle cx="332" cy="24" r="102" fill="#8A4BFF" />
      </g>
      <g filter="url(#filter2_f_120_7473)">
        <circle cx="191" cy="53" r="102" fill="#802FE3" />
      </g>
      <defs>
        <filter
          id="filter0_f_120_7473"
          x="-192"
          y="-174"
          width="452"
          height="452"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="56"
            result="effect1_foregroundBlur_120_7473"
          />
        </filter>
        <filter
          id="filter1_f_120_7473"
          x="70"
          y="-238"
          width="524"
          height="524"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="80"
            result="effect1_foregroundBlur_120_7473"
          />
        </filter>
        <filter
          id="filter2_f_120_7473"
          x="-71"
          y="-209"
          width="524"
          height="524"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="80"
            result="effect1_foregroundBlur_120_7473"
          />
        </filter>
      </defs>
    </svg>
  );
};

const Rays = ({ className }) => {
  return (
    <svg
      width="380"
      height="397"
      viewBox="0 0 380 397"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        "absolute left-0 top-0  pointer-events-none z-[1]",
        className
      )}
    >
      <g filter="url(#filter0_f_120_7480)">
        <path
          d="M-37.4202 -76.0163L-18.6447 -90.7295L242.792 162.228L207.51 182.074L-37.4202 -76.0163Z"
          fill="url(#paint0_linear_120_7480)"
        />
      </g>
      <g
        style={{ mixBlendMode: "plus-lighter" }}
        opacity="0.3"
        filter="url(#filter1_f_120_7480)"
      >
        <path
          d="M-109.54 -36.9027L-84.2903 -58.0902L178.786 193.228L132.846 223.731L-109.54 -36.9027Z"
          fill="url(#paint1_linear_120_7480)"
        />
      </g>
      <g
        style={{ mixBlendMode: "plus-lighter" }}
        opacity="0.86"
        filter="url(#filter2_f_120_7480)"
      >
        <path
          d="M-100.647 -65.795L-69.7261 -92.654L194.786 157.229L139.51 197.068L-100.647 -65.795Z"
          fill="url(#paint2_linear_120_7480)"
        />
      </g>
      <g
        style={{ mixBlendMode: "plus-lighter" }}
        opacity="0.31"
        filter="url(#filter3_f_120_7480)"
      >
        <path
          d="M163.917 -89.0982C173.189 -72.1354 80.9618 2.11525 34.7334 30.1553C-11.495 58.1954 -106.505 97.514 -115.777 80.5512C-125.048 63.5885 -45.0708 -3.23233 1.15763 -31.2724C47.386 -59.3124 154.645 -106.061 163.917 -89.0982Z"
          fill="#8A50FF"
        />
      </g>
      <g
        style={{ mixBlendMode: "plus-lighter" }}
        filter="url(#filter4_f_120_7480)"
      >
        <path
          d="M34.2031 13.2222L291.721 269.534"
          stroke="url(#paint3_linear_120_7480)"
        />
      </g>
      <g
        style={{ mixBlendMode: "plus-lighter" }}
        filter="url(#filter5_f_120_7480)"
      >
        <path
          d="M41 -40.9331L298.518 215.378"
          stroke="url(#paint4_linear_120_7480)"
        />
      </g>
      <g
        style={{ mixBlendMode: "plus-lighter" }}
        filter="url(#filter6_f_120_7480)"
      >
        <path
          d="M61.3691 3.8999L317.266 261.83"
          stroke="url(#paint5_linear_120_7480)"
        />
      </g>
      <g
        style={{ mixBlendMode: "plus-lighter" }}
        filter="url(#filter7_f_120_7480)"
      >
        <path
          d="M-1.46191 9.06348L129.458 145.868"
          stroke="url(#paint6_linear_120_7480)"
          strokeWidth="2"
        />
      </g>
      <defs>
        <filter
          id="filter0_f_120_7480"
          x="-49.4199"
          y="-102.729"
          width="304.212"
          height="296.803"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="6"
            result="effect1_foregroundBlur_120_7480"
          />
        </filter>
        <filter
          id="filter1_f_120_7480"
          x="-115.54"
          y="-64.0903"
          width="300.326"
          height="293.822"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="3"
            result="effect1_foregroundBlur_120_7480"
          />
        </filter>
        <filter
          id="filter2_f_120_7480"
          x="-111.647"
          y="-103.654"
          width="317.434"
          height="311.722"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="5.5"
            result="effect1_foregroundBlur_120_7480"
          />
        </filter>
        <filter
          id="filter3_f_120_7480"
          x="-212.518"
          y="-188.71"
          width="473.085"
          height="369.366"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="48"
            result="effect1_foregroundBlur_120_7480"
          />
        </filter>
        <filter
          id="filter4_f_120_7480"
          x="25.8447"
          y="4.84521"
          width="274.234"
          height="273.065"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="4"
            result="effect1_foregroundBlur_120_7480"
          />
        </filter>
        <filter
          id="filter5_f_120_7480"
          x="32.6416"
          y="-49.3101"
          width="274.234"
          height="273.065"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="4"
            result="effect1_foregroundBlur_120_7480"
          />
        </filter>
        <filter
          id="filter6_f_120_7480"
          x="54.0078"
          y="-3.47461"
          width="270.619"
          height="272.68"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="3.5"
            result="effect1_foregroundBlur_120_7480"
          />
        </filter>
        <filter
          id="filter7_f_120_7480"
          x="-9.2002"
          y="1.32812"
          width="146.396"
          height="152.275"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="3.5"
            result="effect1_foregroundBlur_120_7480"
          />
        </filter>
        <linearGradient
          id="paint0_linear_120_7480"
          x1="-57.5042"
          y1="-134.741"
          x2="403.147"
          y2="351.523"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.214779" stopColor="#AF53FF" />
          <stop offset="0.781583" stopColor="#B253FF" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_120_7480"
          x1="-122.154"
          y1="-103.098"
          x2="342.232"
          y2="379.765"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.214779" stopColor="#AF53FF" />
          <stop offset="0.781583" stopColor="#9E53FF" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_120_7480"
          x1="-106.717"
          y1="-138.534"
          x2="359.545"
          y2="342.58"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.214779" stopColor="#9D53FF" />
          <stop offset="0.781583" stopColor="#A953FF" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint3_linear_120_7480"
          x1="72.701"
          y1="54.347"
          x2="217.209"
          y2="187.221"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#AF81FF" />
          <stop offset="1" stopColor="#C081FF" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint4_linear_120_7480"
          x1="79.4978"
          y1="0.191681"
          x2="224.006"
          y2="133.065"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#AF81FF" />
          <stop offset="1" stopColor="#C081FF" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint5_linear_120_7480"
          x1="79.6568"
          y1="21.8377"
          x2="234.515"
          y2="174.189"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#B981FF" />
          <stop offset="1" stopColor="#CF81FF" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint6_linear_120_7480"
          x1="16.119"
          y1="27.6966"
          x2="165.979"
          y2="184.983"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#A981FF" />
          <stop offset="1" stopColor="#CB81FF" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default DiscoverCommunity;
