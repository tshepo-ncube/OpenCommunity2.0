"use client";
import React, { useState, useEffect, useRef } from "react";
import Header from "../../_Components/header";
import CommunityDB from "../../database/community/community";
import AdminCommunity from "../../_Components/AdminCommunities";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import strings from "../../Utils/strings.json";

const CreateCommunity = () => {
  const [activeTab, setActiveTab] = useState("tab1");
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [isUserPopupOpen, setUserPopupOpen] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [submittedData, setSubmittedData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [category, setCategory] = useState("general");
  const [view, setView] = useState("Communities");
  const [userName, setUserName] = useState("");
  const [userSurname, setUserSurname] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [roles, setRoles] = useState({ user: false, admin: false });
  const fileInputRef = useRef(null);
  const popupRef = useRef(null);
  const userPopupRef = useRef(null);
  const handleUploadButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const handleOpenPopup = () => setPopupOpen(true);
  const handleClosePopup = () => setPopupOpen(false);
  const [image, setImage] = useState(null);

  const handleImageUpload = (event) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
    }
  };
  const handleOpenUserPopup = () => setUserPopupOpen(true);
  const handleCloseUserPopup = () => setUserPopupOpen(false);

  const handleRoleChange = (e) => {
    const { name, checked } = e.target;
    setRoles((prevRoles) => ({ ...prevRoles, [name]: checked }));
  };

  const handleFormSubmit = async (e, status) => {
    e.preventDefault();

    const communityData = {
      name,
      description,
      category,
      status,
    };

    if (editIndex !== null) {
      CommunityDB.updateCommunity(
        { id: submittedData[editIndex].id, ...communityData },
        (updatedData) => {
          const updatedSubmittedData = [...submittedData];
          updatedSubmittedData[editIndex] = updatedData;
          setSubmittedData(updatedSubmittedData);
        },
        setLoading
      );
    } else {
      console.log("creating a channel now...");
      CommunityDB.createCommunity(
        communityData,
        (newCommunity) =>
          setSubmittedData((prevData) => [...prevData, newCommunity]),
        setLoading
      );

      try {
        CommunityDB.createCommunity(
          communityData,
          image,
          (newCommunity) => {
            setSubmittedData((prevData) => [...prevData, newCommunity]);
          },
          setLoading
        );
      } catch (err) {
        console.log("error");
      }
    }

    setName("");
    setDescription("");
    setCategory("general");
    setEditIndex(null);
    setPopupOpen(false);
  };

  const handleEdit = (index) => {
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
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setPopupOpen(false);
      }
      if (
        userPopupRef.current &&
        !userPopupRef.current.contains(event.target)
      ) {
        setUserPopupOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const generateDescription = async () => {
    console.log("generate Description");
    if (name.length !== 0) {
      try {
        const res = await axios.post(
          strings.server_endpoints.generateCommunityDescription,
          { name },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Returned Desctiption: ", res.communityDescription);
        console.log(res.data.communityDescription);
        setDescription(res.data.communityDescription);
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("Please enter a name.");
    }
  };

  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Image uploaded:", image);
  };

  return (
    <div className="flex-col items-center min-h-screen relative text-center">
      <Header />

      {/* Tab Navigation */}
      <div className="flex justify-center mt-4 mb-8">
        <button
          className={`px-4 py-2 mr-2 ${
            activeTab === "tab1"
              ? "bg-openbox-green text-white"
              : "bg-gray-200 text-gray-700"
          } rounded-t-lg`}
          onClick={() => setActiveTab("tab1")}
        >
          Tab 1
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === "tab2"
              ? "bg-openbox-green text-white"
              : "bg-gray-200 text-gray-700"
          } rounded-t-lg`}
          onClick={() => setActiveTab("tab2")}
        >
          Tab 2
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "tab1" ? (
        <>
          {view === "Communities" ? (
            <>
              {/* Floating Action Button */}
              <div className="fixed bottom-4 right-4 z-20">
                <button
                  onClick={handleOpenPopup}
                  className="btn bg-openbox-green hover:bg-hover-obgreen text-white font-medium rounded-full p-3 shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-300"
                >
                  + Create Community
                </button>
              </div>

              {isPopupOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-md z-10"></div>
              )}

              {isPopupOpen && (
                <div
                  ref={popupRef}
                  className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-md shadow-xl z-50 w-11/12 sm:w-3/4 lg:w-2/3 xl:w-1/2 h-auto max-h-full overflow-auto"
                >
                  <h1 className="text-xl font-bold  text-gray-700 tracking-wide mb-4">
                    Create a new community
                  </h1>
                  <form className="space-y-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-m text-gray-700 text-left font-semibold"
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
                        className="block text-m text-gray-700 text-left font-semibold"
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
                        className="block text-m text-gray-700 text-left font-semibold"
                      >
                        Community Description
                      </label>
                      <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="mt-1 p-2  h-40 border border-gray-300 rounded-md w-full"
                        required
                      />
                    </div>

                    <div className="flex items-center space-x-4">
                      <label
                        htmlFor="image"
                        className="block text-m text-gray-700 font-semibold"
                      >
                        Community Profile Image
                      </label>
                      <input
                        type="file"
                        id="image"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        className="hidden"
                        accept="image/*"
                      />
                      <button
                        type="button"
                        onClick={handleUploadButtonClick}
                        className="p-2 bg-openbox-green hover:bg-hover-obgreen text-white rounded-md"
                      >
                        Choose Image
                      </button>
                      {image && (
                        <p className="mt-2 text-gray-600">
                          Uploaded: {image.name}
                        </p>
                      )}
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={generateDescription}
                        className="btn bg-purple-400 hover:bg-hover-obgreen text-white font-medium rounded-lg text-sm px-5 py-2.5 mr-4 focus:outline-none focus:ring-2 focus:ring-primary-300"
                      >
                        generate description
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleFormSubmit(e, "draft")}
                        className="btn bg-gray-500 hover:bg-gray-700 btn text-white font-medium rounded-lg text-sm px-5 py-2.5 mr-4 focus:outline-none focus:ring-2 focus:ring-primary-300"
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
                      <CloseIcon
                        className="absolute top-4 right-4 text-black-500 cursor-pointer"
                        onClick={handleClosePopup}
                      />
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
                    Click on <span className="font-bold">create community</span>{" "}
                    to get started.
                  </p>
                </div>
              ) : (
                <AdminCommunity
                  submittedData={submittedData}
                  handleEdit={handleEdit}
                />
              )}
            </>
          ) : (
            <>
              <div className="flex justify-center mt-4 mb-8">
                <button
                  onClick={handleOpenUserPopup}
                  className="btn bg-openbox-green hover:bg-hover-obgreen text-white font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-300"
                >
                  + ADD A USER
                </button>
              </div>

              {isUserPopupOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-md z-10"></div>
              )}

              {isUserPopupOpen && (
                <div
                  ref={userPopupRef}
                  className="mt-16 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-md shadow-xl z-50 w-11/12 sm:w-3/4 lg:w-2/3 xl:w-1/2 h-3/4 sm:h-auto lg:h-auto"
                >
                  <form className="space-y-4">
                    <div>
                      <label
                        htmlFor="userName"
                        className="block text-sm font-medium text-gray-700"
                      >
                        First Name
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
                        htmlFor="userSurname"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="userSurname"
                        value={userSurname}
                        onChange={(e) => setUserSurname(e.target.value)}
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
                    <div>
                      <label
                        htmlFor="userPhone"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="userPhone"
                        value={userPhone}
                        onChange={(e) => setUserPhone(e.target.value)}
                        className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                        required
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="userRole"
                        name="user"
                        checked={roles.user}
                        onChange={handleRoleChange}
                        className="mr-2"
                      />
                      <label
                        htmlFor="userRole"
                        className="text-sm font-medium text-gray-700"
                      >
                        User
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="adminRole"
                        name="admin"
                        checked={roles.admin}
                        onChange={handleRoleChange}
                        className="mr-2"
                      />
                      <label
                        htmlFor="adminRole"
                        className="text-sm font-medium text-gray-700"
                      >
                        Admin
                      </label>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        onClick={handleCloseUserPopup}
                        className="btn bg-openbox-green hover:bg-hover-obgreen text-white font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-300"
                      >
                        Add User
                      </button>
                      <CloseIcon
                        className="absolute top-4 right-4 text-black-500 cursor-pointer"
                        onClick={handleCloseUserPopup}
                      />
                    </div>
                  </form>
                </div>
              )}
            </>
          )}
        </>
      ) : (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Tab 2 Content</h2>
          <p>
            This is the content for Tab 2. You can add your desired content
            here.
          </p>
        </div>
      )}
    </div>
  );
};

export default CreateCommunity;
