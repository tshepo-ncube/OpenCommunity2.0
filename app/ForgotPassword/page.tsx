"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ManageUser from "../../database/auth/ManageUser";
import Image from "next/image";
import Logo from "@/lib/images/Logo.jpeg";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const forgotPassword = (e) => {
    ManageUser.forgotPassword(email, setErrorMessage, router);
  };

  return (
    <div className="min-w-screen min-h-screen bg-white flex items-center justify-center px-5 py-5">
      {loggedIn ? (
        <div className="middle"></div>
      ) : (
        <div
          className="bg-white text-black rounded-3xl shadow-xl w-full overflow-hidden"
          style={{ maxWidth: "1300px" }}
        >
          <div className="md:flex w-full">
            <div className="hidden md:block w-1/2 bg-openbox-green py-10 px-10">
              <Image
                className="object-cover object-center w-full h-full "
                src={Logo}
                alt="Logo"
              />
            </div>
            <div className="w-full md:w-1/2 py-10 px-10">
              <h2 className="text-2xl font-bold text-center mb-4">
                Reset Password
              </h2>
              <div className="mb-4">
                <p>Fill in your email below to receive a password reset link</p>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-black mt-4"
                >
                  Email
                </label>{" "}
                {/* Changed text-gray-900 to text-black */}
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 rounded-lg border-2 border-gray outline-none focus:border-indigo-500" // Changed border-gray-200 to border-gray
                />
              </div>

              {errorMessage && (
                <p className="error-message text-red text-center">
                  {errorMessage}
                </p>
              )}
              <button
                onClick={forgotPassword}
                className="block w-full bg-openbox-green hover:bg-hover-obgreen focus:bg-hover-obgreen text-white rounded-lg px-3 py-3 font-semibold"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
