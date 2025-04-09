const mongoose = require("mongoose");

const RequirementSchema = new mongoose.Schema({
  requirementName: {
    type: String,
    required: true,
  },
  requirementCode: {
    type: String,
  },
});

const RequirementModel = mongoose.model("requirement", RequirementSchema);

module.exports = RequirementModel;
