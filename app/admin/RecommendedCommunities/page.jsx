"use client";
import React, { useEffect, useState } from "react";
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
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";
import Header from "../../../_Components/header";
import { useTable } from "react-table";
import Swal from "sweetalert2"; // Import SweetAlert2
import { motion } from "framer-motion";
import { FaHeart, FaRegHeart, FaEnvelope, FaPlus } from "react-icons/fa"; // Import the Plus icon
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";

const mutedLimeGreen = "#d0e43f"; // Muted version of #bcd727

export default function RecommendationsTable() {
  const [recommendations, setRecommendations] = useState([]);
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'chart'
  const [isLoading, setIsLoading] = useState(false);
  const [likedRecommendations, setLikedRecommendations] = useState(new Set());
  const [dialogOpen, setDialogOpen] = useState(false); // State for dialog
  const [selectedRecommendation, setSelectedRecommendation] = useState(null); // State for selected recommendation
  const [communityName, setCommunityName] = useState("");
  const [communityDescription, setCommunityDescription] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null); // State for image

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

  const handleDialogOpen = (recommendation) => {
    setSelectedRecommendation(recommendation);
    setCommunityName(recommendation.name);
    setCommunityDescription(recommendation.description);
    setCategory(recommendation.category);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setCommunityName("");
    setCommunityDescription("");
    setCategory("");
    setImage(null);
  };

  const handleImageUpload = (event) => {
    setImage(event.target.files[0]);
  };

  const handleCreateCommunity = async () => {
    // Implement your community creation logic here
    const communityData = {
      name: communityName,
      description: communityDescription,
      category,
      image, // You might need to handle image upload to your storage here
    };

    try {
      await CommunityDB.createCommunity(communityData); // Call your createCommunity method
      Swal.fire("Success", "Community created successfully!", "success");
      handleDialogClose(); // Close the dialog after creation
    } catch (error) {
      console.error("Error creating community:", error);
      Swal.fire(
        "Error",
        "Failed to create community. Please try again.",
        "error"
      );
    }
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "",
        accessor: "like",
        Cell: ({ row }) => (
          <Tooltip
            title={
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
            <Tooltip title="Send Email">
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
        Header: "Action",
        accessor: "action",
        Cell: ({ row }) => (
          <Tooltip title="Create Community">
            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleDialogOpen(row.original)}
              className="text-xl focus:outline-none"
              style={{ color: "#bcd727" }}
            >
              <FaPlus />
            </motion.button>
          </Tooltip>
        ),
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

        {isLoading ? (
          <CircularProgress />
        ) : viewMode === "table" ? (
          <div className="overflow-auto">
            <table {...getTableProps()} className="min-w-full bg-white border">
              <thead className="bg-gray-100">
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th
                        {...column.getHeaderProps()}
                        className="border px-4 py-2 text-left"
                      >
                        {column.render("Header")}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {rows.map((row) => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()} className="hover:bg-gray-50">
                      {row.cells.map((cell) => (
                        <td
                          {...cell.getCellProps()}
                          className="border px-4 py-2"
                        >
                          {cell.render("Cell")}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex justify-center">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <RechartsTooltip />
                <Bar dataKey="count" fill="#bcd727" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </motion.div>

      {/* Dialog for creating community */}
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Create Community</DialogTitle>
        <div className="p-4">
          <TextField
            label="Community Name"
            value={communityName}
            onChange={(e) => setCommunityName(e.target.value)}
            fullWidth
            required
            className="mb-2"
          />
          <TextField
            label="Description"
            value={communityDescription}
            onChange={(e) => setCommunityDescription(e.target.value)}
            fullWidth
            multiline
            rows={4}
            required
            className="mb-2"
          />
          <TextField
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            select
            fullWidth
            required
            className="mb-2"
          >
            <MenuItem value="general">general</MenuItem>
            <MenuItem value="Social">Social</MenuItem>
            <MenuItem value="Sports">Sports</MenuItem>
            <MenuItem value="Development">Development</MenuItem>
          </TextField>
          <TextField
            type="file"
            onChange={handleImageUpload}
            fullWidth
            required
            className="mb-2"
            inputProps={{ accept: "image/*" }} // Allow only image uploads
          />
        </div>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleCreateCommunity} color="primary">
            Create Community
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
