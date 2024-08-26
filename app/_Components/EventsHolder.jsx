// import React, { useEffect, useState } from "react";
// import {
//   Grid,
//   Card,
//   CardHeader,
//   CardContent,
//   Typography,
//   CardActions,
//   Button,
//   Modal,
//   Box,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
// } from "@mui/material";
// import * as XLSX from "xlsx";
// import AnalyticsDB from "../../database/community/analytics";
// import EventDB from "../../database/community/event";
// import { green, red, blue, yellow } from "@mui/material/colors";

// import AddIcon from "@mui/icons-material/Add";
// import IconButton from "@mui/material/IconButton";
// const EventsHolder = ({
//   communityID,
//   createEvent,
//   setShowEventForm,
//   setEventForm,
// }) => {
//   const [allEvents, setAllEvents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [openDeleteModal, setOpenDeleteModal] = useState(false);
//   const [eventIdToDelete, setEventIdToDelete] = useState(null);
//   const [openAnalyticsModal, setOpenAnalyticsModal] = useState(false);
//   const [selectedEvent, setSelectedEvent] = useState(null);
//   const [rsvpEmails, setRsvpEmails] = useState([]);
//   const [analyticsData, setAnalyticsData] = useState([]);

//   useEffect(() => {
//     AnalyticsDB.getUsersDetailsByEmails(rsvpEmails).then((userDetailsList) => {
//       setAnalyticsData(userDetailsList);
//     });
//   }, [rsvpEmails]);

//   useEffect(() => {
//     EventDB.getEventFromCommunityID(communityID, setAllEvents);
//     setLoading(false);
//   }, [communityID]);

//   useEffect(() => {
//     const updateEventsStatus = async () => {
//       const currentDate = new Date();
//       const updatedEvents = await Promise.all(
//         allEvents.map(async (event) => {
//           let updatedEvent = { ...event };
//           let newStatus = event.status;

//           // Check RSVP end time
//           if (event.RsvpEndTime && event.RsvpEndTime.toDate() > currentDate) {
//             if (event.status !== "rsvp") {
//               newStatus = "rsvp";
//             }
//           } else if (event.EndDate && event.EndDate.toDate() < currentDate) {
//             if (event.status !== "past") {
//               newStatus = "past";
//             }
//           } else {
//             // Current date is after RSVP end time but before end date
//             if (
//               event.RsvpEndTime &&
//               event.RsvpEndTime.toDate() <= currentDate
//             ) {
//               if (event.status !== "active") {
//                 newStatus = "active";
//               }
//             }
//           }

//           // Update status if changed
//           if (newStatus !== event.status) {
//             try {
//               await EventDB.updateEventStatus(event.id, newStatus);
//               updatedEvent.status = newStatus;
//             } catch (error) {
//               console.error(
//                 `Error updating event status for ${event.id}:`,
//                 error
//               );
//             }
//           }

//           return updatedEvent;
//         })
//       );

//       if (JSON.stringify(updatedEvents) !== JSON.stringify(allEvents)) {
//         setAllEvents(updatedEvents);
//       }
//     };

//     updateEventsStatus();
//     const interval = setInterval(updateEventsStatus, 60000);

//     return () => clearInterval(interval);
//   }, [allEvents]);

//   const formatDate = (timestamp) => {
//     if (!timestamp) return "No Date";
//     const date = timestamp.toDate();
//     return date.toLocaleDateString();
//   };

//   const formatTime = (timestamp) => {
//     if (!timestamp) return "No Time";
//     const time = timestamp.toDate();
//     return time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
//   };

//   const handleArchive = async (id) => {
//     try {
//       await EventDB.updateEventStatus(id, "archived");
//       updateEventsStatus();
//     } catch (error) {
//       console.error("Error archiving event:", error);
//     }
//   };

//   const handleUnarchive = async (id) => {
//     try {
//       await EventDB.updateEventStatus(id, "active");
//       updateEventsStatus();
//     } catch (error) {
//       console.error("Error unarchiving event:", error);
//     }
//   };

//   const handleDeleteConfirmation = (id) => {
//     setEventIdToDelete(id);
//     setOpenDeleteModal(true);
//   };

//   const handleDelete = async () => {
//     try {
//       await EventDB.deleteEvent(eventIdToDelete);
//       setAllEvents(allEvents.filter((event) => event.id !== eventIdToDelete));
//       setOpenDeleteModal(false);
//     } catch (error) {
//       console.error("Error deleting event:", error);
//     }
//   };

//   const handlePost = async (id) => {
//     try {
//       await EventDB.updateEventStatus(id, "active");
//       updateEventsStatus();
//     } catch (error) {
//       console.error("Error posting event:", error);
//     }
//   };

//   const handleCloseDeleteModal = () => {
//     setOpenDeleteModal(false);
//     setEventIdToDelete(null);
//   };

//   const handleViewAnalytics = async (event) => {
//     setSelectedEvent(event);
//     try {
//       // Fetch RSVP emails
//       const rsvpData = await EventDB.getEventRsvpEmails(event.id);
//       setRsvpEmails(rsvpData || []);
//     } catch (error) {
//       console.error("Error fetching RSVP data:", error);
//       setRsvpEmails([]);
//     }
//     setOpenAnalyticsModal(true);
//   };

//   const handleCloseAnalyticsModal = () => {
//     setOpenAnalyticsModal(false);
//     setSelectedEvent(null);
//     setRsvpEmails([]);
//   };

//   const exportToExcel = () => {
//     const ws = XLSX.utils.json_to_sheet(
//       analyticsData.map((data) => ({
//         Email: data.Email,
//         Name: data.Name,
//         Surname: data.Surname,
//         Telephone: data.Telephone,
//         Allergy: data.Allergies,
//         Diet: data.Diet,
//       }))
//     );

//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Analytics Data");

//     XLSX.writeFile(wb, "AnalyticsData.xlsx");
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "active":
//         return green[500];
//       case "archived":
//         return red[500];
//       case "draft":
//         return blue[500];
//       case "rsvp":
//         return yellow[500];
//       default:
//         return "#000";
//     }
//   };

//   const upcomingEvents = allEvents.filter((event) => event.status !== "past");
//   const pastEvents = allEvents.filter((event) => event.status === "past");

//   return (
//     <div className="mt-4">
//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//         }}
//       >
//         {/* <h1 className="text-xxl">Upcoming Events</h1> */}
//       </div>

//       <h1 className="text-xxl relative my-4">
//         Upcoming Events
//         <IconButton
//           className="bg-openbox-green text-openbox-green"
//           sx={{
//             borderRadius: "50%",
//             backgroundColor: "#bcd727",
//             color: "white",
//             marginLeft: 2,
//             "&:hover": {
//               backgroundColor: "#819417",
//             },
//           }}
//           // onClick={handleCreatePoll}
//           aria-label="create poll"
//         >
//           <AddIcon />
//         </IconButton>
//       </h1>

//       <div style={{ overflowX: "auto", whiteSpace: "nowrap" }}>
//         {loading ? (
//           <center>Loading...</center>
//         ) : upcomingEvents.length === 0 ? (
//           <center>No upcoming events</center>
//         ) : (
//           <Grid container spacing={2}>
//             {upcomingEvents.map((value) => (
//               <Grid key={value.id} item>
//                 <Card sx={{ maxWidth: 345 }}>
//                   <CardHeader
//                     title={value.Name}
//                     subheader={`${formatDate(value.StartDate)} - ${formatDate(
//                       value.EndDate
//                     )}`}
//                     action={
//                       <Box sx={{ display: "flex", gap: "4px" }}>
//                         <Box
//                           sx={{
//                             bgcolor: getStatusColor(value.status),
//                             color: "#fff",
//                             p: 0.5,
//                             borderRadius: "4px",
//                           }}
//                         >
//                           <Typography variant="caption">
//                             {value.status}
//                           </Typography>
//                         </Box>
//                       </Box>
//                     }
//                   />
//                   <CardContent>
//                     <Typography
//                       variant="body2"
//                       color="text.secondary"
//                       style={{ whiteSpace: "pre-wrap" }}
//                     >
//                       <strong>Date:</strong>{" "}
//                       {`${formatDate(value.StartDate)} - ${formatDate(
//                         value.EndDate
//                       )}`}
//                       <br />
//                       <strong>Time:</strong>{" "}
//                       {`${formatTime(value.StartDate)} - ${formatTime(
//                         value.EndDate
//                       )}`}
//                       <br />
//                       <strong>Location:</strong> {value.Location}
//                       <br />
//                       <strong>Description:</strong> {value.EventDescription}
//                       <br />
//                       <strong>RSVP by the:</strong>{" "}
//                       {`${formatDate(value.RsvpEndTime)} - ${formatTime(
//                         value.RsvpEndTime
//                       )}`}
//                     </Typography>
//                   </CardContent>
//                   <CardActions disableSpacing>
//                     {value.status === "archived" ? (
//                       <>
//                         <Button onClick={() => handleUnarchive(value.id)}>
//                           Unarchive
//                         </Button>
//                         <Button
//                           color="error"
//                           onClick={() => handleDeleteConfirmation(value.id)}
//                         >
//                           Delete
//                         </Button>
//                       </>
//                     ) : value.status === "draft" ? (
//                       <>
//                         <Button
//                           onClick={() => {
//                             setShowEventForm(true);
//                             setEventForm(value);
//                           }}
//                         >
//                           Edit
//                         </Button>
//                         <Button onClick={() => handlePost(value.id)}>
//                           Post
//                         </Button>
//                         <Button
//                           color="error"
//                           onClick={() => handleDeleteConfirmation(value.id)}
//                         >
//                           Delete
//                         </Button>
//                       </>
//                     ) : (
//                       <>
//                         <Button onClick={() => handleViewAnalytics(value)}>
//                           View Analytics
//                         </Button>
//                         {value.status === "active" && (
//                           <Button
//                             color="error"
//                             onClick={() => handleArchive(value.id)}
//                           >
//                             Archive
//                           </Button>
//                         )}
//                       </>
//                     )}
//                   </CardActions>
//                 </Card>
//               </Grid>
//             ))}
//           </Grid>
//         )}
//       </div>

//       <div
//         style={{
//           marginTop: "30px",
//           borderTop: "1px solid black",
//           paddingTop: "20px",
//         }}
//       >
//         <h1 className="text-xxl">Past Events</h1>

//         <div style={{ overflowX: "auto", whiteSpace: "nowrap" }}>
//           {loading ? (
//             <center>Loading...</center>
//           ) : pastEvents.length === 0 ? (
//             <center>No past events</center>
//           ) : (
//             <Grid container spacing={2}>
//               {pastEvents.map((value) => (
//                 <Grid key={value.id} item>
//                   <Card sx={{ maxWidth: 345 }}>
//                     <CardHeader
//                       title={value.Name}
//                       subheader={`${formatDate(value.StartDate)} - ${formatDate(
//                         value.EndDate
//                       )}`}
//                       action={
//                         <Box sx={{ display: "flex", gap: "4px" }}>
//                           <Box
//                             sx={{
//                               bgcolor: getStatusColor(value.status),
//                               color: "#fff",
//                               p: 0.5,
//                               borderRadius: "4px",
//                             }}
//                           >
//                             <Typography variant="caption">
//                               {value.status}
//                             </Typography>
//                           </Box>
//                         </Box>
//                       }
//                     />
//                     <CardContent>
//                       <Typography
//                         variant="body2"
//                         color="text.secondary"
//                         style={{ whiteSpace: "pre-wrap" }}
//                       >
//                         <strong>Date:</strong>{" "}
//                         {`${formatDate(value.StartDate)} - ${formatDate(
//                           value.EndDate
//                         )}`}
//                         <br />
//                         <strong>Time:</strong>{" "}
//                         {`${formatTime(value.StartDate)} - ${formatTime(
//                           value.EndDate
//                         )}`}
//                         <br />
//                         <strong>Location:</strong> {value.Location}
//                         <br />
//                         <strong>Description:</strong> {value.EventDescription}
//                         <br />
//                         <strong>RSVP by the:</strong>{" "}
//                         {`${formatDate(value.RsvpEndTime)} - ${formatTime(
//                           value.RsvpEndTime
//                         )}`}
//                       </Typography>
//                     </CardContent>
//                     <CardActions disableSpacing>
//                       <Button onClick={() => handleViewAnalytics(value)}>
//                         View Analytics
//                       </Button>
//                       {value.status !== "archived" && (
//                         <Button
//                           color="error"
//                           onClick={() => handleArchive(value.id)}
//                         >
//                           Archive
//                         </Button>
//                       )}
//                     </CardActions>
//                   </Card>
//                 </Grid>
//               ))}
//             </Grid>
//           )}
//         </div>
//       </div>

//       <Modal open={openDeleteModal} onClose={handleCloseDeleteModal}>
//         <Box
//           sx={{
//             position: "absolute",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//             width: 400,
//             bgcolor: "background.paper",
//             border: "2px solid #000",
//             boxShadow: 24,
//             p: 4,
//           }}
//         >
//           <Typography variant="h6" component="h2">
//             Are you sure you want to delete this event?
//           </Typography>
//           <Box sx={{ mt: 2 }}>
//             <Button color="error" onClick={handleDelete} sx={{ mr: 2 }}>
//               Delete
//             </Button>
//             <Button onClick={handleCloseDeleteModal}>Cancel</Button>
//           </Box>
//         </Box>
//       </Modal>

//       <Modal open={openAnalyticsModal} onClose={handleCloseAnalyticsModal}>
//         <Box
//           sx={{
//             position: "absolute",
//             top: "50%",
//             left: "50%",
//             height: 600,
//             transform: "translate(-50%, -50%)",
//             width: 990,
//             bgcolor: "background.paper",
//             border: "2px solid #000",
//             boxShadow: 24,
//             p: 4,
//           }}
//         >
//           <Typography variant="h6">
//             {selectedEvent ? `Analytics for ${selectedEvent.Name}` : ""}
//           </Typography>
//           <TableContainer component={Paper} sx={{ mt: 2 }}>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>Email</TableCell>
//                   <TableCell>Name</TableCell>
//                   <TableCell>Surname</TableCell>
//                   <TableCell>Telephone</TableCell>
//                   <TableCell>Allergy</TableCell>
//                   <TableCell>Diet</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {analyticsData.length === 0 ? (
//                   <TableRow>
//                     <TableCell colSpan={6}>No RSVP data available</TableCell>
//                   </TableRow>
//                 ) : (
//                   analyticsData.map((data) => (
//                     <TableRow key={data.Email}>
//                       <TableCell>{data.Email}</TableCell>
//                       <TableCell>{data.Name}</TableCell>
//                       <TableCell>{data.Surname}</TableCell>
//                       <TableCell>{data.Telephone}</TableCell>
//                       <TableCell>{data.Allergies}</TableCell>
//                       <TableCell>{data.Diet}</TableCell>
//                     </TableRow>
//                   ))
//                 )}
//               </TableBody>
//             </Table>
//           </TableContainer>
//           <Box sx={{ mt: 2 }}>
//             <Button onClick={exportToExcel} sx={{ mr: 2 }}>
//               Export to Excel
//             </Button>
//             <Button onClick={handleCloseAnalyticsModal}>Close</Button>
//           </Box>
//         </Box>
//       </Modal>
//     </div>
//   );
// };

// export default EventsHolder;

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

import AnalyticsDB from "../../database/community/analytics";

import EventDB from "../../database/community/event";

import { green, red, blue, yellow } from "@mui/material/colors";

import AddIcon from "@mui/icons-material/Add";

import IconButton from "@mui/material/IconButton";

const EventsHolder = ({
  communityID,
  handleCreateNewEvent,
  createEvent,

  setShowEventForm,

  setEventForm,
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
    AnalyticsDB.getUsersDetailsByEmails(rsvpEmails).then((userDetailsList) => {
      setAnalyticsData(userDetailsList);
    });
  }, [rsvpEmails]);

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

          // Ensure 'draft' status is not overridden

          if (event.status === "draft") {
            return updatedEvent; // Skip further updates if status is draft
          }

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

  const handleViewAnalytics = async (event) => {
    setSelectedEvent(event);

    try {
      // Fetch RSVP emails

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

  const exportToExcel = () => {
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

    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "Analytics Data");

    XLSX.writeFile(wb, "AnalyticsData.xlsx");
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
    <div className="mt-4">
      <div
        style={{
          display: "flex",

          alignItems: "center",

          justifyContent: "space-between",
        }}
      >
        {/* <h1 className="text-xxl">Upcoming Events</h1> */}
      </div>

      <h1 className="text-xxl relative my-4">
        Upcoming Events
        <IconButton
          className="bg-openbox-green text-openbox-green"
          sx={{
            borderRadius: "50%",

            backgroundColor: "#bcd727",

            color: "white",

            marginLeft: 2,

            "&:hover": {
              backgroundColor: "#819417",
            },
          }}
          onClick={handleCreateNewEvent}
          aria-label="create poll"
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
          <Grid container spacing={2}>
            {upcomingEvents.map((value) => (
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
                      <strong>Description:</strong> {value.Description}
                    </Typography>
                  </CardContent>

                  <CardActions>
                    {value.status === "draft" && (
                      <>
                        <Button
                          size="small"
                          onClick={() => handlePost(value.id)}
                        >
                          Post
                        </Button>

                        <Button
                          size="small"
                          onClick={() => handleDeleteConfirmation(value.id)}
                        >
                          Delete
                        </Button>
                      </>
                    )}

                    {(value.status === "rsvp" || value.status === "active") && (
                      <>
                        <Button
                          size="small"
                          onClick={() => handleViewAnalytics(value)}
                        >
                          View RSVP's
                        </Button>

                        <Button
                          size="small"
                          color="error"
                          onClick={() => handleDeleteConfirmation(value.id)}
                        >
                          Delete
                        </Button>
                      </>
                    )}

                    {value.status === "past" && (
                      <Button
                        size="small"
                        onClick={() => handleViewAnalytics(value)}
                      >
                        View Analytics
                      </Button>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </div>

      <h1 className="text-xxl relative my-4">Past Events</h1>

      <div style={{ overflowX: "auto", whiteSpace: "nowrap" }}>
        {loading ? (
          <center>Loading...</center>
        ) : pastEvents.length === 0 ? (
          <center>No past events</center>
        ) : (
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
                      <strong>Description:</strong> {value.Description}
                    </Typography>
                  </CardContent>

                  <CardActions>
                    {value.status === "past" && (
                      <Button
                        size="small"
                        onClick={() => handleViewAnalytics(value)}
                      >
                        View Analytics
                      </Button>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
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
            Delete Event
          </Typography>

          <Typography id="delete-confirmation-description" sx={{ mt: 2 }}>
            Are you sure you want to delete this event?
          </Typography>

          <Box
            sx={{
              display: "flex",

              justifyContent: "flex-end",

              gap: 1,

              mt: 2,
            }}
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

            width: 600,

            bgcolor: "background.paper",

            border: "2px solid #000",

            boxShadow: 24,

            p: 4,
          }}
        >
          <Typography id="analytics-modal-title" variant="h6" component="h2">
            Analytics for {selectedEvent?.Name}
          </Typography>

          <Box
            sx={{
              display: "flex",

              justifyContent: "flex-end",

              gap: 1,

              mt: 2,
            }}
          >
            <Button onClick={exportToExcel}>Export to Excel</Button>
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
