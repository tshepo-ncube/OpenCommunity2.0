"use client";
import React, { useState, useEffect, useRef } from "react";
import Header from "../../_Components/header";
import CommunityDB from "../../database/community/community";
import AdminCommunity from "../../_Components/AdminCommunities";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import strings from "../../Utils/strings.json";
import InterestSelection from "@/_Components/InterestsSelection";
import UserDB from "../../database/community/users"; // Make sure this import path is correct

import { doc, updateDoc } from "firebase/firestore";
import DB from "../../database/DB"; // Ensure you are importing your Firestore DB instance
import ManageUser from "@/database/auth/ManageUser";

const CreateCommunity = () => {
  const [activeTab, setActiveTab] = useState("tab1");
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [isUserPopupOpen, setUserPopupOpen] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [submittedData, setSubmittedData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [category, setCategory] = useState("Fitness & Wellness");
  const [view, setView] = useState("Communities");
  const [userName, setUserName] = useState("");
  const [userSurname, setUserSurname] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [roles, setRoles] = useState({ user: false, admin: false });
  const fileInputRef = useRef(null);
  const userPopupRef = useRef(null);

  const [selectedInterests, setSelectedInterests] = useState([]);

  const [image, setImage] = useState(null);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [searchTerm, setSearchTerm] = useState("");
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false); // State for confirmation modal
  const [isConfirmPopupOpen, setConfirmPopupOpen] = useState(false); // State for confirmation popup
  const [selectedUser, setSelectedUser] = useState(null); // Selected user for role handover
  const popupRef = useRef(null);
  const [adminUsers, setAdminUsers] = useState([]);
  const [consoleEmails, setConsoleEmails] = useState([]);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false); // New state for super admin check

  const [isCommunityHandoverOpen, setCommunityHandoverOpen] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [selectedNewAdmin, setSelectedNewAdmin] = useState(null);
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [isHandoverConfirmationOpen, setHandoverConfirmationOpen] =
    useState(false);
  const communityHandoverRef = useRef(null);

  // Update the community selection handler
  const handleCommunitySelection = (e) => {
    const communityId = e.target.value;
    const community = submittedData.find((comm) => comm.id === communityId);
    setSelectedCommunity(community);

    if (community && community.admin) {
      // Find the admin user details from the users array
      const adminUser = users.find((user) => user.Email === community.admin);
      setCurrentAdmin(
        adminUser || {
          Name: "Unknown",
          Surname: "",
          Email: community.admin,
        }
      );
    } else {
      setCurrentAdmin(null);
    }
  };

  // Add new handler for community admin handover
  const handleCommunityHandover = async () => {
    if (!selectedCommunity || !selectedNewAdmin) {
      alert("Please select both a community and a new admin.");
      return;
    }

    try {
      const communityRef = doc(DB, "communities", selectedCommunity.id);
      await updateDoc(communityRef, { admin: selectedNewAdmin.Email });

      alert("Community admin rights successfully transferred!");
      setCommunityHandoverOpen(false);

      // Refresh the communities list
      CommunityDB.getAllCommunities((data) => {
        setSubmittedData(data);
        setLoading(false);
      }, setLoading);
    } catch (error) {
      console.error("Error transferring community admin rights:", error);
      alert("Error occurred during transfer. Please try again.");
    }
  };
  // Create a new function to handle the actual role handover after confirmation
  const handleConfirmHandover = async () => {
    try {
      const loggedInUserEmail = consoleEmails[0];
      const allUsers = await UserDB.getAllUsers();
      const loggedInUser = allUsers.find(
        (user) => user.Email === loggedInUserEmail
      );

      if (loggedInUser) {
        const loggedInUserRef = doc(DB, "users", loggedInUser.id);
        await updateDoc(loggedInUserRef, { role: "noSuper" });

        const selectedUserRef = doc(DB, "users", selectedUser.id);
        await updateDoc(selectedUserRef, { role: "super_admin" });

        console.log(`Super admin role handed over to: ${selectedUser.Email}`);
        setIsConfirmationOpen(false);
        setPopupOpen(false);

        alert("Role handover successful!");

        // Add this line to refresh the page
        window.location.reload();
      } else {
        console.log("Logged-in user not found.");
        alert("Error: Logged-in user not found.");
      }
    } catch (error) {
      console.error("Error handing over roles:", error);
      alert("Error occurred during role handover. Please try again.");
    }
  };
  const handleCancelHandover = () => setIsConfirmationOpen(false); // Close confirmation modal
  // Filter out only admin users for the dropdown
  const adminOnlyUsers = users.filter((user) => user.Role === "admin");
  // Handle open and close for confirmation popup
  const handleOpenConfirmPopup = () => setConfirmPopupOpen(true);
  const handleCloseConfirmPopup = () => setConfirmPopupOpen(false);

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
  // First, filter the adminOnlyUsers to exclude the current admin
  const availableAdmins = adminOnlyUsers.filter(
    (user) => user.Email !== (currentAdmin?.Email || selectedCommunity?.admin)
  );
  const handleRoleChange = (e) => {
    const { name, checked } = e.target;
    setRoles((prevRoles) => ({ ...prevRoles, [name]: checked }));
  };
  // Find emails in console and check for super admin message
  useEffect(() => {
    const findEmailsInConsole = () => {
      const originalConsoleLog = console.log;
      let foundEmails = [];

      console.log = function (...args) {
        args.forEach((arg) => {
          if (typeof arg === "object" && arg !== null) {
            const email = arg.Email;
            if (email && typeof email === "string") {
              foundEmails.push(email);
            }
          } else if (typeof arg === "string") {
            // Check for super admin messages
            // console.log(arg);
            //console.log(arg);
            // if (arg.includes("User is a super admin")) {
            //   setIsSuperAdmin(true);
            // } else if (arg.includes("User is not a super admin")) {
            //   setIsSuperAdmin(false);
            // }
          }
        });
        originalConsoleLog.apply(console, args);
      };

      // Store found emails in state
      setConsoleEmails(foundEmails);

      // Restore original console.log after component unmounts
      return () => {
        console.log = originalConsoleLog;
      };
    };

    findEmailsInConsole();
  }, []);

  useEffect(() => {
    ManageUser.setIsSuperAdmin(setIsSuperAdmin);
  }, []);

  useEffect(() => {
    UserDB.getUser(localStorage.getItem("UserID"));
  }, []);
  // ... (keep all existing functions)

  // Modified table cell rendering for email
  const renderEmailCell = (email) => {
    const isHighlighted = consoleEmails.includes(email);
    return (
      <td
        className={`px-6 py-4 text-sm ${
          isHighlighted ? "text-red-600" : "text-gray-900"
        }`}
      >
        {email}
      </td>
    );
  };
  // Function to sort users, placing highlighted emails first
  const sortUsers = (users) => {
    return [...users].sort((a, b) => {
      const isAHighlighted = consoleEmails.includes(a.Email);
      const isBHighlighted = consoleEmails.includes(b.Email);
      if (isAHighlighted && !isBHighlighted) return -1;
      if (!isAHighlighted && isBHighlighted) return 1;
      return 0;
    });
  };

  const handleFormSubmit = async (e, status) => {
    e.preventDefault();

    // Get the logged-in user's email (assuming consoleEmails stores the logged-in user's email)
    const adminEmail = consoleEmails[0]; // Assuming the first email is the logged-in user's email

    // Create the community data with the admin field
    const communityData = {
      name,
      description,
      category,
      status,
      admin: adminEmail, // Adding the admin field with the logged-in user's email
    };

    if (editIndex !== null) {
      // Update existing community
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
      // console.log("creating a channel now...");
      // CommunityDB.createCommunity(
      //   communityData,
      //   (newCommunity) =>
      //     setSubmittedData((prevData) => [...prevData, newCommunity]),
      //   setLoading
      // );
      //name, description, category, status

      try {
        // const res = await axios.post(
        //   strings.server_endpoints.createChannel,
        //   { name, description, category, status },
        //   {
        //     headers: {
        //       "Content-Type": "application/json",
        //     },
        //   }
        // );

        // console.log(res.data);
        // let data = res.data;

        if (selectedInterests.length < 3) {
          alert("Please add more interests");
        } else {
          CommunityDB.createCommunity(
            communityData,
            image,
            (newCommunity) => {
              setSubmittedData((prevData) => [...prevData, newCommunity]);
            },
            setLoading,
            selectedInterests

            // ,
            // {
            //   WebUrl: data.webUrl,
            //   ChannelID: data.id,
            // }
          );
        }
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

    const fetchUsers = async () => {
      try {
        const userList = await UserDB.getAllUsers();
        setUsers(userList);
        // Filter admin users
        const admins = userList.filter((user) => user.Role === "admin");
        setAdminUsers(admins);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, []);

  // Modify the filteredAdminUsers to exclude the emails found in console
  const filteredAdminUsers = adminUsers.filter((user) => {
    const fullName = `${user.Name} ${user.Surname} ${user.Email}`.toLowerCase();
    return (
      fullName.includes(searchTerm.toLowerCase()) &&
      !consoleEmails.includes(user.Email)
    );
  });
  // Function to handle role handover

  const handleHandoverRole = () => {
    if (selectedUser) {
      setIsConfirmationOpen(true); // Show confirmation popup instead of immediate execution
    } else {
      alert("Please select a user to hand over the role.");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setPopupOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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

  useEffect(() => {
    console.log("Category: ", category);
  }, [category]);

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
        {isSuperAdmin && (
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
        )}
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
                    <option value="Fitness & Wellness">
                      Fitness & Wellness
                    </option>
                    <option value="Food & Drinks">Food & Drinks</option>
                    <option value="Arts & Culture">Arts & Culture</option>
                    <option value="Tech & Gaming">Tech & Gaming</option>
                    <option value="Social & Networking">
                      Social & Networking
                    </option>
                    <option value="Hobbies & Interests">
                      Hobbies & Interests
                    </option>
                    <option value="Travel & Adventure">
                      Travel & Adventure
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

                <label className="block text-m text-gray-700 font-semibold">
                  Select Community Interests
                </label>
                <InterestSelection
                  max={3}
                  setSelectedInterests={setSelectedInterests}
                  selectedInterests={selectedInterests}
                />

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
        <div className="mt-8 max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg relative">
          {/* Button to open the Handover Role popup */}
          <div className="flex justify-end mb-4">
            <button
              onClick={handleOpenPopup}
              className="btn bg-gray-400 hover:bg-gray-600 text-white font-medium rounded-lg px-5 py-2.5"
            >
              Role Handover
            </button>
          </div>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setCommunityHandoverOpen(true)}
              className="btn bg-gray-400 hover:bg-gray-600 text-white font-medium rounded-lg px-5 py-2.5"
            >
              Community Admin Handover
            </button>
          </div>

          {/* Community Admin Handover Popup */}
          {isCommunityHandoverOpen && (
            <>
              <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md z-10"></div>
              <div
                ref={communityHandoverRef}
                className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-md shadow-xl z-50 w-11/12 sm:w-3/4 lg:w-2/3 xl:w-1/2 max-h-full overflow-auto"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">
                    Community Admin Handover
                  </h2>
                  <button
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() => setCommunityHandoverOpen(false)}
                  >
                    <CloseIcon />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Community Selection */}
                  {/* Community Selection */}
                  <div>
                    <label className="block text-left font-semibold text-gray-700 mb-2">
                      Select Community:
                    </label>
                    <select
                      value={selectedCommunity ? selectedCommunity.id : ""}
                      onChange={handleCommunitySelection}
                      className="block w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">-- Select a community --</option>
                      {submittedData.map((community) => (
                        <option key={community.id} value={community.id}>
                          {community.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Current Admin Display */}
                  <div>
                    <label className="block text-left font-semibold text-gray-700 mb-2">
                      Current Admin:
                    </label>
                    <input
                      type="text"
                      value={
                        currentAdmin
                          ? `(${currentAdmin.Email})`
                          : "No admin assigned"
                      }
                      className="block w-full p-2 border border-gray-300 rounded-md bg-gray-50"
                      disabled
                    />
                  </div>

                  {/* New Admin Selection */}
                  <div>
                    <label className="block text-left font-semibold text-gray-700 mb-2">
                      Select New Admin:
                    </label>
                    <select
                      value={selectedNewAdmin ? selectedNewAdmin.id : ""}
                      onChange={(e) => {
                        const user = availableAdmins.find(
                          (user) => user.id === e.target.value
                        );
                        setSelectedNewAdmin(user);
                      }}
                      className="block w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">-- Select a new admin --</option>
                      {availableAdmins.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.Name} {user.Surname} ({user.Email})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={() => setCommunityHandoverOpen(false)}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => setHandoverConfirmationOpen(true)}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
                      disabled={!selectedCommunity || !selectedNewAdmin}
                    >
                      Transfer Admin Rights
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Confirmation Modal */}
          {isHandoverConfirmationOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md z-50 flex items-center justify-center">
              <div className="bg-white p-8 rounded-md shadow-xl max-w-md w-full mx-4">
                <h3 className="text-lg font-bold mb-4">
                  Confirm Community Admin Transfer
                </h3>
                <p className="mb-6 text-gray-700">
                  Are you sure you want to transfer admin rights for{" "}
                  <span className="font-semibold">
                    {selectedCommunity?.name}
                  </span>{" "}
                  to{" "}
                  <span className="font-semibold">
                    {selectedNewAdmin?.Name} {selectedNewAdmin?.Surname}
                  </span>
                  ?
                </p>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setHandoverConfirmationOpen(false)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      handleCommunityHandover();
                      setHandoverConfirmationOpen(false);
                    }}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
                  >
                    Confirm Transfer
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Popup for handover role */}
          {isPopupOpen && (
            <>
              <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md z-10"></div>
              <div
                ref={popupRef}
                className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-md shadow-xl z-50 w-11/12 sm:w-3/4 lg:w-2/3 xl:w-1/2 max-h-full overflow-auto"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">
                    Handover of Super Admin Role
                  </h2>
                  <button
                    className="text-gray-500 hover:text-gray-700"
                    onClick={handleClosePopup}
                  >
                    <CloseIcon />
                  </button>
                </div>
                <p className="mb-4 text-gray-700">
                  Please select an admin from the below list of users that you
                  would like to pass your super admin role to. Please note that
                  by doing this, you will no longer have super admin
                  capabilities to assign and take away admin rights from the
                  users of the system.
                </p>

                {/* User list to select for role handover */}
                <div className="mb-6">
                  <label className="block text-left font-semibold text-gray-700 mb-2">
                    Select Admin User:
                  </label>
                  <select
                    value={selectedUser ? selectedUser.id : ""}
                    onChange={(e) => {
                      const user = filteredAdminUsers.find(
                        (user) => user.id === e.target.value
                      );
                      setSelectedUser(user);
                    }}
                    className="block w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">-- Select an admin --</option>
                    {filteredAdminUsers.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.Name} {user.Surname} ({user.Email})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Submit button to confirm role handover */}
                <div className="flex justify-end">
                  <button
                    onClick={handleHandoverRole}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
                  >
                    Handover my role
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Confirmation Modal */}
          {isConfirmationOpen && (
            <>
              <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md z-50"></div>
              <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-md shadow-xl z-50 w-11/12 sm:w-96">
                <h3 className="text-lg font-bold mb-4">
                  Confirm Role Handover
                </h3>
                <p className="mb-6 text-gray-700">
                  Are you sure you want to hand over your super admin role to{" "}
                  <span className="font-semibold">{selectedUser?.Email}</span>?
                  <br />
                  <br />
                  This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setIsConfirmationOpen(false)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmHandover}
                    className="bg-red-500 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg"
                  >
                    Confirm Handover
                  </button>
                </div>
              </div>
            </>
          )}

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
                  {sortUsers(filteredUsers).map((user) => {
                    const isHighlighted = consoleEmails.includes(user.Email);
                    return (
                      <tr
                        key={user.Email}
                        className={`hover:bg-gray-50 ${isHighlighted ? "bg-gray-200" : ""}`}
                      >
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {user.Name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {user.Surname}
                        </td>
                        {renderEmailCell(user.Email)}
                        <td className="px-6 py-4 text-center">
                          <label className="flex items-center justify-center">
                            <input
                              type="checkbox"
                              className="form-checkbox h-5 w-5 text-blue-600"
                              checked={user.Role === "admin"}
                              onChange={(e) => {
                                if (!isHighlighted) {
                                  const isChecked = e.target.checked;
                                  const confirmationMessage = isChecked
                                    ? `Are you sure you want to give admin rights to ${user.Email}?`
                                    : `Are you sure you want to revoke admin rights from ${user.Email}?`;

                                  const confirmation =
                                    window.confirm(confirmationMessage);
                                  if (confirmation) {
                                    handleAdminRoleChange(
                                      user.Email,
                                      user.Role
                                    );
                                  }
                                }
                              }}
                              disabled={isHighlighted}
                            />
                          </label>
                        </td>
                      </tr>
                    );
                  })}
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
