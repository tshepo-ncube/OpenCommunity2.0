"use client";
import React, { useState } from "react";
import Header from "../_Components/header";
import { toast, Toaster } from "react-hot-toast";
import RecommendationDB from "@/database/community/recommendation";

const CommunityRecommendationPage: React.FC = () => {
  const [communityName, setCommunityName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [category, setCategory] = useState<string>("General"); // Default category value

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const userEmail = localStorage.getItem("Email"); // Get the logged-in user's email

      if (!userEmail) {
        throw new Error("User email not found. Please log in.");
      }

      // Save the recommendation to the database, passing the category
      await RecommendationDB.createRecommendation(
        communityName,
        description,
        { userEmail, category } // Include the category
      );

      // Clear form inputs after successful submission
      setCommunityName("");
      setDescription("");
      setCategory("General"); // Reset the category to the default value

      // Show success message in a snack bar
      toast.success("Your community recommendation has been submitted!");
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
            border: "1px solid #bcd727",
            padding: "16px",
            color: "black",
          },
        }}
      />
      <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-4">Community Recommendation</h1>
        <p className="text-lg mb-8">
          Recommend a new community group by filling out the form below:
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="text-left">
            <label
              htmlFor="communityName"
              className="block text-lg font-medium mb-2"
            >
              Suggested Community Name:
            </label>
            <input
              type="text"
              id="communityName"
              value={communityName}
              onChange={(e) => setCommunityName(e.target.value)}
              placeholder="Enter community name"
              required
              className="w-full p-3 text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-black-500"
            />
          </div>
          <div className="text-left">
            <label
              htmlFor="description"
              className="block text-lg font-medium mb-2"
            >
              Community Description:
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter community description"
              required
              className="w-full p-3 text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
            />
          </div>
          <div className="text-left">
            <label
              htmlFor="category"
              className="block text-lg font-medium mb-2"
            >
              Category:
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="General">General</option>
              <option value="Sport">Sports</option>
              <option value="Sport">Social</option>
              <option value="Development">Development</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-[#bcd727] text-white py-3 px-6 text-lg rounded-lg shadow-none hover:shadow-lg transition-shadow"
          >
            Submit Recommendation
          </button>
        </form>
      </div>
    </>
  );
};

export default CommunityRecommendationPage;
