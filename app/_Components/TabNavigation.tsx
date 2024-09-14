import { useState } from "react";

const Tabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"events" | "polls">("events");

  return (
    <div className="w-full mt-8">
      <div className="flex justify-center mb-6 space-x-10">
        {/* Tab Buttons */}
        <button
          className={`px-6 py-2 text-lg ${
            activeTab === "events"
              ? "border-b-4 border-[#bcd727] text-gray-900 font-semibold"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("events")}
        >
          EVENTS
        </button>
        <button
          className={`px-6 py-2 text-lg ${
            activeTab === "polls"
              ? "border-b-4 border-[#bcd727] text-gray-900 font-semibold"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("polls")}
        >
          POLLS
        </button>
      </div>

      {/* Tab Content */}
        <div className="text-center">
            {activeTab === "events" && (
            <div>
                <h3 className="text-2xl font-semibold">Upcoming Events</h3>
                {/* Your events content goes here */}

            </div>
            )} 
        </div>
        
        <div className="text-center">
        {activeTab === "polls" && (
          <div>
            <h3 className="text-2xl font-semibold">Polls</h3>
            {/* Your polls content goes here */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tabs;


