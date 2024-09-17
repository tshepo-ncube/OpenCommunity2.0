"use client";
import React, { useEffect, useState } from "react";
import ManageUser from "@/database/auth/ManageUser";

import { useRouter } from "next/navigation";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

const dietaryRequirements = [
  "None",
  "Vegetarian",
  "Vegan",
  "Gluten-Free",
  "Keto",
  "Halal",
  "Kosher",
  "Other",
];

const foodAllergies = [
  "None",
  "Peanuts",
  "Tree nuts",
  "Milk",
  "Eggs",
  "Wheat",
  "Soy",
  "Fish",
  "Shellfish",
  "Other",
];

//new Yan has added but its not showing yet
const interests = [
  "None",
  "Peanuts",
  "Tree nuts",
  "Milk",
  "Eggs",
  "Wheat",
  "Soy",
  "Fish",
  "Shellfish",
  "Other",
];

const Profile = () => {
  const [isOtherDietSelected, setIsOtherDietSelected] = useState(false);
  const [isOtherAllergySelected, setIsOtherAllergySelected] = useState(false);
  const [activeTab, setActiveTab] = useState("personalDetails");
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();

  const [otherDiet, setOtherDiet] = useState("");
  const [otherAllergy, setOtherAllergy] = useState("");

  const [userEmail, setUserEmail] = useState(null);

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleLogout = () => {
    ManageUser.logoutUser(setLoggedIn, router);
  };

  const [profile, setProfile] = useState({});
  const [user, setUser] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    password: "password",
    allergies: ["Nuts"],
    //injuries: "None",
    diet: "None",
  });

  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    allergies: user.allergies.join(", "),
    //injuries: user.injuries,
    diet: user.diet,
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const getEmailFromLocalStorage = () => {
    if (typeof window === "undefined") return;

    const savedEmail = localStorage.getItem("Email");
    return savedEmail || ""; // Return empty string if no email is found
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      ManageUser.getProfileData(localStorage.getItem("Email"), setProfile);
    }

    // To stop listening for changes (unsubscribe) - optional
    // return () => unsubscribe();
  }, []);

  useEffect(() => {
    console.log(profile);
    if (profile.otherDiet) {
      console.log("profile has other Diet");
      setOtherDiet(profile.otherDiet);
      setIsOtherDietSelected(true);
    }
    if (profile.otherAllergy) {
      console.log("profile has other Allergy");
      setIsOtherAllergySelected(true);
      setOtherAllergy(profile.otherAllergy);
    }
  }, [profile]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;

    //new Yan added in this code
    if (name === "Diet") {
      setIsOtherDietSelected(value === "Other");
      if (value !== "Other") {
        setOtherDiet(""); // Clear if not "Other"
      }
    }

    if (name === "Allergies") {
      setIsOtherAllergySelected(value === "Other");
      if (value !== "Other") {
        setOtherAllergy(""); // Clear if not "Other"
      }
    }
    //end

    console.log(name, value);
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
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
        //injuries: formData.injuries,
      };
      setUser(updatedUser);
    } else if (activeTab === "passwordReset") {
      // Handle password reset logic
    }
  };

  const handleNewPasswordSubmit = () => {
    if (formData.newPassword == formData.confirmNewPassword) {
      ManageUser.editPassword(formData.newPassword, setError);
    } else {
      alert("Confirm Password does not equal to password!");
    }
  };

  const handleEditProfileSubmit = async (e) => {
    e.preventDefault();

    if (otherAllergy !== "") {
      // Update the profile with the otherAllergy field
      setProfile((prevProfile) => ({
        ...prevProfile, // Keep the existing profile fields
        otherAllergy: otherAllergy, // Add or update the otherAllergy field
      }));
    }

    if (otherDiet !== "") {
      // Update the profile with the otherAllergy field
      setProfile((prevProfile) => ({
        ...prevProfile, // Keep the existing profile fields
        otherDiet: otherDiet, // Add or update the otherAllergy field
      }));
    }
    const success = await ManageUser.editProfileData(profile.id, profile);
    if (success) {
      // If the profile update was successful, fetch the updated profile data
      ManageUser.getProfileData("tshepo@tshepo.com", setProfile);
    } else {
      // Handle failure
    }
  };

  const handleClose = () => {
    router.back();
  };

  return (
    <div className="flex justify-center mt-10">
      <div className="w-full sm:w-2/3 lg:w-1/2 px-6 py-4 bg-white shadow-md rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold mb-4">User Settings</h1>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </div>

        <Box
          sx={{
            flexGrow: 1,
            bgcolor: "background.paper", //green
            display: "flex",
            padding: 2,
            height: "100%",
          }}
        >
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={profile.Name}
            onChange={handleChange}
            aria-label="Vertical tabs example"
            sx={{ borderRight: 1, borderColor: "divider", minWidth: "200px" }}
          >
            <Tab label="Personal Details" {...a11yProps(0)} />
            <Tab label="Password Reset" {...a11yProps(1)} />
            <Tab label="Log Out" {...a11yProps(2)} />
          </Tabs>
          <TabPanel value={value} index={0}>
            <form onSubmit={handleEditProfileSubmit}>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="firstName"
                >
                  First Name:
                </label>
                <input
                  type="text"
                  name="Name"
                  id="firstName"
                  className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={profile.Name}
                  onChange={handleProfileChange}
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
                  name="Surname"
                  id="lastName"
                  className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={profile.Surname}
                  onChange={handleProfileChange}
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
                  name="Email"
                  id="email"
                  className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={profile.Email}
                  onChange={handleProfileChange}
                  disabled
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="diet"
                >
                  Dietary Requirements:
                </label>
                <select
                  name="Diet"
                  id="diet"
                  className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={profile.Diet}
                  onChange={handleProfileChange}
                >
                  {dietaryRequirements.map((diet) => (
                    <option key={diet} value={diet}>
                      {diet}
                    </option>
                  ))}
                </select>
              </div>

              {isOtherDietSelected && (
                <div className="mt-2">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="otherDiet"
                  >
                    Please specify other dietary requirements:
                  </label>
                  <input
                    type="text"
                    id="otherDiet"
                    name="otherDiet"
                    className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={otherDiet}
                    onChange={(e) => setOtherDiet(e.target.value)}
                    required
                  />
                </div>
              )}
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="allergies"
                >
                  Food Allergies:
                </label>
                <select
                  name="Allergies"
                  id="allergies"
                  className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={profile.Allergies}
                  onChange={handleProfileChange}
                >
                  {foodAllergies.map((allergy) => (
                    <option key={allergy} value={allergy}>
                      {allergy}
                    </option>
                  ))}
                </select>
              </div>

              {isOtherAllergySelected && (
                <div className="mt-2">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="otherAllergy"
                  >
                    Please specify other food allergies:
                  </label>
                  <input
                    type="text"
                    id="otherAllergy"
                    name="otherAllergy"
                    className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={otherAllergy}
                    onChange={(e) => setOtherAllergy(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="mb-4">
                <button
                  type="submit"
                  className="bg-openbox-green hover:bg-hover-obgreen text-white font-bold py-2 px-4 rounded focus:shadow-outline focus:shadow-outline hover:shadow-md"
                >
                  Save Personal Details
                </button>
              </div>
            </form>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <form onSubmit={handleNewPasswordSubmit}>
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
          </TabPanel>
          <TabPanel value={value} index={2}>
            <div>
              <p>Are you sure you want to log out?</p>
              <button
                onClick={handleLogout}
                className="bg-openbox-green hover:bg-hover-obgreen text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:shadow-md"
              >
                Log out
              </button>
            </div>
          </TabPanel>
        </Box>
      </div>
    </div>
  );
};

export default Profile;
