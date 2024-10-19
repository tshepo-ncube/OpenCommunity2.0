"use client";
import { useState } from "react";

const PollComponent = () => {
  // Sample Poll Data
  const [allPolls, setAllPolls] = useState([
    {
      id: 1,
      Question: "What beverage should we serve?",
      Opt: [
        { title: "Different soda flavours", votes: 10 },
        { title: "Fresh juice", votes: 18 },
        { title: "Tea, hot chocolate", votes: 8 },
      ],
      selected_option: null, // Tracks the selected option title for each poll
    },
  ]);

  // Function to handle poll option selection
  const handlePollOptionSelection = (pollId, selectedOptionTitle) => {
    setAllPolls((prevPolls) =>
      prevPolls.map((poll) => {
        if (poll.id === pollId) {
          // If user has already selected an option, we need to decrement its votes
          const previousOptionTitle = poll.selected_option;
          let updatedOptions = poll.Opt.map((opt) => {
            if (opt.title === previousOptionTitle) {
              return { ...opt, votes: opt.votes - 1 }; // Decrement vote count for previous option
            }
            return opt;
          });

          // Increment the vote count for the newly selected option
          updatedOptions = updatedOptions.map((opt) => {
            if (opt.title === selectedOptionTitle) {
              return { ...opt, votes: opt.votes + 1 }; // Increment vote count for new option
            }
            return opt;
          });

          return {
            ...poll,
            Opt: updatedOptions,
            selected_option: selectedOptionTitle, // Update the selected option
          };
        }
        return poll;
      })
    );
  };

  // Function to calculate the total number of votes for a poll
  const calculateTotalVotes = (pollOptions) =>
    pollOptions.reduce((total, option) => total + option.votes, 0);

  return (
    <div>
      <div className="flex flex-wrap gap-4 justify-start md:flex-nowrap md:space-x-6">
        {allPolls.length > 0 ? (
          allPolls.map((poll, index) => (
            <div
              key={index}
              className="p-4 bg-white shadow-lg rounded-md max-w-xs w-full"
              style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" }}
            >
              <h3 className="text-xl font-semibold mb-4">{poll.Question}</h3>
              <ul>
                {poll.Opt.map((poll_option, poll_option_index) => {
                  const totalVotes = calculateTotalVotes(poll.Opt);
                  const percentage =
                    totalVotes > 0
                      ? Math.round((poll_option.votes / totalVotes) * 100)
                      : 0;

                  return (
                    <div key={poll_option_index} className="my-4">
                      <div className="flex items-center mb-1">
                        <input
                          type="radio"
                          name={`poll-${poll.id}`}
                          id={`poll-${poll.id}-opt-${poll_option_index}`}
                          className="mr-2"
                          onChange={() =>
                            handlePollOptionSelection(
                              poll.id,
                              poll_option.title
                            )
                          }
                          checked={poll.selected_option === poll_option.title}
                        />
                        <label
                          htmlFor={`poll-${poll.id}-opt-${poll_option_index}`}
                          className="text-sm"
                        >
                          {poll_option.title}
                        </label>
                      </div>
                      <div className="relative w-full">
                        {/* Vote Count on top of the progress bar, aligned to the right */}
                        <span className="absolute top-[-20px] right-0 text-gray-600 text-xs">
                          {poll_option.votes} Votes
                        </span>
                        <div
                          className="bg-gray-200 w-full rounded-full h-3 overflow-hidden"
                          style={{
                            position: "relative",
                          }}
                        >
                          <div
                            className="h-3 rounded-full"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: "#8BA014", // Changed to the requested color
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </ul>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600 mt-4">No polls available</p>
        )}
      </div>
    </div>
  );
};

export default PollComponent;
