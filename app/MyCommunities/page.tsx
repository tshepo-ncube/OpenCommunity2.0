//This is the administrator page to create a community
//Instead of importing Header and Sidebar, they should rather be placed in the layout folder
"use client";
import React from "react";
import { useState } from "react";

const CreateCommunity = () => {
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submittedData, setSubmittedData] = useState<
    { name: string; description: string }[]
  >([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const handleOpenPopup = () => {
    setPopupOpen(true);
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted:", { name, description });
    setSubmittedData([...submittedData, { name, description }]);
    setName("");
    setDescription("");
    setPopupOpen(false);
  };

  //There needs to be a function to save the community and it's details onto the firebase
  //When storing information about the community, the name of the administrator needs to be stored as well?

  //This function edits the saved community
  //At the moment - this creates another community
  const handleEdit = (index: number) => {
    setName(submittedData[index].name);
    setDescription(submittedData[index].description);
    setEditIndex(index);
    setPopupOpen(true);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="flex flex-wrap">
        {submittedData.map((data, index) => (
          <div
            key={index}
            className="mb-4 bg-gray-100 p-4 rounded-lg text-center w-64"
          >
            <p className="font-bold">Community {index + 1}:</p>
            <p>Name: {data.name}</p>
            <p>Description: {data.description}</p>
            <button
              onClick={() => handleEdit(index)}
              className="btn bg-green-500 hover:bg-green-700 text-white font-medium rounded-lg text-sm px-5 py-2.5 mr-4 focus:outline-none focus:ring-2 focus:ring-primary-300"
            >
              Edit
            </button>
            {/* Have a post button, takes them to the actual community */}
          </div>
        ))}
      </div>
      <div className="mb-4">
        <button
          onClick={handleOpenPopup}
          className="btn bg-green-500 hover:bg-green-700 text-white font-medium rounded-lg text-sm px-5 py-2.5 mr-4 focus:outline-none focus:ring-2 focus:ring-primary-300"
        >
          Create a Community
        </button>
      </div>
      {isPopupOpen && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-md shadow-md z-50">
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                required
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Community Description
              </label>
              <input
                type="text"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                required
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="btn bg-green-500 hover:bg-green-700 text-white font-medium rounded-lg text-sm px-5 py-2.5 mr-4 focus:outline-none focus:ring-2 focus:ring-primary-300"
              >
                {editIndex !== null ? "Save" : "Submit"}
                {/*Make sure that I don't create a new object when editing/}
            {/* Pass existing object to edit */}
                {/* Attribute of community that indicates state (draft or not) */}
                {/* Edit local copy and update DB*******/}
                {/* Save the draft in cookies? Google Forms works in a similar manner?**/}
              </button>
              <button
                onClick={handleClosePopup}
                className="ml-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Close
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default CreateCommunity;
