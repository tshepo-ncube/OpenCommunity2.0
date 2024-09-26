import axios from "axios";
const notifyRsvpdUsersOfEventChange = async (eventID) => {
  try {
    const res = await axios.post(
      "http://localhost:8080/notifyRsvpdUsersOfEventChange",
      { eventID },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    window.location.reload();
  } catch (error) {
    console.log(error);
  }
};

const notifyCommunityOfEventChange = async (communityID) => {
  console.log("CommunityID");
  try {
    const res = await axios.post(
      "http://localhost:8080/notifyCommunityOfEventChange",
      { communityID },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    window.location.reload();
  } catch (error) {
    console.log(error);
  }
};

export { notifyCommunityOfEventChange, notifyRsvpdUsersOfEventChange };
