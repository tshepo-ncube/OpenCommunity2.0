import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Box,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
 InsertChartOutlinedIcon
} from "@mui/material";
import * as XLSX from "xlsx";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Assessment as AssessmentIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  LocationOn,
  Event,
  AccessTime,
  Description as DescriptionIcon,
  AnalyticsOutlined,
} from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import EventDB from "../database/community/event";

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

  const handleViewAnalytics = (event) => {
    setSelectedEvent(event);
    setOpenAnalyticsModal(true);
  };

  const handleCloseAnalyticsModal = () => {
    setOpenAnalyticsModal(false);
    setSelectedEvent(null);
  };

  const handleEdit = (eventId) => {
    console.log("Edit event with ID:", eventId);
  };

  const handleDelete = (eventId) => {
    setEventIdToDelete(eventId);
    setOpenDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    console.log("Delete confirmed for event ID:", eventIdToDelete);
    setOpenDeleteModal(false);
    setEventIdToDelete(null);
    // Logic to delete the event goes here
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setEventIdToDelete(null);
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

    const fileName = `Analytics_${eventName.replace(/\s+/g, "_")}.xlsx`;
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `Analytics_${eventName}`.substring(0, 31));
    XLSX.writeFile(wb, fileName);
  };

  const upcomingEvents = allEvents.filter((event) => event.status !== "past");
  const pastEvents = allEvents.filter((event) => event.status === "past");

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "rsvp open":
        return "#FFD700"; // Gold color for RSVP open
      case "rsvp closed":
        return "#FF4500"; // Red color for RSVP closed
      case "active":
        return "#4CAF50"; // Green color for active events
      case "draft":
        return "#1E90FF"; // Blue for draft
      default:
        return "#808080"; // Grey for other statuses
    }
  };

  return (
    <div
      style={{
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "20px",
        marginTop: "20px",
        backgroundColor: "#fff",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1 className="text-xxl relative mb-2 text-black">Events</h1>
        <IconButton onClick={toggleCollapse} aria-label="collapse">
          {isCollapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
        </IconButton>
      </div>
      <hr />

      {!isCollapsed && (
        <>
          <h2 className="text-xl font-bold relative my-4 text-black p-2">
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
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "15px" }}>
            {loading ? (
              <center>Loading...</center>
            ) : upcomingEvents.length === 0 ? (
              <center>No upcoming events</center>
            ) : (
              upcomingEvents.map((event) => (
                <Card
                  key={event.id}
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
                      src="https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      alt={event.Name}
                      className="w-full h-48 object-cover"
                    />
                    {event.status !== "past" && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: 10,
                          left: 10,
                          backgroundColor: getStatusColor(event.status),
                          color: "#fff",
                          padding: "4px 8px",
                          borderRadius: "4px",
                        }}
                      >
                        {event.status.toUpperCase()}
                      </Box>
                    )}
                  </div>

                  <CardContent>
                    <Typography variant="h6" className="text-left mb-2 font-semibold">
                      {event.Name}
                    </Typography>
                    <div className="mb-2">
                      <DescriptionIcon className="text-gray-600 mr-2" />
                      <span className="text-gray-800 text-sm">
                        {event.EventDescription}
                      </span>
                    </div>
                    <div className="flex items-center mb-1">
                      <LocationOn className="text-gray-600 mr-2" />
                      <span className="text-gray-800 text-sm">
                        {event.Location}
                      </span>
                    </div>
                    <div className="flex items-center mb-1">
                      <Event className="text-gray-600 mr-2" />
                      <span className="text-gray-800 text-sm">
                        {formatDate(event.StartDate)} {formatTime(event.StartDate)}  - {formatDate(event.EndDate)} {formatTime(event.EndDate)}
                      </span>
                    </div>
                    {/* NEED TO CHANGE THIS TO RSVP end time */}
                    <div className="flex items-center">
                      <AccessTime className="text-gray-600 mr-2" />
                      <span className="text-gray-800 text-sm">
                        {formatTime(event.StartDate)} - {formatTime(event.EndDate)}
                      </span>
                    </div>
                  </CardContent>

                  <Box sx={{ padding: 2, display: "flex", justifyContent: "space-between", gap: 1 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ backgroundColor: "#a8bf22", "&:hover": { backgroundColor: "#bcd727" } }}
                      onClick={() => handleViewAnalytics(event)}
                    >
                      <AnalyticsOutlined/>
                       Analytics
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ backgroundColor: "#999999", "&:hover": { backgroundColor: "#d4cfcf" } }}
                      onClick={() => handleEdit(event.id)}
                    >
                      <EditIcon/>
                       Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ backgroundColor: "#999999", "&:hover": { backgroundColor: "#d4cfcf" } }}
                      onClick={() => handleDelete(event.id)} 
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
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "15px" }}>
            {loading ? (
              <center>Loading...</center>
            ) : pastEvents.length === 0 ? (
              <center>No past events</center>
            ) : (
              pastEvents.map((event) => (
                <Card
                  key={event.id}
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
                      src="https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      alt={event.Name}
                      className="w-full h-48 object-cover"
                    />
                  </div>

                  <CardContent>
                    <Typography variant="h6" className="text-left mb-2 font-semibold">
                      {event.Name}
                    </Typography>
                    <div className="mb-2">
                      <DescriptionIcon className="text-gray-600 mr-2" />
                      <span className="text-gray-800 text-sm">
                        {event.EventDescription}
                      </span>
                    </div>
                    <div className="flex items-center mb-1">
                      <LocationOn className="text-gray-600 mr-2" />
                      <span className="text-gray-800 text-sm">
                        {event.Location}
                      </span>
                    </div>
                    <div className="flex items-center mb-1">
                      <Event className="text-gray-600 mr-2" />
                      <span className="text-gray-800 text-sm">
                        {formatDate(event.StartDate)} - {formatDate(event.EndDate)}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <AccessTime className="text-gray-600 mr-2" />
                      <span className="text-gray-800 text-sm">
                        {formatTime(event.StartDate)} - {formatTime(event.EndDate)}
                      </span>
                    </div>
                  </CardContent>

                  <Box sx={{ padding: 2, display: "flex", justifyContent: "center" }}>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ backgroundColor: "#a8bf22", "&:hover": { backgroundColor: "#bcd727" } }}
                      onClick={() => handleViewAnalytics(event)}
                    >
                      View Analytics
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
            <Button
              variant="contained"
              color="error"
              onClick={handleConfirmDelete}
            >
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
            Analytics for {selectedEvent?.Name}
          </Typography>
          <Button
            size="small"
            onClick={() =>
              exportToExcel("analytics", selectedEvent?.Name)
            }
          >
            Export Analytics to Excel
          </Button>
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
