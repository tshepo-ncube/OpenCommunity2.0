import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardHeader,
  CardContent,
  Typography,
  CardActions,
  Button,
  Modal,
  Box,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import { green, red, blue, yellow } from "@mui/material/colors"; // Added yellow for RSVP status
import MoreVertIcon from "@mui/icons-material/MoreVert";

import EventDB from "../../database/community/event";

const EventsHolder = ({
  communityID,
  createEvent,
  setShowEventForm,
  setEventForm,
}) => {
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [eventIdToDelete, setEventIdToDelete] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    EventDB.getEventFromCommunityID(communityID, setAllEvents);
    setLoading(false);
  }, [communityID]);
  useEffect(() => {
    const updateEventsStatus = async () => {
      const currentDate = new Date();
      const updatedEvents = await Promise.all(
        allEvents.map(async (event) => {
          let updatedEvent = { ...event };

          if (event.status === "active") {
            // Check if RSVP deadline has passed and status is not "past"
            if (
              event.RsvpEndTime &&
              event.RsvpEndTime.toDate() < currentDate &&
              event.status !== "past"
            ) {
              try {
                await EventDB.updateEventStatus(event.id, "rsvp");
                updatedEvent.status = "rsvp";
              } catch (error) {
                console.error(
                  `Error updating event status for ${event.id}:`,
                  error
                );
              }
            }

            // Check if end date has passed and status is not "past"
            if (
              event.EndDate &&
              event.EndDate.toDate() < currentDate &&
              event.status !== "past"
            ) {
              try {
                await EventDB.updateEventStatus(event.id, "past");
                updatedEvent.status = "past";
              } catch (error) {
                console.error(
                  `Error updating event status for ${event.id}:`,
                  error
                );
              }
            }
          }

          // Return updated event or original event if no changes
          return updatedEvent;
        })
      );

      if (JSON.stringify(updatedEvents) !== JSON.stringify(allEvents)) {
        setAllEvents(updatedEvents);
      }
    };

    updateEventsStatus();
    const interval = setInterval(updateEventsStatus, 60000);

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
      updateEventsStatus();
    } catch (error) {
      console.error("Error archiving event:", error);
    }
  };

  const handleUnarchive = async (id) => {
    try {
      await EventDB.updateEventStatus(id, "active");
      updateEventsStatus();
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
      updateEventsStatus();
    } catch (error) {
      console.error("Error posting event:", error);
    }
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setEventIdToDelete(null);
  };

  const handleViewResults = (event) => {
    console.log(`View results for event ${event.id}`);
  };

  const handleFilterChange = (event) => {
    setFilterStatus(event.target.value);
  };

  const filteredUpcomingEvents = allEvents.filter((event) => {
    if (filterStatus === "all") {
      return event.status !== "past";
    }
    return event.status === filterStatus && event.status !== "past";
  });

  const pastEvents = allEvents.filter((event) => event.status === "past");

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return green[500];
      case "archived":
        return red[500];
      case "draft":
        return blue[500];
      case "rsvp":
        return yellow[500]; // Added color for RSVP status
      default:
        return "#000";
    }
  };

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
                    title={value.Name}
                    subheader={`${formatDate(value.StartDate)} - ${formatDate(
                      value.EndDate
                    )}`}
                    action={
                      <Box sx={{ display: "flex", gap: "4px" }}>
                        <Box
                          sx={{
                            bgcolor: getStatusColor(value.status),
                            color: "#fff",
                            p: 0.5,
                            borderRadius: "4px",
                          }}
                        >
                          <Typography variant="caption">
                            {value.status}
                          </Typography>
                        </Box>
                      </Box>
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

      <div className="mt-4">
        <h1 className="text-xxl">Past Events</h1>
        <Grid container spacing={2}>
          {pastEvents.map((value) => (
            <Grid key={value.id} item>
              <Card sx={{ maxWidth: 345 }}>
                <CardHeader
                  title={value.Name}
                  subheader={`${formatDate(value.StartDate)} - ${formatDate(
                    value.EndDate
                  )}`}
                  action={
                    <Box sx={{ display: "flex", gap: "4px" }}>
                      <Box
                        sx={{
                          bgcolor: getStatusColor(value.status),
                          color: "#fff",
                          p: 0.5,
                          borderRadius: "4px",
                        }}
                      >
                        <Typography variant="caption">
                          {value.status}
                        </Typography>
                      </Box>
                    </Box>
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
                  <Button onClick={() => handleViewResults(value)}>
                    View Results
                  </Button>
                  <Button
                    color="error"
                    onClick={() => handleDeleteConfirmation(value.id)}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>

      {/* Modal for Delete Confirmation */}
      <Modal
        open={openDeleteModal}
        onClose={handleCloseDeleteModal}
        aria-labelledby="delete-event-modal-title"
        aria-describedby="delete-event-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography
            id="delete-event-modal-title"
            variant="h6"
            component="h2"
            gutterBottom
          >
            Confirm Delete Event
          </Typography>
          <Typography id="delete-event-modal-description" sx={{ mt: 2 }}>
            Are you sure you want to delete this event? by deleteing this event,
            all the data associated with the event will be permanently deleted.
          </Typography>
          <Button onClick={handleDelete} sx={{ mt: 2 }}>
            Delete
          </Button>
          <Button onClick={handleCloseDeleteModal} sx={{ mt: 2, ml: 2 }}>
            Cancel
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default EventsHolder;
