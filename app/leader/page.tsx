"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import UserDB from "@/database/community/users";
import Header from "../_Components/header";

const Page = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-white via-[#f0f0f0] to-[#bcd727]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  // Reorder users so the top user is in the middle
  const topUsers = [...users.slice(0, 3)];
  // Switch first and second place
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
        {/* Top Users */}
        <div className="flex justify-center items-end space-x-8 mb-20">
          {topUsers.map((user, index) => (
            <motion.div
              key={index}
              className={`bg-white rounded-2xl shadow-2xl overflow-hidden ${
                index === 1 ? "h-96 w-80" : "h-88 w-72"
              } ${
                index === 0 ? "order-1" : index === 1 ? "order-2" : "order-3"
              }`}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
            >
              <div
                className={`h-3 ${
                  index === 1
                    ? "bg-[#FFD700]"
                    : index === 0
                    ? "bg-[#C0C0C0]"
                    : "bg-[#CD7F32]"
                }`}
              ></div>
              <div className="p-8">
                <div className="podium-medal text-7xl mb-6 text-center">
                  <div className="medal-container">
                    <span className="medal">
                      {index === 1 ? "🥇" : index === 0 ? "🥈" : "🥉"}
                    </span>
                    <div className={`sparkle sparkle-${index + 1}`}></div>
                  </div>
                </div>
                <div className="profile-picture mx-auto mb-6">
                  {getInitials(user.Name, user.Surname)}
                  {getIcon(user.Points) && (
                    <span className="icon absolute -top-2 -right-2 text-3xl">
                      {getIcon(user.Points)}
                    </span>
                  )}
                </div>
                <h2
                  className={`text-2xl font-semibold mb-2 text-center podium-name-${
                    index + 1
                  }`}
                >
                  {user.Name || "N/A"}
                </h2>
                <p className="text-xl mb-3 text-center text-gray-600">
                  {user.Surname || "N/A"}
                </p>
                <p className="text-2xl font-bold text-center">
                  {user.Points} Points
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Other Users */}
        <div className="space-y-4">
          {otherUsers.map((user, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden p-6 flex items-center justify-between border border-gray-200"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
            >
              <div className="flex items-center">
                <div className="position-number mr-6 text-2xl font-bold text-gray-400">
                  {index + 4}
                </div>
                <div className="profile-picture-right mr-6">
                  {getInitials(user.Name, user.Surname)}
                  {getIcon(user.Points) && (
                    <span className="icon-right absolute -top-1 -right-1 text-xl">
                      {getIcon(user.Points)}
                    </span>
                  )}
                </div>
                <div className="user-name-surname">
                  <p className="text-xl font-medium">
                    {user.Name || "N/A"} {user.Surname || "N/A"}
                  </p>
                </div>
              </div>
              <div className="user-points text-xl font-bold text-blue-600">
                {user.Points} Points
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      <style jsx>{`
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
          width: 100px;
          height: 100px;
          font-size: 32px;
        }
        .profile-picture-right {
          width: 50px;
          height: 50px;
          font-size: 20px;
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
        .sparkle {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          overflow: hidden;
        }
        .sparkle::before,
        .sparkle::after {
          content: "";
          position: absolute;
          width: 25px;
          height: 25px;
          background-color: #fff;
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
          top: 0%;
          left: 0%;
          animation-delay: 0s;
        }
        .sparkle-1::after {
          top: 70%;
          left: 25%;
          animation-delay: 0.5s;
        }
        .sparkle-2::before {
          top: 20%;
          left: 20%;
          animation-delay: 0.2s;
        }
        .sparkle-2::after {
          top: 60%;
          left: 35%;
          animation-delay: 0.7s;
        }
        .sparkle-3::before {
          top: 15%;
          left: 10%;
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
