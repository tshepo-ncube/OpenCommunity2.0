"use client";
import React, { useState, useEffect, useRef } from "react";
import Header from "../../_Components/header";
import CommunityDB from "../../database/community/community";
import AdminCommunity from "../../_Components/AdminCommunities";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import strings from "../../Utils/strings.json";
import UserDB from "../../database/community/users"; // Make sure this import path is correct
import { doc, updateDoc } from "firebase/firestore";
import DB from "../../database/DB"; // Ensure you are importing your Firestore DB instance

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
  const [image, setImage] = useState(null);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  const [searchTerm, setSearchTerm] = useState("");

  const handleUploadButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const handleOpenPopup = () => setPopupOpen(true);
  const handleClosePopup = () => setPopupOpen(false);

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

    // Fetch users for Tab 2
    const fetchUsers = async () => {
      try {
        const userList = await UserDB.getAllUsers();
        setUsers(userList);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, []);

  const handleAdminRoleChange = async (email, newRole) => {
    try {
      const updatedRole = newRole === "admin" ? "user" : "admin"; // Toggle between roles

      const allUsers = await UserDB.getAllUsers(); // Get all users
      const userToUpdate = allUsers.find((user) => user.Email === email); // Find the user by email

      if (userToUpdate) {
        const userRef = doc(DB, "users", userToUpdate.id); // Get the document reference for the user
        await updateDoc(userRef, { Role: updatedRole }); // Update the user's role

        // Update the local state to reflect the change without refreshing the page
        const updatedUsers = users.map((user) =>
          user.Email === email ? { ...user, Role: updatedRole } : user
        );
        setUsers(updatedUsers);

        console.log(
          `Role updated successfully for user: ${userToUpdate.Email}`
        );
      } else {
        console.log("No user found with the provided email.");
      }
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };

  const onRoleChange = (event, email) => {
    const newRole = event.target.checked ? "admin" : "user"; // Assuming it's a checkbox
    handleAdminRoleChange(email, newRole); // Call the function with the user's email and the new role
  };

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

        console.log("Returned Description: ", res.data.communityDescription);
        setDescription(res.data.communityDescription);
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("Please enter a name.");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  // Filter users based on the search term
  const filteredUsers = users.filter((user) => {
    const fullName = `${user.Name} ${user.Surname} ${user.Email}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });
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
          Community Management
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === "tab2"
              ? "bg-openbox-green text-white"
              : "bg-gray-200 text-gray-700"
          } rounded-t-lg`}
          onClick={() => setActiveTab("tab2")}
        >
          Admin Management
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "tab1" ? (
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
                    {/* can we have a word limit for this */}
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1 p-2  h-40 border border-gray-300 rounded-md w-full"
                    required
                  />
                </div>

                {/* Add Image here */}

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
                    <p className="mt-2 text-gray-600">Uploaded: {image.name}</p>
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
                Click on <span className="font-bold">create community</span> to
                get started.
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
        // User Management Tab
        <div className="mt-8 max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg relative">
          {/* Handover My Role Button */}
          <div className="flex justify-end mb-4">
            <button
              //onClick={handleHandoverRole}
              className="px-4 py-2 text-white font-semibold rounded-lg shadow-md transition-colors"
              style={{
                backgroundColor: "#bcd727",
                hover: { backgroundColor: "#a6c521" },
              }}
            >
              Handover My Role
            </button>
          </div>

          {/* Admin Management Header */}
          <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">
            Admin Management
          </h2>

          {/* Search Bar */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search by name, surname, or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* User List */}
          {filteredUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white shadow-md rounded-lg divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Surname
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Admin Role
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.Email} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {user.Name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {user.Surname}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {user.Email}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <label className="flex items-center justify-center">
                          <input
                            type="checkbox"
                            className="form-checkbox h-5 w-5 text-blue-600"
                            checked={user.Role === "admin"}
                            onChange={(e) => {
                              const isChecked = e.target.checked;
                              const confirmationMessage = isChecked
                                ? `Are you sure you want to give admin rights to ${user.Email}?`
                                : `Are you sure you want to revoke admin rights from ${user.Email}?`;

                              const confirmation =
                                window.confirm(confirmationMessage);
                              if (confirmation) {
                                handleAdminRoleChange(user.Email, user.Role);
                              }
                            }}
                          />
                        </label>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-gray-500 mt-4">No results found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CreateCommunity;
