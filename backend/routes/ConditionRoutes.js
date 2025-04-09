const express = require("express");
const router = express.Router();
const ConditionModel = require("../models/Condition");

router.get("/", async (req, res) => {
  try {
    const conditions = await ConditionModel.find();
    if (!conditions.length) {
      return res.status(200).json({ message: "There are no conditions" });
    }
    res.json(conditions);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { conditionName, Description } = req.body;

    if (!conditionName || !Description) {
      return res.status(500).json({ message: "All field is required" });
    }
    const existedCondition = await ConditionModel.find({
      conditionName: conditionName,
      Description: Description,
    });

    if (existedCondition.length > 0) {
      return res.status(200).json({ existedCondition });
    }
    const newCondition = new ConditionModel({
      conditionName,
      Description,
    });
    const savedCondition = await newCondition.save();
    return res.status(201).json(savedCondition);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
