"use client";

import React, { useEffect, useState } from "react";
import RecommendationDB from "@/database/community/recommendation"; // Import your DB module
import Header from "../_Components/header"; // Import the Header component
import { FaHeart, FaRegHeart } from "react-icons/fa"; // Import heart icons

const mutedLimeGreen = "#d0e43f"; // Muted version of #bcd727

const RecommendationsTable: React.FC = () => {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [likedRecommendations, setLikedRecommendations] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const allRecommendations =
          await RecommendationDB.getAllRecommendations();
        setRecommendations(allRecommendations);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      }
    };

    fetchRecommendations();
  }, []);

  const handleEmailClick = (
    email: string,
    name: string,
    description: string
  ) => {
    const subject = encodeURIComponent(
      "OpenCommunity Community Recommendation"
    );
    const body = encodeURIComponent(
      `Hello,\n\nI am contacting you regarding your community recommendation.\n\n` +
        `Name: ${name}\n` +
        `Description: ${description}\n\n` +
        `Best regards,`
    );
    const mailtoLink = `mailto:${email}?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;
  };

  const handleLikeToggle = (id: string) => {
    setLikedRecommendations((prev) => {
      const updatedLikes = new Set(prev);
      if (updatedLikes.has(id)) {
        updatedLikes.delete(id); // Remove from likes if already liked
      } else {
        updatedLikes.add(id); // Add to likes if not liked
      }
      return updatedLikes;
    });
  };

  // Sort recommendations to show liked ones first
  const sortedRecommendations = [...recommendations].sort((a, b) => {
    return (
      (likedRecommendations.has(b.id) ? 1 : 0) -
      (likedRecommendations.has(a.id) ? 1 : 0)
    );
  });

  return (
    <>
      <Header /> {/* Render Header component */}
      <div className="max-w-6xl mx-auto p-8 bg-white-300 rounded-lg shadow-md">
        <h1 className="text-4xl font-extrabold mb-6 text-center text-gray-800">
          Community Recommendations
        </h1>

        <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="p-4 text-left w-12"></th>{" "}
              {/* Empty header for heart column */}
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Description</th>
              <th className="p-4 text-left">Email</th>
            </tr>
          </thead>
          <tbody>
            {sortedRecommendations.map((rec) => (
              <tr
                key={rec.id}
                className="border-b hover:bg-gray-50 transition-colors"
              >
                <td className="p-4 text-center">
                  <button
                    onClick={() => handleLikeToggle(rec.id)}
                    className="text-xl hover:text-yellow-600 transition-colors"
                  >
                    {likedRecommendations.has(rec.id) ? (
                      <FaHeart style={{ color: mutedLimeGreen }} />
                    ) : (
                      <FaRegHeart style={{ color: mutedLimeGreen }} />
                    )}
                  </button>
                </td>
                <td className="p-4 text-gray-800">{rec.name}</td>
                <td className="p-4 text-gray-600">{rec.description}</td>
                <td className="p-4">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleEmailClick(
                        rec.userEmail,
                        rec.name,
                        rec.description
                      );
                    }}
                    className="text-blue-600 hover:underline transition-colors"
                  >
                    {rec.userEmail}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default RecommendationsTable;
