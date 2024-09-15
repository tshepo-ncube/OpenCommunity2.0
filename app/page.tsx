"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginUser from "../database/auth/Login";
import ManageUser from "../database/auth/ManageUser";
import Image from "next/image";
import Logo from "@/lib/images/Logo.jpeg";

const page = () => {
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

  // useEffect(() => {
  //   if (user) {
  //     router.push("/Home");
  //   }
  // }, [user]);

  // useEffect(() => {
  //   ManageUser.manageUserState(setUser, setLoggedIn);
  // }, []);

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
              <h2 className="text-2xl font-bold text-center mb-4">Log in</h2>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-black"
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
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-black"
                >
                  Password
                </label>{" "}
                {/* Changed text-gray-900 to text-black */}
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="Enter your password"
                  className="w-full px-3 py-2 rounded-lg border-2 border-gray outline-none focus:border-indigo-500" // Changed border-gray-200 to border-gray
                />
                <p className="text-left mt-1">
                  <span
                    className="text-hover-obgreen cursor-pointer"
                    onClick={() => router.push("/auth/ForgotPassword")}
                  >
                    Forgot Password?
                  </span>
                </p>
              </div>
              {errorMessage && (
                <p className="error-message text-red text-center">
                  {errorMessage}
                </p>
              )}
              <button
                onClick={handleLogin}
                className="block w-full bg-openbox-green hover:bg-hover-obgreen focus:bg-hover-obgreen text-white rounded-lg px-3 py-3 font-semibold"
              >
                Login
              </button>
              <p className="text-center mt-3">
                Don't have an account?{" "}
                <span
                  className="text-hover-obgreen cursor-pointer"
                  onClick={() => router.push("/auth/Register")}
                >
                  Sign up now
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default page;
