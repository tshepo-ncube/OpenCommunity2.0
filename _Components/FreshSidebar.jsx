"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Logo from "@/lib/images/Logo1.png";

export default function FreshSidebar() {
  const cards = [
    {
      name: "Tech Innovators",
      description:
        "This community focuses on exploring the latest technologies and innovations in the industry.",
      image:
        "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dGVjaG5vbG9neXxlbnwwfHwwfHx8MA%3D%3D",
      giff: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExd2gxdGswZGFkdmFxcTdvZmU2dW40Z3UycW4zOWFiZzBpanBxcHhnaCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/QpVUMRUJGokfqXyfa1/giphy.gif",
    },
    {
      name: "Sustainability Advocates",
      description:
        "A group dedicated to promoting sustainable practices and reducing the company's carbon footprint.",
      image:
        "https://plus.unsplash.com/premium_photo-1680040211009-169b40ee81bb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8U3VzdGFpbmFiaWxpdHl8ZW58MHx8MHx8fDA%3D",
      giff: "",
    },
    {
      name: "Health & Wellness",
      description:
        "Promoting mental and physical well-being by offering tips and resources for a healthier lifestyle.",
      image:
        "https://plus.unsplash.com/premium_photo-1665673312770-90df9f77ddfa?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGhlYWx0aHxlbnwwfHwwfHx8MA%3D%3D",
      giff: "https://media.giphy.com/media/1pA8T9LnjEVbp8Hugv/giphy.gif?cid=790b7611mhxy4ucfj2z54jdp48r5036s2va7id30cl93a47y&ep=v1_gifs_search&rid=giphy.gif&ct=g",
    },
  ];

  return (
    <>
      {/* Parent flex container to handle the layout */}
      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <div className="sidebar min-h-screen w-[5.35rem] overflow-hidden border-r hover:w-120 hover:bg-white hover:shadow-lg transition-all">
          <div className="flex h-screen flex-col justify-between pt-2 pb-6">
            <div>
              <div className="w-max p-2.5">
                <Image src={Logo} alt="Logo" width={20} height={20} />
              </div>
              <ul className="mt-6 space-y-2 tracking-wide">
                <li className="min-w-max">
                  <a
                    href="#"
                    aria-label="dashboard"
                    className="relative flex items-center space-x-4 bg-gradient-to-r from-openbox-green to-openbox-green px-4 py-3 text-white"
                  >
                    <svg
                      className="-ml-1 h-6 w-6"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M6 8a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8ZM6 15a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-1Z"
                        className="fill-current text-cyan-400 dark:fill-slate-600"
                      ></path>
                      <path
                        d="M13 8a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2V8Z"
                        className="fill-current text-cyan-200 group-hover:text-openbox-green"
                      ></path>
                      <path
                        d="M13 15a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-1Z"
                        className="fill-current group-hover:text-sky-300"
                      ></path>
                    </svg>
                    <span className="-mr-1 font-medium">Home</span>
                  </a>
                </li>
                <li className="min-w-max">
                  <a
                    href="#"
                    className="bg group flex items-center space-x-4 rounded-full px-4 py-3 text-gray-600"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        className="fill-current text-gray-300 group-hover:text-openbox-green"
                        fill-rule="evenodd"
                        d="M2 6a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1H8a3 3 0 00-3 3v1.5a1.5 1.5 0 01-3 0V6z"
                        clip-rule="evenodd"
                      />
                      <path
                        className="fill-current text-gray-600 group-hover:text-openbox-green"
                        d="M6 12a2 2 0 012-2h8a2 2 0 012 2v2a2 2 0 01-2 2H2h2a2 2 0 002-2v-2z"
                      />
                    </svg>
                    <span className="group-hover:text-gray-700">Admin</span>
                  </a>
                </li>
                <li className="min-w-max">
                  <a
                    href="#"
                    className="group flex items-center space-x-4 rounded-md px-4 py-3 text-gray-600"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        className="fill-current text-gray-600 group-hover:text-openbox-green"
                        fill-rule="evenodd"
                        d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z"
                        clip-rule="evenodd"
                      />
                      <path
                        className="fill-current text-gray-300 group-hover:text-openbox-green"
                        d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z"
                      />
                    </svg>
                    <span className="group-hover:text-gray-700">Recommend</span>
                  </a>
                </li>
                <li className="min-w-max">
                  <a
                    href="#"
                    className="group flex items-center space-x-4 rounded-md px-4 py-3 text-gray-600"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        className="fill-current text-gray-600 group-hover:text-openbox-green"
                        d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"
                      />
                      <path
                        className="fill-current text-gray-300 group-hover:text-openbox-green"
                        d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"
                      />
                    </svg>
                    <span className="group-hover:text-gray-700">
                      Leaderboard
                    </span>
                  </a>
                </li>
                <li className="min-w-max">
                  <a
                    href="#"
                    className="group flex items-center space-x-4 rounded-md px-4 py-3 text-gray-600"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        className="fill-current text-gray-300 group-hover:text-openbox-green"
                        d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"
                      />
                      <path
                        className="fill-current text-gray-600 group-hover:text-openbox-green"
                        fill-rule="evenodd"
                        d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <span className="group-hover:text-gray-700">Profile</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-grow p-6">
          <h1 className="text-3xl font-bold">Main Content</h1>
          <p className="mt-4">
            This is the content area to the right of the sidebar. You can place
            anything here, such as cards, text, images, etc.
          </p>

          {/* You can map over the cards or add more content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {cards.map((card, index) => (
              <div key={index} className="bg-white p-4 shadow-lg rounded-lg">
                <img
                  src={card.image}
                  alt={card.name}
                  className="h-48 w-full object-cover rounded-md"
                />
                <h2 className="mt-4 text-xl font-bold">{card.name}</h2>
                <p className="mt-2 text-gray-600">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
