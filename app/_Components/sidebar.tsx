"use client"; 
import React, { useState } from 'react';
import Image from 'next/image';
import teamsLogo from '@/lib/images/teams-icon.jpg';
import outlookLogo from '@/lib/images/outlook-icon.jpeg';

const openTeamsApp = () => {
    window.location.href = "msteams://";
};

const openOutlookApp = () => {
    window.location.href = "mailto:";
};

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(true);
  
    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };
  
    return (
        <div>
            <button className="toggle-btn" onClick={toggleSidebar}>
                {isOpen ? '>' : '<'}
            </button>
            <div className={`sidebar ${isOpen ? '' : 'collapsed'}`}>
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
