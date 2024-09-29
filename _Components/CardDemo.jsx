"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function CardDemo({
  name,
  description,
  category,
  image,
  data,
  handleViewCommunity,
}) {
  const [isHovered, setIsHovered] = useState(false);
  console.log("CommImage:  ", image);
  return (
    <div
      className="max-w-xs w-full group/card"
      onMouseEnter={() => setIsHovered(true)} // When mouse enters, show GIF
      onMouseLeave={() => setIsHovered(false)} // When mouse leaves, show static image
    >
      <div
        className={cn(
          " cursor-pointer overflow-hidden relative card h-96 rounded-md shadow-xl  max-w-sm mx-auto backgroundImage flex flex-col justify-between p-4",
          `bg-[''] bg-cover`
        )}
        style={{
          backgroundImage: `url(${isHovered ? "  https://media.giphy.com/media/78E3Cv7kKD5XW/giphy.gif?cid=790b76119xaa2ymapqn6tw2s8bx0ur791x5q7xvc1c6ps3dc&ep=v1_gifs_search&rid=giphy.gif&ct=g" : image})`, // Show GIF when hovered, otherwise show static image

          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundBlendMode: "multiply", // Darkens the background
          backgroundColor: "rgba(0, 0, 0, 0.60)", // Dark overlay (50% opacity black)
        }}
        onClick={() => {
          handleViewCommunity(data);
        }}
      >
        <div className="absolute w-full h-full top-0 left-0 transition duration-300 group-hover/card:bg-black opacity-20"></div>
        <div className="flex flex-row items-center space-x-4 z-10">
          <div className="flex flex-col">
            <p className="font-normal text-base text-gray-50 relative z-10">
              {category}
            </p>
          </div>
        </div>
        <div className="text content">
          <h1 className="font-bold text-xl md:text-2xl text-gray-50 relative z-10">
            {name}
          </h1>
          <p className="font-normal text-sm text-gray-50 relative z-10 my-4">
            {description}
          </p>
        </div>
      </div>

      {/* <button
        className="w-full p-2 text-black font-poppins"
        onClick={() => {
          alert("Leave");
        }}
      >
        Leave Community
      </button> */}
    </div>
  );
}
