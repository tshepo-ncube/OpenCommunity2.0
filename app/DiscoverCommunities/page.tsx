//This is the administrator page to create a community
//Instead of importing Header and Sidebar, they should rather be placed in the layout folder
"use client"
import React, { ChangeEvent } from 'react'
import {useState} from 'react'
import Link from 'next/link';
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';
const CreateCommunity = () => {
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [picture, setPicture] = useState<File | null>(null);
  const [submittedData, setSubmittedData] = useState<{ name: string; description: string; picture: File | null }[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const handleOpenPopup = () => {
    setPopupOpen(true);
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedData([...submittedData, { name, description, picture }]);
    setName('');
    setDescription('');
    setPicture(null);
    setPopupOpen(false);
  };

  const handleEdit = (index: number) => {
    setName(submittedData[index].name);
    setDescription(submittedData[index].description);
    setEditIndex(index);
    setPopupOpen(true);
  };

  const handlePictureUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const picFile = e.target.files && e.target.files[0];
    if (picFile) {
      setPicture(picFile);
    }
  };

  return (
    <div className="flex-col items-center min-h-screen">
      <div className="flex justify-center mt-16 mb-8 ">
        <button onClick={handleOpenPopup} className="btn bg-openbox-green hover:bg-hover-obgreen text-white font-medium rounded-lg text-sm px-5 py-2.5 mr-4 focus:outline-none focus:ring-2 focus:ring-primary-300">
          Create a Community
        </button>
      </div>
      
      {isPopupOpen && (
        <div className="mt-16 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-md shadow-xl z-50 w-11/12 sm:w-3/4 lg:w-2/3 xl:w-1/2 h-3/4 sm:h-auto lg:h-auto">
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700">Upload Image</label>
              <input type="file" id="image" onChange={handlePictureUpload} accept="image/*" className="mt-1 p-2 border border-gray-300 rounded-md w-full" required />
            </div>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 p-2 border border-gray-300 rounded-md w-full" required />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Community Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                required
              />
            </div>
            <div className="flex justify-end">
              <button type="submit" className="btn bg-openbox-green hover:bg-hover-obgreen text-white font-medium rounded-lg text-sm px-5 py-2.5 mr-4 focus:outline-none focus:ring-2 focus:ring-primary-300">
                {editIndex !== null ? 'Save' : 'Create'}
              </button>
              <button onClick={handleClosePopup} className="ml-2 bg-gray hover:bg-hover-gray text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Close
              </button>
            </div>
          </form>
        </div>
      )}

      {submittedData.length === 0 ? (
        <p className="mt-8 text-center text-gray-700">You have created no communities yet. Click on create community to become an admin of your very first community</p>
      ) : (
        <div className='flex justify-center flex-wrap '>
          {submittedData.map((data, index) => (
            <div key={index} className="mr-4 ml-4 mb-4 mt-4 bg-gray p-4 rounded-lg text-center w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5">
              <p className='font-bold'>{data.name} Community</p>
              {data.picture && (
                <img
                  src={URL.createObjectURL(data.picture)}
                  alt="Uploaded"
                  className="mt-4 mb-4 mx-auto max-w-full h-auto max-h-48"
                />
              )}
              <p>{data.description}</p>
             
              <button onClick={() => handleEdit(index)} className="btn bg-green-500 hover:bg-green-700 text-white font-medium rounded-lg text-sm px-5 py-2.5 mr-4 focus:outline-none focus:ring-2 focus:ring-primary-300">
                Edit
              </button>
              <Link href="/adminDash">
          <div className="btn bg-green-500 hover:bg-green-700 text-white font-medium rounded-lg text-sm px-5 py-2.5 mr-4 focus:outline-none focus:ring-2 focus:ring-primary-300">
            Post </div>
        </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CreateCommunity;
