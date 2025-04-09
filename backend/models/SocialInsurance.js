const mongoose = require("mongoose");

const SocialInsuranceSchema = new mongoose.Schema({
  amount: {
    type: Number,
  },
  institute: {
    type: String,
  },
  paidDate: {
    type: Date,
  },
});

const SocialInsuranceModel = mongoose.model(
  "SocialInsurance",
  SocialInsuranceSchema
);

module.exports = SocialInsuranceModel;
