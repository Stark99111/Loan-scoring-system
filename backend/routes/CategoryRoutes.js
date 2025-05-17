const express = require("express");
const router = express.Router();
const CategoryModel = require("../models/Category");

router.get("/", async (req, res) => {
  try {
    const categories = await CategoryModel.find();
    if (!categories.length) {
      return res.status(200).json({ message: "There are no categories" });
    }
    res.json(categories);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { CategoryCode, CategoryName, Description, Value } = req.body;

    const existedCategory = await CategoryModel.findOne({
      CategoryCode: CategoryCode,
    });

    if (existedCategory) {
      return res
        .status(500)
        .json({ message: "Category is already registered" });
    }

    if (!CategoryCode || !CategoryName || !Description) {
      return res.status(500).json({ message: "All field is required" });
    }

    const newCategory = new CategoryModel({
      CategoryCode,
      CategoryName,
      Description,
      Value,
    });

    const savedCategory = await newCategory.save();
    return res.status(201).json(savedCategory);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post("register", async (req, res) => {});

module.exports = router;
