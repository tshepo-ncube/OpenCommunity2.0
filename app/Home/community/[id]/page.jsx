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
import imageCompression from "browser-image-compression";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Import storage functions
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UserDB from "@/database/community/users";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import db from "../../../../database/DB";
import PollDB from "@/database/community/poll";
import EventDB from "@/database/community/event";
import CommunityDB from "@/database/community/community";

import strings from "../../../../Utils/strings.json";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import ImageGallery from "@/_Components/ImageGallery";
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
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);
  const [initialImageIndex, setInitialImageIndex] = useState(0);
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
  const handleOpenGallery = (images, index = 0) => {
    setGalleryImages(images);
    setInitialImageIndex(index);
    setGalleryOpen(true);
  };

  const handleCloseGallery = () => {
    setGalleryOpen(false);
  };
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
        CommunityDB.incrementCommunityScore(params.id, 1);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file, index) => ({
      file,
      name: `image_${selectedImages.length + index + 1}`,
    }));
    setSelectedImages((prevImages) => [...prevImages, ...newImages]);
  };

  const handleImageDeselect = (indexToRemove) => {
    setSelectedImages((prevImages) => {
      const updatedImages = prevImages.filter(
        (_, index) => index !== indexToRemove
      );
      return updatedImages.map((img, index) => ({
        ...img,
        name: `image_${index + 1}`,
      }));
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
      // await EventDB.addRSVP(event.id, localStorage.getItem("Email"));
      console.log("id ", id);
      await CommunityDB.incrementCommunityScore(id, 1);

      setRsvpState((prev) => ({ ...prev, [event.id]: true }));
      setRsvpCounts((prev) => ({
        ...prev,
        [event.id]: (prev[event.id] || 0) + 1,
      }));

      // Update the allEvents state to reflect the new RSVP
      setAllEvents((prevEvents) =>
        prevEvents.map((e) =>
          e.id === event.id
            ? { ...e, rsvp: [...(e.rsvp || []), localStorage.getItem("Email")] }
            : e
        )
      );
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
      setRsvpCounts((prev) => ({
        ...prev,
        [currentEventToUnRSVP.id]: Math.max(
          (prev[currentEventToUnRSVP.id] || 0) - 1,
          0
        ),
      }));

      // Update the allEvents state to reflect the removed RSVP
      setAllEvents((prevEvents) =>
        prevEvents.map((e) =>
          e.id === currentEventToUnRSVP.id
            ? {
                ...e,
                rsvp: (e.rsvp || []).filter(
                  (email) => email !== localStorage.getItem("Email")
                ),
              }
            : e
        )
      );
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

  const pastEvents = allEvents.filter(
    (event) => event.status === "past" // Adjust filtering based on your status or date
  );
  const handleSubmitReview = async () => {
    const currentDate = new Date();
    const storage = getStorage(); // Initialize Firebase Storage

    try {
      const userID = localStorage.getItem("UserID");

      if (!userID) {
        throw new Error("UserID is not available in local storage");
      }

      const userRef = doc(db, "users", userID); // Fetch user details from Firestore
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        throw new Error("User not found in Firestore");
      }

      const userData = userSnap.data();
      const userName = userData.Name || "Unknown";
      const userSurname = userData.Surname || "Unknown";
      const userEmail = userData.Email || localStorage.getItem("Email");

      // Check if more than 10 images are selected
      if (selectedImages.length > 10) {
        alert("You can only upload up to 10 images.");
        return; // Stop submission if more than 10 images are selected
      }

      // Upload images to Firebase Storage and get download URLs
      const imageUrls = await Promise.all(
        selectedImages.map(async (image, index) => {
          try {
            const storageRef = ref(
              storage,
              `reviews/${userID}_${currentDate.getTime()}_${index}`
            ); // Create a unique reference for each image
            const snapshot = await uploadBytes(storageRef, image.file); // Upload the image file to Firebase Storage
            const downloadURL = await getDownloadURL(snapshot.ref); // Get the download URL of the uploaded image
            return downloadURL; // Return the download URL for storing in Firestore
          } catch (uploadError) {
            console.error("Error uploading image:", uploadError);
            throw uploadError;
          }
        })
      );

      // Create the new review object with fetched user data
      const newReview = {
        Comment: comment,
        Rating: rating,
        date: currentDate.toISOString(),
        images: imageUrls, // Store only the URLs of the uploaded images
        UserID: userID,
        UserEmail: userEmail,
        UserName: userName,
        UserSurname: userSurname,
      };

      // Ensure we have a valid event ID before submitting the review
      if (!currentEventObject || !currentEventObject.id) {
        throw new Error("Invalid event data");
      }

      const eventRef = doc(db, "events", currentEventObject.id);
      await updateDoc(eventRef, {
        Reviews: arrayUnion(newReview), // Add the new review to the existing reviews array
      });

      // Reset the form and state after submission
      setComment("");
      setRating(0);
      setSelectedImages([]);
      setOpenDialog(false);

      setCurrentEventObject((prevEvent) => ({
        ...prevEvent,
        Reviews: [...(prevEvent.Reviews || []), newReview],
      }));

      alert("Review submitted successfully!");
      await CommunityDB.incrementCommunityScore(id, 1);

      // try {
      //   CommunityDB.incrementCommunityScore(id, 1);
      // } catch (err) {
      //   console.log(err);
      // }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert(`Error submitting review: ${error.message}`);
    }
  };

  // Ensure users can only select up to 10 images
  const handleImageSelection = (event) => {
    const selectedFiles = Array.from(event.target.files);

    // Check if adding new images exceeds the limit
    if (selectedImages.length + selectedFiles.length > 10) {
      alert("You can only upload up to 10 images.");
      return; // Do not add images if the limit is exceeded
    }

    // Update the selected images state
    setSelectedImages((prevImages) => [
      ...prevImages,
      ...selectedFiles.map((file) => ({ file })),
    ]);
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
                            ) : event.RsvpLimitNumber &&
                              event.rsvp &&
                              event.rsvp.length >= event.RsvpLimitNumber ? (
                              <span className="flex-1 text-gray-700 font-bold py-2 px-4 rounded-md text-center">
                                RSVP capacity reached
                              </span>
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
                    {pastEvents.map((event) => {
                      // Calculate average rating
                      const averageRating =
                        event.Reviews && event.Reviews.length > 0
                          ? event.Reviews.reduce(
                              (sum, review) => sum + review.Rating,
                              0
                            ) / event.Reviews.length
                          : 0;

                      return (
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

                          <div className="mt-4 mb-2">
                            <div className="flex items-center justify-center space-x-2">
                              <Rating
                                value={averageRating}
                                readOnly
                                precision={0.1}
                              />
                              <span className="text-sm text-gray-600">
                                ({event.Reviews?.length || 0} reviews)
                              </span>
                            </div>
                          </div>

                          <div className="mt-auto">
                            <button
                              className="fixed-button bg-[#a8bf22] text-white py-2 px-4 rounded-md hover:bg-[#bcd727] transition-all w-full"
                              onClick={() => handleCommentReview(event)}
                            >
                              Leave a Comment & Review
                            </button>
                          </div>
                        </li>
                      );
                    })}
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

              <ul className="list-none p-0">
                {currentEventObject && currentEventObject.Reviews ? (
                  currentEventObject.Reviews.map((review, index) => {
                    const userInitials =
                      `${review.UserName?.[0] || ""}${review.UserSurname?.[0] || ""}`.toUpperCase();

                    return (
                      <li
                        className="bg-gray-200 p-4 mb-4 rounded flex flex-col justify-between relative"
                        key={index}
                        style={{
                          width: "450px",
                          height: "auto",
                          wordWrap: "break-word",
                        }} // Set a fixed width for the block
                      >
                        <div className="flex items-center mb-4">
                          <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center mr-3">
                            <span className="text-lg font-semibold">
                              {userInitials}
                            </span>
                          </div>
                          <Typography variant="body2" className="font-semibold">
                            {review.UserName} {review.UserSurname}
                          </Typography>
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <Rating
                              name={`rating-${index}`}
                              value={review.Rating}
                              readOnly
                              precision={0.5}
                            />
                          </div>
                          <Typography
                            variant="body1"
                            className="whitespace-normal break-words" // Ensure the text wraps correctly
                            style={{
                              whiteSpace: "normal",
                              wordWrap: "break-word",
                            }} // For ensuring line breaks
                          >
                            {review.Comment}
                          </Typography>

                          <Typography
                            variant="body2"
                            className="text-gray-600 text-sm absolute top-0 right-0"
                          >
                            {new Date(review.date).toLocaleDateString()}
                          </Typography>

                          {review.images && review.images.length > 0 && (
                            <div className="mt-2 flex flex-wrap">
                              {review.images
                                .slice(0, 4)
                                .map((imageUrl, imgIndex) => (
                                  <div
                                    key={imgIndex}
                                    className="w-24 h-24 m-1 cursor-pointer"
                                    onClick={() =>
                                      handleOpenGallery(review.images, imgIndex)
                                    }
                                  >
                                    <img
                                      src={imageUrl}
                                      alt={`Review image ${imgIndex + 1}`}
                                      className="w-full h-full object-cover rounded"
                                    />
                                  </div>
                                ))}

                              {review.images.length > 4 && (
                                <div
                                  className="relative w-24 h-24 mt-2 mr-2 cursor-pointer"
                                  onClick={() =>
                                    handleOpenGallery(review.images)
                                  }
                                >
                                  <img
                                    src={review.images[4]}
                                    alt="More images"
                                    className="w-full h-full object-cover rounded blur-sm"
                                  />
                                  <span className="absolute inset-0 flex items-center justify-center text-white bg-black bg-opacity-50 rounded">
                                    + {review.images.length - 4} more
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        <Typography
                          variant="body2"
                          className="text-gray-600 text-sm absolute bottom-0 right-0"
                        >
                          {review.UserEmail}
                        </Typography>
                      </li>
                    );
                  })
                ) : (
                  <Typography variant="body1">No reviews available.</Typography>
                )}
              </ul>
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
                onChange={(e) => {
                  if (e.target.value.length <= 1000) {
                    setComment(e.target.value);
                  }
                }}
                helperText={`${comment.length}/1000 characters`}
              />
              <div className="mt-2">
                <Typography variant="body1">Rating</Typography>
                <Rating
                  name="rating"
                  value={rating}
                  onChange={(e, newValue) => setRating(newValue)}
                />
              </div>

              <div className="mt-4">
                <Typography variant="body1">Upload Images</Typography>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="mt-2"
                />
                {selectedImages.length > 0 && (
                  <div className="mt-2">
                    <Typography variant="body2">
                      {selectedImages.length} image(s) selected
                    </Typography>
                    <div className="flex flex-wrap mt-2">
                      {selectedImages.map((image, index) => (
                        <div key={index} className="relative m-1">
                          <img
                            src={URL.createObjectURL(image.file)}
                            alt={image.name}
                            className="w-20 h-20 object-cover"
                          />
                          <Typography
                            variant="caption"
                            className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-center"
                          >
                            {image.name}
                          </Typography>
                          <button
                            onClick={() => handleImageDeselect(index)}
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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

      <ImageGallery
        images={galleryImages}
        open={galleryOpen}
        onClose={handleCloseGallery}
      />

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
