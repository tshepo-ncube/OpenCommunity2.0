"use client";
import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import { useRouter } from "next/navigation";
import { initializeApp } from "firebase/app";
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
  const upcomingEvents = [
    { id: 1, title: "Community Picnic", date: "2024-07-20" },
    { id: 2, title: "Yoga Session", date: "2024-07-22" },
  ];

  const polls = [
    { id: 1, question: "Which event should we host next?" },
    { id: 2, question: "Preferred time for yoga sessions?" },
  ];

  const pastEvents = [
    { id: 1, title: "Music Concert", date: "2024-07-10" },
    { id: 2, title: "Art Exhibition", date: "2024-07-05" },
  ];
  const { id } = params;
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [allPolls, setAllPolls] = useState();
  const [allEvents, setAllEvents] = useState();
  const [pollsUpdated, setPollsUpdated] = useState(false);
  const [USER_ID, setUSER_ID] = useState(localStorage.getItem("UserID"));
  const [community, setCommunity] = useState(null);

  useEffect(() => {
    console.log("useEffect called"); // Log to ensure useEffect is called
    if (id) {
      console.log("Fetching community with ID:", id); // Log the ID being fetched
      //setCommunity(id);
      const fetchCommunity = async () => {
        const communityRef = doc(db, "communities", id);
        try {
          const snapshot = await getDoc(communityRef);
          if (!snapshot.exists()) {
            console.log("No such document!");
            setLoading(false);
            return;
          }
          console.log("Community data:", snapshot.data()); // Log the fetched data

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
    console.log("All Polls : ", allPolls);

    if (allPolls) {
      // allPolls.forEach((obj) => {
      //   PollDB.checkIfPollExists(
      //     "IiLHMfnUZqgrR4OIyfcQ",
      //     params.id,
      //     obj.id //"bQEIfk3NmMBngJeZEmFZ"
      //   )
      //     .then((result) => {
      //       console.log(result);
      //       if (result) {
      //         console.log("The result: ", result);
      //         obj.selected = true;
      //         obj.selected_option = result;
      //       } else {
      //         console.log("The result: ", result);
      //         obj.selected = false;
      //       }
      //     })
      //     .catch((error) => {
      //       console.error("Error:", error);
      //     });
      //   // You can set this to any value you need
      // });

      // const updatedArray = allPolls.map((obj) => {
      //   PollDB.checkIfPollExists(
      //     "IiLHMfnUZqgrR4OIyfcQ",
      //     params.id,
      //     obj.id //"bQEIfk3NmMBngJeZEmFZ"
      //   )
      //     .then((result) => {
      //       console.log(result);
      //       if (result) {
      //         console.log("The result: ", result);
      //         obj.selected = true;
      //         obj.selected_option = result;
      //         return {
      //           ...obj,
      //           selected: true, // Example of a dynamic value based on existing properties
      //           selected_option: result,
      //         };
      //       } else {
      //         console.log("The result: ", result);
      //         obj.selected = false;
      //         return {
      //           ...obj,
      //           selected: false, // Example of a dynamic value based on existing properties
      //         };
      //       }
      //     })
      //     .catch((error) => {
      //       console.error("Error:", error);
      //     });
      // });

      // console.log("Updated All Polls: ", updatedArray);
      // setAllPolls(updatedArray);

      if (!pollsUpdated) {
        updatePolls();
        setPollsUpdated(true);
      }
    }
  }, [allPolls]);

  useEffect(() => {
    console.log("All Events: ", allEvents);
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
          console.log(result);
          if (result) {
            console.log("The result: ", result);
            obj.selected = true;
            obj.selected_option = result;
            return {
              ...obj,
              selected: true,
              selected_option: result,
            };
          } else {
            console.log("The result: ", result);
            obj.selected = false;
            return {
              ...obj,
              selected: false,
            };
          }
        } catch (error) {
          console.error("Error:", error);
          return obj; // Return the original object in case of an error
        }
      })
    );

    console.log("Updated All Polls: ", updatedArray);
    setAllPolls(updatedArray);
  };

  const handlePollOptionSelection = (pollId, selectedOption) => {
    console.log(`Poll ID: ${pollId}, Selected Option: ${selectedOption}`);
    PollDB.voteFromPollId(params.id, pollId, selectedOption)
      .then((result) => {
        //console.log("Vote Result : ", result);
        setPollsUpdated(false);
        PollDB.getPollFromCommunityIDForUser(id, setAllPolls);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    //
    // Perform any additional logic or state updates here
  };

  //   useEffect(() => {
  //     setStudentURL(window.location.href);
  //     const urlParams = new URLSearchParams(window.location.search);
  //     const hashParam = urlParams.get("hash");
  //     const interactRefParam = urlParams.get("interact_ref");

  //     if (hashParam && interactRefParam) {
  //       console.log(hashParam);
  //       console.log(interactRefParam);

  //       finishPayment(interactRefParam);
  //     } else {
  //       console.log("Not waiting...");
  //     }
  //   }, []);

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

  function fixDateString(dateStr) {
    // Extract parts from the input string
    const regex =
      /^(\w+ \d{1,2}, \d{4}) at (\d{1,2}:\d{2}:\d{2} [APM]+) UTC([+-]\d{1,2})$/;
    const match = dateStr.match(regex);

    if (!match) {
      throw new Error("Invalid date format");
    }

    const [, datePart, timePart, offsetPart] = match;

    // Convert the time part to 24-hour format
    const [time, period] = timePart.split(" ");
    let [hours, minutes, seconds] = time.split(":").map(Number);

    if (period === "PM" && hours !== 12) {
      hours += 12;
    } else if (period === "AM" && hours === 12) {
      hours = 0;
    }

    // Construct the new date string in ISO format
    const isoDateStr = `${datePart.replace(/,/, "")}T${hours
      .toString()
      .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}${offsetPart}:00`;

    return isoDateStr;
  }

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
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative p-16">
          <div className="container mx-auto text-center p-4">
            <h1 className="text-4xl font-bold mb-4">{community.name}</h1>
            <p className="text-lg">
              {/* Join Us every Thursdays and Wednesdays for drinking. We meet and
              drink and the balcony. If you're an intern, all drinks are on the
              company by the way! */}
              {community.description}
            </p>
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
              <button className="bg-white rounded text-black px-6 py-1 mx-2  border border-gray-300">
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
            {/* {upcomingEvents.map((event) => (
              <li key={event.id} className="p-4 bg-white shadow rounded-md">
                <h3 className="text-xl font-medium">{event.title}</h3>
                <p className="text-gray-500">{event.date}</p>
              </li>
            ))} */}

            {allEvents.map((event) => (
              <li key={event.id} className="p-4 bg-white shadow rounded-md">
                <h3 className="text-xl font-medium">{event.Name}</h3>
                <p className="text-gray-500">{event.Location}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Polls */}
        <div className="rounded border border-black bg-openbox-green p-4">
          <h2 className="text-2xl font-semibold mb-4">Polls</h2>
          <ul className="space-y-4">
            {allPolls.map((poll) => (
              <li key={poll.id} className="p-4 bg-white shadow rounded-md">
                <h3 className="text-xl font-medium">{poll.Question}</h3>

                {/* {poll.Options.map((poll_option) => (
                  <div className="mt-2">
                    <input
                      type="radio"
                      name={`poll-${poll.id}`}
                      id={`poll-${poll.id}-option-2`}
                      className="mr-2"
                    />
                    <label htmlFor={`poll-${poll.id}-option-2`}>
                      {poll_option}
                    </label>
                  </div>
                ))} */}

                {poll.Opt.map((poll_option, poll_option_index) => (
                  <div className="mt-2">
                    <input
                      type="radio"
                      name={`poll-${poll.id}`}
                      id={`poll-${poll.id}-opt-${poll_option_index}`}
                      className="mr-2"
                      onChange={() =>
                        handlePollOptionSelection(poll.id, poll_option.title)
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
              </li>
            ))}
          </ul>
        </div>

        {/* Past Events */}
        <div className="rounded border border-gray-300 bg-openbox-green p-4">
          <h2 className="text-2xl font-semibold mb-4">Past Events</h2>
          <ul className="space-y-4">
            {pastEvents.map((event) => (
              <li key={event.id} className="p-4 bg-white shadow rounded-md">
                <h3 className="text-xl font-medium">{event.title}</h3>
                <p className="text-gray-500">{event.date}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
