// DiscoverCommunity.jsx

"use client"; // Must be the first line

import React, { useEffect, useState } from "react";
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

// Import your database modules
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
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // Four categories per page
  const [openModal, setOpenModal] = useState(false);
  const [modalContent, setModalContent] = useState("");

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

  // Function to capitalize the first letter of a string
  const capitalizeFirstLetter = (string) => {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  // Group communities by category
  const groupedCommunities = submittedData.reduce((acc, community) => {
    const category = community.category || "Uncategorized";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(community);
    return acc;
  }, {});

  // Get unique categories
  const categories = Object.keys(groupedCommunities);

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

  // Pagination for categories (four categories per page)
  const totalCategoryPages = Math.ceil(
    filteredCategories.length / itemsPerPage
  );

  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      {/* SEARCH AND FILTER BAR */}
      <div className="flex justify-center mt-4 mb-2">
        <div className="max-w-4xl w-full px-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Search Field */}
            <TextField
              variant="outlined"
              placeholder="Search communities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              fullWidth
              InputProps={{
                startAdornment: <Search />,
              }}
              style={{ fontFamily: "Poppins, sans-serif" }}
            />

            {/* Category Select */}
            <FormControl variant="outlined" style={{ minWidth: 200 }}>
              <InputLabel id="category-select-label">Category</InputLabel>
              <Select
                labelId="category-select-label"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                label="Category"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                <MenuItem value="All">All</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {capitalizeFirstLetter(category)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
                              {data.tags &&
                                data.tags.slice(0, 3).map((tag) => (
                                  <Chip
                                    key={tag}
                                    label={tag}
                                    variant="outlined"
                                    size="small"
                                    sx={{
                                      borderColor: "#bcd727",
                                      color: "#bcd727",
                                      fontFamily: "Poppins, sans-serif",
                                    }}
                                  />
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
                                    : 0}{" "}
                                  Members
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
                                  {data.postsCount
                                    ? data.postsCount.toLocaleString()
                                    : 0}{" "}
                                  Events
                                </Typography>
                              </Grid>
                            </Grid>
                          </CardContent>

                          {/* Join/Joined Button */}
                          <CardActions sx={{ padding: "12px !important" }}>
                            {data.users.includes(email) ? (
                              <Button
                                fullWidth
                                variant="outlined"
                                disabled
                                startIcon={<CheckCircle />}
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
                                Joined
                              </Button>
                            ) : (
                              <Button
                                fullWidth
                                variant="contained"
                                onClick={() => handleJoinCommunity(data)}
                                startIcon={<CheckCircle />}
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
                            )}
                          </CardActions>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </div>
              ))
            )}
          </>
        ) : (
          <div className="flex justify-center">
            <CircularProgress />
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
