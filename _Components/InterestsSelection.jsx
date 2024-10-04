import React, { useState } from "react";

const InterestSelection = ({ selectedInterests, setSelectedInterests }) => {
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
    { interest: "Running", category: "Sports/Fitness" },
    { interest: "Yoga", category: "Sports/Fitness" },
    { interest: "Team Sports", category: "Sports/Fitness" },
    { interest: "Strength Training", category: "Sports/Fitness" },
    { interest: "Outdoor Adventure", category: "Sports/Fitness" },

    { interest: "Movies and TV", category: "General" },
    { interest: "Reading", category: "General" },
    { interest: "Music", category: "General" },
    { interest: "Cooking", category: "General" },
    { interest: "Board Games", category: "General" },

    { interest: "Team-Building Activities", category: "Company Retreat" },
    { interest: "Workshops", category: "Company Retreat" },
    { interest: "Outdoor Activities", category: "Company Retreat" },
    { interest: "Cultural Experiences", category: "Company Retreat" },
    { interest: "Relaxation Sessions", category: "Company Retreat" },

    { interest: "Networking", category: "Professional Development" },
    {
      interest: "Workshops and Seminars",
      category: "Professional Development",
    },
    { interest: "Public Speaking", category: "Professional Development" },
    { interest: "Leadership Training", category: "Professional Development" },
    { interest: "Mentorship", category: "Professional Development" },
  ];

  // Function to toggle selection of interest
  const toggleInterest = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      if (selectedInterests.length < 5) {
        setSelectedInterests([...selectedInterests, interest]);
      }
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Select your Interests</h2>
      <div className="flex flex-wrap gap-2">
        {interests.map((interest) => (
          <button
            key={interest.interest}
            onClick={() => toggleInterest(interest.interest)}
            className={`px-4 py-2 rounded-full border ${
              selectedInterests.includes(interest.interest)
                ? "bg-openbox-green text-white border-white"
                : "bg-gray-100 text-gray-800 border-gray-300 hover:bg-green-100"
            }  transition`}
          >
            {interest.interest}
          </button>
        ))}
      </div>
      <div className="mt-4">
        <button
          className={`mt-4 px-6 py-2 bg-gradient-to-r from-openbox-green to-green-900 text-white rounded-full disabled:opacity-50`}
          disabled={selectedInterests.length !== 5}
        >
          Continue ({selectedInterests.length}/5)
        </button>
      </div>
    </div>
  );
};

export default InterestSelection;
