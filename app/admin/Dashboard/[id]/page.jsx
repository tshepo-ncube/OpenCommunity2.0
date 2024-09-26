"use client";
import React, { useState, useEffect } from "react";
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
          className="absolute p-2 top-2 right-2 text-gray-500 hover:text-gray-700"
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

  const handleEventSubmit = (eventDetails) => {
    createEvent(eventDetails, params.id);
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
