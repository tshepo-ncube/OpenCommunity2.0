"use client";
import React, { useState } from "react";

const NavigationTabs = () => {
  const [activeTab, setActiveTab] = useState("My Communities");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    console.log(tab);
  };

  return (
    <div className="flex justify-center">
      <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
        <ul className="flex flex-wrap -mb-px">
          <li className="me-2">
            <a
              href="#"
              onClick={() => handleTabClick("My Communities")}
              className={`inline-block p-4 border-b-2 rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 ${
                activeTab === "My Communities"
                  ? "text-openbox-green border-openbox-green dark:text-openbox-green dark:border-openbox-green"
                  : "border-transparent"
              }`}
            >
              My Communities
            </a>
          </li>
          <li className="me-2">
            <a
              href="#"
              onClick={() => handleTabClick("Discover Communities")}
              className={`inline-block p-4 border-b-2 rounded-t-lg ${
                activeTab === "Discover Communities"
                  ? "text-openbox-green border-openbox-green dark:text-openbox-green dark:border-openbox-green"
                  : "hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 border-transparent"
              }`}
            >
              Discover Communities
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default NavigationTabs;
