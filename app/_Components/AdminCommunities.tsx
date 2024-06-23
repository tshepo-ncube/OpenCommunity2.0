import React, { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import CommunityDB from "../../database/community/community";
import { useRouter } from "next/navigation";

const AdminCommunity = () => {
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submittedData, setSubmittedData] = useState<
    {
      id: string;
      name: string;
      description: string;
      category: string;
      status: string; // Include status in state
    }[]
  >([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        await CommunityDB.getAllCommunities(setSubmittedData, setLoading);
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

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await CommunityDB.createCommunity(
        { name, description, category: "general" }, // Hardcoded category for now
        setSubmittedData,
        setLoading
      );
    } catch (error) {
      console.error("Error creating community:", error);
    }

    setName("");
    setDescription("");
    setPopupOpen(false);
  };

  const handleOpenDeleteDialog = (id: string) => {
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

  const handleArchive = async (id: string) => {
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

  const handleUnarchive = async (id: string) => {
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

  const handleEdit = (index: number) => {
    setName(submittedData[index].name);
    setDescription(submittedData[index].description);
    setEditIndex(index);
    setPopupOpen(true);
  };

  const handleStatusChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedStatus(event.target.value as string);
  };

  const filterDataByStatus = (
    data: {
      id: string;
      name: string;
      description: string;
      category: string;
      status: string;
    }[]
  ) => {
    if (!selectedStatus || selectedStatus === "All") return data;
    return data.filter((item) => item.status === selectedStatus);
  };

  const filteredData = filterDataByStatus(submittedData);

  return (
    <div className="flex-col items-center min-h-screen">
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-md z-10"></div>
      )}

      {isPopupOpen && (
        <div className="mt-16 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-md shadow-xl z-50 w-11/12 sm:w-3/4 lg:w-2/3 xl:w-1/2 h-3/4 sm:h-auto lg:h-auto">
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
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
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                required
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Community Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                required
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="btn bg-openbox-green hover:bg-hover-obgreen text-white font-medium rounded-lg text-sm px-5 py-2.5 mr-4 focus:outline-none focus:ring-2 focus:ring-primary-300"
              >
                {editIndex !== null ? "Save" : "Create"}
              </button>
              <button
                onClick={handleClosePopup}
                className="btn bg-gray hover:bg-hover-gray text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                <CloseIcon />
              </button>
            </div>
          </form>
        </div>
      )}

      <Dialog open={isDeleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to permanently delete this community? Once you
            have deleted this community you will not be able to retreive the
            community and its corresponding data
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            No
          </Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      <div className="flex justify-center mt-4">
        <FormControl variant="outlined" className="w-full max-w-xs">
          <InputLabel id="status-label">Filter by status</InputLabel>
          <Select
            labelId="status-label"
            id="status-select"
            value={selectedStatus}
            onChange={handleStatusChange}
            label="Status"
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="archived">Archived</MenuItem>
          </Select>
        </FormControl>
      </div>

      <div className="flex justify-center flex-wrap mt-2">
        {loading ? (
          <CircularProgress
            color="success"
            style={{
              marginTop: 20,
              width: 150,
              height: 150,
              color: "#bcd727",
            }}
          />
        ) : (
          <Grid container spacing={2} className="p-4">
            {filteredData.map((data, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Card className="relative">
                  {data.status === "archived" && (
                    <div className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 rounded-md text-xs font-bold z-10">
                      Archived
                    </div>
                  )}
                  {data.status === "active" && (
                    <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-md text-xs font-bold z-10">
                      Active
                    </div>
                  )}
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {data.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Category: {data.category}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {data.description}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    {data.status === "archived" ? (
                      <>
                        <Button size="small" onClick={() => handleEdit(index)}>
                          Edit
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          onClick={() => handleOpenDeleteDialog(data.id)}
                        >
                          Delete
                        </Button>
                        <Button
                          size="small"
                          onClick={() => handleUnarchive(data.id)}
                        >
                          Unarchive
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button size="small" onClick={() => handleEdit(index)}>
                          Edit
                        </Button>
                        <Button
                          size="small"
                          onClick={() => {
                            localStorage.setItem("CurrentCommunity", data.id);
                            router.push("/adminDash");
                          }}
                        >
                          View
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          onClick={() => handleArchive(data.id)}
                        >
                          Archive
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          onClick={() => handleOpenDeleteDialog(data.id)}
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
    </div>
  );
};

export default AdminCommunity;
