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
import { green } from "@mui/material/colors";
import Button from "@mui/material/Button";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 300,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  outline: "none",
  borderRadius: 1,
};

function EventsHolder({
  communityID,
  createEvent,
  setShowEventForm,
  setEventForm,
}) {
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [eventIdToDelete, setEventIdToDelete] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all"); // State to hold filter status

  useEffect(() => {
    EventDB.getEventFromCommunityID(communityID, setAllEvents);
    setLoading(false);
  }, [communityID]);

  useEffect(() => {
    const updateEventsStatus = async () => {
      const currentDate = new Date();
      const updatedEvents = await Promise.all(
        allEvents.map(async (event) => {
          if (
            event.status === "active" && // Check if status is active
            event.RsvpEndTime && // Ensure RsvpEndTime exists
            event.RsvpEndTime.toDate() < currentDate && // Check if RSVP end time is in the past
            event.status !== "past" // Only update if status is not already 'past'
          ) {
            try {
              await EventDB.updateEventStatus(event.id, "past");
              return { ...event, status: "past" };
            } catch (error) {
              console.error(
                `Error updating event status for ${event.id}:`,
                error
              );
              return event; // Return original event if update fails
            }
          }
          return event; // Return unchanged event if conditions are not met
        })
      );

      // Set state only if there are updates
      if (JSON.stringify(updatedEvents) !== JSON.stringify(allEvents)) {
        setAllEvents(updatedEvents);
      }
    };

    // Call the update function initially and set interval for continuous update
    updateEventsStatus();
    const interval = setInterval(updateEventsStatus, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [allEvents]);

  const formatDate = (timestamp) => {
    if (!timestamp) return "No Date";
    const date = timestamp.toDate();
    return date.toLocaleDateString();
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "No Time";
    const time = timestamp.toDate();
    return time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleArchive = async (id) => {
    try {
      await EventDB.updateEventStatus(id, "archived");
      updateEventsStatus(); // Refresh status after update
    } catch (error) {
      console.error("Error archiving event:", error);
    }
  };

  const handleUnarchive = async (id) => {
    try {
      await EventDB.updateEventStatus(id, "active");
      updateEventsStatus(); // Refresh status after update
    } catch (error) {
      console.error("Error unarchiving event:", error);
    }
  };

  const handleDeleteConfirmation = (id) => {
    setEventIdToDelete(id);
    setOpenDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      await EventDB.deleteEvent(eventIdToDelete);
      setAllEvents(allEvents.filter((event) => event.id !== eventIdToDelete));
      setOpenDeleteModal(false);
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const handlePost = async (id) => {
    try {
      await EventDB.updateEventStatus(id, "active");
      updateEventsStatus(); // Refresh status after update
    } catch (error) {
      console.error("Error posting event:", error);
    }
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setEventIdToDelete(null);
  };

  const handleViewResults = (event) => {
    // Handle view results action here
    console.log(`View results for event ${event.id}`);
  };

  const updateEventsStatus = () => {
    // Dummy function to prevent direct state update inside useEffect
    return;
  };

  const handleFilterChange = (event) => {
    setFilterStatus(event.target.value);
  };

  const filteredUpcomingEvents = allEvents.filter((event) => {
    if (filterStatus === "all") {
      return event.status !== "past"; // Exclude past events
    }
    return event.status === filterStatus && event.status !== "past";
  });

  const pastEvents = allEvents.filter((event) => event.status === "past");

  return (
    <div className="mt-4">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h1 className="text-xxl">Upcoming Events</h1>

        {/* Filter Dropdown */}
        <FormControl variant="outlined" sx={{ minWidth: 120, mt: 1, mb: 1 }}>
          <Select
            value={filterStatus}
            onChange={handleFilterChange}
            displayEmpty
            inputProps={{ "aria-label": "Filter by status" }}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="draft">Draft</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="archived">Archived</MenuItem>
          </Select>
        </FormControl>
      </div>

      {/* Upcoming Events Cards */}
      <div style={{ overflowX: "auto", whiteSpace: "nowrap" }}>
        {loading ? (
          <center>Loading...</center>
        ) : filteredUpcomingEvents.length === 0 ? (
          <center>No upcoming events</center>
        ) : (
          <Grid container spacing={2}>
            {filteredUpcomingEvents.map((value) => (
              <Grid key={value.id} item>
                <Card sx={{ maxWidth: 345 }}>
                  <CardHeader
                    avatar={
                      <Avatar sx={{ bgcolor: green[500] }} aria-label="recipe">
                        O
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
                      <br />
                      <strong>RSVP by the:</strong>{" "}
                      {`${formatDate(value.RsvpEndTime)} - ${formatTime(
                        value.RsvpEndTime
                      )}`}
                    </Typography>
                  </CardContent>
                  <CardActions disableSpacing>
                    {value.status === "archived" ? (
                      <>
                        <Button onClick={() => handleUnarchive(value.id)}>
                          Unarchive
                        </Button>
                        <Button
                          color="error"
                          onClick={() => handleDeleteConfirmation(value.id)}
                        >
                          Delete
                        </Button>
                      </>
                    ) : value.status === "draft" ? (
                      <>
                        <Button
                          onClick={() => {
                            setShowEventForm(true);
                            setEventForm(value);
                          }}
                        >
                          Edit
                        </Button>
                        <Button onClick={() => handlePost(value.id)}>
                          Post
                        </Button>
                        <Button
                          color="error"
                          onClick={() => handleDeleteConfirmation(value.id)}
                        >
                          Delete
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          color="error"
                          onClick={() => handleArchive(value.id)}
                        >
                          Archive
                        </Button>
                        <Button
                          color="error"
                          onClick={() => handleDeleteConfirmation(value.id)}
                        >
                          Delete
                        </Button>
                      </>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </div>

      {/* Past Events (Polls) */}
      <div className="mt-4">
        <h1 className="text-xxl">Past Events</h1>
        <Grid container spacing={2}>
          {pastEvents.map((value) => (
            <Grid key={value.id} item>
              <Card sx={{ maxWidth: 345 }}>
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: green[500] }} aria-label="recipe">
                      O
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
                    <br />
                    <strong>RSVP by:</strong>{" "}
                    {`${formatDate(value.RsvpEndTime)} - ${formatTime(
                      value.RsvpEndTime
                    )}`}
                  </Typography>
                </CardContent>
                <CardActions disableSpacing>
                  <Button onClick={() => handleViewResults(value)}>
                    View Results
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        open={openDeleteModal}
        onClose={handleCloseDeleteModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Confirm Deletion of event
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Are you sure you want to permanently delete this event? Once you
            have deleted this event you will not be able to retrieve the event
            and its corresponding data.
          </Typography>
          <Box mt={4} display="flex" justifyContent="space-between">
            <Button variant="contained" color="error" onClick={handleDelete}>
              Yes
            </Button>
            <Button variant="contained" onClick={handleCloseDeleteModal}>
              No
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

export default EventsHolder;
