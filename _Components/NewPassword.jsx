"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ManageUser from "../database/auth/ManageUser";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [ForgotPassword, setForgotPassword] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const forgotPassword = (e) => {
    ManageUser.forgotPassword(
      localStorage.getItem("Email"),
      setErrorMessage,
      setForgotPassword
    );
  };

  return (
    <div className="w-full py-10 px-10">
      <div className="mb-4">
        <p>Please click the button below to receive a password reset link</p>
        {/* <label
          htmlFor="email"
          className="block mb-2 text-sm font-medium text-black mt-4"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="Enter your email"
          className="w-full px-3 py-2 rounded-lg border-2 border-gray outline-none focus:border-indigo-500" // Changed border-gray-200 to border-gray
        /> */}
      </div>

      {errorMessage && (
        <p className="error-message text-red text-center">{errorMessage}</p>
      )}
      <button
        onClick={forgotPassword}
        className="block w-full bg-openbox-green hover:bg-hover-obgreen focus:bg-hover-obgreen text-white rounded-lg px-3 py-3 font-semibold"
      >
        send link to change password
      </button>
    </div>
  );
};

export default ForgotPassword;
