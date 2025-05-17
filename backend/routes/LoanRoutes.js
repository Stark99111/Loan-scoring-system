const express = require("express");
const router = express.Router();
const LoanModel = require("../models/Loan");
const RequirementModel = require("../models/Requirement");
const ConditionModel = require("../models/Condition");
const CategoryModel = require("../models/Category");
const CustomerModel = require("../models/Customer");
const mongoose = require("mongoose");
const CreditDatabaseModel = require("../models/CreditDatabase");
const SocialInsuranceModel = require("../models/SocialInsurance");
const LoanRequestModel = require("../models/LoanRequest");

router.get("/", async (req, res) => {
  try {
    const loans = await LoanModel.find()
      .populate("conditions")
      .populate("requirements")
      .populate("bankCategories");
    const unlinkedRequirements = await RequirementModel.find({
      _id: {
        $nin: (
          await LoanModel.find().select("requirements").lean()
        ).flatMap((loan) => loan.requirements),
      },
    });
    const deleteResult = await RequirementModel.deleteMany({
      _id: { $in: unlinkedRequirements.map((req) => req._id) },
    });

    const unlinkedConditions = await ConditionModel.find({
      _id: {
        $nin: (
          await LoanModel.find().select("conditions").lean()
        ).flatMap((loan) => loan.conditions),
      },
    });

    const deleteResultCon = await ConditionModel.deleteMany({
      _id: { $in: unlinkedConditions.map((condition) => condition._id) },
    });

    if (!loans.length) {
      return res.status(200).json({ message: "There are no loans" });
    }
    res.json(loans);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/register", async (req, res) => {
  try {
    const {
      name,
      categoryNums,
      bankCategoryNums,
      reqDescriptions,
      conDescriptions,
      image,
      description,
    } = req.body;

    if (!name || !description || !categoryNums) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingLoan = await LoanModel.findOne({ name, categoryNums });
    if (existingLoan) {
      return res.status(400).json({ message: "Loan already exists" });
    }

    let categories = "";
    let conditions = [];
    let requirements = [];
    let bankCategories = "";
    let status = true;

    categories = await CategoryModel.find({
      CategoryCode: "67571dc27e3de1a6814437df",
    });

    if (!categories) {
      return res.status(404).json({ message: "Some categories not found" });
    }

    if (bankCategoryNums) {
      bankCategories = await CategoryModel.findOne({
        CategoryCode: bankCategoryNums,
      });

      if (!bankCategories) {
        return res.status(404).json({ message: "Bank category not found" });
      }
    }

    if (categoryNums) {
      categories = await CategoryModel.findOne({ CategoryCode: categoryNums });
      if (!categories) {
        return res.status(404).json({ message: "Loan category not found" });
      }
    }

    if (Array.isArray(conDescriptions)) {
      const values = conDescriptions.map((item) => item.value);
      const conditionDescriptions = conDescriptions.map(
        (item) => item.condition
      );

      conditions = await ConditionModel.find({
        conditionName: { $in: values },
        Description: { $in: conditionDescriptions },
      });

      if (conditions.length !== conDescriptions.length) {
        return res.status(404).json({ message: "Some conditions not found" });
      }
    }

    if (Array.isArray(reqDescriptions)) {
      requirements = await RequirementModel.find({
        requirementName: { $in: reqDescriptions },
      });

      if (requirements.length !== reqDescriptions.length) {
        return res.status(404).json({ message: "Some requirements not found" });
      }
    }

    const newLoan = new LoanModel({
      name,
      image,
      description,
      status,
      loanCategories: categories,
      conditions: conditions.map((condition) => condition._id),
      requirements: requirements.map((requirement) => requirement._id),
      bankCategories: bankCategories,
      registeredDate: new Date(),
    });

    const savedLoan = await newLoan.save();
    return res.status(200).json(savedLoan);
  } catch (e) {
    console.error("Error registering loan:", e);
    res
      .status(500)
      .json({ error: "An error occurred while registering the loan" });
  }
});

router.put("/update/:id/:status", async (req, res) => {
  try {
    const {
      name,
      categoryNums,
      bankCategoryNums,
      reqDescriptions,
      conDescriptions,
      description,
      maxAmount,
      term,
      intRate,
    } = req.body;

    const { id, status } = req.params;

    // Check for required fields
    if (!name || !description) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    // Find existing loan
    const existingLoan = await LoanModel.findById(id);
    if (!existingLoan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    // Find loan category
    let categories = existingLoan.loanCategories;
    // if (categoryNums) {
    //   const category = await CategoryModel.findOne({
    //     CategoryCode: categoryNums,
    //   });
    //   if (!category)
    //     return res.status(404).json({ message: "Loan category not found" });
    //   categories = category;
    // }

    // Find bank category
    let bankCategories = existingLoan.bankCategories;
    if (bankCategoryNums) {
      const bankCategory = await CategoryModel.findOne({
        CategoryCode: bankCategoryNums,
      });
      if (!bankCategory)
        return res.status(404).json({ message: "Bank category not found" });
      bankCategories = bankCategory;
    }

    // Process conditions
    let conditions = existingLoan.conditions;
    if (Array.isArray(conDescriptions)) {
      const values = conDescriptions.map((item) => item.value);
      const conditionDescriptions = conDescriptions.map(
        (item) => item.condition
      );
      const foundConditions = await ConditionModel.find({
        conditionName: { $in: values },
        Description: { $in: conditionDescriptions },
      });

      if (foundConditions.length !== conDescriptions.length) {
        return res.status(404).json({ message: "Some conditions not found" });
      }

      conditions = foundConditions.map((c) => c._id);
    }

    // Process requirements
    let requirements = existingLoan.requirements;
    if (Array.isArray(reqDescriptions)) {
      const foundRequirements = await RequirementModel.find({
        requirementName: { $in: reqDescriptions },
      });

      if (foundRequirements.length !== reqDescriptions.length) {
        return res.status(404).json({ message: "Some requirements not found" });
      }

      requirements = foundRequirements.map((r) => r._id);
    }

    // Update loan
    existingLoan.name = name;
    existingLoan.description = description;
    existingLoan.loanCategories = categories;
    existingLoan.bankCategories = bankCategories;
    existingLoan.conditions = conditions;
    existingLoan.requirements = requirements;
    existingLoan.status = status;
    existingLoan.maxAmount = maxAmount ?? existingLoan.maxAmount;
    existingLoan.intRate = intRate ?? existingLoan.intRate;
    existingLoan.term = term ?? existingLoan.term;
    existingLoan.updatedDate = new Date();

    const updatedLoan = await existingLoan.save();
    return res.status(200).json(updatedLoan);
  } catch (e) {
    console.error("Error updating loan:", e);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deleteLoan = await LoanModel.findByIdAndDelete(id);

    if (!deleteLoan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    return res.status(200).json({ message: "Successfully deleted" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/getById", async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ message: "ID is required" });
    }

    const loans = await LoanModel.find({ _id: id }).select("-image");
    if (!loans.length) {
      return res.status(200).json({ message: "There are no loans" });
    }

    const requirements = await Promise.all(
      loans.flatMap(
        (item) =>
          item.requirements?.map(
            async (reqItem) => await RequirementModel.findById(reqItem._id)
          ) || []
      )
    );

    const conditions = await Promise.all(
      loans.flatMap(
        (item) =>
          item.conditions?.map(
            async (conItem) => await ConditionModel.findById(conItem._id)
          ) || []
      )
    );

    // Filter out any null or undefined results (e.g., if a requirement doesn't exist)
    const validRequirements = requirements.filter((req) => req);
    const validConditions = conditions.filter((req) => req);

    res.json({
      loans,
      requirements: validRequirements,
      conditions: validConditions,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/changeStatus", async (req, res) => {
  try {
    const { id, status } = req.body;
    const updatedLoan = await LoanModel.findByIdAndUpdate(
      id,
      { status: status },
      { new: true }
    );
    if (!updatedLoan) {
      return res.status(200).json({ message: "There are no loan" });
    }

    return res.json(updatedLoan);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/getByCategory/:CategoryCode", async (req, res) => {
  const { CategoryCode } = req.params;

  try {
    // Find the category by name
    const category = await CategoryModel.findOne({
      CategoryCode: CategoryCode,
    });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    // Find loans with the matched category ID and populate related fields
    const loans = await LoanModel.find({ categories: category._id })
      .populate("categories") // Populate the category details
      .populate("requirements") // Populate the requirements
      .populate("conditions"); // Populate the conditions

    if (!loans || loans.length === 0) {
      return res
        .status(404)
        .json({ error: "No loans found for this category" });
    }

    res.status(200).json(loans);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch loans" });
  }
});

router.get("/customers/calculate/:id/:type", async (req, res) => {
  const { id, type } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    // Convert type to a number
    const operationType = parseInt(type, 10);

    if (operationType === 1) {
      const result = await CustomerModel.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(id), // Match customer by ID
          },
        },
        {
          $addFields: {
            age: {
              $divide: [
                { $subtract: [new Date(), "$bornDate"] },
                1000 * 60 * 60 * 24 * 365.25, // Convert milliseconds to years
              ],
            },
          },
        },
        {
          $project: {
            _id: 0, // Exclude the _id field
            isAbove18: { $gte: ["$age", 18] }, // Check if age is >= 18
          },
        },
      ]);

      if (!result || result.length === 0) {
        return res.status(404).json({ error: "Customer not found" });
      }

      return res.json(result[0]); // Return age calculation result
    } else if (operationType === 2) {
      const twoYearsAgo = new Date();
      twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);

      // Find CreditDatabase by customerId (id)
      const customer = await CustomerModel.findById(id).populate(
        "CreditDatabase"
      );

      if (!customer) {
        return res.status(404).json({ error: "Customer not found" });
      }

      const creditDatabase = customer.CreditDatabase;

      // Check if CreditDatabase exists
      if (!creditDatabase) {
        return res.json({
          isPaidInLastTwoYears: false, // No CreditDatabase, default to false
        });
      }

      // Perform aggregation on CreditDatabase
      const result = await CreditDatabaseModel.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(creditDatabase._id), // Match by CreditDatabase ID
          },
        },
        {
          $addFields: {
            isPaidInLastTwoYears: {
              $cond: {
                if: {
                  $and: [
                    { $gte: ["$paidDate", twoYearsAgo] }, // After two years ago
                    { $lte: ["$paidDate", new Date()] }, // Before now
                  ],
                },
                then: true,
                else: false,
              },
            },
          },
        },
        {
          $project: {
            isPaidInLastTwoYears: 1,
          },
        },
      ]);

      // If no matching record is found in aggregation
      if (!result || result.length === 0) {
        return res.json({
          isPaidInLastTwoYears: false,
        });
      }

      return res.json(result[0]); // Send the response with the result
    } else if (operationType === 3) {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      // Find the customer and populate SocialInsurance
      const customer = await CustomerModel.findById(id).populate(
        "SocialInsurance"
      );

      if (!customer) {
        return res.status(404).json({ error: "Customer not found" });
      }

      // Check if any SocialInsurance payments are within the last 6 months
      const result = await SocialInsuranceModel.aggregate([
        {
          $match: {
            _id: { $in: customer.SocialInsurance }, // Match SocialInsurance IDs for this customer
            paidDate: { $gte: sixMonthsAgo }, // Filter by paidDate within last 6 months
          },
        },
        {
          $count: "paymentsInLast6Months", // Count matching records
        },
      ]);

      // Determine if any payments were made
      const isPaidInLast6Months =
        result.length > 0 && result[0].paymentsInLast6Months > 0;

      return res.json({
        isPaidInLast6Months: isPaidInLast6Months,
      });
    } else if (operationType === 4) {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      try {
        const result = await CustomerModel.aggregate([
          {
            $match: {
              _id: new mongoose.Types.ObjectId(id), // Match the customer by ID
            },
          },
          {
            $lookup: {
              from: "socialinsurances", // Collection name for SocialInsurance
              localField: "SocialInsurance",
              foreignField: "_id",
              as: "socialInsuranceDetails",
            },
          },
          {
            $unwind: "$socialInsuranceDetails", // Decompose the SocialInsurance array
          },
          {
            $match: {
              "socialInsuranceDetails.paidDate": { $gte: sixMonthsAgo }, // Filter by last 6 months
            },
          },
          {
            $group: {
              _id: "$_id", // Group by the customer ID
              uniqueInstitutes: {
                $addToSet: "$socialInsuranceDetails.institute",
              }, // Collect unique institutes
            },
          },
          {
            $project: {
              _id: 0, // Exclude the ID from the response
              isSameInstitute: {
                $eq: [{ $size: "$uniqueInstitutes" }, 1], // Check if only one unique institute exists
              },
            },
          },
        ]);

        // Handle no records found
        if (!result || result.length === 0) {
          return res.json({
            isSameInstitute: false,
            message: "No social insurance data found in the last 6 months",
          });
        }

        // Send the result
        return res.json(result[0]);
      } catch (error) {
        console.error("Error calculating social insurance:", error.message);
        return res.status(500).json({ error: "Internal server error" });
      }
    } else {
      return res.status(400).json({
        error:
          "Invalid type provided. Use type 1 for age calculation and type 2 for paidDate check.",
      });
    }
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Failed to perform the calculation" });
  }
});

router.post("/:loanId/add-requirement", async (req, res) => {
  const { loanId } = req.params;
  const { requirementName, requirementCode } = req.body;

  try {
    // Validate loan ID
    if (!mongoose.Types.ObjectId.isValid(loanId)) {
      return res.status(400).json({ error: "Invalid Loan ID" });
    }

    // Validate input
    if (!requirementName) {
      return res.status(400).json({ error: "Requirement name is required" });
    }

    // Create a new requirement
    const newRequirement = new RequirementModel({
      requirementName,
      requirementCode,
    });

    await newRequirement.save();

    // Add the requirement to the loan
    const loan = await LoanModel.findById(loanId);

    if (!loan) {
      return res.status(404).json({ error: "Loan not found" });
    }

    loan.requirements.push(newRequirement._id);
    await loan.save();

    res.status(200).json({
      message: "Requirement added successfully",
      loan,
      newRequirement,
    });
  } catch (error) {
    console.error("Error adding requirement:", error.message);
    res.status(500).json({ error: "Failed to add requirement" });
  }
});

router.delete("/requirement/:requirementId", async (req, res) => {
  const { requirementId } = req.params;

  try {
    // Validate requirement ID
    if (!mongoose.Types.ObjectId.isValid(requirementId)) {
      return res.status(400).json({ error: "Invalid Requirement ID" });
    }

    // Delete the requirement
    const deletedRequirement = await RequirementModel.findByIdAndDelete(
      requirementId
    );

    if (!deletedRequirement) {
      return res.status(404).json({ error: "Requirement not found" });
    }

    // Remove the requirement from all loans
    await LoanModel.updateMany(
      { requirements: requirementId },
      { $pull: { requirements: requirementId } }
    );

    res.status(200).json({
      message: "Requirement deleted successfully",
      deletedRequirement,
    });
  } catch (error) {
    console.error("Error deleting requirement:", error.message);
    res.status(500).json({ error: "Failed to delete requirement" });
  }
});

router.put("/requirement/:requirementId", async (req, res) => {
  const { requirementId } = req.params;
  const { requirementName, requirementCode } = req.body;

  try {
    // Validate requirement ID
    if (!mongoose.Types.ObjectId.isValid(requirementId)) {
      return res.status(400).json({ error: "Invalid Requirement ID" });
    }

    // Update the requirement
    const updatedRequirement = await RequirementModel.findByIdAndUpdate(
      requirementId,
      { requirementName, requirementCode },
      { new: true, runValidators: true } // Return the updated document
    );

    if (!updatedRequirement) {
      return res.status(404).json({ error: "Requirement not found" });
    }

    res.status(200).json({
      message: "Requirement updated successfully",
      updatedRequirement,
    });
  } catch (error) {
    console.error("Error updating requirement:", error.message);
    res.status(500).json({ error: "Failed to update requirement" });
  }
});

router.delete("/requirement/delete/:id", async (req, res) => {
  try {
    const requirementId = req.params.id;

    const result = await LoanModel.updateMany(
      { requirements: requirementId }, // бүх requirements агуулсан зээлүүдийг хайх
      { $pull: { requirements: requirementId } } // requirements-оос id-г устгах
    );

    res.status(200).json({
      message: "Requirement removed from loans",
      result,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/checkLoanRequirements/:loanRequestId", async (req, res) => {
  try {
    const loanRequestId = req.params.loanRequestId;
    const userId = req.body.userId;

    const customer = await CustomerModel.findById(userId)
      .populate("AddressInformation")
      .populate("CreditDatabase")
      .populate("SocialInsurance")
      .populate("CustomerMainInformation");

    if (!customer) {
      return res.status(404).json("Customer not found!");
    }

    const loanRequest = await LoanRequestModel.findById(loanRequestId)
      .populate("Scoring")
      .populate({
        path: "Loan",
        populate: [{ path: "requirements" }, { path: "conditions" }],
      });

    if (!loanRequest) {
      return res.status(400).json("Loan request not found");
    }

    const loan = loanRequest.Loan;

    if (!loan) {
      return res.status(404).json("Loan not found!");
    }

    if (!Array.isArray(loan.requirements) || loan.requirements.length === 0) {
      return res
        .status(404)
        .json({ message: "Зээлийн шаардлагууд олдсонгүй!" });
    }

    const requirements = loan.requirements;
    let returnValue = [];

    for (const element of requirements) {
      switch (element.requirementCode) {
        case "1": {
          const bornDate = customer.CustomerMainInformation?.bornDate;
          if (bornDate) {
            const birthDate = new Date(bornDate);
            const age = new Date().getFullYear() - birthDate.getFullYear();
            const isAdult =
              age > 18 ||
              (age === 18 && new Date().getMonth() >= birthDate.getMonth());
            returnValue.push({
              id: element._id,
              requirement: element.requirementName,
              value: isAdult,
            });
          } else {
            returnValue.push({
              id: element._id,
              requirement: element.requirementName,
              value: false,
            });
          }
          break;
        }
        case "2": {
          const count = (customer.SocialInsurance || []).filter(
            (item) => item.institute === "ГОЛОМТБАНК" && item.salaryAmount > 0
          ).length;

          returnValue.push({
            id: element._id,
            requirement: element.requirementName,
            value: count > 1, // Must be more than 1 month
          });
          break;
        }
        case "3": {
          const now = new Date();
          const twoYearsAgo = new Date();
          twoYearsAgo.setFullYear(now.getFullYear() - 2);

          const hasNoOverdueBalance = !(customer.CreditDatabase || []).some(
            (item) => new Date(item.paidDate) < now && item.balance > 0
          );

          const hasNoRecentNonPerformingLoan = !(
            customer.CreditDatabase || []
          ).some(
            (item) =>
              item.isNonPerforming && new Date(item.payDate) >= twoYearsAgo
          );

          returnValue.push({
            id: element._id,
            requirement: element.requirementName,
            value: hasNoOverdueBalance && hasNoRecentNonPerformingLoan,
          });
          break;
        }
        case "4": {
          const ficoScore = loanRequest.Scoring?.scoring || 0;
          returnValue.push({
            id: element._id,
            requirement: element.requirementName,
            value: ficoScore >= 640,
          });
          break;
        }
        default:
          break;
      }
    }

    return res.status(200).json(returnValue);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Server error" });
  }
});

router.get("/getActiveLoanDetails/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    const customer = await CustomerModel.findById(userId).populate(
      "CreditDatabase"
    );

    if (!customer) {
      return res.status(404).json("Customer not found!");
    }
    if (!customer.CreditDatabase) {
      return res.status(200).json(null);
    }

    const now = new Date();
    const creditdata = customer.CreditDatabase.filter(
      (item) => item.paidDate > now && item.balance
    );
    return res.status(200).json(creditdata);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Server error" });
  }
});

router.get("/getCustomerFinancialInformation/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    const customer = await CustomerModel.findById(userId)
      .populate("AddressInformation")
      .populate("CreditDatabase")
      .populate("SocialInsurance")
      .populate("CustomerMainInformation");

    if (!customer) {
      return res.status(404).json("Customer not found!");
    }

    let totalSalary = 0;
    let dti = 0;
    let activeLoans = 0;
    let scoring = 0;
    if (customer.SocialInsurance) {
      let amount = 0;
      await customer.SocialInsurance.map(
        (item) => (amount += item.salaryAmount)
      );
      totalSalary = amount / customer.SocialInsurance.length;
    }
    if (customer.CreditDatabase) {
      const now = new Date();
      customer.CreditDatabase.filter(
        (item) => item.paidDate > now && item.balance
      ).map((item) => (activeLoans += item.balance));
    }
    if (customer.Scoring) {
      scoring = customer.Scoring.scoring;
      dti = customer.Scoring.DTI;
    }
    return res.status(200).json({
      totalSalary: totalSalary,
      dti: dti,
      activeLoans: activeLoans,
      scoring: scoring,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
