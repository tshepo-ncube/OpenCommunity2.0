//This is the administrator page to create a community
//Instead of importing Header and Sidebar, they should rather be placed in the layout folder
"use client";
import React, { ChangeEvent, useState, useEffect, useRef } from "react";
import Link from "next/link";
import Sidebar from "../_Components/sidebar";
import Header from "../_Components/header";
import AddIcon from "@mui/icons-material/Add";
import Fab from "@mui/material/Fab";
import Image from "next/image";
import CommunityDB from "@/database/community/community";
import Logo from "@/lib/images/Logo.jpeg";
import AdminCommunity from "../_Components/AdminCommunities";
import CloseIcon from "@mui/icons-material/Close";

const CreateCommunity = () => {
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [picture, setPicture] = useState<File | null>(null);
  const [submittedData, setSubmittedData] = useState<
    { name: string; description: string; picture: File | null }[]
  >([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [category, setCategory] = useState<string>("social"); // Default category
  const popupRef = useRef(null);

  const handleOpenPopup = () => {
    setPopupOpen(true);
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
  };

  // const handleFormSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setSubmittedData([...submittedData, { name, description, picture }]);
  //   setName("");
  //   setDescription("");
  //   setPicture(null);
  //   setPopupOpen(false);
  // };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Submitted:", { name, description });

    CommunityDB.createCommunity(
      { name, description, picture },

      setSubmittedData,

      setLoading
    );

    // setSubmittedData([...submittedData, { name, description, picture }]);

    //CommunityDB.uploadImage(picture);

    setName("");

    setDescription("");

    setPicture(null);
    setCategory("social"); // Reset category after submission

    setPopupOpen(false);
  };

  const handleEdit = (index: number) => {
    setName(submittedData[index].name);
    setDescription(submittedData[index].description);
    setCategory(selectedCommunity.category);
    setEditIndex(index);
    setPopupOpen(true);
  };

  const handlePictureUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const picFile = e.target.files && e.target.files[0];
    if (picFile) {
      setPicture(picFile);
    }
  };

  useEffect(() => {
    CommunityDB.getCommunitiesWithImages(setSubmittedData, setLoading);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setPopupOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex-col items-center min-h-screen relative text-center">
      <Header />
      <div className="flex justify-center mt-16 mb-8 ">
        <button
          onClick={handleOpenPopup}
          className="fixed bottom-4 right-4 btn bg-openbox-green hover:bg-hover-obgreen text-white font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-300"
        >
          + CREATE COMMUNITY
        </button>
      </div>

      {/* Apply backdrop blur effect when popup is open */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-md z-10"></div>
      )}

      {isPopupOpen && (
        <div
          ref={popupRef}
          className="mt-16 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-md shadow-xl z-50 w-11/12 sm:w-3/4 lg:w-2/3 xl:w-1/2 h-3/4 sm:h-auto lg:h-auto"
        >
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-700"
              >
                Upload Image
              </label>
              <input
                type="file"
                id="image"
                onChange={handlePictureUpload}
                accept="image/*"
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                required
              />
            </div>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                required
              />
            </div>
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700"
              >
                Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                required
              >
                <option value="social">general</option>
                <option value="work">sports/fitness</option>
                <option value="fitness">social activities</option>
                <option value="fitness">company retreat</option>
                <option value="fitness">professional development</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Community Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                required
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="btn bg-openbox-green hover:bg-hover-obgreen text-white font-medium rounded-lg text-sm px-5 py-2.5 mr-4 focus:outline-none focus:ring-2 focus:ring-primary-300"
              >
                {editIndex !== null ? "Save" : "Create"}
              </button>
              <div className="flex justify-end">
                <CloseIcon
                  className="absolute top-4 right-4 text-balck-500 cursor-pointer"
                  onClick={handleClosePopup}
                />
              </div>
            </div>
          </form>
        </div>
      )}

      {submittedData.length === 0 ? (
        <div className="text-center">
          <Image
            src={Logo} // Replace "/path/to/logo.png" with the path to your logo image
            alt="Logo"
            width={400} // Adjust width as needed
            height={400} // Adjust height as needed
            className="mx-auto mb-4"
          />
          <p className="text-gray-900 text-lg">
            You have created no communities yet.{" "}
          </p>
          <p className="text-gray-900 text-lg">
            Click on <span className="font-bold">create community</span> to
            become an admin of your very first community
          </p>
        </div>
      ) : (
        <div>
          <AdminCommunity />
        </div>
        // <div className='flex justify-center flex-wrap '>
        //   {submittedData.map((data, index) => (
        //     <div key={index} className="mr-4 ml-4 mb-4 mt-4 bg-gray p-4 rounded-lg text-center w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5">
        //       <p className='font-bold'>{data.name} Community</p>
        //       {data.picture && (
        //         <img
        //           src={URL.createObjectURL(data.picture)}
        //           alt="Uploaded"
        //           className="mt-4 mb-4 mx-auto max-w-full h-auto max-h-48"
        //         />
        //       )}
        //       <p>{data.description}</p>

        //         <button onClick={() => handleEdit(index)} className="btn bg-openbox-green hover:bg-hover-obgreen text-white font-medium rounded-lg text-sm px-5 py-2.5 mr-2 focus:outline-none focus:ring-2 focus:ring-primary-300">
        //           Edit
        //         </button>
        //         <Link href="/adminDash">
        //           <button className="btn bg-openbox-green hover:bg-hover-obgreen text-white font-medium rounded-lg text-sm px-5 py-2.5 ml-2 focus:outline-none focus:ring-2 focus:ring-primary-300">
        //             Post
        //           </button>
        //         </Link>
        //     </div>
        //   ))}
        // </div>
      )}
    </div>
  );
};

export default CreateCommunity;
