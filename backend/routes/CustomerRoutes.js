const express = require("express");
const router = express.Router();
const CustomerAddressModel = require("../models/CustomerAddress");
const CustomerModel = require("../models/Customer");
const CreditDatabaseModel = require("../models/CreditDatabase");
const SocialInsuranceModel = require("../models/SocialInsurance");
const CustomerMainInformationModel = require("../models/CustomerMainInformation");
const LoanInstitutionRequestHistoryModel = require("../models/LoanInstitution");
const DirectoryModel = require("../models/PhoneNumberDirectory");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Scoring = require("../models/Scoring");

router.get("/getAll", async (req, res) => {
  try {
    const customers = await CustomerModel.find()
      .populate("AddressInformation")
      .populate("CreditDatabase")
      .populate("SocialInsurance")
      .populate("CustomerMainInformation")
      .populate("LoanInstitutionRequestHistory")
      .populate("Scoring");

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
      .populate("CustomerMainInformation")
      .populate("LoanInstitutionRequestHistory")
      .populate("Scoring");
    if (!populatedCustomer) {
      return res.status(200).json(null);
    }
    console.log(populatedCustomer);

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
      .populate("AddressInformation")
      .populate("CreditDatabase")
      .populate("SocialInsurance")
      .populate("CustomerMainInformation")
      .populate("LoanInstitutionRequestHistory")
      .populate("Scoring");

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

    // LoanInstitutionRequestHistory
    if (Array.isArray(customerData.LoanInstitutionRequestHistory)) {
      const historyIds = [];
      for (const history of customerData.LoanInstitutionRequestHistory) {
        if (history._id) {
          const updated =
            await LoanInstitutionRequestHistoryModel.findByIdAndUpdate(
              history._id,
              history,
              { new: true }
            );
          historyIds.push(updated._id);
        } else {
          const created = await LoanInstitutionRequestHistoryModel.create(
            history
          );
          historyIds.push(created._id);
        }
      }
      customer.LoanInstitutionRequestHistory = historyIds;
    }

    await customer.save();

    const populatedCustomer = await CustomerModel.findById(customer._id)
      .populate("AddressInformation")
      .populate("CreditDatabase")
      .populate("SocialInsurance")
      .populate("CustomerMainInformation")
      .populate("LoanInstitutionRequestHistory");

    return res.status(200).json(populatedCustomer);
  } catch (e) {
    console.error("Error updating customer main information:", e);
    return res.status(500).json({ error: "Internal server error" });
  }
});

function monthsBetween(start, end) {
  const d1 = new Date(start);
  const d2 = new Date(end);
  return (
    (d2.getFullYear() - d1.getFullYear()) * 12 + d2.getMonth() - d1.getMonth()
  );
}

router.post("/calculateScoring/:customerId", async (req, res) => {
  try {
    const customer = await CustomerModel.findById(req.params.customerId)
      .populate("AddressInformation")
      .populate("CreditDatabase")
      .populate("SocialInsurance")
      .populate("CustomerMainInformation")
      .populate("LoanInstitutionRequestHistory");
    if (!customer)
      return res.status(404).json({ message: "Customer not found" });

    const creditData = customer.CreditDatabase || [];
    const loanRequests = customer.LoanInstitutionRequestHistory || [];
    const incomeHistory = customer.SocialInsurance || [];

    // 1. Зээлийн түүх: зээлийн тоо
    const loanHistory = creditData.length;

    // 2. Одоогийн өрийн хэмжээ: төлөгдөөгүй зээлийн үлдэгдэл
    const unpaidLoans = creditData.filter((cd) => cd.balance);
    const totalDebt = unpaidLoans.reduce(
      (sum, loan) => sum + (loan.balance || 0),
      0
    );

    // 3. Түүхийн урт: хамгийн эхний зээлээс өнөөдрийг хүртэлх сар
    let loanHistoryLength = 0;
    if (creditData.length > 0) {
      const earliest = creditData.reduce((min, cur) =>
        new Date(cur.payDate) < new Date(min.payDate) ? cur : min
      );
      loanHistoryLength = monthsBetween(earliest.payDate, new Date());
    }

    // 4. Шинэ зээлийн хүсэлтүүд: сүүлийн 6 сард
    const now = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(now.getMonth() - 6);
    const newLoanRequests = loanRequests.filter(
      (r) => new Date(r.date) >= sixMonthsAgo
    ).length;

    // 5. DTI = нийт өр / дундаж цалин
    const averageIncome = incomeHistory.length
      ? incomeHistory.reduce((sum, rec) => sum + (rec.salaryAmount || 0), 0) /
        incomeHistory.length
      : 1000000;
    const DTI = totalDebt / averageIncome;

    const maxLoanHistory = 10; 
    const maxDebt = 50000000; 
    const maxLoanLength = 60; 
    const maxNewRequests = 10;
    const maxDTI = 2; 

    const normalizedLoanHistory = Math.min(loanHistory / maxLoanHistory, 1);
    const normalizedDebt = 1 - Math.min(totalDebt / maxDebt, 1); 
    const normalizedLoanLength = Math.min(loanHistoryLength / maxLoanLength, 1);
    const normalizedNewRequests =
      1 - Math.min(newLoanRequests / maxNewRequests, 1);
    const normalizedDTI = 1 - Math.min(DTI / maxDTI, 1);

    const score =
      normalizedLoanHistory * 0.35 +
      normalizedDebt * 0.3 +
      normalizedLoanLength * 0.15 +
      normalizedNewRequests * 0.1 +
      normalizedDTI * 0.1;

    const ficoScore = Math.round(300 + score * 550); 

    const scoring = new Scoring({
      scoring: ficoScore,
      loanHistory: normalizedLoanHistory * 0.35 * 550,
      availableLoanAmount: normalizedDebt * 0.3 * 550,
      loanHistoryLength: normalizedLoanLength * 0.15 * 550,
      newLoanRequests: normalizedNewRequests * 0.1 * 550,
      DTI: normalizedDTI * 0.1 * 550,
    });
    customer.Scoring = scoring;
    await customer.save();
    await scoring.save();

    return res.status(200).json(scoring);
  } catch (err) {
    console.error("Scoring calculation error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
