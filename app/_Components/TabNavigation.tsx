const TabTitle: React.FC<{ title: string }> = ({ title }) => {
    return (
      <div className="flex items-center justify-center mt-8">
        <div className="text-center">
          {/* Horizontal line above the title */}
          <div className="w-16 h-1 mx-auto bg-gray-400 mb-4"></div>
  
          {/* Title with accent color */}
          <h2 className="text-3xl font-bold text-gray-800">
            {title}{" "}
            <span className="text-[#bcd727]">
              {title === "Upcoming" ? "Events" : "Polls"}
            </span>
          </h2>
  
          {/* Horizontal line below the title */}
          <div className="w-16 h-1 mx-auto bg-gray-400 mt-4"></div>
        </div>
      </div>
    );
  };
export default TabTitle;
  
  
  
  