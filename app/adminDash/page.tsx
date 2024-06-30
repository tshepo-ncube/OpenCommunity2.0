"use client";
import React, { useState, useRef, useEffect } from "react";
import Header from "../_Components/header";
import EventsHolder from "../_Components/EventsHolder";
import PollsHolder from "../_Components/PollsHolder";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import EventDB from "@/database/community/event";
import PollDB from "@/database/community/poll";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

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
    rsvpEndDateTime: "", // Initialize RSVP End Date & Time
    location: eventData.Location,
    description: eventData.EventDescription,
    status: "active", // Default status is "active"
  });

  const formRef = useRef(null);

  const handleChangeEvent = (e) => {
    const { name, value } = e.target;
    setEventDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubmitEvent = (e) => {
    e.preventDefault();
    onSubmit(eventDetails); // Pass the eventDetails to the onSubmit function
    onClose(); // Close the event form after submission
  };

  const handleSaveDraft = (e) => {
    e.preventDefault();
    setEventDetails((prevDetails) => ({
      ...prevDetails,
      status: "draft", // Set status to draft
    }));
    onSubmit({ ...eventDetails, status: "draft" }); // Pass the eventDetails with draft status to the onSubmit function
    onClose(); // Close the event form after submission
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-20 z-10"></div>
      )}
      <div
        ref={formRef}
        className={`${
          isOpen ? "block" : "hidden"
        } fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-md shadow-xl z-50 w-11/12 sm:w-3/4 lg:w-2/3 xl:w-1/2 max-h-120 overflow-y-auto`}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          x
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
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              required
            />
          </div>
          <div className="flex justify-between gap-3">
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
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
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
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                required
              />
            </div>
          </div>
          <div className="flex justify-between gap-3">
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
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
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
            <input
              type="text"
              name="location"
              id="location"
              value={eventDetails.location}
              onChange={handleChangeEvent}
              placeholder="Enter location"
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
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
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              required
            ></textarea>
          </div>
          <div className="flex justify-end">
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
    </>
  );
};

const AdminDash = () => {
  const [showEventForm, setShowEventForm] = useState(false);
  const [eventFormData, setEventForm] = useState({
    Name: "",
    StartDate: "",
    EndDate: "",
    StartTime: "",
    EndTime: "",
    Location: "",
    EventDescription: "",
  });

  const handleCreateNewEvent = () => {
    setShowEventForm(!showEventForm);
  };

  const handleEventSubmit = (eventDetails) => {
    createEvent(eventDetails, localStorage.getItem("CurrentCommunity"));
  };

  return (
    <div className="bg-background_gray h-full">
      <Header />
      <div className="flex flex-col fixed bottom-7 right-4">
        <button
          onClick={handleCreateNewEvent}
          className="btn bg-openbox-green hover:bg-hover-obgreen text-white font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-300"
        >
          + EVENT
        </button>
      </div>
      <div className="bg-background_gray p-4 h-full">
        <EventsHolder communityID={localStorage.getItem("CurrentCommunity")} />
        <PollsHolder communityID={localStorage.getItem("CurrentCommunity")} />
        {showEventForm && (
          <EventForm
            isOpen={showEventForm}
            onClose={handleCreateNewEvent}
            onSubmit={handleEventSubmit}
            eventData={eventFormData}
          />
        )}
      </div>
    </div>
  );
};

export default AdminDash;
