"use client";
import React, { useEffect, useState } from "react";
import UserDB from "@/database/community/users"; // Adjust the import path accordingly
import { FaMedal } from "react-icons/fa"; // Medal icon from react-icons

const Page = () => {
  const [users, setUsers] = useState<
    { Name: string; Surname: string; Points: number }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await UserDB.getAllUsers();

        // Process users to handle NaN points and sort by Points
        const processedUsers = usersData
          .map((user) => {
            // Convert Points to a number and default to 0 if NaN
            const points = Number(user.Points);
            return { ...user, Points: isNaN(points) ? 0 : points };
          })
          .sort((a, b) => b.Points - a.Points); // Sort from highest to lowest points

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

  // Separate top 3 users from the rest
  const topUsers = users.slice(0, 3);
  const otherUsers = users.slice(3);

  return (
    <div className="page">
      <h1>User Leaderboard</h1>
      <div className="podium">
        {topUsers.map((user, index) => (
          <div key={index} className={`podium-item podium-item-${index + 1}`}>
            <div className="podium-medal">
              <FaMedal
                size={50}
                color={index === 0 ? "gold" : index === 1 ? "silver" : "bronze"}
              />
            </div>
            <div className="podium-info">
              <div className="podium-rank">{index + 1}</div>
              <div className="podium-name">{user.Name || "N/A"}</div>
              <div className="podium-surname">{user.Surname || "N/A"}</div>
              <div className="podium-points">{user.Points} Points</div>
            </div>
          </div>
        ))}
      </div>

      <div className="user-list">
        {otherUsers.map((user, index) => (
          <div className="user-item" key={index}>
            <div className="user-position">{index + 4}</div>
            <div className="user-name">{user.Name || "N/A"}</div>
            <div className="user-surname">{user.Surname || "N/A"}</div>
            <div className="user-points">{user.Points} Points</div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .page {
          font-family: Arial, sans-serif;
          text-align: center;
          padding: 20px;
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
          transform: scale(1);
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
          margin-bottom: 10px;
        }
        .podium-rank {
          font-size: 36px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .podium-info {
          text-align: center;
        }
        .podium-name,
        .podium-surname,
        .podium-points {
          margin: 5px 0;
        }
        .user-list {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .user-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px;
          border-bottom: 1px solid #ddd;
          width: 80%;
          max-width: 800px;
          background-color: #f9f9f9;
          border-radius: 5px;
          margin-bottom: 10px;
          transition: background-color 0.3s ease;
        }
        .user-item:hover {
          background-color: #e0e0e0;
        }
        .user-position {
          font-weight: bold;
          width: 50px;
        }
        .user-name,
        .user-surname,
        .user-points {
          flex: 1;
          text-align: center;
        }
        .user-name {
          width: 150px;
        }
        .user-surname {
          width: 150px;
        }
        .user-points {
          width: 100px;
        }
      `}</style>
    </div>
  );
};

export default Page;
