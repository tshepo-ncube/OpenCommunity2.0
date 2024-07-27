import React, { useState, useEffect } from "react";
import PollDB from "../../database/community/poll";
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
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import IconButton from "@mui/material/IconButton";
import { green } from "@mui/material/colors";
import PollAnalytics from "../_Components/PollAnalytics";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { CardActions } from "@mui/material";

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
    console.log("All Polls : ", allPolls);

    const currentDate = new Date();

    const active = allPolls.filter(
      (poll) => new Date(poll.PollCloseDate) > currentDate
    );
    const inActive = allPolls.filter(
      (poll) => currentDate > new Date(poll.PollCloseDate)
    );
    console.log("InActive Polls: ", inActivePolls);
    console.log("ActivePolls : ", activePolls);
    setInActivePolls(inActive);
    setActivePolls(active);
  }, [allPolls]);

  useEffect(() => {
    console.log("InActive Polls: ", inActivePolls);
  }, [inActivePolls]);

  useEffect(() => {
    console.log("Active Polls: ", activePolls);
  }, [activePolls]);

  const handleCreatePoll = () => {
    setShowCreateForm(true);
  };

  const handleCloseForm = () => {
    setShowCreateForm(false);
    resetForm();
  };

  const handleAnalyticsCloseForm = () => {
    setShowAnalyticsForm(false);
    //resetForm();
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

    console.log(pollObject);

    console.log(typeof dateValue.$d);

    console.log(dateValue.$d);

    console.log(dateValue);

    console.log("Date To String : ", dateValue.$d.toString());

    PollDB.createPoll(pollObject).then(() => {
      setShowCreateForm(false);
      resetForm();
      PollDB.getPollFromCommunityID(communityID, setAllPolls); // Refresh polls after creation
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

  return (
    <div className="mt-4 h-480">
      <h1 className="text-xxl relative">
        Active Polls
        <IconButton
          sx={{
            borderRadius: "50%",
            backgroundColor: green[500],
            color: "white",
            marginLeft: 2,
            "&:hover": {
              backgroundColor: green[700],
            },
          }}
          onClick={handleCreatePoll}
          aria-label="create poll"
        >
          <AddIcon />
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
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {value.Question}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {value.Opt.map((option, index) => (
                        <p key={index} className="text-gray-700">
                          {index + 1}. {option.title}
                        </p>
                      ))}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button>Analytics</Button>
                    <Button color="error">Delete Poll</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </div>

      <h1 className="text-xxl relative">
        Closed Polls
        {/* <IconButton
          sx={{
            borderRadius: "50%",
            backgroundColor: green[500],
            color: "white",
            marginLeft: 2,
            "&:hover": {
              backgroundColor: green[700],
            },
          }}
          onClick={handleCreatePoll}
          aria-label="create poll"
        >
          <AddIcon />
        </IconButton> */}
      </h1>

      <div style={{ overflowX: "auto", whiteSpace: "nowrap", marginTop: 15 }}>
        {inActivePolls.length === 0 ? (
          <div className="mt-8">
            <center>You have no Closed Polls currently.</center>
          </div>
        ) : (
          <Grid container justifyContent="flex-start" spacing={2}>
            {inActivePolls.map((value) => (
              <Grid key={value.id} item xs={12} sm={6} md={4} lg={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {value.Question}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {value.Opt.map((option, index) => (
                        <p key={index} className="text-gray-700">
                          {index + 1}. {option.title}
                        </p>
                      ))}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      onClick={() => {
                        setAnalyticsPollPointer(value);
                        setShowAnalyticsForm(true);
                      }}
                    >
                      Analytics
                    </Button>
                    <Button color="error">Delete Poll</Button>
                  </CardActions>
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
        maxWidth="lg" // You can set this to 'sm', 'md', 'lg', 'xl' as per your requirement
        fullWidth={true}
        sx={{
          "& .MuiDialog-paper": {
            width: "80%", // Adjust the width as per your requirement
            maxWidth: "none",
          },
        }}
      >
        {/* <DialogTitle>{analyticsPollPointer.Question}</DialogTitle> */}
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
