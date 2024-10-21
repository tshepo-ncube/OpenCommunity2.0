// Poll.js

// Importing necessary classes to establish relationships if needed

export class Poll {
  constructor(
    id,
    communityId,
    question,
    options = [],
    opt = [],
    pollCloseDate
  ) {
    this.id = id;
    this.communityId = communityId; // Reference to the Community this poll belongs to
    this.question = question;
    this.options = options; // Array of possible answers
    this.opt = opt; // Detailed options with titles and vote counts
    this.pollCloseDate = new Date(pollCloseDate); // Date when the poll closes
  }

  // Method to vote for an option by title
  vote(optionTitle) {
    const option = this.opt.find((o) => o.title === optionTitle);
    if (option) {
      option.votes += 1;
    } else {
      console.error("Option not found.");
    }
  }

  // Method to get the poll's current result
  getResults() {
    return this.opt.map((o) => ({
      title: o.title,
      votes: o.votes,
    }));
  }

  // Method to check if the poll is still open
  isOpen() {
    const now = new Date();
    return now < this.pollCloseDate;
  }

  // Method to add a new option to the poll
  addOption(optionTitle) {
    if (!this.options.includes(optionTitle)) {
      this.options.push(optionTitle);
      this.opt.push({ title: optionTitle, votes: 0 });
    } else {
      console.warn("Option already exists.");
    }
  }
}
