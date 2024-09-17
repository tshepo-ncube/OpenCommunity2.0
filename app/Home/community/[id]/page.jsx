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
import { doc, getDoc } from "firebase/firestore";
import db from "../../../../database/DB";
import PollDB from "@/database/community/poll";
import EventDB from "@/database/community/event";
import TabTitle from "../../../_Components/TabNavigation"

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
  const [activeTab, setActiveTab] = useState("events"); 
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
  //   console.log(currentEventObject);
  // }, [currentEventObject]);
  //Modjadji

  return (
    <div className="">
      {/* Cover image: needs to be the community profile picture */}
      <div className="relative text-white py-4 h-50 "
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1575037614876-c38a4d44f5b8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
          backgroundSize: "cover",
        }}
      >
        {/* What is the point of this empty DIV? */}
        <div className="absolute inset-0 bg-black opacity-50"></div> 
        <div className="relative z-10 text-center py-5">
          <Typography variant="h2" gutterBottom className="font-bold">
            {community.name}
          </Typography>
          <p className="text-md text-white">{community.description}</p>
          <center className="mt-6">
            <button className="bg-[#a8bf22] hover:bg-[#bcd727] text-white rounded text-center px-3 p-2"
              onClick={() => {
                window.open(
                  `${community.WebUrl}`,
                  // "https://teams.microsoft.com/l/channel/19%3a28846b557cf84441955bb303c21d5543%40thread.tacv2/Modjajiii?groupId=5e98ea06-b4c1-4f72-a52f-f84260611fef&tenantId=bd82620c-6975-47c3-9533-ab6b5493ada3",
                  "_blank"
                );
              }}
            >
              Teams
            </button>
            <RWebShare
              data={{
                text: `Community Name - ${community.name}`,
                url: `http://localhost:3000/${id}`,
                title: `Community Name - ${community.name}`,
              }}
              onClick={() => console.log("shared successfully!")}
            >
              <button className=" bg-[#bcd727] hover:bg-[#a8bf22] text-white rounded px-3 py-2 mx-2">
                Share
              </button>
            </RWebShare>
          </center>
        </div>
      </div>
    
      <div className="flex justify-center mb-6 space-x-10 mt-4">
        {/* Tab Buttons */}
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

      
        {/* TAB CONTENT FOR EVENTS */}
        <div>
          {activeTab === "events" && (
          
          <div className="rounded bg-gray-50 p-4 pb-4">
            <h2 className="text-2xl font-semibold mb-4">Upcoming Events</h2>
            {upcomingEvents.length > 0 ? (
            <div className="overflow-x-auto">
              <ul className="flex space-x-6">
                {upcomingEvents.map((event) => (
                  <li key={event.id} className="min-w-[300px] w-[300px] bg-white shadow rounded-md p-4">
                    {/* Event Image */}
                    <div className="mb-4">
                      <img
                        src="https://images.unsplash.com/photo-1534327737286-52d27a912124?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt={event.Name}
                        className="w-full h-40 object-cover rounded"
                      />
                    </div>
                    <div className="border-b-2 border-gray-300 mb-2">
                      <h3 className="text-xl font-semibold text-center">{event.Name}</h3>
                    </div>
                    <Typography variant="body2" color="text.secondary" style={{ whiteSpace: "pre-wrap" }}>
                      <div className="mb-2">
                        {event.EventDescription}
                      </div>
                      <div>
                        <strong>Location:</strong> {event.Location}
                      </div>
                      <div>
                        <strong>Start Date:</strong> {formatDate(event.StartDate)}
                      </div>
                      <div>
                        <strong>End Date:</strong> {formatDate(event.EndDate)}
                      </div>
                      <div>
                        <strong>RSVP by:</strong> {formatDate(event.RsvpEndTime)}
                      </div>
                    </Typography>

                    <div className="mt-4">
                      {event.status === "active" ? (
                        <div className="flex space-x-4">
                          {/* Closed Button */}
                          <button
                            className="flex-1 bg-[#a8bf22] text-white py-2 px-4 rounded-md hover:bg-[#bcd727] transition-all"
                            onClick={handleClosedEventClick}
                          >
                            Closed
                          </button>

                            {/* Share Button */}
                            <button
                              className="flex-1 bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400 transition-all"
                              onClick={() => handleShare(event)}
                            >
                              Share
                            </button>
                          </div>
                        ) : (
                          event.status === "rsvp" && (
                            <div className="flex space-x-4">
                              {/* RSVP/Un-RSVP Button */}
                              {isRSVPed(event.id) ? (
                                <button
                                  className="flex-1 bg-[#a8bf22] text-white py-2 px-4 rounded-md hover:bg-[#bcd727] transition-all"
                                  onClick={() => handleLeave(event.id)}
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

                              {/* Share Button: Logic needs to share event details? */}
                              <RWebShare
                                data={{
                                  text: `Community Name - ${community.name}`,
                                  url: `http://localhost:3000/${id}`,
                                  title: `Community Name - ${community.name}`,
                                }}
                                onClick={() => console.log("shared successfully!")}
                                >
                                <button className="flex-1 bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400 transition-all">
                                  Share
                                </button>
                              </RWebShare>
                            </div>
                          )
                        )}
                      </div>
                  </li>
                  ))
                }
                
              </ul>
            </div>
            ) : (
              <Typography>No upcoming events to display</Typography>)}

            {/* Past Events */}

            <div className="rounded bg-gray-50 p-4 relative">
            <h2 className="text-2xl font-semibold mb-4">Past Events</h2>

            {pastEvents.length > 0 ? (
              <div className="overflow-x-auto">
                <ul className="flex space-x-6">
                  {pastEvents.map((event) => (
                    <li
                      key={event.id}
                      className="min-w-[300px] w-[300px] bg-white shadow rounded-md p-4"
                    >
                      {/* Event Image */}
                      <div className="mb-4">
                        <img
                          src="https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                          alt={event.Name}
                          className="w-full h-40 object-cover rounded"
                        />
                      </div>
                      <div className="border-b-2 border-gray-300 mb-2">
                        <h3 className="text-xl font-semibold text-center">
                          {event.Name}
                        </h3>
                      </div>

                      <div className="text-gray-600">
                        <div className="mb-2">
                          <strong>Description:</strong> {event.EventDescription}
                        </div>
                        <div>
                          <strong>Location:</strong> {event.Location}
                        </div>
                        <div>
                          <strong>Start Date:</strong> {formatDate(event.StartDate)}
                        </div>
                        <div>
                          <strong>End Date:</strong> {formatDate(event.EndDate)}
                        </div>
                      </div>

                      <div className="mt-4">
                        <button
                          className="w-full text-white py-2 px-4 rounded-md"
                          style={{ backgroundColor: "#a8bd22" }} // Custom color for default state
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
            </div>)} 
        </div>

        {/* TAB CONTENT FOR POLLS */}
        <div className="text-center">
            {activeTab === "polls" && (
            <div>
                <h3 className="text-2xl font-semibold">Polls</h3>
                {
                
                <div className="rounded   bg-gray-50 p-4">
                {/* <h2 className="text-2xl font-semibold mb-4">Polls</h2> */}
                {allPolls.length > 0 ? (
                  allPolls.map((poll, index) => (
                    <div key={index} className="p-4 bg-white shadow rounded-md mb-4">
                      <Typography variant="body2" color="text.secondary">
                        <h3 className="text-xl font-semibold border-b-2 border-gray-300 mb-2">
                          {poll.Question}
                        </h3>
                        <ul>
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
                
                }
            </div>
            )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8">

        {/* Polls */}
         {/* <div className="rounded   bg-gray-50 p-4">
          <h2 className="text-2xl font-semibold mb-4">Polls</h2>
          {allPolls.length > 0 ? (
            allPolls.map((poll, index) => (
              <div key={index} className="p-4 bg-white shadow rounded-md mb-4">
                <Typography variant="body2" color="text.secondary">
                  <h3 className="text-xl font-semibold border-b-2 border-gray-300 mb-2">
                    {poll.Question}
                  </h3>
                  <ul>
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
        </div>  */}
      </div>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          Leave a Review and Comment about {currentEvent}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Comment"
            fullWidth
            multiline
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <Typography component="legend">Rating</Typography>
          <Rating
            name="simple-controlled"
            value={rating}
            onChange={(event, newValue) => {
              setRating(newValue);
            }}
          />
          <Typography component="legend">Upload Images</Typography>
          <input
            accept="image/*"
            id="contained-button-file"
            multiple
            type="file"
            onChange={handleImageUpload}
            style={{ display: "none" }}
          />
          <label htmlFor="contained-button-file">
            <Button
              variant="contained"
              color="primary"
              component="span"
              style={{ marginTop: "10px" }}
            >
              Upload
            </Button>
          </label>
          {selectedImages.length > 0 && (
            <div className="mt-2">
              <Typography component="legend">Selected Images</Typography>
              <div className="flex flex-wrap">
                {selectedImages.map((image, index) => (
                  <img
                    key={index}
                    src={URL.createObjectURL(image)}
                    alt={`Selected ${index}`}
                    style={{
                      width: "50px",
                      height: "50px",
                      marginRight: "10px",
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmitReview} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
