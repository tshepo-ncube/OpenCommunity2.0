"use client";
import React, { useEffect, useState } from "react";
import UserDB from "@/database/community/users"; // Adjust the import path accordingly
import Header from "../_Components/header"; // Adjust the import path accordingly

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

  const topUsers = [...users.slice(0, 3)];
  // Swap positions of the top 1 and 2
  const temp = topUsers[0];
  topUsers[0] = topUsers[1];
  topUsers[1] = temp;

  const otherUsers = users.slice(3);

  const getInitials = (name: string, surname: string) => {
    const firstInitial = name.charAt(0).toUpperCase();
    const lastInitial = surname.charAt(0).toUpperCase();
    return `${firstInitial}${lastInitial}`;
  };

  const getIcon = (points: number) => {
    if (points >= 1000) return "👑"; // Crown for 1000 points or more
    if (points >= 500) return "🏆"; // Trophy for 500 points or more
    if (points >= 150) return "💎"; // Diamond for 150 points or more
    return null;
  };

  return (
    <div className="page">
      <Header />
      <div className="title-container"></div>
      <div className="podium">
        {topUsers.map((user, index) => (
          <div
            key={index}
            className={`podium-item podium-item-${index + 1} ${
              index === 1 ? "podium-item-middle" : ""
            }`}
          >
            <div className="podium-medal">
              <div className="medal-container">
                <span className={`medal medal-${index + 1}`}>
                  {index === 0 ? "🥈" : index === 1 ? "🥇" : "🥉"}
                </span>
                <div className={`sparkle sparkle-${index + 1}`}></div>
              </div>
            </div>
            <div className="podium-info">
              <div className="profile-picture">
                {getInitials(user.Name || "", user.Surname || "")}
                {getIcon(user.Points) && (
                  <span className={`icon icon-${index + 1}`}>
                    {getIcon(user.Points)}
                  </span>
                )}
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
              <div className="position-number">{index + 4}</div>
              <div className="profile-picture-right">
                {getInitials(user.Name || "", user.Surname || "")}
                {getIcon(user.Points) && (
                  <span className="icon-right">{getIcon(user.Points)}</span>
                )}
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
          padding: 0; /* Reset padding */
          margin: 0; /* Reset margin */
          background-color: white;
        }
        .title-container {
          margin: 20px 0;
        }
        .title {
          font-size: 3rem;
          font-weight: bold;
          color: #bcd727; /* Ensure color is applied here */
          margin: 0; /* Reset margin */
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
        .podium-item-middle {
          width: 300px; /* Make the middle block a bit bigger */
          padding: 30px; /* Increase padding */
        }
        .podium-medal {
          font-size: 100px; /* Decrease size */
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
          width: 20px; /* Decrease size */
          height: 20px; /* Decrease size */
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
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #e0e0e0;
          border-radius: 50%;
          width: 80px;
          height: 80px;
          font-size: 24px;
          position: relative;
          margin: 0 auto;
        }
        .icon {
          position: absolute;
          font-size: 24px;
          top: -10px;
          right: -10px;
        }
        .podium-name {
          font-size: 1.5rem;
          font-weight: bold;
          color: black; /* Changed to black */
        }
        .podium-name-1 {
          color: gold;
        }
        .podium-name-2 {
          color: silver;
        }
        .podium-name-3 {
          color: #cd7f32;
        }
        .podium-surname {
          font-size: 1rem;
          color: black; /* Changed to black */
        }
        .podium-points {
          font-size: 1.2rem;
          font-weight: bold;
          margin-top: 10px;
        }
        .user-list {
          width: 100%; /* Full width of the screen */
          max-width: 100vw; /* Ensure it doesn't exceed viewport width */
          margin: 0 auto; /* Center horizontally */
          padding: 0; /* Optional: remove padding if needed */
          box-sizing: border-box; /* Include padding and border in width calculation */
        }

        .user-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px;
          border-bottom: 1px solid #ddd;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Box shadow added */
          border-radius: 8px; /* Rounded corners for better visual effect */
          transition: transform 0.3s ease;
        }
        .user-item:hover {
          transform: scale(1.02); /* Slightly scale up on hover */
        }
        .user-position {
          display: flex;
          align-items: center;
        }
        .position-number {
          font-size: 1.2rem;
          font-weight: bold;
          margin-right: 10px;
        }
        .profile-picture-right {
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #e0e0e0;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          font-size: 18px;
          margin-right: 10px;
          position: relative; /* Added to place the icon */
        }
        .user-name-surname {
          flex: 1;
          font-size: 1.2rem;
          color: black; /* Changed to black */
        }
        .user-points {
          font-size: 1rem;
          font-weight: bold;
        }
        .icon-right {
          position: absolute;
          top: -10px;
          right: -10px;
          font-size: 18px;
        }
      `}</style>
    </div>
  );
};

export default Page;
