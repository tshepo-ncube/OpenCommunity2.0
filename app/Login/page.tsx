"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginUser from "../../database/auth/Login";
import ManageUser from "../../database/auth/ManageUser";

const Login = () => {
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

  useEffect(() => {
    if (user) {
      router.push("/Home");
    }
  }, [user]);

  useEffect(() => {
    ManageUser.manageUserState(setUser, setLoggedIn);
  }, []);

  const handleLogin = () => {
    if (email.trim() === "" || password.trim() === "") {
      setErrorMessage("Please enter both email and password");
      return;
    }

    LoginUser.loginUser({ email, password }, setUser, setErrorMessage);
    setLoggedIn(true);
    setErrorMessage("");

    router.push("/Home");
  };

  return (
    <div className="login-container flex flex-col items-center justify-center h-screen">
      {loggedIn ? (
        <div>Logged In</div>
      ) : (
        <div className="login-form bg-gray-50 dark:bg-gray-900 rounded-lg shadow p-6 max-w-md w-full">
          <h2 className="text-2xl font-bold text-center mb-4">Log in</h2>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Enter your email"
              className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 focus:outline-none focus:ring-2 focus:ring-opacity-50"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Enter your password"
              className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 focus:outline-none focus:ring-2 focus:ring-opacity-50"
            />
          </div>
          {errorMessage && <p className="error-message text-red-500 text-center">{errorMessage}</p>}
          <button onClick={handleLogin} className="w-full bg-green-500 hover:bg-green-700 text-white font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-300">Login</button>
        </div>
      )}
    </div>
  );
};

export default Login;
