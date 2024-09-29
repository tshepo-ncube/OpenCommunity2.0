import React, { useState, useEffect } from "react";
import Image from "next/image";
import Logo from "@/lib/images/Logo1.png";
import { IoHome } from "react-icons/io5";
import { RiDashboardFill } from "react-icons/ri";
import { BsBuildingFillAdd } from "react-icons/bs";
import { MdLeaderboard } from "react-icons/md";
import { IoPerson } from "react-icons/io5";
export default function CollapsableSidebar() {
  return (
    <>
      <div className="sidebar min-h-screen w-[3.35rem] overflow-hidden border-r hover:w-60 hover:bg-white hover:shadow-lg transition-all fixed top-0 left-0 z-100">
        <div className="flex h-screen flex-col justify-between pt-2 pb-6">
          <div>
            {/* <div className="w-max p-2.5">
              <Image src={Logo} alt="Logo" width={20} height={20} />
            </div> */}
            <ul className="mt-6 space-y-2 tracking-wide">
              <li className="min-w-max">
                <a
                  href="#"
                  aria-label="dashboard"
                  className="relative flex items-center space-x-4 bg-gradient-to-r from-openbox-green to-openbox-green px-4 py-3 text-white"
                >
                  {/* <svg
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
                  </svg> */}

                  <IoHome size={25} />
                  <span className="-mr-1 font-medium">Home</span>
                </a>
              </li>
              <li className="min-w-max">
                <a
                  href="#"
                  className="bg group flex items-center space-x-4 rounded-full px-4 py-3 text-gray-600"
                >
                  {/* <svg
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
                  </svg> */}

                  <RiDashboardFill size={25} />
                  <span className="group-hover:text-gray-700">Admin</span>
                </a>
              </li>
              <li className="min-w-max">
                <a
                  href="#"
                  className="group flex items-center space-x-4 rounded-md px-4 py-3 text-gray-600"
                >
                  {/* <svg
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
                  </svg> */}

                  <BsBuildingFillAdd size={25} />
                  <span className="group-hover:text-gray-700">Recommend</span>
                </a>
              </li>
              <li className="min-w-max">
                <a
                  href="#"
                  className="group flex items-center space-x-4 rounded-md px-4 py-3 text-gray-600"
                >
                  {/* <svg
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
                  </svg> */}
                  <MdLeaderboard size={25} />
                  <span className="group-hover:text-gray-700">Leaderboard</span>
                </a>
              </li>
              <li className="min-w-max">
                <a
                  href="#"
                  className="group flex items-center space-x-4 rounded-md px-4 py-3 text-gray-600"
                >
                  {/* <svg
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
                  </svg> */}
                  <IoPerson size={25} />
                  <span className="group-hover:text-gray-700">Profile</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
