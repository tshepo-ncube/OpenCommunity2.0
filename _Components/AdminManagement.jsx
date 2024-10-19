"use client";
import React, { useState, useEffect, useRef } from "react";
import CloseIcon from "@mui/icons-material/Close";

const AdminManagement = ({
  handleCommunitySelection,
  handleCommunityHandover,
  handleConfirmHandover,
  handleAdminRoleChange,
  sortUsers,
  renderEmailCell,
  filteredUsers,
  filteredAdminUsers,
  availableAdmins,
  submittedData,
  currentAdmin,
  selectedCommunity,
  selectedNewAdmin,
  setCommunityHandoverOpen,
  setSelectedNewAdmin,
  isCommunityHandoverOpen,
  isHandoverConfirmationOpen,
  setHandoverConfirmationOpen,
  isPopupOpen,
  setPopupOpen,
  handleHandoverRole,
  selectedUser,
  setSelectedUser,
  setIsConfirmationOpen,
  isConfirmationOpen,
  searchTerm,
  setSearchTerm,
}) => {
  const communityHandoverRef = useRef(null);
  const popupRef = useRef(null);

  const handleClosePopup = () => setPopupOpen(false);

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

      {/* Popup for Handover Role */}
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
              Please select an admin from the below list of users that you would
              like to pass your super admin role to.
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
                const isHighlighted =
                  localStorage.getItem("Email") === user.Email;
                return (
                  <tr
                    key={user.Email}
                    className={`hover:bg-gray-50 ${
                      isHighlighted ? "bg-gray-200" : ""
                    }`}
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
                                handleAdminRoleChange(user.Email, user.Role);
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
  );
};

export default AdminManagement;
