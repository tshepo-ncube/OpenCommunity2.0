"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import RegisterUser from "../../database/auth/Register";
import ManageUser from "../../database/auth/ManageUser";
import Image from "next/image";
import Logo from "@/lib/images/Logo.jpeg";

const Login = () => {
  const router = useRouter();

  const [name, setName] = useState(null);
  const [surname, setSurname] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [diet, setDiet] = useState(null);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [allergies, setAllergies] = useState("");
  const [injury, setInjury] = useState("");

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user]);

  useEffect(() => {
    ManageUser.manageUserState(setUser, setIsSignedIn);
  }, []);

  const handleShowNext = () => {};
  const handleRegistration = (e) => {
    e.preventDefault();
    if (confirmPassword !== password) {
      setError("Passwords do not match.");
    } else {
      if (
        allergies === "" &&
        injury === "" &&
        name === null &&
        surname === null &&
        email === null
      ) {
        setError("Please complete the form.");
      } else {
        RegisterUser.registerUser(
          { name, surname, email, password, diet, allergies, injury },
          setUser,
          setError
        );
      }
    }
  };

  return (
    <div className="min-w-screen min-h-screen bg-white flex items-center justify-center px-5 py-5">
      {showNext ? (
        <>
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
                  Register Continued
                </h2>
                <div className="mb-4 flex flex-wrap">
                  <div className="w-full md:w-1/2 pr-2">
                    <label
                      htmlFor="name"
                      className="block mb-2 text-sm font-medium text-black"
                    >
                      Alergies
                    </label>
                    <input
                      type="text"
                      id="allergies"
                      className="w-full px-3 py-2 rounded-lg border-2 border-gray outline-none focus:border-indigo-500"
                      placeholder="Allergies"
                      onChange={(e) => setAllergies(e.target.value)}
                      required
                    />
                  </div>
                  <div className="w-full md:w-1/2 pl-2">
                    <label
                      htmlFor="text"
                      className="block mb-2 text-sm font-medium text-black"
                    >
                      Dietary Requirements
                    </label>
                    <input
                      type="text"
                      id="diet"
                      className="w-full px-3 py-2 rounded-lg border-2 border-gray outline-none focus:border-indigo-500"
                      placeholder="Dietary Requirements"
                      onChange={(e) => setDiet(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="text"
                    className="block mb-2 text-sm font-medium text-black"
                  >
                    Injuries
                  </label>
                  <input
                    type="text"
                    id="injuries"
                    className="w-full px-3 py-2 rounded-lg border-2 border-gray outline-none focus:border-indigo-500"
                    placeholder="Injuries"
                    onChange={(e) => setInjury(e.target.value)}
                    required
                  />
                </div>

                {error && (
                  <p className="error-message text-red text-center">{error}</p>
                )}
                {showNext ? (
                  <div className="flex">
                    <button
                      onClick={() => {
                        setShowNext(false);
                      }}
                      className="w-full bg-openbox-green hover:bg-hover-obgreen focus:bg-hover-obgreen text-white rounded-lg px-3 py-3 font-semibold mr-2"
                    >
                      Back
                    </button>

                    <button
                      onClick={handleRegistration}
                      className="w-full bg-openbox-green hover:bg-hover-obgreen focus:bg-hover-obgreen text-white rounded-lg px-3 py-3 font-semibold"
                    >
                      Register
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowNext(true)}
                    className="block w-full bg-openbox-green hover:bg-hover-obgreen focus:bg-hover-obgreen text-white rounded-lg px-3 py-3 font-semibold"
                  >
                    Next
                  </button>
                )}
                <p className="text-center mt-3">
                  Already have an account?{" "}
                  <span
                    className="text-hover-obgreen cursor-pointer"
                    onClick={() => router.push("/")}
                  >
                    Login here
                  </span>
                </p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
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
                  Register
                </h2>
                <div className="mb-4 flex flex-wrap">
                  <div className="w-full md:w-1/2 pr-2">
                    <label
                      htmlFor="name"
                      className="block mb-2 text-sm font-medium text-black"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-3 py-2 rounded-lg border-2 border-gray outline-none focus:border-indigo-500"
                      placeholder="Enter your name"
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="w-full md:w-1/2 pl-2">
                    <label
                      htmlFor="surname"
                      className="block mb-2 text-sm font-medium text-black"
                    >
                      Surname
                    </label>
                    <input
                      type="text"
                      id="surname"
                      className="w-full px-3 py-2 rounded-lg border-2 border-gray outline-none focus:border-indigo-500"
                      placeholder="Enter your surname"
                      onChange={(e) => setSurname(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-black"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-3 py-2 rounded-lg border-2 border-gray outline-none focus:border-indigo-500"
                    placeholder="Enter your email"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-black"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    className="w-full px-3 py-2 rounded-lg border-2 border-gray outline-none focus:border-indigo-500"
                    placeholder="Enter your password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="confirm_password"
                    className="block mb-2 text-sm font-medium text-black"
                  >
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirm_password"
                    className="w-full px-3 py-2 rounded-lg border-2 border-gray outline-none focus:border-indigo-500"
                    placeholder="Confirm your password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                {error && (
                  <p className="error-message text-red text-center">{error}</p>
                )}
                {showNext ? (
                  <div className="flex">
                    <button
                      onClick={() => {
                        setShowNext(false);
                      }}
                      className="w-full bg-openbox-green hover:bg-hover-obgreen focus:bg-hover-obgreen text-white rounded-lg px-3 py-3 font-semibold mr-2"
                    >
                      Back
                    </button>

                    <button
                      onClick={handleRegistration}
                      className="w-full bg-openbox-green hover:bg-hover-obgreen focus:bg-hover-obgreen text-white rounded-lg px-3 py-3 font-semibold"
                    >
                      Register
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      if (
                        email !== null &&
                        surname !== null &&
                        password !== null &&
                        confirmPassword !== null
                      ) {
                        setShowNext(true);
                      } else {
                        setError("Please complete the form.");
                      }
                    }}
                    className="block w-full bg-openbox-green hover:bg-hover-obgreen focus:bg-hover-obgreen text-white rounded-lg px-3 py-3 font-semibold"
                  >
                    Next
                  </button>
                )}
                <p className="text-center mt-3">
                  Already have an account?{" "}
                  <span
                    className="text-hover-obgreen cursor-pointer"
                    onClick={() => router.push("/")}
                  >
                    Login here
                  </span>
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Login;
