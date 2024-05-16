import React, { useState, useEffect } from "react";
import EventDB from "../../database/community/event";
import EventCard from "../_Components/EventCard";

import Grid from "@mui/material/Grid";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import Paper from "@mui/material/Paper";

import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Button } from "@mui/material";

function EventsHolder({
  communityID,
  createEvent,
  setShowEventForm,
  setEventForm,
}) {
  //const [communityID, setCommunityID] = useState(communityID);
  const [allEvents, setAllEvents] = useState([]);

  const [spacing, setSpacing] = React.useState(2);

  const handleChange = (event) => {
    setSpacing(Number(event.target.value));
  };

  const jsx = `
<Grid container spacing={${spacing}}>
`;

  useEffect(() => {
    EventDB.getEventFromCommunityID(communityID, setAllEvents);
  }, []);

  return (
    <div className="mt-4">
      <h1 className="text-xxl">Upcoming Events</h1>

      <div style={{ overflowX: "auto", whiteSpace: "nowrap" }}>
        {allEvents.length == 0 ? (
          <>
            <center>You have no enteries</center>
          </>
        ) : (
          <>
            <Grid container spacing={2}>
              {allEvents.map((value) => (
                <Grid key={value} item>
                  <Card sx={{ maxWidth: 345 }}>
                    <CardHeader
                      avatar={
                        <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                          R
                        </Avatar>
                      }
                      action={
                        <IconButton aria-label="settings">
                          <MoreVertIcon />
                        </IconButton>
                      }
                      title={value.Name}
                      subheader="September 14, 2016"
                    />

                    <CardContent>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        style={{ whiteSpace: "pre-wrap" }}
                      >
                        {value.EventDescription}
                      </Typography>
                    </CardContent>
                    <CardActions disableSpacing>
                      {/* <Button
                        onClick={() => {
                          setShowEventForm(true);
                          setEventForm(value);
                          console.log(value);
                        }}
                      >
                        edit
                      </Button> */}
                      <Button
                        color="error"
                        onClick={() => {
                          console.log(value);
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
          </>
        )}
      </div>

      {/* <Grid item xs={12}>
        <Grid container justifyContent="center" spacing={spacing}>
          {allEvents.map((value) => (
            <>
              <Grid key={value} item>
                <EventCard event={value} />
              </Grid>

              <Grid key={value} item>
                <EventCard event={value} />
              </Grid>

              <Grid key={value} item>
                <EventCard event={value} />
              </Grid>
            </>
          ))}
        </Grid>
      </Grid> */}
    </div>
  );
}

export default EventsHolder;
