import React, { useState, useEffect } from "react";
import PollDB from "../database/community/poll";

import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import IconButton from "@mui/material/IconButton";
import { green } from "@mui/material/colors";
import PollAnalytics from "../_Components/PollAnalytics";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { CardActions } from "@mui/material";
import {
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Delete as DeleteIcon,
  PostAdd as PostAddIcon,
  Assessment as AssessmentIcon,
} from "@mui/icons-material";

function PollsHolder({ communityID }) {
  const [allPolls, setAllPolls] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showAnalyticsForm, setShowAnalyticsForm] = useState(false);
  const [newPollQuestion, setNewPollQuestion] = useState("");
  const [newPollOptions, setNewPollOptions] = useState(["", ""]);
  const [dateValue, setDateValue] = React.useState(null);

  const [inActivePolls, setInActivePolls] = useState([]);
  const [activePolls, setActivePolls] = useState([]);

  const [analyticsPollPointer, setAnalyticsPollPointer] = useState(null);

  useEffect(() => {
    PollDB.getPollFromCommunityID(communityID, setAllPolls);
  }, [communityID]);

  useEffect(() => {
    const currentDate = new Date();
    const active = allPolls.filter(
      (poll) => new Date(poll.PollCloseDate) > currentDate
    );
    const inActive = allPolls.filter(
      (poll) => currentDate > new Date(poll.PollCloseDate)
    );
    setInActivePolls(inActive);
    setActivePolls(active);

    console.log("All Polls : ", allPolls);
  }, [allPolls]);

  const handleCreatePoll = () => {
    setShowCreateForm(true);
  };

  const handleCloseForm = () => {
    setShowCreateForm(false);
    resetForm();
  };

  const handleAnalyticsCloseForm = () => {
    setShowAnalyticsForm(false);
  };

  const resetForm = () => {
    setNewPollQuestion("");
    setNewPollOptions(["", ""]);
  };

  const handleSavePoll = () => {
    const newArray = newPollOptions.map((option) => ({
      votes: 0,
      title: option,
    }));

    const pollObject = {
      CommunityID: communityID,
      Question: newPollQuestion,
      Options: newPollOptions.filter((option) => option.trim() !== ""),
      PollCloseDate: dateValue.$d.toString(),
      Opt: newArray,
    };

    PollDB.createPoll(pollObject).then(() => {
      setShowCreateForm(false);
      resetForm();
      PollDB.getPollFromCommunityID(communityID, setAllPolls);
    });
  };

  const handleChangeOption = (index, value) => {
    const options = [...newPollOptions];
    options[index] = value;
    setNewPollOptions(options);
  };

  const handleAddOption = () => {
    setNewPollOptions([...newPollOptions, ""]);
  };

  const handleRemoveOption = (index) => {
    const options = [...newPollOptions];
    options.splice(index, 1);
    setNewPollOptions(options);
  };

  const cardStyle = {
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    borderRadius: "8px",
    marginTop: "15px", // Add top margin
    marginBottom: "15px", // Add bottom margin
    position: "relative", // Ensure the card is a positioned container
  };

  const iconStyle = {
    position: "absolute",
    top: 8,
    right: 8,
  };

  return (
    <div className="mt-4 h-480">
      <h1 className="text-xxl relative my-4  text-black p-2">
        Active Polls
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
          onClick={handleCreatePoll}
          aria-label="create poll"
        >
          <AddIcon style={{ color: "white" }} />
        </IconButton>
      </h1>

      <div style={{ overflowX: "auto", whiteSpace: "nowrap", marginTop: 15 }}>
        {activePolls.length === 0 ? (
          <div className="mt-8">
            <center>You have no polls currently.</center>
          </div>
        ) : (
          <Grid container justifyContent="flex-start" spacing={2}>
            {activePolls.map((value) => (
              <Grid key={value.id} item xs={12} sm={6} md={4} lg={3}>
                <Card style={cardStyle}>
                  <IconButton
                    aria-label="delete poll"
                    style={{ ...iconStyle, backgroundColor: "tranparent" }}
                    onClick={() => console.log("Delete Poll")}
                  >
                    <DeleteIcon />
                  </IconButton>
                  <CardContent>
                    <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">
                      {value.Question}
                    </h3>

                    <ul className="w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                      {value.Opt.map((option, index) => (
                        <li
                          key={index}
                          className="w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600"
                        >
                          <div className="flex items-center ps-3">
                            <input
                              disabled
                              id="list-radio-license"
                              type="radio"
                              value=""
                              name="list-radio"
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                            />
                            <label
                              htmlFor="list-radio-license"
                              className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                            >
                              {option.title}
                            </label>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </div>

      <h1 className="text-xxl relative my-4  text-black p-2">Closed Polls</h1>

      <div style={{ overflowX: "auto", whiteSpace: "nowrap", marginTop: 15 }}>
        {inActivePolls.length === 0 ? (
          <div className="mt-8">
            <center>You have no Closed Polls currently.</center>
          </div>
        ) : (
          <Grid container justifyContent="flex-start" spacing={2}>
            {inActivePolls.map((value) => (
              <Grid key={value.id} item xs={12} sm={6} md={4} lg={3}>
                <Card style={cardStyle}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: "8px",
                      padding: "8px",
                    }}
                  >
                    <IconButton
                      aria-label="analytics"
                      style={{ backgroundColor: "transparent" }}
                      onClick={() => {
                        setAnalyticsPollPointer(value);
                        setShowAnalyticsForm(true);
                      }}
                    >
                      <AssessmentIcon />
                    </IconButton>
                    <IconButton
                      aria-label="delete poll"
                      style={{ backgroundColor: "transparent" }}
                      onClick={() => console.log("Delete Poll")}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                  <CardContent>
                    <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">
                      {value.Question}
                    </h3>

                    <ul className="w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                      {value.Opt.map((option, index) => (
                        <li
                          key={index}
                          className="w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600"
                        >
                          <div className="flex items-center ps-3">
                            <input
                              disabled
                              id="list-radio-license"
                              type="radio"
                              value=""
                              name="list-radio"
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                            />
                            <label
                              htmlFor="list-radio-license"
                              className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                            >
                              {option.title}
                            </label>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </div>

      <Dialog open={showCreateForm} onClose={handleCloseForm}>
        <DialogTitle>Create a New Poll</DialogTitle>
        <DialogContent>
          <DialogContentText>Enter your poll end date.</DialogContentText>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Select Date"
              value={dateValue}
              onChange={(newValue) => {
                setDateValue(newValue);
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
          <DialogContentText>
            Enter your poll question and options:
          </DialogContentText>

          <TextField
            autoFocus
            margin="dense"
            id="pollQuestion"
            label="Poll Question"
            fullWidth
            value={newPollQuestion}
            onChange={(e) => setNewPollQuestion(e.target.value)}
          />
          {newPollOptions.map((option, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <TextField
                margin="dense"
                id={`option${index}`}
                label={`Option ${index + 1}`}
                fullWidth
                value={option}
                onChange={(e) => handleChangeOption(index, e.target.value)}
              />
              {index > 1 && (
                <IconButton
                  aria-label="remove option"
                  onClick={() => handleRemoveOption(index)}
                  style={{ marginLeft: 10 }}
                >
                  <RemoveIcon />
                </IconButton>
              )}
            </div>
          ))}

          <IconButton
            aria-label="add option"
            onClick={handleAddOption}
            style={{ marginBottom: 10 }}
          >
            <AddIcon />
          </IconButton>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForm} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSavePoll} color="primary">
            Save Poll
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showAnalyticsForm}
        onClose={handleAnalyticsCloseForm}
        maxWidth="lg"
        fullWidth={true}
        sx={{
          "& .MuiDialog-paper": {
            width: "80%",
            maxWidth: "none",
          },
        }}
      >
        <DialogContent>
          <center>
            <PollAnalytics poll={analyticsPollPointer} />
          </center>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAnalyticsCloseForm} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default PollsHolder;
