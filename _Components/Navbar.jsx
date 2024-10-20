import Link from "next/link";
import React, { useState, useEffect } from "react";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { IconButton, Switch, Typography } from "@mui/material";
import { MdDarkMode } from "react-icons/md";
import ManageUser from "@/database/auth/ManageUser";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

const Navbar = ({ isHome }) => {
  const [nav, setNav] = useState(false);
  const [color, setColor] = useState("#0096FF");
  const [textColor, setTextColor] = useState("white");
  const [signedIn, setSignedIn] = useState(null);
  const [profile, setProfile] = useState({});
  const [user, setUser] = useState(null);
  const [userCommunities, setUserCommunities] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminToggle, setShowAdminToggle] = useState(false);

  useEffect(() => {
    console.log("Navbar - Getting Profile Data...");
    ManageUser.getProfileData(
      localStorage.getItem("Email"),
      setProfile,
      setUserCommunities,
      (isAdminUser) => {
        setShowAdminToggle(isAdminUser);
        if (isAdminUser) {
          const savedAdminView = localStorage.getItem("isAdminView");
          setIsAdmin(savedAdminView ? JSON.parse(savedAdminView) : false);
        } else {
          setIsAdmin(false);
        }
      }
    );
  }, []);

  useEffect(() => {
    console.log("Profile :", profile);
  }, [profile]);

  const handleNav = () => {
    setNav(!nav);
  };

  const handleLogout = () => {
    console.log("Handle logout...");
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        window.location.href = "http://localhost:3000/sign-in";
      })
      .catch((error) => {
        // Handle error
      });
  };

  const handleToggleChange = () => {
    setIsAdmin((prev) => {
      const newState = !prev;
      localStorage.setItem("isAdminView", JSON.stringify(newState));
      if (newState) {
        window.location.href = "/admin";
      } else {
        window.location.href = "/Home";
      }
      return newState;
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setScrolling(true);
      } else {
        setScrolling(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const [scrolling, setScrolling] = useState(false);

  return (
    <div
      className={`${
        isHome ? `${scrolling ? "bg-black z-90" : "z-90"}` : "bg-black z-90" // Change this line to always be black
      } fixed left-0 top-0 w-full z-100 ease-in duration-300`}
    >
      <div className="max-w-[1240px] m-auto flex justify-between items-center p-4 text-white">
        <Link href="/Home">
          <div className="relative text-center">
            <h2 className="text-4xl font-bold flex space-x-1">
              <span className="text-white px-2 py-1">open</span>
              <span
                className="text-white bg-green-400 px-2 py-1 rounded-tl-md rounded-tr-md rounded-bl-3xl rounded-br-md"
                style={{ backgroundColor: "#bcd727" }}
              >
                community
              </span>
            </h2>
          </div>
        </Link>

        <ul
          style={{ color: `${textColor}` }}
          className="hidden sm:flex items-center"
        >
          {!isAdmin ? (
            <>
              <li className="p-4 text-white">
                <Link
                  href="/Home"
                  className="py-2 px-4 text-white hover:bg-[#bcd727] hover:rounded-lg"
                >
                  Home
                </Link>
              </li>
              <li className="p-4 text-white">
                <Link
                  href="/auth/Leaderboard"
                  className="py-2 px-4 text-white hover:bg-[#bcd727] hover:rounded-lg"
                >
                  Leaderboard
                </Link>
              </li>
              <li className="p-4 text-white">
                <Link
                  href="/auth/RecommendCommunity"
                  className="py-2 px-4 text-white hover:bg-[#bcd727] hover:rounded-lg"
                >
                  Recommend Community
                </Link>
              </li>
            </>
          ) : (
            <>
              <li className="p-4 text-white">
                <Link
                  href="/admin"
                  className="py-2 px-4 text-white hover:bg-[#bcd727] hover:rounded-lg"
                >
                  Home
                </Link>
              </li>
              <li className="p-4 text-white">
                <Link
                  href="/admin/RecommendedCommunities"
                  className="py-2 px-4 text-white hover:bg-[#bcd727] hover:rounded-lg"
                >
                  View Recommendations
                </Link>
              </li>
            </>
          )}
          {showAdminToggle && (
            <li className="p-4 flex items-center">
              <Switch
                checked={isAdmin}
                onChange={handleToggleChange}
                sx={{
                  "& .MuiSwitch-switchBase": {
                    color: "#ffffff",
                  },
                  "& .MuiSwitch-switchBase.Mui-checked": {
                    color: "#bcd727",
                  },
                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                    backgroundColor: "#bcd727",
                  },
                  "& .MuiSwitch-track": {
                    backgroundColor: "#ffffff",
                  },
                }}
              />
              <Typography sx={{ color: "white", ml: 1 }}>
                {isAdmin ? "Admin View" : "User View"}
              </Typography>
            </li>
          )}
          <Link href="/auth/Profile" className="p-2 mt-[-5px]">
            <div className="flex items-center ml-4">
              <img
                src={
                  profile.profileImage
                    ? profile.profileImage
                    : "https://static.vecteezy.com/system/resources/thumbnails/005/544/770/small/profile-icon-design-free-vector.jpg"
                }
                alt="Profile Icon"
                className="w-12 h-12 rounded-full cursor-pointer bg-[#bcd727] hover:bg-[#bcd727] hover:scale-110 p-1"
              />
            </div>
          </Link>
        </ul>

        {/* Mobile Button */}
        <div onClick={handleNav} className="block sm:hidden z-10">
          {nav ? (
            <AiOutlineClose size={20} style={{ color: `${textColor}` }} />
          ) : (
            <AiOutlineMenu size={20} style={{ color: `${textColor}` }} />
          )}
        </div>
        {/* Mobile Menu */}
        <div
          className={
            nav
              ? "sm:hidden absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center w-full h-screen bg-blue-500 text-center ease-in duration-300"
              : "sm:hidden absolute top-0 left-[-100%] right-0 bottom-0 flex justify-center items-center w-full h-screen bg-blue-500 text-center ease-in duration-300"
          }
        >
          <ul>
            {!isAdmin ? (
              <>
                <li
                  onClick={handleNav}
                  className="p-4 text-4xl hover:text-gray-500"
                >
                  <Link href="/Home">Home</Link>
                </li>
                <li
                  onClick={handleNav}
                  className="p-4 text-4xl hover:text-gray-500"
                >
                  <Link href="/auth/Leaderboard">Leaderboard</Link>
                </li>
                <li
                  onClick={handleNav}
                  className="p-4 text-4xl hover:text-gray-500"
                >
                  <Link href="/auth/RecommendCommunity">
                    Recommend Community
                  </Link>
                </li>
              </>
            ) : (
              <li
                onClick={handleNav}
                className="p-4 text-4xl hover:text-gray-500"
              >
                <Link href="/admin/ViewRecommendations">
                  View Recommendations
                </Link>
              </li>
            )}
            <li
              onClick={handleNav}
              className="p-4 text-4xl hover:text-gray-500"
            >
              <Link href="/auth/Profile">Profile</Link>
            </li>
            {showAdminToggle && (
              <li className="p-4 text-4xl hover:text-gray-500">
                <div className="flex items-center justify-center">
                  <Switch
                    checked={isAdmin}
                    onChange={handleToggleChange}
                    sx={{
                      "& .MuiSwitch-switchBase.Mui-checked": {
                        color: "#bcd727",
                      },
                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                        {
                          backgroundColor: "#bcd727",
                        },
                    }}
                  />
                  <Typography sx={{ color: "white", ml: 1 }}>
                    {isAdmin ? "Admin View" : "User View"}
                  </Typography>
                </div>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
