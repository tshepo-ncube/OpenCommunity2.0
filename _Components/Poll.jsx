// "use client";
// import React, { useState, useEffect } from "react";
// import ManageUser from "@/database/auth/ManageUser";
// const PollComponent = ({ pollObject }) => {

//   const [userData, setUserData] = useState(null);

//   const [userCommunities, setUserCommunities] = useState([]);
//   const [isAdmin, setIsAdmin] = useState([]);

//   useEffect(() => {
//     // Optionally, you can fetch vote data here and set it.
//     ManageUser.getProfileData(
//       localStorage.getItem("Email"),
//       setUserData,
//       setUserCommunities,
//       setIsAdmin
//     );
//     console.log("Poll Object: ", pollObject);
//   }, []);

//   useEffect(() => {
//     console.log("User Data: ", userData);
//   }, [userData]);

//   return (
//     <div class="flex flex-col items-center space-y-4">
//       <h2>{pollObject.Question}</h2>
//       <div class="flex flex-col items-center space-y-4">
//         {pollObject.Opt.map((poll, index) => (
//           <>
//             <p class="text-black border p-2 w-40">{poll.title}</p>
//             //if poll.id is in userData.MyCommunities array where there is a poll_id, please make the above p tag blue text, and by the way userData.MyCommunities is an array, and each array has community_id and polls_engageed
//           </>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default PollComponent;

"use client";
import React, { useState, useEffect } from "react";
import ManageUser from "@/database/auth/ManageUser";

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

const PollComponent = ({
  pollObject,
  communityID,
  handlePollOptionSelection,
  voting,
}) => {
  const [userData, setUserData] = useState(null);
  const [userCommunities, setUserCommunities] = useState([]);
  const [isAdmin, setIsAdmin] = useState([]);

  useEffect(() => {
    // Fetch user data.
    ManageUser.getProfileData(
      localStorage.getItem("Email"),
      setUserData,
      setUserCommunities,
      setIsAdmin
    );
    console.log("Poll Object: ", pollObject);
  }, []);

  useEffect(() => {
    console.log("User Data: ", userData);

    if (userData) {
      // Get all objects with community_id = "xyz"
      const filteredCommunities = userData.MyCommunities.filter(
        (community) => community.community_id === communityID
      );

      console.log(
        "Filtered Communities: ",
        filteredCommunities[0].polls_engaged
      );

      // Define the poll_id to search for
      //   const searchPollId = "Jm8VK9FGgW2ZpzolyIGg";

      // Find the object with the specified poll_id
      const foundPoll = filteredCommunities[0].polls_engaged.find(
        (poll) => poll.poll_id === pollObject.id
      );

      // Check if the selected_option is "Juice"
      if (foundPoll && foundPoll.selected_option === "Juice") {
        // console.log("The selected option is 'Juice'.");
      } else {
        //console.log(
        //  "The selected option is not 'Juice' or the poll was not found."
        // );
        // console.log(foundPoll.selected_option);
      }
    } else {
      //console.log("user data does not exists");
    }
  }, [userData]);

  // Helper function to check if a poll_id is in the user's communities.
  const isPollEngaged = (title) => {
    if (userData) {
      // Get all objects with community_id = "xyz"
      const filteredCommunities = userData.MyCommunities.filter(
        (community) => community.community_id === communityID
      );

      console.log(
        "Filtered Communities: ",
        filteredCommunities[0].polls_engaged
      );

      // Define the poll_id to search for
      const searchPollId = pollObject.id; //"Jm8VK9FGgW2ZpzolyIGg";

      // Find the object with the specified poll_id
      const foundPoll = filteredCommunities[0].polls_engaged.find(
        (poll) => poll.poll_id === searchPollId
      );

      // Check if the selected_option is "Juice"
      if (foundPoll && foundPoll.selected_option === title) {
        console.log("The selected option is 'Juice'.");
        return true;
      } else {
        console.log(
          "The selected option is not 'Juice' or the poll was not found."
        );
        console.log(foundPoll.selected_option);
        return false;
      }
      return false;
    }
  };

  return (
    <div>
      {voting ? (
        <>
          <CircularProgress style={{ color: "#bcd727", marginTop: 5, width: 40, height: 40 }} />;
        </>
      ) : (
        <>
          {" "}
          <div className="flex flex-col items-center space-y-4">
            <h2>{pollObject.Question}</h2>
            <div className="flex flex-col items-center space-y-4">
              {pollObject.Opt.map((poll, index) => (
                <div
                  onClick={() => {
                    handlePollOptionSelection(pollObject.id, poll.title);
                  }}
                  className={`p-2 w-80 border ${
                    isPollEngaged(poll.title)
                      ? "bg-openbox-green"
                      : "text-black"
                  }`}
                >
                  <p
                    key={index}
                    className={` ${
                      isPollEngaged(poll.title) ? "text-white" : "text-black"
                    }`}
                  >
                    {poll.title}
                  </p>

                  <p className="text-xs">{poll.votes} votes</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PollComponent;
