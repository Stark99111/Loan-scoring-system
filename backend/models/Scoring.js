const mongoose = require("mongoose");

const ScoringSchema = new mongoose.Schema({
  scoring: {
    type: Number,
  },
  loanHistory: {
    type: Number,
  },
  paymentHistory: {
    type: Number,
  },
  availableLoanAmount: {
    type: Number,
  },
  loanHistoryLength: {
    type: Number,
  },
  DTI: {
    type: Number,
  },
});

module.exports = mongoose.model("Scoring", ScoringSchema);
