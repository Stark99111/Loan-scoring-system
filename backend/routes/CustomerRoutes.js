const express = require("express");
const router = express.Router();
const CustomerAddressModel = require("../models/CustomerAddress");
const CustomerModel = require("../models/Customer");
const CreditDatabaseModel = require("../models/CreditDatabase");
const SocialInsuranceModel = require("../models/SocialInsurance");

router.get("/getAll", async (req, res) => {
  try {
    const customers = await CustomerModel.find()
      .populate("AddressInformation") // Populate AddressInformation
      .populate("CreditDatabase") // Populate CreditDatabase
      .populate({
        path: "SocialInsurance", // Populate SocialInsurance array
        model: "SocialInsurance",
      });
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch customers" });
  }
});

router.get("/getById/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const customer = await CustomerModel.findById(id);
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch customer" });
  }
});

router.post("/registerCustomer", async (req, res) => {
  const {
    CustomerAddressId,
    CreditDatabaseId,
    ovog,
    ner,
    urgiinOvog,
    email,
    phone,
    sex,
    bornDate,
    idNumber,
    nation,
  } = req.body;

  // Validate required fields
  if (!ner || !email || !phone) {
    return res
      .status(400)
      .json({ error: "Name, email, and phone are required" });
  }

  try {
    if (CustomerAddressId) {
      const customerAddress = await CustomerAddressModel.findById(
        CustomerAddressId
      );
      if (!customerAddress) {
        return res.status(400).json({ error: "CustomerAddress not found" });
      }
    }
    if (CreditDatabaseId) {
      const creditDatabase = await CreditDatabaseModel.findById(
        CreditDatabaseId
      );
      if (!creditDatabase) {
        return res.status(400).json({ error: "creditDatabase not found" });
      }
    }
    // Create a new customer instance
    const newCustomer = new CustomerModel({
      AddressInformation: CustomerAddressId,
      CreditDatabase: CreditDatabaseId,
      ovog,
      ner,
      urgiinOvog,
      email,
      phone,
      sex,
      bornDate,
      idNumber,
      nation,
    });

    // Save to the database
    await newCustomer.save();
    res.status(201).json(newCustomer);
  } catch (error) {
    if (error.code === 11000) {
      // Handle unique constraint error (duplicate email)
      return res.status(400).json({ error: "Email already exists" });
    }
    res.status(500).json({ error: "Failed to register customer" });
  }
});

router.get("/getAllAddress", async (req, res) => {
  try {
    const addresses = await CustomerAddressModel.find();
    res.status(200).json(addresses);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch addresses" });
  }
});

router.get("/getCusAssById/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const address = await CustomerAddressModel.findById(id).populate(
      "customerId"
    );
    if (!address) {
      return res.status(404).json({ error: "Address not found" });
    }
    res.status(200).json(address);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch address" });
  }
});

router.post("/registerCustomerAddress", async (req, res) => {
  const { country, city, district, street, number, typeOfSeat } = req.body;

  // Validate required fields
  if (!country || !district) {
    return res
      .status(400)
      .json({ error: " country, and district are required" });
  }

  try {
    // Create a new address
    const newAddress = new CustomerAddressModel({
      country,
      city,
      district,
      street,
      number,
      typeOfSeat,
    });

    // Save the address to the database
    await newAddress.save();
    res.status(201).json(newAddress);
  } catch (error) {
    res.status(500).json({ error: "Failed to create address" });
  }
});

router.get("/getAllCreditDatabase", async (req, res) => {
  try {
    const credits = await CreditDatabaseModel.find();
    res.status(200).json(credits);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch credit records" });
  }
});

router.post("/createCreditDatabase", async (req, res) => {
  const {
    currency,
    firstLoanAmount,
    interest,
    payDate,
    paidDate,
    loanInstitution,
    desc,
  } = req.body;

  // Validate required fields
  if (!currency || !firstLoanAmount || !payDate || !loanInstitution) {
    return res.status(400).json({
      error:
        "currency, firstLoanAmount, payDate, and loanInstitution are required",
    });
  }

  try {
    // Create a new credit record
    const newCredit = new CreditDatabaseModel({
      currency,
      firstLoanAmount,
      interest,
      payDate,
      paidDate,
      loanInstitution,
      desc,
    });

    // Save to the database
    await newCredit.save();
    res.status(201).json(newCredit);
  } catch (error) {
    res.status(500).json({ error: "Failed to create credit record" });
  }
});

router.post("/getCustomerByInfo", async (req, res) => {
  try {
    const { name, idNumber, phoneNumber } = req.body;
    const credits = await CustomerModel.findOne({
      ner: name,
      idNumber: idNumber,
      phone: phoneNumber,
    })
      .populate("AddressInformation") // Populate AddressInformation
      .populate("CreditDatabase") // Populate CreditDatabase
      .populate({
        path: "SocialInsurance", // Populate SocialInsurance array
        model: "SocialInsurance",
      });
    res.status(200).json(credits);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch credit records" });
  }
});

router.put("/addSocialInsurance/:id", async (req, res) => {
  const { id } = req.params;
  const { socialInsuranceIds } = req.body;

  if (!Array.isArray(socialInsuranceIds)) {
    return res
      .status(400)
      .json({ error: "socialInsuranceIds must be an array" });
  }

  try {
    // Find the customer and update SocialInsurance array
    const updatedCustomer = await CustomerModel.findByIdAndUpdate(
      id,
      { $addToSet: { SocialInsurance: { $each: socialInsuranceIds } } }, // Prevent duplicate entries
      { new: true } // Return the updated document
    );

    if (!updatedCustomer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.status(200).json(updatedCustomer);
  } catch (error) {
    res.status(500).json({ error: "Failed to add SocialInsurance IDs" });
  }
});

router.get("/getAllSocialInsurance", async (req, res) => {
  try {
    const socialInsurances = await SocialInsuranceModel.find();
    res.status(200).json(socialInsurances);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch social insurance records" });
  }
});

router.post("/registerSocailInsurance", async (req, res) => {
  const { amount, institute, paidDate } = req.body;

  // Validate required fields
  if (!amount || !institute || !paidDate) {
    return res
      .status(400)
      .json({ error: "amount, institute, and paidDate are required" });
  }

  try {
    // Create a new social insurance record
    const newSocialInsurance = new SocialInsuranceModel({
      amount,
      institute,
      paidDate,
    });

    // Save the record to the database
    await newSocialInsurance.save();
    res.status(201).json(newSocialInsurance);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to register social insurance record" });
  }
});

router.get("/getAllById/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Find the customer by ID and populate related models
    const customer = await CustomerModel.findById(id)
      .populate("AddressInformation") // Populate AddressInformation
      .populate("CreditDatabase") // Populate CreditDatabase
      .populate({
        path: "SocialInsurance", // Populate SocialInsurance array
        model: "SocialInsurance",
      });

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch customer information" });
  }
});

module.exports = router;
