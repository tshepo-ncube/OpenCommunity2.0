"use client";
import React, { useState } from "react";
import Image from "next/image";
import teamsLogo from "@/lib/images/teams-icon.jpg";
import outlookLogo from "@/lib/images/outlook-icon.jpeg";
import profileicon from "@/lib/images/profile-icon.webp";
import ManageUser from "@/database/auth/ManageUser";
import { useRouter } from "next/navigation";

const openTeamsApp = () => {
  window.location.href = "msteams://";
};

const openOutlookApp = () => {
  window.location.href = "mailto:";
};

const Sidebar = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    ManageUser.logoutUser(setLoggedIn, router);
  };

  // Function to handle click event and navigate to Login page
  const goToProfilePage = () => {
    router.push("/auth/Profile"); // Replace "/login" with the actual path of your Login page
  };

  return (
    <div className="flex">
      {/* User Profile */}
      <div className="user-profile">
        <button onClick={goToProfilePage}>
          <Image src={profileicon} alt="Profile" className="w-20 mt-8" />
        </button>
        <div className="logout-link p-2" onClick={handleLogout}>
          Log out
        </div>
      </div>

      {/* Sidebar Links */}
      <ul>
        <li>
          <button onClick={openTeamsApp}>
            <Image
              src={teamsLogo}
              alt="Microsoft Teams"
              style={{ width: "90px", marginTop: "17px" }}
            />
          </button>
        </li>
        <li>
          <button onClick={openOutlookApp}>
            <Image
              srcS={outlookLogo}
              alt="Outlook"
              style={{ width: "100px", marginTop: "15px" }}
            />
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
