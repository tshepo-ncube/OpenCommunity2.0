import React, { useEffect, useState } from "react";
import {
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Snackbar,
  Alert,
} from "@mui/material";
import { IconButton, Menu } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CommunityDB from "../../database/community/community";
import { useRouter } from "next/navigation";
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

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    CommunityDB.createCommunity(
      { name, description, category: "general" }, // Assuming a default category
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
    console.log("JOininc a community");

    UserDB.addPoints(5);

    const result = await CommunityDB.joinCommunity(data.id, email);
    if (result.success) {
      // Update the state to reflect the joined status
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

      // Set Snackbar message and open it
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
      // Update the state to reflect the left status
      const updatedData = submittedData.map((community) => {
        if (community.id === data.id) {
          return {
            ...community,
            users: community.users.filter((user) => user !== email), // Remove email from users list
          };
        }
        return community;
      });
      setSubmittedData(updatedData);

      // Set Snackbar message and open it
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

  // const filterDataByCategoryAndStatus = (
  //   data: {
  //     id: string;
  //     name: string;
  //     description: string;
  //     category: string;
  //     status: string;
  //     users: string[];
  //   }[]
  // ) => {
  //   return data.filter(
  //     (item) =>
  //       item.category.toLowerCase().includes(selectedCategory.toLowerCase()) &&
  //       item.status === selectedStatus &&
  //       `${item.name.toLowerCase()} ${item.description.toLowerCase()} ${item.category.toLowerCase()}`.includes(
  //         searchQuery.toLowerCase()
  //       )
  //   );
  // };

  const filteredData = filterDataByCategoryAndStatus(submittedData);

  const uniqueCategories = Array.from(
    new Set(submittedData.map((data) => data.category))
  );
  uniqueCategories.unshift("All Communities");

  // Function to generate consistent color based on category
  const stringToColor = (category: string): string => {
    switch (category.toLowerCase()) {
      case "general":
        return "#2196f3"; // Blue
      case "social":
        return "#ff9800"; // Orange
      case "retreat":
        return "#f44336"; // Red
      case "sports":
        return "#4caf50"; // Green
      case "development":
        return "#9c27b0"; // Purple
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
  //const [selectedCategory, setSelectedCategory] = useState("All categories");

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
              Your Email
            </label>

            <div className="relative w-full">
              <button className="absolute top-0 start-0 mr-44 p-2.5 text-sm font-medium h-full text-white bg-openbox-green rounded-s-lg border border-openbox-green hover:bg-openbox-green focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
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
                className="ml-8 block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-s-lg border-s-gray-50 border-s-2 border border-gray-300"
                required
              />
            </div>

            <label
              htmlFor="search-dropdown"
              className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
            >
              Your Email
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
                  className="py-2 text-sm  text-gray-700 dark:text-gray-200 z-99"
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
            {filteredData.length === 0 ? (
              <Typography variant="body1" className="mt-4">
                No communities found.
              </Typography>
            ) : (
              <Grid container spacing={2} style={{ padding: 14 }}>
                {filteredData.map((data, index) => (
                  <Grid item xs={6} md={3} key={index}>
                    <div className="w-full max-w-sm bg-white border border-gray_og rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 relative">
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
                          top: 12,
                          left: 10,
                          backgroundColor: stringToColor(data.category),
                        }}
                        className="absolute text-white px-2 py-1 rounded-md text-xs font-bold z-10"
                      >
                        {data.category}
                      </div>
                      <div className="mt-4 px-5 pb-5">
                        <a href="#">
                          <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                            {data.name}
                          </h5>
                        </a>
                        <div className="flex items-center mt-2.5 mb-5">
                          <div className="flex items-center space-x-1 rtl:space-x-reverse"></div>
                          <div className="text-sm text-black py-1  font-semibold">
                            {data.description}
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
                          <CardActions>
                            {data.users.includes(email) ? (
                              <>
                                <Button size="small" disabled>
                                  Joined
                                </Button>
                                <Button
                                  size="small"
                                  onClick={() => handleLeaveCommunity(data)}
                                >
                                  Leave Community
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  size="small"
                                  onClick={() => handleJoinCommunity(data)}
                                >
                                  Join
                                </Button>
                                <Button
                                  size="small"
                                  onClick={() => handleViewCommunity(data)}
                                >
                                  View
                                </Button>
                              </>
                            )}
                          </CardActions>
                        </div>
                      </div>
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

      {/* Snackbar for notifications */}
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
