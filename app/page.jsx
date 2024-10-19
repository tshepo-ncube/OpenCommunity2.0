"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import LoginUser from "../database/auth/Login";
import Image from "next/image";
import ocLogo from "@/lib/images/ocLogo.jpg";
import Sky from "@/lib/images/sky.jpeg";

const Page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = () => {
    if (email.trim() === "" || password.trim() === "") {
      setErrorMessage("Please enter both email and password");
      return;
    }

    LoginUser.loginUser(
      { email, password },
      setUser,
      setErrorMessage,
      router,
      setLoggedIn
    );

    setErrorMessage("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      {/* Background Image */}
      <img
        src={Sky.src}
        alt="Sky"
        className="absolute inset-x-0 bottom-0 h-1/3 w-full object-cover"
        style={{ position: "fixed", bottom: 0, height: "55vh" }} // Adjust height here
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gray-500 opacity-30"></div>

      {/* Login Form */}
      {loggedIn ? (
        <div className="middle"></div>
      ) : (
        <div className="w-full max-w-md bg-white rounded-lg shadow-xl relative z-10">
          <div className="hidden md:block">
            <Image
              className="w-full h-48 object-contain rounded-t-lg"
              src={ocLogo}
              alt="Logo"
            />
          </div>
          <div className="p-6 pt-4">
            <h2 className="text-3xl text-center font-medium mb-2">
              Welcome back
            </h2>
            <p className="text-center text-gray-600 mb-4">
              Log in to your Open Community account
            </p>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="Enter your email address"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label htmlFor="password" className="text-sm font-medium">
                      Password
                    </label>
                    <span
                      onClick={() => router.push("/auth/ForgotPassword")}
                      className="text-sm text-[#bcd727] hover:text-[#8c9a20] cursor-pointer"
                    >
                      Forgot password?
                    </span>
                  </div>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="Enter your password"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-500"
                    required
                  />
                </div>
                {errorMessage && (
                  <p className="text-center text-red-500">{errorMessage}</p>
                )}
                <button
                  onClick={handleLogin}
                  className="w-full bg-openbox-green hover:bg-hover-obgreen text-white py-3 rounded-lg font-medium"
                >
                  Log In
                </button>
                <p className="text-sm text-center text-gray-500 mt-4">
                  Don't have an account?{" "}
                  <span
                    className="text-[#bcd727] hover:text-[#8c9a20] cursor-pointer"
                    onClick={() => router.push("/auth/Register")}
                  >
                    Register now
                  </span>
                </p>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
