//This is the administrator page to create a community

//Instead of importing Header and Sidebar, they should rather be placed in the layout folder

"use client";

import React, { ChangeEvent, useEffect } from "react";

import { useState } from "react";

import CommunityDB from "../../database/community/community";

import { CircularProgress } from "@mui/material";

import { setLazyProp } from "next/dist/server/api-utils";

import Paper from "@mui/material/Paper";

import Grid from "@mui/material/Grid";

import Fab from "@mui/material/Fab";

import Card from "@mui/material/Card";

import AddIcon from "@mui/icons-material/Add";

import CardActions from "@mui/material/CardActions";

import CardContent from "@mui/material/CardContent";

import CardMedia from "@mui/material/CardMedia";

import Button from "@mui/material/Button";

import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";

const AdminCommunity = () => {
  const [isPopupOpen, setPopupOpen] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");

  const [description, setDescription] = useState("");

  const [picture, setPicture] = useState<File | null>(null);
  //handles user's uploaded profile picture

  const [submittedData, setSubmittedData] = useState<
    { name: string; description: string; picture: File | null }[]
  >([]);

  const [editIndex, setEditIndex] = useState<number | null>(null);

  const handleOpenPopup = () => {
    setPopupOpen(true);
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
  };

  useEffect(() => {
    CommunityDB.getCommunitiesWithImages(setSubmittedData, setLoading);
  }, []);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Submitted:", { name, description });

    CommunityDB.createCommunity(
      { name, description, picture },

      setSubmittedData,

      setLoading
    );

    // setSubmittedData([...submittedData, { name, description, picture }]);

    //CommunityDB.uploadImage(picture);

    setName("");

    setDescription("");

    setPicture(null);

    setPopupOpen(false);
  };

  //There needs to be a function to save the community and it's details onto the firebase

  //When storing information about the community, the name of the administrator needs to be stored as well?

  //This function edits the saved community

  //At the moment - this creates another community

  const handleEdit = (index: number) => {
    setName(submittedData[index].name);

    setDescription(submittedData[index].description);

    setEditIndex(index);

    setPopupOpen(true);

    // CommunityDB.editCommunity(submittedData[index].id, {

    //   name,

    //   description,

    //   picture,

    // });
  };

  const handlePictureUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const picFile = e.target.files && e.target.files[0];

    if (picFile) {
      setPicture(picFile);
    }
  };

  return (
    <>
      {/* <Fab
        color="success"
        style={{
          bottom: "50px",

          position: "fixed",

          right: "20px",
        }}
        aria-label="add"
        onClick={handleOpenPopup}
      >
        <AddIcon />
      </Fab> */}

      <div className="flex-col items-center min-h-screen">
        {/* <div className="flex justify-center mt-16 mb-8 ">

          <button

            onClick={handleOpenPopup}

            className="btn bg-openbox-green  hover:bg-hover-obgreen text-white font-medium rounded-lg text-sm px-5 py-2.5 mr-4 focus:outline-none focus:ring-2 focus:ring-primary-300"

          >

            Create a Community

          </button>

        </div> */}

        {isPopupOpen && (
          <div
            className="mt-16 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-md shadow-xl
 z-50 w-11/12 sm:w-3/4 lg:w-2/3 xl:w-1/2 h-3/4 sm:h-auto lg:h-auto"
          >
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
                  className="mt-1 p-2 border border-gray-300 rounded-md
 w-full"
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
                  className="mt-1 p-2 border border-gray-300 rounded-md
 w-full"
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
                  className="mt-1 p-2 border border-gray-300 rounded-md
 w-full"
                  required
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="btn bg-openbox-green hover:bg-hover-obgreen
 text-white font-medium rounded-lg text-sm px-5 py-2.5 mr-4 focus:outline-none focus:ring-2 focus:ring-primary-300"
                >
                  {editIndex !== null ? "Save" : "Create"}
                  Create
                </button>

                <button
                  onClick={handleClosePopup}
                  className="ml-2 bg-gray hover:bg-hover-gray text-gray-800
 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="flex justify-center flex-wrap mt-2 ">
          {loading ? (
            <>
              <CircularProgress
                color="success"
                style={{
                  marginTop: 20,
                  width: 150,
                  height: 150,
                }}
              />
            </>
          ) : (
            <>
              <Grid
                container
                spacing={2}
                style={{
                  padding: 14,
                }}
              >
                {submittedData.map((data, index) => (
                  <>
                    {/* <div

                key={index}

                className="mr-4 ml-4 mb-4 mt-4 bg-gray p-4 rounded-lg text-center w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5"

              >

               

                <p className="font-bold">{data.name} Community</p>

                {data.picture && (

                  <img

                    src={data.picture}

                    alt="Uploaded"

                    className="mt-4 mb-4 mx-auto max-w-full h-auto max-h-48" // Example: Set max height to 48

                  />

                )}

                <p>{data.description}</p>

            

                <button

                  onClick={() => handleEdit(index)}

                  className="btn bg-green-500 hover:bg-green-700 text-white font-medium rounded-lg text-sm px-5 py-2.5 mr-4 focus:outline-none focus:ring-2 focus:ring-primary-300"

                >

                  Edit

                </button>




                   </div> */}

                    <Grid item xs={6} md={3}>
                      <Card
                        sx={{
                          maxWidth: 345,
                        }}
                      >
                        <CardMedia
                          sx={{
                            height: 140,
                          }}
                          image={data.picture}
                          title="green iguana"
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
                          <Button
                            size="small"
                            onClick={() => handleEdit(index)}
                          >
                            Edit
                          </Button>

                          <Button
                            size="small"
                            onClick={() => {
                              localStorage.setItem("CurrentCommunity", data.id);
                              console.log(`Current Community : ${data.id}`);
                              router.push("/adminDash");
                            }}
                          >
                            View
                          </Button>

                          <Button
                            size="small"
                            color="error"
                            onClick={() => handleEdit(index)}
                          >
                            delete
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  </>
                ))}
              </Grid>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminCommunity;
