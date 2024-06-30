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
  };

  const handleSavePoll = () => {
    const pollObject = {
      CommunityID: communityID,
      Question: newPollQuestion,
      Options: newPollOptions.filter((option) => option.trim() !== ""),
    };

    PollDB.createPoll(pollObject).then(() => {
      setShowCreateForm(false);
      setNewPollQuestion("");
      setNewPollOptions(["", ""]);
      PollDB.getPollFromCommunityID(communityID, setAllPolls); // Refresh polls after creation
    });
  };

  const handleChangeOption = (index, value) => {
    const options = [...newPollOptions];
    options[index] = value;
    setNewPollOptions(options);
  };

  return (
    <div className="mt-4 h-480">
      <h1 className="text-xxl">Polls</h1>

      <Button variant="contained" color="primary" onClick={handleCreatePoll}>
        Create Poll
      </Button>

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
          <TextField
            margin="dense"
            id="option1"
            label="Option 1"
            fullWidth
            value={newPollOptions[0]}
            onChange={(e) => handleChangeOption(0, e.target.value)}
          />
          <TextField
            margin="dense"
            id="option2"
            label="Option 2"
            fullWidth
            value={newPollOptions[1]}
            onChange={(e) => handleChangeOption(1, e.target.value)}
          />
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
