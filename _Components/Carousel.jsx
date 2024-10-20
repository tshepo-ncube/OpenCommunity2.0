"use client";
import React, { useState, useEffect } from "react";

import CircularProgress from "@mui/material/CircularProgress";
import CommunityDB from "../database/community/community";
const Carousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [recommendedCommunities, setRecommendedCommunities] = useState([]);

  const [loading, setLoading] = useState(false);

  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % 3); // Cycles through the slides
  };

  const handlePrev = () => {
    setActiveIndex((prevIndex) => (prevIndex === 0 ? 2 : prevIndex - 1)); // Cycles backwards
  };

  useEffect(() => {
    CommunityDB.RecommendedCommunities(setRecommendedCommunities, setLoading);
  }, []);

  useEffect(() => {
    console.log("Recommended Communities : ", recommendedCommunities);
  }, [recommendedCommunities]);

  return (
    <>
      {/* <h1 className="text-black font-bold text-4xl text-center mt-6 mb-4 ">
        Recommended Communities
      </h1> */}

      {loading ? (
        <>
          <CircularProgress />
        </>
      ) : (
        <>
          <div
            id="carouselExampleCaptions"
            className="relative w-screen h-[600px] overflow-hidden"
            data-twe-carousel-init
            data-twe-ride="carousel"
          >
            {/* Carousel indicators */}
            <div
              className="absolute bottom-0 left-0 right-0 z-[2] mx-[15%] mb-4 flex list-none justify-center p-0"
              data-twe-carousel-indicators
            >
              {[0, 1, 2].map((index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`mx-[3px] box-content h-[3px] w-[30px] flex-initial cursor-pointer border-0 border-y-[10px] border-solid border-transparent bg-white bg-clip-padding p-0 -indent-[999px] ${
                    activeIndex === index ? "opacity-100" : "opacity-50"
                  } transition-opacity duration-[600ms] ease-[cubic-bezier(0.25,0.1,0.25,1.0)] motion-reduce:transition-none`}
                  aria-label={`Slide ${index + 1}`}
                ></button>
              ))}
            </div>

            {/* Carousel items */}
            <div className="relative w-full overflow-hidden after:clear-both after:block after:content-[''] h-full">
              {/* First item */}
              {/* <div
            className={`relative float-left w-full h-full transition-transform duration-[600ms] ease-in-out ${
              activeIndex === 0 ? "block" : "hidden"
            }`}
            style={{ backfaceVisibility: "hidden" }}
          >
            <img
              src="https://plus.unsplash.com/premium_photo-1663126325483-886b1a08ba8e?q=80&w=1957&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              className="block w-full h-full object-cover"
              alt="First slide"
            />

            <div className="absolute inset-0 bg-black opacity-40"></div>

            <div className="absolute left-[6%] bottom-5 pt-0 pb-5 text-white z-10">
              <h1 className="font-bold text-6xl text-left mt-0 mb-1">
                Baking Community
              </h1>
              <h1 className="text-left  text-2xl mt-4 mb-6">
                Some representative placeholder content for the first slide.
              </h1>
              <div className="mt-4 mb-30 flex justify-start">
                <button className="px-2 py-2 text-white font-bold text-xl rounded bg-[#bcd727] hover:bg-[#6e7d19]">
                  Visit Community
                </button>
              </div>
            </div>
          </div> */}

              {/* Second item */}
              {/* <div
            className={`relative float-left w-full h-full transition-transform duration-[600ms] ease-in-out ${
              activeIndex === 1 ? "block" : "hidden"
            }`}
            style={{ backfaceVisibility: "hidden" }}
          >
            <img
              src="https://plus.unsplash.com/premium_photo-1677567996070-68fa4181775a?q=80&w=1772&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              className="block w-full h-full object-cover"
              alt="Second slide"
            />

       
            <div className="absolute inset-0 bg-black opacity-40"></div>
            <div className="absolute left-[6%] bottom-5 pt-0 pb-5 text-white z-10">
              <h1 className="font-bold text-6xl text-left mt-0 mb-1">
                Reading Club
              </h1>
              <h1 className="text-left  text-2xl mt-4 mb-6">
                Some representative placeholder content for the first slide.
              </h1>
              <div className="mt-4 mb-30 flex justify-start">
                <button className="px-2 py-2 text-white font-bold text-2xl rounded bg-[#bcd727] hover:bg-[#6e7d19]">
                  Visit Community
                </button>
              </div>
            </div>
          </div> */}

              {/* Third item */}

              {recommendedCommunities.map((community, index) => (
                <div
                  className={`relative float-left w-full h-full transition-transform duration-[600ms] ease-in-out ${
                    activeIndex === index ? "block" : "hidden"
                  }`}
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <img
                    src={community.communityImage}
                    className="block w-full h-full object-cover"
                    alt="Third slide"
                  />

                  {/* Black overlay */}
                  <div className="absolute inset-0 bg-black opacity-40"></div>
                  <div className="absolute left-[6%] bottom-5 pt-0 pb-5 text-white z-10">
                    <h1 className="font-bold text-6xl text-left mt-0 mb-1 ">
                      {community.name}
                    </h1>
                    <h1 className="text-2xl text-left mt-4 mb-6">
                      {community.description}
                    </h1>
                    <div className="mt-4 mb-30 flex justify-start">
                      <button className="px-2 py-2 text-white font-bold text-xl rounded bg-[#bcd727] hover:bg-[#6e7d19]">
                        Visit Community
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Carousel controls */}
            <button
              className="absolute bottom-0 left-0 top-0 z-[1] flex w-[15%] items-center justify-center border-0 bg-none p-0 text-center text-white opacity-50 transition-opacity duration-150 ease-[cubic-bezier(0.25,0.1,0.25,1.0)] hover:text-white hover:no-underline hover:opacity-90 hover:outline-none focus:text-white focus:no-underline focus:opacity-90 focus:outline-none motion-reduce:transition-none"
              type="button"
              onClick={handlePrev}
            >
              <span className="inline-block h-8 w-8">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 19.5L8.25 12l7.5-7.5"
                  />
                </svg>
              </span>
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                Previous
              </span>
            </button>

            <button
              className="absolute bottom-0 right-0 top-0 z-[1] flex w-[15%] items-center justify-center border-0 bg-none p-0 text-center text-white opacity-50 transition-opacity duration-150 ease-[cubic-bezier(0.25,0.1,0.25,1.0)] hover:text-white hover:no-underline hover:opacity-90 hover:outline-none focus:text-white focus:no-underline focus:opacity-90 focus:outline-none motion-reduce:transition-none"
              type="button"
              onClick={handleNext}
            >
              <span className="inline-block h-8 w-8">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoinround
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
              </span>
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                Next
              </span>
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default Carousel;
