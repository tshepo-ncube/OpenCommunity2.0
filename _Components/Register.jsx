import React, { useState, useEffect } from "react";
import RegisterUser from "../database/auth/Register";
import ManageUser from "@/database/auth/ManageUser";
import { useRouter } from "next/navigation";

function Register() {
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

  const handleAccountDetails = () => {
    console.log("The Account details form has been submitted");
    // This function will deal with sending the account details information to be stored in FireStore
  };

  // useEffect(() => {
  //   if (user) {
  //     router.push("/");
  //   }
  // }, [user]);

  // useEffect(() => {
  //   ManageUser.manageUserState(setUser, setIsSignedIn);
  // }, []);

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
        console.log("Registering the user right now!!!");
        RegisterUser.registerUser(
          { name, surname, email, password, diet },
          setUser,
          setError
        );
      }
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900" style={{ marginTop: 30 }}>
      <center>
        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
          Register
        </h1>
      </center>
      {showNext ? (
        <>
          <div className="flex flex-col p-8 items-center justify-center px-6 py-8 mx-auto lg:py-0">
            <div className="w-full bg-white p-8 rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
              <div className="mb-4">
                <label
                  htmlFor="dietaryRequirement"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Dietary Requirements
                </label>
                <select
                  id="dietaryRequirement"
                  className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  value={diet}
                  onChange={(e) => setDiet(e.target.value)}
                  required
                >
                  <option value="">Select one</option>
                  <option value="Vegan">Vegan</option>
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Normal">Normal</option>
                  <option value="Halaal">Halaal</option>
                </select>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="allergies"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Allergies
                </label>
                <input
                  type="text"
                  id="allergies"
                  className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                />
              </div>

              <button
                type="submit"
                onClick={handleRegistration}
                className="w-full text-white bg-green-500 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Register
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0">
            <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
              <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <form className="space-y-4 md:space-y-6" action="#">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Name
                    </label>
                    <input
                      type="name"
                      name="name"
                      id="name"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Name"
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Surname
                    </label>
                    <input
                      type="surname"
                      name="surname"
                      id="surame"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Surname"
                      onChange={(e) => setSurname(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Email"
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      placeholder="Password"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      id="confirm_password"
                      placeholder="Confirm Password"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex items-center justify-between"></div>
                  {error ? (
                    <>
                      <p className="text-red-500 text-center ">{error}</p>
                    </>
                  ) : (
                    <></>
                  )}
                  <button
                    onClick={() => setShowNext(true)}
                    className="w-full text-white bg-green-500 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  >
                    Next
                  </button>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

export default Register;
