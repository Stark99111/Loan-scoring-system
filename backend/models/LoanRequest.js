const mongoose = require("mongoose");

const LoanRequestSchema = new mongoose.Schema({
  Loan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "loan",
  },
  Customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
  },
  Scoring: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Scoring",
  },
  LoanAmount: {
    type: Number,
  },
  Term: {
    type: Number,
  },
  Interest: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const LoanRequestModel = mongoose.model("LoanRequest", LoanRequestSchema);
module.exports = LoanRequestModel;
