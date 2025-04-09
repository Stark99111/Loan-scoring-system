const mongoose = require("mongoose");

const CustomerAddressSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
    unique: true,
  },
  city: {
    type: String,
  },
  district: {
    type: String,
    required: true,
  },
  street: {
    type: String,
  },
  number: {
    type: String,
  },
  typeOfSeat: {
    type: String,
  },
});

const CustomerAddressModel = mongoose.model(
  "CustomerAddress",
  CustomerAddressSchema
);

module.exports = CustomerAddressModel;
