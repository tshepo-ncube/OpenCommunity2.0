import React from 'react';

const CustomToolbar = ({ label, onNavigate }) => {
  return (
    <div className="flex items-center justify-between mb-4 px-4 relative">
      {/* Navigation buttons container */}
      <div className="flex items-center">
        {/* Back Button */}
        <button
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-all"
          onClick={() => onNavigate('PREV')}
        >
          Back
        </button>

        {/* Today Button */}
        <button
          className="bg-[#bcd727] text-white px-4 py-2 rounded-lg hover:bg-[#a8c31d] transition-all ml-2 active:bg-[#9bb51b] active:opacity-90"
          onClick={() => onNavigate('TODAY')}
        >
          Today
        </button>
      </div>

      {/* Month Title */}
      <span className="absolute left-1/2 transform -translate-x-1/2 text-2xl font-bold text-gray-700">
        {label}
      </span>

      {/* Next Button */}
      <button
        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-all"
        onClick={() => onNavigate('NEXT')}
      >
        Next
      </button>
    </div>
  );
};

export default CustomToolbar;
