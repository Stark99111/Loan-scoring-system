const express = require("express");
const RoleModel = require("../models/Role");
const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { RoleName, RoleNum } = req.body;

    const existingRole = await RoleModel.findOne({ RoleName });
    if (existingRole) {
      return res.status(400).json({ message: "Role already exists" });
    }
    const newRole = new RoleModel({ RoleName, RoleNum });
    const savedRole = await newRole.save();
    res.status(201).json(savedRole);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const roles = await RoleModel.find();
    if (!roles.length) {
      return res.status(400).json({ message: "There are no roles" });
    }
    res.json(roles);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
