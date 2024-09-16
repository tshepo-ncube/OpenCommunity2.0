import React, { useEffect, useState } from "react";
import {
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  Snackbar,
  Alert,
  Tooltip,
  IconButton,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useRouter } from "next/navigation";
import CommunityDB from "../../database/community/community";
import UserDB from "@/database/community/users";

interface DiscoverCommunityProps {
  email: string;
}

const DiscoverCommunity: React.FC<DiscoverCommunityProps> = ({ email }) => {
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submittedData, setSubmittedData] = useState<
    {
      id: string;
      name: string;
      description: string;
      category: string;
      status: string;
      users: string[];
    }[]
  >([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] =
    useState<string>("All Communities");
  const [selectedStatus, setSelectedStatus] = useState<string>("active");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(12);

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

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    CommunityDB.createCommunity(
      { name, description, category: "general" },
      setSubmittedData,
      setLoading
    );
    setName("");
    setDescription("");
  };

  const handleEdit = (index: number) => {
    setName(submittedData[index].name);
    setDescription(submittedData[index].description);
    setEditIndex(index);
  };

  const handleJoinCommunity = async (data: any) => {
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

  const handleLeaveCommunity = async (data: any) => {
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

  const handleViewCommunity = (data: any) => {
    router.push(`/userview?id=${data.id}`);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const filterDataByCategoryAndStatus = (
    data: {
      id: string;
      name: string;
      description: string;
      category: string;
      status: string;
      users: string[];
    }[]
  ) => {
    return data.filter((item) => {
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

  const stringToColor = (category: string): string => {
    switch (category.toLowerCase()) {
      case "general":
        return "#a3c2e7";
      case "social":
        return "#f7b7a3";
      case "retreat":
        return "#f7a4a4";
      case "sports":
        return "#a3d9a5";
      case "development":
        return "#d4a1d1";
      default:
        let hash = 0;
        for (let i = 0; i < category.length; i++) {
          hash = category.charCodeAt(i) + ((hash << 5) - hash);
        }
        const color = `hsl(${Math.abs(hash) % 360}, 70%, 80%)`;
        return color;
    }
  };

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const selectCategory = (category) => {
    setSelectedCategory(category);
    setDropdownOpen(false);
  };

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

  return (
    <>
      <div className="flex justify-center mt-4 mb-2">
        <form className="max-w-lg mx-auto w-full z-90">
          <div className="flex relative">
            <label
              htmlFor="search-dropdown"
              style={{ fontFamily: "Poppins, sans-serif" }}
              className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
            >
              Your Email
            </label>

            <div className="relative w-full">
              <button
                className="absolute top-0 start-0 mr-44 p-2.5 text-sm font-medium h-full text-white bg-openbox-green rounded-s-lg border border-openbox-green hover:bg-openbox-green focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                style={{ fontFamily: "Poppins, sans-serif" }}
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
                className="block p-2.5 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                style={{ fontFamily: "Poppins, sans-serif" }}
              />
            </div>

            <button
              id="dropdown-button"
              onClick={toggleDropdown}
              type="button"
              className="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-e-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              {selectedCategory}
              <svg
                className="w-4 h-4 ml-2"
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
                        onClick={() => {
                          selectCategory(category);
                          setSelectedCategory(category);
                        }}
                        style={{ fontFamily: "Poppins, sans-serif" }}
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

      <div className="flex justify-center flex-wrap mt-2">
        {!loading ? (
          <>
            {paginatedData.length === 0 ? (
              <Typography
                variant="body1"
                className="mt-4"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                No communities found.
              </Typography>
            ) : (
              <Grid container spacing={2} style={{ padding: 14 }}>
                {paginatedData.map((data, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <div className="relative flex h-full">
                      <Card
                        className="w-full max-w-sm bg-white rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700 flex-grow flex flex-col relative"
                        style={{ border: "none" }} // Remove the border
                      >
                        <a href="#">
                          <img
                            className="h-40 w-full rounded-t-lg object-cover"
                            src="https://images.unsplash.com/photo-1607656311408-1e4cfe2bd9fc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGRyaW5rc3xlbnwwfHwwfHx8MA%3D%3D"
                            alt="product image"
                          />
                        </a>

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
                            color: "white",
                            fontSize: "0.875rem", // Adjust font size if needed
                            fontWeight: "bold",
                            borderRadius: "0.375rem", // Make sure to use rounded corners if needed
                          }}
                          className="text-sm font-bold rounded-md absolute top-0 right-0 z-10"
                        >
                          {data.category}
                        </div>

                        <CardContent className="flex-grow">
                          <a href="#">
                            <Typography
                              variant="h5"
                              component="h2"
                              className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white"
                              style={{ fontFamily: "Poppins, sans-serif" }}
                            >
                              {data.name}
                            </Typography>
                          </a>
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            style={{ fontFamily: "Poppins, sans-serif" }}
                            className="mt-2"
                          >
                            {data.description}
                          </Typography>
                        </CardContent>
                        <CardActions style={{ justifyContent: "center" }}>
                          <div
                            style={{
                              display: "flex",
                              gap: "8px",
                              alignItems: "center",
                            }}
                          >
                            {data.users.includes(email) ? (
                              <Button
                                size="small"
                                disabled
                                style={{ fontFamily: "Poppins, sans-serif" }}
                              >
                                You are a member
                              </Button>
                            ) : (
                              <Button
                                size="small"
                                onClick={() => handleJoinCommunity(data)}
                                style={{ fontFamily: "Poppins, sans-serif" }}
                              ></Button>
                            )}
                          </div>
                        </CardActions>
                        <div className="absolute top-2 right-2 flex gap-2 z-20">
                          {!data.users.includes(email) && (
                            <Tooltip title="Join Community" placement="top">
                              <IconButton
                                onClick={() => handleJoinCommunity(data)}
                                style={{
                                  color: "white", // Icon color
                                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                                  padding: "4px",
                                }}
                                size="small"
                              >
                                <PersonAddIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                          {data.users.includes(email) && (
                            <Tooltip title="Leave Community" placement="top">
                              <IconButton
                                onClick={() => handleLeaveCommunity(data)}
                                style={{
                                  color: "white", // Icon color
                                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                                  padding: "4px",
                                }}
                                size="small"
                              >
                                <ExitToAppIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                          <Tooltip title="View Community" placement="top">
                            <IconButton
                              onClick={() => handleViewCommunity(data)}
                              style={{
                                color: "white", // Icon color
                                backgroundColor: "rgba(0, 0, 0, 0.5)",
                                padding: "4px",
                              }}
                              size="small"
                            >
                              <OpenInNewIcon />
                            </IconButton>
                          </Tooltip>
                        </div>
                      </Card>
                    </div>
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        ) : (
          <CircularProgress />
        )}
      </div>

      <div className="flex justify-center mt-4">
        <Button
          disabled={currentPage === 1}
          onClick={handlePreviousPage}
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          Previous
        </Button>
        <span className="mx-4">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          disabled={currentPage === totalPages}
          onClick={handleNextPage}
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          Next
        </Button>
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
