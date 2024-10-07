"use client";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
export default function CardGiff({ name, description, image, giff }) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      className="max-w-xs w-full"
      onMouseEnter={() => setIsHovered(true)} // When mouse enters, show GIF
      onMouseLeave={() => setIsHovered(false)} // When mouse leaves, show static image
    >
      {/* <div className="bg-transparent text-gray-900 p-2 text-md font-bold text-xl md:text-2xl ">
        {name}
      </div> */}
      <div
        className={cn(
          "group w-full cursor-pointer overflow-hidden relative card h-96 rounded-b-md shadow-xl mx-auto flex flex-col justify-end p-4 border border-transparent dark:border-neutral-800",
          "hover:after:content-[''] hover:after:absolute hover:after:inset-0 hover:after:bg-black hover:after:opacity-50",
          "transition-all duration-500"
        )}
        // Set background image dynamically with inline styles
        // style={{
        //   backgroundImage: `url(${image})`,
        // }}

        style={{
          backgroundImage: `url(${isHovered ? giff : image})`, // Show GIF when hovered, otherwise show static image

          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundBlendMode: "multiply", // Darkens the background
          backgroundColor: "rgba(0, 0, 0, 0.10)", // Dark overlay (50% opacity black)
        }}
      >
        {/* Preload hover GIF with opacity 0, show on hover */}
        {/* <div
          className="absolute inset-0 z-[-1] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            backgroundImage: `url(${giff})`,
            position: "fixed",
          }}
        /> */}

        <div className="text relative z-50">
          <h1 className="font-bold text-xl md:text-3xl text-gray-50 relative">
            {name}
          </h1>
          <p className="font-normal text-base text-gray-50 relative my-4">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
