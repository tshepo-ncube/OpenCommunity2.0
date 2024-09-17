"use client";
import React, { useEffect, useState } from "react";
import RecommendationDB from "@/database/community/recommendation";
import CommunityDB from "@/database/community/community";
import Header from "../_Components/header";
import { FaHeart, FaRegHeart, FaPlus, FaEnvelope } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useTable } from "react-table";
import Swal from "sweetalert2";
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

// Tooltip component
const Tooltip = ({ content, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute z-10 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm tooltip dark:bg-gray-700"
        >
          {content}
          <div className="tooltip-arrow" data-popper-arrow></div>
        </motion.div>
      )}
    </div>
  );
};

const RecommendationsTable = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [likedRecommendations, setLikedRecommendations] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'chart'

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

  const handleAddClick = async (rec) => {
    const categories = ["general", "Sports", "Social", "Development"];

    const { value: formValues } = await Swal.fire({
      title: "Create Community",
      html: `
        <div class="space-y-4">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">Community Name</label>
            <input id="name" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" value="${
              rec.name
            }" />
          </div>
          <div>
            <label for="description" class="block text-sm font-medium text-gray-700">Community Description</label>
            <textarea id="description" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">${
              rec.description
            }</textarea>
          </div>
          <div>
            <label for="category" class="block text-sm font-medium text-gray-700">Category</label>
            <select id="category" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
              ${categories
                .map(
                  (category) =>
                    `<option value="${category}" ${
                      category === rec.category ? "selected" : ""
                    }>${category}</option>`
                )
                .join("")}
            </select>
          </div>
        </div>
      `,
      showCloseButton: true,
      showCancelButton: true,
      confirmButtonText: "Create Community",
      cancelButtonText: "Cancel",
      focusConfirm: false,
      customClass: {
        container: "custom-swal-container",
        popup: "custom-swal-popup",
        header: "custom-swal-header",
        closeButton: "custom-swal-close",
        icon: "custom-swal-icon",
        image: "custom-swal-image",
        content: "custom-swal-content",
        input: "custom-swal-input",
        actions: "custom-swal-actions",
        confirmButton: "custom-swal-confirm",
        cancelButton: "custom-swal-cancel",
        footer: "custom-swal-footer",
      },
      didOpen: () => {
        // Apply custom styling after the popup is open
        const confirmButton = document.querySelector(".swal2-confirm");
        if (confirmButton) {
          confirmButton.style.backgroundColor = "#bcd727";
          confirmButton.style.borderColor = "#bcd727";
          confirmButton.style.color = "#ffffff"; // Ensuring text is readable
        }
      },
      preConfirm: () => ({
        name: document.getElementById("name").value,
        description: document.getElementById("description").value,
        category: document.getElementById("category").value,
      }),
    });

    if (formValues) {
      try {
        await CommunityDB.createCommunity(
          formValues,
          () => {},
          () => {}
        );
        await RecommendationDB.deleteRecommendation(rec.id);
        const updatedRecommendations =
          await RecommendationDB.getAllRecommendations();
        setRecommendations(updatedRecommendations);
        Swal.fire(
          "Success",
          "Community created and recommendation removed.",
          "success"
        );
      } catch (error) {
        console.error(
          "Error creating community or deleting recommendation:",
          error
        );
        Swal.fire(
          "Error",
          "There was an error creating the community or deleting the recommendation.",
          "error"
        );
      }
    }
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
};

export default RecommendationsTable;
