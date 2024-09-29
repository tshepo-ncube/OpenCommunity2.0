import React, { useEffect, useState } from "react";
import {
  CircularProgress,
  Grid,
  Typography,
  Snackbar,
  Alert,
  IconButton,
  Tooltip,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CommunityDB from "../database/community/community";
import { useRouter } from "next/navigation";
import CardDemo from "./CardDemo";
import CardGiff from "./CardGiff";

const DiscoverCommunity = ({ email }) => {
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

  const handleViewCommunity = (data) => {
    // Redirect to the specified path format with community ID
    router.push(`/Home/community/${data.id}`);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const filterDataByCategoryAndStatus = (data) => {
    return data
      .filter((item) => item.users.includes(email))
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

  const uniqueCategories = Array.from(
    new Set(submittedData.map((data) => data.category))
  );
  uniqueCategories.unshift("All Communities");

  // Function to generate consistent color based on category
  const stringToColor = (category) => {
    switch (category.toLowerCase()) {
      case "general":
        return "#a3c2e7"; // Pastel Blue
      case "social":
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

  return (
    <>
      <div className="flex justify-center mt-4 mb-2">
        <form className="max-w-lg mx-auto w-full z-90">
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

      <div className="flex justify-center flex-wrap mt-2 mb-20">
        {!loading ? (
          <>
            {filteredData.length === 0 ? (
              <Typography variant="body1" className="mt-4">
                No communities found.
              </Typography>
            ) : (
              <div className="grid grid-cols-4 gap-4">
                {filteredData.map((data, index) => (
                  <div
                    className="relative w-full max-w-sm bg-white border border-gray_og rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 flex-grow flex flex-col h-full cursor-pointer"
                    // onClick={() => {
                    //   handleViewCommunity(data);
                    //   console.log(data);
                    // }}
                    style={{ position: "relative" }}
                  >
                    <CardDemo
                      name={data.name}
                      image={data.communityImage}
                      category={data.category}
                      description={data.description}
                      data={data}
                      handleViewCommunity={handleViewCommunity}
                    />
                    {/* 
                    <CardGiff
                      name={data.name}
                      image={data.communityImage}
                      // category={data.category}
                      description={data.description}
                    /> */}
                    {/* <img
                        className="h-56 w-full rounded-t-lg object-cover"
                        // src={
                        //   data.communityImage
                        //     ? `url(${data.communityImage})`
                        //     : "https://images.unsplash.com/photo-1720048169707-a32d6dfca0b3?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        // }
                        alt="community image"
                        src={
                          data.communityImage
                            ? data.communityImage // Directly use the URL without `url()`
                            : "https://plus.unsplash.com/premium_photo-1666824468749-3ce4c85dc2e3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyfHx8ZW58MHx8fHx8"
                        }
                      />
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          backgroundColor: stringToColor(data.category),
                          width: "83px",
                          height: "36px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        className="text-white text-sm font-bold rounded-md z-10"
                      >
                        {data.category}
                      </div>

                      <div className="flex flex-col flex-grow mt-4 px-5 pb-5">
                        <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                          {data.name}
                        </h5>
                        <div className="text-sm text-black py-1 font-semibold">
                          {data.description}
                        </div>
                        <div className="flex-grow" />
                        <div className="flex justify-center mb-0">
                         
                        </div>
                      </div>

                     
                      <Tooltip title="View community" arrow>
                        <IconButton
                          style={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            color: "white",
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                          }}
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent triggering the card's onClick
                            handleViewCommunity(data);
                          }}
                          size="small"
                        >
                          <OpenInNewIcon fontSize="small" />
                        </IconButton>
                      </Tooltip> */}
                  </div>
                ))}
              </div>
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

export default DiscoverCommunity;
