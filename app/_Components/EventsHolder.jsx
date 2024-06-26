import React, { useState, useEffect } from "react";
import EventDB from "../../database/community/event";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import Button from "@mui/material/Button";
import MoreVertIcon from "@mui/icons-material/MoreVert";

function EventsHolder({
  communityID,
  createEvent,
  setShowEventForm,
  setEventForm,
}) {
  const [allEvents, setAllEvents] = useState([]);

  useEffect(() => {
    EventDB.getEventFromCommunityID(communityID, setAllEvents);
  }, []);

  const formatDate = (timestamp) => {
    if (!timestamp) return "No Date"; // Handle null or undefined case
    const date = timestamp.toDate(); // Convert Firestore Timestamp to Date object
    return date.toLocaleDateString(); // Format date as per locale
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "No Time"; // Handle null or undefined case
    const time = timestamp.toDate(); // Convert Firestore Timestamp to Date object
    return time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); // Format time as per locale
  };

  return (
    <div className="mt-4">
      <h1 className="text-xxl">Upcoming Events</h1>

      <div style={{ overflowX: "auto", whiteSpace: "nowrap" }}>
        {allEvents.length === 0 ? (
          <center>You have no entries</center>
        ) : (
          <Grid container spacing={2}>
            {allEvents.map((value) => (
              <Grid key={value.id} item>
                <Card sx={{ maxWidth: 345 }}>
                  <CardHeader
                    avatar={
                      <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                        R
                      </Avatar>
                    }
                    title={value.Name}
                    subheader={`${formatDate(value.StartDate)} - ${formatDate(
                      value.EndDate
                    )}`}
                    action={
                      <IconButton aria-label="settings">
                        <MoreVertIcon />
                      </IconButton>
                    }
                  />
                  <CardContent>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      style={{ whiteSpace: "pre-wrap" }}
                    >
                      <strong>Date:</strong>{" "}
                      {`${formatDate(value.StartDate)} - ${formatDate(
                        value.EndDate
                      )}`}
                      <br />
                      <strong>Time:</strong>{" "}
                      {`${formatTime(value.StartDate)} - ${formatTime(
                        value.EndDate
                      )}`}
                      <br />
                      <strong>Location:</strong> {value.Location}
                      <br />
                      <strong>Description:</strong> {value.EventDescription}
                    </Typography>
                  </CardContent>
                  <CardActions disableSpacing>
                    {/* <Button
                      onClick={() => {
                        setShowEventForm(true);
                        setEventForm(value);
                      }}
                    >
                      edit
                    </Button> */}
                    <Button
                      color="error"
                      onClick={() => {
                        EventDB.deleteEvent(value.id);
                      }}
                    >
                      delete
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </div>
    </div>
  );
}

export default EventsHolder;
