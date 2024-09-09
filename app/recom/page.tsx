"use client";
import React, { useEffect, useState } from "react";
import RecommendationDB from "@/database/community/recommendation"; // Import your DB module
import CommunityDB from "@/database/community/community"; // Import CommunityDB
import Header from "../_Components/header"; // Import the Header component
import { FaHeart, FaRegHeart, FaPlus } from "react-icons/fa"; // Import heart and plus icons
import Swal from "sweetalert2"; // Import SweetAlert2

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
    description: string,
    category: string
  ) => {
    const subject = encodeURIComponent(
      "OpenCommunity Community Recommendation"
    );
    const body = encodeURIComponent(
      `Hello,\n\nI am contacting you regarding your community recommendation.\n\n` +
        `Name: ${name}\n` +
        `Description: ${description}\n` +
        `Category: ${category}\n\n` +
        `Best regards,`
    );
    const mailtoLink = `mailto:${email}?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;
  };

  const handleLikeToggle = (id: string) => {
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

  const handleAddClick = async (rec: any) => {
    // Define the available categories
    const categories = ["General", "Sport", "Social", "Development"];

    // Show SweetAlert2 popup with pre-filled data
    const { value: formValues } = await Swal.fire({
      title: "Create Community",
      html: `
        <div>
          <label>Name</label>
          <input id="name" class="swal2-input" value="${rec.name}" />
        </div>
        <div>
          <label>Description</label>
          <textarea id="description" class="swal2-textarea">${
            rec.description
          }</textarea>
        </div>
        <div>
          <label>Category</label>
          <select id="category" class="swal2-select">
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
      `,
      showCloseButton: true, // Show the close button ("X")
      showCancelButton: true, // Show the cancel button
      confirmButtonText: "Create Community", // Text for the primary action button
      cancelButtonText: "Save Draft", // Text for the secondary action button
      focusConfirm: false,
      preConfirm: () => {
        return {
          name: (document.getElementById("name") as HTMLInputElement).value,
          description: (
            document.getElementById("description") as HTMLTextAreaElement
          ).value,
          category: (document.getElementById("category") as HTMLSelectElement)
            .value,
        };
      },
    });

    if (formValues) {
      // Create Community logic
      try {
        await CommunityDB.createCommunity(
          formValues,
          () => {},
          () => {}
        );
        await RecommendationDB.deleteRecommendation(rec.id); // Assuming you have a deleteRecommendation method
        // Update recommendations list
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

  // Sort recommendations to show liked ones first
  const sortedRecommendations = [...recommendations].sort((a, b) => {
    return (
      (likedRecommendations.has(b.id) ? 1 : 0) -
      (likedRecommendations.has(a.id) ? 1 : 0)
    );
  });

  return (
    <>
      <Header />
      <div className="max-w-6xl mx-auto p-8 bg-white-300 rounded-lg shadow-md">
        <h1 className="text-4xl font-extrabold mb-6 text-center text-gray-800">
          Community Recommendations
        </h1>

        <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="p-4 text-left w-12"></th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Description</th>
              <th className="p-4 text-left">Category</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left w-12"></th>
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
                <td className="p-4 text-gray-600">{rec.category}</td>
                <td className="p-4">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleEmailClick(
                        rec.userEmail,
                        rec.name,
                        rec.description,
                        rec.category
                      );
                    }}
                    className="text-blue-600 hover:underline transition-colors"
                  >
                    {rec.userEmail}
                  </a>
                </td>
                <td className="p-4 text-center">
                  <button
                    onClick={() => handleAddClick(rec)}
                    className="text-xl hover:text-green-600 transition-colors"
                  >
                    <FaPlus style={{ color: mutedLimeGreen }} />
                  </button>
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
