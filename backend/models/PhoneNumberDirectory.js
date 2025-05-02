const mongoose = require("mongoose");

const PhoneNumberDirectorySchema = new mongoose.Schema({
  phoneNumber: {
    type: Number,
    required: true,
  },
  registrationNumber: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model(
  "PhoneNumberDirectory",
  PhoneNumberDirectorySchema
);
