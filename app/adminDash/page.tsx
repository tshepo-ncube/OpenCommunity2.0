"use client";
import React, { useState, useEffect } from "react";
import Header from "../_Components/header";
import EventsHolder from "../_Components/EventsHolder";
import PollsHolder from "../_Components/PollsHolder";
import EventDB from "@/database/community/event";
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
    startDateTime:
      eventData.startDate && eventData.startTime
        ? `${eventData.startDate}T${eventData.startTime}`
        : "", // Combine start date and time if available
    endDateTime:
      eventData.endDate && eventData.endTime
        ? `${eventData.endDate}T${eventData.endTime}`
        : "", // Combine end date and time if available
    rsvpEndDateTime: eventData.rsvpEndDateTime ? eventData.rsvpEndDateTime : "", // Initialize RSVP End Date & Time
    location: eventData.Location,
    description: eventData.EventDescription,
    status: "active", // Default status is "active"
  });

  useEffect(() => {
    // Set initial min values for endDateTime and rsvpEndDateTime when startDateTime changes
    if (eventDetails.startDateTime) {
      setEventDetails((prevDetails) => ({
        ...prevDetails,
        endDateTime: prevDetails.startDateTime, // Set endDateTime minimum to startDateTime
        rsvpEndDateTime: prevDetails.startDateTime, // Set rsvpEndDateTime minimum to startDateTime
      }));
    }
  }, [eventDetails.startDateTime]);

  const handleChangeEvent = (e) => {
    const { name, value } = e.target;
    setEventDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleStartDateChange = (e) => {
    const { value } = e.target;
    setEventDetails((prevDetails) => ({
      ...prevDetails,
      startDateTime: value,
      endDateTime: value, // Set endDateTime to startDateTime initially
      rsvpEndDateTime: value, // Set rsvpEndDateTime to startDateTime initially
    }));
  };

  const handleEndDateChange = (e) => {
    const { value } = e.target;
    setEventDetails((prevDetails) => ({
      ...prevDetails,
      endDateTime: value,
    }));
  };

  const handleRsvpEndDateChange = (e) => {
    const { value } = e.target;
    setEventDetails((prevDetails) => ({
      ...prevDetails,
      rsvpEndDateTime: value,
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

  // Function to get current date and time in ISO format without seconds
  const getCurrentDateTimeISO = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-20 z-10"></div>
      )}
      <div
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
                onChange={handleStartDateChange}
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                required
                min={getCurrentDateTimeISO()} // Minimum date is current date/time without seconds
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
                onChange={handleEndDateChange}
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                required={eventDetails.startDateTime !== ""}
                min={eventDetails.startDateTime} // Minimum date is start date/time
                disabled={eventDetails.startDateTime === ""}
              />
              {eventDetails.startDateTime !== "" &&
                eventDetails.endDateTime < eventDetails.startDateTime && (
                  <p className="text-sm text-red-500">
                    End Date & Time cannot be earlier than Start Date & Time
                  </p>
                )}
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
                onChange={handleRsvpEndDateChange}
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                required={eventDetails.startDateTime !== ""}
                min={eventDetails.startDateTime} // Minimum date is start date/time
                disabled={eventDetails.startDateTime === ""}
              />
              {eventDetails.startDateTime !== "" && (
                <p className="text-sm text-red-500">
                  RSVP End Date & Time cannot be earlier than Start Date & Time
                  {eventDetails.endDateTime !== "" &&
                    eventDetails.rsvpEndDateTime < eventDetails.endDateTime && (
                      <> or End Date & Time</>
                    )}
                </p>
              )}
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
              disabled={
                eventDetails.startDateTime === "" ||
                eventDetails.endDateTime === "" ||
                eventDetails.rsvpEndDateTime === "" ||
                eventDetails.endDateTime < eventDetails.startDateTime ||
                eventDetails.rsvpEndDateTime < eventDetails.endDateTime ||
                eventDetails.rsvpEndDateTime < eventDetails.startDateTime
              }
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
    RsvpEndTime: "", // Initialize RSVP End Time
  });

  const handleCreateNewEvent = () => {
    setShowEventForm(!showEventForm);
    // You can set default values or leave them empty as per your design
    setEventForm({
      ...eventFormData,
      RsvpEndTime: "", // Set default value for RSVP End Time
    });
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
