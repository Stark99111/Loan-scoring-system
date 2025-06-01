const express = require("express");
const router = express.Router();
const LoanRequestModel = require("../models/LoanRequest");
const CustomerModel = require("../models/Customer");
const LoanModel = require("../models/Loan");
const moment = require("moment-timezone");

router.get("/loanRequests/:customerId", async (req, res) => {
  try {
    const { customerId } = req.params;

    const loanRequests = await LoanRequestModel.find({ Customer: customerId })
      .populate({
        path: "Loan",
        populate: [{ path: "bankCategories" }, { path: "loanCategories" }],
      })
      .select("-image")
      .populate("Customer");

    res.status(200).json(loanRequests);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/registerLoanRequest", async (req, res) => {
  try {
    const { customerId, loanId, term, int, amount } = req.body;

    // Validate customer
    const customer = await CustomerModel.findById(customerId);
    if (!customer) {
      return res.status(400).json({ message: "Customer not found" });
    }

    // Validate loan
    const loan = await LoanModel.findById(loanId);
    if (!loan) {
      return res.status(400).json({ message: "Loan not found" });
    }

    // Check for existing loan request
    const registeredLoanRequest = await LoanRequestModel.findOne({
      Customer: customer._id,
      Loan: loan._id,
    });

    if (
      registeredLoanRequest &&
      registeredLoanRequest.isVerification === true
    ) {
      return res.status(200).json({
        message: "Loan request already exists for this customer and loan",
        request: registeredLoanRequest,
      });
    }

    // Create new loan request
    const newLoanRequest = new LoanRequestModel({
      Customer: customer._id,
      Loan: loan._id,
      LoanAmount: amount,
      Term: term,
      Interest: int,
      createdAt: moment().tz("Asia/Ulaanbaatar").toDate(),
    });

    await newLoanRequest.save();
    return res.status(200).json(newLoanRequest);
  } catch (e) {
    console.error("Error in registerLoanRequest:", e);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/getAll", async (req, res) => {
  try {
    const loanRequests = await LoanRequestModel.find()
      .populate({
        path: "Loan",
        select: "-image",
        populate: [{ path: "bankCategories" }, { path: "loanCategories" }],
      })
      .populate({
        path: "Customer",
        populate: [
          {
            path: "AddressInformation",
            populate: [{ path: "district" }],
          },
          { path: "CreditDatabase" },
          { path: "SocialInsurance" },
          { path: "CustomerMainInformation" },
          { path: "SocialInsurance" },
        ],
      })
      .populate("Scoring"); // ✅ correct method
    const filtered = loanRequests.filter((item) => item.isVerification);

    res.status(200).json(filtered);
  } catch (e) {
    console.error("Error in fetch loan requests", e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/isVerification/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const loanRequest = await LoanRequestModel.findById(id);

    if (!loanRequest) {
      return res.status(400).json({ message: "LoanRequest not found" });
    }
    loanRequest.isVerification = true;
    await loanRequest.save();

    return res.status(200).json(loanRequest);
  } catch (e) {
    console.error("Error in update loan request", e);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
