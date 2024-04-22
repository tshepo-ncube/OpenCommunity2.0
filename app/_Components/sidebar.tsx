"use client"; 
import React, { useState } from 'react';
import Image from 'next/image';
import teamsLogo from '@/lib/images/teams-icon.jpg';
import outlookLogo from '@/lib/images/outlook-icon.jpeg';
import ManageUser from '@/database/auth/ManageUser';
import { useRouter } from "next/navigation";



const openTeamsApp = () => {
    window.location.href = "msteams://";
};

const openOutlookApp = () => {
    window.location.href = "mailto:";
};

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(true);
  
const [loggedIn, setLoggedIn] = useState(false);
const router = useRouter();

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };
  
    const handleLogout= () => {
      ManageUser.logoutUser( setLoggedIn,router)
    }
    return (
        <div>
            <button className="toggle-btn" onClick={toggleSidebar}>
                {isOpen ? '>' : '<'}
            </button>
            <div className={`sidebar ${isOpen ? '' : 'collapsed'}`}>
                {/* User Profile */}
                <div className="user-profile">
                    <div className="profile-icon">Profile Icon</div>
                    <div className="logout-link p-2" onClick={handleLogout}>Log out</div>
                </div>
                {/* Sidebar Links */}
                <ul>
                    <li>
                        <button onClick={openTeamsApp}>
                            <Image src={teamsLogo} alt="Microsoft Teams" style={{ width: '90px', marginTop: '370px' }} />
                        </button>
                    </li>
                    <li>
                        <button onClick={openOutlookApp}>
                            <Image src={outlookLogo} alt="Outlook" style={{ width: '100px', marginTop: '20px' }} />
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;
