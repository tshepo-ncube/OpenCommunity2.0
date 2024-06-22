import React, { ChangeEvent, useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import CommunityDB from "../../database/community/community";
import { useRouter } from "next/navigation";

const AdminCommunity = () => {
  const [isDeleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [communityToDelete, setCommunityToDelete] = useState<string | null>(
    null
  );
  const [isPopupOpen, setPopupOpen] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [picture, setPicture] = useState<File | null>(null);
  const [submittedData, setSubmittedData] = useState<
    {
      id: string;
      name: string;
      description: string;
      picture: string;
      category: string;
      status: string; // New status field
    }[]
  >([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        await CommunityDB.getCommunitiesWithImages(
          setSubmittedData,
          setLoading
        );
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
    setName("");
    setDescription("");
    setPicture(null);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = {
      name,
      description,
      picture,
      category: "general", // Hardcoded category for now
      status: "active",
    };

    CommunityDB.createCommunity(formData, setSubmittedData, setLoading);

    handleClosePopup();
  };

  const handleDelete = async (id: string) => {
    try {
      await CommunityDB.deleteCommunity(id);
      setSubmittedData(submittedData.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting community:", error);
    }
  };

  const handleArchive = async (id: string) => {
    try {
      await CommunityDB.archiveCommunity(id);
      const updatedData = submittedData.map((item) =>
        item.id === id ? { ...item, status: "archived" } : item
      );
      setSubmittedData(updatedData);
    } catch (error) {
      console.error("Error archiving community:", error);
    }
  };

  const handleUnarchive = async (id: string) => {
    try {
      await CommunityDB.unarchiveCommunity(id);
      const updatedData = submittedData.map((item) =>
        item.id === id ? { ...item, status: "active" } : item
      );
      setSubmittedData(updatedData);
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

  const handlePictureUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const picFile = e.target.files && e.target.files[0];
    if (picFile) {
      setPicture(picFile);
    }
  };

  return (
    <div className="flex-col items-center min-h-screen">
      {isDeleteConfirmationOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-md z-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-md shadow-xl">
            <p>Are you sure you want to permanently delete this community?</p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setDeleteConfirmationOpen(false)}
                className="btn bg-gray hover:bg-hover-gray text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  confirmDelete();
                  setDeleteConfirmationOpen(false);
                }}
                className="btn bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-md z-10"></div>
      )}

      {isPopupOpen && (
        <div className="mt-16 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-md shadow-xl z-50 w-11/12 sm:w-3/4 lg:w-2/3 xl:w-1/2 h-3/4 sm:h-auto lg:h-auto">
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-700"
              >
                Upload Image
              </label>
              <input
                type="file"
                id="image"
                onChange={handlePictureUpload}
                accept="image/*"
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                required
              />
            </div>
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
          <Grid container spacing={2} style={{ padding: 14 }}>
            {submittedData.map((data, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Card
                  sx={{
                    maxWidth: 345,
                    position: "relative",
                  }}
                >
                  <CardMedia
                    sx={{ height: 140 }}
                    image={data.picture}
                    title={data.name}
                  />
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
                      <Button
                        size="small"
                        color="success"
                        onClick={() => handleUnarchive(data.id)}
                      >
                        Unarchive
                      </Button>
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
                      </>
                    )}
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleDelete(data.id)}
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
    </div>
  );
};

export default AdminCommunity;
