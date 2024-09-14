"use client";
import React, { useEffect, useState } from "react";
import UserDB from "@/database/community/users"; // Adjust the import path accordingly

const Page = () => {
  const [users, setUsers] = useState<
    { Name: string; Surname: string; Points: number }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await UserDB.getAllUsers();
        setUsers(usersData);
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

  return (
    <div>
      <h1>User List</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Surname</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index}>
              <td>{user.Name}</td>
              <td>{user.Surname}</td>
              <td>{user.Points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Page;
