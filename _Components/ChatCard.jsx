import * as React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import { Button, Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme }) => ({
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
  variants: [
    {
      props: ({ expand }) => !expand,
      style: {
        transform: "rotate(0deg)",
      },
    },
    {
      props: ({ expand }) => !!expand,
      style: {
        transform: "rotate(180deg)",
      },
    },
  ],
}));

export default function ChatCard({
  name,
  description,
  date,
  location,
  handleMore,
  start_date,
  end_date,
  setShowEventForm,

  setEventForm,
}) {
  const [expanded, setExpanded] = React.useState(false);
  const [eventSaved, setEventSaved] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleSaved = () => {
    setEventSaved(!eventSaved);
    if (eventSaved) {
      saveEvent();
    }
  };

  const saveEvent = () => {};

  const handleUpdate = () => {
    setEventForm((prevState) => ({
      ...prevState, // Spread the previous state to keep other properties
      Name: name, // Update only the name property
      EventDescription: description,
      Location: "Tshepo",
      StartDate: new Date(parseInt(start_date) * 1000),
      EndDate: new Date(parseInt(end_date) * 1000),
    }));

    setShowEventForm(true);
  };

  return (
    <>
      <Card sx={{ maxWidth: 345 }}>
        <CardHeader
          avatar={
            <Avatar className="bg-openbox-green" aria-label="recipe">
              O
            </Avatar>
          }
          action={
            <IconButton aria-label="settings">
              {eventSaved ? (
                <>
                  <BookmarkIcon
                    className="text-openbox-green"
                    onClick={handleSaved}
                  />
                </>
              ) : (
                <>
                  <BookmarkBorderIcon onClick={handleSaved} />
                </>
              )}
            </IconButton>
          }
          title={name}
          subheader={date}
        />

        <CardContent>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {description}
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </ExpandMore>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <div className="">
              <p className="text-sm text-gray-500">
                Location:{" "}
                <span className="font-medium text-gray-800">{location}</span>
              </p>
            </div>
          </CardContent>
        </Collapse>
      </Card>

      <Stack>
        <button
          onClick={handleUpdate}
          className="bg-white p-2 mt-2 mb-2 rounded text-black border transform transition-transform duration-200 hover:scale-105"
        >
          Create Event
        </button>

        <button
          onClick={handleMore}
          className="bg-white p-2 mb-2 rounded text-black border transform transition-transform duration-200 hover:scale-105"
        >
          Recommend More
        </button>
      </Stack>
    </>
  );
}
