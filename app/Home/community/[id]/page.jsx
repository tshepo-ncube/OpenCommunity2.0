"use client";
import {
  CircularProgress,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Alert,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import db from "../../../../database/DB";
import PollDB from "@/database/community/poll";
import EventDB from "@/database/community/event";
import { RWebShare } from "react-web-share";

export default function CommunityPage({ params }) {
  const { id } = params;
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allPolls, setAllPolls] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [pollsUpdated, setPollsUpdated] = useState(false);
  const [USER_ID, setUSER_ID] = useState(localStorage.getItem("UserID"));
  const [community, setCommunity] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [rsvpState, setRsvpState] = useState({}); // Track RSVP state for each event

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
    if (allPolls.length > 0 && !pollsUpdated) {
      updatePolls();
      setPollsUpdated(true);
    }
  }, [allPolls]);

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

  const handleCommentReview = (eventName) => {
    setCurrentEvent(eventName);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentEvent(null);
  };

  const handleClosedEventClick = () => {
    setAlertOpen(true);
  };

  const handleCloseAlert = () => {
    setAlertOpen(false);
  };

  const handleRSVP = async (eventID) => {
    try {
      await EventDB.addRSVP(eventID, localStorage.getItem("Email"));
      setRsvpState((prev) => ({ ...prev, [eventID]: true }));
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

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString();
  const formatTime = (dateStr) => new Date(dateStr).toLocaleTimeString();

  // Filter events based on status
  const upcomingEvents = allEvents.filter(
    (event) => event.status === "active" || event.status === "rsvp"
  );

  const pastEvents = allEvents.filter(
    (event) => event.status === "past" // Adjust filtering based on your status or date
  );

  return (
    <div className="">
      <div
        className="relative text-white py-4"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1575037614876-c38a4d44f5b8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
          backgroundSize: "cover",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 text-center">
          <Typography variant="h2" gutterBottom>
            {community.CommunityName}
          </Typography>
          <Typography variant="h4" gutterBottom>
            {community.Description}
          </Typography>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8">
        {/* Upcoming Events */}
        <div className="rounded border border-black bg-openbox-green p-4">
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
                    <strong>Start Time:</strong> {formatTime(event.StartDate)}
                    <br />
                    <strong>End Date:</strong> {formatDate(event.EndDate)}
                    <br />
                    <strong>End Time:</strong> {formatTime(event.EndDate)}
                    <br />
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
                          variant="text"
                          color="secondary"
                          className="w-full"
                          onClick={() => handleLeave(event.id)}
                        >
                          UN RSVP
                        </Button>
                      ) : (
                        <Button
                          variant="text"
                          color="primary"
                          className="w-full"
                          onClick={() => handleRSVP(event.id)}
                        >
                          RSVP
                        </Button>
                      ))
                    )}
                  </div>
                </li>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No upcoming events.
              </Typography>
            )}
          </ul>
        </div>

        {/* Past Events */}
        <div className="rounded border border-black bg-openbox-green p-4">
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
                    <strong>Start Time:</strong> {formatTime(event.StartDate)}
                    <br />
                    <strong>End Date:</strong> {formatDate(event.EndDate)}
                    <br />
                    <strong>End Time:</strong> {formatTime(event.EndDate)}
                    <br />
                    <strong>RSVP by:</strong> {formatDate(event.RsvpEndTime)}
                  </Typography>
                  <Button
                    variant="text"
                    color="primary"
                    className="mt-4 w-full"
                    onClick={() => handleCommentReview(event.Name)}
                  >
                    Leave a Comment & Review
                  </Button>
                </li>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No past events.
              </Typography>
            )}
          </ul>
        </div>

        {/* Polls */}
        <div className="rounded border border-black bg-openbox-green p-4">
          <h2 className="text-2xl font-semibold mb-4">Polls</h2>
          <ul className="space-y-4">
            {allPolls.length > 0 ? (
              allPolls.map((poll) => (
                <li key={poll.id} className="p-4 bg-white shadow rounded-md">
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    style={{ whiteSpace: "pre-wrap" }}
                  >
                    <div className="border-b-2 border-gray-300 mb-2">
                      <h3 className="text-xl font-semibold">{poll.Question}</h3>
                    </div>
                    {poll.Options && poll.Options.length > 0 ? (
                      poll.Options.map((option) => (
                        <div key={option} className="flex items-center">
                          <input
                            type="radio"
                            id={`${poll.id}-${option}`}
                            name={`poll-${poll.id}`}
                            value={option}
                            checked={poll.selected_option === option}
                            disabled={poll.selected}
                            onChange={() =>
                              handlePollOptionSelection(poll.id, option)
                            }
                          />
                          <label
                            htmlFor={`${poll.id}-${option}`}
                            className="ml-2"
                          >
                            {option}
                          </label>
                        </div>
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No options available.
                      </Typography>
                    )}
                  </Typography>
                </li>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No polls available.
              </Typography>
            )}
          </ul>
        </div>
      </div>

      {/* Review Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          Leave a Review and Comment about {currentEvent}
        </DialogTitle>
        <DialogContent>{/* Add your review form here */}</DialogContent>
        <Button onClick={handleCloseDialog}>Close</Button>
      </Dialog>
    </div>
  );
}
