const express = require("express");
const BranchModel = require("../models/Branch");
const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { BranchName, BranchNum } = req.body;

    const existingBranch = await BranchModel.findOne({ BranchName });
    if (existingBranch) {
      return res.status(500).json({ message: "Branch already exists" });
    }
    const newBranch = new BranchModel({ BranchName, BranchNum });
    const savedBranch = await newBranch.save();
    res.status(201).json(savedBranch);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const branches = await BranchModel.find();
    if (!branches.length) {
      return res.status(400).json({ message: "There are no branches" });
    }
    res.json(branches);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
