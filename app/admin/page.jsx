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
          User Management
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
              {/* Community creation form */}
              {/* ... (The form content remains the same as in your original code) */}
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
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">User Management</h2>

          {/* Search Bar */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search by name, surname, or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border rounded w-full py-2 px-3"
            />
          </div>

          {/* User List */}
          {filteredUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-center text-sm font-medium text-gray-500">
                      Name
                    </th>
                    <th className="px-4 py-2 text-center text-sm font-medium text-gray-500">
                      Surname
                    </th>
                    <th className="px-4 py-2 text-center text-sm font-medium text-gray-500">
                      Email
                    </th>
                    <th className="px-4 py-2 text-center text-sm font-medium text-gray-500">
                      Admin Role
                    </th>
                    <th className="px-4 py-2 text-center text-sm font-medium text-gray-500">
                      Super Admin Role
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.Email}>
                      <td className="px-4 py-2">{user.Name}</td>
                      <td className="px-4 py-2">{user.Surname}</td>
                      <td className="px-4 py-2">{user.Email}</td>

                      <td className="px-4 py-2">
                        <label>
                          <input
                            type="checkbox"
                            checked={user.Role === "admin"}
                            onChange={() =>
                              handleAdminRoleChange(user.Email, user.Role)
                            }
                          />
                        </label>
                      </td>
                      <td className="px-4 py-2">
                        <input type="checkbox" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No results found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CreateCommunity;
