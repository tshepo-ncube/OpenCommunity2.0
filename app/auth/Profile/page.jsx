"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import ManageUser from "@/database/auth/ManageUser";
import { Tab } from "@headlessui/react";
import InterestSelection from "@/_Components/InterestsSelection";
import {
  UserCircleIcon,
  KeyIcon,
  LogOutIcon,
  ArrowLeftIcon,
} from "lucide-react";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";

import Logo from "@/lib/images/teams-icon.jpg";
import ForgotPassword from "@/_Components/NewPassword";

// Import the default profile image
// import defaultProfileImage from "../../lib/images/profile.png";

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
  const [profile, setProfile] = useState({});
  const [isOtherDietSelected, setIsOtherDietSelected] = useState(false);
  const [isOtherAllergySelected, setIsOtherAllergySelected] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [hasCustomImage, setHasCustomImage] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });

  const [selectedInterests, setSelectedInterests] = useState([]);
  const [otherDiet, setOtherDiet] = useState("");
  const [sel, setSel] = useState([]);
  const [otherAllergy, setOtherAllergy] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("personalDetails");
  const [userCommunities, setUserCommunities] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  const [openSnackbar, setOpenSnackbar] = React.useState(false);

  const handleClick = () => {
    setOpenSnackbar(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };

  useEffect(() => {
    console.log("Getting Profile Data...");
    // ManageUser.getProfileData(localStorage.getItem("Email"), (data) => {
    //   setProfile(data);
    //   console.log("The Data :", data);
    //   if (data.profileImage) {
    //     setSelectedImage(data.profileImage);
    //     setHasCustomImage(true);
    //   } else {
    //     setSelectedImage(null);
    //     setHasCustomImage(false);
    //   }
    // });

    ManageUser.getProfileData(
      localStorage.getItem("Email"),
      setProfile,
      setUserCommunities,
      setIsAdmin
    );
  }, []);

  // useEffect(() => {
  //   console.log("Profile has changed. ", profile);
  //   // console.log("Something has changed...");

  //   // setProfile(data);
  //   // console.log("The Data :", data);
  //   if (profile.profileImage) {
  //     setSelectedImage(profile.profileImage);
  //     setHasCustomImage(true);
  //   } else {
  //     setSelectedImage(null);
  //     setHasCustomImage(false);
  //   }

  //   if (profile.otherDiet) {
  //     // console.log("profile has other Diet");
  //     setOtherDiet(profile.otherDiet);
  //     setIsOtherDietSelected(true);
  //   }
  //   if (profile.otherAllergy) {
  //     // console.log("profile has other Allergy");
  //     setIsOtherAllergySelected(true);
  //     setOtherAllergy(profile.otherAllergy);
  //   }
  //   // setSelectedInterests(profile.Interests);

  //   // console.log("Profile :", profile);
  // }),
  //   [profile];

  useEffect(() => {
    console.log("Profile Image: ", profile.profileImage);
    if (profile.profileImage) {
      setSelectedImage(profile.profileImage);
      setHasCustomImage(true);
    } else {
      setSelectedImage(null);
      setHasCustomImage(false);
    }
  }, [profile.profileImage]);

  useEffect(() => {
    if (profile.otherDiet) {
      // console.log("profile has other Diet");
      setOtherDiet(profile.otherDiet);
      setIsOtherDietSelected(true);
    }
  }, [profile.otherDiet]);

  useEffect(() => {
    if (profile.Interests !== selectedInterests) {
      // Handle only when Interests changes
      setSelectedInterests(profile.Interests);
    }
  }, [profile.Interests]);

  useEffect(() => {
    if (profile.otherAllergy) {
      // console.log("profile has other Allergy");
      setIsOtherAllergySelected(true);
      setOtherAllergy(profile.otherAllergy);
    }
  }, [profile.otherAllergy]);
  // useEffect(() => {
  //   console.log(profile);
  //   if (profile.otherDiet) {
  //     console.log("profile has other Diet");
  //     setOtherDiet(profile.otherDiet);
  //     setIsOtherDietSelected(true);
  //   }
  //   if (profile.otherAllergy) {
  //     console.log("profile has other Allergy");
  //     setIsOtherAllergySelected(true);
  //     setOtherAllergy(profile.otherAllergy);
  //   }
  // }, [profile]);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
        // Update profile object
        // setProfile((prevProfile) => ({
        //   ...prevProfile,
        //   profileImage: e.target.result,
        // }));
        setHasCustomImage(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    console.log("handleRemoveImage");
    const confirmed = window.confirm(
      "Are you sure you want to remove your profile picture?"
    );
    if (confirmed) {
      setSelectedImage(null);
      setProfile((prevProfile) => ({
        ...prevProfile,
        profileImage: null,
      }));
      setHasCustomImage(false);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    console.log("handleProfileChange");
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

    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
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

  // const handleEditProfileSubmit = async (e) => {
  //   e.preventDefault();
  //   // const success = await ManageUser.editProfileData(profile.id, profile);
  //   // if (success) {
  //   //   ManageUser.getProfileData(profile.Email, (data) => {
  //   //     setProfile(data);
  //   //     if (data.profileImage) {
  //   //       setSelectedImage(data.profileImage);
  //   //       setHasCustomImage(true);
  //   //     } else {
  //   //       setSelectedImage(null);
  //   //       setHasCustomImage(false);
  //   //     }
  //   //   });
  //   // }

  //   ManageUser.setProfileImage(profileImageFile);
  // };

  const handleEditProfileSubmit = async (e) => {
    console.log("handleEditProfileSubmit");
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
    const success = await ManageUser.editProfileData(
      profile.id,
      profile,
      selectedInterests
    );
    if (success) {
      // If the profile update was successful, fetch the updated profile data
      // ManageUser.getProfileData("tshepo@tshepo.com", setProfile);
      setOpenSnackbar(true);
      ManageUser.getProfileData(
        localStorage.getItem("Email"),
        setProfile,
        setUserCommunities,
        setIsAdmin
      );
    } else {
      // Handle failure
    }

    if (profileImageFile !== null) {
      ManageUser.setProfileImage(profileImageFile);
    }

    console.log("About to make some edits......", profile);
  };

  const handleNewPasswordSubmit = (e) => {
    e.preventDefault();
    if (formData.newPassword === formData.confirmNewPassword) {
      ManageUser.editPassword(formData.newPassword, setError);
    } else {
      setError("Passwords do not match");
    }
  };

  const handleLogout = () => {
    ManageUser.logoutUser(setProfile, router);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen bg-gradient-to-br from-[#f0f4e1] via-gray-100 to-[#e6edc3] py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-[0px_15px_30px_rgba(0,0,0,0.2)] overflow-hidden">
        <div className="px-4 py-5 sm:px-6 flex items-center bg-gray-50">
          <button
            onClick={handleBack}
            className="text-gray-400 hover:text-gray-500 mr-4"
          >
            <ArrowLeftIcon className="h-6 w-6" />
          </button>
          <h2 className="text-2xl font-bold text-gray-900">User Settings</h2>
        </div>
        <Tab.Group>
          <div className="border-b border-gray-200">
            <Tab.List className="flex">
              <Tab
                className={({ selected }) =>
                  `${
                    selected
                      ? "border-[#bcd727] text-[#bcd727]"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }
                     flex-1 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`
                }
              >
                {({ selected }) => (
                  <motion.div
                    initial={false}
                    animate={{ scale: selected ? 1.05 : 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="flex items-center justify-center"
                  >
                    <UserCircleIcon className="w-5 h-5 mr-2" />
                    Personal Details
                  </motion.div>
                )}
              </Tab>
              <Tab
                className={({ selected }) =>
                  `${
                    selected
                      ? "border-[#bcd727] text-[#bcd727]"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }
                     flex-1 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`
                }
              >
                {({ selected }) => (
                  <motion.div
                    initial={false}
                    animate={{ scale: selected ? 1.05 : 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="flex items-center justify-center"
                  >
                    <KeyIcon className="w-5 h-5 mr-2" />
                    Password Reset
                  </motion.div>
                )}
              </Tab>
              <Tab
                className={({ selected }) =>
                  `${
                    selected
                      ? "border-[#bcd727] text-[#bcd727]"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }
                     flex-1 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`
                }
              >
                {({ selected }) => (
                  <motion.div
                    initial={false}
                    animate={{ scale: selected ? 1.05 : 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="flex items-center justify-center"
                  >
                    <LogOutIcon className="w-5 h-5 mr-2" />
                    Log Out
                  </motion.div>
                )}
              </Tab>
            </Tab.List>
          </div>
          <Tab.Panels>
            <Tab.Panel>
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                onSubmit={handleEditProfileSubmit}
                className="space-y-6 p-8"
              >
                <div className="flex flex-col sm:flex-row sm:items-start">
                  {/* Image holder */}
                  <div className="flex-shrink-0 flex flex-col items-center">
                    <div className="relative">
                      <img
                        //src={selectedImage || profile.profileImage}

                        src={
                          selectedImage ||
                          profile.profileImage ||
                          "https://static.vecteezy.com/system/resources/previews/002/318/271/non_2x/user-profile-icon-free-vector.jpg"
                        }
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover"
                      />
                    </div>
                    <input
                      type="file"
                      id="imageUpload"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: "none" }}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        document.getElementById("imageUpload").click()
                      }
                      className="mt-2 text-sm text-[#bcd727]"
                    >
                      Edit
                    </button>
                    {hasCustomImage && (
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="mt-1 text-sm text-red-600"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  {/* Form fields */}
                  <div className="flex-grow mt-6 sm:mt-0 sm:ml-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="Name"
                          className="block text-sm font-medium text-gray-700"
                        >
                          First Name
                        </label>
                        <input
                          type="text"
                          name="Name"
                          id="Name"
                          value={profile.Name || ""}
                          onChange={handleProfileChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#bcd727] focus:border-[#bcd727] sm:text-sm"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="Surname"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Last Name
                        </label>
                        <input
                          type="text"
                          name="Surname"
                          id="Surname"
                          value={profile.Surname || ""}
                          onChange={handleProfileChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#bcd727] focus:border-[#bcd727] sm:text-sm"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label
                          htmlFor="Email"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          name="Email"
                          id="Email"
                          value={profile.Email || ""}
                          onChange={handleProfileChange}
                          disabled
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50 text-gray-500 sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {/* The rest of the form inputs */}
                <div>
                  <label
                    htmlFor="Diet"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Dietary Requirements
                  </label>
                  <select
                    name="Diet"
                    id="Diet"
                    value={profile.Diet || ""}
                    onChange={handleProfileChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#bcd727] focus:border-[#bcd727] sm:text-sm rounded-md"
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
                      onChange={(e) => {
                        setOtherDiet(e.target.value);
                        setProfile((prevProfile) => ({
                          ...prevProfile, // Keep the existing profile fields
                          otherDiet: e.target.value, // Add or update the otherAllergy field
                        }));
                      }}
                      required
                    />
                  </div>
                )}
                <div>
                  <label
                    htmlFor="Allergies"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Food Allergies
                  </label>
                  <select
                    name="Allergies"
                    id="Allergies"
                    value={profile.Allergies || ""}
                    onChange={handleProfileChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#bcd727] focus:border-[#bcd727] sm:text-sm rounded-md"
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
                      //onChange={(e) => setOtherAllergy(e.target.value)}

                      onChange={(e) => {
                        setOtherAllergy(e.target.value);
                        setProfile((prevProfile) => ({
                          ...prevProfile, // Keep the existing profile fields
                          otherAllergy: e.target.value, // Add or update the otherAllergy field
                        }));
                      }}
                      required
                    />
                  </div>
                )}
                {/* 
                <div>
                  {selectedInterests ? (
                    <>
                      <InterestSelection
                        max={3}
                        selectedInterests={selectedInterests}
                        setSelectedInterests={setSelectedInterests}
                      />
                    </>
                  ) : (
                    <></>
                  )}
                </div> */}

                <h2>Select Interests</h2>

                <div>
                  {selectedInterests ? (
                    <>
                      <InterestSelection
                        max={5}
                        selectedInterests={selectedInterests}
                        setSelectedInterests={setSelectedInterests}
                      />
                    </>
                  ) : (
                    <></>
                  )}
                </div>

                <div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#bcd727] hover:bg-[#a0b826] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#bcd727]"
                  >
                    Save Personal Details
                  </motion.button>
                </div>
              </motion.form>
            </Tab.Panel>
            <Tab.Panel>
              {/* Password Reset Panel (unchanged) */}
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                onSubmit={handleNewPasswordSubmit}
                className="space-y-6 p-8"
              >
                {/* <div>
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    id="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#bcd727] focus:border-[#bcd727] sm:text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="confirmNewPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmNewPassword"
                    id="confirmNewPassword"
                    value={formData.confirmNewPassword}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#bcd727] focus:border-[#bcd727] sm:text-sm"
                  />
                </div> */}

                <ForgotPassword />
                {/* {error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-600 text-sm"
                  >
                    {error}
                  </motion.div>
                )} */}
                {/* <div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#bcd727] hover:bg-[#a0b826] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#bcd727]"
                  >
                    Save New Password
                  </motion.button>
                </div> */}
              </motion.form>
            </Tab.Panel>
            <Tab.Panel>
              {/* Log Out Panel (unchanged) */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="p-6 space-y-6"
              >
                <p className="text-sm text-gray-500">
                  Are you sure you want to log out?
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Log out
                </motion.button>
              </motion.div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={handleClose}
        message="The profile has been updated."
      />
    </motion.div>
  );
};

export default Profile;
