import React, { ChangeEvent, useEffect, useState } from "react";
import {
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import CommunityDB from "../../database/community/community";

const DiscoverCommunity = () => {
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
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("active");

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

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    CommunityDB.createCommunity(
      { name, description, category: "general" }, // Assuming a default category
      setSubmittedData,
      setLoading
    );
    setName("");
    setDescription("");
  };

  const handleEdit = (index: number) => {
    setName(submittedData[index].name);
    setDescription(submittedData[index].description);
    setEditIndex(index);
  };

  const filterDataByCategoryAndStatus = (
    data: {
      id: string;
      name: string;
      description: string;
      category: string;
      status: string;
    }[]
  ) => {
    return data.filter(
      (item) =>
        item.category.toLowerCase().includes(selectedCategory.toLowerCase()) &&
        item.status === selectedStatus &&
        `${item.name.toLowerCase()} ${item.description.toLowerCase()} ${item.category.toLowerCase()}`.includes(
          searchQuery.toLowerCase()
        )
    );
  };

  const filteredData = filterDataByCategoryAndStatus(submittedData);

  const uniqueCategories = Array.from(
    new Set(submittedData.map((data) => data.category))
  );

  // Function to generate consistent color based on category
  const stringToColor = (category: string): string => {
    switch (category.toLowerCase()) {
      case "general":
        return "#2196f3"; // Blue
      case "social":
        return "#ff9800"; // Orange
      case "retreat":
        return "#f44336"; // Red
      case "sports":
        return "#4caf50"; // Green
      case "development":
        return "#9c27b0"; // Purple
      default:
        // Generate a color based on hash if category not specified
        let hash = 0;
        for (let i = 0; i < category.length; i++) {
          hash = category.charCodeAt(i) + ((hash << 5) - hash);
        }
        const color = `hsl(${Math.abs(hash) % 360}, 70%, 80%)`; // Fallback to HSL color
        return color;
    }
  };

  return (
    <>
      <div className="flex justify-center mt-4">
        <input
          type="text"
          placeholder="Search communities..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border border-gray-300 rounded-md w-full max-w-md"
        />

        <div className="ml-2">
          <FormControl variant="outlined" className="w-full max-w-xs">
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              id="category-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              label="Category"
            >
              <MenuItem value="">
                <em>All</em>
              </MenuItem>
              {uniqueCategories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </div>

      <div className="flex justify-center flex-wrap mt-2">
        {!loading ? (
          <>
            {filteredData.length === 0 ? (
              <Typography variant="body1" className="mt-4">
                No communities found.
              </Typography>
            ) : (
              <Grid container spacing={2} style={{ padding: 14 }}>
                {filteredData.map((data, index) => (
                  <Grid item xs={6} md={3} key={index}>
                    <Card
                      sx={{
                        position: "relative",
                        maxWidth: 345,
                        marginBottom: 20,
                        padding: "6px",
                        "&::before": {
                          content: `"${data.category}"`,
                          position: "absolute",
                          top: 0,
                          left: 0,
                          backgroundColor: stringToColor(data.category),
                          color: "#fff",
                          padding: "2px 6px",
                          fontSize: "0.75rem",
                          fontWeight: "bold",
                        },
                      }}
                    >
                      <CardContent>
                        <Typography gutterBottom variant="h6" component="div">
                          {data.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {data.description}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button size="small" onClick={() => handleEdit(index)}>
                          Join
                        </Button>
                        {/* Add more actions as needed */}
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        ) : (
          <CircularProgress
            color="success"
            style={{ marginTop: 20, width: 150, height: 150, color: "#bcd727" }}
          />
        )}
      </div>
    </>
  );
};

export default DiscoverCommunity;
