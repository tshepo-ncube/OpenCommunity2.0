"use client";
import React, { useState, useEffect } from "react";
import Header from "../_Components/header";
import { toast, Toaster } from "react-hot-toast";
import RecommendationDB from "@/database/community/recommendation";
import { motion } from "framer-motion"; // For smooth animations
import Confetti from "react-confetti"; // Import react-confetti

const CommunityRecommendationPage: React.FC = () => {
  const [communityName, setCommunityName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [category, setCategory] = useState<string>("general");
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  // Set window size on mount
  useEffect(() => {
    const updateWindowSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Initialize size on mount
    updateWindowSize();

    // Add event listener to update size on window resize
    window.addEventListener("resize", updateWindowSize);

    // Clean up listener on component unmount
    return () => window.removeEventListener("resize", updateWindowSize);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const userEmail = localStorage.getItem("Email");
      if (!userEmail) {
        throw new Error("User email not found. Please log in.");
      }

      await RecommendationDB.createRecommendation(communityName, description, {
        userEmail,
        category,
      });

      setCommunityName("");
      setDescription("");
      setCategory("general");

      toast.success("Your community recommendation has been submitted!");
      setShowConfetti(true);

      // Stop confetti after 5 seconds
      setTimeout(() => setShowConfetti(false), 5000);
    } catch (error) {
      console.error("Error submitting recommendation:", error);
      toast.error("Failed to submit recommendation. Please try again.");
    }
  };

  return (
    <>
      <Header />
      <Toaster
        position="bottom-right"
        reverseOrder={false}
        toastOptions={{
          style: {
            border: "1px solid #4CAF50",
            padding: "16px",
            color: "#333",
          },
        }}
      />
      {/* Confetti animation */}
      {showConfetti && (
        <Confetti width={windowSize.width} height={windowSize.height} />
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-xl mt-4"
      >
        <div className="banner-header">
          <h1 className="text-3xl font-bold text-center text-gray-800">
            Recommend a Community
          </h1>
        </div>
        <p className="text-center text-gray-600 text-md mb-4">
          Suggest a new community group by filling out the form below:
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileFocus={{ scale: 1.02 }}
            className="text-left"
          >
            <label
              htmlFor="communityName"
              className="block text-md font-semibold text-gray-700 mb-1"
            >
              Community Name:
            </label>
            <input
              type="text"
              id="communityName"
              value={communityName}
              onChange={(e) => setCommunityName(e.target.value)}
              placeholder="Enter community name"
              required
              className="w-full p-3 text-md border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
            />
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileFocus={{ scale: 1.02 }}
            className="text-left"
          >
            <label
              htmlFor="description"
              className="block text-md font-semibold text-gray-700 mb-1"
            >
              Community Description:
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter community description"
              required
              className="w-full p-3 text-md border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 min-h-[120px] transition-all duration-300"
            />
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileFocus={{ scale: 1.02 }}
            className="text-left"
          >
            <label
              htmlFor="category"
              className="block text-md font-semibold text-gray-700 mb-1"
            >
              Category:
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 text-md border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
            >
              <option value="general">General</option>
              <option value="Sports">Sports</option>
              <option value="Social">Social</option>
              <option value="Development">Development</option>
            </select>
          </motion.div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="bg-[#bcd727] text-white py-2 px-4 text-md rounded-lg shadow-lg transition-shadow hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-[#a0b920]"
            type="submit"
          >
            Submit Recommendation
          </motion.button>
        </form>
      </motion.div>

      <style jsx>{`
        .banner-header {
          background-color: #f0f0f0; /* Light grey background */
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 15px;
        }
      `}</style>
    </>
  );
};

export default CommunityRecommendationPage;
