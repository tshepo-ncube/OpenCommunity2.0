import axios from "axios";
const scheduleRsvpReminder = async (eventID) => {
  try {
    const res = await axios.post(
      strings.server_endpoints.scheduleRsvpReminder,
      { eventID },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.log(error);
  }
};

const scheduleEventStartReminder = async (eventID) => {
  try {
    const res = await axios.post(
      strings.server_endpoints.scheduleEventStartReminder,
      { eventID },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.log(error);
  }
};

const remindUsersOfNewPoll = async (eventID) => {
  try {
    const res = await axios.post(
      strings.server_endpoints.remindUsersOfNewPoll,
      { eventID },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.log(error);
  }
};

const scheduleEventEndReminder = async (eventID) => {
  try {
    const res = await axios.post(
      strings.server_endpoints.scheduleEventEndReminder,
      { eventID },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.log(error);
  }
};

async function eventScheduler(eventID) {
  scheduleEventEndReminder(eventID);
  scheduleEventStartReminder(eventID);
  scheduleRsvpReminder(eventID);
}

async function pollScheduler(eventID) {
  remindUsersOfNewPoll(eventID);
  schedulePollEndReminder(eventID);
}

export { pollScheduler, eventScheduler };
