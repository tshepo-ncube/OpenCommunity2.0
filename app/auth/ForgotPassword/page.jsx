"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ManageUser from "../../../database/auth/ManageUser";
import Sky from "@/lib/images/sky.jpeg";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [ForgotPassword, setForgotPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const forgotPassword = (e) => {
    e.preventDefault();
    // ManageUser.forgotPassword(email, setErrorMessage, router);
    ManageUser.forgotPassword(email, setErrorMessage, setForgotPassword);
  };

  const navigateToLogin = () => {
    router.push("/");
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

      {/* Reset Password Form */}
      {loggedIn ? (
        <div className="middle"></div>
      ) : (
        <div className="w-full max-w-lg bg-white rounded-lg shadow-xl relative z-10">
          <div className="p-6 pt-4">
            <h2 className="text-3xl text-center font-medium mb-2">
              Reset Password
            </h2>
            <p className="text-center text-gray-600 mb-4">
              Fill in your email below to receive a password reset link
            </p>
            <form onSubmit={forgotPassword}>
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
                {errorMessage && (
                  <p className="text-center text-red-500">{errorMessage}</p>
                )}
                <button
                  type="submit"
                  className="w-full bg-openbox-green hover:bg-hover-obgreen text-white py-3 rounded-lg font-medium"
                >
                  Send Reset Link
                </button>
                <p className="text-sm text-center text-gray-500 mt-4">
                  Remember your password?{" "}
                  <span
                    className="text-[#bcd727] hover:text-[#8c9a20] cursor-pointer"
                    onClick={navigateToLogin}
                    // onClick={() => router.push("/auth/Login")}
                  >
                    Back to login
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

export default ForgotPassword;

// "use client";
// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import ManageUser from "../../../database/auth/ManageUser";
// import Image from "next/image";
// import Logo from "@/lib/images/Logo.jpeg";

// const ForgotPassword = () => {
//   const [email, setEmail] = useState("");

//   const [errorMessage, setErrorMessage] = useState("");
//   const [loggedIn, setLoggedIn] = useState(false);
//   const [user, setUser] = useState(null);
//   const router = useRouter();

//   const handleEmailChange = (e) => {
//     setEmail(e.target.value);
//   };

//   const forgotPassword = (e) => {
//     ManageUser.forgotPassword(email, setErrorMessage, router);
//   };

//   return (
//     <div className="min-w-screen min-h-screen bg-white flex items-center justify-center px-5 py-5">
//       {loggedIn ? (
//         <div className="middle"></div>
//       ) : (
//         <div
//           className="bg-white text-black rounded-3xl shadow-xl w-full overflow-hidden"
//           style={{ maxWidth: "1300px" }}
//         >
//           <div className="md:flex w-full">
//             <div className="hidden md:block w-1/2 bg-openbox-green py-10 px-10">
//               <Image
//                 className="object-cover object-center w-full h-full "
//                 src={Logo}
//                 alt="Logo"
//               />
//             </div>
//             <div className="w-full md:w-1/2 py-10 px-10">
//               <h2 className="text-2xl font-bold text-center mb-4">
//                 Reset Password
//               </h2>
//               <div className="mb-4">
//                 <p>Fill in your email below to receive a password reset link</p>
//                 <label
//                   htmlFor="email"
//                   className="block mb-2 text-sm font-medium text-black mt-4"
//                 >
//                   Email
//                 </label>{" "}
//                 {/* Changed text-gray-900 to text-black */}
//                 <input
//                   type="email"
//                   id="email"
//                   value={email}
//                   onChange={handleEmailChange}
//                   placeholder="Enter your email"
//                   className="w-full px-3 py-2 rounded-lg border-2 border-gray outline-none focus:border-indigo-500" // Changed border-gray-200 to border-gray
//                 />
//               </div>

//               {errorMessage && (
//                 <p className="error-message text-red text-center">
//                   {errorMessage}
//                 </p>
//               )}
//               <button
//                 onClick={forgotPassword}
//                 className="block w-full bg-openbox-green hover:bg-hover-obgreen focus:bg-hover-obgreen text-white rounded-lg px-3 py-3 font-semibold"
//               >
//                 Reset
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ForgotPassword;
