"use client";
import { CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import db from "../../../../database/DB";

import {
  FacebookShareCount,
  HatenaShareCount,
  OKShareCount,
  PinterestShareCount,
  RedditShareCount,
  TumblrShareCount,
  VKShareCount,
  TwitterIcon,
} from "react-share";
import { RWebShare } from "react-web-share";
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
  const [community, setCommunity] = useState(null);

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

  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString();
  }

  function formatTime(dateStr) {
    return new Date(dateStr).toLocaleTimeString();
  }

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
                    <h3 className="text-xl font-semibold mb-2">{event.Name}</h3>
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
                  <div className="mt-2" key={poll_option_index}>
                    <input
                      type="radio"
                      name={`poll-${poll.id}`}
                      id={`poll-${poll.id}-opt-${poll_option_index}`}
                      className="mr-2"
                      onChange={() =>
                        handlePollOptionSelection(poll.id, poll_option.title)
                      }
                      checked={poll.selected_option === poll_option.title}
                    />
                    <label htmlFor={`poll-${poll.id}-opt-${poll_option_index}`}>
                      {poll_option.title}
                    </label>
                  </div>
                ))}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Past Events Section */}
      <div className="p-8">
        <h2 className="text-2xl font-semibold mb-4">Past Events</h2>
        <div className="flex overflow-x-auto space-x-6">
          {pastEvents.length > 0 ? (
            pastEvents.map((event) => (
              <div
                key={event.id}
                className="flex-none w-80 bg-white shadow rounded-md p-4"
              >
                <h3 className="text-xl font-semibold mb-2">{event.Name}</h3>
                <p>
                  <strong>Description:</strong> {event.EventDescription}
                </p>
                <p>
                  <strong>Location:</strong> {event.Location}
                </p>
                <p>
                  <strong>Start Date:</strong> {formatDate(event.StartDate)}
                </p>
                <p>
                  <strong>End Date:</strong> {formatDate(event.EndDate)}
                </p>
                <p>
                  <strong>RSVP by:</strong> {formatDate(event.RsvpEndTime)}
                </p>
              </div>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              No past events.
            </Typography>
          )}
        </div>
      </div>
    </div>
  );
}
