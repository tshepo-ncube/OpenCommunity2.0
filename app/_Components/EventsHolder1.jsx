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
} from "@mui/material";
import EventDB from "../../database/community/event";

const EventsHolder = ({
  communityID,
  createEvent,
  setShowEventForm,
  setEventForm,
  isMember, // Assume this prop indicates if the user is a community member
}) => {
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [eventIdToDelete, setEventIdToDelete] = useState(null);
  const [openJoinPopup, setOpenJoinPopup] = useState(false);

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
          let newStatus = event.status;

          // Check RSVP end time
          if (event.RsvpEndTime && event.RsvpEndTime.toDate() > currentDate) {
            if (event.status !== "rsvp") {
              newStatus = "rsvp";
            }
          } else if (event.EndDate && event.EndDate.toDate() < currentDate) {
            if (event.status !== "past") {
              newStatus = "past";
            }
          } else {
            // Current date is after RSVP end time but before end date
            if (
              event.RsvpEndTime &&
              event.RsvpEndTime.toDate() <= currentDate
            ) {
              if (event.status !== "active") {
                newStatus = "active";
              }
            }
          }

          // Update status if changed
          if (newStatus !== event.status) {
            try {
              await EventDB.updateEventStatus(event.id, newStatus);
              updatedEvent.status = newStatus;
            } catch (error) {
              console.error(
                `Error updating event status for ${event.id}:`,
                error
              );
            }
          }

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

  const handleCardClick = (event) => {
    if (["rsvp", "active"].includes(event.status)) {
      setOpenJoinPopup(true);
    }
  };

  const handleCloseJoinPopup = () => {
    setOpenJoinPopup(false);
  };

  const upcomingEvents = allEvents.filter((event) => event.status !== "past");
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
      </div>

      <div style={{ overflowX: "auto", whiteSpace: "nowrap" }}>
        {loading ? (
          <center>Loading...</center>
        ) : upcomingEvents.length === 0 ? (
          <center>No upcoming events</center>
        ) : (
          <Grid container spacing={2}>
            {upcomingEvents.map((value) => (
              <Grid key={value.id} item>
                <Card
                  sx={{ maxWidth: 345, position: "relative" }}
                  onClick={() => handleCardClick(value)}
                >
                  <CardHeader
                    title={value.Name}
                    subheader={`${formatDate(value.StartDate)} - ${formatDate(
                      value.EndDate
                    )}`}
                  />
                  <CardContent
                    sx={{
                      position: "relative",
                      filter: ["rsvp", "active"].includes(value.status)
                        ? "blur(4px)"
                        : "none", // Apply blur effect conditionally
                      transition: "filter 0.3s",
                    }}
                  >
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
                      <></>
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
              <Card
                sx={{ maxWidth: 345 }}
                onClick={() => handleCardClick(value)}
              >
                <CardHeader
                  title={value.Name}
                  subheader={`${formatDate(value.StartDate)} - ${formatDate(
                    value.EndDate
                  )}`}
                />
                <CardContent
                  sx={{
                    filter: ["rsvp", "active"].includes(value.status)
                      ? "blur(4px)"
                      : "none", // Apply blur effect conditionally
                    transition: "filter 0.3s",
                  }}
                >
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
                  <Button
                    color="primary"
                    onClick={() => handleViewResults(value)}
                    disabled={["rsvp", "active"].includes(value.status)} // Disable button conditionally
                  >
                    View rating & comments
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal open={openDeleteModal} onClose={handleCloseDeleteModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 300,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2">
            Are you sure you want to delete this event?
          </Typography>
          <Box sx={{ mt: 2, display: "flex", gap: "8px" }}>
            <Button variant="contained" color="primary" onClick={handleDelete}>
              Yes
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleCloseDeleteModal}
            >
              No
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Join Community Popup */}
      <Modal open={openJoinPopup} onClose={handleCloseJoinPopup}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 300,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2">
            Please join this community in order to have access the events and
            information offered
          </Typography>
          <Box sx={{ mt: 2, display: "flex", gap: "8px" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCloseJoinPopup}
            >
              Close
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default EventsHolder;
