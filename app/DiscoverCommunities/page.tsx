"use client";
import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../_Components/sidebar";
import Header from "../_Components/header";
import CommunityDB from "@/database/community/community";
import AdminCommunity from "../_Components/AdminCommunities";
import CloseIcon from "@mui/icons-material/Close";

const CreateCommunity = () => {
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [isUserPopupOpen, setUserPopupOpen] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [submittedData, setSubmittedData] = useState<
    {
      id: string;
      name: string;
      description: string;
      category: string;
      status: string;
    }[]
  >([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [category, setCategory] = useState<string>("general");
  const [view, setView] = useState<string>("Communities");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const popupRef = useRef(null);
  const userPopupRef = useRef(null);

  const handleOpenPopup = () => {
    setPopupOpen(true);
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
  };

  const handleOpenUserPopup = () => {
    setUserPopupOpen(true);
  };

  const handleCloseUserPopup = () => {
    setUserPopupOpen(false);
  };

  const handleFormSubmit = (e: React.FormEvent, status: string) => {
    e.preventDefault();

    if (editIndex !== null) {
      // Update existing community
      CommunityDB.updateCommunity(
        {
          id: submittedData[editIndex].id,
          name,
          description,
          category,
          status,
        },
        setSubmittedData,
        setLoading
      );
    } else {
      // Create new community with specified status
      CommunityDB.createCommunity(
        { name, description, category, status },
        (newCommunity) => {
          setSubmittedData((prevData) => [...prevData, newCommunity]);
        },
        setLoading
      );
    }

    setName("");
    setDescription("");
    setCategory("general");
    setEditIndex(null);
    setPopupOpen(false);
  };

  const handleEdit = (index: number) => {
    setName(submittedData[index].name);
    setDescription(submittedData[index].description);
    setCategory(submittedData[index].category);
    setEditIndex(index);
    setPopupOpen(true);
  };

  useEffect(() => {
    CommunityDB.getAllCommunities((data) => {
      setSubmittedData(data);
      setLoading(false);
    }, setLoading);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setPopupOpen(false);
      }
      if (
        userPopupRef.current &&
        !userPopupRef.current.contains(event.target)
      ) {
        setUserPopupOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex-col items-center min-h-screen relative text-center">
      <Header />
      <div className="flex justify-center mt-8 mb-4">
        <span
          onClick={() => setView("Communities")}
          className={`cursor-pointer mx-4 text-lg ${
            view === "Communities" ? "font-bold text-black" : "text-gray-500"
          }`}
        >
          Community Management
        </span>
        <span
          onClick={() => setView("User Management")}
          className={`cursor-pointer mx-4 text-lg ${
            view === "User Management"
              ? "font-bold text-black"
              : "text-gray-500"
          }`}
        >
          User Management
        </span>
      </div>

      <div className="border-t border-openbox-green w-full my-4"></div>

      {view === "Communities" ? (
        <>
          <div className="flex justify-center mt-4 mb-8">
            <button
              onClick={handleOpenPopup}
              className="btn bg-openbox-green hover:bg-hover-obgreen text-white font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-300"
            >
              + CREATE COMMUNITY
            </button>
          </div>

          {isPopupOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-md z-10"></div>
          )}

          {isPopupOpen && (
            <div
              ref={popupRef}
              className="mt-16 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-md shadow-xl z-50 w-11/12 sm:w-3/4 lg:w-2/3 xl:w-1/2 h-3/4 sm:h-auto lg:h-auto"
            >
              <form className="space-y-4">
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
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Category
                  </label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    required
                  >
                    <option value="General">General</option>
                    <option value="Sports">Sports/Fitness</option>
                    <option value="Social">Social Activities</option>
                    <option value="Retreat">Company Retreat</option>
                    <option value="Development">
                      Professional Development
                    </option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Community Description
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    required
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={(e) => handleFormSubmit(e, "draft")}
                    className="btn bg-openbox-green hover:bg-hover-obgreen text-white font-medium rounded-lg text-sm px-5 py-2.5 mr-4 focus:outline-none focus:ring-2 focus:ring-primary-300"
                  >
                    Save as Draft
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleFormSubmit(e, "active")}
                    className="btn bg-openbox-green hover:bg-hover-obgreen text-white font-medium rounded-lg text-sm px-5 py-2.5 mr-4 focus:outline-none focus:ring-2 focus:ring-primary-300"
                  >
                    {editIndex !== null ? "Save" : "Create"}
                  </button>
                  <div className="flex justify-end">
                    <CloseIcon
                      className="absolute top-4 right-4 text-black-500 cursor-pointer"
                      onClick={handleClosePopup}
                    />
                  </div>
                </div>
              </form>
            </div>
          )}

          {submittedData.length === 0 ? (
            <div className="text-center">
              <p className="text-gray-900 text-lg">
                You have created no communities yet.
              </p>
              <p className="text-gray-900 text-lg">
                Click on <span className="font-bold">create community</span> to
                become an admin of your very first community
              </p>
            </div>
          ) : (
            <div>
              <AdminCommunity communities={submittedData} />
            </div>
          )}
        </>
      ) : (
        <div className="text-center mt-16">
          {/* Add User Button */}
          <div className="flex justify-end mt-4 mr-4">
            <button
              onClick={handleOpenUserPopup}
              className="btn bg-openbox-green hover:bg-hover-obgreen text-white font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-300"
            >
              + Add a User
            </button>
          </div>

          {isUserPopupOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-md z-10"></div>
          )}

          {isUserPopupOpen && (
            <div
              ref={userPopupRef}
              className="mt-16 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-md shadow-xl z-50 w-11/12 sm:w-3/4 lg:w-2/3 xl:w-1/2 h-auto"
            >
              <form className="space-y-4">
                <div>
                  <label
                    htmlFor="userName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="userName"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="userEmail"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="userEmail"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    required
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => console.log("User added")}
                    className="btn bg-openbox-green hover:bg-hover-obgreen text-white font-medium rounded-lg text-sm px-5 py-2.5 mr-4 focus:outline-none focus:ring-2 focus:ring-primary-300"
                  >
                    Add User
                  </button>
                  <div className="flex justify-end">
                    <CloseIcon
                      className="absolute top-4 right-4 text-black-500 cursor-pointer"
                      onClick={handleCloseUserPopup}
                    />
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CreateCommunity;
