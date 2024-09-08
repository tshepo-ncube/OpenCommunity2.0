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
  Snackbar, // Import Snackbar
  Alert, // Import Alert for Snackbar
} from "@mui/material";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import db from "../../../../database/DB";
import PollDB from "@/database/community/poll";
import EventDB from "@/database/community/event";

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
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar state
  const [snackbarMessage, setSnackbarMessage] = useState(""); // Snackbar message

  const [eventRatings, setEventRatings] = useState({});

  useEffect(() => {
    const fetchEventRatings = async () => {
      const ratings = {};
      for (const event of allEvents) {
        ratings[event.id] = await getAverageRating(event.id);
      }
      setEventRatings(ratings);
    };

    if (allEvents.length > 0) {
      fetchEventRatings();
    }
  }, [allEvents]);
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
  const getAverageRating = async (eventId) => {
    try {
      const ratings = await EventDB.getRatingsForEvent(eventId);
      const totalRating = ratings.reduce(
        (acc, rating) => acc + rating.Rating,
        0
      );
      const averageRating = totalRating / ratings.length;
      return averageRating || 0; // Return 0 if there are no ratings
    } catch (error) {
      console.error("Error fetching ratings:", error);
      return 0; // Default to 0 if there's an error
    }
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

  // Filter events based on status
  const upcomingEvents = allEvents.filter(
    (event) => event.status === "active" || event.status === "rsvp"
  );

  const pastEvents = allEvents.filter(
    (event) => event.status === "past" // Adjust filtering based on your status or date
  );

  const handleSubmitReview = async () => {
    const newReview = {
      Comment: comment,
      Rating: rating,
    };

    try {
      // Call the function to add the review and handle image upload
      await EventDB.handleImageUpload(
        currentEventObject.id,
        selectedImages,
        newReview
      );

      // Show success message in the Snackbar
      setSnackbarMessage("Review submitted successfully!");
      setSnackbarOpen(true);

      // Close the dialog
      handleCloseDialog();
    } catch (error) {
      console.error("Error submitting review:", error);
      setSnackbarMessage("Failed to submit review.");
      setSnackbarOpen(true);
    }
  };

  // useEffect(() => {
  //   console.log(currentEventObject);
  // }, [currentEventObject]);
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
                    <br /> <strong></strong>
                    <Rating
                      value={event.averageRating}
                      precision={0.1}
                      readOnly
                    />
                  </Typography>
                  <Button
                    variant="text"
                    color="primary"
                    className="w-full mt-2"
                    onClick={() => handleCommentReview(event)}
                    style={{ color: "green" }} // Styling as blue text
                  >
                    Comment & Review
                  </Button>
                </li>
              ))
            ) : (
              <Typography>No past events</Typography>
            )}
          </ul>
        </div>
      </div>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Leave a Comment & Review</DialogTitle>
        <DialogContent>
          <Typography variant="h6">{currentEvent}</Typography>
          <TextField
            label="Comment"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <Rating
            name="simple-controlled"
            value={rating}
            onChange={(event, newValue) => setRating(newValue)}
          />
          <input
            accept="image/*"
            type="file"
            multiple
            onChange={handleImageUpload}
          />
          {selectedImages.length > 0 && (
            <div>
              {selectedImages.map((image, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(image)}
                  alt="Selected"
                  style={{ width: 100, height: 100 }}
                />
              ))}
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmitReview}>Submit</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={
            snackbarMessage === "Failed to submit review." ? "error" : "success"
          }
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
