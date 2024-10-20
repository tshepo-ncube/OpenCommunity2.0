"use client";
import React, { useEffect, useState } from "react";
import UserDB from "@/database/community/users"; // Adjust the import path accordingly

import Header from "../../../_Components/header";
import CollapsableSidebar from "@/_Components/CollapsableSidebar";
import { motion } from "framer-motion";
import { AiOutlineInfoCircle } from "react-icons/ai";
import Navbar2 from "@/_Components/NavBar2";
import Confetti from "react-confetti"; // Corrected import statement

const Page = () => {
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [typewriterText, setTypewriterText] = useState("");
  const [skipTypewriter, setSkipTypewriter] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  // Added state to track window size for Confetti component
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });

  const fullMessage =
    "Congratulations to everyone who made the leaderboard! The results are as follows ...";

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await UserDB.getAllUsers();
        const processedUsers = usersData
          .map((user) => ({
            ...user,
            Points: isNaN(Number(user.Points)) ? 0 : Number(user.Points),
          }))
          .sort((a, b) => b.Points - a.Points);
        setUsers(processedUsers);
      } catch (error) {
        console.error("Error fetching users: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Effect to set window size for Confetti component
  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });

      const handleResize = () => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };

      window.addEventListener("resize", handleResize);

      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  useEffect(() => {
    if (!loading) {
      if (skipTypewriter) {
        setShowLeaderboard(true);
      } else {
        let i = 0;
        const intervalId = setInterval(() => {
          setTypewriterText(fullMessage.substring(0, i + 1));
          i++;
          if (i === fullMessage.length) {
            clearInterval(intervalId);
            setTimeout(() => {
              setShowLeaderboard(true);
            }, 3000);
          }
        }, 50);
      }
    }
  }, [loading, skipTypewriter]);

  const handleSkip = () => {
    setSkipTypewriter(true);
  };

  const handleInfoClick = () => {
    setShowInfo(!showInfo);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-white via-[#f0f0f0] to-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  // Limit users to top 10
  const topTenUsers = users.slice(0, 10);

  // Prepare top users for the podium
  const firstPlaceUser = topTenUsers[0];
  const secondPlaceUser = topTenUsers[1];
  const thirdPlaceUser = topTenUsers[2];

  // Arrange users for display: [Second Place, First Place, Third Place]
  const displayTopUsers = [secondPlaceUser, firstPlaceUser, thirdPlaceUser];

  // Other users (positions 4 to 10)
  const otherUsers = topTenUsers.slice(3);

  const getInitials = (name, surname) => {
    return `${name.charAt(0)}${surname.charAt(0)}`.toUpperCase();
  };

  const getIcon = (points) => {
    if (points >= 1000) return "👑";
    if (points >= 500) return "🏆";
    if (points >= 150) return "💎";
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#f0f0f0] to-[#bcd727]">
      <Navbar2 isHome={true} />
      <div className="flex min-h-screen bg-gray-50 mt-4">
        <div className="flex-grow mt-16 p-6">
          <main className="container mx-auto px-4 py-12">
            {/* Information Icon */}
            <div className="relative">
              <AiOutlineInfoCircle
                onClick={handleInfoClick}
                className="absolute top-0 right-4 text-2xl cursor-pointer"
              />
              {showInfo && (
                <div className="absolute top-12 right-4 bg-white text-black p-4 rounded shadow-lg w-64 z-50">
                  <h3 className="text-lg font-bold">
                    Leaderboard Point Rules
                  </h3>
                  <p className="mt-2">1st Class 👑: 1000 points +</p>
                  <p>2nd Class🏆: 500 points +</p>
                  <p>3rd Class 💎: 150 points +</p>
                  <p></p>
                  <p className="font-bold">Earn points by:</p>
                  <ul>
                    <li>• Joining a community (+5)</li>
                    <li>• RSVP to an event (+15)</li>
                    <li>• Voting on a poll (+10)</li>
                    <li>• Rating a past event (+10)</li>
                  </ul>
                </div>
              )}
            </div>

            {!showLeaderboard ? (
              <div className="relative flex items-start justify-center min-h-screen">
                {/* Confetti Animation */}
                <Confetti
                  width={windowSize.width}
                  height={windowSize.height}
                  style={{ position: "fixed", top: 0, left: 0, zIndex: 50 }}
                />

                <button
                  onClick={handleSkip}
                  className="absolute top-3 left-3 px-8 py-3 bg-white text-black border border-[#bcd727] rounded-xl shadow-lg hover:bg-[#bcd727] hover:text-white hover:shadow-xl transition-all duration-300"
                >
                  Skip
                </button>

                <div className="text-center flex flex-col">
                  <div className="typewriter-container mt-20">
                    <span className="typewriter-text">{typewriterText}</span>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-center items-end space-x-8 mb-16">
                  {displayTopUsers.map((user, index) => (
                    user && (
                      <motion.div
                        key={index}
                        className={`bg-white rounded-2xl shadow-lg overflow-hidden ${
                          index === 1
                            ? "h-[24rem] w-[18rem]"
                            : "h-[22rem] w-[16rem]"
                        } ${
                          index === 1
                            ? "order-2 hover:scale-105"
                            : index === 0
                            ? "order-1 hover:scale-105"
                            : "order-3 hover:scale-105"
                        } transition-transform duration-300 transform`}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.2, duration: 0.5 }}
                      >
                        <div
                          className={`h-2 ${
                            index === 1
                              ? "bg-[#FFD700]"
                              : index === 0
                              ? "bg-[#C0C0C0]"
                              : "bg-[#CD7F32]"
                          }`}
                        ></div>
                        <div className="p-6">
                          <div className="podium-medal text-6xl mb-4 text-center relative">
                            <div className="medal-container relative">
                              <span className="medal relative z-10">
                                {index === 1
                                  ? "🥇"
                                  : index === 0
                                  ? "🥈"
                                  : "🥉"}
                              </span>
                              <div
                                className={`sparkle sparkle-${index + 1}`}
                              ></div>
                            </div>
                          </div>
                          <div className="profile-picture mx-auto mb-4">
                            <img
                              src={
                                user.profileImage ||
                                "https://static.vecteezy.com/system/resources/thumbnails/005/544/770/small/profile-icon-design-free-vector.jpg"
                              }
                              alt="Profile Icon"
                              className="w-[5.5rem] h-[5.5rem] rounded-full cursor-pointer hover:bg-[#bcd727] hover:scale-110 p-1"
                            />
                          </div>
                          <h2
                            className={`text-xl font-semibold mb-1 text-center ${
                              index === 1
                                ? "podium-name-1"
                                : index === 0
                                ? "podium-name-2"
                                : "podium-name-3"
                            }`}
                          >
                            {user.Name || "N/A"}
                          </h2>
                          <p className="text-lg mb-2 text-center text-gray-600">
                            {user.Surname || "N/A"}
                          </p>
                          <p className="text-xl font-bold text-center">
                            {user.Points} Points
                          </p>
                        </div>
                      </motion.div>
                    )
                  ))}
                </div>

                <div className="space-y-3">
                  {otherUsers.map((user, index) => (
                    user && (
                      <motion.div
                        key={index}
                        className="bg-white rounded-lg shadow-sm overflow-hidden p-4 flex items-center justify-between border border-gray-200 hover:bg-gray-100 transform hover:scale-105 transition-transform duration-300"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: 0.2 + index * 0.1,
                          duration: 0.5,
                        }}
                      >
                        <div className="flex items-center">
                          <div className="position-number mr-4 text-xl font-bold text-gray-400">
                            {index + 4}
                          </div>
                          <div className="profile-picture-right mr-4 relative">
                            <img
                              src={
                                user.profileImage ||
                                "https://static.vecteezy.com/system/resources/thumbnails/005/544/770/small/profile-icon-design-free-vector.jpg"
                              }
                              alt="Profile Icon"
                              className="w-[3.5rem] h-[3.5rem] rounded-full cursor-pointer hover:bg-[#bcd727] hover:scale-110 p-1"
                            />
                          </div>
                          <div>
                            <div className="text-lg font-semibold text-gray-800">
                              {user.Name || "N/A"} {user.Surname || "N/A"}{" "}
                              {getIcon(user.Points)}
                            </div>
                            <div className="text-sm text-gray-600">
                              {user.Points} Points
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  ))}
                </div>
              </>
            )}
          </main>

          <style jsx global>{`
            @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap");

            .typewriter-container {
              display: inline-block;
              position: relative;
            }

            .typewriter-text {
              font-size: 4rem;
              font-family: "Poppins";
              font-weight: 400;
              color: #333;
              white-space: pre-wrap;
              border-right: 4px solid #333;
              animation: cursor-blink 0.7s step-start infinite;
              letter-spacing: -0.5px;
              transform: scaleX(0.95);
            }

            @keyframes cursor-blink {
              0% {
                border-right-color: transparent;
              }
              100% {
                border-right-color: #333;
              }
            }

            .profile-picture,
            .profile-picture-right {
              display: flex;
              justify-content: center;
              align-items: center;
              background-color: #f0f0f0;
              border-radius: 50%;
              position: relative;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .profile-picture {
              width: 80px;
              height: 80px;
              font-size: 24px;
            }
            .profile-picture-right {
              width: 45px;
              height: 45px;
              font-size: 18px;
            }
            .podium-name-1 {
              color: #ffd700;
              text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            .podium-name-2 {
              color: #c0c0c0;
              text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            .podium-name-3 {
              color: #cd7f32;
              text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            .podium-medal {
              position: relative;
            }
            .medal-container {
              position: relative;
              display: inline-block;
            }
            .medal {
              font-size: 6rem;
              position: relative;
              z-index: 10;
            }
            .sparkle {
              position: absolute;
              top: 50%;
              left: 50%;
              width: 100%;
              height: 100%;
              pointer-events: none;
              overflow: hidden;
              transform: translate(-50%, -50%);
              z-index: 20;
            }
            .sparkle::before,
            .sparkle::after {
              content: "";
              position: absolute;
              width: 30px;
              height: 30px;
              background: radial-gradient(
                circle,
                rgba(255, 255, 255, 0.8) 0%,
                rgba(255, 255, 255, 0) 70%
              );
              clip-path: polygon(
                50% 0%,
                61% 35%,
                98% 35%,
                68% 57%,
                79% 91%,
                50% 70%,
                21% 91%,
                32% 57%,
                2% 35%,
                39% 35%
              );
              opacity: 0.9;
              transform: scale(0);
              animation: sparkle-animation 2s infinite;
            }
            .sparkle-1::before {
              top: 10%;
              left: 10%;
              animation-delay: 0s;
            }
            .sparkle-1::after {
              top: 60%;
              left: 20%;
              animation-delay: 0.5s;
            }
            .sparkle-2::before {
              top: 20%;
              left: 20%;
              animation-delay: 0.2s;
            }
            .sparkle-2::after {
              top: 70%;
              left: 30%;
              animation-delay: 0.7s;
            }
            .sparkle-3::before {
              top: 15%;
              left: 15%;
              animation-delay: 0.3s;
            }
            .sparkle-3::after {
              top: 55%;
              left: 40%;
              animation-delay: 0.8s;
            }
            @keyframes sparkle-animation {
              0% {
                opacity: 1;
                transform: scale(0.8);
              }
              50% {
                opacity: 1;
                transform: scale(1.4);
              }
              100% {
                opacity: 0;
                transform: scale(0.8);
              }
            }
          `}</style>
        </div>
      </div>
    </div>
  );
};

export default Page;
