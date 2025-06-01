const express = require("express");
const EmployeeModel = require("../models/Employee");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

router.get("/", async (req, res) => {
  try {
    const employees = await EmployeeModel.find();
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
    const { userName, domain, userRole, password } = req.body;

    if (!domain || !userName || !userRole || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingEmployee = await EmployeeModel.findOne({ domain: domain });
    if (existingEmployee) {
      return res.status(400).json({ message: "Employee already exists" });
    }

    const newEmployee = new EmployeeModel({
      userName,
      domain,
      userRole,
      password,
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
    const employee = await EmployeeModel.findOne({ domain });
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

router.put("/updatePassword", async (req, res) => {
  try {
    const { domain, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    await EmployeeModel.updateOne(
      { domain },
      { $set: { password: hashedPassword } }
    );

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/get", (req, res) => {
  res.status(200).send("Hello world");
});

module.exports = router;
