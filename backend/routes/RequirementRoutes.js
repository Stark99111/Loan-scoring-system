const express = require("express");
const router = express.Router();
const RequirementModel = require("../models/Requirement");

router.get("/", async (req, res) => {
  try {
    const requirements = await RequirementModel.find();
    if (!requirements.length) {
      return res.status(200).json({ message: "There are no requirements" });
    }
    res.json(requirements);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/getById", async (req, res) => {
  try {
    const { id } = req.body;
    const requirements = await RequirementModel.findById(id);
    if (!requirements) {
      return res.status(200).json({ message: "There are no requirements" });
    }
    res.json(requirements);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { requirementName } = req.body;

    if (!requirementName) {
      return res.status(500).json({ message: "All field is required" });
    }
    const existedRequirement = await RequirementModel.find({
      requirementName: requirementName,
    });
    if (existedRequirement.length > 0) {
      return res.status(200).json({ existedRequirement });
    }

    const newRequirement = new RequirementModel({
      requirementName,
    });
    const savedRequirement = await newRequirement.save();
    return res.status(201).json(savedRequirement);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/addRequirementCode", async (req, res) => {
  try {
    const { id, code } = req.body;
    const updatedRequirement = await RequirementModel.findByIdAndUpdate(
      id,
      { requirementCode: code },
      { new: true }
    );
    if (!updatedRequirement) {
      return res.status(200).json({ message: "There are no requirement" });
    }
    return res.json(updatedRequirement);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
