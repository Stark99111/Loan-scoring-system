const mongoose = require("mongoose");

const LoanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  categories: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "category",
  },
  requirements: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "requirement",
    },
  ],
  conditions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "condition",
    },
  ],
  status: {
    type: Boolean,
  },
  description: {
    type: String,
    required: true,
  },
});

const LoanModel = mongoose.model("loan", LoanSchema);

module.exports = LoanModel;
