"use client";
import React, { useEffect, useState } from "react";
import UserDB from "@/database/community/users"; // Adjust the import path accordingly

import Header from "../../../_Components/header";

import { motion } from "framer-motion";
import { AiOutlineInfoCircle } from "react-icons/ai";

const Page = () => {
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [typewriterText, setTypewriterText] = useState("");
  const [skipTypewriter, setSkipTypewriter] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const fullMessage =
    "Congratulations to everyone who made the leaderboard! The results are as follows .....";

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await UserDB.getAllUsers();
        const processedUsers = usersData
          .map((user) => ({
            ...user,
            Points: isNaN(Number(user.Points)) ? 0 : Number(user.Points),
            profileImage: user.profileImage,
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

  useEffect(() => {
    console.log("Processed Users: ", users);
  }, [users]);

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
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-white via-[#f0f0f0] to-[#bcd727]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  const topUsers = [...users.slice(0, 3)];
  topUsers[0] = users[1];
  topUsers[1] = users[0];
  topUsers[2] = users[2];

  const otherUsers = users.slice(3);

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
      <Header />
      <main className="container mx-auto px-4 py-12">
        {/* Information Icon */}
        <div className="relative">
          <AiOutlineInfoCircle
            onClick={handleInfoClick}
            className="absolute top-0 right-4 text-2xl cursor-pointer"
          />
          {showInfo && (
            <div className="absolute top-12 right-4 bg-white text-black p-4 rounded shadow-lg w-64 z-50">
              <h3 className="text-lg font-bold">Leaderboard Point Rules</h3>
              <p className="mt-2">First Class 👑: 1000 points +</p>
              <p>Second Class🏆: 500 points +</p>
              <p>Third Class 💎: 150 points +</p>
              <p></p>
              <p>
                Earn points by Joining a community (+5), RSVP & attend an event
                (+15),
              </p>
              <p>vote on a poll (+10), comment & rate a past event (+10)</p>
            </div>
          )}
        </div>

        {!showLeaderboard ? (
          <div className="relative flex items-start justify-center min-h-screen pt-20">
            <button
              onClick={handleSkip}
              className="absolute top-3 left-3 px-8 py-3 bg-white text-black border border-gray-300 rounded-lg shadow-lg"
            >
              Skip
            </button>
            <div className="text-center flex flex-col">
              <div className="typewriter-container">
                <span className="typewriter-text">{typewriterText}</span>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-center items-end space-x-8 mb-16">
              {topUsers.map((user, index) => (
                <motion.div
                  key={index}
                  className={`bg-white rounded-2xl shadow-lg overflow-hidden ${
                    index === 1 ? "h-[24rem] w-[18rem]" : "h-[22rem] w-[16rem]"
                  } ${
                    index === 0
                      ? "order-1 hover:scale-105"
                      : index === 1
                        ? "order-2 hover:scale-105"
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
                          {index === 1 ? "🥇" : index === 0 ? "🥈" : "🥉"}
                        </span>
                        <div className={`sparkle sparkle-${index + 1}`}></div>
                      </div>
                    </div>
                    <img
                      src={user.profileImage}
                      //src="data:image/png;base64,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"
                      className="profile-picture mx-auto mb-4"
                    >
                      {/* {getInitials(user.Name, user.Surname)}
                      {getIcon(user.Points) && (
                        <span className="icon absolute -top-1 -right-1 text-2xl">
                          {getIcon(user.Points)}
                        </span>
                      )} */}
                    </img>

                    {/* {getInitials(user.Name, user.Surname)}
                    {getIcon(user.Points) && (
                      <span className="icon absolute -top-1 -right-1 text-2xl">
                        {getIcon(user.Points)}
                      </span>
                    )} */}
                    {/* <h2
                      className={`text-xl font-semibold mb-1 text-center podium-name-${
                        index + 1
                      }`}
                    >
                      {user.Name || "N/A"}
                    </h2> */}
                    <p className="text-lg mb-2 text-center text-gray-600">
                      {user.Surname || "N/A"}
                    </p>
                    {/* <p className="text-xl font-bold text-center">
                      {user.Points} Points
                    </p> */}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="space-y-3">
              {otherUsers.map((user, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-lg shadow-sm overflow-hidden p-4 flex items-center justify-between border border-gray-200 hover:bg-gray-100"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                >
                  <div className="flex items-center">
                    <div className="position-number mr-4 text-xl font-bold text-gray-400">
                      {index + 4}
                    </div>
                    <img
                      src={user.profileImage}
                      className="profile-picture-right mr-4"
                    >
                      {/* {getInitials(user.Name, user.Surname)}
                      {getIcon(user.Points) && (
                        <span className="icon-right absolute -top-1 -right-1 text-lg">
                          {getIcon(user.Points)}
                        </span>
                      )} */}
                    </img>

                    <div>
                      <div className="text-lg font-semibold text-gray-800">
                        {user.Name || "N/A"} {user.Surname || "N/A"}
                      </div>
                      <div className="text-sm text-gray-600">
                        {user.Points} Points
                      </div>
                    </div>
                  </div>
                </motion.div>
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
          font-family: "Great Vibes", cursive;
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
  );
};

export default Page;
