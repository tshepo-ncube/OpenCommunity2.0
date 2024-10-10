"use client";
import React, { useState, useEffect, useRef } from "react";
import Autocomplete from "react-google-autocomplete";
import CommunityDB from "@/database/community/community";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { IoMdClose } from "react-icons/io";
import Chatbot from "../../../../_Components/Chatbot";
import strings from "../../../../Utils/strings.json";
import Header from "../../../../_Components/header";
import EventsHolder from "../../../../_Components/EventsHolder";
import PollsHolder from "../../../../_Components/PollsHolder";
import EventDB from "@/database/community/event";
import Box from "@mui/material/Box";
import { ThreeDots } from "react-loader-spinner";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import axios from "axios";
import OpenAI from "openai";

import { doc, getDoc, updateDoc } from "firebase/firestore";
import DB from "../../../../database/DB"; // Make sure to import your Firebase config

const openai = new OpenAI({
  apiKey:
    "sk-bpVg50afhh0TSnh3EgewxTyiUgN_5ZiJc8iMx5QqI2T3BlbkFJrTZEo-YBWqDSMnfFbHYtJAn8RgktF9INtMjGjUVwYA",
  dangerouslyAllowBrowser: true,
});
const MAX_KEEP_IMAGES = 1;

const createEvent = (eventDetails, communityID, selectedImages) => {
  EventDB.createEvent(
    {
      Name: eventDetails.eventName,
      StartDate: new Date(eventDetails.startDateTime),
      EndDate: new Date(eventDetails.endDateTime),
      RsvpEndTime: new Date(eventDetails.rsvpEndDateTime),
      EventDescription: eventDetails.description,
      Location: eventDetails.location,
      CommunityID: communityID,
      status: eventDetails.status,
    },
    selectedImages
  );
};

const EventForm = ({ isOpen, onClose, onSubmit, eventData }) => {
  const [eventDetails, setEventDetails] = useState({
    eventName: eventData.Name,
    startDateTime: `${eventData.startDate}T${eventData.startTime}`,
    endDateTime: `${eventData.endDate}T${eventData.endTime}`,
    rsvpEndDateTime: eventData.rsvpEndDateTime,
    location: eventData.Location,
    description: eventData.EventDescription,
    status: "active",
  });

  const [selectedImages, setSelectedImages] = useState([]);

  // Function to handle image selection
  // const handleImageChange = (e) => {
  //   const files = Array.from(e.target.files); // Convert FileList to an array
  //   setSelectedImages(files);
  // };

  const [generatedImages, setGeneratedImages] = useState([]); // Store current generated images
  const [keptImages, setKeptImages] = useState([]); // Store user "kept" images
  const [loading, setLoading] = useState(false); // Handle loading state
  const [error, setError] = useState(null); // Handle errors

  const [eventImage, setEventImage] = useState(null);

  useEffect(() => {
    console.log("Kept Images : ", eventImage);
  }, [eventImage]);

  // Function to generate 3 new images
  const generateImages = async () => {
    if (eventDetails.description === "") {
      alert("Please enter an event description");
      return;
    }
    setLoading(true);
    setError(null); // Reset previous errors
    try {
      const response = await openai.images.generate({
        model: "dall-e-2",
        prompt: eventDetails.description, // You can customize this prompt
        n: 3, // Generate 3 images
        size: "1024x1024",
      });

      const imageUrls = response.data.map((item) => item.url); // Extract image URLs
      setGeneratedImages(imageUrls); // Update the generated images state
    } catch (err) {
      setError("Failed to generate images. Please try again.");
      console.log(err);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Function to keep an image
  const keepImage = (url) => {
    if (keptImages.length >= MAX_KEEP_IMAGES) {
      alert(`You can only keep a maximum of ${MAX_KEEP_IMAGES} images.`);
      return;
    }

    if (!keptImages.includes(url)) {
      setKeptImages((prevKeptImages) => [...prevKeptImages, url]);
      setEventImage(url);
    }
  };

  // Function to render the image
  const renderImage = () => {
    if (!eventImage) return null; // No image to show

    // Check if eventImage is a File object
    if (eventImage instanceof File) {
      // Create a temporary URL for the image file to display it
      return (
        <img
          src={URL.createObjectURL(eventImage)}
          alt="Selected Image"
          className="mt-3 max-w-full h-auto"
        />
      );
    }

    // If eventImage is a URL, display it directly
    return (
      <img
        src={eventImage}
        alt="Event Image"
        className="mt-3 max-w-full h-auto"
      />
    );
  };

  useEffect(() => {
    console.log(eventDetails);
  }, [eventDetails]);

  // Function to regenerate images (it keeps the previously kept ones)
  const regenerateImages = async () => {
    if (eventDetails.description === "") {
      alert("Please enter an event description");
      return;
    }
    // Ensure the kept images are retained
    setGeneratedImages([]); // Clear out current generated images
    await generateImages(); // Regenerate images
  };

  const handleImageChange = (e) => {
    // const files = Array.from(e.target.files);

    // Check if the total selected images exceed the limit
    // if (files.length + selectedImages.length > 5) {
    //   alert(`You can only upload up to 5 images.`);
    //   return; // Stop the function if limit is exceeded
    // }

    // setSelectedImages((prevImages) => [...prevImages, ...files]);
    // setEventImage(e.target.files);

    const file = e.target.files[0]; // Get the first selected file (only one since 'multiple' is not used)
    if (file) {
      console.log("Got a file.");
      setEventImage(file); // Save the file to the state
    } else {
      console.log("It aint a file.");
    }
  };

  useEffect(() => {
    console.log("Selected images :", selectedImages);
  }, [selectedImages]);

  // Function to render image previews
  const renderPreviews = () => {
    return selectedImages.map((image, index) => {
      return (
        <div key={index} className="relative m-2 w-24 h-24">
          <img
            src={URL.createObjectURL(image)}
            alt={`preview-${index}`}
            className="w-full h-full object-cover rounded-lg shadow-md"
          />
        </div>
      );
    });
  };

  const handleChangeEvent = (e) => {
    const { name, value } = e.target;
    setEventDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubmitEvent = (e) => {
    e.preventDefault();
    onSubmit(eventDetails, eventImage);
    onClose();
  };

  const handleSaveDraft = (e) => {
    e.preventDefault();
    onSubmit({ ...eventDetails, status: "draft" });
    onClose();
  };

  useEffect(() => {
    console.log("Updated location:", eventDetails.location);
    console.log(eventDetails);
  }, [eventDetails.location]);

  useEffect(() => {
    console.log("Updated Event Form:", eventDetails);
    console.log(eventDetails);
  }, [eventDetails]);

  const generateDescription = async () => {
    console.log("generate Description");
    if (eventDetails.eventName.length !== 0) {
      const name = eventDetails.eventName;
      try {
        const res = await axios.post(
          strings.server_endpoints.generateEventDescription,
          { name },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Returned Desctiption: ", res.data.eventDescription);
        console.log(res.data.eventDescription);
        //setMessages(res.data.messages);
        //setDescription(res.data.communityDescription);
        setEventDetails((prevDetails) => ({
          ...prevDetails, // Spread the previous state to retain all properties
          description: res.data.eventDescription, // Update only the description
        }));
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("Please enter a name.");
    }
  };

  return (
    <div className="">
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-20 z-10"></div>
      )}
      <div
        className={`${
          isOpen ? "block" : "hidden"
        } fixed top-1/4 left-1/4 transform -translate-x-1/4 -translate-y-1/4 bg-white p-10 rounded-md shadow-xl z-50 w-3/4 max-w-3xl max-h-120 overflow-y-auto`}
      >
        <button
          onClick={onClose}
          className="max-h-full overflow-y-auto absolute p-2 top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <IoMdClose size={25} />
        </button>
        <form className="space-y-4 h-160 max-h-110 overflow-y-auto">
          <div>
            <label
              htmlFor="eventName"
              className="block text-sm font-medium text-gray-700"
            >
              Event Name
            </label>
            <input
              type="text"
              name="eventName"
              id="eventName"
              value={eventDetails.eventName}
              onChange={handleChangeEvent}
              placeholder="Enter event name"
              className="mt-1 p-3 border border-gray-300 rounded-md w-full text-lg"
              required
            />
          </div>
          <div className="flex justify-between gap-4">
            <div className="flex-1">
              <label
                htmlFor="startDateTime"
                className="block text-sm font-medium text-gray-700"
              >
                Start Date & Time
              </label>
              <input
                type="datetime-local"
                name="startDateTime"
                id="startDateTime"
                // value={"2024-09-25T14:30"}
                value={eventDetails.startDateTime}
                onChange={handleChangeEvent}
                className="mt-1 p-3 border border-gray-300 rounded-md w-full text-lg"
                required
              />
            </div>

            <div className="flex-1">
              <label
                htmlFor="endDateTime"
                className="block text-sm font-medium text-gray-700"
              >
                End Date & Time
              </label>
              <input
                type="datetime-local"
                name="endDateTime"
                id="endDateTime"
                value={eventDetails.endDateTime}
                //value={"2024-09-27T14:30"}
                onChange={handleChangeEvent}
                className="mt-1 p-3 border border-gray-300 rounded-md w-full text-lg"
                required
              />
            </div>
          </div>
          <div className="flex justify-between gap-4">
            <div className="flex-1">
              <label
                htmlFor="rsvpEndDateTime"
                className="block text-sm font-medium text-gray-700"
              >
                RSVP End Date & Time
              </label>
              <input
                type="datetime-local"
                name="rsvpEndDateTime"
                id="rsvpEndDateTime"
                value={eventDetails.rsvpEndDateTime}
                onChange={handleChangeEvent}
                className="mt-1 p-3 border border-gray-300 rounded-md w-full text-lg"
                required
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700"
            >
              Location
            </label>
            <Autocomplete
              apiKey={"AIzaSyA_nwBxUgw4RTZLvfRpt__cS1DIcYprbQ0"}
              className="mt-1 p-3 border border-gray-300 rounded-md w-full text-lg"
              name="location"
              id="location"
              onPlaceSelected={(place) => {
                setEventDetails((prevDetails) => ({
                  ...prevDetails,
                  location: place.formatted_address,
                }));
              }}
              inputAutocompleteValue={"HR VS soft devs, bring your A game"}
              // {...(eventDetails.location
              //   ? { defaultValue: eventDetails.location }
              //   : {})}

              {...(eventDetails.location !== ""
                ? { defaultValue: eventDetails.location }
                : {})}
              required
            />
          </div>

          <div class="flex items-center justify-center w-full">
            <label
              for="dropzone-file"
              class="flex flex-col items-center justify-center w-full h-20 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
            >
              <div class="flex flex-col items-center justify-center">
                <svg
                  class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span class="font-semibold">Click to upload images</span> or
                  drag and drop
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  SVG, PNG, JPG or GIF (MAX. 800x400px)
                </p>
              </div>
              <input
                id="dropzone-file"
                type="file"
                class="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
          </div>

          <div className="flex flex-col items-center ">
            <div className="flex flex-wrap mt-2 font-bold ">or</div>
          </div>

          <div className="flex flex-col items-center ">
            <button
              onClick={generateImages}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300 mb-4"
              disabled={loading}
            >
              {loading ? (
                <>
                  <ThreeDots
                    visible={true}
                    height="20"
                    width="40"
                    color="#bcd727"
                    radius="9"
                    ariaLabel="three-dots-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                  />
                </>
              ) : (
                "Generate Images"
              )}
            </button>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            {renderImage()}
            {/* Show Kept Images */}
            {keptImages.length > 0 && (
              <div className="flex flex-wrap justify-center mt-4">
                {/* <h3 className="text-lg font-bold mb-2 w-full text-center">
                  Kept Images ({keptImages.length}/{MAX_KEEP_IMAGES})
                </h3> */}
                {/* {keptImages.map((imageUrl, index) => (
                  <div key={index} className="m-2 w-32 h-32">
                    <img
                      src={imageUrl}
                      alt={`kept-${index}`}
                      className="w-full h-full object-cover rounded-lg shadow-lg"
                    />
                  </div>
                ))} */}
              </div>
            )}

            {/* Generated Images */}
            {generatedImages.length > 0 && (
              <div className="flex flex-wrap justify-center mt-4">
                <h3 className="text-lg font-bold mb-2 w-full text-center">
                  Generated Images
                </h3>
                {/* Horizontal scrolling container for generated images */}
                {/* <div className="flex flex-col items-center justify-center p-4">
                  {generatedImages.length > 0 && (
                    <div className=" overflow-x-auto mt-4">
                      <div className="flex space-x-4">
                        {generatedImages.map((imageUrl, index) => (
                          <div
                            key={index}
                            className="relative w-64 h-64 flex-shrink-0"
                          >
                            <img
                              src={imageUrl}
                              alt={`generated-${index}`}
                              className="w-full h-full object-cover rounded-lg shadow-lg"
                            />
                            <button
                              onClick={() => keepImage(imageUrl)}
                              className="absolute bottom-2 left-2 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                            >
                              Keep
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div> */}

                {generatedImages.map((imageUrl, index) => (
                  <div key={index} className="relative m-2 w-64 h-64">
                    <img
                      src={imageUrl}
                      alt={`generated-${index}`}
                      className="w-full h-full object-cover rounded-lg shadow-lg"
                    />
                    <button
                      onClick={() => keepImage(imageUrl)}
                      className="absolute bottom-2 left-2 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                    >
                      Keep
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Regenerate Button */}
            {generatedImages.length > 0 &&
              keptImages.length < MAX_KEEP_IMAGES && (
                <button
                  onClick={regenerateImages}
                  className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 transition duration-300 mt-4"
                  disabled={loading}
                >
                  {loading ? "Regenerating..." : "Regenerate Images"}
                </button>
              )}

            <p className="text-sm text-gray-500 mt-4">
              You can keep a maximum of {MAX_KEEP_IMAGES} images.
            </p>
          </div>

          <div className="flex flex-col items-center ">
            <div className="mt-6 flex flex-wrap ">{renderPreviews()}</div>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Event Description
            </label>
            <textarea
              name="description"
              id="description"
              value={eventDetails.description}
              onChange={handleChangeEvent}
              placeholder="Enter event description"
              className="mt-1 p-3 border border-gray-300 rounded-md w-full text-lg"
              required
            ></textarea>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={generateDescription}
              className="btn bg-purple-400 hover:bg-hover-obgreen text-white font-medium rounded-lg text-sm px-5 py-2.5 mr-4 focus:outline-none focus:ring-2 focus:ring-primary-300"
            >
              generate description
            </button>
            <button
              type="button"
              onClick={handleSaveDraft}
              className="btn bg-openbox-green hover:bg-hover-obgreen text-white font-medium rounded-lg text-sm px-5 py-2.5 mr-4 focus:outline-none focus:ring-2 focus:ring-primary-300"
            >
              Save Draft
            </button>
            <button
              type="submit"
              onClick={handleSubmitEvent}
              className="btn bg-openbox-green hover:bg-hover-obgreen text-white font-medium rounded-lg text-sm px-5 py-2.5 mr-4 focus:outline-none focus:ring-2 focus:ring-primary-300"
            >
              Post Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const EventEditForm = ({ isOpen, onClose, onSubmit, eventData }) => {
  const [eventDetails, setEventDetails] = useState({
    eventName: eventData.Name,
    startDateTime: `${eventData.startDate}T${eventData.startTime}`,
    endDateTime: `${eventData.endDate}T${eventData.endTime}`,
    rsvpEndDateTime: eventData.rsvpEndDateTime,
    location: eventData.Location,
    description: eventData.EventDescription,
    status: "active",
    eventID: eventData.EventID,
  });

  const handleChangeEvent = (e) => {
    const { name, value } = e.target;
    setEventDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubmitEvent = (e) => {
    e.preventDefault();
    onSubmit(eventDetails);
    onClose();
  };

  const handleSaveDraft = (e) => {
    e.preventDefault();
    onSubmit({ ...eventDetails, status: "draft" });
    onClose();
  };

  useEffect(() => {
    console.log("Updated location:", eventDetails.location);
    console.log(eventDetails);
  }, [eventDetails.location]);

  useEffect(() => {
    console.log("Updated Event Form:", eventDetails);
    console.log(eventDetails);
  }, [eventDetails]);

  const generateDescription = async () => {
    console.log("generate Description");
    if (eventDetails.eventName.length !== 0) {
      const name = eventDetails.eventName;
      try {
        const res = await axios.post(
          strings.server_endpoints.generateEventDescription,
          { name },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Returned Desctiption: ", res.data.eventDescription);
        console.log(res.data.eventDescription);
        //setMessages(res.data.messages);
        //setDescription(res.data.communityDescription);
        setEventDetails((prevDetails) => ({
          ...prevDetails, // Spread the previous state to retain all properties
          description: res.data.eventDescription, // Update only the description
        }));
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("Please enter a name.");
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-20 z-10"></div>
      )}
      <div
        className={`${
          isOpen ? "block" : "hidden"
        } fixed top-1/4 left-1/4 transform -translate-x-1/4 -translate-y-1/4 bg-white p-10 rounded-md shadow-xl z-50 w-3/4 max-w-3xl max-h-120 overflow-y-auto`}
      >
        <button
          onClick={onClose}
          className="absolute top-2 p- 4 right-2 text-gray-500 hover:text-gray-700"
        >
          <IoMdClose size={25} />
        </button>
        <form className="space-y-4">
          <div>
            <label
              htmlFor="eventName"
              className="block text-sm font-medium text-gray-700"
            >
              Event Name
            </label>
            <input
              type="text"
              name="eventName"
              id="eventName"
              value={eventDetails.eventName}
              onChange={handleChangeEvent}
              placeholder="Enter event name"
              className="mt-1 p-3 border border-gray-300 rounded-md w-full text-lg"
              required
            />
          </div>
          <div className="flex justify-between gap-4">
            <div className="flex-1">
              <label
                htmlFor="startDateTime"
                className="block text-sm font-medium text-gray-700"
              >
                Start Date & Time
              </label>
              <input
                type="datetime-local"
                name="startDateTime"
                id="startDateTime"
                // value={"2024-09-25T14:30"}
                value={eventDetails.startDateTime}
                onChange={handleChangeEvent}
                className="mt-1 p-3 border border-gray-300 rounded-md w-full text-lg"
                required
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor="endDateTime"
                className="block text-sm font-medium text-gray-700"
              >
                End Date & Time
              </label>
              <input
                type="datetime-local"
                name="endDateTime"
                id="endDateTime"
                value={eventDetails.endDateTime}
                //value={"2024-09-27T14:30"}
                onChange={handleChangeEvent}
                className="mt-1 p-3 border border-gray-300 rounded-md w-full text-lg"
                required
              />
            </div>
          </div>
          <div className="flex justify-between gap-4">
            <div className="flex-1">
              <label
                htmlFor="rsvpEndDateTime"
                className="block text-sm font-medium text-gray-700"
              >
                RSVP End Date & Time
              </label>
              <input
                type="datetime-local"
                name="rsvpEndDateTime"
                id="rsvpEndDateTime"
                value={eventDetails.rsvpEndDateTime}
                onChange={handleChangeEvent}
                className="mt-1 p-3 border border-gray-300 rounded-md w-full text-lg"
                required
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700"
            >
              Location
            </label>
            <Autocomplete
              apiKey={"AIzaSyA_nwBxUgw4RTZLvfRpt__cS1DIcYprbQ0"}
              className="mt-1 p-3 border border-gray-300 rounded-md w-full text-lg"
              name="location"
              id="location"
              onPlaceSelected={(place) => {
                setEventDetails((prevDetails) => ({
                  ...prevDetails,
                  location: place.formatted_address,
                }));
              }}
              inputAutocompleteValue={"HR VS soft devs, bring your A game"}
              // {...(eventDetails.location
              //   ? { defaultValue: eventDetails.location }
              //   : {})}

              {...(eventDetails.location !== ""
                ? { defaultValue: eventDetails.location }
                : {})}
              required
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Event Description
            </label>
            <textarea
              name="description"
              id="description"
              value={eventDetails.description}
              onChange={handleChangeEvent}
              placeholder="Enter event description"
              className="mt-1 p-3 border border-gray-300 rounded-md w-full text-lg"
              required
            ></textarea>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={generateDescription}
              className="btn bg-purple-400 hover:bg-hover-obgreen text-white font-medium rounded-lg text-sm px-5 py-2.5 mr-4 focus:outline-none focus:ring-2 focus:ring-primary-300"
            >
              generate description
            </button>
            {/* <button
              type="button"
              onClick={handleSaveDraft}
              className="btn bg-openbox-green hover:bg-hover-obgreen text-white font-medium rounded-lg text-sm px-5 py-2.5 mr-4 focus:outline-none focus:ring-2 focus:ring-primary-300"
            >
              Save Draft
            </button> */}
            <button
              type="submit"
              onClick={handleSubmitEvent}
              className="btn bg-openbox-green hover:bg-hover-obgreen text-white font-medium rounded-lg text-sm px-5 py-2.5 mr-4 focus:outline-none focus:ring-2 focus:ring-primary-300"
            >
              Edit Event
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default function CommunityPage({ params }) {
  const { id } = params;
  const [communityID, setCommunityID] = useState(params.id);
  const [showEventForm, setShowEventForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [eventFormData, setEventForm] = useState({
    Name: "Create New Event",
    StartDate: "",
    EndDate: "",
    StartTime: "",
    EndTime: "",
    Location: "",
    EventDescription: "",
    RsvpEndTime: "",
    EventID: "",
  });
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [currentView, setCurrentView] = useState("infoManagement");
  const [users, setUsers] = useState([]);
  const [eventImages, setEventImages] = useState(null);
  const fileInputRef = useRef(null);

  const [isNotifyUsersModalOpen, setIsNotifyUsersModalOpen] = useState(false);

  const toggleModal = () => {
    setIsNotifyUsersModalOpen(!isNotifyUsersModalOpen);
  };

  const closeModal = () => {
    setIsNotifyUsersModalOpen(false);
  };

  // Function to check community score
  const checkCommunityScore = async (communityID) => {
    console.log("checkCommunityScore");

    try {
      const communityRef = doc(DB, "communities", communityID); // Reference to the community document

      console.log("did ref");

      // Get the community document
      const docSnapshot = await getDoc(communityRef);
      console.log("got snapshot");

      if (docSnapshot.exists()) {
        console.log("docs exists");
        const communityData = docSnapshot.data();
        const score = communityData.score || 0; // Default to 0 if score doesn't exist
        console.log(`Community ${communityID} has a score of: `, score);

        // Update lastCheck to current date after checking the score
        const today = new Date();
        await updateDoc(communityRef, { lastCheck: today });

        console.log("Community Score checked and lastCheck updated to:", today);
        return score;
      } else {
        console.error("No such document for community:", communityID);
      }
    } catch (error) {
      console.error("Error fetching community score:", error);
    }
  };

  // Check if today is the first of the month
  const isFirstOfMonth = () => {
    const today = new Date();
    return today.getDate() === 1;
  };

  // Check if the score was already checked this month
  const shouldCheckScore = async (communityID) => {
    try {
      const communityRef = doc(DB, "communities", communityID);

      const docSnapshot = await getDoc(communityRef);

      if (docSnapshot.exists()) {
        const communityData = docSnapshot.data();
        const lastCheck = communityData.lastCheck
          ? new Date(communityData.lastCheck.seconds * 1000)
          : null;

        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();

        // If lastCheck exists, check if it is in the current month and year
        if (
          lastCheck &&
          lastCheck.getMonth() === currentMonth &&
          lastCheck.getFullYear() === currentYear
        ) {
          console.log(
            "Score has already been checked for this month. Skipping..."
          );
          return false; // No need to check again
        }
        return true; // Need to check
      } else {
        console.error("Community document does not exist!");
        return false; // No document, no check
      }
    } catch (error) {
      console.error("Error checking lastCheck:", error);
      return false; // Error, don't check
    }
  };

  // useEffect to run the check only on the first of each month and only if it hasn't been checked
  useEffect(() => {
    const checkIfNeeded = async () => {
      if (!isFirstOfMonth()) {
        const shouldCheck = await shouldCheckScore(id);
        if (shouldCheck) {
          console.log("I should check");
          const score = await checkCommunityScore(id); // Perform score check and update lastCheck

          console.log("Score: ", score);

          if (score < 15) {
            setIsNotifyUsersModalOpen(true);
          }
        } else {
          console.log("no need to check");
        }
      }
    };

    checkIfNeeded(); // Call the function to see if a check is needed
  }, [id]);

  const handleSnackbarClick = () => {
    setOpenSnackbar(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };

  const handleCreateNewEvent = () => {
    setShowEventForm(!showEventForm);
    setEventForm({
      ...eventFormData,
      RsvpEndTime: "",
    });
  };

  const handleEditNewEvent = () => {
    setShowEditForm(!showEditForm);
    setEventForm({
      ...eventFormData,
      RsvpEndTime: "",
    });
  };

  const handleEventSubmit = (eventDetails, selectedImages) => {
    createEvent(eventDetails, params.id, selectedImages);
  };

  const handleEditEventSubmit = (eventDetails) => {
    //createEvent(eventDetails, params.id);

    // check if the event is edited after RSVP is closed.
    try {
      EventDB.editEventFromUI(eventDetails);
      handleSnackbarClick();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      if (currentView === "usersManagement") {
        const communityId = params.id;
        const result = await CommunityDB.getCommunityUsers(communityId);
        if (result.success) {
          setUsers(result.users);
        } else {
          console.error(result.message);
        }
      }
    };

    fetchUsers();
  }, [currentView]);

  const notifyMembers = async () => {
    console.log("ABout to notify members");
    try {
      const res = await axios.post(
        strings.server_endpoints.notifyMembersOfInactiveCommunity,
        { communityID },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
    closeModal();
  };

  return (
    <div className="bg-background_gray h-full">
      <Header />
      {/* <div className="flex flex-col fixed bottom-7 right-4">
        <button
          onClick={handleCreateNewEvent}
          className="btn bg-openbox-green hover:bg-hover-obgreen text-white font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-300"
        >
          + EVENT
        </button>
      </div> */}
      <div className="bg-background_gray p-4 h-full">
        <div className="flex justify-center mb-4">
          <button
            onClick={() => setCurrentView("infoManagement")}
            className={`px-4 py-2 rounded-l-lg ${
              currentView === "infoManagement"
                ? "bg-openbox-green text-white"
                : "bg-gray-200"
            }`}
          >
            Community Management
          </button>
          <button
            onClick={() => setCurrentView("usersManagement")}
            className={`px-4 py-2 rounded-r-lg ${
              currentView === "usersManagement"
                ? "bg-openbox-green text-white"
                : "bg-gray-200"
            }`}
          >
            Users Management
          </button>
        </div>
        {currentView === "infoManagement" && (
          <div>
            <PollsHolder communityID={params.id} />
            <EventsHolder
              communityID={params.id}
              handleCreateNewEvent={handleCreateNewEvent}
              setShowEventForm={setShowEventForm}
              setEventForm={setEventForm}
              setShowEditForm={setShowEditForm}
            />
            {showEventForm && (
              <EventForm
                isOpen={showEventForm}
                onClose={handleCreateNewEvent}
                onSubmit={handleEventSubmit}
                eventData={eventFormData}
              />
            )}

            {showEditForm && (
              <EventEditForm
                isOpen={showEditForm}
                onClose={handleEditNewEvent}
                onSubmit={handleEditEventSubmit}
                eventData={eventFormData}
              />
            )}
          </div>
        )}
        {currentView === "usersManagement" && (
          <div>
            <Typography variant="h6" className="mb-4">
              Community Members
            </Typography>
            <Box>
              {users.length > 0 ? (
                <ul className="space-y-2">
                  {users.map((user, index) => (
                    <li key={index} className="bg-white p-3 rounded shadow">
                      {user}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No users found in this community.</p>
              )}
            </Box>
          </div>
        )}
      </div>

      <>
        {/* Modal toggle button */}
        {/* <button
          onClick={toggleModal}
          className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          type="button"
        >
          Toggle modal
        </button> */}

        {/* Modal */}
        {isNotifyUsersModalOpen && (
          <div
            id="default-modal"
            tabIndex="-1"
            aria-hidden="true"
            className="fixed inset-0 z-50 flex justify-center items-center w-full h-[calc(100%-1rem)] max-h-full overflow-y-auto overflow-x-hidden"
          >
            <div className="relative p-4 w-full max-w-2xl max-h-full">
              {/* Modal content */}
              <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                {/* Modal header */}
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Community Notice
                  </h3>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    <svg
                      className="w-3 h-3"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 14"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7l-6 6"
                      />
                    </svg>
                    <span className="sr-only">Community Notice</span>
                  </button>
                </div>

                {/* Modal body */}
                <div className="p-4 md:p-5 space-y-4">
                  <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                    This community has been inactive for more than 28 days. All
                    users in the community will be notified about the
                    inactivity. If the inactivity continues, the community will
                    be archived to ensure proper management of active groups.
                  </p>
                  {/* <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                    The European Union’s General Data Protection Regulation
                    (G.D.P.R.) goes into effect on May 25 and is meant to ensure
                    a common set of data rights in the European Union. It
                    requires organizations to notify users as soon as possible
                    of high-risk data breaches that could personally affect
                    them.
                  </p> */}
                </div>

                {/* Modal footer */}
                <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                  <button
                    onClick={notifyMembers}
                    className="text-white bg-openbox-green hover:bg-openbox-green focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Notify members
                  </button>
                  <button
                    onClick={closeModal}
                    className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                  >
                    Decline
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>

      {/* <Chatbot
        communityID={params.id}
        setEventForm={setEventForm}
        setShowEventForm={setShowEventForm}
      /> */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Event has been edited!
        </Alert>
      </Snackbar>
    </div>
  );
}
