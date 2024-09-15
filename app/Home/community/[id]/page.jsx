"use client";
import { RWebShare } from "react-web-share";
import axios from "axios";
import {
  CircularProgress,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  TextField,
  Rating,
  DialogActions,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UserDB from "@/database/community/users";
import { doc, getDoc } from "firebase/firestore";
import db from "../../../../database/DB";
import PollDB from "@/database/community/poll";
import EventDB from "@/database/community/event";

import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const CountdownTimer = ({ date }) => {
  const targetDate = new Date("August 30, 2024 08:00:00 UTC").getTime();

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  function calculateTimeLeft() {
    const now = new Date().getTime();
    const difference = targetDate - now;

    let timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        ),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      };
    }

    return timeLeft;
  }

  return (
    <div className="grid grid-flow-col gap-5 text-center auto-cols-max">
      <div className="flex flex-col">
        <span className="countdown font-mono text-5xl">{timeLeft.days}</span>
        days
      </div>
      <div className="flex flex-col">
        <span className="countdown font-mono text-5xl">{timeLeft.hours}</span>
        hours
      </div>
      <div className="flex flex-col">
        <span className="countdown font-mono text-5xl">{timeLeft.minutes}</span>
        min
      </div>
      <div className="flex flex-col">
        <span className="countdown font-mono text-5xl">{timeLeft.seconds}</span>
        sec
      </div>
    </div>
  );
};

export default function CommunityPage({ params }) {
  const { id } = params;
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allPolls, setAllPolls] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [pollsUpdated, setPollsUpdated] = useState(false);
  const [USER_ID, setUSER_ID] = useState(localStorage.getItem("UserID"));
  const [community, setCommunity] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [selectedImages, setSelectedImages] = useState([]);
  const [alertOpen, setAlertOpen] = useState(false);
  const [rsvpState, setRsvpState] = useState({}); // Track RSVP state for each event
  const [currentEventObject, setCurrentEventObject] = useState(null);

  const [currentDate, setCurrentDate] = useState(new Date());

  const events = [
    {
      title: "Soccer Fun Day",
      start: new Date(),
      end: new Date(),
      color: "#bcd727",
    },
  ];
  useEffect(() => {
    if (id) {
      const fetchCommunity = async () => {
        const communityRef = doc(db, "communities", id);
        try {
          const snapshot = await getDoc(communityRef);
          if (!snapshot.exists()) {
            setLoading(false);
            return;
          }
          console.log(snapshot.data());
          setCommunity(snapshot.data());
        } catch (error) {
          console.error("Error getting document: ", error);
        } finally {
          setLoading(false);
        }
      };
      fetchCommunity();
      PollDB.getPollFromCommunityIDForUser(id, setAllPolls);
      EventDB.getEventFromCommunityID(id, setAllEvents);
    }
  }, [id]);

  useEffect(() => {
    console.log(selectedImages);
  }, [selectedImages]);

  useEffect(() => {
    console.log("All Polls Changed: ", allPolls);
    if (allPolls.length > 0 && !pollsUpdated) {
      updatePolls();
      setPollsUpdated(true);
    }
  }, [allPolls]);

  useEffect(() => {
    console.log("Community: ", community);
  }, [community]);

  useEffect(() => {
    // Fetch RSVP status for each event when the component loads
    const fetchRSVPStatus = async () => {
      const updatedRSVPState = {};
      for (const event of allEvents) {
        const isRSVPed =
          event.rsvp && event.rsvp.includes(localStorage.getItem("Email"));
        updatedRSVPState[event.id] = isRSVPed;
      }
      setRsvpState(updatedRSVPState);
    };
    if (allEvents.length > 0) {
      fetchRSVPStatus();
    }
  }, [allEvents]);

  const updatePolls = async () => {
    const updatedArray = await Promise.all(
      allPolls.map(async (obj) => {
        try {
          const result = await PollDB.checkIfPollExists(
            USER_ID,
            params.id,
            obj.id
          );
          if (result) {
            return {
              ...obj,
              selected: true,
              selected_option: result,
            };
          } else {
            return {
              ...obj,
              selected: false,
            };
          }
        } catch (error) {
          console.error("Error:", error);
          return obj;
        }
      })
    );

    setAllPolls(updatedArray);
  };

  const handlePollOptionSelection = (pollId, selectedOption) => {
    PollDB.voteFromPollId(params.id, pollId, selectedOption)
      .then(() => {
        setPollsUpdated(false);
        PollDB.getPollFromCommunityIDForUser(id, setAllPolls);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleCommentReview = (event) => {
    console.log("This is the event :", event);
    setCurrentEvent(event.eventName);
    setCurrentEventObject(event);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentEvent(null);
    setComment("");
    setRating(0);
    setSelectedImages([]);
  };

  const handleClosedEventClick = () => {
    setAlertOpen(true);
  };

  const handleCloseAlert = () => {
    setAlertOpen(false);
  };

  const handleRSVP = async (event) => {
    console.log(event);
    try {
      await EventDB.addRSVP(event.id, localStorage.getItem("Email"));
      setRsvpState((prev) => ({ ...prev, [event.id]: true }));

      // const { subject, body, start, end, location, email } = req.body;
      let subject = `${event.Name} Meeting Invite`;
      let location = event.Location;
      let start = new Date(event.StartDate.seconds * 1000).toISOString();
      let end = new Date(event.EndDate.seconds * 1000).toISOString();
      let email = localStorage.getItem("Email");
      let body = `This is an invite to ${event.Name}`;
      // const date =
      // console.log(date.toISOString()); // Output: "2024-08-09T06:00:00.000Z"
      console.log("sending....");
      try {
        const res = await axios.post(
          "http://localhost:8080/sendEventInvite",
          { subject, body, start, end, location, email },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log(res.data);
        let data = res.data;
      } catch (err) {
        console.log(err);
        console.log("error");
      }
    } catch (error) {
      console.error("Error RSVPing:", error);
    }
  };

  const handleLeave = async (eventID) => {
    try {
      await EventDB.removeRSVP(eventID, localStorage.getItem("Email"));
      setRsvpState((prev) => ({ ...prev, [eventID]: false }));
    } catch (error) {
      console.error("Error removing RSVP:", error);
    }
  };

  const isRSVPed = (eventID) => rsvpState[eventID] || false;

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    setSelectedImages((prevImages) => [...prevImages, ...files]);
  };

  if (loading) {
    return (
      <div>
        <center>
          <CircularProgress
            style={{ marginTop: 300, width: 150, height: 150 }}
          />
        </center>
      </div>
    );
  }

  if (!community) {
    return <div>No Community found with ID: {id}</div>;
  }

  // const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString();

  // const formatDate = (dateObj) =>
  //   new Date(dateObj.seconds * 1000).toISOString();

  const formatDate = (dateObj) => {
    const isoString = new Date(dateObj.seconds * 1000).toISOString();
    const date = new Date(isoString);

    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const dateString = date.toLocaleDateString("en-US", options);

    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();

    const timeString = `${hours}:${minutes.toString().padStart(2, "0")} UTC`;

    return `${dateString} at ${timeString}`;
  };
  const formatTime = (dateStr) => new Date(dateStr).toLocaleTimeString();

  // Filter events based on status
  const upcomingEvents = allEvents.filter(
    (event) => event.status === "active" || event.status === "rsvp"
  );

  const pastEvents = allEvents.filter(
    (event) => event.status === "past" // Adjust filtering based on your status or date
  );

  const handleSubmitReview = () => {
    const newReview = {
      Comment: comment,

      Rating: rating,
    };

    //Call the function to add the review
    // EventDB.addReview("3jBBeJTzU4ozzianyqeM", newReview);

    EventDB.handleImageUpload(currentEventObject.id, selectedImages, newReview);
  };

  // useEffect(() => {
  //   console.log("Adding points...");
  //   UserDB.addPoints();
  // }, []);
  return (
    <div className="">
      <div
        className="relative text-white py-4 h-80"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1575037614876-c38a4d44f5b8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
          backgroundSize: "cover",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 text-center py-20">
          <Typography variant="h2" className="font-bold" gutterBottom>
            {community.name}
          </Typography>
          <p className="text-md text-white">{community.description}</p>
          <center className="mt-6">
            <button
              onClick={() => {
                window.open(
                  `${community.WebUrl}`,
                  // "https://teams.microsoft.com/l/channel/19%3a28846b557cf84441955bb303c21d5543%40thread.tacv2/Modjajiii?groupId=5e98ea06-b4c1-4f72-a52f-f84260611fef&tenantId=bd82620c-6975-47c3-9533-ab6b5493ada3",
                  "_blank"
                );
              }}
              className="bg-white rounded text-black px-6 py-1 mx-2 border border-gray-300"
            >
              Visit Teams Channel
            </button>

            <RWebShare
              data={{
                text: `Community Name - ${community.name}`,
                url: `http://localhost:3000/${id}`,
                title: `Community Name - ${community.name}`,
              }}
              onClick={() => console.log("shared successfully!")}
            >
              <button className="bg-white rounded text-black px-6 py-1 mx-2  border border-gray-300">
                Invite
              </button>
            </RWebShare>
          </center>
        </div>
      </div>

      <center>
        <div className="p-12">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            date={currentDate}
            style={{ height: 300 }}
            onNavigate={(date) => setCurrentDate(date)}
            onView={(view) => console.log(view)}
            defaultView="month"
            // Customizing event appearance
            eventPropGetter={(event) => {
              const backgroundColor = event.color || "#3174ad"; // Default color if none provided
              return {
                style: {
                  backgroundColor,
                  color: "white", // Text color for better contrast
                  borderRadius: "5px", // Optional: round the corners of the event box
                  border: "none", // Optional: remove the default border
                },
              };
            }}
          />
        </div>
      </center>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8">
        {/* Upcoming Events */}
        <div className="rounded   bg-gray-50 p-4">
          <h2 className="text-2xl font-semibold mb-4">Upcoming Events</h2>
          <ul className="space-y-4">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
                <li key={event.id} className="p-4 bg-white shadow rounded-md">
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    style={{ whiteSpace: "pre-wrap" }}
                  >
                    <center>
                      <CountdownTimer date={event.StartDate} />
                    </center>
                    <div className="border-b-2 border-gray-300 mb-2">
                      <h3 className="text-xl font-semibold">{event.Name}</h3>
                    </div>
                    <strong>Description:</strong> {event.EventDescription}
                    <br />
                    <strong>Location:</strong> {event.Location}
                    <br />
                    <strong>Start Date:</strong> {formatDate(event.StartDate)}
                    <br />
                    {/* <strong>Start Time:</strong> {formatTime(event.StartDate)}
                    <br /> */}
                    <strong>End Date:</strong> {formatDate(event.EndDate)}
                    <br />
                    {/* <strong>End Time:</strong> {formatTime(event.EndDate)}
                    <br /> */}
                    <strong>RSVP by:</strong> {formatDate(event.RsvpEndTime)}
                  </Typography>
                  <div className="mt-4">
                    {event.status === "active" ? (
                      <Button
                        variant="text"
                        color="secondary"
                        className="w-full"
                        onClick={handleClosedEventClick}
                      >
                        Closed
                      </Button>
                    ) : (
                      event.status === "rsvp" &&
                      (isRSVPed(event.id) ? (
                        <Button
                          variant="contained"
                          color="secondary"
                          className="w-full"
                          onClick={() => handleLeave(event.id)}
                        >
                          UN RSVP
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          color="primary"
                          className="w-full"
                          onClick={() => handleRSVP(event)}
                        >
                          RSVP
                        </Button>
                      ))
                    )}
                  </div>
                </li>
              ))
            ) : (
              <Typography>No upcoming events</Typography>
            )}
          </ul>
        </div>

        {/* Polls */}
        <div className="rounded   bg-gray-50 p-4">
          <h2 className="text-2xl font-semibold mb-4">Polls</h2>
          {allPolls.length > 0 ? (
            allPolls.map((poll, index) => (
              <div key={index} className="p-4 bg-white shadow rounded-md mb-4">
                <Typography variant="body2" color="text.secondary">
                  <h3 className="text-xl font-semibold border-b-2 border-gray-300 mb-2">
                    {poll.Question}
                  </h3>
                  <ul>
                    {/* {Array.isArray(poll.Options) && poll.Options.length > 0 ? (
                      poll.Options.map((option, idx) => (
                        <li key={idx} className="mt-2">
                          <button
                            className={`w-full text-left px-4 py-2 rounded ${
                              poll.selected && poll.selected_option === option
                                ? "bg-openbox-blue text-white"
                                : "bg-gray-100"
                            }`}
                            onClick={() =>
                              handlePollOptionSelection(poll.id, option)
                            }
                            disabled={poll.selected}
                          >
                            {option}
                          </button>
                        </li>
                      ))
                    ) : (
                      <li>No options available</li>
                    )} */}

                    {poll.Opt.map((poll_option, poll_option_index) => (
                      <div className="mt-2">
                        <input
                          type="radio"
                          name={`poll-${poll.id}`}
                          id={`poll-${poll.id}-opt-${poll_option_index}`}
                          className="mr-2"
                          onChange={() =>
                            handlePollOptionSelection(
                              poll.id,
                              poll_option.title
                            )
                          }
                          disabled={poll.selected ? true : false}
                          // checked={
                          //   poll.selected &&
                          //   poll.selected_option === poll_option.title
                          // }
                          checked={
                            poll.selected &&
                            poll.selected_option === poll_option.title
                          }
                          //checked
                        />
                        <label htmlFor={`poll-${poll.id}-option-2`}>
                          {poll_option.title}
                        </label>
                      </div>
                    ))}
                  </ul>
                </Typography>
              </div>
            ))
          ) : (
            <Typography>No polls available</Typography>
          )}
        </div>

        {/* Past Events */}
        <div className="rounded  bg-gray-50 p-4">
          <h2 className="text-2xl font-semibold mb-4">Past Events</h2>
          <ul className="space-y-4">
            {pastEvents.length > 0 ? (
              pastEvents.map((event) => (
                <li key={event.id} className="p-4 bg-white shadow rounded-md">
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    style={{ whiteSpace: "pre-wrap" }}
                  >
                    <div className="border-b-2 border-gray-300 mb-2">
                      <h3 className="text-xl font-semibold">{event.Name}</h3>
                    </div>
                    <strong>Description:</strong> {event.EventDescription}
                    <br />
                    <strong>Location:</strong> {event.Location}
                    <br />
                    <strong>Start Date:</strong> {formatDate(event.StartDate)}
                    <br />
                    {/* <strong>Start Time:</strong> {formatTime(event.StartDate)}
                    <br /> */}
                    <strong>End Date:</strong> {formatDate(event.EndDate)}
                    {/* <br />
                    <strong>End Time:</strong> {formatTime(event.EndDate)} */}
                  </Typography>
                  <Button
                    variant="text"
                    color="primary"
                    className="w-full mt-2"
                    onClick={() => handleCommentReview(event)}
                    style={{ color: "blue" }} // Styling as blue text
                  >
                    Leave a Comment & Rating
                  </Button>
                </li>
              ))
            ) : (
              <Typography>No past events</Typography>
            )}
          </ul>
        </div>
      </div>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          <div className="flex">
            {/* Left Column - Current Content */}
            <div className="flex-1 pr-4">
              <Typography variant="h6" gutterBottom>
                All Comments and Ratings
              </Typography>

              {currentEventObject && currentEventObject.Reviews.length > 0 ? (
                <ul className="list-none p-0">
                  {currentEventObject.Reviews.map((review, index) => (
                    <li
                      className="bg-gray-200 p-4 mb-4 rounded flex items-center"
                      key={index}
                    >
                      <div className="flex-1">
                        <Typography variant="body1">
                          {review.Comment}
                        </Typography>
                      </div>
                      <div className="flex items-center ml-4">
                        <Rating
                          name={`rating-${index}`}
                          value={review.Rating}
                          readOnly
                          precision={0.5}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <Typography variant="body1">No reviews available.</Typography>
              )}
            </div>

            {/* Right Column - User Review */}
            <div className="flex-1 pl-4">
              <Typography variant="h6" gutterBottom>
                Leave a Comment & Rating
              </Typography>
              <TextField
                fullWidth
                label="Comment"
                multiline
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <div className="mt-2">
                <Typography variant="body1">Rating</Typography>
                <Rating
                  name="rating"
                  value={rating}
                  onChange={(e, newValue) => setRating(newValue)}
                />
              </div>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmitReview}
                style={{ marginTop: "16px" }}
              >
                Submit Review
              </Button>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
