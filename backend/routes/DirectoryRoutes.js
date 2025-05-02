const express = require("express");
const router = express.Router();
const DirectoryModel = require("../models/PhoneNumberDirectory");

router.get("/", async (req, res) => {
  try {
    const directories = await DirectoryModel.find();
    res.status(200).json(directories);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch directory" });
  }
});

router.get("/checkInfo/:phoneNumber/:idNumber", async (req, res) => {
  try {
    const { phoneNumber, idNumber } = req.params;
    const directory = await DirectoryModel.findOne({
      registrationNumber: idNumber,
    });
    if (!directory) {
      return res.status(200).json({ value: false });
    }
    if (directory.phoneNumber === phoneNumber) {
      return res.status(200).json({ value: true });
    }
    return res.status(200).json({ value: false });
  } catch (e) {
    res.status(500).json({ error: "Failed to check customer information" });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { phoneNumber, idNumber } = req.body;

    const existingDirectory = await DirectoryModel.findOne({
      registrationNumber: idNumber,
    });

    if (existingDirectory) {
      return res
        .status(409)
        .json({ error: "Directory already exists", errorCode: 1001 });
    }

    const newDirectory = new DirectoryModel({
      phoneNumber,
      registrationNumber: idNumber,
    });

    await newDirectory.save();
    res.status(200).json(newDirectory);
  } catch (e) {
    console.error(e); // good to log it for debugging
    res.status(500).json({ error: "Failed to register customer information" });
  }
});

router.post("/register2", async (req, res) => {
  try {
    const customers = req.body; // expecting an array of { phoneNumber, idNumber }

    if (!Array.isArray(customers)) {
      return res
        .status(400)
        .json({ error: "Input must be an array of customers" });
    }

    const inserted = [];
    const skipped = [];

    for (const customer of customers) {
      const { phoneNumber, idNumber } = customer;

      // Skip if missing required fields
      if (!phoneNumber || !idNumber) {
        skipped.push({
          phoneNumber,
          idNumber,
          error: "Missing phoneNumber or idNumber",
          errorCode: 1002,
        });
        continue;
      }

      const existing = await DirectoryModel.findOne({
        registrationNumber: idNumber,
      });

      if (existing) {
        skipped.push({
          phoneNumber,
          idNumber,
          error: "Directory already exists",
          errorCode: 1001,
        });
        continue;
      }

      const newEntry = new DirectoryModel({
        phoneNumber,
        registrationNumber: idNumber,
      });

      await newEntry.save();
      inserted.push(newEntry);
    }

    res.status(200).json({ inserted, skipped });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to register customer information" });
  }
});

module.exports = router;
