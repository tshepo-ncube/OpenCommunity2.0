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

function EventsHolder({ communityID, createEvent }) {
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
            <center>You have no events currently.</center>
          </>
        ) : (
          <>
            <Grid container justifyContent="flex-start" spacing={2}>
              {allEvents.map((value) => (
                <>
                  <Grid key={value.id} item>
                    <EventCard event={value} />
                  </Grid>
                </>
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
