"use client";
import React, { useEffect } from "react";
import Link from "next/link";

// utils/analytics.js

// export const initGA = () => {
//   ReactGA.initialize("G-YE94Z3VF7X"); // Replace with your actual GA Measurement ID
// };

// export const logPageView = () => {
//   ReactGA.set({ page: window.location.pathname });
//   ReactGA.pageview(window.location.pathname);
// };

// import ReactGA from 'react-ga';

const Home = () => {
  return (
    <div
      style={{ marginTop: -50 }}
      className="bg-black-500 min-h-screen mb-18 "
    >
      {/* Hero Section */}
      <div
        className="relative text-white py-20 h-screen grid place-items-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1434648957308-5e6a859697e8?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
          backgroundSize: "cover",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        {/* Your content here. Make sure it's positioned relative if you want it above the overlay */}
        <center>
          <div className="relative">
            <div className="container mx-auto text-center p-4">
              <h1 className="text-5xl font-bold mb-4 font-helvetica">
                Soccer Community
              </h1>
              {/* <h1 className="text-4xl text-red-500 font-bold mb-4">
                #1 Community
              </h1> */}
              <p className="text-lg">
                Beginner to expert, you all belong here ! Join us to
                <br /> play a game or two, or even watch the next matches over a
                drink ediittt
                <br />
              </p>

              <Link href="/chat" target={"_blank"}>
                <button className="opacity-50 text-white px-4 py-2 mt-4 rounded-full border border-white hover:text-black hover:bg-white hover:border-white-800 focus:outline-none focus:border-gray-900 transition duration-300">
                  Visit Community
                </button>
              </Link>
            </div>
          </div>
        </center>
      </div>
      {/* <div
        className="bg-black/100 text-white py-20"
        style={{
          maxHeight: 20,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          backgroundImage:
            "url('https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1999&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        }}
      >
        <div
          className="container mx-auto text-center p-0"
          style={{ marginTop: -25 }}
        >
          <h1 className="text-4xl font-bold mb-1">Welcome to Mindful</h1>
          <p className="text-lg">
            Empowering our community through mindfulness
          </p>

          <Link href="/chat" target={"_blank"}>
            <button
              onClick={handleChatBtnClick}
              className="bg-white text-black px-4 py-2 mt-4 rounded-full border hover:text-white hover:bg-blue-500 hover:border-blue-800 focus:outline-none focus:border-gray-900 transition duration-300"
            >
              Start Chat
            </button>
          </Link>
        </div>
      </div> */}
    </div>
  );
};

export default Home;
