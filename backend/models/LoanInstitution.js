const mongoose = require("mongoose");

const LoanInstitutionSchema = new mongoose.Schema({
  loanInstitution: {
    type: String,
  },
  desiredAmount: {
    type: Number,
  },
  currency: {
    type: String,
  },
  interest: {
    type: Number,
  },
  term: {
    type: Number,
  },
  date: {
    type: Date,
  },
  isGranted: {
    type: Boolean,
  },
  desc: {
    type: String,
  },
});

module.exports = mongoose.model("LoanInstitution", LoanInstitutionSchema);
