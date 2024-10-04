import React, { useState, useEffect } from "react";
import Image from "next/image";
import Logo from "@/lib/images/Logo1.png";
import { IoHome } from "react-icons/io5";
import { RiDashboardFill } from "react-icons/ri";
import { BsBuildingFillAdd } from "react-icons/bs";
import { MdLeaderboard } from "react-icons/md";
import { IoPerson } from "react-icons/io5";

// export default function CollapsableSidebar() {
//   return (
//     <>
//       <div className="sidebar min-h-screen w-[3.35rem] overflow-hidden border-r hover:w-60 hover:bg-white hover:shadow-lg transition-all fixed top-0 left-0 z-100">
//         <div className="flex h-screen flex-col justify-between pt-2 pb-6">
//           <div>
//             <ul className="mt-6 space-y-2 tracking-wide">
//               <li className="min-w-max">
//                 <a
//                   href="#"
//                   aria-label="dashboard"
//                   className="relative flex items-center space-x-4 bg-gradient-to-r from-openbox-green to-openbox-green px-4 py-3 text-white"
//                 >
//                   <IoHome size={25} />
//                   <span className="-mr-1 font-medium">Home</span>
//                 </a>
//               </li>
//               <li className="min-w-max">
//                 <a
//                   href="#"
//                   className="bg group flex items-center space-x-4 rounded-full px-4 py-3 text-gray-600"
//                 >
//                   <RiDashboardFill size={25} />
//                   <span className="group-hover:text-gray-700">Admin</span>
//                 </a>
//               </li>
//               <li className="min-w-max">
//                 <a
//                   href="#"
//                   className="group flex items-center space-x-4 rounded-md px-4 py-3 text-gray-600"
//                 >
//                   <BsBuildingFillAdd size={25} />
//                   <span className="group-hover:text-gray-700">Recommend</span>
//                 </a>
//               </li>
//               <li className="min-w-max">
//                 <a
//                   href="#"
//                   className="group flex items-center space-x-4 rounded-md px-4 py-3 text-gray-600"
//                 >
//                   <MdLeaderboard size={25} />
//                   <span className="group-hover:text-gray-700">Leaderboard</span>
//                 </a>
//               </li>
//               <li className="min-w-max">
//                 <a
//                   href="#"
//                   className="group flex items-center space-x-4 rounded-md px-4 py-3 text-gray-600"
//                 >
//                   <IoPerson size={25} />
//                   <span className="group-hover:text-gray-700">Profile</span>
//                 </a>
//               </li>
//             </ul>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

export default function CollapsableSidebar() {
  return (
    <div className="z-100 bg-white fixed h-screen min-h-screen w-[3.35rem] overflow-hidden border-r hover:w-60 hover:bg-white hover:shadow-lg transition-all">
      <div className="flex h-screen flex-col justify-between pt-2 pb-6">
        <div>
          <ul className=" mt-6 space-y-2 tracking-wide">
            <li className="min-w-max">
              <a
                href="#"
                aria-label="dashboard"
                className="relative flex items-center space-x-4 bg-gradient-to-r from-openbox-green to-openbox-green px-4 py-3 text-white"
              >
                <IoHome className="sticky" size={25} />
                <span className="-mr-1 font-medium">Home</span>
              </a>
            </li>
            <li className="min-w-max">
              <a
                href="#"
                className="bg group flex items-center space-x-4 rounded-full px-4 py-3 text-gray-600"
              >
                <RiDashboardFill className="sticky" size={25} />
                <span className="group-hover:text-gray-700">Admin</span>
              </a>
            </li>
            <li className="min-w-max">
              <a
                href="#"
                className="group flex items-center space-x-4 rounded-md px-4 py-3 text-gray-600"
              >
                <BsBuildingFillAdd className="sticky" size={25} />
                <span className="group-hover:text-gray-700">Recommend</span>
              </a>
            </li>
            <li className="min-w-max">
              <a
                href="#"
                className="group flex items-center space-x-4 rounded-md px-4 py-3 text-gray-600"
              >
                <MdLeaderboard className="sticky" size={25} />
                <span className="group-hover:text-gray-700">Leaderboard</span>
              </a>
            </li>
            <li className="min-w-max">
              <a
                href="#"
                className="group flex items-center space-x-4 rounded-md px-4 py-3 text-gray-600"
              >
                <IoPerson className="sticky" size={25} />
                <span className="group-hover:text-gray-700">Profile</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
