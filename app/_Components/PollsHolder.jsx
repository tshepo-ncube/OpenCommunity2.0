import React, { useState, useEffect } from "react";
import EventDB from "../../database/community/event";
import PollDB from "../../database/community/poll";
import EventCard from "../_Components/EventCard";

import Grid from "@mui/material/Grid";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import Paper from "@mui/material/Paper";

// import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";

import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";

import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";

function PollsHolder({ communityID }) {
  //const [communityID, setCommunityID] = useState(communityID);
  const [allPolls, setAllPolls] = useState([]);

  const [spacing, setSpacing] = React.useState(2);

  const handleChange = (event) => {
    setSpacing(Number(event.target.value));
  };

  useEffect(() => {
    PollDB.getPollFromCommunityID(communityID, setAllPolls);
  }, []);

  return (
    <div className="mt-4">
      <h1 className="text-xxl">Polls</h1>

      <div style={{ overflowX: "auto", whiteSpace: "nowrap" }}>
        <Grid container justifyContent="flex-start" spacing={2}>
          {allPolls.map((value) => (
            <>
              <Grid key={value.id} item>
                <Card sx={{ maxWidth: 345 }}>
                  <CardContent>
                    <Typography variant="h8" className="font-semibold ">
                      {value.Question}
                    </Typography>
                    <Typography
                      variant="p"
                      style={{ whiteSpace: "pre-wrap", color: "black" }}
                    >
                      {value.Options.map((x, index) => (
                        <p key={index} className="text-gray-700">
                          {index + 1}. {x}
                        </p>
                      ))}
                    </Typography>
                  </CardContent>
                  <CardActions disableSpacing>
                    <Button> edit</Button>
                    <Button color="error">delete</Button>
                  </CardActions>
                </Card>
              </Grid>
            </>
          ))}
        </Grid>
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

export default PollsHolder;
