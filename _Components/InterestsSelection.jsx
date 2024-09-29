import React, { useState } from "react";

const InterestSelection = () => {
  // Example interest list
  const interests = [
    "Politics",
    "Free Diving",
    "Aquarium",
    "Jiu-jitsu",
    "Volunteering",
    "Festivals",
    "Marvel",
    "Gardening",
    "Football",
    "BBQ",
  ];

  const [selectedInterests, setSelectedInterests] = useState([]);

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
            key={interest}
            onClick={() => toggleInterest(interest)}
            className={`px-4 py-2 rounded-full border ${
              selectedInterests.includes(interest)
                ? "bg-pink-500 text-white border-pink-500"
                : "bg-gray-100 text-gray-800 border-gray-300"
            } hover:bg-pink-100 transition`}
          >
            {interest}
          </button>
        ))}
      </div>
      <div className="mt-4">
        <button
          className={`mt-4 px-6 py-2 bg-gradient-to-r from-pink-500 to-orange-400 text-white rounded-full disabled:opacity-50`}
          disabled={selectedInterests.length !== 5}
        >
          Continue ({selectedInterests.length}/5)
        </button>
      </div>
    </div>
  );
};

export default InterestSelection;
