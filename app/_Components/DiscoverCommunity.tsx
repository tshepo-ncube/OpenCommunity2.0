import React, { ChangeEvent, useEffect, useState } from "react";
import {
  CircularProgress,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActions,
  Button,
} from "@mui/material";
import CommunityDB from "../../database/community/community";

const DiscoverCommunity = () => {
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [picture, setPicture] = useState<File | null>(null);
  const [submittedData, setSubmittedData] = useState<
    { name: string; description: string; picture: string }[]
  >([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    CommunityDB.getCommunitiesWithImages(setSubmittedData, setLoading);
  }, []);

  const handleOpenPopup = () => {
    setPopupOpen(true);
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    CommunityDB.createCommunity(
      { name, description, picture },
      setSubmittedData,
      setLoading
    );
    setName("");
    setDescription("");
    setPicture(null);
    setPopupOpen(false);
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

  const filteredData = submittedData.filter((data) =>
    data.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Existing JSX */}
      <div className="flex justify-center mt-4">
        <input
          type="text"
          placeholder="Search communities..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border border-gray-300 rounded-md w-full max-w-md"
        />
      </div>

      <div className="flex justify-center flex-wrap mt-2">
        {!loading ? (
          <Grid container spacing={2} style={{ padding: 14 }}>
            {filteredData.map((data, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Card sx={{ maxWidth: 345 }}>
                  <CardMedia
                    sx={{ height: 140 }}
                    image={data.picture}
                    title="Community Image"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {data.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {data.description}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={() => handleEdit(index)}>
                      Edit
                    </Button>
                    {/* Add more actions as needed */}
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <CircularProgress
            color="success"
            style={{ marginTop: 20, width: 150, height: 150, color: "#bcd727" }}
          />
        )}
      </div>
      {/* Existing JSX */}
    </>
  );
};

export default DiscoverCommunity;
