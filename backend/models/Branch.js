const mongoose = require("mongoose");

const BranchSchema = new mongoose.Schema({
  BranchName: {
    type: String,
    required: true,
  },
  BranchNum: {
    type: Number,
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model("Branch", BranchSchema);
