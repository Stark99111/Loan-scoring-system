const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema({
  ovog: {
    type: String,
    required: true,
  },
  ner: {
    type: String,
    required: true,
  },
  urgiinOvog: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  sex: {
    type: String,
  },
  bornDate: {
    type: Date,
  },
  idNumber: {
    type: String,
  },
  nation: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  AddressInformation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CustomerAddress",
  },
  CreditDatabase: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CreditDatabase",
  },
  SocialInsurance: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SocialInsurance",
    },
  ],
});

const CustomerModel = mongoose.model("Customer", CustomerSchema);

module.exports = CustomerModel;
