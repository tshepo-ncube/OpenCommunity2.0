import { NextResponse } from "next/server";
import axios from "axios";
import qs from "qs";
import CommunityDB from "../../../database/community/community";

// Replace with your Azure AD App details
const tenantId = "bd82620c-6975-47c3-9533-ab6b5493ada3";
const clientId = "1bc7d53f-6a03-4ab1-ac52-c5ad91aff9bb";
const clientSecret = "UUs8Q~y7tJC~1wL3rcgc5mnSnY3pmK9BIZTjbdb_";
const authorityHostUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
const scope = "https://graph.microsoft.com/.default";

async function getAccessToken() {
  const url = `${authorityHostUrl}`;
  const headers = { "Content-Type": "application/x-www-form-urlencoded" };
  const data = qs.stringify({
    client_id: clientId,
    scope: scope,
    client_secret: clientSecret,
    grant_type: "password",
    username: "uctstudents@openboxsoftware.com",
    password: "RDyEQ3z6!a4%aaIPi;U7",
  });

  try {
    const response = await axios.post(url, data, { headers: headers });
    return response.data.access_token;
  } catch (error) {
    console.error(`Error getting access token: ${error.message}`);
    throw new Error("Error getting access token");
  }
}

async function createTeamsChannel(token, teamId, channelDetails) {
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
    return response.data;
  } catch (error) {
    console.error(`Error creating channel: ${error.message}`);
    throw new Error("Error creating channel");
  }
}

export async function POST(request) {
  const { name, description, category, status } = await request.json();

  try {
    const token = await getAccessToken();
    const channelDetails = {
      displayName: name,
      description: description,
      membershipType: "standard", // or 'private'
    };
    const TeamID = "5e98ea06-b4c1-4f72-a52f-f84260611fef";

    const channel = await createTeamsChannel(token, TeamID, channelDetails);

    // Make a deep copy of the object
    const copiedObject = JSON.parse(JSON.stringify(channel));

    // Add the status and category fields to the copied object
    copiedObject.status = status;
    copiedObject.category = category;

    // Save the new channel object to the database
    await CommunityDB.createCommunity(copiedObject);

    return NextResponse.json(copiedObject);
  } catch (error) {
    console.error("Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
