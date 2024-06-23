"use client";

import React, { ChangeEvent, useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import CommunityDB from "../../database/community/community";
import { useRouter } from "next/navigation";

const AdminCommunity = () => {
  const [isPopupOpen, setPopupOpen] = useState(false);
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
    }[]
  >([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const handleOpenPopup = () => {
    setPopupOpen(true);
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    CommunityDB.createCommunity(
      { name, description, category: "general" }, // Hardcoded category for now
      setSubmittedData,
      setLoading
    );

    setName("");
    setDescription("");
    setPopupOpen(false);
  };

  const handleDelete = async (id: string) => {
    await CommunityDB.deleteCommunity(id);
    setSubmittedData(submittedData.filter((item) => item.id !== id));
  };

  const handleEdit = (index: number) => {
    setName(submittedData[index].name);
    setDescription(submittedData[index].description);
    setEditIndex(index);
    setPopupOpen(true);
  };

  useEffect(() => {
    CommunityDB.getAllCommunities(setSubmittedData, setLoading);
  }, []);

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
                <Card sx={{ maxWidth: 345 }}>
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
