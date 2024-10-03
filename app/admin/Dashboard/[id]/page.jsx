"use client";
import React, { useState, useEffect } from "react";
import Autocomplete from "react-google-autocomplete";
import CommunityDB from "@/database/community/community";

import Chatbot from "../../../../_Components/Chatbot";
import strings from "../../../../Utils/strings.json";
import Header from "../../../../_Components/header";
import EventsHolder from "../../../../_Components/EventsHolder";
import PollsHolder from "../../../../_Components/PollsHolder";
import EventDB from "@/database/community/event";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import axios from "axios";

const createEvent = (eventDetails, communityID) => {
  EventDB.createEvent({
    Name: eventDetails.eventName,
    StartDate: new Date(eventDetails.startDateTime),
    EndDate: new Date(eventDetails.endDateTime),
    RsvpEndTime: new Date(eventDetails.rsvpEndDateTime),
    EventDescription: eventDetails.description,
    Location: eventDetails.location,
    CommunityID: communityID,
    status: eventDetails.status,
  });
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

  const [activeTab, setActiveTab] = useState(0); // For switching tabs

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
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          x
        </button>

        {/* Tabs for switching between current form and reoccurring events */}
        <div className="flex justify-around mb-6 border-b border-gray-300">
          <button
            onClick={() => setActiveTab(0)}
            className={`${
              activeTab === 0
                ? "border-b-4 border-openbox-green text-openbox-green"
                : "text-gray-500"
            } py-2 px-4`}
          >
            Once-off Event
          </button>
          <button
            onClick={() => setActiveTab(1)}
            className={`${
              activeTab === 1
                ? "border-b-4 border-openbox-green text-openbox-green"
                : "text-gray-500"
            } py-2 px-4`}
          >
            Reoccurring Event
          </button>
        </div>

        {activeTab === 0 ? (
          <form className="space-y-4">
            {/* Current Event Form */}
            <div>
              <Typography variant="h5" className="text-center mb-4">
                Once-off Event
              </Typography>
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
                className="btn bg-purple-400 hover:bg-hover-obgreen text-white font-medium rounded-lg text-sm px-5 py-2.5 mr-4"
              >
                Generate Description
              </button>
              <button
                type="button"
                onClick={handleSaveDraft}
                className="btn bg-openbox-green hover:bg-hover-obgreen text-white font-medium rounded-lg text-sm px-5 py-2.5 mr-4"
              >
                Save Draft
              </button>
              <button
                type="submit"
                onClick={handleSubmitEvent}
                className="btn bg-openbox-green hover:bg-hover-obgreen text-white font-medium rounded-lg text-sm px-5 py-2.5 mr-4"
              >
                Post Event
              </button>
            </div>
          </form>
        ) : (
          <div>
            <div>
              <Typography variant="h5" className="text-center mb-4">
                Reoccuring Event
              </Typography>
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
                className="btn bg-purple-400 hover:bg-hover-obgreen text-white font-medium rounded-lg text-sm px-5 py-2.5 mr-4"
              >
                Generate Description
              </button>
              <button
                type="button"
                onClick={handleSaveDraft}
                className="btn bg-openbox-green hover:bg-hover-obgreen text-white font-medium rounded-lg text-sm px-5 py-2.5 mr-4"
              >
                Save Draft
              </button>
              <button
                type="submit"
                onClick={handleSubmitEvent}
                className="btn bg-openbox-green hover:bg-hover-obgreen text-white font-medium rounded-lg text-sm px-5 py-2.5 mr-4"
              >
                Post Event
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default function CommunityPage({ params }) {
  const { id } = params;
  const [showEventForm, setShowEventForm] = useState(false);
  const [eventFormData, setEventForm] = useState({
    Name: "",
    StartDate: "",
    EndDate: "",
    StartTime: "",
    EndTime: "",
    Location: "",
    EventDescription: "",
    RsvpEndTime: "",
  });
  const [currentView, setCurrentView] = useState("infoManagement");
  const [users, setUsers] = useState([]);

  const handleCreateNewEvent = () => {
    setShowEventForm(!showEventForm);
    setEventForm({
      ...eventFormData,
      RsvpEndTime: "",
    });
  };

  const handleEventSubmit = (eventDetails) => {
    createEvent(eventDetails, params.id);
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
            />
            {showEventForm && (
              <EventForm
                isOpen={showEventForm}
                onClose={handleCreateNewEvent}
                onSubmit={handleEventSubmit}
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

      <Chatbot
        communityID={params.id}
        setEventForm={setEventForm}
        setShowEventForm={setShowEventForm}
      />
    </div>
  );
}
