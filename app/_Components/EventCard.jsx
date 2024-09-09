import * as React from "react";
import Box from "@mui/material/Box";
// import Card from "@mui/material/Card";
// import CardActions from "@mui/material/CardActions";
// import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
// import Typography from "@mui/material/Typography";

import { styled } from "@mui/material/styles";
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
import ShareIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const bull = (
  <Box
    component="span"
    sx={{ display: "inline-block", mx: "2px", transform: "scale(0.8)" }}
  >
    •
  </Box>
);

// const card = (
//   <React.Fragment>
//     <CardContent>
//       <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
//         Word of the Day
//       </Typography>
//       <Typography variant="h5" component="div">
//         be{bull}nev{bull}o{bull}lent
//       </Typography>
//       <Typography sx={{ mb: 1.5 }} color="text.secondary">
//         adjective
//       </Typography>
//       <Typography variant="body2">
//         well meaning and kindly.
//         <br />
//         {'"a benevolent smile"'}
//       </Typography>
//     </CardContent>
//     <CardActions>
//       <Button size="small">Learn More</Button>
//     </CardActions>
//   </React.Fragment>
// );

export default function EventCard({ event }) {
  return (
    // <Box sx={{}} className="rounded border">
    //   <React.Fragment>
    //     <CardContent>
    //       <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
    //         Event
    //       </Typography>
    //       <Typography variant="h5" component="div">
    //         {event.Name}
    //       </Typography>
    //       <Typography sx={{ mb: 1.5 }} color="text.secondary">
    //         14 Feb 2024 - 17 Feb 2024
    //       </Typography>
    //       <Typography variant="body2">{event.EventDescription}</Typography>
    //     </CardContent>
    //     <CardActions>
    //       <Button size="small">View</Button>
    //     </CardActions>
    //   </React.Fragment>
    // </Box>

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
        title={event.Name}
        subheader="Sep 14, 2016 - Sep 16, 2016"
      />
      <CardContent>
        <Typography
          variant="body2"
          color="text.secondary"
          style={{ whiteSpace: "pre-wrap" }}
        >
          {event.EventDescription}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <Button> edit</Button>
        <Button color="error">delete</Button>
      </CardActions>
    </Card>
  );
}
