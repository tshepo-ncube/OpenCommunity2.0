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
        <div className="relative p-16">
          <div className="container mx-auto text-center p-4">
            <h1 className="text-4xl font-bold mb-4">{community.name}</h1>
            <p className="text-lg">{community.description}</p>
          </div>

          <center>
            <button
              onClick={() => {
                window.open(
                  "https://teams.microsoft.com/l/channel/19%3Ab862f05c7a864cdc8446d54bbecc9024%40thread.tacv2/Drinking%20Club%20Channel?groupId=3b8c7688-b69d-43a0-8ca0-7a1a5bffa665&tenantId=",
                  "_blank"
                );
              }}
              className="bg-white rounded text-black px-6 py-1 mx-2 border border-gray-300"
            >
              teams
            </button>

            <RWebShare
              data={{
                text: `Community Name - ${community.name}`,
                url: `http://localhost:3000/${id}`,
                title: `Community Name - ${community.name}`,
              }}
              onClick={() => console.log("shared successfully!")}
            >
              <button className="bg-white rounded text-black px-6 py-1 mx-2 border border-gray-300">
                invite
              </button>
            </RWebShare>
          </center>
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
                    <strong>End Date:</strong> {formatDate(event.EndDate)}
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
                    ) : event.status === "rsvp" ? (
                      <Button variant="text" color="primary" className="w-full">
                        RSVP
                      </Button>
                    ) : null}
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

        {/* Polls */}
        <div className="rounded border border-black bg-openbox-green p-4">
          <h2 className="text-2xl font-semibold mb-4">Polls</h2>
          <ul className="space-y-4">
            {allPolls.map((poll) => (
              <li key={poll.id} className="p-4 bg-white shadow rounded-md">
                <h3 className="text-xl font-medium">{poll.Question}</h3>
                {poll.Opt.map((poll_option, poll_option_index) => (
                  <div key={`${poll.id}-opt-${poll_option_index}`}>
                    <input
                      type="radio"
                      id={`${poll.id}-opt-${poll_option_index}`}
                      name={`poll-${poll.id}`}
                      value={poll_option.value}
                      onChange={() =>
                        handlePollOptionSelection(poll.id, poll_option.value)
                      }
                      checked={poll.selected_option === poll_option.value}
                    />
                    <label htmlFor={`${poll.id}-opt-${poll_option_index}`}>
                      {poll_option.title}
                    </label>
                  </div>
                ))}
              </li>
            ))}
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
                    <strong>End Date:</strong> {formatDate(event.EndDate)}
                  </Typography>
                  <div className="mt-4">
                    {event.status === "past" && (
                      <Button
                        variant="text"
                        color="primary"
                        className="w-full"
                        onClick={() => handleCommentReview(event.Name)}
                      >
                        Leave a Comment & Review
                      </Button>
                    )}
                  </div>
                </li>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No past events.
              </Typography>
            )}
          </ul>
        </div>
      </div>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          Leave a Review and Comment about {currentEvent}
        </DialogTitle>
        <DialogContent>
          {/* Content for leaving a review and comment */}
          <Typography>
            This is where the review and comment form would go.
          </Typography>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogContent>
      </Dialog>

      <Dialog open={alertOpen} onClose={handleCloseAlert}>
        <DialogContent>
          <Typography>RSVP for this event has closed.</Typography>
          <Button onClick={handleCloseAlert}>Close</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
