"use client";
import React, { useState, useRef, useEffect } from "react";
import Header from "../_Components/header";
import EventsHolder from "../_Components/EventsHolder";
import PollsHolder from "../_Components/PollsHolder";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import EventDB from "@/database/community/event";
import PollDB from "@/database/community/poll";
interface Option {
  id: number;
  value: string;
}

interface Poll {
  pollName: string;
  options: Option[];
}

interface EventDetails {
  eventName: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  description: string;
}

const createEvent = (communityID) => {
  EventDB.createEvent({
    Name: eventDetails.eventName,
    StartDate: new Date(`${eventDetails.date} ${eventDetails.startTime}`),
    EndDate: new Date(`${eventDetails.date} ${eventDetails.endTime}`),
    EventDescription: eventDetails.description,
    Location: eventDetails.location,
    CommunityID: communityID,
  });
};

const EventForm = ({ isOpen, onClose }) => {
  const [eventDetails, setEventDetails] = useState<EventDetails>({
    eventName: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    description: "",
  });

  const formRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleChangeEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEventDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const createEvent = (communityID) => {
    EventDB.createEvent({
      Name: eventDetails.eventName,
      StartDate: new Date(`${eventDetails.date} ${eventDetails.startTime}`),
      EndDate: new Date(`${eventDetails.date} ${eventDetails.endTime}`),
      EventDescription: eventDetails.description,
      Location: eventDetails.location,
      CommunityID: communityID,
    });
  };

  const handleSubmitEvent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(eventDetails.date);
    console.log(eventDetails.startTime);
    //createEvent("tshepo");
    createEvent(localStorage.getItem("CurrentCommunity"));

    // Handle event form submission
    onClose(); // Close the event form after submission
  };

  return (
    <>
      {/* Apply backdrop blur effect when popup is open */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-20 z-10 fixed inset-0 bg-black bg-opacity-0 backdrop-blur-md z-10"></div>
      )}
      <div
        ref={formRef}
        className={`${
          isOpen ? "block" : "hidden"
        } mt-16 fixed top-1/2  left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-md shadow-xl z-50 w-11/12 sm:w-3/4 lg:w-2/3 xl:w-1/2 h-3/4 sm:h-auto lg:h-auto`}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          Close
        </button>
        <form onSubmit={handleSubmitEvent} className="space-y-4">
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
          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700"
            >
              Date
            </label>
            <input
              type="date"
              name="date"
              id="date"
              value={eventDetails.date}
              onChange={handleChangeEvent}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              required
            />
          </div>
          <div className="flex justify-between gap-3">
            <div className="flex-1">
              <label
                htmlFor="startTime"
                className="block text-sm font-medium text-gray-700"
              >
                Start Time
              </label>
              <input
                type="time"
                name="startTime"
                id="startTime"
                value={eventDetails.startTime}
                onChange={handleChangeEvent}
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                required
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor="endTime"
                className="block text-sm font-medium text-gray-700"
              >
                End Time
              </label>
              <input
                type="time"
                name="endTime"
                id="endTime"
                value={eventDetails.endTime}
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
              type="submit"
              className="btn bg-openbox-green hover:bg-hover-obgreen text-white font-medium rounded-lg text-sm px-5 py-2.5 mr-4 focus:outline-none focus:ring-2 focus:ring-primary-300"
            >
              Post Event
            </button>
            <button
              onClick={onClose}
              className="ml-2 bg-gray hover:bg-hover-gray text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

const AdminDash: React.FC = () => {
  const [pollName, setPollName] = useState<string>("");
  const [options, setOptions] = useState(["option 1", "option2"]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [showPollForm, setShowPollForm] = useState(false);
  const handleOptionChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newOptions = options.map((option, i) => {
      if (i === index) {
        return event.target.value;
      }
      return option.value;
    });
    setOptions(newOptions);
  };

  const addOption = () => {
    const newOptionId = options.length + 1;
    const newOption = ""; //{ id: newOptionId, value: "" };
    setOptions([...options, newOption]);
  };

  const handleSubmitPoll = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPolls([...polls, { pollName, options }]);
    PollDB.createPoll({ Question: pollName, Options: options });
    setPollName("");
    setOptions([
      { id: 1, value: "" },
      { id: 2, value: "" },
    ]);
    setShowPollForm(false);
  };

  const handleCreateNewPoll = () => {
    setShowPollForm(true);
  };

  const handleDeletePoll = (index: number) => {
    setPolls((currentPolls) => currentPolls.filter((_, idx) => idx !== index));
  };

  const handleCreateNewEvent = () => {
    setShowEventForm(!showEventForm);
  };

  const handlePollNameChange = (e) => {
    setPollName(e.target.value);
  };

  return (
    <>
      <Header />
      <Fab
        variant="extended"
        style={{
          bottom: "50px",
          color: "white",
          position: "fixed",

          right: "20px",
        }}
        aria-label="add"
        className="bg-openbox-green"
      >
        post
      </Fab>
      <div className="bg-background_gray p-4">
        <EventsHolder
          communityID={localStorage.getItem("CurrentCommunity")}
          createEvent={createEvent}
        />
        <PollsHolder communityID={localStorage.getItem("CurrentCommunity")} />
        <div className="flex justify-between w-full mb-4">
          <div className="w-1/2 mr-2">
            <button
              onClick={handleCreateNewEvent}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded"
            >
              {showEventForm ? "Close Event Form" : "Create Event"}
            </button>
            {showEventForm && (
              <EventForm
                isOpen={showEventForm}
                onClose={handleCreateNewEvent}
              />
            )}
          </div>
          <div className="w-1/2 ml-2">
            <button
              onClick={handleCreateNewPoll}
              className="px-4 py-2 bg-green-500 hover:bg-green-700 text-white font-bold rounded"
            >
              Post Poll
            </button>
            {showPollForm && (
              <form
                onSubmit={handleSubmitPoll}
                className="p-4 border-2 border-gray-300 rounded-lg shadow-lg max-w-md w-full mt-4"
              >
                <h1 className="text-xl font-bold mb-4">Create Poll</h1>
                <div className="mb-4">
                  <label
                    htmlFor="pollName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Question
                  </label>
                  <input
                    type="text"
                    name="pollName"
                    id="pollName"
                    value={pollName}
                    onChange={handlePollNameChange}
                    placeholder="Ask question"
                    className="mt-1 block w-full rounded-md border-2 border-gray-400 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    required
                  />
                </div>
                {options.map((option, index) => (
                  <div key={option} className="mb-2">
                    <input
                      type="text"
                      placeholder={`Option ${option}`}
                      value={option}
                      onChange={(event) => handleOptionChange(index, event)}
                      className="mt-1 block w-full rounded-md border-2 border-gray-400 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      required
                    />
                  </div>
                ))}
                <div className="flex justify-between mt-4">
                  <button
                    type="button"
                    onClick={addOption}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Add Option
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded"
                  >
                    Post Poll
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
        <div className="w-full flex flex-wrap justify-center mt-4">
          {/* Render events */}
        </div>
        <div className="w-full flex flex-wrap justify-center mt-4">
          {/* Render polls */}
        </div>
      </div>
    </>
  );
};

export default AdminDash;
