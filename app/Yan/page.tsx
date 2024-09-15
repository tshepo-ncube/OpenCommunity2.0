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

import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updatePassword,
} from "firebase/auth";

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={vertical-tabpanel-${index}}
      aria-labelledby={vertical-tab-${index}}
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

function a11yProps(index: number) {
  return {
    id: vertical-tab-${index},
    "aria-controls": vertical-tabpanel-${index},
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
  "Other"
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
  "Other"
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
  "Other"
];
//end

const Profile = () => {
  const [activeTab, setActiveTab] = useState("personalDetails");
  const [loggedIn, setLoggedIn] = useState(false);


// new Yan added code
const [isOtherDietSelected, setIsOtherDietSelected] = useState(false);
const [isOtherAllergySelected, setIsOtherAllergySelected] = useState(false);
const [otherDiet, setOtherDiet] = useState("");
const [otherAllergy, setOtherAllergy] = useState("");
// end 




  const router = useRouter();

  const [userEmail, setUserEmail] = useState(null);

  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
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
    injuries: "None",
    diet: "None",
    //diet: [],
    //allergies: [],
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
    const savedEmail = localStorage.getItem("Email");
    return savedEmail || ""; // Return empty string if no email is found
  };

  useEffect(() => {
    // const auth = getAuth();
    // const unsubscribe = onAuthStateChanged(auth, (user_h) => {
    //   if (user_h) {
    //     // User is signed in.
    //     console.log("User is logged in:", user_h);
    //     setUserEmail(user_h.email);
    //     //setSignedIn(true);

    //     // User is signed in.
    //     //setUser(user);

    //     //window.location.href = "http://localhost:3000/Home";
    //   } else {
    //     // setSignedIn(false);
    //     // setUser(null);
    //     // No user is signed in.
    //     console.log("No user is logged in");
    //   }
    // });

    ManageUser.getProfileData(localStorage.getItem("Email"), setProfile);

    // To stop listening for changes (unsubscribe) - optional
    // return () => unsubscribe();
  }, []);


//YAN ADDED THIS NEW CODE - The one under was the prev correct code
  // const handleProfileChange = (e, fieldName) => {
  //   const { options } = e.target;
  //   const selectedValues = [];
  //   for (let i = 0, l = options.length; i < l; i++) {
  //     if (options[i].selected) {
  //       selectedValues.push(options[i].value);
  //     }
  //   }
  
  //   // Check for "Other" selection to display custom input
  //   if (fieldName === "Diet") {
  //     setIsOtherDietSelected(selectedValues.includes("Other"));
  //     if (!selectedValues.includes("Other")) {
  //       setOtherDiet(""); // Reset if "Other" is not selected
  //     }
  //   } else if (fieldName === "Allergies") {
  //     setIsOtherAllergySelected(selectedValues.includes("Other"));
  //     if (!selectedValues.includes("Other")) {
  //       setOtherAllergy(""); // Reset if "Other" is not selected
  //     }
  //   }
  
  //   setProfile((prevProfile) => ({
  //     ...prevProfile,
  //     [fieldName]: selectedValues,
  //   }));
  // };
  




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






//  // CHANGES: Handle dietary requirement selection and show text input if "Other" is selected
//  const handleDietaryChange = (e) => {
//   const { value } = e.target;
//   setProfile((prevProfile) => ({
//     ...prevProfile,
//     Diet: value,
//   }));

//   // Show input box if "Other" is selected
//   setIsOtherDietary(value === "Other");
// };

// // CHANGES: Handle food allergy selection and show text input if "Other" is selected
// const handleAllergyChange = (e) => {
//   const { value } = e.target;
//   setProfile((prevProfile) => ({
//     ...prevProfile,
//     Allergies: value,
//   }));

//   // Show input box if "Other" is selected
//   setIsOtherAllergy(value === "Other");
// };







  const handleEditProfileSubmit = async (e) => {
    e.preventDefault();

    //new new
    const updatedProfile = {
      ...profile,
      Diet: isOtherDietSelected ? [...profile.Diet, otherDiet] : profile.Diet,
      Allergies: isOtherAllergySelected ? [...profile.Allergies, otherAllergy] : profile.Allergies,
    };
  
    //old one added in
    // const updatedProfile = {
    //   ...profile,
    //   Diet: isOtherDietSelected ? otherDiet : profile.Diet,
    //   Allergies: isOtherAllergySelected ? otherAllergy : profile.Allergies,
    // };
    //end


    const success = await ManageUser.editProfileData(profile.id, updatedProfile);



    //add back??
    //const success = await ManageUser.editProfileData(profile.id, profile);
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
        {/* <div className="flex">
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
        </div> */}

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
            sx={{ borderRight: 1, borderColor: "divider", minWidth: '200px' }}
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
                  onChange={(e) => handleProfileChange(e, "Diet")}
                  //multiple // Allows multiple selections
                  // onChange={handleProfileChange}
                >
                  {dietaryRequirements.map((diet) => (
                    <option key={diet} value={diet}>
                      {diet}
                    </option>
                  ))}
                </select>


                {isOtherDietSelected && (
    <div className="mt-2">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="otherDiet">
        Please specify other dietary requirements:
      </label>
      <input
        type="text"
        id="otherDiet"
        name="otherDiet"
        className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        value={otherDiet}
        onChange={(e) => setOtherDiet(e.target.value)}
      />
    </div>
  )}

                {/* CHANGES: Show additional text input if "Other" is selected
                {isOtherDietary && (
                  <div className="mt-2">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="otherDietary">
                      Please specify:
                    </label>
                    <input
                      type="text"
                      id="otherDietary"
                      className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
                      value={otherDietaryRequirement}
                      onChange={(e) => setOtherDietaryRequirement(e.target.value)}
                    />
                  </div>
                )} */}
                






              </div>
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
                  onChange={(e) => handleProfileChange(e, "Allergies")}
                  //multiple // Allows multiple selections
                  //onChange={handleProfileChange}
                >
                  {foodAllergies.map((allergy) => (
                    <option key={allergy} value={allergy}>
                      {allergy}
                    </option>
                  ))}
                </select>




                {isOtherAllergySelected && (
    <div className="mt-2">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="otherAllergy">
        Please specify other food allergies:
      </label>
      <input
        type="text"
        id="otherAllergy"
        name="otherAllergy"
        className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        value={otherAllergy}
        onChange={(e) => setOtherAllergy(e.target.value)}
      />
    </div>
  )}


                {/* CHANGES: Show additional text input if "Other" is selected
                {isOtherAllergy && (
                  <div className="mt-2">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="otherAllergy">
                      Please specify:
                    </label>
                    <input
                      type="text"
                      id="otherAllergy"
                      className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
                      value={otherFoodAllergy}
                      onChange={(e) => setOtherFoodAllergy(e.target.value)}
                    />
                  </div>
                )} */}







              </div>
              {/* <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="allergies"
                >
                  Dietary Requirements:
                </label>
                <input
                  type="text"
                  name="Diet"
                  id="diet"
                  className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={profile.Diet}
                  onChange={handleProfileChange}
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
                  name="Allergies"
                  id="allergies"
                  className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={profile.Allergies}
                  onChange={handleProfileChange}
                />
              </div> */}
              {/* <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="injuries"
                >
                  Injuries:
                </label>
                <textarea
                  name="Injuries"
                  id="injuries"
                  className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={profile.Injuries}
                  onChange={handleProfileChange}
                ></textarea>
              </div> */}
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