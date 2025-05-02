const mongoose = require("mongoose");

const CustomerMainInformationSchema = new mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  familyName: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  sex: {
    type: String,
  },
  bornDate: {
    type: Date,
  },
  nation: {
    type: String,
  },
});

module.exports = mongoose.model(
  "CustomerMainInformation",
  CustomerMainInformationSchema
);
