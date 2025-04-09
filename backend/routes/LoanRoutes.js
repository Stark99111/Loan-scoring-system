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

router.get("/", async (req, res) => {
  try {
    const loans = await LoanModel.find();
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
      reqDescriptions,
      conDescriptions,
      image,
      description,
    } = req.body;

    // Check for required fields
    if (!name || !description || !categoryNums) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if the loan already exists
    const existingLoan = await LoanModel.findOne({ name });
    if (existingLoan) {
      return res.status(400).json({ message: "Loan already exists" });
    }

    let categories = [];
    let conditions = [];
    let requirements = [];

    // Fetch categories by categoryNums
    if (categoryNums) {
      categories = await CategoryModel.find({
        CategoryCode: categoryNums,
      });

      if (!categories) {
        return res.status(404).json({ message: "Some categories not found" });
      }
    }

    // Fetch conditions based on conDescriptions
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

    // Fetch requirements based on reqDescriptions
    if (Array.isArray(reqDescriptions)) {
      requirements = await RequirementModel.find({
        requirementName: { $in: reqDescriptions },
      });

      if (requirements.length !== reqDescriptions.length) {
        return res.status(404).json({ message: "Some requirements not found" });
      }
    }

    // Create new loan
    const newLoan = new LoanModel({
      name,
      image,
      description,
      categories: categories.map((category) => category._id),
      conditions: conditions.map((condition) => condition._id),
      requirements: requirements.map((requirement) => requirement._id),
    });

    // Save new loan to the database
    const savedLoan = await newLoan.save();
    return res.status(200).json(savedLoan);
  } catch (e) {
    console.error("Error registering loan:", e); // Log error for debugging
    res
      .status(500)
      .json({ error: "An error occurred while registering the loan" });
  }
});

router.post("/getById", async (req, res) => {
  try {
    const { id } = req.body; // It's better to use req.query or req.params for GET requests
    if (!id) {
      return res.status(400).json({ message: "ID is required" });
    }

    const loans = await LoanModel.find({ _id: id });
    if (!loans.length) {
      return res.status(200).json({ message: "There are no loans" });
    }

    // Collect requirements using a Promise.all to handle asynchronous operations
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

    console.log("Loan status updated successfully:", updatedLoan);
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
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    // Convert type to a number
    const operationType = parseInt(type, 10);

    if (operationType === 1) {
      // Calculate age
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

module.exports = router;
