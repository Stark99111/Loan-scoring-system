const mongoose = require("mongoose");

const ConditionSchema = new mongoose.Schema({
  conditionName: {
    type: String,
    requirement: true,
  },
  Description: {
    type: String,
    required: true,
  },
});

const ConditionModel = mongoose.model("condition", ConditionSchema);

module.exports = ConditionModel;
