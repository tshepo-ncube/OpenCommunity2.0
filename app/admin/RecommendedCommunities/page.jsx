"use client";
import React, { useEffect, useState, useRef } from "react";
import RecommendationDB from "@/database/community/recommendation"; // Import your DB module
import CommunityDB from "@/database/community/community"; // Import CommunityDB
import {
  CircularProgress,
  Grid,
  Typography,
  Snackbar,
  Alert,
  IconButton,
  Tooltip,
} from "@mui/material";
import Header from "../../../_Components/header";
import { useTable } from "react-table";
import Swal from "sweetalert2"; // Import SweetAlert2
import { motion, AnimatePresence } from "framer-motion";
import { FaHeart, FaRegHeart, FaPlus, FaEnvelope } from "react-icons/fa";
import CloseIcon from "@mui/icons-material/Close";
import InterestSelection from "@/_Components/InterestsSelection";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
const mutedLimeGreen = "#d0e43f"; // Muted version of #bcd727

export default function RecommendationsTable() {
  const [recommendations, setRecommendations] = useState([]);
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'chart'
  const [isLoading, setIsLoading] = useState(false);
  // const [likedRecommendations, setLikedRecommendations] =
  //   useState < Set < string >> new Set();
  const [likedRecommendations, setLikedRecommendations] = useState(new Set());
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Fitness & Wellness");
  const [image, setImage] = useState(null);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const popupRef = useRef(null);
  const fileInputRef = useRef(null);
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setIsLoading(true);
        const allRecommendations =
          await RecommendationDB.getAllRecommendations();
        setRecommendations(allRecommendations);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
        Swal.fire(
          "Error",
          "Failed to fetch recommendations. Please try again.",
          "error"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  const handleUploadButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageUpload = (event) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setPopupOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleFormSubmit = async (e, status) => {
    e.preventDefault();

    if (selectedInterests.length < 3) {
      Swal.fire("Error", "Please select at least 3 interests", "error");
      return;
    }

    const communityData = {
      name,
      description,
      category,
      status,
      admin: localStorage.getItem("Email"), // Use the logged in  email
    };

    try {
      setIsLoading(true);

      // Find the recommendation before trying to delete it
      const recommendationToDelete = recommendations.find(
        (rec) => rec.name.toLowerCase() === name.toLowerCase()
      );

      if (!recommendationToDelete) {
        throw new Error("Recommendation not found");
      }

      // Create the community first
      await CommunityDB.createCommunity(
        communityData,
        image,
        (newCommunity) => {
          console.log("Community created successfully:", newCommunity);
        },
        setIsLoading,
        selectedInterests
      );

      // After successful community creation, delete the recommendation
      await RecommendationDB.deleteRecommendation(recommendationToDelete.id);

      // Update the local state to remove the recommendation
      setRecommendations((prevRecs) =>
        prevRecs.filter((rec) => rec.id !== recommendationToDelete.id)
      );

      // Reset form fields
      setName("");
      setDescription("");
      setCategory("Fitness & Wellness");
      setImage(null);
      setSelectedInterests([]);

      // Close the popup
      setPopupOpen(false); // This closes the popup

      // Show success message
      Swal.fire({
        title: "Success",
        text: "Community created successfully and removed from recommendations",
        icon: "success",
        confirmButtonColor: "#bcd727",
      });
    } catch (error) {
      console.error("Error in community creation:", error);
      Swal.fire({
        title: "Error",
        text: error.message || "Failed to create community. Please try again.",
        icon: "error",
        confirmButtonColor: "#bcd727",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddClick = (rec) => {
    setName(rec.name); // Populate with selected community name
    setDescription(rec.description); // Populate with selected community description
    setCategory(rec.category); // Set category based on the selected recommendation
    setPopupOpen(true); // Open the popup
  };

  const handleEmailClick = (email, name, description, category) => {
    const subject = encodeURIComponent(
      "OpenCommunity Community Recommendation"
    );
    const body = encodeURIComponent(
      `Hello,\n\nI am contacting you regarding your community recommendation.\n\n` +
        `Community Name: ${name}\n` +
        `Community Description: ${description}\n` +
        `Category: ${category}\n\n` +
        `Best regards,`
    );
    const mailtoLink = `mailto:${email}?subject=${subject}&body=${body}`;
    window.open(mailtoLink, "_blank");
  };

  const handleLikeToggle = (id) => {
    setLikedRecommendations((prev) => {
      const updatedLikes = new Set(prev);
      if (updatedLikes.has(id)) {
        updatedLikes.delete(id);
      } else {
        updatedLikes.add(id);
      }
      return updatedLikes;
    });
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "",
        accessor: "like",
        Cell: ({ row }) => (
          <Tooltip
            content={
              likedRecommendations.has(row.original.id) ? "Unlike" : "Like"
            }
          >
            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleLikeToggle(row.original.id)}
              className="text-xl focus:outline-none"
              style={{ color: "red" }}
            >
              {likedRecommendations.has(row.original.id) ? (
                <FaHeart />
              ) : (
                <FaRegHeart />
              )}
            </motion.button>
          </Tooltip>
        ),
        disableFilters: true,
      },
      {
        Header: "Community Name",
        accessor: "name",
      },
      {
        Header: "Community Description",
        accessor: "description",
      },
      {
        Header: "Category",
        accessor: "category",
      },
      {
        Header: "Email",
        accessor: "userEmail",
        Cell: ({ value, row }) => (
          <div className="flex items-center space-x-2">
            <Tooltip content="Send Email">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() =>
                  handleEmailClick(
                    value,
                    row.original.name,
                    row.original.description,
                    row.original.category
                  )
                }
                className="text-blue-500"
              >
                <FaEnvelope style={{ color: "#bcd727" }} />
              </motion.button>
            </Tooltip>
            <span className="text-gray-700">{value}</span>
          </div>
        ),
      },
      {
        accessor: "action",
        Cell: ({ row }) => (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleAddClick(row.original)}
            className="text-green-500"
          >
            <FaPlus style={{ color: "#bcd727" }} />
          </motion.button>
        ),
        disableFilters: true,
      },
    ],
    [likedRecommendations]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data: recommendations,
    });

  const chartData = React.useMemo(() => {
    const categoryCount = recommendations.reduce((acc, rec) => {
      acc[rec.category] = (acc[rec.category] || 0) + 1;
      return acc;
    }, {});

    // Define an array of colors for the bars
    const colors = [
      "#8884d8",
      "#82ca9d",
      "#ffc658",
      "#ff7300",
      "#0088FE",
      "#00C49F",
      "#FFBB28",
      "#FF8042",
    ];

    return Object.entries(categoryCount).map(([category, count], index) => ({
      category,
      count,
      color: colors[index % colors.length],
    }));
  }, [recommendations]);

  const CustomTooltip = ({ payload, label }) => {
    if (payload && payload.length) {
      const { category, color } = payload[0].payload;
      return (
        <div className="bg-white border border-gray-300 rounded-lg p-2">
          <p className="text-gray-900 font-semibold">{category}</p>
          <p className="text-gray-600">{`Count: ${payload[0].value}`}</p>
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: color }}
          ></div>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <Header />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto p-8 bg-gray-50 rounded-lg shadow-xl shadow-gray-700"
      >
        <h1 className="text-4xl font-extrabold mb-6 text-center text-gray-500">
          Community Recommendations
        </h1>

        {/* Tabs for view selection */}
        <div className="flex justify-center mb-4">
          <div className="flex border-b border-gray-200">
            <div
              onClick={() => setViewMode("table")}
              className={`cursor-pointer px-4 py-2 text-center ${
                viewMode === "table"
                  ? "border-b-2 border-[#bcd727] text-[#bcd727] font-semibold"
                  : "text-gray-600"
              }`}
            >
              Table View
            </div>
            <div
              onClick={() => setViewMode("chart")}
              className={`cursor-pointer px-4 py-2 text-center ${
                viewMode === "chart"
                  ? "border-b-2 border-[#bcd727] text-[#bcd727] font-semibold"
                  : "text-gray-600"
              }`}
            >
              Chart View
            </div>
          </div>
        </div>

        {/* Create Community Popup */}
        {isPopupOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-md z-50">
            <div
              ref={popupRef}
              className="fixed top-0 left-1/2 transform -translate-x-1/2 bg-white p-8 rounded-md shadow-xl z-50 w-11/12 sm:w-3/4 lg:w-2/3 xl:w-1/2"
              style={{ marginTop: "50px" }} // Adjust this value for spacing from the top
            >
              <h1 className="text-xl font-bold text-gray-700 tracking-wide mb-4">
                Create a new community
              </h1>
              <form className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-m text-gray-700 text-left font-semibold"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="category"
                    className="block text-m text-gray-700 text-left font-semibold"
                  >
                    Category
                  </label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    required
                  >
                    <option value="Fitness & Wellness">
                      Fitness & Wellness
                    </option>
                    <option value="Food & Drinks">Food & Drinks</option>
                    <option value="Arts & Culture">Arts & Culture</option>
                    <option value="Tech & Gaming">Tech & Gaming</option>
                    <option value="Social & Networking">
                      Social & Networking
                    </option>
                    <option value="Hobbies & Interests">
                      Hobbies & Interests
                    </option>
                    <option value="Travel & Adventure">
                      Travel & Adventure
                    </option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="description"
                    className="block text-m text-gray-700 text-left font-semibold"
                  >
                    Community Description
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1 p-2 h-40 border border-gray-300 rounded-md w-full"
                    required
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <label
                    htmlFor="image"
                    className="block text-m text-gray-700 font-semibold"
                  >
                    Community Profile Image
                  </label>
                  <input
                    type="file"
                    id="image"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    className="hidden"
                    accept="image/*"
                  />
                  <button
                    type="button"
                    onClick={handleUploadButtonClick}
                    className="p-2 bg-openbox-green hover:bg-hover-obgreen text-white rounded-md"
                  >
                    Choose Image
                  </button>
                  {image && (
                    <p className="mt-2 text-gray-600">Uploaded: {image.name}</p>
                  )}
                </div>

                <label className="block text-m text-gray-700 font-semibold">
                  Select Community Interests
                </label>
                <InterestSelection
                  max={3}
                  setSelectedInterests={setSelectedInterests}
                  selectedInterests={selectedInterests}
                />

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={(e) => handleFormSubmit(e, "active")}
                    className="btn bg-openbox-green hover:bg-hover-obgreen text-white font-medium rounded-lg text-sm px-5 py-2.5 mr-4 focus:outline-none focus:ring-2 focus:ring-primary-300"
                  >
                    Create
                  </button>
                  <button
                    onClick={() => setPopupOpen(false)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                  >
                    <CloseIcon />
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#bcd727]"></div>
          </div>
        ) : viewMode === "table" ? (
          <div className="overflow-x-auto">
            <table
              {...getTableProps()}
              className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-lg"
            >
              <thead>
                {headerGroups.map((headerGroup) => (
                  <tr
                    {...headerGroup.getHeaderGroupProps()}
                    className="bg-gray-300 text-gray-700"
                  >
                    {headerGroup.headers.map((column) => (
                      <th
                        {...column.getHeaderProps()}
                        className="p-4 text-left font-semibold"
                      >
                        {column.render("Header")}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>

              <tbody {...getTableBodyProps()}>
                <AnimatePresence>
                  {rows.map((row) => {
                    prepareRow(row);
                    return (
                      <motion.tr
                        {...row.getRowProps()}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-b hover:bg-gray-50 transition-colors"
                      >
                        {row.cells.map((cell) => (
                          <td {...cell.getCellProps()} className="p-4">
                            {cell.render("Cell")}
                          </td>
                        ))}
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <RechartsTooltip content={<CustomTooltip />} />
                  {/* Legend component removed */}
                  <Bar dataKey="count" name="Count">
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ResponsiveContainer>
          </div>
        )}
      </motion.div>
    </>
  );
}

// export default RecommendationsTable;
