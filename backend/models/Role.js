const mongoose = require("mongoose");

const RoleSchema = new mongoose.Schema({
  RoleName: {
    type: String,
    required: true,
  },
  RoleNum: {
    type: Number,
    required: true,
    unique: true, 
  },
});

const RoleModel = mongoose.model("Role", RoleSchema);

module.exports = RoleModel;
