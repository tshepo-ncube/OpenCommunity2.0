import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
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
  IconButton,
} from "@mui/material";
import * as XLSX from "xlsx";
import { IoMdClose } from "react-icons/io";
import AnalyticsDB from "../database/community/analytics";
import EventDB from "../database/community/event";
import { green, red, blue, yellow } from "@mui/material/colors";
import AddIcon from "@mui/icons-material/Add";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Assessment as AssessmentIcon,
  LocationOn,
  Event,
  AccessTime,
  Description as DescriptionIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  InsertChartOutlined
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
  const [isCollapsed, setIsCollapsed] = useState(false);

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

  const handleEdit = (id) => {
    const eventObject = getEventById(id);
    setEventForm((prevState) => ({
      ...prevState,
      Name: eventObject.Name,
      startDate: convertTimestamp(eventObject.StartDate).date_string,
      startTime: convertTimestamp(eventObject.StartDate).time_string,
      endDate: convertTimestamp(eventObject.EndDate).date_string,
      EventID: id,
      endTime: convertTimestamp(eventObject.EndDate).time_string,
      Location: eventObject.Location,
      EventDescription: eventObject.EventDescription,
      rsvpEndDateTime: `${convertTimestamp(eventObject.RsvpEndTime).date_string}T${convertTimestamp(eventObject.RsvpEndTime).time_string}`,
    }));
    setShowEditForm(true);
  };

  const getEventById = (id) => {
    return allEvents.find((event) => event.id === id);
  };

  const convertTimestamp = (timestamp) => {
    const date = new Date(timestamp.seconds * 1000);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return { date_string: `${year}-${month}-${day}`, time_string: `${hours}:${minutes}` };
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
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
  const pastEvents = allEvents.filter((event) => event.status === "past");

  return (
    <div style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "20px", backgroundColor: "#fff", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", marginTop: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1 className="text-xxl relative mb-2 text-black p-2">
          Upcoming Events
          <IconButton
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
        <IconButton onClick={toggleCollapse} aria-label="collapse">
          {isCollapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
        </IconButton>
      </div>
      <hr />

      {!isCollapsed && (
        <>
          <h2 className="text-xl relative my-4 text-black p-2">Upcoming Events</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "15px" }}>
            {loading ? (
              <center>Loading...</center>
            ) : upcomingEvents.length === 0 ? (
              <center>No upcoming events</center>
            ) : (
              upcomingEvents.map((value) => (
                <Card
                  key={value.id}
                  onClick = { (()=> {console.log("VALAUUE :", value) }) }
                  sx={{
                    maxWidth: 400,
                    backgroundColor: "white",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    borderRadius: "8px",
                    overflow: "hidden",
                    margin: "16px 0",
                  }}
                >
                  <div className="relative">
                    <img
                      src= {value.EventImages ? value.EventImages  : "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"  }
                      alt={value.Name}
                      className="w-full h-48 object-cover"
                    />
                    {value.status !== "past" && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: 10,
                          left: 10,
                          backgroundColor: getStatusColor(value.status),
                          color: "#fff",
                          padding: "4px 8px",
                          borderRadius: "4px",
                        }}
                      >
                        {value.status.toUpperCase()}
                      </Box>
                    )}
                  </div>

                  <CardContent>
                    <Typography variant="h6" className="text-left mb-2 font-semibold">
                      {value.Name}
                    </Typography>
                    <div className="mb-2">
                      <DescriptionIcon className="text-gray-600 mr-2" />
                      <span className="text-gray-800 text-sm">{value.EventDescription}</span>
                    </div>
                    <div className="flex items-center mb-1">
                      <LocationOn className="text-gray-600 mr-2" />
                      <span className="text-gray-800 text-sm">{value.Location}</span>
                    </div>
                    <div className="flex items-center mb-1">
                      <Event className="text-gray-600 mr-2" />
                      <span className="text-gray-800 text-sm">
                        {formatDate(value.StartDate)} - {formatDate(value.EndDate)}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <AccessTime className="text-gray-600 mr-2" />
                      <span className="text-gray-800 text-sm">
                        {formatTime(value.StartDate)} - {formatTime(value.EndDate)}
                      </span>
                    </div>
                  </CardContent>

                  <Box sx={{ padding: 2, display: "flex", justifyContent: "space-between" }}>
                    <Button
                      variant="contained"
                      sx={{ backgroundColor: "#a8bf22", "&:hover": { backgroundColor: "#bcd727" } }}
                      onClick={() => handleViewAnalytics(value)}
                    >
                      <InsertChartOutlined/>
                       Analytics
                    </Button>
                    <Button
                      variant="contained"
                      sx={{ backgroundColor: "#999999", "&:hover": { backgroundColor: "#d4cfcf" } }}
                      onClick={() => handleEdit(value.id)}
                    >
                      <EditIcon/>
                       Edit
                    </Button>

                    <Button
                      variant="contained"
                      sx={{ backgroundColor: "#c94040", "&:hover": { backgroundColor: "#b81a1a" } }}
                      onClick={() => handleDeleteConfirmation(value.id)}
                    >
                      <DeleteIcon/>
                       Delete
                    </Button>
                  </Box>
                </Card>
              ))
            )}
          </div>

          <h2 className="text-xl relative my-4 text-black p-2">Past Events</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "15px" }}>
            {loading ? (
              <center>Loading...</center>
            ) : pastEvents.length === 0 ? (
              <center>No past events</center>
            ) : (
              pastEvents.map((value) => (
                <Card
                  key={value.id}
                  onClick = { (()=> {console.log("VALAUUE :", value) }) }
                  sx={{
                    maxWidth: 400,
                    backgroundColor: "white",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    borderRadius: "8px",
                    overflow: "hidden",
                    margin: "16px 0",
                  }}
                >
                  <div className="relative">
                    <img
                      src= {value.EventImages ? value.EventImages  : "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"  }
                      alt={value.Name}
                      className="w-full h-48 object-cover"
                    />
                    {value.status !== "past" && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: 10,
                          left: 10,
                          backgroundColor: getStatusColor(value.status),
                          color: "#fff",
                          padding: "4px 8px",
                          borderRadius: "4px",
                        }}
                      >
                        {value.status.toUpperCase()}
                      </Box>
                    )}
                  </div>

                  <CardContent>
                    <Typography variant="h6" className="text-left mb-2 font-semibold">
                      {value.Name}
                    </Typography>
                    <div className="mb-2">
                      <DescriptionIcon className="text-gray-600 mr-2" />
                      <span className="text-gray-800 text-sm">{value.EventDescription}</span>
                    </div>
                    <div className="flex items-center mb-1">
                      <LocationOn className="text-gray-600 mr-2" />
                      <span className="text-gray-800 text-sm">{value.Location}</span>
                    </div>
                    <div className="flex items-center mb-1">
                      <Event className="text-gray-600 mr-2" />
                      <span className="text-gray-800 text-sm">
                        {formatDate(value.StartDate)} - {formatDate(value.EndDate)}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <AccessTime className="text-gray-600 mr-2" />
                      <span className="text-gray-800 text-sm">
                        {formatTime(value.StartDate)} - {formatTime(value.EndDate)}
                      </span>
                    </div>
                  </CardContent>

                  <Box sx={{ padding: 2, display: "flex", justifyContent: "center" }}>
                    <Button
                      variant="contained"
                      sx={{ backgroundColor: "#a8bf22", "&:hover": { backgroundColor: "#bcd727" } }}
                      onClick={() => handleViewAnalytics(value)}
                    >
                      <InsertChartOutlined/>
                       Analytics
                    </Button>
                  </Box>
                </Card>
              ))
            )}
          </div>
        </>
      )}

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
            borderRadius: "16px",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="delete-confirmation-title" variant="h6" component="h2">
          </Typography>
          <Typography id="delete-confirmation-description" sx={{ mt: 2 }}>
            Are you sure you want to delete this event?
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 2 }}>
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
      borderRadius: "16px", // Adjust the value to control the roundness
      p: 4,
    }}
  >
    <IconButton
      onClick={handleCloseAnalyticsModal}
      sx={{ 
        position: 'absolute', 
        top: 8, 
        right: 8 
      }}
      aria-label="close"
    >
      <IoMdClose size={24} />
    </IconButton>

    <Typography id="analytics-modal-title" variant="h6" component="h2">
      {selectedEvent?.status === "rsvp"
        ? `RSVP List for ${selectedEvent?.Name}`
        : selectedEvent?.status === "past"
        ? `Analytics for ${selectedEvent?.Name}`
        : `Event Details for ${selectedEvent?.Name}`}
    </Typography>
    
    <Box sx={{ display: "flex", justifyContent: "flex-start", gap: 1, mt: 2 }}>
      {selectedEvent?.status === "rsvp" && (
        <Button size="small" onClick={() => handleExportRSVP(selectedEvent)}>
          Export RSVP to Excel
        </Button>
      )}
      {selectedEvent?.status === "past" && (
        <Button size="small" onClick={() => handleExportAnalytics(selectedEvent)}>
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
