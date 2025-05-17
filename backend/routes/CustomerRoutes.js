const express = require("express");
const router = express.Router();
const CustomerAddressModel = require("../models/CustomerAddress");
const CustomerModel = require("../models/Customer");
const CreditDatabaseModel = require("../models/CreditDatabase");
const SocialInsuranceModel = require("../models/SocialInsurance");
const CustomerMainInformationModel = require("../models/CustomerMainInformation");
const DirectoryModel = require("../models/PhoneNumberDirectory");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Scoring = require("../models/Scoring");
const CategoryModel = require("../models/Category");
const LoanRequestModel = require("../models/LoanRequest");
const ScoringModel = require("../models/Scoring");

router.get("/getAll", async (req, res) => {
  try {
    const customers = await CustomerModel.find()
      .populate("AddressInformation")
      .populate("CreditDatabase")
      .populate("SocialInsurance")
      .populate("CustomerMainInformation");

    res.status(200).json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch customers", details: error.message });
  }
});

router.get("/getById/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const populatedCustomer = await CustomerModel.findById(id)
      .populate("AddressInformation")
      .populate("CreditDatabase")
      .populate("SocialInsurance")
      .populate("CustomerMainInformation");
    if (!populatedCustomer) {
      return res.status(200).json(null);
    }

    return res.status(200).json(populatedCustomer);
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
  try {
    const { id, country, city, district, street, number, typeOfSeat } =
      req.body;

    if (!district) {
      return res.status(400).json({ error: "District is required" });
    }

    // Category шалгах
    const dist = await CategoryModel.findById(district);
    if (!dist) {
      return res.status(404).json({ error: "District not found" });
    }

    if (id) {
      // Хаяг шинэчлэх
      const customerAddress = await CustomerAddressModel.findById(id);
      if (!customerAddress) {
        return res.status(404).json({ error: "Customer address not found" });
      }

      customerAddress.country = country || customerAddress.country;
      customerAddress.city = city || customerAddress.city;
      customerAddress.district = dist._id;
      customerAddress.street = street || customerAddress.street;
      customerAddress.number = number || customerAddress.number;
      customerAddress.typeOfSeat = typeOfSeat || customerAddress.typeOfSeat;

      await customerAddress.save();
      return res.status(200).json(customerAddress);
    } else {
      // Хаяг шинээр үүсгэх
      const newAddress = new CustomerAddressModel({
        country,
        city,
        district: dist._id,
        street,
        number,
        typeOfSeat,
      });

      await newAddress.save();
      return res.status(201).json(newAddress);
    }
  } catch (error) {
    console.error("Error in registerCustomerAddress:", error);
    res.status(500).json({ error: "Failed to create or update address" });
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
  const { currency, firstLoanAmount, interest, payDate, paidDate, desc } =
    req.body;

  // Validate required fields
  if (!currency || !firstLoanAmount || !payDate) {
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

router.post("/registerSocialInsurance", async (req, res) => {
  const { id, records } = req.body;

  if (!id || !Array.isArray(records) || records.length === 0) {
    return res
      .status(400)
      .json({ error: "id and non-empty records array are required" });
  }

  try {
    const customer = await CustomerModel.findById(id);
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    const socialInsuranceDocs = [];

    for (const record of records) {
      const { amount, institute, paidDate, salaryAmount, instituteCode } =
        record;

      if (!amount || !institute || !paidDate) {
        return res.status(400).json({
          error: "Each record must include amount, institute, and paidDate",
        });
      }

      // Optionally validate date format:
      if (isNaN(Date.parse(paidDate))) {
        return res
          .status(400)
          .json({ error: `Invalid paidDate format: ${paidDate}` });
      }

      const newSocialInsurance = new SocialInsuranceModel({
        amount,
        institute,
        paidDate: new Date(paidDate),
        salaryAmount,
        instituteCode,
      });

      await newSocialInsurance.save();
      socialInsuranceDocs.push(newSocialInsurance._id);
    }

    // Append new social insurance IDs instead of replacing (optional)
    if (!Array.isArray(customer.SocialInsurance)) {
      customer.SocialInsurance = [];
    }
    customer.SocialInsurance.push(...socialInsuranceDocs);

    await customer.save();

    res.status(201).json({
      message: "Social insurance records registered",
      records: socialInsuranceDocs,
    });
  } catch (error) {
    console.error("Error registering social insurance:", error);
    res
      .status(500)
      .json({ error: "Failed to register social insurance records" });
  }
});

router.get("/getAllById/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Find the customer by ID and populate related models
    const customer = await CustomerModel.findById(id)
      .populate({
        path: "AddressInformation",
        populate: {
          path: "district",
          model: "category",
        },
      })
      .populate("CreditDatabase")
      .populate("SocialInsurance")
      .populate("CustomerMainInformation");

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    return res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch customer information" });
  }
});

router.post("/register", async (req, res) => {
  try {
    const customer = req.body;

    if (!customer.idNumber || !customer.phone || !customer.password) {
      return res
        .status(400)
        .json({ message: "Missing required fields", errorCode: 1002 });
    }

    const directory = await DirectoryModel.findOne({
      registrationNumber: customer.idNumber,
      phoneNumber: customer.phone,
    });

    if (!directory) {
      return res.status(400).json({
        error: "Register number and phone number do not match",
        errorCode: 1004,
      });
    }

    const existed = await CustomerModel.findOne({
      idNumber: customer.idNumber,
      phone: customer.phone,
    });

    if (existed) {
      return res
        .status(409)
        .json({ error: "User already registered", errorCode: 1001 });
    }

    const newCustomer = new CustomerModel({
      idNumber: customer.idNumber,
      phone: customer.phone,
      createdAt: new Date(),
      password: customer.password,
    });

    const savedCustomer = await newCustomer.save();
    const token = jwt.sign(
      {
        id: savedCustomer._id,
        idNumber: savedCustomer.idNumber,
        phoneNumber: savedCustomer.phoneNumber,
      },
      process.env.JWT_SECRET, // Replace with a secure secret key
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: savedCustomer.idNumber,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to register customer" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;

    if (!phoneNumber || !password) {
      return res
        .status(400)
        .json({ message: "Missing required fields", errorCode: 1002 });
    }

    const existedCustomer = await CustomerModel.findOne({ phone: phoneNumber });

    if (!existedCustomer) {
      return res
        .status(404)
        .json({ message: "Phone number not found", errorCode: 1003 });
    }

    if (!existedCustomer.password) {
      return res
        .status(500)
        .json({ message: "Password not set for this user", errorCode: 1005 });
    }

    const isPasswordMatch = await bcrypt.compare(
      password,
      existedCustomer.password
    );

    if (!isPasswordMatch) {
      return res
        .status(401)
        .json({ message: "Invalid password", errorCode: 1004 });
    }

    const token = jwt.sign(
      {
        id: existedCustomer._id,
        idNumber: existedCustomer.idNumber,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      userId: existedCustomer._id,
      user: existedCustomer.idNumber,
    });
  } catch (e) {
    console.error("Login error:", e);
    return res.status(500).json({ error: "Failed to login", errorCode: 500 });
  }
});

router.post("/registerCustomerMainInformation", async (req, res) => {
  try {
    const customerData = req.body;

    const customer = await CustomerModel.findById(customerData._id);
    if (!customer) {
      return res.status(400).json({ error: "Customer not found!" });
    }

    // AddressInformation
    if (customerData.AddressInformation) {
      if (customer.AddressInformation) {
        // Only update the fields inside AddressInformation
        await CustomerAddressModel.findByIdAndUpdate(
          customer.AddressInformation._id, // Ensure you're passing the _id of the sub-document
          customerData.AddressInformation, // Update fields
          { new: true }
        );
      } else {
        const addressDoc = await CustomerAddressModel.create(
          customerData.AddressInformation
        );
        customer.AddressInformation = addressDoc._id;
      }
    }

    // CreditDatabase
    if (
      Array.isArray(customerData.CreditDatabase) &&
      customerData.CreditDatabase.length
    ) {
      const creditIds = [];

      for (const credit of customerData.CreditDatabase) {
        if (credit._id) {
          // Update existing
          const updatedCredit = await CreditDatabaseModel.findByIdAndUpdate(
            credit._id,
            credit,
            { new: true }
          );
          creditIds.push(updatedCredit._id);
        } else {
          // Create new
          const createdCredit = await CreditDatabaseModel.create(credit);
          creditIds.push(createdCredit._id);
        }
      }

      customer.CreditDatabase = creditIds;
    }

    // SocialInsurance
    if (Array.isArray(customerData.SocialInsurance)) {
      const insuranceIds = [];
      for (const insurance of customerData.SocialInsurance) {
        if (insurance._id) {
          const updated = await SocialInsuranceModel.findByIdAndUpdate(
            insurance._id,
            insurance,
            { new: true }
          );
          insuranceIds.push(updated._id);
        } else {
          const created = await SocialInsuranceModel.create(insurance);
          insuranceIds.push(created._id);
        }
      }
      customer.SocialInsurance = insuranceIds;
    }

    // CustomerMainInformation
    if (customerData.CustomerMainInformation) {
      if (customer.CustomerMainInformation) {
        await CustomerMainInformationModel.findByIdAndUpdate(
          customer.CustomerMainInformation,
          customerData.CustomerMainInformation,
          { new: true }
        );
      } else {
        const mainInfo = await CustomerMainInformationModel.create(
          customerData.CustomerMainInformation
        );
        customer.CustomerMainInformation = mainInfo._id;
      }
    }

    await customer.save();

    const populatedCustomer = await CustomerModel.findById(customer._id)
      .populate("AddressInformation")
      .populate("CreditDatabase")
      .populate("SocialInsurance")
      .populate("CustomerMainInformation");

    return res.status(200).json(populatedCustomer);
  } catch (e) {
    console.error("Error updating customer main information:", e);
    return res.status(500).json({ error: "Internal server error" });
  }
});

function calculateScoringByCustomerMainInfo(customer) {
  let workYearsScore = 0;
  let education = 0;
  let distructAddress = 0;
  let isMarriage = customer.CustomerMainInformation?.isMarriage ? 1 : 0;
  let ageScore = 0;

  // Work years
  if (customer.SocialInsurance && customer.SocialInsurance.length > 0) {
    let firstDate = new Date(customer.SocialInsurance[0].paidDate);

    customer.SocialInsurance.forEach((item) => {
      const paidDate = new Date(item.paidDate);
      if (paidDate < firstDate) {
        firstDate = paidDate;
      }
    });

    const now = new Date();
    const diffInMilliseconds = now - firstDate;
    const diffInYears = diffInMilliseconds / (1000 * 60 * 60 * 24 * 365.25);

    if (diffInYears > 15) {
      workYearsScore = 4;
    } else if (diffInYears > 10) {
      workYearsScore = 3;
    } else if (diffInYears > 5) {
      workYearsScore = 2;
    } else if (diffInYears > 0) {
      workYearsScore = 1;
    }
  }

  // Education
  const edu = customer.CustomerMainInformation?.education;
  if (edu) {
    switch (edu.toLowerCase()) {
      case "доктор":
        education = 5;
        break;
      case "мастер":
        education = 4;
        break;
      case "баклавр":
        education = 3;
        break;
      case "бүрэн дунд":
        education = 2;
        break;
      default:
        education = 1;
    }
  }

  // District
  const district = customer.AddressInformation?.district?.Value;
  if (district) {
    switch (district) {
      case "A":
        distructAddress = 3;
        break;
      case "B":
        distructAddress = 2;
        break;
      case "C":
        distructAddress = 1;
        break;
      default:
        distructAddress = 0;
    }
  }

  // Age
  let age = 0;
  if (customer.CustomerMainInformation?.bornDate) {
    const birthDate = new Date(customer.CustomerMainInformation.bornDate);
    const today = new Date();
    age =
      today.getFullYear() -
      birthDate.getFullYear() -
      (today <
      new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate())
        ? 1
        : 0);

    if (age >= 40 && age <= 50) {
      ageScore = 3;
    } else if (age > 50) {
      ageScore = 2;
    } else if (age >= 30 && age < 40) {
      ageScore = 4;
    } else if (age >= 20 && age < 30) {
      ageScore = 1;
    } else {
      ageScore = 0;
    }
  }

  const totalScore =
    (workYearsScore + ageScore + distructAddress + education + isMarriage) *
    4.85;
  return Math.floor(totalScore);
}

function calculateBadQualityCreditHistory(customer) {
  if (!customer.CreditDatabase || !Array.isArray(customer.CreditDatabase)) {
    return 0;
  }

  const now = new Date();
  const filtered = customer.CreditDatabase.filter(
    (item) => new Date(item.paidDate) > now && item.balance > 0
  );

  const length = filtered.length;
  let number = 0;

  if (length >= 5) {
    number = 0;
  } else if (length === 4) {
    number = 1;
  } else if (length === 3) {
    number = 2;
  } else if (length === 2) {
    number = 3;
  } else if (length === 1) {
    number = 4;
  } else {
    number = 5;
  }

  return number * 22;
}

function calculateLoanHistory(customer) {
  if (!customer.CreditDatabase || customer.CreditDatabase.length === 0) {
    return 55;
  }

  let firstDate = new Date(customer.CreditDatabase[0].payDate);
  customer.CreditDatabase.forEach((item) => {
    const payDate = new Date(item.payDate);
    if (payDate < firstDate) {
      firstDate = payDate;
    }
  });

  const now = new Date();
  const diffInMilliseconds = now - firstDate;
  const diffInYears = Math.floor(
    diffInMilliseconds / (1000 * 60 * 60 * 24 * 365.25)
  );

  let number = 0;

  if (diffInYears >= 15) {
    number = 5;
  } else if (diffInYears >= 10) {
    number = 4.5;
  } else if (diffInYears >= 5) {
    number = 4;
  } else if (diffInYears > 0) {
    number = 3;
  } else {
    number = 0;
  }

  return number * 22;
}

function calculateMaxAmount(customer) {
  let salary = 0;
  const months = 30;
  const interestRateMonthly = 0.018;
  const DTI = 0.4;
  let creditAmount = 0;

  if (customer.SocialInsurance && customer.SocialInsurance.length) {
    let sum = 0;
    customer.SocialInsurance.forEach((item) => (sum = sum + item.salaryAmount));

    if (sum > 0) {
      salary = sum / customer.SocialInsurance.length;
    }
  }
  const maxAmount = salary * DTI;

  const discountFactor =
    (1 - Math.pow(1 + interestRateMonthly, -months)) / interestRateMonthly;
  const maxLoanAmount = maxAmount * discountFactor;
  console.log(maxLoanAmount);

  if (customer.CreditDatabase && customer.CreditDatabase.length) {
    const filtered = customer.CreditDatabase.filter(
      (item) => new Date() < new Date(item.paidDate) && item.balance
    );
    filtered.every((item) => (creditAmount += item.balance));
  }

  const onePercent = maxLoanAmount / 100;
  const loanPercent = (100 - creditAmount / onePercent) * 1.375;
  return loanPercent;
}

function calculateDTI(customer, loanRequest) {
  const now = new Date();
  let totalMonthlyPayment = 0;

  // 1. Active loan payments from CreditDatabase
  if (customer.CreditDatabase && Array.isArray(customer.CreditDatabase)) {
    for (const loan of customer.CreditDatabase) {
      const paidDate = new Date(loan.paidDate);
      const balance = loan.balance;

      if (paidDate > now && balance > 0) {
        const months =
          (paidDate.getFullYear() - now.getFullYear()) * 12 +
          (paidDate.getMonth() - now.getMonth());

        if (months > 0) {
          const monthlyPayment = balance / months;
          totalMonthlyPayment += monthlyPayment;
        }
      }
    }
  }

  // 2. Add new loan request monthly payment
  if (loanRequest && loanRequest.Customer) {
    const loanAmount = loanRequest.Customer.LoanAmount || 0;
    const term = loanRequest.Customer.Term || 0;
    const interest = loanRequest.Customer.Interest || 0;

    if (loanAmount > 0 && term > 0) {
      // Simple interest: total = principal + (principal * rate * time)
      const totalRepayment = loanAmount * (1 + (interest * term) / 100);
      const monthlyRepayment = totalRepayment / term;

      totalMonthlyPayment += monthlyRepayment;
    }
  }

  let salary = 0;
  if (customer.SocialInsurance && customer.SocialInsurance.length) {
    let sum = 0;
    customer.SocialInsurance.forEach((item) => (sum = sum + item.salaryAmount));

    if (sum > 0) {
      salary = sum / customer.SocialInsurance.length;
    }
  }

  const dti = (totalMonthlyPayment / salary) * 100;

  console.log(dti);

  if (dti <= 20) return 100 * 1.1;
  else if (dti <= 30) return 80 * 1.1;
  else if (dti <= 40) return 60 * 1.1;
  else if (dti <= 50) return 40 * 1.1;
  else return 20 * 1.1;
}

router.post(
  "/calculateScoring/:customerId/:loanRequestId",
  async (req, res) => {
    try {
      // Populate all necessary fields
      const customer = await CustomerModel.findById(req.params.customerId)
        .populate({
          path: "AddressInformation",
          populate: { path: "district", model: "category" },
        })
        .populate("CreditDatabase")
        .populate("SocialInsurance")
        .populate("CustomerMainInformation");

      const loanRequest = await LoanRequestModel.findById(
        req.params.loanRequestId
      ).populate("Loan");

      if (!customer)
        return res.status(404).json({ message: "Customer not found" });
      if (!loanRequest)
        return res.status(404).json({ message: "Loan request not found" });

      // Scoring calculations
      const customerMainInfoScore =
        calculateScoringByCustomerMainInfo(customer);
      const badQualityCreditHistory =
        calculateBadQualityCreditHistory(customer);
      const loanHistoryScore = calculateLoanHistory(customer);
      const loanAmountScore = calculateMaxAmount(customer, loanRequest);
      const dtiScore = calculateDTI(customer, loanRequest); // assumes returns score, not just percentage

      // Final score calculation
      const totalScore =
        customerMainInfoScore +
        badQualityCreditHistory +
        loanHistoryScore +
        loanAmountScore +
        dtiScore +
        300; // base score

      // Create and save scoring object
      const scoring = new ScoringModel({
        scoring: totalScore,
        customerInfoScore: customerMainInfoScore,
        availableLoanAmount: loanAmountScore,
        paymentHistory: badQualityCreditHistory,
        loanHistoryLength: loanHistoryScore,
        DTI: dtiScore,
        customer: customer._id,
        loanRequest: loanRequest._id,
      });

      await scoring.save();

      // Link scoring to loan request
      loanRequest.Scoring = scoring._id;
      await loanRequest.save();

      return res.status(200).json(scoring);
    } catch (err) {
      console.error("Scoring calculation error:", err);
      return res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
