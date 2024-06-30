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

function PollsHolder({ communityID }) {
  const [allPolls, setAllPolls] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPollQuestion, setNewPollQuestion] = useState("");
  const [newPollOptions, setNewPollOptions] = useState(["", ""]);

  useEffect(() => {
    PollDB.getPollFromCommunityID(communityID, setAllPolls);
  }, [communityID]);

  const handleCreatePoll = () => {
    setShowCreateForm(true);
  };

  const handleCloseForm = () => {
    setShowCreateForm(false);
    resetForm();
  };

  const resetForm = () => {
    setNewPollQuestion("");
    setNewPollOptions(["", ""]);
  };

  const handleSavePoll = () => {
    const pollObject = {
      CommunityID: communityID,
      Question: newPollQuestion,
      Options: newPollOptions.filter((option) => option.trim() !== ""),
    };

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
        Polls
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
        {allPolls.length === 0 ? (
          <div className="mt-8">
            <center>You have no polls currently.</center>
          </div>
        ) : (
          <Grid container justifyContent="flex-start" spacing={2}>
            {allPolls.map((value) => (
              <Grid key={value.id} item xs={12} sm={6} md={4} lg={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {value.Question}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {value.Options.map((option, index) => (
                        <p key={index} className="text-gray-700">
                          {index + 1}. {option}
                        </p>
                      ))}
                    </Typography>
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
    </div>
  );
}

export default PollsHolder;
