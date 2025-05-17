const mongoose = require("mongoose");

const CustomerAddressSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  city: {
    type: String,
  },
  district: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "category",
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
