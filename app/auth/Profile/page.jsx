// "use client";
// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { useRouter } from "next/navigation";
// import ManageUser from "@/database/auth/ManageUser";
// // import { Tab } from "@headlessui/react";
// import {
//   UserCircleIcon,
//   KeyIcon,
//   LogOutIcon,
//   ArrowLeftIcon,
// } from "lucide-react";

// import Tabs from "@mui/material/Tabs";
// import Tab from "@mui/material/Tab";
// import Typography from "@mui/material/Typography";
// import Box from "@mui/material/Box";
// import IconButton from "@mui/material/IconButton";
// import CloseIcon from "@mui/icons-material/Close";

// function TabPanel(props) {
//   const { children, value, index, ...other } = props;

//   return (
//     <div
//       role="tabpanel"
//       hidden={value !== index}
//       id={`vertical-tabpanel-${index}`}
//       aria-labelledby={`vertical-tab-${index}`}
//       {...other}
//     >
//       {value === index && (
//         <Box sx={{ p: 3 }}>
//           <Typography>{children}</Typography>
//         </Box>
//       )}
//     </div>
//   );
// }

// function a11yProps(index) {
//   return {
//     id: `vertical-tab-${index}`,
//     "aria-controls": `vertical-tabpanel-${index}`,
//   };
// }

// const dietaryRequirements = [
//   "None",
//   "Vegetarian",
//   "Vegan",
//   "Gluten-Free",
//   "Keto",
//   "Halal",
//   "Kosher",
//   ,
//   "Other",
// ];

// const foodAllergies = [
//   "None",
//   "Peanuts",
//   "Tree nuts",
//   "Milk",
//   "Eggs",
//   "Wheat",
//   "Soy",
//   "Fish",
//   "Shellfish",
//   ,
//   "Other",
// ];

// //new Yan has added but its not showing yet
// const interests = [
//   "None",
//   "Peanuts",
//   "Tree nuts",
//   "Milk",
//   "Eggs",
//   "Wheat",
//   "Soy",
//   "Fish",
//   "Shellfish",
//   "Other",
// ];

// const Profile = () => {
//   const [isOtherDietSelected, setIsOtherDietSelected] = useState(false);
//   const [isOtherAllergySelected, setIsOtherAllergySelected] = useState(false);
//   const [activeTab, setActiveTab] = useState("personalDetails");
//   const [loggedIn, setLoggedIn] = useState(false);
//   const router = useRouter();

//   const [otherDiet, setOtherDiet] = useState("");
//   const [otherAllergy, setOtherAllergy] = useState("");

//   const [userEmail, setUserEmail] = useState(null);

//   const [value, setValue] = React.useState(0);

//   const handleChange = (event, newValue) => {
//     setValue(newValue);
//   };

//   const handleTabChange = (tab) => {
//     setActiveTab(tab);
//   };

//   const handleNewPasswordSubmit = (e) => {
//     e.preventDefault();
//     if (formData.newPassword === formData.confirmNewPassword) {
//       ManageUser.editPassword(formData.newPassword, setError);
//     } else {
//       setError("Passwords do not match");
//     }
//   };

//   const handleLogout = () => {
//     ManageUser.logoutUser(setLoggedIn, router);
//   };

//   const [profile, setProfile] = useState({});
//   const [formData, setFormData] = useState({
//     newPassword: "",
//     confirmNewPassword: "",
//   });

//   const getEmailFromLocalStorage = () => {
//     if (typeof window === "undefined") return;

//     const savedEmail = localStorage.getItem("Email");
//     return savedEmail || ""; // Return empty string if no email is found
//   };
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       ManageUser.getProfileData(localStorage.getItem("Email"), setProfile);
//     }

//     // To stop listening for changes (unsubscribe) - optional
//     // return () => unsubscribe();
//   }, []);

//   useEffect(() => {
//     console.log(profile);
//     if (profile.otherDiet) {
//       console.log("profile has other Diet");
//       setOtherDiet(profile.otherDiet);
//       setIsOtherDietSelected(true);
//     }
//     if (profile.otherAllergy) {
//       console.log("profile has other Allergy");
//       setIsOtherAllergySelected(true);
//       setOtherAllergy(profile.otherAllergy);
//     }
//   }, [profile]);

//   const handleProfileChange = (e) => {
//     const { name, value } = e.target;
//     console.log(name, value);
//     //new Yan added in this code
//     if (name === "Diet") {
//       setIsOtherDietSelected(value === "Other");
//       if (value !== "Other") {
//         console.log(otherDiet);
//         setOtherDiet(""); // Clear if not "Other"
//       }
//     }

//     if (name === "Allergies") {
//       setIsOtherAllergySelected(value === "Other");
//       if (value !== "Other") {
//         console.log(otherAllergy);
//         setOtherAllergy(""); // Clear if not "Other"
//       }
//     }
//     //end

//     console.log(name, value);
//     // setProfile((prevProfile) => ({
//     //   ...prevProfile,
//     //   [name]: value,
//     // }));

//     setProfile((prevProfile) => ({
//       ...prevProfile,
//       [name]: value,
//       ...(otherAllergy !== "" && { otherAllergy }),
//       ...(otherDiet !== "" && { otherDiet }),
//     }));

//     // if (otherAllergy !== "") {
//     //   setProfile((prevProfile) => ({
//     //     ...prevProfile,
//     //     [name]: value,
//     //     otherAllergy: otherAllergy if otherAllergy !== ""
//     //     otherDiet: otherDiet if otherDiet !== ""
//     //   }));
//     // }
//   };

//   useEffect(() => {
//     console.log(profile);
//   }, [profile]);

//   // const handleChange = (e) => {
//   //   const { name, value } = e.target;
//   //   setFormData((prevData) => ({
//   //     ...prevData,
//   //     [name]: value,
//   //   }));
//   // };

//   const handleEditProfileSubmit = async (e) => {
//     e.preventDefault();

//     if (typeof window === "undefined") return;

//     if (otherAllergy !== "") {
//       // Update the profile with the otherAllergy field
//       setProfile((prevProfile) => ({
//         ...prevProfile, // Keep the existing profile fields
//         otherAllergy: otherAllergy, // Add or update the otherAllergy field
//       }));
//     }

//     if (otherDiet !== "") {
//       // Update the profile with the otherAllergy field
//       setProfile((prevProfile) => ({
//         ...prevProfile, // Keep the existing profile fields
//         otherDiet: otherDiet, // Add or update the otherAllergy field
//       }));
//     }
//     const success = await ManageUser.editProfileData(profile.id, profile);
//     if (success) {
//       if (success) {
//         // If the profile update was successful, fetch the updated profile data
//         ManageUser.getProfileData(localStorage.getItem("Email"), setProfile);
//         //// If the profile update was successful, fetch the updated profile data
//         //ManageUser.getProfileData("tshepo@tshepo.com", setProfile);
//       } else {
//         // Handle failure
//       }

//       // If the profile update was successful, fetch the updated profile data
//       ManageUser.getProfileData("tshepo@tshepo.com", setProfile);
//     } else {
//       // Handle failure

//       setError("Passwords do not match");
//     }
//   };

//   // const handleLogout = () => {
//   //   ManageUser.logoutUser(setProfile, router);
//   // };

//   const handleBack = () => {
//     router.back();
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -20 }}
//       className="min-h-screen bg-gradient-to-br from-[#f0f4e1] via-gray-100 to-[#e6edc3] py-12 px-4 sm:px-6 lg:px-8"
//     >
//       <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-[0px_15px_30px_rgba(0,0,0,0.2)] overflow-hidden">
//         <div className="px-4 py-5 sm:px-6 flex items-center bg-gray-50">
//           <button
//             onClick={handleBack}
//             className="text-gray-400 hover:text-gray-500 mr-4"
//           >
//             <ArrowLeftIcon className="h-6 w-6" />
//           </button>
//           <h2 className="text-2xl font-bold text-gray-900">User Settings</h2>
//         </div>
//         <Tab.Group>
//           <div className="border-b border-gray-200">
//             <Tab.List className="flex">
//               <Tab
//                 className={({ selected }) =>
//                   `${
//                     selected
//                       ? "border-[#bcd727] text-[#bcd727]"
//                       : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//                   }
//                  flex-1 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`
//                 }
//               >
//                 {({ selected }) => (
//                   <motion.div
//                     initial={false}
//                     animate={{ scale: selected ? 1.05 : 1 }}
//                     transition={{ type: "spring", stiffness: 300, damping: 20 }}
//                     className="flex items-center justify-center"
//                   >
//                     <UserCircleIcon className="w-5 h-5 mr-2" />
//                     Personal Details
//                   </motion.div>
//                 )}
//               </Tab>
//               <Tab
//                 className={({ selected }) =>
//                   `${
//                     selected
//                       ? "border-[#bcd727] text-[#bcd727]"
//                       : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//                   }
//                  flex-1 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`
//                 }
//               >
//                 {({ selected }) => (
//                   <motion.div
//                     initial={false}
//                     animate={{ scale: selected ? 1.05 : 1 }}
//                     transition={{ type: "spring", stiffness: 300, damping: 20 }}
//                     className="flex items-center justify-center"
//                   >
//                     <KeyIcon className="w-5 h-5 mr-2" />
//                     Password Reset
//                   </motion.div>
//                 )}
//               </Tab>
//               <Tab
//                 className={({ selected }) =>
//                   `${
//                     selected
//                       ? "border-[#bcd727] text-[#bcd727]"
//                       : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//                   }
//                  flex-1 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`
//                 }
//               >
//                 {({ selected }) => (
//                   <motion.div
//                     initial={false}
//                     animate={{ scale: selected ? 1.05 : 1 }}
//                     transition={{ type: "spring", stiffness: 300, damping: 20 }}
//                     className="flex items-center justify-center"
//                   >
//                     <LogOutIcon className="w-5 h-5 mr-2" />
//                     Log Out
//                   </motion.div>
//                 )}
//               </Tab>
//             </Tab.List>
//           </div>
//           <Tab.Panels>
//             <Tab.Panel>
//               <motion.form
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ duration: 0.5 }}
//                 onSubmit={handleEditProfileSubmit}
//                 className="space-y-6 p-8" // Increased padding for a wider look
//               >
//                 <div>
//                   <label
//                     htmlFor="Name"
//                     className="block text-sm font-medium text-gray-700"
//                   >
//                     First Name
//                   </label>
//                   <input
//                     type="text"
//                     name="Name"
//                     id="Name"
//                     value={profile.Name || ""}
//                     onChange={handleProfileChange}
//                     className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#bcd727] focus:border-[#bcd727] sm:text-sm"
//                   />
//                 </div>
//                 <div>
//                   <label
//                     htmlFor="Surname"
//                     className="block text-sm font-medium text-gray-700"
//                   >
//                     Last Name
//                   </label>
//                   <input
//                     type="text"
//                     name="Surname"
//                     id="Surname"
//                     value={profile.Surname || ""}
//                     onChange={handleProfileChange}
//                     className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#bcd727] focus:border-[#bcd727] sm:text-sm"
//                   />
//                 </div>
//                 <div>
//                   <label
//                     htmlFor="Email"
//                     className="block text-sm font-medium text-gray-700"
//                   >
//                     Email
//                   </label>
//                   <input
//                     type="email"
//                     name="Email"
//                     id="Email"
//                     value={profile.Email || ""}
//                     onChange={handleProfileChange}
//                     disabled
//                     className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50 text-gray-500 sm:text-sm"
//                   />
//                 </div>
//                 <div>
//                   <label
//                     htmlFor="Diet"
//                     className="block text-sm font-medium text-gray-700"
//                   >
//                     Dietary Requirements
//                   </label>
//                   <select
//                     name="Diet"
//                     id="Diet"
//                     value={profile.Diet || ""}
//                     onChange={handleProfileChange}
//                     className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#bcd727] focus:border-[#bcd727] sm:text-sm rounded-md"
//                   >
//                     {dietaryRequirements.map((diet) => (
//                       <option key={diet} value={diet}>
//                         {diet}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 <div>
//                   <label
//                     htmlFor="Allergies"
//                     className="block text-sm font-medium text-gray-700"
//                   >
//                     Food Allergies
//                   </label>
//                   <select
//                     name="Allergies"
//                     id="Allergies"
//                     value={profile.Allergies || ""}
//                     onChange={handleProfileChange}
//                     className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#bcd727] focus:border-[#bcd727] sm:text-sm rounded-md"
//                   >
//                     {foodAllergies.map((allergy) => (
//                       <option key={allergy} value={allergy}>
//                         {allergy}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 <div>
//                   <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     type="submit"
//                     className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#bcd727] hover:bg-[#a0b826] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#bcd727]"
//                   >
//                     Save Personal Details
//                   </motion.button>
//                 </div>
//               </motion.form>
//             </Tab.Panel>
//             <Tab.Panel>
//               <motion.form
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ duration: 0.5 }}
//                 onSubmit={handleNewPasswordSubmit}
//                 className="space-y-6 p-8" // Increased padding for a wider look
//               >
//                 <div>
//                   <label
//                     htmlFor="newPassword"
//                     className="block text-sm font-medium text-gray-700"
//                   >
//                     New Password
//                   </label>
//                   <input
//                     type="password"
//                     name="newPassword"
//                     id="newPassword"
//                     value={formData.newPassword}
//                     onChange={handleChange}
//                     className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#bcd727] focus:border-[#bcd727] sm:text-sm"
//                   />
//                 </div>
//                 <div>
//                   <label
//                     htmlFor="confirmNewPassword"
//                     className="block text-sm font-medium text-gray-700"
//                   >
//                     Confirm New Password
//                   </label>
//                   <input
//                     type="password"
//                     name="confirmNewPassword"
//                     id="confirmNewPassword"
//                     value={formData.confirmNewPassword}
//                     onChange={handleChange}
//                     className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#bcd727] focus:border-[#bcd727] sm:text-sm"
//                   />
//                 </div>
//                 {error && (
//                   <motion.div
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     className="text-red-600 text-sm"
//                   >
//                     {error}
//                   </motion.div>
//                 )}
//                 <div>
//                   <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     type="submit"
//                     className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#bcd727] hover:bg-[#a0b826] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#bcd727]"
//                   >
//                     Save New Password
//                   </motion.button>
//                 </div>
//               </motion.form>
//             </Tab.Panel>
//             <Tab.Panel>
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ duration: 0.5 }}
//                 className="p-6 space-y-6"
//               >
//                 <p className="text-sm text-gray-500">
//                   Are you sure you want to log out?
//                 </p>
//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   onClick={handleLogout}
//                   className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
//                 >
//                   Log out
//                 </motion.button>
//               </motion.div>
//             </Tab.Panel>
//           </Tab.Panels>
//         </Tab.Group>
//       </div>
//     </motion.div>
//   );
// };

// export default Profile;

"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import ManageUser from "@/database/auth/ManageUser";
import InterestSelection from "../../../_Components/InterestsSelection";
import { Tab } from "@headlessui/react";
import {
  UserCircleIcon,
  KeyIcon,
  LogOutIcon,
  ArrowLeftIcon,
} from "lucide-react";

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

const Profile = () => {
  const [profile, setProfile] = useState({});
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });
  const [error, setError] = useState(null);
  const router = useRouter();

  const [isOtherDietSelected, setIsOtherDietSelected] = useState(false);
  const [isOtherAllergySelected, setIsOtherAllergySelected] = useState(false);

  const [otherDiet, setOtherDiet] = useState("");
  const [otherAllergy, setOtherAllergy] = useState("");

  const [selectedInterests, setSelectedInterests] = useState([]);

  useEffect(() => {
    ManageUser.getProfileData(localStorage.getItem("Email"), setProfile);
  }, []);

  useEffect(() => {
    // ManageUser.getProfileData(localStorage.getItem("Email"), setProfile);

    console.log("My Interests: ", profile.Interests);
    setSelectedInterests(profile.Interests);
  }, [profile]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditProfileSubmit = async (e) => {
    e.preventDefault();
    const success = await ManageUser.editProfileData(
      profile.id,
      profile,
      selectedInterests
    );
    if (success) {
      ManageUser.getProfileData(profile.Email, setProfile);
    }
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
                className="space-y-6 p-8" // Increased padding for a wider look
              >
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
                <div>
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
                      onChange={(e) => setOtherDiet(e.target.value)}
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
                      onChange={(e) => setOtherAllergy(e.target.value)}
                      required
                    />
                  </div>
                )}

                <div>
                  {selectedInterests ? (
                    <>
                      <InterestSelection
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
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                onSubmit={handleNewPasswordSubmit}
                className="space-y-6 p-8" // Increased padding for a wider look
              >
                <div>
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
                </div>
                {error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-600 text-sm"
                  >
                    {error}
                  </motion.div>
                )}
                <div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#bcd727] hover:bg-[#a0b826] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#bcd727]"
                  >
                    Save New Password
                  </motion.button>
                </div>
              </motion.form>
            </Tab.Panel>
            <Tab.Panel>
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
    </motion.div>
  );
};

export default Profile;
