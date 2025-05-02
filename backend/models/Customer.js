const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const CustomerSchema = new mongoose.Schema({
  idNumber: {
    type: String,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  AddressInformation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CustomerAddress",
  },
  Scoring: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Scoring",
  },
  CreditDatabase: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CreditDatabase",
    },
  ],
  SocialInsurance: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SocialInsurance",
    },
  ],
  CustomerMainInformation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CustomerMainInformation",
  },
  LoanInstitutionRequestHistory: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LoanInstitution",
    },
  ],
});

CustomerSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

const CustomerModel = mongoose.model("Customer", CustomerSchema);

module.exports = CustomerModel;
