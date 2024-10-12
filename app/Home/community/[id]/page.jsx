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
import strings from "../../../../Utils/strings.json";
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
  if (typeof window !== "undefined") {
    const [USER_ID, setUSER_ID] = useState(localStorage.getItem("UserID"));
  }

  const [community, setCommunity] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [selectedImages, setSelectedImages] = useState([]);
  const [alertOpen, setAlertOpen] = useState(false);
  const [rsvpState, setRsvpState] = useState({});
  const [currentEventObject, setCurrentEventObject] = useState(null);
  const [activeTab, setActiveTab] = useState("events");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [confirmUnRSVP, setConfirmUnRSVP] = useState(false);
  const [currentEventToUnRSVP, setCurrentEventToUnRSVP] = useState(null);

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
    console.log("ALL Events :", allEvents);
    console.log(allEvents[0]);
    if (allEvents && allEvents[0]) {
      console.log(allEvents[0].Name);
      console.log();
      setEvents(
        allEvents.map((event) => {
          console.log(event.StartDate);
          if (event.status == "past") {
          }
          return {
            title: event.Name,
            start: new Date(event.StartDate.seconds * 1000),
            end: new Date(event.StartDate.seconds * 1000),
            color: event.status === "past" ? "#FF0000" : "#bcd727",
          };
        })
      );
    } else {
      console.log("allEvents is undefined or null");
    }

    let transformedUsers = allEvents.map((event) => {
      return {
        title: event.Name,
        start: new Date(event.StartDate),
        end: new Date(event.EndDate),
        color: "#bcd727",
      };
    });
  }, [allEvents]);
  const [rsvpCounts, setRsvpCounts] = useState({});

  useEffect(() => {
    const countRSVPs = () => {
      const counts = {};
      allEvents.forEach((event) => {
        counts[event.id] = event.rsvp ? event.rsvp.length : 0;
      });
      setRsvpCounts(counts);
    };

    if (allEvents.length > 0) {
      countRSVPs();
    }
  }, [allEvents]);
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
    const fetchRSVPStatus = async () => {
      const updatedRSVPState = {};
      if (typeof window === "undefined") return;

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
    if (typeof window === "undefined") return;

    try {
      await EventDB.addRSVP(event.id, localStorage.getItem("Email"));
      setRsvpState((prev) => ({ ...prev, [event.id]: true }));

      let subject = `${event.Name} Meeting Invite`;
      let location = event.Location;
      let start = new Date(event.StartDate.seconds * 1000).toISOString();
      let end = new Date(event.EndDate.seconds * 1000).toISOString();
      let email = localStorage.getItem("Email");
      let body = `This is an invite to ${event.Name}`;
      console.log("sending....");
      try {
        const res = await axios.post(
          strings.server_endpoints.sendEventInvite,
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

  const handleLeave = async (event) => {
    setCurrentEventToUnRSVP(event);
    setConfirmUnRSVP(true);
  };

  const confirmLeave = async () => {
    if (typeof window === "undefined") return;

    try {
      await EventDB.removeRSVP(
        currentEventToUnRSVP.id,
        localStorage.getItem("Email")
      );
      setRsvpState((prev) => ({ ...prev, [currentEventToUnRSVP.id]: false }));
    } catch (error) {
      console.error("Error removing RSVP:", error);
    }
    setConfirmUnRSVP(false);
  };

  const cancelLeave = () => {
    setConfirmUnRSVP(false);
    setCurrentEventToUnRSVP(null);
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

  const upcomingEvents = allEvents.filter(
    (event) => event.status === "active" || event.status === "rsvp"
  );

  const pastEvents = allEvents.filter((event) => event.status === "past");

  const handleSubmitReview = () => {
    const newReview = {
      Comment: comment,
      Rating: rating,
    };

    EventDB.handleImageUpload(currentEventObject.id, selectedImages, newReview);
  };

  return (
    <div className="">
      <div
        className="relative text-white py-4 h-80"
        style={{
          backgroundImage: community.communityImage
            ? `url(${community.communityImage})`
            : `url('https://images.unsplash.com/photo-1575037614876-c38a4d44f5b8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
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
                window.open(`${community.WebUrl}`, "_blank");
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
            eventPropGetter={(event) => {
              const backgroundColor = event.color || "#3174ad";
              return {
                style: {
                  backgroundColor,
                  color: "white",
                  borderRadius: "5px",
                  border: "none",
                },
              };
            }}
          />
        </div>
      </center>

      <div className="flex justify-center mb-6 space-x-10 mt-4">
        <button
          className={`px-6 py-2 text-lg ${
            activeTab === "events"
              ? "border-b-4 border-[#bcd727] text-gray-900 font-semibold"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("events")}
        >
          EVENTS
        </button>
        <button
          className={`px-6 py-2 text-lg ${
            activeTab === "polls"
              ? "border-b-4 border-[#bcd727] text-gray-900 font-semibold"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("polls")}
        >
          POLLS
        </button>
      </div>
      <div>
        {activeTab === "events" && (
          <div className="rounded bg-gray-50 p-4 pb-4">
            <h2 className="text-2xl font-semibold mb-4">Upcoming Events</h2>
            {upcomingEvents.length > 0 ? (
              <div className="overflow-x-auto">
                <ul className="flex space-x-6">
                  {upcomingEvents.map((event) => (
                    <li
                      key={event.id}
                      className="min-w-[300px] w-[300px] bg-white shadow rounded-md p-4"
                    >
                      <div className="mb-4">
                        <img
                          src="https://www.pngkey.com/png/detail/233-2332677_ega-png.png"
                          alt={event.Name}
                          className="w-full h-40 object-cover rounded"
                        />
                      </div>
                      <div className="border-b-2 border-gray-300 mb-2">
                        <h3 className="text-xl font-semibold text-center">
                          {event.Name}
                        </h3>
                      </div>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        style={{ whiteSpace: "pre-wrap" }}
                      >
                        <div className="mb-2">{event.EventDescription}</div>
                        <div>
                          <strong>Location:</strong> {event.Location}
                        </div>
                        <div>
                          <strong>Start Date:</strong>{" "}
                          {formatDate(event.StartDate)}
                        </div>
                        <div>
                          <strong>End Date:</strong> {formatDate(event.EndDate)}
                        </div>
                        <div>
                          <strong>RSVP by:</strong>{" "}
                          {formatDate(event.RsvpEndTime)}
                        </div>
                      </Typography>
                      <div className="mt-2 text-sm text-gray-600">
                        <strong>Number of RSVPs:</strong>{" "}
                        {rsvpCounts[event.id] || 0}
                      </div>
                      <div className="mt-4">
                        {event.status === "active" ? (
                          <div className="flex space-x-4">
                            {isRSVPed(event.id) ? (
                              <button
                                className="flex-1 bg-[#808080] text-white py-2 px-4 rounded-md hover:bg-[#A0A0A0] transition-all"
                                onClick={() => handleLeave(event)}
                              >
                                UN RSVP
                              </button>
                            ) : (
                              <span className="flex-1 text-gray-700 font-bold py-2 px-4 rounded-md">
                                RSVP for this event is CLOSED
                              </span>
                            )}
                          </div>
                        ) : event.status === "rsvp" ? (
                          <div className="flex space-x-4">
                            {isRSVPed(event.id) ? (
                              <button
                                className="flex-1 bg-[#808080] text-white py-2 px-4 rounded-md hover:bg-[#A0A0A0] transition-all"
                                onClick={() => handleLeave(event)}
                              >
                                UN RSVP
                              </button>
                            ) : (
                              <button
                                className="flex-1 bg-[#a8bf22] text-white py-2 px-4 rounded-md hover:bg-[#bcd727] transition-all"
                                onClick={() => handleRSVP(event)}
                              >
                                RSVP
                              </button>
                            )}
                          </div>
                        ) : (
                          <span className="flex-1 text-gray-700 font-bold py-2 px-4 rounded-md">
                            Event status unknown
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <Typography>No upcoming events to display</Typography>
            )}

            <div className="rounded bg-gray-50 p-4 relative">
              <h2 className="text-2xl font-semibold mb-4">Past Events</h2>

              {pastEvents.length > 0 ? (
                <div className="overflow-x-auto">
                  <ul className="flex space-x-6">
                    {pastEvents.map((event) => (
                      <li
                        key={event.id}
                        className="min-w-[300px] w-[300px] bg-white shadow-2xl rounded-md flex flex-col p-4"
                      >
                        <div className="mb-4">
                          <img
                            src="https://th.bing.com/th/id/OIP.F00dCf4bXxX0J-qEEf4qIQHaD6?rs=1&pid=ImgDetMain"
                            alt={event.Name}
                            className="w-full h-40 object-cover rounded"
                          />
                        </div>
                        <div className="border-b-2 border-gray-300 mb-2">
                          <h3 className="text-xl font-semibold text-center">
                            {event.Name}
                          </h3>
                        </div>

                        <div className="text-gray-600 flex-grow">
                          <div className="mb-2">
                            <strong>Description:</strong>{" "}
                            {event.EventDescription}
                          </div>
                          <div>
                            <strong>Location:</strong> {event.Location}
                          </div>
                          <div>
                            <strong>Start Date:</strong>{" "}
                            {formatDate(event.StartDate)}
                          </div>
                          <div>
                            <strong>End Date:</strong>{" "}
                            {formatDate(event.EndDate)}
                          </div>
                        </div>

                        <div className="mt-auto">
                          <button
                            className="fixed-button bg-[#a8bf22] text-white py-2 px-4 rounded-md hover:bg-[#bcd727] transition-all"
                            onClick={() => handleCommentReview(event)}
                          >
                            Leave a Comment & Review
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div>No past events</div>
              )}
            </div>
          </div>
        )}
      </div>
      <div>
        {activeTab === "polls" && (
          <div>
            <div className="flex flex-wrap gap-4 justify-start">
              {allPolls.length > 0 ? (
                allPolls.map((poll, index) => (
                  <div
                    key={index}
                    className="p-4 bg-white shadow-lg rounded-md max-w-xs w-full"
                    style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" }}
                  >
                    <h3 className="text-xl font-semibold border-b-2 border-gray-300 mb-2">
                      {poll.Question}
                    </h3>
                    <ul>
                      {poll.Opt.map((poll_option, poll_option_index) => (
                        <div
                          key={poll_option_index}
                          className="mt-2 flex items-center"
                        >
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
                            disabled={poll.selected}
                            checked={
                              poll.selected &&
                              poll.selected_option === poll_option.title
                            }
                          />
                          <label
                            htmlFor={`poll-${poll.id}-opt-${poll_option_index}`}
                          >
                            {poll_option.title}
                          </label>
                        </div>
                      ))}
                    </ul>
                  </div>
                ))
              ) : (
                <Typography>No polls available</Typography>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8"></div>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          <div className="flex">
            <div className="flex-1 pr-4">
              <Typography variant="h6" gutterBottom>
                All Comments and Ratings
              </Typography>

              {currentEventObject && currentEventObject.Reviews ? (
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

      {/* UNRSVP Confirmation Dialog */}
      <Dialog open={confirmUnRSVP} onClose={cancelLeave}>
        <DialogTitle>Confirm Un-RSVP</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to un-RSVP from the event:{" "}
            {currentEventToUnRSVP?.Name}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelLeave} color="primary">
            No
          </Button>
          <Button onClick={confirmLeave} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
