"use client";
import React, { useState, useEffect, useRef } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { doc, updateDoc } from "firebase/firestore";

const AdminMan = ({
  submittedData,
  users,
  setUsers,
  availableAdmins,
  setLoading,
}) => {
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [isCommunityHandoverOpen, setCommunityHandoverOpen] = useState(false);
  const [isHandoverConfirmationOpen, setHandoverConfirmationOpen] =
    useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [selectedNewAdmin, setSelectedNewAdmin] = useState(null);
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const communityHandoverRef = useRef(null);
  const popupRef = useRef(null);

  // Handle community selection
  const handleCommunitySelection = (e) => {
    const communityId = e.target.value;
    const community = submittedData.find((comm) => comm.id === communityId);
    setSelectedCommunity(community);

    if (community && community.admin) {
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

  // Handle community handover
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

      // Refresh the communities list (example using your DB methods)
      // Assuming CommunityDB.getAllCommunities is a function that fetches all communities
      CommunityDB.getAllCommunities((data) => {
        setSubmittedData(data);
        setLoading(false);
      }, setLoading);
    } catch (error) {
      console.error("Error transferring community admin rights:", error);
      alert("Error occurred during transfer. Please try again.");
    }
  };

  // Handle role handover confirmation
  const handleConfirmHandover = async () => {
    try {
      const loggedInUserEmail = localStorage.getItem("Email");
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

  // Handle admin role change
  const handleAdminRoleChange = async (email, newRole) => {
    try {
      const updatedRole = newRole === "admin" ? "user" : "admin";
      const allUsers = await UserDB.getAllUsers();
      const userToUpdate = allUsers.find((user) => user.Email === email);

      if (userToUpdate) {
        const userRef = doc(DB, "users", userToUpdate.id);
        await updateDoc(userRef, { Role: updatedRole });

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

  // Sort users, placing highlighted emails first
  const sortUsers = (users) => {
    return [...users].sort((a, b) => {
      const isAHighlighted = localStorage.getItem("Email") === a.Email;
      const isBHighlighted = localStorage.getItem("Email") === b.Email;
      if (isAHighlighted && !isBHighlighted) return -1;
      if (!isAHighlighted && isBHighlighted) return 1;
      return 0;
    });
  };

  // Render email cell
  const renderEmailCell = (email) => {
    const isHighlighted = localStorage.getItem("Email") === email;
    return (
      <td
        className={`px-6 py-4 text-sm ${isHighlighted ? "text-red-600" : "text-gray-900"}`}
      >
        {email}
      </td>
    );
  };

  return (
    <div className="mt-8 max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg relative">
      {/* Button to open the Handover Role popup */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setPopupOpen(true)}
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
              <span className="font-semibold">{selectedCommunity?.name}</span>{" "}
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
    </div>
  );
};

export default AdminMan;
