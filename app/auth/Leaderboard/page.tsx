"use client";
import React, { useEffect, useState } from "react";
import UserDB from "@/database/community/users"; // Adjust the import path accordingly

import Header from "../../../_Components/header";

const Page = () => {
  const [users, setUsers] = useState<
    {
      Name: string;
      Surname: string;
      Points: number;
    }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await UserDB.getAllUsers();

        const processedUsers = usersData
          .map((user) => {
            const points = Number(user.Points);
            return { ...user, Points: isNaN(points) ? 0 : points };
          })
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
    return <div>Loading...</div>;
  }

  const topUsers = users.slice(0, 3);
  const otherUsers = users.slice(3);

  const getInitials = (name: string, surname: string) => {
    const firstInitial = name.charAt(0).toUpperCase();
    const lastInitial = surname.charAt(0).toUpperCase();
    return `${firstInitial}${lastInitial}`;
  };

  return (
    <div className="page">
      <Header />
      <div className="title-container">
        <h1 className="title">User Leaderboard</h1>
      </div>
      <div className="podium">
        {topUsers.map((user, index) => (
          <div key={index} className={`podium-item podium-item-${index + 1}`}>
            <div className="podium-medal">
              <div className="medal-container">
                <span className={`medal medal-${index + 1}`}>
                  {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                </span>
                <div className={`sparkle sparkle-${index + 1}`}></div>
              </div>
            </div>
            <div className="podium-info">
              <div className="profile-picture">
                {getInitials(user.Name || "", user.Surname || "")}
              </div>
              <div className={`podium-name podium-name-${index + 1}`}>
                {user.Name || "N/A"}
              </div>
              <div className={`podium-surname podium-surname-${index + 1}`}>
                {user.Surname || "N/A"}
              </div>
              <div className="podium-points">{user.Points} Points</div>
            </div>
          </div>
        ))}
      </div>

      <div className="user-list">
        {otherUsers.map((user, index) => (
          <div className="user-item" key={index}>
            <div className="user-position">
              {index + 4}
              <div className="profile-picture-right">
                {getInitials(user.Name || "", user.Surname || "")}
              </div>
            </div>
            <div className="user-name-surname">
              {user.Name || "N/A"} {user.Surname || "N/A"}
            </div>
            <div className="user-points">{user.Points} Points</div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .page {
          font-family: Arial, sans-serif;
          text-align: center;
          padding: 20px;
          background-color: #f4f4f9;
        }
        .title-container {
          margin-bottom: 30px;
        }
        .title {
          font-size: 3rem;
          font-weight: bold;
          color: #bcd727; /* Ensure color is applied here */
        }
        .podium {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: row;
          margin-bottom: 30px;
        }
        .podium-item {
          position: relative;
          margin: 0 10px;
          padding: 20px;
          border-radius: 15px;
          width: 250px;
          background-color: #fff;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          text-align: center;
          transition: transform 0.3s ease;
        }
        .podium-item:hover {
          transform: scale(1.05);
        }
        .podium-item-1 {
          background-color: #fff8e1; /* Light gold */
          border: 3px solid gold;
        }
        .podium-item-2 {
          background-color: #f0f0f0; /* Light silver */
          border: 3px solid silver;
        }
        .podium-item-3 {
          background-color: #fff5f0; /* Light bronze */
          border: 3px solid #cd7f32; /* Bronze */
        }
        .podium-medal {
          font-size: 120px; /* Increase size */
          margin-bottom: 10px;
          position: relative;
        }
        .medal-container {
          position: relative;
          display: inline-block;
        }
        .medal {
          position: relative;
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
          width: 25px; /* Increase size */
          height: 25px; /* Increase size */
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
          opacity: 0.9; /* Increase brightness */
          transform: scale(0);
          animation: sparkle-animation 1.5s infinite;
        }
        .sparkle-1::before {
          top: 5%;
          left: 5%;
          animation-delay: 0s;
        }
        .sparkle-1::after {
          top: 70%;
          left: 25%;
          animation-delay: 0.5s;
        }
        .sparkle-2::before {
          top: 10%;
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
        .podium-info {
          text-align: center;
        }
        .profile-picture {
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background-color: #bcd727;
          color: white;
          font-size: 20px;
          font-weight: bold;
          margin: 0 auto;
          margin-bottom: 10px;
        }
        .profile-picture-right {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background-color: #bcd727;
          color: white;
          font-size: 16px;
          font-weight: bold;
        }
        .podium-name,
        .podium-surname {
          margin: 5px 0;
          font-size: 1.5rem; /* Increase size */
        }
        .podium-name-1,
        .podium-surname-1 {
          font-weight: bold;
          font-size: 1.2rem; /* Increase size for the first place */
        }
        .podium-name-2,
        .podium-surname-2 {
          font-weight: bold;
          font-size: 1.2rem; /* Increase size for the second place */
        }
        .podium-name-3,
        .podium-surname-3 {
          font-weight: bold;
          font-size: 1.2rem; /* Increase size for the third place */
        }
        .podium-points {
          font-size: 1.2rem;
        }
        .user-list {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 30px;
        }
        .user-item {
          display: flex;
          align-items: center;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 8px;
          width: 80%;
          background-color: #fff;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          margin-bottom: 10px;
        }
        .user-position {
          display: flex;
          align-items: center;
          font-size: 1rem;
          margin-right: 10px; /* Space between position number and profile picture */
          width: 50%; /* Adjust the width to accommodate both elements */
        }
        .user-name-surname {
          flex-grow: 1;
          font-size: 1rem;
          margin-right: 10px;
        }
        .user-points {
          font-size: 1rem;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
};

export default Page;
