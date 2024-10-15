// DiscoverCommunity.jsx

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
} from "@mui/material";
import {
  CheckCircle,
  People,
  CalendarToday, // Imported Calendar Icon
  ArrowBack,
  ArrowForward,
  Search,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";

// Import your database modules
import CommunityDB from "@/database/community/community";
import UserDB from "@/database/community/users";

const DiscoverCommunity = ({ email }) => {
  const [loading, setLoading] = useState(true);
  const [submittedData, setSubmittedData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

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

  const handleViewCommunity = (data) => {
    router.push(`/userview?id=${data.id}`);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  // Filter functions
  const filterDataByCategoryAndSearch = (data) => {
    return data.filter((item) => {
      const categoryMatch =
        selectedCategory.toLowerCase() === "all" ||
        item.category.toLowerCase() === selectedCategory.toLowerCase();

      const searchQueryMatch =
        `${item.name.toLowerCase()} ${item.description.toLowerCase()} ${item.category.toLowerCase()}`.includes(
          searchQuery.toLowerCase()
        );

      return categoryMatch && searchQueryMatch;
    });
  };

  const filteredData = filterDataByCategoryAndSearch(submittedData);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => {
      const newPage = prevPage + 1;
      if (newPage <= totalPages) {
        return newPage;
      }
      return prevPage;
    });
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => {
      const newPage = prevPage - 1;
      if (newPage >= 1) {
        return newPage;
      }
      return prevPage;
    });
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // Unique categories for the dropdown
  const capitalizeFirstLetter = (category) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  const uniqueCategories = Array.from(
    new Set(submittedData.map((data) => capitalizeFirstLetter(data.category)))
  );

  uniqueCategories.unshift("All");

  return (
    <>
      {/* SEARCH BAR */}
      <div className="flex justify-center mt-4 mb-2">
        <div className="max-w-lg mx-auto w-full">
          <div className="flex items-center">
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
            <FormControl
              variant="outlined"
              style={{ marginLeft: 8, minWidth: 150 }}
            >
              <InputLabel id="category-select-label">Category</InputLabel>
              <Select
                labelId="category-select-label"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                label="Category"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {uniqueCategories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>
      </div>

      {/* Community Cards */}
      <div className="container mx-auto px-4 py-8">
        {!loading ? (
          <>
            {paginatedData.length === 0 ? (
              <Typography
                variant="h6"
                className="mt-4 text-center"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                No communities found.
              </Typography>
            ) : (
              <Grid container spacing={4}>
                {paginatedData.map((data) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={data.id}>
                    <Card className="flex flex-col h-full">
                      <CardMedia
                        component="img"
                        height="140"
                        image={
                          data.communityImage
                            ? data.communityImage
                            : "https://images.unsplash.com/photo-1607656311408-1e4cfe2bd9fc?w=500&auto=format&fit=crop&q=60"
                        }
                        alt={data.name}
                      />
                      <CardContent className="flex-grow">
                        <Typography
                          gutterBottom
                          variant="h5"
                          component="div"
                          style={{ fontFamily: "Poppins, sans-serif" }}
                        >
                          {data.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          style={{ fontFamily: "Poppins, sans-serif" }}
                        >
                          {data.description}
                        </Typography>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {data.tags &&
                            data.tags.map((tag) => (
                              <Chip
                                key={tag}
                                label={tag}
                                variant="outlined"
                                size="small"
                                style={{ marginRight: 4, marginTop: 4 }}
                              />
                            ))}
                        </div>
                        <div className="flex justify-between text-sm text-gray-600 mt-2">
                          <span className="flex items-center">
                            <People
                              fontSize="small"
                              style={{ marginRight: 4 }}
                            />
                            {data.users
                              ? data.users.length.toLocaleString()
                              : 0}{" "}
                            members
                          </span>
                          {/* Replaced Forum with CalendarToday Icon */}
                          <span className="flex items-center">
                            <CalendarToday
                              fontSize="small"
                              style={{ marginRight: 4 }}
                            />
                            {data.postsCount
                              ? data.postsCount.toLocaleString()
                              : 0}{" "}
                            events
                          </span>
                        </div>
                      </CardContent>
                      <CardActions>
                        {data.users.includes(email) ? (
                          <Button
                            fullWidth
                            variant="outlined"
                            disabled
                            startIcon={<CheckCircle />}
                            style={{
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
                                backgroundColor: "#a4b622", // Darker shade on hover
                              },
                            }}
                            style={{
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
            )}
          </>
        ) : (
          <div className="flex justify-center">
            <CircularProgress />
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        <Button
          disabled={currentPage === 1}
          onClick={handlePreviousPage}
          variant="outlined"
          startIcon={<ArrowBack />}
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          Previous
        </Button>
        <span className="mx-4 mt-2">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          disabled={currentPage === totalPages}
          onClick={handleNextPage}
          variant="outlined"
          endIcon={<ArrowForward />}
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          Next
        </Button>
      </div>

      {/* Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default DiscoverCommunity;
