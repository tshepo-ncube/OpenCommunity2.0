import React, { useEffect, useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Typography,
  Button,
  Chip,
  Grid,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  People,
  CalendarToday,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import CommunityDB from "../database/community/community";
import { useRouter } from "next/navigation";

// PUT BACK
// import React, { useEffect, useState } from "react";
// import CircularProgress from "@mui/material/CircularProgress";
// import Grid from "@mui/material/Grid";
// // import Card from "@mui/material/Card";
// // import CardActions from "@mui/material/CardActions";
// // import CardContent from "@mui/material/CardContent";
// import Button from "@mui/material/Button";
// import Typography from "@mui/material/Typography";

// import Dialog from "@mui/material/Dialog";
// import DialogActions from "@mui/material/DialogActions";
// import DialogContent from "@mui/material/DialogContent";
// import DialogContentText from "@mui/material/DialogContentText";
// import DialogTitle from "@mui/material/DialogTitle";
// import FormControl from "@mui/material/FormControl";
// import Select from "@mui/material/Select";
// import MenuItem from "@mui/material/MenuItem";
// import InputLabel from "@mui/material/InputLabel";
// import CommunityDB from "../database/community/community";
// import { useRouter } from "next/navigation";
// import {
//   Edit as EditIcon,
//   Visibility as VisibilityIcon,
//   VisibilityOff as VisibilityOffIcon,
//   Delete as DeleteIcon,
//   PostAdd as PostAddIcon,
//   OpenInNew as OpenInNewIcon, // Add this line for the open icon
// } from "@mui/icons-material";

const AdminCommunity = () => {
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [submittedData, setSubmittedData] = useState([]);
  const [editID, setEditID] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const fileInputRef = useRef(null);
  const handleUploadButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const [image, setImage] = useState(null);

  const handleImageUpload = (event) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
    }
  };

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        await CommunityDB.getAllAdminCommunities(setSubmittedData, setLoading);
      } catch (error) {
        console.error("Error fetching communities:", error);
      }
    };

    fetchCommunities();
  }, []);

  const handleOpenPopup = () => {
    setPopupOpen(true);
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    console.log("About to run CommunityDB.editCommunity()");
    try {
      await CommunityDB.editCommunity(
        editID,
        {
          id: editID,

          description,
        },
        image
      );
    } catch (error) {
      console.error("Error editing community:", error);
    }

    setName("");
    setDescription("");
    setPopupOpen(false);
  };

  const handleOpenDeleteDialog = (id) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setDeleteId(null);
  };

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await CommunityDB.deleteCommunity(deleteId);
        setSubmittedData(submittedData.filter((item) => item.id !== deleteId));
        handleCloseDeleteDialog();
      } catch (error) {
        console.error("Error deleting community:", error);
      }
    }
  };

  const handleArchive = async (id) => {
    try {
      await CommunityDB.updateCommunityStatus(id, "archived");
      setSubmittedData(
        submittedData.map((item) =>
          item.id === id ? { ...item, status: "archived" } : item
        )
      );
    } catch (error) {
      console.error("Error archiving community:", error);
    }
  };

  const handleUnarchive = async (id) => {
    try {
      await CommunityDB.updateCommunityStatus(id, "active");
      setSubmittedData(
        submittedData.map((item) =>
          item.id === id ? { ...item, status: "active" } : item
        )
      );
    } catch (error) {
      console.error("Error unarchiving community:", error);
    }
  };

  useEffect(() => {
    console.log("EditID : ", editID);
  }, [editID]);

  const handleEdit = (index) => {
    console.log("About to make an edit");
    //console.log(index);
    console.log(submittedData[index]);

    console.log(submittedData.find((item) => item.id === index));
    setName(submittedData.find((item) => item.id === index).name);
    setDescription(submittedData.find((item) => item.id === index).description);
    setStatus(submittedData.find((item) => item.id === index).status);
    setCategory(submittedData.find((item) => item.id === index).category);

    console.log(name, description, status, category);
    console.log(editIndex);
    setEditID(submittedData.find((item) => item.id === index).id);
    console.log(editID);
    setEditIndex(index);
    setPopupOpen(true);
  };

  const handlePost = async (id) => {
    try {
      await CommunityDB.updateCommunityStatus(id, "active");
      setSubmittedData(
        submittedData.map((item) =>
          item.id === id ? { ...item, status: "active" } : item
        )
      );
    } catch (error) {
      console.error("Error posting community:", error);
    }
  };

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  const getUniqueStatuses = (data) => {
    const statuses = data.map((item) => item.status);
    return Array.from(new Set(statuses));
  };

  const filterDataByStatus = (data) => {
    if (selectedStatus === "All") return data;
    return data.filter((item) => item.status === selectedStatus);
  };

  const filteredData = filterDataByStatus(submittedData);
  const uniqueStatuses = getUniqueStatuses(submittedData);

  const renderEventsByStatus = (status) => {
    const eventsByStatus = filteredData.filter(
      (event) => event.status === status
    );

    if (status === "All") {
      return uniqueStatuses.map((status) => {
        const events = filteredData.filter((event) => event.status === status);

        return (
          <div key={status} className="mb-4">
            <h2 className="text-xl font-bold mb-4">
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </h2>
            {events.length === 0 ? (
              <p>No communities currently exist with the status: {status}</p>
            ) : (
              <Grid container spacing={2} className="p-4">
                {events.map((data) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={data.id}>
                    <Card
                      className="flex flex-col h-120"
                      onClick={() => {
                        console.log(data);
                        router.push(`/admin/Dashboard/${data.id}`);
                      }} // Navigate to community detail page
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        height: "400px", // Fixed height for consistency
                        boxShadow: 3,
                        borderRadius: 2,
                        cursor: "pointer", // Change cursor to indicate clickability
                        "&:hover": {
                          boxShadow: 6, // Slightly elevate the card on hover for better UX
                        },
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="175"
                        className="h-40"
                        image={
                          data.communityImage
                            ? data.communityImage
                            : "https://images.unsplash.com/photo-1607656311408-1e4cfe2bd9fc?w=500&auto=format&fit=crop&q=60"
                        }
                        alt={`Image of ${data.name} community`}
                        sx={{ objectFit: "cover", width: "100%" }}
                      />

                      <CardContent
                        sx={{
                          flexGrow: 1,
                          padding: "12px",
                          overflow: "hidden",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <Typography
                          gutterBottom
                          variant="h6"
                          component="div"
                          style={{
                            fontFamily: "Poppins, sans-serif",
                            fontWeight: "bold",
                            textAlign: "left",
                          }}
                        >
                          {data.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          style={{
                            fontFamily: "Poppins, sans-serif",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            textAlign: "left",
                          }}
                        >
                          {data.description.length > 100
                            ? `${data.description.substring(0, 100)}...`
                            : data.description}
                        </Typography>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {data.selectedInterests &&
                            data.selectedInterests.map((tag) => (
                              <Chip
                                key={tag}
                                label={tag}
                                variant="filled"
                                size="small"
                                className="hover:bg-gray-200 bg-gray-300"
                                sx={{
                                  color: "black",
                                  fontFamily: "Poppins, sans-serif",
                                }}
                              />
                            ))}
                        </div>
                      </CardContent>

                      <CardContent
                        sx={{ paddingTop: "0px", paddingBottom: "0px" }}
                      >
                        <Grid container alignItems="center">
                          <Grid item xs={6}>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              className="flex items-center"
                              style={{
                                fontFamily: "Poppins, sans-serif",
                                textAlign: "left",
                              }}
                            >
                              <People
                                fontSize="small"
                                style={{ marginRight: 4 }}
                              />
                              {data.users ? data.users.length : 0} Members
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              className="flex items-center justify-end"
                              style={{
                                fontFamily: "Poppins, sans-serif",
                                textAlign: "right",
                              }}
                            >
                              <CalendarToday
                                fontSize="small"
                                style={{ marginRight: 4 }}
                              />
                              {data.UpcomingEventsCount || 0}{" "}
                              {data.UpcomingEventsCount > 1
                                ? "Events"
                                : "Event"}
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>

                      <CardActions
                        sx={{
                          display: "flex",
                          justifyContent: "space-around",
                          padding: "8px 12px",
                          gap: "8px",
                        }}
                      >
                        <Button
                          size="small"
                          startIcon={<EditIcon />}
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent card click when editing
                            handleEdit(data.id);
                          }}
                          sx={{
                            color: "#bcd727",
                            fontFamily: "Poppins, sans-serif",
                            backgroundColor: "transparent",
                            border: "1px solid #bcd727",
                            "&:hover": {
                              backgroundColor: "rgba(188, 215, 39, 0.2)",
                            },
                            borderRadius: 1,
                            textTransform: "none",
                            flex: 1,
                            maxWidth: "100px",
                          }}
                        >
                          Edit
                        </Button>

                        {data.status === "active" ? (
                          <Button
                            size="small"
                            startIcon={<VisibilityIcon />}
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent card click when archiving
                              handleArchive(data.id);
                            }}
                            sx={{
                              color: "#FF9800",
                              fontFamily: "Poppins, sans-serif",
                              backgroundColor: "transparent",
                              border: "1px solid #FF9800",
                              "&:hover": {
                                backgroundColor: "rgba(255, 152, 0, 0.2)",
                              },
                              borderRadius: 1,
                              textTransform: "none",
                              flex: 1,
                              maxWidth: "100px",
                            }}
                          >
                            Archive
                          </Button>
                        ) : (
                          <Button
                            size="small"
                            startIcon={<VisibilityOffIcon />}
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent card click when unarchiving
                              handleUnarchive(data.id);
                            }}
                            sx={{
                              color: "#4CAF50",
                              fontFamily: "Poppins, sans-serif",
                              backgroundColor: "transparent",
                              border: "1px solid #4CAF50",
                              "&:hover": {
                                backgroundColor: "rgba(76, 175, 80, 0.2)",
                              },
                              borderRadius: 1,
                              textTransform: "none",
                              flex: 1,
                              maxWidth: "100px",
                            }}
                          >
                            Unarchive
                          </Button>
                        )}

                        <Button
                          size="small"
                          startIcon={<DeleteIcon />}
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent card click when deleting
                            handleOpenDeleteDialog(data.id);
                          }}
                          sx={{
                            color: "#f44336",
                            fontFamily: "Poppins, sans-serif",
                            backgroundColor: "transparent",
                            border: "1px solid #f44336",
                            "&:hover": {
                              backgroundColor: "rgba(244, 67, 54, 0.2)",
                            },
                            borderRadius: 1,
                            textTransform: "none",
                            flex: 1,
                            maxWidth: "100px",
                          }}
                        >
                          Delete
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </div>
        );
      });
    } else {
      if (eventsByStatus.length === 0) {
        return <p>No communities currently exist with the status: {status}</p>;
      }
      return (
        <Grid container spacing={2} className="p-4">
          {eventsByStatus.map((data) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={data.id}>
              <Card
                className="flex flex-col h-full"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "350px",
                  boxShadow: 3,
                  borderRadius: 2,
                }}
              >
                <CardMedia
                  component="img"
                  height="175"
                  image={
                    data.communityImage
                      ? data.communityImage
                      : "https://images.unsplash.com/photo-1607656311408-1e4cfe2bd9fc?w=500&auto=format&fit=crop&q=60"
                  }
                  alt={`Image of ${data.name} community`}
                  sx={{ objectFit: "cover", width: "100%" }}
                />

                <CardContent sx={{ flexGrow: 1, padding: "12px" }}>
                  <Typography
                    gutterBottom
                    variant="h6"
                    component="div"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: "bold",
                      textAlign: "left",
                    }}
                  >
                    {data.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textAlign: "left",
                    }}
                  >
                    {data.description.length > 100
                      ? `${data.description.substring(0, 100)}...`
                      : data.description}
                  </Typography>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {data.selectedInterests &&
                      data.selectedInterests.map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          variant="filled"
                          size="small"
                          className="hover:bg-gray-200 bg-gray-300"
                          sx={{
                            color: "black",
                            fontFamily: "Poppins, sans-serif",
                          }}
                        />
                      ))}
                  </div>
                </CardContent>

                <CardContent sx={{ paddingTop: "0px", paddingBottom: "0px" }}>
                  <Grid container alignItems="center">
                    <Grid item xs={6}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        className="flex items-center"
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          textAlign: "left",
                        }}
                      >
                        <People fontSize="small" style={{ marginRight: 4 }} />
                        {data.users ? data.users.length : 0} Members
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        className="flex items-center justify-end"
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          textAlign: "right",
                        }}
                      >
                        <CalendarToday
                          fontSize="small"
                          style={{ marginRight: 4 }}
                        />
                        {data.UpcomingEventsCount || 0}{" "}
                        {data.UpcomingEventsCount > 1 ? "Events" : "Event"}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>

                <CardActions sx={{ padding: "12px" }}>
                  <Button
                    size="small"
                    onClick={() => handleEdit(data.id)}
                    sx={{
                      color: "#bcd727",
                      "&:hover": {
                        backgroundColor: "transparent",
                        textDecoration: "underline",
                      },
                      fontFamily: "Poppins, sans-serif",
                    }}
                  >
                    <EditIcon /> Edit
                  </Button>
                  <Button
                    size="small"
                    onClick={() => handleOpenDeleteDialog(data.id)}
                    color="error"
                    sx={{
                      fontFamily: "Poppins, sans-serif",
                    }}
                  >
                    <DeleteIcon /> Delete
                  </Button>
                  {data.status === "active" ? (
                    <Button
                      size="small"
                      onClick={() => handleArchive(data.id)}
                      sx={{
                        color: "#FF9800",
                        "&:hover": {
                          backgroundColor: "transparent",
                          textDecoration: "underline",
                        },
                        fontFamily: "Poppins, sans-serif",
                      }}
                    >
                      <VisibilityIcon /> Archive
                    </Button>
                  ) : (
                    <Button
                      size="small"
                      onClick={() => handleUnarchive(data.id)}
                      sx={{
                        color: "#4CAF50",
                        "&:hover": {
                          backgroundColor: "transparent",
                          textDecoration: "underline",
                        },
                        fontFamily: "Poppins, sans-serif",
                      }}
                    >
                      <VisibilityOffIcon /> Unarchive
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      );
    }
  };

  return (
    <div className="relative min-h-screen  ">
      {isPopupOpen && (
        <div className="fixed  backdrop-blur-lg inset-0 left-0 w-full h-full flex justify-center items-center z-20">
          <div className="relative w-full max-w-lg p-6 bg-white rounded-lg shadow-md">
            <button
              className="absolute top-2 p-2 right-2 text-gray-600 hover:text-black"
              onClick={handleClosePopup}
            >
              <CloseIcon />
            </button>
            <form
              onSubmit={handleFormSubmit}
              className="max-h-[80vh] overflow-y-auto"
            >
              <h2 className="text-2xl font-bold mb-4">
                {editIndex !== null ? "Edit Community" : "Create Event"}
              </h2>

              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                  required
                  disabled
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                  required
                ></textarea>
              </div>

              <div class="flex items-center justify-center w-full">
                <label
                  for="dropzone-file"
                  class="flex flex-col items-center justify-center w-full h-20 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                >
                  <div class="flex flex-col items-center justify-center">
                    <svg
                      class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 16"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                      />
                    </svg>
                    <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span class="font-semibold">Click to upload images</span>{" "}
                      or drag and drop
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                      SVG, PNG, JPG or GIF (MAX. 800x400px)
                    </p>
                  </div>
                  <input
                    id="dropzone-file"
                    type="file"
                    class="hidden"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                  />
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-2 mt-4 bg-openbox-green text-white rounded-md hover:bg-green-400"
              >
                {editIndex !== null ? "Save Changes" : "Submit"}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="w-full px-6 py-4 ">
        <div className="justify-center flex items-center ">
          <div className="mb-4 w-full md:w-1/4 ">
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor="status"
            >
              Filter By Status
            </label>
            <select
              id="status"
              value={selectedStatus}
              onChange={handleStatusChange}
              className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="All">All</option>
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        {/* <FormControl variant="outlined" className="mb-4 w-full md:w-1/4">
          <InputLabel>Filter By Status</InputLabel>
          <Select
            value={selectedStatus}
            onChange={handleStatusChange}
            label="Status"
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="draft">Draft</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="archived">Archived</MenuItem>
          </Select>
        </FormControl> */}
        {loading ? (
          <div className="flex justify-center">
            <CircularProgress />
          </div>
        ) : (
          <div>{renderEventsByStatus(selectedStatus)}</div>
        )}
      </div>

      <Dialog
        open={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete Community"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this community? This action cannot
            be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="primary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AdminCommunity;
