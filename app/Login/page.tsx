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

  const handleEmailChange = (e: any) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: any) => {
    setPassword(e.target.value);
  };

  useEffect(() => {
    //if user exists then we need to direct to another page.
    //router.push("/");
    if (user) {
      // window.location.href = "http://localhost:3000/Home";
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

    // Simulate successful login
    // Here, you might make an API call to authenticate the user
    LoginUser.loginUser({ email, password }, setUser, setErrorMessage);
    setLoggedIn(true);
    setErrorMessage(""); // Clear error message upon successful login

    // Redirect to home page
    router.push("/Home");
  };

  return (
    <div className="login-container">
      {loggedIn ? (
        <div>Logged In</div>
      ) : (
        <div className="login-form">
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Enter your password"
            />
          </div>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <button onClick={handleLogin}>Login</button>
        </div>
      )}
    </div>
  );
};

export default Login;
