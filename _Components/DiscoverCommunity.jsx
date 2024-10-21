// DiscoverCommunity.jsx

"use client"; // Must be the first line

import React, { useEffect, useState } from "react";

import { FaFire } from "react-icons/fa";
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
// Import your database modules
import ExitToApp from "@mui/icons-material/ExitToApp";

import CommunityDB from "@/database/community/community";
import UserDB from "@/database/community/users";

// Styles for the Modal
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

const DiscoverCommunity = ({ email }) => {
  const [loading, setLoading] = useState(true);
  const [submittedData, setSubmittedData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // Four categories per page
  const [openModal, setOpenModal] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Communities");
  const [selectedStatus, setSelectedStatus] = useState("active");
  // const [searchQuery, setSearchQuery] = useState("");
  // const [selectedCategory, setSelectedCategory] = useState("All Communities");

  const [dropdownOpen, setDropdownOpen] = useState(false);

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
    console.log("All Communties: ", submittedData);
  }, [submittedData]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const handleJoinCommunity = async (data) => {
    console.log("Joining a community");

    UserDB.addPoints(5);

    const result = await CommunityDB.joinCommunity(data.id, email);
    if (result.success) {
      const updatedData = submittedData.map((community) => {
        if (community.id === data.id) {
          return {
            ...community,
            users: [...community.users, email],
          };
        }
        return community;
      });
      setSubmittedData(updatedData);

      setSnackbarMessage(
        `Congrats! You have now joined the "${data.name}" community.`
      );
      setOpenSnackbar(true);
    } else {
      alert(result.message);
    }
  };

  const capitalizeFirstLetter = (category) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };
  const filterDataByCategoryAndStatus = (data) => {
    return data.filter((item) => {
      const categoryMatch =
        selectedCategory === "All Communities" ||
        item.category.toLowerCase() === selectedCategory.toLowerCase();

      const searchQueryMatch =
        searchQuery === "" ||
        `${item.name.toLowerCase()} ${item.description.toLowerCase()} ${item.category.toLowerCase()}`.includes(
          searchQuery.toLowerCase()
        );

      return categoryMatch && searchQueryMatch;
    });
  };

  const filteredData = filterDataByCategoryAndStatus(submittedData);

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

  const selectCategory = (category) => {
    setSelectedCategory(category);
    setDropdownOpen(false); // Close the dropdown after selecting a category
  };

  // Modify this part to remove the duplicate "All Communities" option
  const uniqueCategories = [
    "All Communities",
    ...Array.from(
      new Set(submittedData.map((data) => capitalizeFirstLetter(data.category)))
    ),
  ];

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
  // Group communities by category
  const groupedCommunities = filteredData.reduce((acc, community) => {
    const category = community.category || "Uncategorized";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(community);
    return acc;
  }, {});
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleOpenModal = (description) => {
    setModalContent(description);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setModalContent("");
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  const getInterestsByCategory = (category) => {
    return interests
      .filter((item) => item.category.toLowerCase() === category.toLowerCase())
      .map((item) => item.interest);
  };
  const categories = Object.keys(groupedCommunities);

  // Pagination for categories (four categories per page)
  const totalCategoryPages = Math.ceil(categories.length / itemsPerPage);

  const paginatedCategories = categories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Filter categories based on selectedCategory and searchQuery
  const filteredCategories = categories.filter((category) => {
    if (selectedCategory !== "All" && category !== selectedCategory) {
      return false;
    }
    // Further filter communities within the category based on searchQuery
    const filteredCommunities = groupedCommunities[category].filter(
      (community) => {
        const query = searchQuery.toLowerCase();
        return (
          community.name.toLowerCase().includes(query) ||
          community.description.toLowerCase().includes(query) ||
          (community.tags &&
            community.tags.some((tag) => tag.toLowerCase().includes(query)))
        );
      }
    );
    // Update the groupedCommunities to include only filtered communities
    groupedCommunities[category] = filteredCommunities;
    return filteredCommunities.length > 0;
  });
  return (
    <>
      {/* SEARCH AND FILTER BAR */}
      <div className="flex justify-center mt-4 mb-2">
        <div className="max-w-xl w-full px-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
            <div className="relative">
              <button
                id="dropdown-button"
                onClick={toggleDropdown}
                type="button"
                className="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 min-w-[120px] h-11 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-e-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600 whitespace-nowrap"
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
                  className="absolute left-0 mt-1 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
                  style={{
                    zIndex: 1000,
                    position: "absolute",
                    top: "100%",
                    right: 0,
                  }}
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
          </div>
        </div>
      </div>

      {/* Community Cards Grouped by Category */}
      <div className="container mx-auto px-4 py-8">
        {!loading ? (
          <>
            {paginatedCategories.length === 0 ? (
              <Typography
                variant="h6"
                className="mt-4 text-center"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                No communities found.
              </Typography>
            ) : (
              paginatedCategories.map((category) => (
                <div key={category} className="mb-8">
                  {/* Category Heading */}
                  <Typography
                    variant="h5"
                    component="h2"
                    gutterBottom
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 600,
                      textAlign: "left",
                    }}
                  >
                    {capitalizeFirstLetter(category)}
                  </Typography>

                  {/* Divider */}
                  <Divider />

                  {/* Communities Grid */}
                  <Grid container spacing={4} className="mt-4">
                    {groupedCommunities[category].map((data) => (
                      <Grid item xs={12} sm={6} md={4} lg={3} key={data.id}>
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
                              transition: "transform 0.2s, box-shadow 0.2s",
                              "&:hover": {
                                transform: "scale(1.02)",
                                boxShadow: 6,
                              },
                            }}
                          >
                            {/* Community Image */}
                            <CardMedia
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
                                {getInterestsByCategory(data.category)
                                  .slice(0, 3)
                                  .map((tag) => (
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
                                    {data.users.length > 1
                                      ? " Members"
                                      : " Member"}
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
                            {/* Only the CardActions section needs to be updated in the existing Card component */}

                            <CardActions sx={{ padding: "12px !important" }}>
                              {data.name !== "OpenBox Community" &&
                              data.users.includes(email) ? (
                                <Button
                                  fullWidth
                                  variant="outlined"
                                  onClick={() => handleLeaveCommunity(data)}
                                  startIcon={<ExitToApp />} // Using ExitToApp as the leave icon
                                  sx={{
                                    borderColor: "#bcd727",
                                    color: "#bcd727",
                                    "&:hover": {
                                      borderColor: "#a4b622",
                                      color: "#a4b622",
                                      backgroundColor:
                                        "rgba(188, 215, 39, 0.04)",
                                    },
                                    fontFamily: "Poppins, sans-serif",
                                  }}
                                >
                                  Leave
                                </Button>
                              ) : (
                                data.name !== "OpenBox Community" && (
                                  <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={() => handleJoinCommunity(data)}
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
                      </Grid>
                    ))}
                  </Grid>
                </div>
              ))
            )}
          </>
        ) : (
          <div className="flex justify-center">
            <CircularProgress style={{ color: "#bcd727" }} />
          </div>
        )}
      </div>

      {/* Pagination for Categories */}
      {totalCategoryPages > 1 && (
        <div className="flex justify-center mt-4">
          <Button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            variant="outlined"
            startIcon={<ArrowBack />}
            sx={{ marginRight: 2 }}
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Previous
          </Button>
          <Typography
            variant="body1"
            className="mt-2"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Page {currentPage} of {totalCategoryPages}
          </Typography>
          <Button
            disabled={currentPage === totalCategoryPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            variant="outlined"
            endIcon={<ArrowForward />}
            sx={{ marginLeft: 2 }}
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Next
          </Button>
        </div>
      )}

      {/* Snackbar for Notifications */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Modal for "Read More" */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="read-more-title"
        aria-describedby="read-more-description"
      >
        <Box sx={modalStyle}>
          <Typography
            id="read-more-title"
            variant="h6"
            component="h2"
            gutterBottom
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Community Description
          </Typography>
          <Typography
            id="read-more-description"
            sx={{ mt: 2 }}
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            {modalContent}
          </Typography>
          <Button
            onClick={handleCloseModal}
            variant="contained"
            color="primary"
            sx={{
              mt: 3,
              backgroundColor: "#bcd727",
              "&:hover": { backgroundColor: "#a4b622" },
            }}
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Close
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default DiscoverCommunity;
