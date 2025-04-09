const mongoose = require("mongoose");

const CreditDatabaseSchema = new mongoose.Schema({
  currency: {
    type: String,
  },
  firstLoanAmount: {
    type: Number,
  },
  interest: {
    type: Number,
  },
  payDate: {
    type: Date,
  },
  paidDate: {
    type: Date,
  },
  loanInstitution: {
    type: String,
  },
  desc: {
    type: String,
  },
});

const CreditDatabaseModel = mongoose.model(
  "CreditDatabase",
  CreditDatabaseSchema
);

module.exports = CreditDatabaseModel;
