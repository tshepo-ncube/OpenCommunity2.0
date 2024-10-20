"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import RegisterUser from "../../../database/auth/Register";
import Image from "next/image";
import ocLogo from "@/lib/images/ocLogo.jpg";
import Sky from "@/lib/images/sky.jpeg";

const Register = () => {
  const router = useRouter();

  const [name, setName] = useState(null);
  const [surname, setSurname] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [diet, setDiet] = useState(null);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [showNext, setShowNext] = useState(false);
  const [allergies, setAllergies] = useState("");
  const [passwordError, setPasswordError] = useState(null);

  useEffect(() => {
    if (user) {
      // First navigate to /Home
      router.push("/Home");

      // Then navigate to /auth/Profile after a brief delay
      setTimeout(() => {
        router.push("/auth/Profile");
      }, 1000); // 1-second delay
    }
  }, [user]);

  const validatePasswords = () => {
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return false;
    }
    setPasswordError(null);
    return true;
  };

  const handleNextStep = () => {
    if (
      name &&
      surname &&
      email &&
      password &&
      confirmPassword &&
      validatePasswords()
    ) {
      setShowNext(true);
      setError(null); // Clear any general form error
    } else if (!validatePasswords()) {
      setPasswordError("Passwords do not match.");
    } else {
      setError("Please complete the form.");
    }
  };

  const handleRegistration = (e) => {
    e.preventDefault();
    if (!validatePasswords()) return;

    if (
      allergies === "" &&
      name === null &&
      surname === null &&
      email === null
    ) {
      setError("Please complete the form.");
    } else {
      RegisterUser.registerUser(
        { name, surname, email, password, diet, allergies },
        setUser,
        setError
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      {/* Background Image */}
      <img
        src={Sky.src}
        alt="Sky"
        className="absolute inset-x-0 bottom-0 h-1/3 w-full object-cover"
        style={{ position: "fixed", bottom: 0, height: "55vh" }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gray-500 opacity-30"></div>

      {/* Register Form */}
      <div className="w-full max-w-lg bg-white rounded-lg shadow-xl relative z-10">
        <div className="hidden md:block">
          <Image
            className="w-full h-36 px-8 object-contain rounded-t-lg"
            src={ocLogo}
            alt="Logo"
          />
        </div>
        <div className="p-6 pt-4">
          <h2 className="text-3xl font-bold text-center mb-2">
            {showNext ? "Tell us more about you" : "Register"}
          </h2>
          <p className="text-center text-gray-600 mb-4">
            {showNext
              ? "Help us personalise your experience in the Open Community"
              : "Create an account and connect with like-minded individuals"}
          </p>
          <form onSubmit={handleRegistration}>
            <div className="space-y-4">
              {!showNext ? (
                <>
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name || ""}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your first name"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="surname" className="text-sm font-medium">
                      Surname
                    </label>
                    <input
                      type="text"
                      id="surname"
                      value={surname || ""}
                      onChange={(e) => setSurname(e.target.value)}
                      placeholder="Enter your last name"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email || ""}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium">
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      value={password || ""}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a password"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="confirmPassword"
                      className="text-sm font-medium"
                    >
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      value={confirmPassword || ""}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-500"
                      required
                    />
                    {passwordError && (
                      <p className="text-red-500 text-sm mt-1">
                        {passwordError}
                      </p>
                    )}
                  </div>
                </>
              ) : (
                // <>
                //   <div className="space-y-2">
                //     <label htmlFor="allergies" className="text-sm font-medium">
                //       Allergies
                //     </label>
                //     <input
                //       type="text"
                //       id="allergies"
                //       value={allergies}
                //       onChange={(e) => setAllergies(e.target.value)}
                //       placeholder="Allergies"
                //       className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-500"
                //       required
                //     />
                //   </div>
                //   <div className="space-y-2">
                //     <label htmlFor="diet" className="text-sm font-medium">
                //       Dietary Requirements
                //     </label>
                //     <input
                //       type="text"
                //       id="diet"
                //       value={diet || ""}
                //       onChange={(e) => setDiet(e.target.value)}
                //       placeholder="Dietary Requirements"
                //       className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-500"
                //       required
                //     />
                //   </div>
                // </>

                <></>
              )}
              {error && <p className="text-center text-red-500">{error}</p>}
              {showNext ? (
                <div className="flex">
                  {/* <button
                    type="button"
                    onClick={() => setShowNext(false)}
                    className="w-full bg-openbox-green hover:bg-hover-obgreen text-white py-3 rounded-lg font-medium mr-2"
                  >
                    Back
                  </button> */}
                  <button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-700 text-white py-3 rounded-lg font-medium"
                  >
                    Register
                  </button>
                </div>
              ) : (
                <button
                  // type="submit"
                  // onClick={handleNextStep}
                  className="w-full bg-openbox-green hover:bg-hover-obgreen text-white py-3 rounded-lg font-medium"
                >
                  Register
                </button>
              )}
              <p className="text-sm text-center text-gray-500 mt-4">
                Already have an account?{" "}
                <span
                  className="text-primary hover:underline font-medium cursor-pointer"
                  onClick={() => router.push("/")}
                >
                  Log in
                </span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;

// "use client";
// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import RegisterUser from "../../../database/auth/Register";
// import Image from "next/image";
// import ocLogo from "@/lib/images/ocLogo.jpg";
// import Sky from "@/lib/images/sky.jpeg";

// const Register = () => {
//   const router = useRouter();

//   const [name, setName] = useState(null);
//   const [surname, setSurname] = useState(null);
//   const [email, setEmail] = useState(null);
//   const [password, setPassword] = useState(null);
//   const [confirmPassword, setConfirmPassword] = useState(null);
//   const [diet, setDiet] = useState(null);
//   const [error, setError] = useState(null);
//   const [user, setUser] = useState(null);
//   const [showNext, setShowNext] = useState(false);
//   const [allergies, setAllergies] = useState("");
//   const [passwordError, setPasswordError] = useState(null);

//   useEffect(() => {
//     if (user) {
//       router.push("/Home");
//     }
//   }, [user]);

//   const validatePasswords = () => {
//     if (password !== confirmPassword) {
//       setPasswordError("Passwords do not match.");
//       return false;
//     }
//     setPasswordError(null);
//     return true;
//   };

//   const handleRegistration = (e) => {
//     e.preventDefault();
//     //if (!validatePasswords()) return;

//     if (
//       //allergies === "" &&
//       name === null &&
//       surname === null &&
//       email === null
//     ) {
//       setError("Please complete the form.");
//     } else {
//       RegisterUser.registerUser(
//         { name, surname, email, password, diet, allergies },
//         setUser,
//         setError
//       );
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center p-4 relative">
//       {/* Background Image */}
//       <img
//         src={Sky.src}
//         alt="Sky"
//         className="absolute inset-x-0 bottom-0 h-1/3 w-full object-cover"
//         style={{ position: "fixed", bottom: 0, height: "55vh" }}
//       />

//       {/* Overlay */}
//       <div className="absolute inset-0 bg-gray-500 opacity-30"></div>

//       {/* Register Form */}
//       <div className="w-full max-w-lg bg-white rounded-lg shadow-xl relative z-10">
//         <div className="hidden md:block">
//           <Image
//             className="w-full h-36 px-8 object-contain rounded-t-lg"
//             src={ocLogo}
//             alt="Logo"
//           />
//         </div>
//         <div className="p-6 pt-4">
//           <h2 className="text-3xl font-bold text-center mb-2">
//             {showNext ? "Register Continued" : "Register"}
//           </h2>
//           <p className="text-center text-gray-600 mb-4">
//             {showNext
//               ? "Tell us more about your preferences"
//               : "Create an account and connect with like-minded individuals"}
//           </p>
//           <form onSubmit={handleRegistration}>
//             <div className="space-y-4">
//               {!showNext ? (
//                 <>
//                   <div className="space-y-2">
//                     <label htmlFor="name" className="text-sm font-medium">
//                       Name
//                     </label>
//                     <input
//                       type="text"
//                       id="name"
//                       value={name || ""}
//                       onChange={(e) => setName(e.target.value)}
//                       placeholder="Enter your first name"
//                       className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-500"
//                       required
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <label htmlFor="surname" className="text-sm font-medium">
//                       Surname
//                     </label>
//                     <input
//                       type="text"
//                       id="surname"
//                       value={surname || ""}
//                       onChange={(e) => setSurname(e.target.value)}
//                       placeholder="Enter your last name"
//                       className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-500"
//                       required
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <label htmlFor="email" className="text-sm font-medium">
//                       Email
//                     </label>
//                     <input
//                       type="email"
//                       id="email"
//                       value={email || ""}
//                       onChange={(e) => setEmail(e.target.value)}
//                       placeholder="Enter your email address"
//                       className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-500"
//                       required
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <label htmlFor="password" className="text-sm font-medium">
//                       Password
//                     </label>
//                     <input
//                       type="password"
//                       id="password"
//                       value={password || ""}
//                       onChange={(e) => setPassword(e.target.value)}
//                       placeholder="Create a password"
//                       className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-500"
//                       required
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <label
//                       htmlFor="confirmPassword"
//                       className="text-sm font-medium"
//                     >
//                       Confirm Password
//                     </label>
//                     <input
//                       type="password"
//                       id="confirmPassword"
//                       value={confirmPassword || ""}
//                       onChange={(e) => setConfirmPassword(e.target.value)}
//                       placeholder="Confirm your password"
//                       className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-500"
//                       required
//                     />
//                     {passwordError && (
//                       <p className="text-red-500 text-sm mt-1">
//                         {passwordError}
//                       </p>
//                     )}
//                   </div>
//                 </>
//               ) : (
//                 <>
//                   <div className="space-y-2">
//                     <label htmlFor="allergies" className="text-sm font-medium">
//                       Allergies
//                     </label>
//                     <input
//                       type="text"
//                       id="allergies"
//                       value={allergies}
//                       onChange={(e) => setAllergies(e.target.value)}
//                       placeholder="Allergies"
//                       className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-500"
//                       required
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <label htmlFor="diet" className="text-sm font-medium">
//                       Dietary Requirements
//                     </label>
//                     <input
//                       type="text"
//                       id="diet"
//                       value={diet || ""}
//                       onChange={(e) => setDiet(e.target.value)}
//                       placeholder="Dietary Requirements"
//                       className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-500"
//                       required
//                     />
//                   </div>
//                 </>
//               )}
//               {error && <p className="text-center text-red-500">{error}</p>}
//               {showNext ? (
//                 <div className="flex">
//                   <button
//                     type="button"
//                     onClick={() => setShowNext(false)}
//                     className="w-full bg-openbox-green hover:bg-hover-obgreen text-white py-3 rounded-lg font-medium mr-2"
//                   >
//                     Back
//                   </button>
//                   <button
//                     type="submit"
//                     className="w-full bg-blue-500 hover:bg-blue-700 text-white py-3 rounded-lg font-medium"
//                   >
//                     Register
//                   </button>
//                 </div>
//               ) : (
//                 <button
//                   type="button"
//                   onClick={() => {
//                     if (
//                       name &&
//                       surname &&
//                       email &&
//                       password &&
//                       confirmPassword
//                       //validatePasswords()
//                     ) {
//                       setShowNext(true);
//                     } else {
//                       setError("Please complete the form.");
//                     }
//                   }}
//                   className="w-full bg-openbox-green hover:bg-hover-obgreen text-white py-3 rounded-lg font-medium"
//                 >
//                   Next Step
//                 </button>
//               )}
//               <p className="text-sm text-center text-gray-500 mt-4">
//                 Already have an account?{" "}
//                 <span
//                   className="text-primary hover:underline font-medium cursor-pointer"
//                   onClick={() => router.push("/")}
//                 >
//                   Log in
//                 </span>
//               </p>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Register;

//ORIGINAL
//   return (
//     <div className="min-w-screen min-h-screen bg-white flex items-center justify-center px-5 py-5">
//       {showNext ? (
//         <>
//           <div
//             className="bg-white text-black rounded-3xl shadow-xl w-full overflow-hidden"
//             style={{ maxWidth: "1300px" }}
//           >
//             <div className="md:flex w-full">
//               <div className="hidden md:block w-1/2 bg-openbox-green py-10 px-10">
//                 <Image
//                   className="object-cover object-center w-full h-full "
//                   src={ocLogo}
//                   alt="Logo"
//                 />
//               </div>
//               <div className="w-full md:w-1/2 py-10 px-10">
//                 <h2 className="text-2xl font-bold text-center mb-4">
//                   Register Continued
//                 </h2>
//                 <div className="mb-4 flex flex-wrap">
//                   <div className="w-full md:w-1/2 pr-2">
//                     <label
//                       htmlFor="name"
//                       className="block mb-2 text-sm font-medium text-black"
//                     >
//                       Allergies
//                     </label>
//                     <input
//                       type="text"
//                       id="allergies"
//                       className="w-full px-3 py-2 rounded-lg border-2 border-gray outline-none focus:border-indigo-500"
//                       placeholder="Allergies"
//                       onChange={(e) => setAllergies(e.target.value)}
//                       required
//                     />
//                   </div>
//                   <div className="w-full md:w-1/2 pl-2">
//                     <label
//                       htmlFor="text"
//                       className="block mb-2 text-sm font-medium text-black"
//                     >
//                       Dietary Requirements
//                     </label>
//                     <input
//                       type="text"
//                       id="diet"
//                       className="w-full px-3 py-2 rounded-lg border-2 border-gray outline-none focus:border-indigo-500"
//                       placeholder="Dietary Requirements"
//                       onChange={(e) => setDiet(e.target.value)}
//                       required
//                     />
//                   </div>
//                 </div>

//                 {error && (
//                   <p className="error-message text-red text-center">{error}</p>
//                 )}
//                 {showNext ? (
//                   <div className="flex">
//                     <button
//                       onClick={() => {
//                         setShowNext(false);
//                       }}
//                       className="w-full bg-openbox-green hover:bg-hover-obgreen focus:bg-hover-obgreen text-white rounded-lg px-3 py-3 font-semibold mr-2"
//                     >
//                       Back
//                     </button>

//                     <button
//                       onClick={handleRegistration}
//                       className="w-full bg-blue-500 hover:bg-blue-700 focus:bg-blue-700 text-white rounded-lg px-3 py-3 font-semibold"
//                     >
//                       Register
//                     </button>
//                   </div>
//                 ) : (
//                   <button
//                     onClick={() => setShowNext(true)}
//                     className="block w-full bg-openbox-green hover:bg-hover-obgreen focus:bg-hover-obgreen text-white rounded-lg px-3 py-3 font-semibold"
//                   >
//                     Next
//                   </button>
//                 )}
//                 <p className="text-center mt-3">
//                   Already have an account?{" "}
//                   <span
//                     className="text-hover-obgreen cursor-pointer"
//                     onClick={() => router.push("/")}
//                   >
//                     Login here
//                   </span>
//                 </p>
//               </div>
//             </div>
//           </div>
//         </>
//       ) : (
//         <>
//           <div
//             className="bg-white text-black rounded-3xl shadow-xl w-full overflow-hidden"
//             style={{ maxWidth: "1300px" }}
//           >
//             <div className="md:flex w-full">
//               <div className="hidden md:block w-1/2 bg-openbox-green py-10 px-10">
//                 <Image
//                   className="object-cover object-center w-full h-full "
//                   src={ocLogo}
//                   alt="Logo"
//                 />
//               </div>
//               <div className="w-full md:w-1/2 py-10 px-10">
//                 <h2 className="text-2xl font-bold text-center mb-4">
//                   Register
//                 </h2>
//                 <div className="mb-4 flex flex-wrap">
//                   <div className="w-full md:w-1/2 pr-2">
//                     <label
//                       htmlFor="name"
//                       className="block mb-2 text-sm font-medium text-black"
//                     >
//                       Name
//                     </label>
//                     <input
//                       type="text"
//                       id="name"
//                       className="w-full px-3 py-2 rounded-lg border-2 border-gray outline-none focus:border-indigo-500"
//                       placeholder="Enter your name"
//                       onChange={(e) => setName(e.target.value)}
//                       required
//                     />
//                   </div>
//                   <div className="w-full md:w-1/2 pl-2">
//                     <label
//                       htmlFor="surname"
//                       className="block mb-2 text-sm font-medium text-black"
//                     >
//                       Surname
//                     </label>
//                     <input
//                       type="text"
//                       id="surname"
//                       className="w-full px-3 py-2 rounded-lg border-2 border-gray outline-none focus:border-indigo-500"
//                       placeholder="Enter your surname"
//                       onChange={(e) => setSurname(e.target.value)}
//                       required
//                     />
//                   </div>
//                 </div>
//                 <div className="mb-4">
//                   <label
//                     htmlFor="email"
//                     className="block mb-2 text-sm font-medium text-black"
//                   >
//                     Email
//                   </label>
//                   <input
//                     type="email"
//                     id="email"
//                     className="w-full px-3 py-2 rounded-lg border-2 border-gray outline-none focus:border-indigo-500"
//                     placeholder="Enter your email"
//                     onChange={(e) => setEmail(e.target.value)}
//                     required
//                   />
//                 </div>
//                 <div className="mb-4">
//                   <label
//                     htmlFor="password"
//                     className="block mb-2 text-sm font-medium text-black"
//                   >
//                     Password
//                   </label>
//                   <input
//                     type="password"
//                     id="password"
//                     className="w-full px-3 py-2 rounded-lg border-2 border-gray outline-none focus:border-indigo-500"
//                     placeholder="Enter your password"
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                   />
//                 </div>
//                 <div className="mb-4">
//                   <label
//                     htmlFor="confirm_password"
//                     className="block mb-2 text-sm font-medium text-black"
//                   >
//                     Confirm Password
//                   </label>
//                   <input
//                     type="password"
//                     id="confirm_password"
//                     className="w-full px-3 py-2 rounded-lg border-2 border-gray outline-none focus:border-indigo-500"
//                     placeholder="Confirm your password"
//                     onChange={(e) => setConfirmPassword(e.target.value)}
//                     required
//                   />
//                 </div>
//                 {error && (
//                   <p className="error-message text-red text-center">{error}</p>
//                 )}
//                 {showNext ? (
//                   <div className="flex">
//                     <button
//                       onClick={() => {
//                         setShowNext(false);
//                       }}
//                       className="w-full bg-openbox-green hover:bg-hover-obgreen focus:bg-hover-obgreen text-white rounded-lg px-3 py-3 font-semibold mr-2"
//                     >
//                       Back
//                     </button>

//                     <button
//                       onClick={handleRegistration}
//                       className="w-full bg-blue-500 hover:bg-blue-700 focus:bg-blue-700 text-white rounded-lg px-3 py-3 font-semibold"
//                     >
//                       Register
//                     </button>
//                   </div>
//                 ) : (
//                   <button
//                     onClick={() => {
//                       if (
//                         email !== null &&
//                         surname !== null &&
//                         password !== null &&
//                         confirmPassword !== null
//                       ) {
//                         setShowNext(true);
//                       } else {
//                         setError("Please complete the form.");
//                       }
//                     }}
//                     className="block w-full bg-openbox-green hover:bg-hover-obgreen focus:bg-hover-obgreen text-white rounded-lg px-3 py-3 font-semibold"
//                   >
//                     Next
//                   </button>
//                 )}
//                 <p className="text-center mt-3">
//                   Already have an account?{" "}
//                   <span
//                     className="text-hover-obgreen cursor-pointer"
//                     onClick={() => router.push("/")}
//                   >
//                     Login here
//                   </span>
//                 </p>
//               </div>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default Login;
