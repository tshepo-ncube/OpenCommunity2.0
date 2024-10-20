import React, { useState, useEffect } from "react";
import PollDB from "../database/community/poll";
import dayjs from "dayjs";
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
import {
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  Delete as DeleteIcon,
  Assessment as AssessmentIcon,
} from "@mui/icons-material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PollAnalytics from "../_Components/PollAnalytics";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

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
  const [isCollapsed, setIsCollapsed] = useState(false);

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

  const [errors, setErrors] = useState({
    dateError: false,
    questionError: false,
    optionError: false,
  });

  const handleSavePoll = () => {
    let hasError = false;
    const newErrors = {
      dateError: false,
      questionError: false,
      optionError: false,
    };

    if (!dateValue) {
      newErrors.dateError = true;
      hasError = true;
    }

    if (!newPollQuestion.trim()) {
      newErrors.questionError = true;
      hasError = true;
    }

    if (
      newPollOptions.length < 2 ||
      newPollOptions.some((option) => !option.trim())
    ) {
      newErrors.optionError = true;
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      toast.error("Please fill all required fields.");
      return;
    }

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
      toast.success("Poll successfully created!");
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
    marginTop: "15px",
    marginBottom: "15px",
    position: "relative",
  };

  const iconStyle = {
    position: "absolute",
    top: 8,
    right: 8,
  };

  const containerStyle = {
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "20px",
    marginTop: "20px",
    backgroundColor: "#fff",
    position: "relative",
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div style={containerStyle}>
      <ToastContainer />

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1 className="text-xxl relative mb-2 text-black">Overall Polls
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
        <IconButton onClick={toggleCollapse} aria-label="collapse">
          {isCollapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
        </IconButton>
      </div>
      <hr />

      {!isCollapsed && (
        <>
          <h2 className="text-xl relative my-4 text-black p-2">
            Active Polls
          </h2>

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
                        style={{ ...iconStyle, backgroundColor: "transparent" }}
                        onClick={() => PollDB.deletePoll(value.id)}
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
                                  type="radio"
                                  value=""
                                  name="list-radio"
                                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                />
                                <label
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

          <h2 className="text-xl relative my-4 text-black p-2">Closed Polls</h2>
          <div style={{ overflowX: "auto", whiteSpace: "nowrap", marginTop: 15 }}>
            {inActivePolls.length === 0 ? (
              <div className="mt-8">
                <center>You have no Closed Polls currently.</center>
              </div>
            ) : (
              <Grid container justifyContent="flex-start" spacing={2}>
                {inActivePolls.slice(0, 5).map((value) => (
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
                          onClick={() => PollDB.deletePoll(value.id)}
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
                                  type="radio"
                                  value=""
                                  name="list-radio"
                                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                />
                                <label
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
        </>
      )}

<Dialog 
  open={showCreateForm} 
  onClose={handleCloseForm} 
  maxWidth="xs" 
  fullWidth={false} 
  sx={{ '& .MuiDialog-paper': { width: '90%', maxWidth: '400px' } }}
>
  <DialogTitle className="font-bold text-center">Create a New Poll</DialogTitle>
  <DialogContent>
    <DialogContentText style={{ marginBottom: 10 }}>
      Enter your poll end date.
    </DialogContentText>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label="Select Date"
        value={dateValue}
        onChange={(newValue) => {
          setDateValue(newValue);
        }}
        minDate={dayjs().add(1, "day")}
        renderInput={(params) => (
          <TextField
            {...params}
            error={errors.dateError}
            helperText={errors.dateError ? "Please select a date" : ""}
            fullWidth
            style={{ marginBottom: 10 }}
          />
        )}
      />
    </LocalizationProvider>

    <DialogContentText style={{ marginBottom: 10 }}>
      Enter your poll question and options:
    </DialogContentText>

    <TextField
      autoFocus
      // margin="dense"
      id="pollQuestion"
      label="Poll Question"
      fullWidth
      multiline
      minRows={2}
      value={newPollQuestion}
      onChange={(e) => setNewPollQuestion(e.target.value)}
      error={errors.questionError}
      helperText={errors.questionError ? "Poll question is required" : ""}
      sx={{ maxWidth: '350px', mx: 'auto', marginBottom: 2 }}
    />

    {newPollOptions.map((option, index) => (
      <div key={index} style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
        <TextField
          margin="dense"
          label={`Option ${index + 1}`}
          fullWidth
          value={option}
          onChange={(e) => handleChangeOption(index, e.target.value)}
          error={errors.optionError && !option.trim()}
          helperText={errors.optionError && !option.trim() ? "Option is required" : ""}
        />
        {index > 1 && (
          <IconButton onClick={() => handleRemoveOption(index)}>
            <RemoveIcon />
          </IconButton>
        )}
      </div>
    ))}

    <Button
      onClick={handleAddOption}
      variant="contained"
      sx={{
        border: "ActiveBorder",
        backgroundColor: "#999999",
        color: "white",
        '&:hover': {
          backgroundColor: "#d4cfcf",
        },
        marginBottom: 10,
      }}
    >
      Add Option
    </Button>
  </DialogContent>
  <DialogActions>
    <Button
      onClick={handleCloseForm}
      variant="contained"
      sx={{
        backgroundColor: "red",
        color: "white",
        '&:hover': {
          backgroundColor: "#d32f2f",
        },
      }}
    >
      Cancel
    </Button>
    <Button
      onClick={handleSavePoll}
      variant="contained"
      sx={{
        backgroundColor: "#BCD727",
        color: "white",
        '&:hover': {
          backgroundColor: "#A6B320",
        },
      }}
    >
      Create Poll
    </Button>
  </DialogActions>
</Dialog>



      <Dialog open={showAnalyticsForm} onClose={handleAnalyticsCloseForm} maxWidth="lg" fullWidth>
        <DialogContent>
          <PollAnalytics poll={analyticsPollPointer} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAnalyticsCloseForm} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default PollsHolder;
