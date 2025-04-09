const express = require("express");
const EmployeeModel = require("../models/Employee");
const router = express.Router();
const BranchModel = require("../models/Branch");
const RoleModel = require("../models/Role");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

router.get("/", async (req, res) => {
  try {
    const employees = await EmployeeModel.find()
      .populate("role") // Populate the category details
      .populate("branch"); // Populate the requirements;
    if (!employees.length) {
      return res.status(500).json({ message: "There are no employees" });
    }
    res.json(employees);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/register", async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      domain,
      phoneNumber,
      password,
      branchNums,
      roleNums,
    } = req.body;

    if (
      !domain ||
      !phoneNumber ||
      !branchNums ||
      !roleNums ||
      !firstname ||
      !lastname ||
      !password
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingEmployee = await EmployeeModel.findOne({ domain: domain });
    if (existingEmployee) {
      return res.status(400).json({ message: "Employee already exists" });
    }

    const branches = await BranchModel.find({ BranchNum: { $in: branchNums } });
    const roles = await RoleModel.find({ RoleNum: { $in: roleNums } });

    if (branchNums.length !== 0 && branches.length !== branchNums.length) {
      return res.status(404).json({ message: " branches not found" });
    }
    if (roleNums.length !== 0 && roles.length !== roleNums.length) {
      return res.status(404).json({ message: " roles not found" });
    }
    console.log(branchNums.length);
    console.log(roles._id);

    const newEmployee = new EmployeeModel({
      domain,
      phoneNumber,
      firstname,
      lastname,
      password,
      branch: branches.map((branch) => branch._id),
      role: roles.map((role) => role._id),
    });

    const savedEmployee = await newEmployee.save();
    return res.status(201).json(savedEmployee);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { domain, password } = req.body;

    // Validate input
    if (!domain || !password) {
      return res
        .status(400)
        .json({ message: "Domain and password are required" });
    }

    // Find employee by domain
    const employee = await EmployeeModel.findOne({ domain })
      .populate("role") // Populate the category details
      .populate("branch");
    if (!employee) {
      return res.status(400).json({ message: "Employee not found" });
    }

    // Compare passwords
    const isPasswordMatch = await bcrypt.compare(password, employee.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: employee._id,
        domain: employee.domain,
        userName: employee.userName,
      },
      process.env.JWT_SECRET, // Replace with a secure secret key
      { expiresIn: "1h" }
    );

    // Send success response
    res.status(200).json({
      message: "Login successful",
      token,
      user: employee,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
