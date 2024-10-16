import React, { useState } from "react";

const InterestSelection = ({
  max,
  selectedInterests,
  setSelectedInterests,
}) => {
  // Example interest list
  // const interests = [
  //   "Politics",
  //   "Free Diving",
  //   "Aquarium",
  //   "Jiu-jitsu",
  //   "Volunteering",
  //   "Festivals",
  //   "Marvel",
  //   "Gardening",
  //   "Football",
  //   "BBQ",
  // ];

  const interests = [
    { interest: "Running", category: "Sports" },
    { interest: "Yoga", category: "Sports" },
    { interest: "Team Sports", category: "Sports" },
    { interest: "Strength Training", category: "Sports" },
    { interest: "Outdoor Adventure", category: "Sports" },

    { interest: "Movies and TV", category: "General" },
    { interest: "Reading", category: "General" },
    { interest: "Music", category: "General" },
    { interest: "Cooking", category: "General" },
    { interest: "Board Games", category: "General" },

    { interest: "Team-Building Activities", category: "Social" },
    { interest: "Workshops", category: "Social" },
    { interest: "Outdoor Activities", category: "Social" },
    { interest: "Cultural Experiences", category: "Social" },
    { interest: "Relaxation Sessions", category: "Social" },

    { interest: "Networking", category: "Development" },
    {
      interest: "Workshops and Seminars",
      category: "Development",
    },
    { interest: "Public Speaking", category: "Development" },
    { interest: "Leadership Training", category: "Development" },
    { interest: "Mentorship", category: "Development" },
  ];

  const new_interests = [
    "Sports",
    "Outdoor Activities",
    "Foodie",
    "Language",
    "Drinking",
    "Workout",
    "Gaming",
    "Cooking",
    "Professional Growth",
    "Strength Training",
    "Movies & TV",
    "Reading",
    "Painting",
    "Coding",
    "Board Games",
    "Team Building",
    "Workshops & Seminar",
    "Cultural Experiences",
    "Public Speaking",
    "Leadership",
    "Endurance Training",
    "Active Lifestyle",
    "Baking",
  ];

  // Function to toggle selection of interest
  const toggleInterest = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      if (selectedInterests.length < max) {
        setSelectedInterests([...selectedInterests, interest]);
      }
    }
  };

  return (
    <div className="p-4 ">
      <div className="flex flex-wrap gap-2">
        {new_interests.map((interest) => (
          <button
            key={interest}
            onClick={(e) => {
              e.preventDefault();
              toggleInterest(interest);
            }}
            className={`px-4 py-2 rounded-full border ${
              selectedInterests.includes(interest)
                ? "bg-openbox-green text-white border-white"
                : "bg-gray-100 text-gray-800 border-gray-300 hover:bg-green-100"
            }  transition`}
          >
            {interest}
          </button>
        ))}
      </div>
      <div className="mt-4">
        <button
          className={`mt-4 px-6 py-2 bg-gradient-to-r from-openbox-green to-green-900 text-white rounded-full disabled:opacity-50`}
          disabled={selectedInterests.length !== max}
        >
          Continue ({selectedInterests.length}/{max})
        </button>
      </div>
    </div>
  );
};

export default InterestSelection;
