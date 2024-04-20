"use client";
import React, { useState } from "react";
import Link from "next/link";
import Register from "@/_Components/Register";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const handleEmailChange = (e: any) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: any) => {
    setPassword(e.target.value);
  };

  const handleLogin = () => {
    if (email.trim() === "" || password.trim() === "") {
      setErrorMessage("Please enter both email and password");
      return;
    }

    // Simulate successful login
    // Here, you might make an API call to authenticate the user
    setLoggedIn(true);
    setErrorMessage(""); // Clear error message upon successful login
  };

  return (
    <div className="login-container">
      {loggedIn ? (
        <Link href="/">
          <a>Go to Home</a>
        </Link>
      ) : (
        // <div className="login-form">
        //   <div>
        //     <label htmlFor="email">Email</label>
        //     <input
        //       type="email"
        //       id="email"
        //       value={email}
        //       onChange={handleEmailChange}
        //       placeholder="Enter your email"
        //     />
        //   </div>
        //   <div>
        //     <label htmlFor="password">Password</label>
        //     <input
        //       type="password"
        //       id="password"
        //       value={password}
        //       onChange={handlePasswordChange}
        //       placeholder="Enter your password"
        //     />
        //   </div>
        //   {errorMessage && <p className="error-message">{errorMessage}</p>}
        //   <button onClick={handleLogin}>Login</button>
        // </div>

        <Register />
      )}
    </div>
  );
};

export default Login;
