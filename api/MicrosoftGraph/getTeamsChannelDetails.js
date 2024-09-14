//const axios = require("axios");
import axios from "axios";
import qs from "qs";
//const qs = require("qs");

const TeamID = "5e98ea06-b4c1-4f72-a52f-f84260611fef";
const getAccessToken = async () => {
  const tenantId = "bd82620c-6975-47c3-9533-ab6b5493ada3";
  const clientId = "1bc7d53f-6a03-4ab1-ac52-c5ad91aff9bb";
  const clientSecret = "UUs8Q~y7tJC~1wL3rcgc5mnSnY3pmK9BIZTjbdb_";

  const tokenEndpoint = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;

  const tokenData = {
    grant_type: "password",
    username: "uctstudents@openboxsoftware.com",
    password: "RDyEQ3z6!a4%aaIPi;U7",
    //grant_type: "client_credentials",
    client_id: clientId,
    client_secret: clientSecret,
    scope: "https://graph.microsoft.com/.default",
  };

  const response = await axios.post(tokenEndpoint, qs.stringify(tokenData), {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return response.data.access_token;
};

getAccessToken()
  .then((token) => {
    const channelDetails = {
      displayName: "The Coffee Guys",
      description: "This is a new channel",
      membershipType: "standard", // or 'private'
    };

    createTeamsChannel(token, TeamID, channelDetails)
      .then((channel) => {
        console.log("Channel created successfully:", channel);
      })
      .catch((error) => {
        console.error(
          "Error creating channel:",
          error.response.data.error.message
        );
      });
  })
  .catch((err) => {
    console.log(err.response.data.error.message);
  });

async function getChannelDetails(accessToken, teamId, channelId) {
  //const token = await getAccessToken();

  // const token = await getAccessToken();
  const url = `https://graph.microsoft.com/v1.0/teams/${teamId}/channels/${channelId}`;
  const headers = { Authorization: `Bearer ${accessToken}` };

  try {
    const response = await axios.get(url, { headers: headers });
    console.log("Channel Details:", response.data);
  } catch (error) {
    console.error(`Error getting channel details: ${error}`);
    if (error.response) {
      console.error(`Response data: ${JSON.stringify(error.response.data)}`);
    }
    throw error;
  }
}

async function createTeamsChannel(token, teamId, channelDetails) {
  //const token = await getAccessToken();
  const url = `https://graph.microsoft.com/v1.0/teams/${teamId}/channels`;
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
  const channelData = {
    displayName: channelDetails.displayName,
    description: channelDetails.description,
    membershipType: channelDetails.membershipType || "standard", // 'standard' or 'private'
  };

  try {
    const response = await axios.post(url, channelData, { headers: headers });
    console.log("Channel created:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      `Error creating channel: ${error.response.data.error.message}`
    );
    if (error.response) {
      console.error(
        `Response data: ${JSON.stringify(error.response.data.error.message)}`
      );
    }
    throw error.response.data.error.message;
  }
}
