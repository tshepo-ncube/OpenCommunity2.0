"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { IconButton } from "@mui/material";
import { MdDarkMode } from "react-icons/md";

import ManageUser from "@/database/auth/ManageUser";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

const provider = new GoogleAuthProvider();

const Navbar = ({ isHome }) => {
  const [nav, setNav] = useState(false);
  const [color, setColor] = useState("#0096FF");
  const [textColor, setTextColor] = useState("white");
  const [signedIn, setSignedIn] = useState(null);
  const [profile, setProfile] = useState({});
  const [user, setUser] = useState(null);
  const [userCommunities, setUserCommunities] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    console.log("Navbar - Getting Profile Data...");

    ManageUser.getProfileData(
      localStorage.getItem("Email"),
      setProfile,
      setUserCommunities,
      setIsAdmin
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
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        window.location.href = "http://localhost:3000/sign-in";
      })
      .catch((error) => {
        // An error happened.
      });
  };

  const handleSignIn = () => {
    console.log("handle signIn");
  };

  useEffect(() => {
    const changeColor = () => {};
    window.addEventListener("scroll", changeColor);
  }, []);
  const [scrolling, setScrolling] = useState(false);

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
  return (
    <div className="bg-black fixed left-0 top-0 w-full z-100 ease-in duration-300">
      <div
        className="max-w-[1240px] m-auto flex justify-between items-center p-4 text-white"
        style={{}}
      >
        <Link href="/Home">
          {!scrolling ? (
            <>
              <div className="relative text-center">
                <h2 className="text-4xl font-bold flex space-x-1">
                  <span className="text-white  px-2 py-1 ">open </span>
                  <span
                    className="text-white bg-black-400 px-2 py-1 rounded-tl-md rounded-tr-md rounded-bl-3xl rounded-br-md"
                    style={{ backgroundColor: "#bcd727" }}
                  >
                    community
                  </span>
                </h2>
                {/* <p className="mt-4 text-gray-600 text-2xl">
                  Connect. Collaborate. Create.
                </p> */}
              </div>
            </>
          ) : (
            <>
              <div className="relative text-center">
                <h2 className="text-4xl font-bold flex space-x-1">
                  <span className="text-white  px-2 py-1 ">open </span>
                  <span
                    className="text-white bg-green-400 px-2 py-1 rounded-tl-md rounded-tr-md rounded-bl-3xl rounded-br-md"
                    style={{ backgroundColor: "#bcd727" }}
                  >
                    community
                  </span>
                </h2>
              </div>
            </>
          )}
        </Link>

        <ul style={{ color: `${textColor}` }} className="hidden sm:flex">
          <li className="p-4 text-white">
            <Link
              href="/Home"
              className="py-2 px-4 text-white hover:bg-[#bcd727] hover:rounded-lg"
            >
              Home
            </Link>
          </li>

          {user ? <></> : <></>}
          {/* ADMIN IS CURRENTLY HARD CODED, ADD Holly's Toggle Button for roles */}
          <li className="p-4">
            <Link
              href="/admin"
              className="py-2 px-4 hover:bg-[#bcd727] hover:rounded-lg"
            >
              Admin
            </Link>
          </li>

          <li className="p-4 text-white ">
            <Link
              href="/auth/Leaderboard"
              className="py-2 px-4 hover:bg-[#bcd727] hover:rounded-lg"
            >
              Leaderboard
            </Link>
          </li>

          <li className="p-4 text-white ">
            <Link
              href="/auth/RecommendCommunity"
              className="py-2 px-4 hover:bg-[#bcd727] hover:rounded-lg"
            >
              Recommend Community
            </Link>
          </li>

          {/* Profile Icon */}
          <Link href="/auth/Profile" className="p-2">
            <div className="hidden sm:flex items-center ml-4">
              <img
                src={
                  profile.profileImage
                    ? profile.profileImage
                    : "https://static.vecteezy.com/system/resources/thumbnails/005/544/770/small/profile-icon-design-free-vector.jpg"
                }
                alt="Profile Icon"
                className="w-12 h-12 rounded-full cursor-pointer hover:bg-[#bcd727] hover:scale-110 p-1"
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
            <li
              onClick={handleNav}
              className="p-4 text-4xl hover:text-gray-500"
            >
              <Link href="/">Home</Link>
            </li>
            <hr style={{ marginTop: 8 }} />

            <hr style={{ marginTop: 8 }} />

            {user ? <></> : <></>}

            <li
              onClick={handleNav}
              className="p-4 text-4xl hover:text-gray-500"
            >
              <Link href="/blog">Blog</Link>
            </li>
            <hr style={{ marginTop: 8 }} />

            <li
              onClick={handleNav}
              className="p-4 text-4xl hover:text-gray-500"
            >
              <Link href="/pricing">Pricing</Link>
            </li>
            <hr style={{ marginTop: 8 }} />

            <hr style={{ marginTop: 8 }} />
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
