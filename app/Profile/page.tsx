"use client";
import React, { useState } from "react";
import ManageUser from "@/database/auth/ManageUser";
import { useRouter } from "next/navigation";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("personalDetails");
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleLogout = () => {
    ManageUser.logoutUser(setLoggedIn, router);
  };

  const [user, setUser] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    password: "password",
    allergies: ["Nuts"],
    injuries: "",
  });

  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    allergies: user.allergies.join(", "),
    injuries: user.injuries,
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeTab === "personalDetails") {
      const updatedUser = {
        ...user,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        allergies: formData.allergies.split(",").map((item) => item.trim()),
        injuries: formData.injuries,
      };
      setUser(updatedUser);
    } else if (activeTab === "passwordReset") {
      // Handle password reset logic
    }
  };

  return (
    <div className="flex justify-center mt-10">
      <div className="w-full sm:w-2/3 lg:w-1/2 px-6 py-4 bg-white shadow-md rounded-lg">
        <h1 className="text-xl font-semibold mb-4">User Settings</h1>
        <div className="flex">
          <ul className="w-1/4 pr-4">
            <li
              className={`cursor-pointer mb-2 ${
                activeTab === "personalDetails" ? "font-bold" : ""
              }`}
              onClick={() => handleTabChange("personalDetails")}
            >
              Personal Details
            </li>
            <li
              className={`cursor-pointer mb-2 ${
                activeTab === "passwordReset" ? "font-bold" : ""
              }`}
              onClick={() => handleTabChange("passwordReset")}
            >
              Password Reset
            </li>
            <li
              className={`cursor-pointer mb-2 ${
                activeTab === "logout" ? "font-bold" : ""
              }`}
              onClick={() => handleTabChange("logout")}
            >
              Log Out
            </li>
          </ul>
          <div className="w-3/4">
            {activeTab === "personalDetails" && (
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="firstName"
                  >
                    First Name:
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="lastName"
                  >
                    Last Name:
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="email"
                  >
                    Email:
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="allergies"
                  >
                    Food Allergies:
                  </label>
                  <input
                    type="text"
                    name="allergies"
                    id="allergies"
                    className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={formData.allergies}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="injuries"
                  >
                    Injuries:
                  </label>
                  <textarea
                    name="injuries"
                    id="injuries"
                    className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={formData.injuries}
                    onChange={handleChange}
                  ></textarea>
                </div>
                <div className="mb-4">
                  <button
                    type="submit"
                    className="bg-openbox-green hover:bg-hover-obgreen text-white font-bold py-2 px-4 rounded focus:shadow-outline focus:shadow-outline hover:shadow-md"
                  >
                    Save Personal Details
                  </button>
                </div>
              </form>
            )}
            {activeTab === "passwordReset" && (
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="currentPassword"
                  >
                    Current Password:
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    id="currentPassword"
                    className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={formData.currentPassword}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="newPassword"
                  >
                    New Password:
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    id="newPassword"
                    className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={formData.newPassword}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="confirmNewPassword"
                  >
                    Confirm New Password:
                  </label>
                  <input
                    type="password"
                    name="confirmNewPassword"
                    id="confirmNewPassword"
                    className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={formData.confirmNewPassword}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-4">
                  <button
                    type="submit"
                    className="bg-openbox-green hover:bg-hover-obgreen text-white font-bold py-2 px-4 rounded focus:shadow-outline hover:shadow-md"
                  >
                    Save New Password
                  </button>
                </div>
              </form>
            )}
            {activeTab === "logout" && (
              <div>
                <p>Are you sure you want to log out?</p>
                <button
                  onClick={handleLogout}
                  className="bg-openbox-green hover:bg-hover-obgreen text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:shadow-md"
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
