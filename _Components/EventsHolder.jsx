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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import * as XLSX from "xlsx";
import { IoMdClose } from "react-icons/io";
import AnalyticsDB from "../database/community/analytics";

import EventDB from "../database/community/event";

import { green, red, blue, yellow } from "@mui/material/colors";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import {
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Delete as DeleteIcon,
  PostAdd as PostAddIcon,
  Assessment as AssessmentIcon,
} from "@mui/icons-material";

const EventsHolder = ({
  communityID,
  handleCreateNewEvent,
  setShowEventForm,
  setEventForm,
  setShowEditForm,
}) => {
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [eventIdToDelete, setEventIdToDelete] = useState(null);
  const [openAnalyticsModal, setOpenAnalyticsModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [rsvpEmails, setRsvpEmails] = useState([]);
  const [analyticsData, setAnalyticsData] = useState([]);

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

          if (event.status === "draft") {
            return updatedEvent;
          }

          if (event.RsvpEndTime && event.RsvpEndTime.toDate() > currentDate) {
            if (event.status !== "rsvp") {
              newStatus = "rsvp";
            }
          } else if (event.EndDate && event.EndDate.toDate() < currentDate) {
            if (event.status !== "past") {
              newStatus = "past";
            }
          } else {
            if (
              event.RsvpEndTime &&
              event.RsvpEndTime.toDate() <= currentDate
            ) {
              if (event.status !== "active") {
                newStatus = "active";
              }
            }
          }

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

    console.log(allEvents);

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

  const handleViewAnalytics = async (event) => {
    setSelectedEvent(event);
    try {
      const rsvpData = await EventDB.getEventRsvpEmails(event.id);
      setRsvpEmails(rsvpData || []);
    } catch (error) {
      console.error("Error fetching RSVP data:", error);
      setRsvpEmails([]);
    }
    setOpenAnalyticsModal(true);
  };

  const handleCloseAnalyticsModal = () => {
    setOpenAnalyticsModal(false);
    setSelectedEvent(null);
    setRsvpEmails([]);
  };

  const handleExportRSVP = (event) => {
    exportToExcel("rsvp", event.Name);
  };

  const handleExportAnalytics = (event) => {
    exportToExcel("analytics", event.Name);
  };

  const exportToExcel = (context, eventName) => {
    const ws = XLSX.utils.json_to_sheet(
      analyticsData.map((data) => ({
        Email: data.Email,
        Name: data.Name,
        Surname: data.Surname,
        Telephone: data.Telephone,
        Allergy: data.Allergies,
        Diet: data.Diet,
      }))
    );

    let sheetTitle;
    let fileName;

    if (context === "rsvp") {
      sheetTitle = `RSVP_List_${eventName}`.substring(0, 31);
      fileName = `RSVP_List_${eventName.replace(/\s+/g, "_")}.xlsx`;
    } else if (context === "analytics") {
      sheetTitle = `Analytics_${eventName}`.substring(0, 31);
      fileName = `Analytics_${eventName.replace(/\s+/g, "_")}.xlsx`;
    }

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetTitle);
    XLSX.writeFile(wb, fileName);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return green[500];
      case "archived":
        return red[500];
      case "draft":
        return blue[500];
      case "rsvp":
        return yellow[500];
      default:
        return "#000";
    }
  };

  const upcomingEvents = allEvents.filter((event) => event.status !== "past");

  console.log("Upcoming Events : ", upcomingEvents);
  const pastEvents = allEvents.filter((event) => event.status === "past");

  const getEventById = (id) => {
    return allEvents.find((event) => event.id === id);
  };

  const convertTimestamp = (timestamp) => {
    // Convert seconds to milliseconds
    const date = new Date(timestamp.seconds * 1000);

    // Extract date components
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(date.getDate()).padStart(2, "0");

    // Extract time components
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    // Format the output
    const date_string = `${year}-${month}-${day}`;
    const time_string = `${hours}:${minutes}`;

    return { date_string, time_string };
  };
  const handleEdit = (id) => {
    console.log("Handle Edit Object : ", getEventById(id));
    var eventObject = getEventById(id);

    setEventForm((prevState) => ({
      ...prevState,
      Name: eventObject.Name,
      startDate: convertTimestamp(eventObject.StartDate).date_string,
      startTime: convertTimestamp(eventObject.StartDate).time_string,
      endDate: convertTimestamp(eventObject.EndDate).date_string,
      EventID: id,
      endTime: convertTimestamp(eventObject.EndDate).time_string,
      //location: eventObject.Location,
      Location: eventObject.Location,
      EventDescription: eventObject.EventDescription,
      rsvpEndDateTime: `${
        convertTimestamp(eventObject.RsvpEndTime).date_string
      }T${convertTimestamp(eventObject.RsvpEndTime).time_string}`,
    }));

    setShowEditForm(true);

    console.log("Editing this event: ", eventObject);
    console.log("TimeStamp: ", eventObject.StartDate);
    console.log("time stamp: ", convertTimestamp(eventObject.StartDate));
  };

  return (
    <div className="mt-4">
      <h1 className="text-xxl relative mt-12 mb-9  text-black p-2">
        Upcoming Events
        <IconButton
          className="bg-grey"
          sx={{
            borderRadius: "50%",
            backgroundColor: "#bcd717",
            color: "white",
            marginLeft: 2,
            "&:hover": {
              backgroundColor: "#9aaf2e",
            },
          }}
          onClick={handleCreateNewEvent}
          aria-label="create event"
        >
          <AddIcon />
        </IconButton>
      </h1>

      <div style={{ overflowX: "auto", whiteSpace: "nowrap" }}>
        {loading ? (
          <center>Loading...</center>
        ) : upcomingEvents.length === 0 ? (
          <center>No upcoming events</center>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "15px",
            }}
          >
            {upcomingEvents.map((value) => (
              <Card
                key={value.id}
                sx={{
                  maxWidth: 345,
                  position: "relative",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)", // Dark shadow added here
                  margin: "16px 0",
                }}
              >
                {/* Header section with icons */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    padding: 1,
                    borderBottom: "1px solid #ccc",
                    bgcolor: "#f5f5f5",
                    width: "100%",
                    justifyContent: "space-between",
                  }}
                >
                  {/* Color block for non-past events */}
                  {value.status !== "past" && (
                    <Box
                      sx={{
                        bgcolor: getStatusColor(value.status),
                        color: "#fff",
                        p: 1,
                        width: 70,
                        height: 40,
                        display: "flex",
                        alignItems: "right",
                        justifyContent: "center",
                        borderRadius: "4px",
                        typography: "caption",
                        fontSize: "0.75rem",
                        marginTop: "0px", // Adjust this value as needed
                      }}
                    >
                      <Typography variant="caption">{value.status}</Typography>
                    </Box>
                  )}

                  {/* Centered event name */}
                  <Box
                    sx={{
                      flex: 1,
                      textAlign: "center",
                    }}
                  >
                    <Typography variant="h6" component="div">
                      {value.Name}
                    </Typography>
                  </Box>
                  {/* Icons for actions */}
                  <Box sx={{ display: "flex", gap: 1 }}>
                    {value.status !== "past" && (
                      <IconButton
                        size="small"
                        onClick={() => handleViewAnalytics(value)}
                        title="View Analytics"
                      >
                        <AssessmentIcon />
                      </IconButton>
                    )}
                    {value.status !== "draft" && (
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteConfirmation(value.id)}
                        title="Delete"
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Box>
                </Box>

                <CardContent sx={{ mt: 0 }}>
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

                <CardActions>
                  <Button size="small" onClick={() => handleEdit(value.id)}>
                    Edit
                  </Button>
                  {value.status === "draft" && (
                    <>
                      <Button size="small" onClick={() => handlePost(value.id)}>
                        Post
                      </Button>
                    </>
                  )}

                  {(value.status === "rsvp" || value.status === "active") && (
                    <></>
                  )}

                  {value.status === "past" && (
                    <Button
                      size="small"
                      onClick={() => handleViewAnalytics(value)}
                      title="View Analytics"
                    >
                      <AssessmentIcon />
                    </Button>
                  )}
                </CardActions>
              </Card>
            ))}
          </div>
        )}
      </div>

      <h1 className="text-xxl relative mt-12 mb-9  text-black p-2">
        Past Events
      </h1>

      <div style={{ overflowX: "auto", whiteSpace: "nowrap" }}>
        {loading ? (
          <center>Loading...</center>
        ) : pastEvents.length === 0 ? (
          <center>No past events</center>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "15px",
            }}
          >
            {pastEvents.map((value) => (
              <Card
                key={value.id}
                sx={{
                  maxWidth: 345,
                  position: "relative",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)", // Dark shadow added here
                  margin: "16px 0",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    padding: 1,
                    borderBottom: "1px solid #ccc",
                    bgcolor: "#f5f5f5", // Different color for past events
                    width: "100%",
                    justifyContent: "space-between",
                  }}
                >
                  {/* No color block for past events */}

                  {/* Centered event name */}
                  <Box
                    sx={{
                      flex: 1,
                      textAlign: "center",
                    }}
                  >
                    <Typography variant="h6" component="div">
                      {value.Name}
                    </Typography>
                  </Box>

                  {/* Icons for actions */}
                  <Box sx={{ display: "flex", gap: 1 }}>
                    {value.status === "past" && (
                      <IconButton
                        size="small"
                        onClick={() => handleViewAnalytics(value)}
                        title="View Analytics"
                      >
                        <AssessmentIcon />
                      </IconButton>
                    )}
                  </Box>
                </Box>

                <CardContent sx={{ mt: 0 }}>
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
                    <strong>Description:</strong> {value.Description}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Modal
        open={openDeleteModal}
        onClose={handleCloseDeleteModal}
        aria-labelledby="delete-confirmation-title"
        aria-describedby="delete-confirmation-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography
            id="delete-confirmation-title"
            variant="h6"
            component="h2"
          >
            <DeleteIcon />
          </Typography>
          <Typography id="delete-confirmation-description" sx={{ mt: 2 }}>
            Are you sure you want to delete this event?
          </Typography>
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 2 }}
          >
            <Button onClick={handleCloseDeleteModal}>Cancel</Button>
            <Button variant="contained" color="error" onClick={handleDelete}>
              Delete
            </Button>
          </Box>
        </Box>
      </Modal>

      <Modal
        open={openAnalyticsModal}
        onClose={handleCloseAnalyticsModal}
        aria-labelledby="analytics-modal-title"
        aria-describedby="analytics-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 700,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="analytics-modal-title" variant="h6" component="h2">
            {selectedEvent?.status === "rsvp"
              ? `RSVP List for ${selectedEvent?.Name}`
              : selectedEvent?.status === "past"
              ? `Analytics for ${selectedEvent?.Name}`
              : `Event Details for ${selectedEvent?.Name}`}
          </Typography>
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 2 }}
          >
            {selectedEvent?.status === "rsvp" && (
              <Button
                size="small"
                onClick={() => handleExportRSVP(selectedEvent)}
              >
                Export RSVP to Excel
              </Button>
            )}
            {selectedEvent?.status === "past" && (
              <Button
                size="small"
                onClick={() => handleExportAnalytics(selectedEvent)}
              >
                Export Analytics to Excel
              </Button>
            )}
          </Box>
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Email</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Surname</TableCell>
                  <TableCell>Telephone</TableCell>
                  <TableCell>Allergy</TableCell>
                  <TableCell>Diet</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {analyticsData.map((data, index) => (
                  <TableRow key={index}>
                    <TableCell>{data.Email}</TableCell>
                    <TableCell>{data.Name}</TableCell>
                    <TableCell>{data.Surname}</TableCell>
                    <TableCell>{data.Telephone}</TableCell>
                    <TableCell>{data.Allergies}</TableCell>
                    <TableCell>{data.Diet}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Modal>
    </div>
  );
};

export default EventsHolder;
